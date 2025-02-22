import express from "express"
import dotenv from "dotenv"
import { authRoute } from "./routes/auth.route.js"
import { databaseConnect } from "./database/database.js"
import { messageRoute } from "./routes/message.route.js"
import cookieParser from "cookie-parser"
import { notificationRoute } from "./routes/notification.route.js"
import { app, server } from "./socket/socket.js"
import { groupConversations } from "./routes/groupConversation.route.js"
import path from "path"

app.use(express.json())
dotenv.config()
app.use(cookieParser())
const PORT = process.env.PORT || 3501
const __dirname = path.resolve()


app.use("/api/auth",authRoute)
app.use("/api/message",messageRoute)
app.use("/api/notification",notificationRoute)
app.use("/api/groupConversation",groupConversations)

if(process.env.NODE_ENV == "production"){
    app.use(express.static(path.join(__dirname,"/frontend/dist")))

    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
    })
}

server.listen(PORT,()=>{
    console.log("Server running",PORT)
    databaseConnect()
})