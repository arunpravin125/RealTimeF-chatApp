import jwt from "jsonwebtoken"

export const generateTokenAndsetCookie = async(userId,res)=>{
    try {
        const token = jwt.sign({userId},process.env.JWT_SECRET,{
            expiresIn:"15d"
        })
        res.cookie("jwt",token,{
            maxAge:15*24*60*60*1000,
            httpOnly:"true",
            sameSite:"strict"
    })
    } catch (error) {
        console.log("error in generateToken",error.message)
    }
}