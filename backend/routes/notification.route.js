import express from "express"
import { protectRoute } from "../utils/protectRoute.js"
import { deleteNotification, readNotification, receiveNotification } from "../controllers/notification.controller.js"

export const notificationRoute = express.Router()

notificationRoute.get("/receiveNotifi",protectRoute,receiveNotification)
notificationRoute.post("/readNotifi/:id",protectRoute,readNotification)
notificationRoute.post("/deleteNotifi/:id",protectRoute,deleteNotification)