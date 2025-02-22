import { generateTokenAndsetCookie } from "../middleware/generateToken.js"
import { User } from "../models/User.model.js"
import bcrypt from "bcryptjs"

export const sign = async(req,res)=>{
   try {
     const {fullName,username,password,confirmPassword,gender} = req.body
 
     if(!fullName || !username || !password || !confirmPassword || !gender ){
         return res.status(400).json({error:"Please fill all fileds"})
     }
     if(password !== confirmPassword){
        return res.status(400).json({error:"Password and confirmPassword must be same"})
     }
     if(password.length < 6){
        return res.status(400).json({error:"Password atleast 6 charactors"})
     }
     const user = await User.findOne({username})

     if(user){
        return res.status(400).json({error:"User already exists"})
     }
     const salt = await bcrypt.hash(password,10)
     const genderProfile = gender == "male"?`https://avatar.iran.liara.run/public/boy?username=${username}`:`https://avatar.iran.liara.run/public/girl?username=${username}`

     const newUser = new User({
        fullName,
        username,
        password:salt,
        gender,
        profilePic:genderProfile
     })
     await newUser.save()
     generateTokenAndsetCookie(newUser._id,res)
     res.status(200).json(newUser)
   } catch (error) {
     return res.status(400).json({error:error.message})
   }

}
export const login = async(req,res)=>{
    try {
      const {username,password} = req.body
   
       if(!username || !password){
         return res.status(400).json({error:"fill username and Password"})
       }
      const user = await User.findOne({username})

      if(!user){
         return res.status(401).json({error:"Username invalid"})
      }
       const checkPassword = await bcrypt.compare(password,user?.password)

       if(!checkPassword){
         return res.status(400).json({error:"password invalid"})
       }
       generateTokenAndsetCookie(user._id,res)

       res.status(200).json(user)

    } catch (error) {
      return res.status(400).json({error:error.message})
    }

}
export const logout = async(req,res)=>{
    
   try {
      res.cookie("jwt","",{maxAge:1})
      res.status(200).json("logout successful;y")
   } catch (error) {
      return res.status(400).json({error:error.message})
   }

}