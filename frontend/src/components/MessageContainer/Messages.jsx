import React, { useEffect, useRef, useState } from 'react'
import Message from './Message'
import { useAuthContext } from '../../context/AuthContext'
import toast from "react-hot-toast"
const Messages = () => {
   const { selectedConversation, authUser,setAuthUser, setSelectedConversation,messages,setMessages, } = useAuthContext()
   console.log('selectedConversation',selectedConversation)
   const [loading,setLoading] = useState(false)
  const messageRef = useRef(null)
  
   useEffect(()=>{
    const getMessages = async()=>{
      try {
        const res = await fetch("/api/message/getMessage",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({senderId:selectedConversation?.userId})
        })
        const data = await res.json()
        console.log("getMessages",data)
        setMessages(data)
      } catch (error) {
        console.log("error in getMessage",error.message)
        toast.error(error.message)
      }finally{
          setLoading(false)
      }
    }
    getMessages()
   },[selectedConversation?.userId,setMessages])

   useEffect(()=>{
       messageRef.current?.scrollIntoView({behavior:"smooth"})
   },[messages])

  return (
    <div className=" bg-amber-300 h-screen p-1 overflow-auto" >
      {
        messages.map((message)=>{
          return <div key={message?._id} ref={messages.length-1 == messages.indexOf(message)?messageRef : null} >
            <Message message={message} seen={message.seen} />
            </div>
        })
      }

    </div>
  )
}

export default Messages
