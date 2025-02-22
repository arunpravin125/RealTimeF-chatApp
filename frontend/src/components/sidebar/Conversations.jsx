import React, { useEffect, useState } from 'react'
import Conversation from './Conversation'
import { useAuthContext } from '../../context/AuthContext'
import { toast } from "react-hot-toast"
import { SocketUseContext  } from '../../context/SocketContext'
import GroupConversation from '../groupMessage/GroupConversation'
import SideBar from '../groupMessage/GroupSidebar/SideBar'

const Conversations = () => {

  const { selectedConversation, authUser, setSelectedConversation, conversations, setConversations } = useAuthContext()
  const {socket,setSocket,onlineUsers,setOnlineUsers} = SocketUseContext ()



   useEffect(() => {
    const getConversation = async () => {

      try {
        const res = await fetch("/api/message/getConversation", {
          method: "POST",
          headers: {
            "Content_Type": "application/json"
          },

        })
        const data = await res.json()
        console.log("getConversation", data)
        setConversations(data)
      } catch (error) {
        console.log("error on Conversations", error)
        toast.error(error.message)
      } finally {

      }
    }
    getConversation()
  }, [authUser])


  return (
    <div className="h-96 overflow-auto" >
       {/* <GroupConversation/> */}
       <SideBar/>
      {
        conversations.map((conversation)=>{
         return ( <div key={conversation?._id} >
            <Conversation  conversation={conversation} />
            </div> )
        })
      }

    </div>
  )
}

export default Conversations
