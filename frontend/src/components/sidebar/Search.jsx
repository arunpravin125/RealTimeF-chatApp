import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoSearchCircleSharp } from "react-icons/io5";
import { useAuthContext } from "../../context/AuthContext";

const Search = () => {
 
  const { authUser, setSelectedConversation,searchData, setSearchData,conversations, setConversations } = useAuthContext();
  const [loading, setLoading] = useState(false);
   const [searchUser,setSearchUser] = useState("")

   

   const handleClearText = ()=>{
    setSearchUser("")
   }

  const searchButton = async () => {
    if (!searchUser.trim()) {
      toast.error("Please enter a username");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/message/search/${searchUser}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("User not found");

      const data = await res.json();
      console.log("searchedUser", data);

      // Check if conversation already exists
      const check = conversations.some(
        (conversation) => conversation.participants[0].username === data.username
      );

      const checkAlready = conversations.find(
        (conversation) => conversation.participants[0].username === data.username
      );
      console.log("check",check)
console.log("checkAlready",checkAlready)

      if (checkAlready) {
        setSelectedConversation({
          username: checkAlready.participants[0].username,
          profilePic: checkAlready.participants[0].profilePic,
          userId: checkAlready.participants[0]._id,
        });
      } else {
        let createConversation = {
          lastMessage: {
            sender: authUser?._id, // Use actual sender ID
            text: "Hi there!",
          },
          participants: [
            {
              profilePic: data?.profilePic,
              username: data?.username,
              _id: data?._id,
            },
          ],
          _id: data?._id,
        };

        setConversations((prev) => [...prev, createConversation]);
        setSelectedConversation({
          userId: data?._id,
          username: data?.username,
          profilePic: data?.profilePic,
          data: true,
        });
      }

      toast.success(`Conversation started with ${data.username}`);
    } catch (error) {
      console.log("Error in searchButton", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };


    
    useEffect(()=>{
       
       
         if(searchUser){
        const handleSearchUser = async()=>{
          try {
            const res = await fetch("/api/message/searchedUser",{
              method:"POST",
              headers:{
                "Content-Type":"application/json"
              },
              body:JSON.stringify({user:searchUser})
            })
            const data = await res.json()
            console.log("searchUser",data)
            setSearchData(data)
           
          } catch (error) {
            console.log("error in handleSearchUser",error)
            toast.error(error.message)
          }
        }
        handleSearchUser()
      }else{
        setSearchData([])
      }
          
    },[setSearchUser,searchUser])

   
  


  return (
    <div className="flex mt-2 justify-center relative items-center">
      <input
        value={searchUser}
        onChange={(e) => setSearchUser(e.target.value)  }
        className="p-1 rounded border border-gray-300"
        placeholder="Search username..."
      />
      {
        searchUser.length>0?  <p onClick={handleClearText} className="absolute right-16 top-1 p-1 h-7 items-center hover:text-slate-200 flex cursor-pointer text-xl bg-slate-400" >X</p>:null
      }
    
      <button onClick={searchButton} disabled={loading}>
        <IoSearchCircleSharp className="h-10 w-10 hover:fill-slate-300" />
      </button>
    </div>
  );
};

export default Search;
