import { connectDB } from "@/libs/mongodb";
import User, { IUser } from "@/models/User";
import { message } from "@/utils/message";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(request : NextRequest) {
    try{
        await connectDB();

        const body: IUser = await request.json();
        const { email, password } = body;

        // Validamos que se envien todos los campos
        if(!email || !password){
            return NextResponse.json(
                {message: message.error.needProps},
                {status: 400}
            )
        }
        const userFind = await User.findOne({email})

        // Validamos que existe el usuario por el correo
        if(!userFind){
            return NextResponse.json(
                {message: message.error.userNotFound},
                {status: 404}
            )
        }

        const isCorrect : boolean = await bcrypt.compare(
            password,
            userFind.password
        )
        // Validamos si la contrasenia es correcta
        if(!isCorrect){
            return NextResponse.json(
                {message: message.error.invalidPassword},
            )
        }

        const { password: userPass, ...rest } = userFind._doc;

        const token = jwt.sign({data: rest}, "secreto",{
            expiresIn: 86400 // 24 horas   
        })

        const response = NextResponse.json({
            newUser: rest,
            message: message.success.userLogged,
        },{
            status: 200
        })

        response.cookies.set("auth_cookie", token, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400,
            path: "/",
        });

        return response;
    }catch(Error){
        console.log('Error connecting to MongoDB');
        return NextResponse.json(
            {message: message.error.default},
            {status: 500}
        )
    }
}