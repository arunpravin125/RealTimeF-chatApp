import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client"
import { useGroupContext } from "./GroupContext";
export const socketContext = createContext()

export const SocketUseContext = ()=>{
    return  useContext(socketContext)
}


export const SocketContextProvider = ({children})=>{
   const { selectedConversation, authUser, setSelectedConversation, conversations, setConversations } = useAuthContext()
   const [socket,setSocket] = useState()
   const [onlineUsers,setOnlineUsers] = useState([])



   useEffect(()=>{
          if(authUser){
            const socket = io("https://realtimef-chatapp.onrender.com",{
                query:{
                    userId:authUser._id
                }
            })

            setSocket(socket)

            socket?.on("getOnlineUser",(users)=>{
                setOnlineUsers(users)
            })


            return () => socket?.close() &&  setSocket(null)
          }
   },[authUser])

   console.log("onlineUsers",onlineUsers)

  return ( <socketContext.Provider value={{socket,setSocket,onlineUsers,setOnlineUsers}} >
        {children}
    </socketContext.Provider> )
}