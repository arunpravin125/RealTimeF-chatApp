import React, { useEffect } from "react";
import { useGroupContext } from "../../../context/GroupContext";
import toast from "react-hot-toast";
import { CiCircleRemove } from "react-icons/ci";
import { useAuthContext } from "../../../context/AuthContext";
import { MdAddCircleOutline } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
export const GroupMessageHeader = () => {
  const {
    groupParticipants,
    setGroupParticipants,
    groupConversations,
    groupMessages,
    setGroupMessages,
    setGroupConversations,
    seletedGroup,
    setSeletedGroup,
    suggestedGroupParticipants,
    setSuggestedGroupParticipants,
  } = useGroupContext();
  const {
    selectedConversation,
    authUser,
    messages,
    setMessages,
    setSelectedConversation,
    conversations,
    setConversations,
  } = useAuthContext();

  useEffect(() => {
    const handleGetParticipants = async (id) => {
      try {
        const res = await fetch("/api/groupConversation/getParticipants", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: seletedGroup?.groupId }),
        });
        const data = await res.json();
        console.log("getGroupParticipants", data);
        setGroupParticipants(data);
      } catch (error) {
        console.log("error in getGroupPartcipants", error);
        toast.error(error.message);
      }
    };
    handleGetParticipants();
  }, [seletedGroup?.groupId]);

  const handleRemoveParticipants = async (id) => {
    try {
      const res = await fetch("/api/groupConversation/removeParticipants", {
        method: "POST",
        headers: {
          "COntent-Type": "application/json",
        },
        body: JSON.stringify({
          removeUserId: id,
          groupId: seletedGroup?.groupId,
        }),
      });
      const data = await res.json();
      console.log("removeParticipant", data);
      const findUserRemove = groupParticipants.find((participant)=>participant._id == id)
      console.log("removeUserFromGroup",findUserRemove)
      setSuggestedGroupParticipants((prev)=>[...prev,findUserRemove])
      setGroupParticipants((prev) =>
        prev.filter((participants) => {
          const removeParticipant = participants._id !== id;
          return removeParticipant;
        })
      );
    } catch (error) {
      console.log("error in RemoveParticipants", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const getSuggestUsers = async (req, res) => {
      try {
        const res = await fetch("/api/groupConversation/suggestParticipants", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ groupId: seletedGroup?.groupId }),
        });
        const data = await res.json();
        console.log("getGroupSuggestedUsers", data);
        setSuggestedGroupParticipants(data);


      } catch (error) {
        console.log("error in getSuggestedUsers", error);
        toast.error(error.message);
      }
    };
    getSuggestUsers();
  }, [seletedGroup?.groupId]);

const handleAddSuggestUser = async(id)=>{

try {
    const res = await fetch("/api/groupConversation/addParticipants",{
      method:"POST",
      headers:{
        "COntent-Type":"application/json"
      },
      body:JSON.stringify({addUserId:id,groupId:seletedGroup?.groupId})
    })
    const data = await res.json()
    console.log("addSuggestToGroup",data)
    const findUser = suggestedGroupParticipants.find((participant)=>participant._id == id)
    setGroupParticipants((prev)=>[...prev,findUser])
    console.log("findUser",findUser)
    setSuggestedGroupParticipants((prev)=>prev.filter((participants)=>participants._id !== id))
} catch (error) {
  console.log("error Add SuggestedUser",error)
  toast.error(error.message)
}
}
const deleteGroup = async(id)=>{
  try {
    const res = await fetch("/api/groupConversation/deleteGroup",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({groupId:id})
    })
    const data = await res.json()
    console.log("deleteGroup",data)
   toast.success(data)
   setSeletedGroup("")
   setGroupConversations((prev)=>prev.filter((partici)=>partici._id !== id))
  } catch (error) {
    console.log("error in deleteGroup",error)
    toast.error(error.message)
  }
}

  return (
    <div className="flex items-center justify-evenly bg-[#d07fe2]  w-96 p-1">
      <div>  
        <h2 className="text-lg text-center h-8 ">{seletedGroup?.groupName}</h2>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
{ seletedGroup.groupCreatedUserId == authUser._id?<MdDeleteOutline  onClick={()=>document.getElementById('my_modal_5').showModal()} className="size-5 text-slate-200 cursor-pointer hover:text-red-700" />:null}
<dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Are you want delete this group?</h3>
 
    <div className="modal-action flex justify-between">
      <button onClick={()=>deleteGroup(seletedGroup?.groupId)} ><MdDeleteOutline className="text-red-500  size-10" /></button>
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn">Cancel</button>
      </form>
    </div>
  </div>
</dialog>
       
      </div>
     
      {/* You can open the modal using document.getElementById('ID').showModal() method */}
      <details className="dropdown">
        <summary className="m-1 btn h-7 w-20">Participants</summary>
        <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
          <li className="h-56 overflow-auto flex flex-row gap-1">
            {groupParticipants.map((participants) => {
              return (
                <div key={participants._id} className="chat chat-start">
                  <div className="chat-image  avatar flex items-center gap-3">
                    <div className="w-10 rounded-full">
                      <img src={participants?.profilePic} />
                    </div>
                    <p>{participants?.username}</p>
                    {seletedGroup?.groupCreatedUserId == authUser?._id ? (
                      <>
                        <button
                          onClick={() =>
                            handleRemoveParticipants(participants._id)
                          }
                        >
                          {" "}
                          <CiCircleRemove className="h-10 w-6 hover:fill-red-500 " />{" "}
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </li>
        </ul>
      </details>
      <details  className="dropdown dropdown-right">
        <summary className="m-1 btn">
          <MdAddCircleOutline className="h-10 w-8" />
        </summary>
        <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
          <li>
            {
              suggestedGroupParticipants.length >0?<>{
              suggestedGroupParticipants.map((participant)=>{
                return (
                  <div key={participant._id} className="chat chat-start items-center">
                  <div className="chat-image avatar flex gap-3 items-center">
                    <div className="w-10 rounded-full">
                      <img src={participant.profilePic} />
                    </div>
                    <p>{participant.username}</p>
                  </div>
                  <button onClick={()=>handleAddSuggestUser(participant._id)} className="hover:bg-green-500 rounded-md">
                  <IoMdAdd className="h-8 w-6"  />
                  </button>
                </div>
                )
              })
             }</>:<p>No Users</p>
            }

          </li>
        </ul>
      </details>
    </div>
  );
};
