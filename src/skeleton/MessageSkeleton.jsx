import React from "react";
import Skeleton from "react-loading-skeleton";

const MessageSkeleton = () => {
  return (
    <div className="flex flex-col space-y-1 ">
      <div className={`flex items-start  justify-end  w-full gap-2.5 `}>
        <Skeleton className="w-8 h-8 rounded-full" />
        <div
          className={`flex flex-col w-full  bg-slate-800 max-w-[320px] leading-1.5 px-4 py-2  rounded-e-xl rounded-es-xl`}
        >
          <div className="flex items-center justify-between rtl:space-x-reverse py-1">
            <Skeleton width={100} />
            <Skeleton width={100} />
          </div>
          <Skeleton />
        </div>
      </div>
      <div className={`flex items-start justify-start  w-full gap-2.5 `}>
        <Skeleton className="w-8 h-8 rounded-full" />
        <div
          className={`flex flex-col w-full  bg-slate-800 max-w-[320px] leading-1.5 px-4 py-2  rounded-e-xl rounded-es-xl`}
        >
          <div className="flex items-center justify-between rtl:space-x-reverse py-1">
            <Skeleton width={100} />
            <Skeleton width={100} />
          </div>
          <Skeleton />
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
