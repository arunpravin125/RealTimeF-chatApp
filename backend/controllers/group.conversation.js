import { GroupConversation } from "../models/groupConversation.model.js";
import { GroupMessage } from "../models/groupMessage.js";
import { User } from "../models/User.model.js";
import { io, getSocketId } from "../socket/socket.js"
export const createGroup = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { Name,description } = req.body;

    if (!Name || !description) {
      return res.status(400).json("please fill all to create group");
    }

    const checkNameAlreadyInGroup = await GroupConversation.findOne({groupName:Name})

    if(checkNameAlreadyInGroup){
      return res.status(400).json("This group already in Use")
    }

    // let addUsers = [];
    // addUsers.push(currentUserId);

    // for (let index = 0; index < users.length; index++) {
    //   const userId = users[index];
    //   const newUser = await User.findById(userId);
    //   addUsers.push(newUser._id);
    // }
    // let createGroup = await GroupConversation.findOne({
    //   participants: { $all: addUsers },
    // });


      let createGroup = await GroupConversation.create({
        participants:[currentUserId],
        description:description,
        groupCreatedBy: currentUserId,
        groupName: Name,
      });
      await createGroup.save();

    console.log("createGroup", createGroup);
    res.status(201).json(createGroup);
  } catch (error) {
    console.log("error in createGroup", error);
    res.status(401).json({ error: error.message });
  }
};

export const addUsers = async (req, res) => {
  try {
    const { id, users } = req.body;
    const currentUserId = req.user._id;
    let addUsers = await GroupConversation.findById(id);
    for (let index = 0; index < users.length; index++) {
      const add = users[index];
      const newUser = await User.findById(add);
      addUsers.participants.push(newUser._id);
    }
    await addUsers.save();
    console.log("addUsers", addUsers);
    res.status(200).json(addUsers);
  } catch (error) {
    console.log("error in addUsers", error);
    res.status(401).json({ error: error.message });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { groupId, groupText } = req.body;
    let groupCon = await GroupConversation.findById(groupId);
    if (!groupCon) {
      return res.status(400).json("group conversation error");
    }
    const checkingCurrentUser = groupCon.participants.includes(currentUserId);
    // console.log("checkingCurrentUser", checkingCurrentUser);

    if (checkingCurrentUser) {
      const groupMsg = new GroupMessage({
        groupConversationId: groupCon._id,
        groupMessage: groupText,
        senderId: currentUserId,
      });
      await groupMsg.save();

      const fullDetailedMsg = await GroupMessage.findById(
        groupMsg._id
      ).populate({ path: "senderId", select: "username profilePic" });
     
     groupCon.participants.map((participant)=>{
      const socket = getSocketId(participant.toString())
      console.log("socketParticipant",socket)
      if(socket !== "undefined" && participant.toString() !== currentUserId.toString()){
        
        io?.to(socket).emit("groupMessageListen",(fullDetailedMsg))
      }
    })
  
      // const socket = getSocketId()  
      // if(socket){
      //   io.to()
      // }
   
      res.status(200).json(fullDetailedMsg);
    } else {
      return res.status(400).json("you are not in group");
    }
  } catch (error) {
    console.log("error in groupMessage", error);
    res.status(400).json({ error: error.message });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id } = req.body;
    const groupConversation = await GroupConversation.findById(id);
    let groupMessages = await GroupMessage.find({
      groupConversationId: groupConversation?._id,
    })
      .sort({ createAt: 1 })
      .populate({ path: "senderId", select: "username profilePic" });

    res.status(200).json(groupMessages);
  } catch (error) {
    console.log("error in getGroupMessage", error);
    res.status(400).json({ error: error.message });
  }
};

export const getGroup = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    let getConversationGroup = await GroupConversation.find().populate({
      path: "participants groupCreatedBy",
      select: "username profilePic",
    });
    console.log("getConversationGroup", getConversationGroup);
    const getGroupUser = [];
    const getGroup = getConversationGroup.filter((group) =>
      group.participants.map((participant) => {
        if (participant._id.toString() == currentUserId.toString()) {
          return getGroupUser.push(group);
        }
      })
    );
    console.log("getGroupUser", getGroupUser);
    res.status(200).json(getGroupUser);
  } catch (error) {
    console.log("error in getGroup", error);
    res.status(400).json({ error: error.message });
  }
};

export const getGroupParticipants = async (req, res) => {
  try {
    const { id } = req.body;
    const groupConversation = await GroupConversation.findById(id).populate({
      path: "participants",
      select: "username profilePic",
    });
    const onlyParticipants = [];
    groupConversation.participants.map((participants) => {
      if (
        !onlyParticipants.some((partici) =>
          partici._id.toString().includes(participants._id.toString())
        )
      ) {
        return onlyParticipants.push({
          _id: participants._id,
          username: participants.username,
          profilePic: participants.profilePic,
        });
      }
    });
    // console.log("onlyParticipants",onlyParticipants)
    res.status(200).json(onlyParticipants);
  } catch (error) {
    console.log("error in getGroupParticipants", error);
    res.status(400).json({ error: error.message });
  }
};

export const removeParticipantsFromGroup = async (req, res) => {
  try {
    const { removeUserId, groupId } = req.body;
    const currentUserId = req.user._id;
    const checkGroupIsCreatedByme = await GroupConversation.findById(groupId);
    if (
      checkGroupIsCreatedByme.groupCreatedBy.toString() !==
      currentUserId.toString()
    ) {
      return res.status(400).json("operation add/remove not allowed for you");
    }
    let getGroup = await GroupConversation.findByIdAndUpdate(
      { _id: groupId },
      { $pull: { participants: removeUserId } }
    );
    await getGroup.save();
    const checkGroupIsCreatedFinal = await GroupConversation.findById(groupId);
    console.log("getGroup", getGroup);
    res.status(200).json(checkGroupIsCreatedFinal);
  } catch (error) {
    console.log("error in removeParticipantsFromGroup", error);
    res.status(401).json({ error: error.message });
  }
};
export const addParticipantsFromGroup = async (req, res) => {
  try {
    const { addUserId, groupId } = req.body;
    const currentUserId = req.user._id;
    const checkGroupIsCreatedByme = await GroupConversation.findById(groupId);
    const newParticipant = [];
    if (
      checkGroupIsCreatedByme.groupCreatedBy.toString() !==
      currentUserId.toString()
    ) {
      return res.status(400).json("operation add/remove not allowed for you");
    }
    const checkingParticipants = checkGroupIsCreatedByme.participants.some(
      (part) => part.toString().includes(addUserId.toString())
    );

    console.log("checkingParticipants", checkingParticipants);
    if (checkingParticipants) {
      return res.status(400).json("already in group");
    }
    let getGroup = await GroupConversation.findOneAndUpdate(
      { _id: groupId },
      { $push: { participants: addUserId.toString() } }
    );
    const getFinalValue = await GroupConversation.findById(groupId).populate({
      path: "participants",
      select: "username profilePic",
    });
    getFinalValue.participants.map((participant) => {
      if (addUserId.toString() == participant._id.toString()) {
        return newParticipant.push({
          _id: participant._id,
          username: participant.username,
          profilePic: participant.profilePic,
        });
      }
    });
    await getGroup.save();
    res.status(200).json(newParticipant);
  } catch (error) {
    console.log("error in removeParticipantsFromGroup", error);
    res.status(401).json({ error: error.message });
  }
};

export const getSuggestedUsers = async(req,res)=>{
  try {
    const {groupId} = req.body
    const users = await User.find()
    const suggestedUser = []
    const getGroup = await GroupConversation.findById(groupId).populate({path:"participants",select:"username profilePic"})

    const gettingNew = users.map((user)=>{
      if(!getGroup.participants.some((part)=>part._id.toString().includes(user._id.toString()))){
        return suggestedUser.push({
          _id:user._id,
          username:user.username,
          profilePic:user.profilePic
        })
      }
    })
    // const getNewGroup = getGroup.participants.map((participant)=>{
    //   if(!users.some((par)=>par._id.toString().includes(participant._id.toString()))){
    //     return suggestedUser
    //   }
    // })
    // console.log("suggestGroupUsers",suggestedUser)
res.status(200).json(suggestedUser)
  } catch (error) {
    console.log("error in getSuggestedUsers",error)
    res.status(400).json(error.message)
  }
}


export const deleteGroup = async(req,res)=>{
  try {
    const currentUserId = req.user._id
    const {groupId} = req.body

    const checkGroup = await GroupConversation.findById(groupId)
    
    if(!checkGroup){
      return res.status(401).json({error:"group does not exist"})
    }


    if(checkGroup?.groupCreatedBy.toString() == currentUserId?.toString()){
      await GroupConversation.findByIdAndDelete(groupId)
      res.status(200).json(`group ${checkGroup.groupName} was deleted`)
    }

  } catch (error) {
    console.log('error in deleteGroup',error)
    res.status(400).json({error:error.message})
  }
}