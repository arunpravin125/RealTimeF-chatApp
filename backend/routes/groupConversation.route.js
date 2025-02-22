import express from "express"
import { protectRoute } from "../utils/protectRoute.js"
import {addUsers, createGroup, sendGroupMessage,getMessage, getGroup, getGroupParticipants, removeParticipantsFromGroup, addParticipantsFromGroup, getSuggestedUsers, deleteGroup} from "../controllers/group.conversation.js"

export const groupConversations = express.Router()

groupConversations.post("/createGroup",protectRoute,createGroup)
groupConversations.post("/addUsers",protectRoute,addUsers)
groupConversations.post("/groupMsg",protectRoute,sendGroupMessage)
groupConversations.post("/getgroupMsg",protectRoute,getMessage)
groupConversations.post("/getGroup",protectRoute,getGroup)
groupConversations.post("/getParticipants",protectRoute,getGroupParticipants)
groupConversations.post("/removeParticipants",protectRoute,removeParticipantsFromGroup)
groupConversations.post("/addParticipants",protectRoute,addParticipantsFromGroup)
groupConversations.post("/suggestParticipants",protectRoute,getSuggestedUsers)
groupConversations.post("/deleteGroup",protectRoute,deleteGroup)
