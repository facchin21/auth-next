import mongoose from "mongoose";

const MONGO_URL = "mongodb://localhost:27017/auth-next";

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.log(error);
  }
};
