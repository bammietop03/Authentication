import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DB_URL;

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(dbUrl);
    console.log(`Connected to the database: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting to the database", error.message);
    process.exit(1);
  }
};
