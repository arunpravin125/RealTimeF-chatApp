import React, { useEffect } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import toast from "react-hot-toast"
import { SocketUseContext } from '../../context/SocketContext'

const Message = ({message,seen}) => {
   const { selectedConversation, authUser, messages, setMessages,setSelectedConversation, conversations, setConversations } = useAuthContext()
   const { socket, onlineUsers } = SocketUseContext()


   useEffect(()=>{
    socket?.on("messageDeleted",({conversationId,messageId})=>{
      console.log("messageDeleted",conversationId,messageId)
        if(messageId){
          setMessages((prev)=>prev.filter((message)=>message._id !== messageId))
        }
    })
    return ()=>socket?.off("messageDeleted")
   },[selectedConversation,socket,messages])

   const handleDeleteMessageForBoth = async(id)=>{
    try {
      const res = await fetch(`/api/message/deleteMsg/${id}`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        }})
      const data = await res.json()
      console.log("handleDeleteMessageForBoth",data)
      socket.emit("messageDelete",{
        conversationId:selectedConversation.conversationId,
        userId:selectedConversation.userId,
        messageId:id
      })
      setMessages((prev)=>{
        const deleteMsg = prev.filter((message)=>message._id !== id)
        return deleteMsg
      })
      toast.success(data.message)
    } catch (error) {
      console.log("error in handleDeleteMessageForBoth",error)
      toast.error(error.message)
    }
   }
 
   const handleDeleteMessageForMe = async(id)=>{
    try {
      const res = await fetch("/api/message/deleteMessage",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({id:id})
      })
      const data = await res.json()
      console.log("messageDeleteForMe",data)
      // setMessages((prev)=>prev.filter((message)=>message._id == id?message.message.senderId !== authUser._id:message))
     const findMessage = messages.find((message)=>message._id == id)
     console.log("findMessage",findMessage)
      // const updateSender = messages.forEach((message)=>message._id ==id?message)
     const senderMessage = findMessage.message.senderId.includes(authUser._id)
     const recipientMessage = findMessage.message.recipientId.includes(authUser._id)
     console.log("senderMessage",senderMessage)
     if(senderMessage)
      setMessages((prev)=>{
        const updateMessage = prev.map((message)=>{
          if(message._id == id){
            return {...message,message:{
              ...message.message,senderId:""
            }}
           
          }
          return message
        })
        return updateMessage
      })

     if(recipientMessage)
      setMessages((prev)=>{
        const updateMessage = prev.map((message)=>{
          if(message._id == id){
            return {...message,message:{
              ...message.message,recipientId:""
            }}
           
          }
          return message
        })
        return updateMessage
      })
     
     
    } catch (error) {
      console.log("error in handleDeleteMessageForMe",error)
      toast.error(error.message)
    }
  }
  
   return (
    <div >
        { message.message.senderId || message.message.recipientId == authUser._id?<div className={`chat ${message.senderId == authUser._id?"chat-end":"chat-start"}`}>
  {
     message.message.senderId == authUser._id || message.message.recipientId == authUser._id? <div className="chat-image avatar">
   
     <div className="w-10 rounded-full">
       <img
         alt="Tailwind CSS chat bubble component"
         src={message.senderId !== authUser._id?selectedConversation.profilePic:authUser.profilePic} />
       
     </div>
   </div>:null
  }
 
  <div>
  
  <div>{
    message.message.senderId == authUser._id || message.message.recipientId == authUser._id?<div  >
      
      <div className="dropdown dropdown-hover">
  <div className=""><label tabIndex={0} className="btn m-1">{message.message.text}</label></div>
  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
    <li><a><button onClick={()=>handleDeleteMessageForMe(message._id)} >deleteForMe</button></a></li>
    <li><a><button onClick={()=>handleDeleteMessageForBoth(message._id)} >deleteForBoth</button></a></li>
  </ul>
</div>
    </div>:null
    
    }</div>
    {message.message.senderId || message.message.recipientId == authUser._id?<p>{message.senderId == authUser._id?<>{seen?"seen":""}</>:""}</p>:""}
   
  </div>
 
</div>:null}
    </div>
  )
}

export default Message