import React, { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'

const useSignUp = () => {
 const [loading,setLoading] = useState(false)
  const {setAuthUser} = useAuthContext()

 const handleSignUp = async(userData)=>{
    setLoading(true)
    try {
        const res = await fetch("/api/auth/sign",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(userData)
        })
        const data = await res.json()
        console.log("signUp",data)
        localStorage.setItem("chatUser",JSON.stringify(data))
        setAuthUser(data)
    } catch (error) {
        toast.error(error.message)
        console.log("error in useSignUp",error.message)
    }finally{
        setLoading(false)
    }
 }
 return {handleSignUp,loading}

}

export default useSignUp