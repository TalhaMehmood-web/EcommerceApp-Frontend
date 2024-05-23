import React, { useEffect, useState } from "react";
import { fetchData } from "../api/FetchData";
import { postData } from "../api/PostData";
import { useQuery, useMutation, useQueryClient } from "react-query";
import ChatButtons from "./ChatButtons";
import ConversationListItem from "./ConversationListItem";
import { useUser } from "../context/UserContext";
import ConversationSkeleton from "../skeleton/ConversationSkeleton";
import Message from "./Message";
import { useSocketContext } from "../context/SocketContext";
import MessageSkeleton from "../skeleton/MessageSkeleton";
import sendMessageAudio from "../assets/sound/sentmessage.mp3";
import notification from "../assets/sound/notification.mp3";
import EmojiPicker from "emoji-picker-react";
const Conversation = () => {
  const { selectedChat, setSelectedChat, user } = useUser();
  const { onlineUsers, socket } = useSocketContext();
  const [message, setMessage] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const queryClient = useQueryClient();
  const [sendedMessage, setSendedMessage] = useState({});
  const [openChatDrawer, setOpenChatDrawer] = useState(false);
  // calling api's
  // fetching conversations
  const {
    data: users,
    isLoading: isConversationLoading,
    refetch: refetchChats,
  } = useQuery("admins", () => fetchData("chat/chats"), {
    refetchOnMount: false,
    staleTime: Infinity,
  });
  // fetching chat or messages
  const {
    data: messages,
    isLoading: isMessagesLoading,
    refetch: fetchMessages,
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
  const sendMessageMutation = useMutation(
    (newMessage) =>
      postData(`chat/add-message/${selectedChat?.chatId}`, {
        message: newMessage,
      }),
    {
      onMutate: () => {
        setMessage("");
        setOpenEmoji(false);
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["messages", selectedChat?.chatId]);
        const sound = new Audio(sendMessageAudio);
        sound.play();
      },
    }
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "") {
      return null;
    }
    await sendMessageMutation.mutateAsync(message);
    setMessage("");
  };
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      if (newMessage) {
        queryClient.invalidateQueries("admins");
      }
      newMessage.shouldShake = true;
      const sound = new Audio(notification);
      if (user?._id !== newMessage?.sender._id) {
        sound.play();
      }

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
  }, [socket, queryClient, selectedChat, user]);
  useEffect(() => {
    fetchMessages();
    if (!selectedChat) {
      setSelectedChat(users?.[0]);
    }
  }, [selectedChat, setSelectedChat, users, fetchMessages]);
  const handleEmoji = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
  };
  return (
    <div className="flex flex-1 relative ">
      <div className="hidden sm:w-32 lg:w-96 sm:flex flex-col space-y-3 lg:space-y-5  lg:p-2 p-0  duration-300  ">
        <div
          className="lg:inline-flex hidden  justify-center items-center rounded-md shadow-sm"
          role="group"
        >
          <ChatButtons title={"All"} />
          <ChatButtons title={"Read"} />
          <ChatButtons title={"Unread"} />
        </div>
        <div className="dropdown lg:hidden block  m-0 p-0">
          <div tabIndex={0} role="button" className="flex justify-center">
            <i className="fa-solid fa-ellipsis-vertical text-2xl cursor-pointer  "></i>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-slate-950  rounded-box w-32"
          >
            <li>
              <a>All</a>
            </li>
            <li>
              <a>Read</a>
            </li>
            <li>
              <a>Unread</a>
            </li>
          </ul>
        </div>

        <div className="flex h-[32rem]   scroll-smooth pl-2 py-2 flex-col border border-slate-700/30 rounded-md overflow-y-scroll overflow-x-hidden scroll bg-slate-900">
          {isConversationLoading
            ? Array.from({ length: 6 }).map((_, index) => (
                <ConversationSkeleton key={index} />
              ))
            : users?.map((user) => (
                <ConversationListItem
                  key={user?._id}
                  name={user?.name}
                  picture={user?.picture}
                  lastMessage={user?.lastMessage?.text}
                  time={user?.lastMessage?.createdAt}
                  chat={user}
                />
              ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col  ">
        <div className="py-3 px-6 flex items-center justify-between sm:justify-start sm:space-x-5 bg-slate-600/10 ">
          <i
            onClick={() => setOpenChatDrawer(true)}
            className="fa-solid fa-chevron-down sm:hidden block cursor-pointer"
          ></i>
          <p className="sm:text-3xl text-xl font-semibold">
            {selectedChat?.name}
          </p>
          <div className="flex items-center space-x-3">
            <i className="fa-solid fa-circle text-[10px] text-green-500 animate-pulse"></i>
            <p className="text-lg  text-slate-400  xs:block hidden">
              Active Now
            </p>
          </div>
        </div>
        <div className="h-[28rem]  border-y border-slate-700/50 overflow-y-scroll overflow-x-hidden scroll  space-y-2 flex  flex-col p-2 bg-slate-950">
          {isConversationLoading || isMessagesLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <MessageSkeleton key={index} />
              ))
            : messages?.messages?.map((message) => (
                <Message
                  key={message._id}
                  message={message.text}
                  messageDate={message?.createdAt}
                  senderId={message?.sender?._id}
                  senderPicture={message?.sender?.picture}
                  sendedBy={message?.sender?.fullname}
                  shake={message?.shouldShake}
                />
              ))}
        </div>
        <div className="mt-2">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full flex items-center space-x-3   "
          >
            <div className="absolute top-32   ">
              <EmojiPicker
                onEmojiClick={(emoji) => handleEmoji(emoji)}
                open={openEmoji}
                width={"300px"}
                theme="dark"
              />
            </div>
            <i
              onClick={() => setOpenEmoji(!openEmoji)}
              className="fa-solid fa-face-smile cursor-pointer relative"
            ></i>
            <input
              onFocus={() => setOpenEmoji(false)}
              className="w-full h-fit outline-none border border-slate-700 p-2 rounded-md  bg-transparent  focus:border-blue-600 "
              placeholder="Write message here"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              type="text"
            />
            <button
              className="flex items-center sm:space-x-3 rounded-md bg-blue-500 hover:bg-blue-600 focus:bg-blue-600 duration-200 px-3 py-2 "
              type="submit"
            >
              <p className="sm:block hidden">Send</p>
              <i className="fa-solid fa-paper-plane text-sm text-white cursor-pointer"></i>
            </button>
          </form>
        </div>
      </div>

      <div
        className={`absolute top-0 bg-slate-800 flex sm:hidden  w-full ${
          openChatDrawer ? "h-full  " : "h-0  "
        } duration-300  `}
      >
        <div
          className={`${
            openChatDrawer ? "block" : "hidden"
          }  p-5  flex flex-1 `}
        >
          <div className="flex flex-1 space-y-4  flex-col">
            <div
              className="inline-flex  xs:space-x-0 space-x-3   justify-between items-center rounded-md shadow-sm"
              role="group"
            >
              <i
                onClick={() => setOpenChatDrawer(false)}
                className="fa-solid fa-chevron-up sm:hidden block cursor-pointer"
              ></i>
              <div className="flex flex-1 flex-wrap justify-center">
                <ChatButtons title={"All"} />
                <ChatButtons title={"Read"} />
                <ChatButtons title={"Unread"} />
              </div>
            </div>
            <div className="flex h-[32rem]   scroll-smooth pl-2 py-2 flex-col border border-slate-700/30 rounded-md overflow-y-scroll overflow-x-hidden  scroll bg-slate-900">
              {isConversationLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <ConversationSkeleton key={index} />
                  ))
                : users?.map((user) => (
                    <ConversationListItem
                      key={user?._id}
                      name={user?.name}
                      picture={user?.picture}
                      lastMessage={user?.lastMessage?.text}
                      time={user?.lastMessage?.createdAt}
                      chat={user}
                      shouldModalOpen={true}
                      setOpenChatDrawer={setOpenChatDrawer}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
