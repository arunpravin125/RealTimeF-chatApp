import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notification/receiveNotifi", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      console.log("notification", data);
      setNotifications(data);
    } catch (error) {
      console.log("error in notification", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [setNotifications]);

  const markAsRead = async(id) => {
   try {
     const res = await fetch(`/api/notification/readNotifi/${id}`,{
         method:"POST",
         headers:{
             "Content-Type":"application/json"
         }
     })
     const data = await res.json()
     console.log("readNotfication",data)
      
     setNotifications((prev) =>
       prev.map((notif) => (notif._id === id ? { ...notif, read:"true" } : notif))
     );
   } catch (error) {
    console.log("error in markAsRead",error)
    toast.error(error.message)
   }
  };

  const deleteNotification = async(id) => {
    try {
        const res = await fetch(`/api/notification/deleteNotifi/${id}`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            }
        })
        const data = await res.json()
        console.log("deleteNotfication",data)
        setNotifications((prev) => prev.filter((notif) => notif._id !== id));
        toast.success("noticication deleted")
    } catch (error) {
        console.log("error in deleteNotification",error)
        toast.error(error.message)
    }
  };

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <h2 className="text-lg font-bold mb-4">Notifications</h2>
      <button
        onClick={fetchNotifications}
        className="mb-4 px-3 py-1 bg-gray-700 text-white rounded"
      >
        Refresh
      </button>
      <div className="max-w-md mx-auto p-4 h-72 overflow-auto border rounded w-full">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center">No new notifications.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-3 mb-2 border rounded flex items-center gap-3 ${notification.read === "true" ? "bg-gray-100" : "bg-white"}`}
            >
              <img
                src={notification.From.profilePic}
                alt={notification.From.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium">{notification.From.username}</p>
                <p className="text-xs text-gray-600">{notification.text.length > 20 ?<>{notification.text.slice(0,19)}...</>:notification.text}</p>
              </div>
              <div className="flex gap-2">
                {notification.read !== "true" && (
                  <button
                    className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
                    onClick={() => markAsRead(notification._id)}
                  >
                    Read
                  </button>
                )}
                <button
                  className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                  onClick={() => deleteNotification(notification._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
