import { Conversation } from "../models/conversation.model.js"
import { Message } from "../models/message.model.js"
import { Notification } from "../models/notification.model.js"
import { io, getSocketId } from "../socket/socket.js"
import { User } from "../models/User.model.js"

export const sendMessage = async (req, res) => {
    try {
        const { message, sender } = req.body
        const currentUserId = req.user._id

        let conversation = await Conversation.findOne({
            participants: { $all: [currentUserId, sender] }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [currentUserId, sender],
                lastMessage: {
                    text: message,
                    sender: currentUserId
                }
            })
            await conversation.save()
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            senderId: currentUserId,
            message: {
                senderId: currentUserId,
                recipientId: sender,
                text: message
            }
        })

        await newMessage.save()
        conversation.lastMessage = {

            text: newMessage.message.text,
            sender: newMessage.senderId

        }
        await conversation.save()
        // const notification = new Notification({
        //     From: newMessage.senderId,
        //     To: sender,
        //     text: message,
        // })
        // await notification.save()
        const socketId = getSocketId(sender)
        console.log("socketId", socketId)

        if (socketId) {
            io?.to(socketId).emit("sendMessages", (newMessage))
        }

        res.status(200).json(newMessage)
    } catch (error) {
        console.log("error in sendMessage", error)
        return res.status(400).json({ error: error.message })
    }
}
export const getMessage = async (req, res) => {
    try {
        const { senderId } = req.body
        const currentUserId = req.user._id

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, currentUserId] }
        })

        const messages = await Message.find({ conversationId: conversation?._id }).sort({ createdAt: 1 })

        res.status(200).json(messages)

    } catch (error) {
        console.log("error in getMessage", error)
        return res.status(400).json({ error: error.message })
    }
}
export const getConversation = async (req, res) => {
    try {
        const currentUserId = req.user._id

        let getUserConversation = await Conversation.find({
            participants: currentUserId
        }).populate({ path: "participants", select: "username profilePic" })

        
        getUserConversation.forEach(conversation => {
            conversation.participants = conversation.participants.filter(participants => {
                return participants._id.toString() !== currentUserId.toString()
            })
        })

        res.status(200).json(getUserConversation)

    } catch (error) {
        console.log("error in getConversation", error)
        return res.status(400).json({ error: error.message })
    }
}
export const searchUser = async (req, res) => {
    try {
        const { user } = req.params
        const currentUserId = req.user._id
        const getUserByfullName = await User.findOne({ fullName: user })
        if (!getUserByfullName) {
            const getUserByUsername = await User.findOne({ username: user })
            console.log("getUser", getUserByUsername)
            return res.status(400).json(getUserByUsername)

        }
        if (getUserByfullName?._id == currentUserId) {
            return res.status(400).json({ error: "you doest not message youself" })
        }
        res.status(200).json(getUserByfullName)

        // console.log("getUserByfullname", getUserByfullName)
    } catch (error) {
        console.log("error in searchUser", error.messsage)
        return res.status(400).json({ error: error.message })
    }
}

export const suggestUser = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        let conversationed = await Conversation.find({
            participants: currentUserId
        }).populate({ path: "participants", select: "username profilePic" });

        let alreadyConversation = []

        // Remove the current user from the participant list
        conversationed.forEach(conversation => {
            conversation.participants = conversation.participants.filter(
                participant => participant._id.toString() !== currentUserId.toString()
            );
        });
        conversationed.forEach(conversation => {
            conversation.participants.forEach(participant => {
                if (!alreadyConversation.some(user => user.username == participant.username)) {
                    alreadyConversation.push({ username: participant.username, profilePic: participant.profilePic })
                }
            })
        })
        // console.log("correctConversations",conversationed)
        // console.log("alreadyConversation",alreadyConversation)
        // Fetch all conversations
        let newConversation = await Conversation.find().populate({
            path: "participants",
            select: "username profilePic"
        });

        // Remove current user from the participants
        newConversation.forEach(conversation => {
            conversation.participants = conversation.participants.filter(
                participant => participant._id.toString() !== currentUserId.toString()
            );
        });


        // Declare newUser before using it
        let newUser = [];


        // Extract unique users from participants
        newConversation.forEach(conversation => {
            conversation.participants.forEach(participant => {
                if (!newUser.some(user => user.username === participant.username)) {
                    newUser.push({
                        username: participant.username,
                        profilePic: participant.profilePic,
                        _id: participant._id
                    });
                }
            });
        });
        let suggestFinal = []

        newUser.forEach(user => {

            if (!alreadyConversation.some(already => already.username.includes(user.username))) {
                suggestFinal.push(user)
            }
        })
        // console.log("newUser", newUser);
        // console.log("suggestFinal",suggestFinal)
        res.status(200).json(suggestFinal);

    } catch (error) {
        console.error("Error suggesting users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const deleteMessageOwn = async (req, res) => {
    try {

        const { id } = req.body
        const currentUserId = req.user._id

        let message = await Message.findById(id)

        if (message.message.senderId == currentUserId ){
            await Message.updateOne({_id:id}, { $unset: { "message.senderId": null } })
            message = await Message.findById(id)
          
            console.log("message", message)
            res.status(200).json(message)
        }
        
        if(message.message.recipientId == currentUserId){
            await Message.updateOne({_id:id}, { $unset: { "message.recipientId":null } })
            message = await Message.findById(id)

            console.log("message", message)
            res.status(200).json(message)
        }
        

    } catch (error) {
        console.log("error in deleteMessageOwn", error)
        res.status(400).json({ error: error.message })
    }
}

export const deleteMessageForboth = async(req,res)=>{
    try {
        const {id} = req.params
        console.log("deleteMessage",id)
        const message = await Message.findById(id)
        if(!message){
            return res.status(400).json("message not found")
        }
        await Message.findByIdAndDelete(id)

        res.status(201).json({message:"Message deleted Successfully"})
        
    } catch (error) {
        console.log("error in deleteMessageForBoth", error)
        res.status(400).json({ error: error.message })
    }
}

export const searchUserAuto = async(req,res)=>{
    try {
        const {user} = req.body
        console.log("user",user)
        let searchedUser = await User.find()
        const newUser = []

        searchedUser.map((users)=>{
            if(users.username.includes(user) || users.fullName.includes(user)){
                return newUser.push(users)
            }
        })
          res.status(200).json(newUser)
        console.log("newDetail",newUser)
    } catch (error) {
        console.log("error in searchAuto",error)
        res.status(400).json({error:error.message})
    }
}