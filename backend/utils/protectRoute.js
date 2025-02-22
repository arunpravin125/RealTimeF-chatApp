import jwt from "jsonwebtoken"
import { User } from "../models/User.model.js"

export const protectRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt

        if(!token){
            return res.status(400).json("invalid token")
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET)

        if(!decode){
            return res.status(400).json("Unauthorized token")
        }
        const user = await User.findOne({_id:decode.userId})
        if(!user){
            return res.status(401).json("user token not exists in protectRoute")
        }
        req.user = user._id
        next()
    } catch (error) {
        console.log("error in protectRoute",error.message)
    }
}