import mongoose from "mongoose";

const groupConversationSchema =new mongoose.Schema({
    participants:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    groupCreatedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    groupName:{
        type:String,
        default:"group"
    },
    description:{
        type:String
    }
},{timestamps:true})

export const GroupConversation = mongoose.model("GroupConversation",groupConversationSchema)
