import { connectDB } from "@/libs/mongodb";
import User, { IUserSchema } from "@/models/User";
import { isvalidEmail } from "@/utils/isValid";
import { message } from "@/utils/message";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try{
        await connectDB();

        const body = await request.json();
        const { email, password, confirmPassword } = body;

        // Validar que esten todos los campos enviados
        if(!email || !password || !confirmPassword){
            return NextResponse.json(
                {
                    message: message.error.needProps
                },
                {
                    status: 404
                }
        )
        }

        // Validar si el email es un email
        if(!isvalidEmail(email)){
            return NextResponse.json(
                {
                    message: message.error.invalidEmail
                },
                {
                    status: 404
                }
            )
        }
        // Valido que las contraseñas sean iguales
        if(password !== confirmPassword){
            return NextResponse.json(
                {
                    message: message.error.passwordNotMatch
                },
                 {
                status: 404
            })
        }

        const userFind = await User.findOne({ email})
        
        // Valido si el usuario existe
        if(userFind){
            return NextResponse.json(
                {
                    message: message.error.userExist
                },
                {
                    status: 404
                }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser : IUserSchema = new User({
            email,
            password: hashedPassword,
        });

        const {password: userPass , ...rest } = newUser._doc;

        await newUser.save();

        const token = jwt.sign({data: rest}, "secreto", {
            expiresIn : 86400
        })

        const response = NextResponse.json({
            newUser: rest,
            message: message.success.userCreatted,
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