import React from 'react'
import Sidebar from './sidebar/Sidebar'
import MessageContainer from './MessageContainer/MessageContainer'
import SuggestedUsers from './suggested/SuggestedUsers'
import GroupConversation from './groupMessage/GroupConversation'
import { useGroupContext } from '../context/GroupContext'
import GroupContainer from './groupMessage/groupContainer/GroupContainer'
import SendGroupMessage from './groupMessage/groupContainer/SendGroupMessage'
// import Notification from './Notification/Notification'


const Chat = () => {
 const {groupConversations,groupMessages,setGroupMessages,setGroupConversations,seletedGroup,setSeletedGroup}=       useGroupContext()
  return (
    <div className="flex flex-row  justify-center items-center bg-orange-300 w-screen h-screen " >
    {/* <GroupConversation/> */}
    <Sidebar/>

{
  seletedGroup?<>
<div className="flex flex-col" >
<GroupContainer/>
        {
           seletedGroup? <SendGroupMessage/>:null
        }
</div>


  </>:<>
  <MessageContainer/>
  <SuggestedUsers/>
  </>
}

    {/* // <Notification/> */}
    {/* <Sidebar/>

    <MessageContainer/>
     <SuggestedUsers/> */}
    {/* // <Notification/> */}
    </div>
  )
}

export default Chat
