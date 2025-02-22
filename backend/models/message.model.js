
import mongoose from "mongoose"


const messageSchema = new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation"
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    message:{
       
        senderId:{
            type:String,
           
        },
        recipientId:{
             type:String,
           
        },
        text:String
    },
    seen:{
        type:Boolean,
        default:false
    }

},{timestamps:true})

export const Message = mongoose.model("Message",messageSchema)