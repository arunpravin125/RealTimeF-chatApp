import React from 'react'
import { useAuthContext } from '../../context/AuthContext'

const MessageHearder = () => {
  const { selectedConversation, authUser,setAuthUser, setSelectedConversation, conversations, setConversations } = useAuthContext()
  return (
    <div className="flex h-10 gap-3" >
        <h2>To:</h2>
        <h2>{selectedConversation?.username}</h2>
    </div>
  )
}

export default MessageHearder