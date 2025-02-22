import React from 'react'
import MessageHearder from './MessageHearder'
import Messages from './Messages'

import { useAuthContext } from '../../context/AuthContext'
import SendMessage from '../MessageContainer/SendMessage'

const MessageContainer = () => {
  const { selectedConversation, authUser, setSelectedConversation, conversations, setConversations } = useAuthContext()
  return (
    <>
    {selectedConversation?.userId?
    <div className="w-1/3 p-1 bg-red-300 flex flex-col h-3/4 " >
    <MessageHearder/>
    <Messages/>
    <SendMessage/>
</div>:(
  <div className="w-1/3 p-1 bg-red-300 flex flex-col h-3/4 items-center justify-center " >
    <h3>Select a person  to message</h3>
  <div className="flex flex-col " >
  <img className="h-20 w-20 flex justify-center items-center"
      alt="Tailwind CSS chat bubble component"
      src={authUser?.profilePic}/>
    <h1>{authUser?.fullName}</h1>
  </div>
</div>
)}
    
    
    </>
    
  )
}

export default MessageContainer


