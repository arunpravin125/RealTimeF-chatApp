import express from "express"
import dotenv from "dotenv"
import { authRoute } from "./routes/auth.route.js"
import { databaseConnect } from "./database/database.js"
import { messageRoute } from "./routes/message.route.js"
import cookieParser from "cookie-parser"
import { notificationRoute } from "./routes/notification.route.js"
import { app, server } from "./socket/socket.js"
import { groupConversations } from "./routes/groupConversation.route.js"


app.use(express.json())
dotenv.config()
app.use(cookieParser())
const PORT = process.env.PORT || 3501

app.use("/api/auth",authRoute)
app.use("/api/message",messageRoute)
app.use("/api/notification",notificationRoute)
app.use("/api/groupConversation",groupConversations)


server.listen(PORT,()=>{
    console.log("Server running",PORT)
    databaseConnect()
})