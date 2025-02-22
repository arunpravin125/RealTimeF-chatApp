import React, { useEffect, useState } from 'react'
import { IoSend } from "react-icons/io5";
import { useAuthContext } from '../../context/AuthContext';
import { SocketUseContext } from '../../context/SocketContext';
const SendMessage = () => {

  const { selectedConversation, authUser,messages,setMessages, setSelectedConversation, conversations, setConversations } = useAuthContext()
  const [loading,setLoading] = useState(false)
  const [text,setText] = useState("")
const {socket,setSocket,onlineUsers,setOnlineUsers} = SocketUseContext ()

  useEffect(()=>{
     socket?.on("sendMessages",(message)=>{
      console.log("sendMessage",message)
      if(selectedConversation?.conversationId == message?.conversationId){
        setMessages((prev)=>[...prev,message])
        setConversations((prevConversation)=>{
          const prevConversat = prevConversation.map(preCon=>{
            if(selectedConversation.conversationId == preCon._id){
              return {...preCon,lastMessage:{
                text:message.message.text,
                sender:message.senderId
              }}
            }
            return preCon
          })
          return prevConversat
        }
        
      )
      }
     })

     return ()=> socket?.off("sendMessages")
  },[setMessages,socket,messages])

  const handleSendMessage = async()=>{
    if(!text){
      return ;
    }
    setLoading(true)
      try {
        const res = await fetch("/api/message/sendMessage",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({message:text,sender:selectedConversation?.userId})
        })
        const data = await res.json()
        console.log("messages",data)
        
        setMessages([...messages,data])
        setConversations((prev)=>{
          const updateConversation = prev.map(conversation=>{
            if(conversation._id == selectedConversation.conversationId){
              return {
                ...conversation,lastMessage:{
                  text:text,
                  sender:data.senderId
                }
              }
              
            }
            return conversation
          })
          return updateConversation
        })
           setText("")
      } catch (error) {
        console.log("error in sendMessage",error.message)
        toast.error(error.message)
      }finally{
        setLoading(false)
      }
  }
  return (
    <div className="flex m-1 gap-3" >
        <input value={text} onChange={(e)=>setText(e.target.value)} className="h-7 w-3/4 p-2" ></input>
        <button onClick={handleSendMessage} >
        <IoSend />
        </button>
    </div>
  )
}

export default SendMessage