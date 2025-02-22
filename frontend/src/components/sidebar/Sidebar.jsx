import React, { useEffect, useState } from "react";
import Search from "./Search";
import Conversations from "./Conversations";
import { RiLogoutBoxLine } from "react-icons/ri";
import toast from "react-hot-toast";
import { useAuthContext } from "../../context/AuthContext";
import SearchDropDown from "./SearchDropDown";
const Sidebar = () => {
  const [loading, setLoading] = useState(false);

  const {
    selectedConversation,
    authUser,
    setAuthUser,
    setSelectedConversation,
    conversations,
    setConversations,
    searchData,
    setSearchData,
  } = useAuthContext();

  const logoutBtn = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      localStorage.removeItem("chatUser");
      setAuthUser("");
      console.log("logout", data);
      toast.success(data);
    } catch (error) {
      console.log("error in logout", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <div className="w-72 p-2 h-4/4 relative bg-emerald-500 mr-2">
      <Search />
      
      {
        searchData.length !== 0? <div className={`bg-white border border-black  w-48 ${searchData.length>3?"h-44":"h-32"} left-7 absolute top-12 p-1 overflow-auto`} >
        {
         searchData.map((userSearch)=>{
           return <div key={userSearch._id} >
             <SearchDropDown userSearch={userSearch} />
           </div>
         })
        }
       
          
         </div>:null
      }
      <p className="divider h-1 w-60"></p>
      <Conversations />
      <button onClick={logoutBtn}>
        <RiLogoutBoxLine className="h-5 mt-2 w-5" />
      </button>
    </div>
  );
};

export default Sidebar;
