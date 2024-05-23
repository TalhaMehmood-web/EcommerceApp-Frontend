import React, { useEffect, useRef } from "react";
import { useUser } from "../context/UserContext";
import { formatTimestamp } from "../utils/DateConvert";
const Message = ({
  senderId,
  senderPicture,
  sendedBy,
  messageDate,
  message,
  shake,
}) => {
  const { user } = useUser();
  // defining classes
  const myMessagePosition =
    user?._id === senderId ? "justify-end" : "justify-start";
  const backGroundColor =
    user?._id === senderId ? "bg-blue-600/70" : "bg-slate-800";
  const messageName = user?._id === senderId ? "You" : sendedBy;
  const shouldShake = user?._id !== senderId && shake && "shake";
  const lastMessageRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 20);
  }, []);
  return (
    <div
      ref={lastMessageRef}
      className={`flex items-start  w-full gap-2.5  ${myMessagePosition} ${shouldShake} `}
    >
      <img
        className="w-8 h-8 rounded-full"
        src={senderPicture}
        alt={sendedBy}
      />
      <div
        className={`flex flex-col w-full max-w-[220px] sm:max-w-[320px]  text-wrap  sm:leading-1.5 px-4 py-1 sm:py-2  rounded-e-xl rounded-es-xl ${backGroundColor}`}
      >
        <div className="flex items-center justify-between rtl:space-x-reverse py-1">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {messageName}
          </span>
          <span
            className={`text-[12px] font-normal sm:block hidden  ${
              user?._id === senderId ? "text-white" : " text-gray-500"
            }  `}
          >
            {formatTimestamp(messageDate)}
          </span>
        </div>
        <p className="text-base  mb-1 font-normal py-1 text-gray-900 dark:text-white text-wrap break-words">
          {message}
        </p>
        <span
          className={`text-[10px] text-end font-normal sm:hidden block  ${
            user?._id === senderId ? "text-blue-200" : " text-gray-500"
          }  `}
        >
          {formatTimestamp(messageDate)}
        </span>
      </div>
    </div>
  );
};

export default Message;
