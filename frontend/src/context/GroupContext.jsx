import { createContext, useContext, useEffect, useState } from "react";

export const groupContext = createContext()

export const useGroupContext = ()=>{
    return useContext(groupContext)
}


export const GroupSocketContext = ({children})=>{

const [groupConversations,setGroupConversations] = useState([])
const [seletedGroup,setSeletedGroup] = useState()
const [groupMessages,setGroupMessages] = useState([])
const [groupParticipants,setGroupParticipants] = useState([])
const [suggestedGroupParticipants,setSuggestedGroupParticipants] = useState([])

useEffect(()=>{

    return () => setSeletedGroup(null)
},[])


return ( <groupContext.Provider  value={{groupParticipants,suggestedGroupParticipants,setSuggestedGroupParticipants,setGroupParticipants,groupConversations,groupMessages,setGroupMessages,setGroupConversations,seletedGroup,setSeletedGroup}} >
    {children}
</groupContext.Provider>)
}
