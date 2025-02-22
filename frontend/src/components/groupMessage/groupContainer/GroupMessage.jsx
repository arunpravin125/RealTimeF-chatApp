import React from 'react'
import { useAuthContext } from '../../../context/AuthContext'

const GroupMessage = ({groupMessage,groupMsgSender}) => {
   const { selectedConversation, authUser, messages, setMessages, setSelectedConversation } = useAuthContext()
  return (
    <div className={`chat ${groupMsgSender._id == authUser._id?"chat-end":"chat-start"}`}>
  <div className="chat-image avatar flex flex-col">

    <div className="w-10 h-10 rounded-full">

      <img className="h-40 w-10 rounded-md" src={groupMsgSender.profilePic} />
    </div>
    <p className="text-sm" >{groupMsgSender.username}</p>
  </div>
  <div className="chat-bubble">{groupMessage}</div>
</div>

  )
}

export default GroupMessage
