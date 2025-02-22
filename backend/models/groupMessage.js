import mongoose from "mongoose";

const groupMessage = new mongoose.Schema({

    groupConversationId:{type:mongoose.Schema.Types.ObjectId,ref:"GroupConversation"},

    groupMessage:{
        type:String
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,ref:"User"
    }


},{timestamps:true})

export const GroupMessage = mongoose.model("GroupMessage",groupMessage)