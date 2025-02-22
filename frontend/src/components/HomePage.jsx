import React, { useEffect } from 'react'
import Chat from './Chat'
import { useAuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'

const HomePage = () => {
 const { setSelectedConversation} = useAuthContext()
 
 useEffect(()=>{

  return ()=> setSelectedConversation("")
 },[])


  return (
    <div className="flex flex-col h-screen " >
      
        <Chat/>
    </div>
  )
}

export default HomePage