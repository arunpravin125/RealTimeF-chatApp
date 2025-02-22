import React, { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import toast from 'react-hot-toast'

const useLogin = () => {
     const [loading,setLoading] = useState(false)
    const {setAuthUser}  = useAuthContext()
    const handleLogin = async(username,password)=>{
        setLoading(true)
          try {
            const res = await fetch("/api/auth/login",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({username:username,password:password})
            })
            const data = await res.json()

            console.log("loginData",data)
            if(!data.error){
              localStorage.setItem("chatUser",JSON.stringify(data))
              setAuthUser(data)
            }else{
              toast.error(data.error)
            }
            
          } catch (error) {
            console.log("error in uselogin",error.message)
            toast.error(error.message)
          }finally{
             setLoading(false)
          }
    }
    return {handleLogin,loading}
}

export default useLogin