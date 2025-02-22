import React from 'react'
import SideBar from './GroupSidebar/SideBar'
import GroupContainer from './groupContainer/GroupContainer'
import SendGroupMessage from './groupContainer/SendGroupMessage'
import { useGroupContext } from '../../context/GroupContext'

const GroupConversation = () => {
  const {groupConversations,groupMessages,setGroupMessages,setGroupConversations,seletedGroup,setSeletedGroup}=       useGroupContext()
  return (
    <div className="h-96 border-e-indigo-400 flex gap-2" >Groups
        <SideBar/>
        <div className="flex flex-col" >

        <GroupContainer/>
        {
           seletedGroup? <SendGroupMessage/>:null
        }

        </div>

    </div>
  )
}

export default GroupConversation
