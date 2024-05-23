import React, { useEffect, useState, useRef } from "react";
import Modal from "react-modal";
import notification from "../assets/sound/notification.mp3";
import sendMessageAudio from "../assets/sound/sentmessage.mp3";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { fetchData } from "../api/FetchData";
import { useUser } from "../context/UserContext";
import { formatTimestamp } from "../utils/DateConvert";
import { postData } from "../api/PostData";
import { useSocketContext } from "../context/SocketContext";
import { updateData } from "../api/updateData";
import Message from "./Message";
import Badge from "./Badge";
const ChatBox = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTop, setModalTop] = useState(0);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [socketChat, setSocketChat] = useState([]);
  const queryClient = useQueryClient();
  const { user } = useUser();
  const {
    socket,
    setNotifications,
    setSelectedUser,
    onlineUsers,
    notifications,
  } = useSocketContext();
  const lastMessageRef = useRef(null);
  // query for accessing chats
  const {
    data: users,
    isLoading,
    refetch: refetchChats,
  } = useQuery("admins", () => fetchData("chat/chats"), {
    refetchOnMount: false,
    staleTime: Infinity,
  });

  // query for messages
  const {
    data: messages,
    isLoading: chatLoading,
    refetch,
  } = useQuery(
    ["messages", selectedChat?.chatId],
    () =>
      fetchData(selectedChat ? `chat/messages/${selectedChat?.chatId}` : ""),
    {
      enabled: !!selectedChat?.chatId,
      refetchOnMount: false,
      staleTime: Infinity,
    }
  );
  //effect for new message
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notification);
      sound.play();

      queryClient.setQueryData(
        ["messages", selectedChat?.chatId],
        (prevData) => ({
          ...prevData,
          messages: [...(prevData?.messages || []), newMessage],
        })
      );
    });
    return () => {
      socket?.off("newMessage");
    };
  }, [socket, queryClient, selectedChat]);
  //effect for notifications
  useEffect(() => {
    socket?.on("notifications", (unreadMessages) => {
      if (!selectedChat) {
        setNotifications(unreadMessages?.totalUnreadMessages);
        setSocketChat(unreadMessages?.unreadMessages);
      }
    });

    return () => {
      socket?.off("notifications");
    };
  }, [socket, setNotifications, selectedChat]);
  // effect for last message scroll
  useEffect(() => {
    if (messages) {
      setAllMessages(messages);
    }
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, [allMessages, setAllMessages, messages]);
  // mutation for sending new message
  const sendMessageMutation = useMutation(
    (newMessage) =>
      postData(`chat/add-message/${selectedChat?.chatId}`, {
        message: newMessage,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["messages", selectedChat?.chatId]);
        const sound = new Audio(sendMessageAudio);
        sound.play();
      },
    }
  );
  // mutation for updating status of all messages for opened chat
  const updateMessageStatusMutation = useMutation(
    (chatId) => updateData(`chat/update-chat/${chatId}`),
    {
      onSuccess: (_data, _variables) => {
        // Update cached data for messages
        queryClient.setQueryData(
          ["messages", selectedChat?.chatId],
          (prevMessages) => {
            if (prevMessages) {
              return {
                ...prevMessages,
                messages: prevMessages?.messages?.map((message) => ({
                  ...message,
                  read: true,
                })),
              };
            }
            return prevMessages;
          }
        );
      },
    }
  );

  // open single  chat
  const openSingleChat = async (chatId, completeDetail) => {
    setNotifications(0);
    setSelectedChat(completeDetail);
    setSelectedUser(completeDetail);
    await updateMessageStatusMutation.mutateAsync(chatId);
  };
  // logic for chat modal opening and closing
  const openChat = (e) => {
    const pos = e.target.getBoundingClientRect();
    setModalTop(pos.bottom - pos.top);
    setIsModalOpen(!isModalOpen);
  };
  // message submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "") {
      return null;
    }
    await sendMessageMutation.mutateAsync(message);
    setMessage("");
  };
  const closeChat = () => {
    setSelectedChat(null);
    setSelectedUser(null);
    refetchChats();

    // console.log("closed");
  };
  // classes
  // console.log(onlineUsers);

  return (
    <>
      <div className="  absolute bottom-5 right-2">
        <button
          onClick={(e) => openChat(e)}
          className="border p-2 border-slate-700 rounded-full bg-green-600 cursor-pointer hover:bg-green-500 transition-all duration-300 ease-in-out focus:bg-green-500  "
        >
          {isModalOpen ? "Close Chat" : " Chat with Admins"}
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setSelectedChat(null);
          setIsModalOpen(false);
        }}
        style={{
          content: {
            width: "25rem",
            height: "calc(100vh - 100px)",
            display: "flex",
            // flex: "1 1 0%",
            alignItems: "start",
            position: "absolute",
            top: `${modalTop}px`,
            left: "calc(100% - 29rem - 16px)",
            backgroundColor: "#334155",
            border: "2px solid #334155",
            boxShadow: "2px 2px 2px #334155, -2px -2px -2px #334155",
            color: "white",
            padding: "0px",
            overflow: "hidden",
          },
          overlay: {
            background: "#00000077",
          },
        }}
      >
        <div
          style={{
            height: "calc(100vh - 100px)",
          }}
          className="w-full  flex flex-col"
        >
          <div className=" flex  space-x-6 items-center border-b border-slate-600 p-3 ">
            {selectedChat !== null && (
              <i
                onClick={closeChat}
                className=" border p-2 rounded-full hover:bg-slate-500 transition cursor-pointer   fa-solid fa-arrow-left-long"
              ></i>
            )}
            {selectedChat === null && (
              <i className="fa-solid fa-comments text-2xl text-blue-600"></i>
            )}
            <p className="text-lg font-semibold">
              {selectedChat ? selectedChat?.name : "Chat with Admin"}
            </p>
          </div>
          {selectedChat === null && (
            <div className="flex  flex-col flex-1 ">
              {users?.map((item) => (
                <div
                  onClick={() => openSingleChat(item.chatId, item)}
                  className="border-b flex space-x-3 items-start  border-slate-400/40 cursor-pointer hover:bg-slate-500/50 transition-all duration-300 ease-in-outs p-2 bg-slate-500/70"
                  key={item?._id}
                >
                  <div>
                    <img
                      className="w-12 h-12 object-cover rounded-full"
                      src={item?.picture}
                      alt={item?.name}
                    />
                  </div>
                  <div className="flex flex-1 items-center justify-between px-2 ">
                    <div className="flex flex-col">
                      <p>{item?.name}</p>
                      <div className="text-slate-300 font-normal text-sm  flex items-center space-x-1">
                        {item?.lastMessage !== null && (
                          <p>
                            {item?.lastMessage?.sender === user?._id
                              ? "You"
                              : item?.name}
                            :
                          </p>
                        )}
                        <p className="">
                          {item?.lastMessage === null
                            ? "No Messages Yet"
                            : item?.lastMessage?.text}
                        </p>
                      </div>
                    </div>
                  </div>
                  {socketChat?.map(
                    (notification) =>
                      item?.chatId.toString() ===
                        notification?.chatId.toString() && (
                        <Badge
                          key={notification?.chatId}
                          text={notification?.unreadMessages?.length}
                        />
                      )
                  )}
                </div>
              ))}
            </div>
          )}
          {selectedChat !== null && (
            <>
              {}
              <div className="flex flex-col flex-1 overflow-y-scroll overflow-x-hidden scroll scroll-smooth bg-slate-800/90 bg-image">
                {messages?.messages?.length === 0 ? (
                  <div className="flex flex-1 justify-center items-center">
                    <p className="text-5xl text-white">No Messages Yet!</p>
                  </div>
                ) : (
                  messages?.messages?.map((message) => (
                    <div
                      ref={lastMessageRef}
                      className={`flex w-full text-sm space-x-1 p-2 ${
                        user?._id === message?.sender?._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                      key={message?._id}
                    >
                      <img
                        className="w-12 h-12 rounded-full object-cover"
                        src={message?.sender?.picture}
                        alt=""
                      />
                      <div
                        className={` flex flex-col px-2 py-1 shadow-xl shadow-slate-700/40 ${
                          message.shouldShake && "shake"
                        } ${
                          user?._id === message?.sender?._id
                            ? "bg-blue-600 "
                            : "bg-slate-900/90"
                        }  rounded-xl`}
                      >
                        <div className="flex flex-col px-2 py-1 space-y-1">
                          <div className="flex space-x-2 items-center">
                            <p>{message?.sender?.fullname}</p>
                            <p className="text-[8px] text-right">
                              {formatTimestamp(message?.createdAt)}
                            </p>
                          </div>
                          <p className="text-[1rem] text-end">
                            {message?.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
          {selectedChat !== null && (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="w-full flex items-center space-x-3 border-t border-slate-600 p-3 "
            >
              <input
                className="w-full h-fit bg-slate-700 p-2 rounded-full border border-slate-500 outline-none  focus:border-blue-600 "
                placeholder="Write message here"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                type="text"
              />
              <button type="submit">
                <i className="fa-solid fa-paper-plane text-indigo-500 cursor-pointer"></i>
              </button>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ChatBox;
