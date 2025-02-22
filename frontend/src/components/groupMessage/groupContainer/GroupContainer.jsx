import React, { useEffect, useRef } from 'react'
import { useGroupContext } from '../../../context/GroupContext'
import GroupMessage from './GroupMessage'
import toast from 'react-hot-toast'
import { GroupMessageHeader } from './GroupMessageHeader'
import { SocketUseContext } from '../../../context/SocketContext'

const GroupContainer = () => {
  const {groupConversations,groupMessages,setGroupMessages,setGroupConversations,seletedGroup,setSeletedGroup}=       useGroupContext()
   const { socket, onlineUsers } = SocketUseContext()
  useEffect(()=>{
    
     socket?.on("groupMessageListen",(groupParticipant)=>{
      console.log("groupParticipant",groupParticipant)
     
        setGroupMessages((prevMsg)=>[...prevMsg,groupParticipant])
    
    
     })
     return ()=> socket?.off("groupMessageListen")
  },[socket])

 const groupMessageRef = useRef(null)
  useEffect(()=>{
    const handleGetMessage = async()=>{
      try {
      const res = await fetch("/api/groupConversation/getgroupMsg",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({id:seletedGroup?.groupId})
      })
      const data = await res.json()
      console.log("getGroupMessage",data)
      setGroupMessages(data)
      } catch (error) {
        console.log("error in handleGetMessage",error)
        toast.error(error.message)
      }
    }
     handleGetMessage()

  },[seletedGroup?.groupId])

  useEffect(()=>{
      groupMessageRef?.current?.scrollIntoView({behavior:"smooth"})
  },[groupMessages])
  return (
    <div className="flex flex-col">
    {
      <>
      <GroupMessageHeader/>
       <div className="p-1 h-96 bg-green-200 w-96 overflow-auto " >

        {
        groupMessages.length == 0 ?<h1 className="text-center" >No messages</h1>:null
        }
        {
          groupMessages.map((groupMsg)=>{
            return <div key={groupMsg?._id} ref={groupMessages.length-1 == groupMessages.indexOf(groupMsg)?groupMessageRef:null}>
              <GroupMessage groupMsgSender={groupMsg.senderId}  groupMessage={groupMsg.groupMessage} />
            </div>
          })
        }

    </div>
      </>
    }

    </div>

    // <div className="p-1 h-96 bg-green-200 w-96 overflow-auto " >
    //     <h2 className="text-lg text-center h-8 bg-[#d07fe2]" >{seletedGroup?.groupName}</h2>
    //     {
    //     groupMessages.length == 0 ?<h1 className="text-center" >No messages</h1>:null
    //     }
    //     {
    //       groupMessages.map((groupMsg)=>{
    //         return <div key={groupMsg?._id}>
    //           <GroupMessage groupMsgSender={groupMsg.senderId}  groupMessage={groupMsg.groupMessage} />
    //         </div>
    //       })
    //     }

    // </div>
  )
}

export default GroupContainer
