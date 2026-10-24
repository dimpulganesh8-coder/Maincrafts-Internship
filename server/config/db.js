import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mern_product_db";
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ Warning: Could not connect to MongoDB at ${uri}.`);
    console.warn(`👉 Detail: ${error.message}`);
    console.log("ℹ️ If you do not have MongoDB running locally, set MONGO_URI in server/.env with your MongoDB Atlas connection string.");
    return false;
  }
};
