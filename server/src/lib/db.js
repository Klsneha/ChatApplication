import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.DATABASE_URI || "");
    console.log("Mongo Db Connected", con.connection.host);
  }  catch (error) {
    console.log("Database Conncetion error", error);
  }
};