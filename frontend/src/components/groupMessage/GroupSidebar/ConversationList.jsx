import React from 'react'
import { useGroupContext } from '../../../context/GroupContext'
import { useAuthContext } from '../../../context/AuthContext'

const ConversationList = ({group}) => {

const {groupConversations, groupParticipants,groupMessages,setGroupMessages,setGroupConversations,seletedGroup,setSeletedGroup}=       useGroupContext()
 const { selectedConversation, authUser, messages, setMessages, setSelectedConversation } = useAuthContext()
 const handleSelectGroup = ()=>{
  setSelectedConversation("")
  setSeletedGroup({
    groupId:group?._id,
    groupCreatedUserId:group?.groupCreatedBy?._id,
    groupName:group?.groupName
  })
 }
    return (
    <div className={` ${seletedGroup?.groupId == group?._id?"bg-[#d54de1cf]":"bg-[#bca9a9]"} hover:bg-yellow-500 mb-2 p-2 `} onClick={handleSelectGroup}>
      <div className="flex justify-between" >
      <h2 className="p-1" >{group.groupName}</h2>
      <p>members:{group.participants.length}</p>
      </div>

        <div className="flex gap-2 items-center" >
          <p className="text-sm" >createdBy:</p>
          <div className="text-xs  flex gap-2 items-center" >
          <img className="size-6" src={group.groupCreatedBy.profilePic} />
            <b>{group.groupCreatedBy.username}</b>
            </div>
        </div>

    </div>
  )
}

export default ConversationList
