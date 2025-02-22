import React, { useEffect, useState } from "react";
import ConversationList from "./ConversationList";
import { useGroupContext } from "../../../context/GroupContext";
import toast from "react-hot-toast";
const SideBar = () => {
  const {
    groupConversations,
    groupMessages,
    setGroupMessages,
    setGroupConversations,
    seletedGroup,
    setSeletedGroup,
  } = useGroupContext();
const [groupDetail,setGroupDetail] = useState({Name:"",description:""})
  useEffect(() => {
    const getGroupConversation = async () => {
      try {
        const res = await fetch("/api/groupConversation/getGroup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log("getGroupConversation", data);
        setGroupConversations(data);
      } catch (error) {
        console.log("error in getGroupConversation", error);
        toast.error(error.message);
      }
    };
    getGroupConversation();
  }, []);
  console.log("seletedGroup",seletedGroup)

  const handleCreateGroup = async()=>{
    try {
     const res = await fetch("/api/groupConversation/createGroup",{
      method:'POST',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({Name:groupDetail.Name,description:groupDetail.description})
     })
     const data = await res.json()
     console.log("CreatedGroup",data)
     setGroupConversations((prev)=>[...prev,data])
    } catch (error) {
      console.log("error in handleCreateGroup",error)
      toast.error(error.message)
    }
  }


  return (
    <div className={` ${groupConversations.length > 0?"h-52":"h-14"} w-60 bg-lime-400 p-1 overflow-auto `}>
      <div className="flex items-center justify-between p-1">
        <p className="text-center p-1 h-10 rounded-sm  bg-cyan-400">Groups</p>
        {/* You can open the modal using document.getElementById('ID').showModal() method */}
        <button
          className="btn"
          onClick={() => document.getElementById("my_modal_3").showModal()}
        >
          Create
        </button>
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <div className="flex flex-col items-center" >
              <div className="flex gap-2 p-1 items-center" >
                <h3>GroupName:</h3>
              <input placeholder="enter group name " className="p-1" value={groupDetail.Name} onChange={(e)=>{setGroupDetail({...groupDetail,Name:e.target.value})}} ></input>
              </div>
              <div className="flex gap-2 p-1 items-center" >
                <h3>Description:</h3>
              <input placeholder="enter description " className="p-1" value={groupDetail.description} onChange={(e)=>{setGroupDetail({...groupDetail,description:e.target.value})}} ></input>
              </div>
              <button onClick={handleCreateGroup} className="bg-gray-500 items-end hover:text-white h-10 w-15 p-1" >Create</button>
            </div>
          </div>
        </dialog>
      </div>

      {groupConversations.map((group) => {
        return (
          <div className="cursor-pointer" key={group._id}>
            <ConversationList group={group} />
          </div>
        );
      })}
    </div>
  );
};

export default SideBar;
