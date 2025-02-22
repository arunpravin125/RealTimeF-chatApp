import mongoose from "mongoose";

export const databaseConnect = ()=>{
   try {
     mongoose.connect(process.env.MONGO_URL)
     console.log("mongoose connected :)")
   } catch (error) {
    console.log("error in mongoose connection",error)
   }
}