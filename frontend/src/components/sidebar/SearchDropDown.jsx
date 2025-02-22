import React from 'react'
import { useAuthContext } from '../../context/AuthContext'

const SearchDropDown = ({userSearch}) => {
      const { selectedConversation, authUser,messages,setMessages, setSelectedConversation, conversations, setConversations } = useAuthContext()
    const handleAddSearchUser = (user)=>{
console.log("seletedSearchUser",user)

  const checkConversation = conversations.some((conv)=>conv.participants[0]._id == user._id)
  console.log("checkConversation",checkConversation)
  let createConversation = {
    lastMessage: {
      sender: authUser?._id, // Use actual sender ID
      text: "Hi there!",
    },
    participants: [
      {
        profilePic: user?.profilePic,
        username: user?.username,
        _id: user?._id,
      },
    ],
    _id: user?._id,
  };
  if(checkConversation){
    // const checkOldCOn = conversations.map((conversation)=>conversation.participants)
    //  setConversations((prev) => [...prev, createConversation]);
     setSelectedConversation({
        userId: user?._id,
        username: user?.username,
        profilePic: user?.profilePic,
        user: true,
      });
  }else{
    setConversations((prev) => [...prev, createConversation]);
    setSelectedConversation({
        userId: user?._id,
        username: user?.username,
        profilePic: user?.profilePic,
        user: true,
      });
  }
  
 
    }
  return (
    <div>
         <div className="mt-2" onClick={()=>handleAddSearchUser(userSearch)} >
                <div className="chat chat-start bg-orange-200">
                  <div className="chat-image avatar flex gap-6">
                    <div className="w-10 rounded-full">
                      <img src={userSearch?.profilePic} />
                    </div>
                    <p>{userSearch?.username}</p>
                  </div>
                </div>
              </div>
            </div>
    
  )
}

export default SearchDropDown