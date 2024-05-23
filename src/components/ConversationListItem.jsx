import React, { useEffect } from "react";
import { formatTimestamp } from "../utils/DateConvert";
import { useUser } from "../context/UserContext";
const ConversationListItem = ({
  picture,
  name,
  time,
  lastMessage,
  chat,
  shouldModalOpen,
  setOpenChatDrawer,
}) => {
  const { setSelectedChat, selectedChat } = useUser();

  const shouldBackgroundColorChange =
    selectedChat?.chatId === chat?.chatId ? "bg-slate-700/50" : "";
  const shouldModalOpenClass = shouldModalOpen ? "block" : "hidden lg:block";
  const handleSelectedChat = () => {
    setSelectedChat(chat);
    if (setOpenChatDrawer) {
      setOpenChatDrawer(false);
    }
  };
  return (
    <div
      onClick={handleSelectedChat}
      className={`px-3 flex justify-center lg:justify-start items-center  border-b border-slate-700/40   cursor-pointer hover:bg-slate-700/10 duration-100 
       ${shouldBackgroundColorChange} `}
    >
      <div className="py-2 lg:py-0">
        <img className="h-12 w-12 rounded-full" src={picture} />
      </div>
      <div
        className={`ml-4 flex-1  border-grey-lighter py-4 ${shouldModalOpenClass} `}
      >
        <div className="flex items-bottom justify-between">
          <p className="text-grey-darkest font-semibold whitespace-nowrap">
            {name}
          </p>
          <p className="text-xs ms:block hidden  text-grey-darkest whitespace-nowrap">
            {time ? formatTimestamp(time) : ""}
          </p>
        </div>
        <p className="text-slate-400 mt-1 text-sm">
          {lastMessage ? lastMessage : "Click here to start the chat"}
        </p>
      </div>
    </div>
  );
};

export default ConversationListItem;
