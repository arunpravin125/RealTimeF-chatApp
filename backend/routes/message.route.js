import express from "express"
import { deleteMessageForboth, deleteMessageOwn, getConversation, getMessage, searchUser, searchUserAuto, sendMessage, suggestUser } from "../controllers/message.routes.controllers.js"
import { protectRoute } from "../utils/protectRoute.js"

export const messageRoute = express.Router()

messageRoute.post("/sendMessage",protectRoute,sendMessage)
messageRoute.post("/getMessage",protectRoute,getMessage)
messageRoute.post("/getConversation",protectRoute,getConversation)
messageRoute.post("/search/:user",protectRoute,searchUser)
messageRoute.post("/suggest",protectRoute,suggestUser)
messageRoute.post("/deleteMessage",protectRoute,deleteMessageOwn)
messageRoute.post("/deleteMsg/:id",protectRoute,deleteMessageForboth)
messageRoute.post("/searchedUser",protectRoute,searchUserAuto)


// export const deleteMessageOwn = async(req,res)=>{
//     try {
   
//         const {id} = req.body
//         let messageUpdate = await Message.updateOne({_id:id}, { $unset: { "message.senderId": "" } })
          
//          const message = await Message.find({_id:id})

//           res.status(200).json(message)
        
//     } catch (error) {
//         console.log("error in deleteMessageOwn",error)
//         res.status(400).json({error:error.message})
//     }
// }