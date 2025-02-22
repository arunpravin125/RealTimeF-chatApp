import { Notification } from "../models/notification.model.js"

export const receiveNotification = async(req,res)=>{
    try {
        const currentUser = req.user._id
        const getNotification = await Notification.find({
            "To":currentUser
        }).sort({createAt:1}).populate({path:"From",select:"username profilePic"})

        if(!getNotification){
            return res.status(201).json("no notification")
        }
        console.log("getNotification",getNotification)
        res.status(200).json(getNotification)
    } catch (error) {
        console.log("error in receiveNofication",error.message)
    }
}
export const readNotification = async(req,res)=>{

    try {
        const {id} = req.params
        let notification = await Notification.findById(id)
        if(!notification){
            return res.status(400).json("notification not there")
        }
        const readNotification = await Notification.updateOne({_id:id.toString()},{$set:{"read":true}})
        notification = await Notification.findById(id)
        res.status(200).json(notification)
    } catch (error) {
        console.log("error in sendNofication",error.message)
    }
}
export const deleteNotification = async(req,res)=>{
    try {
        const {id} = req.params
        const notification = await Notification.findById(id)
        if(!notification){
            return res.status(400).json("notification not there")
        }
        const deleteNotifi = await Notification.deleteOne({_id:id.toString()})
        res.status(200).json("notification deleted successfully")
    } catch (error) {
        console.log("error in sendNofication",error.message)
    }
}