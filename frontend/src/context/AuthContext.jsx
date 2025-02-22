import { createContext, useContext, useState } from "react";


export const AuthContext = createContext()

export const useAuthContext = () =>{
    return useContext(AuthContext)
}

export const StoreContextProvider = ({children})=>{

    const [authUser,setAuthUser] = useState(JSON.parse(localStorage.getItem("chatUser"))|| null)
    const [selectedConversation,setSelectedConversation] = useState()
    const [conversations,setConversations] = useState([])
    const [messages,setMessages] = useState([])
     const [searchData, setSearchData] = useState([]);
    return (<AuthContext.Provider value={{messages,searchData, setSearchData,setMessages,conversations,setConversations,authUser,setAuthUser,selectedConversation,setSelectedConversation}}>
        {children}
    </AuthContext.Provider>)
}