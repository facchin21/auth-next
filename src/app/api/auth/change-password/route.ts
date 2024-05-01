import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import { message } from "@/utils/message";
import { headers } from "next/headers";
import User from "@/models/User";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface BodyProps {
    newPassword: string
    confirmPassword: string
}
export async function POST(request: NextRequest) {
    try{

        const body: BodyProps = await request.json();
        
        const { newPassword, confirmPassword } = body;

        // Validamos que existan los campos
        if(!newPassword || !confirmPassword){
            return NextResponse.json(
                {message: message.error.needProps},
                {status: 400}
            )
        }

        await connectDB();

        const headersList = headers()
        const token = headersList.get("token");

        // Verificamos que exista el token
        if(!token){
            return NextResponse.json(
                {message: message.error.invalidToken},
                {status: 401}
            )
        }

        try{
            const isTokenValid = jwt.verify(token, "secreto");
            
            // @ts-ignore
            const { data } = isTokenValid

            const userFind = await User.findById(data.userId)

            // Validamos que exista el usuario
            if(!userFind){
                return NextResponse.json(
                    {message: message.error.userNotFound},
                    {status: 404}
                )
            }
            
            // Validamos que la nueva contraseña sea igual a la confirmacion
            if(newPassword !== confirmPassword){
                return NextResponse.json(
                    {message: message.error.passwordNotMatch},
                    {status: 400}
                )
            }

            const hashedPassword = await bcrypt.hash(newPassword, 12);

            userFind.password = hashedPassword;
            await userFind.save();

            return NextResponse.json(
                {message: message.success.passwordChanged},
                {status: 200}
            )
        }catch(error){
            return NextResponse.json(
                {message: message.error.invalidToken},
                {status: 401}
            )
        }
    }catch(Error){
        return NextResponse.json(
            {message: message.error.default},
            {status: 404}
        )
    }
}