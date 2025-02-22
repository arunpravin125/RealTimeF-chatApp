import React, { useEffect, useState } from 'react'
import { IoIosSend } from "react-icons/io";
import { useGroupContext } from '../../../context/GroupContext';
import toast from 'react-hot-toast';
import { SocketUseContext } from '../../../context/SocketContext';
const SendGroupMessage = () => {
  const {groupConversations,groupMessages,setGroupMessages,setGroupConversations,seletedGroup,setSeletedGroup}=useGroupContext()
  const [text,setText] = useState("")
 const { socket, onlineUsers } = SocketUseContext()

  // useEffect(()=>{
    
  //    socket?.on("groupMessageListen",(groupParticipant)=>{
  //     console.log("groupParticipant",groupParticipant)
     
  //       setGroupMessages((prevMsg)=>[...prevMsg,groupParticipant])
    
    
  //    })
  // },[socket])


  const handleSendGroupMessage = async()=>{
    if(!text){
      return ;
    }
      try {
        const res = await fetch("/api/groupConversation/groupMsg",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({groupId:seletedGroup?.groupId,groupText:text})
        })
        const data = await res.json()
        console.log("sendGroupMessage",data)
        setGroupMessages((prevMsg)=>[...prevMsg,data])
        
        setText("")
      } catch (error) {
        console.log("error in handleSendGroupMessage",error)
        toast.error(error.message)
      }
  }
  return (
    <div className="bg-orange-100 p-1 flex gap-10" >
      <input value={text} onChange={(e)=>setText(e.target.value)} className="w-56 p-1" ></input>
      <button onClick={handleSendGroupMessage} className="bg-pink-400 p-1 h-9 w-10 flex items-center justify-center" ><IoIosSend className="h-24 w-24"/></button>
    </div>
  )
}

export default SendGroupMessage
