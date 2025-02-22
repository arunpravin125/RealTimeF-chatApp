import React from 'react'
import { useAuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SuggestPerson = ({suggest}) => {
    const { authUser, setSelectedConversation, conversations, setConversations } = useAuthContext();
    const handleAddSuggest = (suggest)=>{
      try {
        let createConversation = {
          lastMessage: {
            sender: authUser?._id, // Use actual sender ID
            text: "Hi there!",
          },
          participants: [
            {
              profilePic: suggest?.profilePic,
              username: suggest?.username,
              _id: suggest?._id,
            },
          ],
          _id: suggest?._id,
        };
    
        setConversations((prev) => [...prev, createConversation]);
        setSelectedConversation({
          userId: suggest?._id,
          username: suggest?.username,
          profilePic: suggest?.profilePic,
          data: true,
        });
        toast((t) => (
          <span className='flex gap-5' >
            You added <b>{suggest.username}</b>
            <button onClick={() => toast.dismiss(t.id)}>
              Dismiss
            </button>
          </span>
        ));
      } catch (error) {
        console.log('error in handleAddSuggest',error)
        toast.error(error.message)
      }
    }

  return (
    <div className="flex  gap-8 bg-yellow-300 mt-2 p-2" >
      <div className="flex gap-3  " >
      <img className="h-10 w-10" src={suggest.profilePic} />
      <h2>{suggest.username}</h2>
     
      </div>
      <div>
      <button onClick={()=>handleAddSuggest(suggest)} className="bg-green-300 p-1" >Add</button>
      </div>
        

    </div>
  )
}

export default SuggestPerson