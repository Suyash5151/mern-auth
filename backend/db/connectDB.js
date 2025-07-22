import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
export const connectDB= async ()=>{
    console.log("Mongo URI:", process.env.MONGO_URI);

    try{
       

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDb connected: ${conn.connection.host}`);

    }
    catch(error){
        console.log(`Couldnt connect to MongoDb:${error.message}`);
        process.exit(1);
    }

};