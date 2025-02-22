import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import SuggestPerson from './SuggestPerson'
import { useAuthContext } from '../../context/AuthContext'

const SuggestedUsers = () => {
    const [suggestUser,setSuggestedUser] = useState([])
const { selectedConversation, authUser, setSelectedConversation, conversations, setConversations } = useAuthContext()


    useEffect(()=>{
        const handleSuggest = async()=>{
            try {
                const res = await fetch("/api/message/suggest",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    }
                })
                const data = await res.json()
                console.log("handleSuggestUser",data)
                setSuggestedUser(data)
           
                if(selectedConversation?.username){
                    const finalSuggest =  suggestUser.filter((prevSugg =>prevSugg.username !== selectedConversation?.username))
                   
                    setSuggestedUser(finalSuggest)
                }
            } catch (error) {
                console.log("error in suggestUser",error)
                toast.error(error.message)
            }
        }
        handleSuggest()
    },[selectedConversation,authUser])

  return (
    <div className={`ml-3 h-60 overflow-auto w-1/5 ${suggestUser.length==0?"":"bg-stone-400"} p-1`} >
        {
            suggestUser.length == 0?<>

            </>:<>
            <h1>SuggestedUsers</h1>
        {
            suggestUser.map((suggest,ind)=>{
                return (<div key={suggest._id} >
                    <SuggestPerson suggest={suggest} />
                </div>)
            })
        }
            </>
        }
      
        

    </div>
  )
}

export default SuggestedUsers