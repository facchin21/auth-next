import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import { message } from "@/utils/message";
import { Resend } from "resend";
import jwt from 'jsonwebtoken';
import User from "@/models/User";

const resend = new Resend("re_MnoWo8ZV_AJKWrty4bRgWsNMENjXrJtG2");

export async function POST( request: NextRequest) {
    try{
        const body : {email : string} = await request.json();

        const {email} = body

        await connectDB();

        const userFind = await User.findOne({email})

        // Validamos que existe el usuario por el correo
        if(!userFind){
            return NextResponse.json(
                {message: message.error.userNotFound},
                {status: 404}
            )
        }

        const tokenData = {
            email: userFind.email,
            userId: userFind._id
        }

        const token = jwt.sign({data: tokenData}, "secreto",{
            expiresIn: 86400 // 24 horas   
        })

        const forgetUrl = `http://localhost:3000/change-password?token=+token=${token}`;
        
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Recuperar contraseña",
            html: `<a href="${forgetUrl}">Recuperar contraseña</a>`
        })

        return NextResponse.json(
            {message: message.success.emailSent},
            {status: 200}
        )
    }catch(Error){
        console.log('Error connecting to MongoDB');
        return NextResponse.json(
            {message: message.error.default},
            {status: 500}
        )
    }
}