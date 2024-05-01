import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/libs/mongodb";
import { message } from "@/utils/message";
import User from "@/models/User";

export async function GET(request : NextRequest){
    try{
        await connectDB()
        const users = await User.find()

        return NextResponse.json(
            {users},
            {status: 200}
        )
    }catch(error){
        return NextResponse.json(
            {message: message.error.default},
            {status: 500}
        )
    }
}