import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
    From:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    To:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:String,
    read:{
        type:String,
        default:false
    }
},{timestamps:true})

export const Notification = mongoose.model("Notification",notificationSchema)