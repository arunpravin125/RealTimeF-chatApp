import React, { useEffect } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import { SocketUseContext } from '../../context/SocketContext'
import { useGroupContext } from '../../context/GroupContext'

const Conversation = ({ conversation }) => {
  const { selectedConversation, authUser, messages, setMessages, setSelectedConversation } = useAuthContext()
  const { socket, onlineUsers } = SocketUseContext()
 const {groupConversations,groupMessages,setGroupMessages,setGroupConversations,seletedGroup,setSeletedGroup}=useGroupContext()
  const isSelected = selectedConversation?.userId === conversation?.participants[0]?._id

  // if(selectedConversation){
  //   return setSeletedGroup("")
  // }
  // if(seletedGroup){
  //   return setSelectedConversation("")
  // }


 useEffect(()=>{
  const messageFromOther = messages?.length && messages[messages.length-1]?.senderId !== authUser?._id
 console.log("messageFromOther",messageFromOther)

      if(messageFromOther && selectedConversation){
        console.log("messageFrom",messageFromOther)
        socket?.emit("messageAsSeen",{
          conversationId:selectedConversation?.conversationId,
          userId:selectedConversation?.userId
        })
      }

      socket?.on("messageSeened",(conversationId)=>{
console.log("messagedSeened",conversationId)
        if(conversationId == selectedConversation?.conversationId){
          setMessages((prev)=>{
            const updateSeen = prev.map((message)=>{
              if(!message.seen){
                return {...message,seen:true}
              }
              return message
            })
            return updateSeen
          })
        }
      })

      return ()=>socket?.off("messageSeened")


 },[messages,selectedConversation,socket])

  const handleSelectConversation = () => {
    setSeletedGroup("")
    setSelectedConversation({
      username: conversation?.participants[0].username,
      profilePic: conversation?.participants[0].profilePic,
      userId: conversation?.participants[0]._id,
      conversationId: conversation._id
    })
  }

  return (
    <div
      onClick={handleSelectConversation}
      className={`flex w-[240px] p-1 gap-5 mb-2 items-center ${
        isSelected ? "bg-violet-400" : "bg-pink-300"
      }`}
    >
      <div className="w-10 rounded-full relative">
        <img
          alt="Profile"
          src={conversation?.participants[0]?.profilePic}
          className="w-full rounded-full"
        />
        {onlineUsers.includes(conversation?.participants[0]?._id) && (
          <p className="absolute bottom-0 right-0 bg-green-500 text-xs px-1 rounded-full">
            online
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold">{conversation?.participants[0].username}</h1>
        <p className="text-gray-200 text-sm">
          {conversation?.lastMessage.sender === authUser?._id ? "You" : conversation?.participants[0].username}
          : {conversation?.lastMessage.text}
        </p>
      </div>
    </div>
  )
}

export default Conversation;
