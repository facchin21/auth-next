import { connectDB } from "@/libs/mongodb";
import { NextRequest } from "next/server";

export async function POST() {
    try {
        await connectDB();

        return NextRequest.json({
            message: 'Connected to MongoDB'
        });
    } catch (Error) {
        console.log('Error connecting to MongoDB');
    }
}
