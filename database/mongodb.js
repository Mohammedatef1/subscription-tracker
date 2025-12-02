import mongoose from "mongoose";
import { DB_URI } from "../config/env.js";

if (!DB_URI) {
  throw new Error('please provide the database uri')
}

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI)
  } catch (error) {
    console.log('Error connecting to database, ', error)
    process.exit(1)
  } 
}
