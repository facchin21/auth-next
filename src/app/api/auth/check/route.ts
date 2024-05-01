import { message } from "@/utils/message";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { connectDB } from "@/libs/mongodb";
import User from "@/models/User";

export async function GET() {
    try{
        const headerList = headers()
        const token = headerList.get("token")

        // Valido que alla token
        if(!token){
            return NextResponse.json(
                {message: message.error.tokenNotFound},
                {status: 401}
            )
        }

        try{
            const isTokenValid = jwt.verify(token, "secreto")
            // @ts-ignore
            const { data } = isTokenValid;
            
            await connectDB()
            const userFind = await User.findById(data._id)

            // Verificamos que exista el usuario
            if(!userFind){
                return NextResponse.json(
                    {message: message.error.userNotFound},
                    {status: 401}
                )
            }

            return NextResponse.json(
                {   isAuthorized: true,
                    message : message.success.authorized
                },
                {status: 200}
            )


        }catch(error){
            return NextResponse.json(
                {message: message.error.invalidToken},
                {status: 401}
            )
        }
    }catch(error){
        return NextResponse.json(
            {message: message.error.default},
            {status: 500}
        )
    }
}