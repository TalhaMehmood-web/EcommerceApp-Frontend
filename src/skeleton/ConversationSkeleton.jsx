import React from "react";
import Skeleton from "react-loading-skeleton";

const ConversationSkeleton = () => {
  return (
    <div className="px-3 flex items-center  cursor-pointer border-b border-slate-700 ">
      <div>
        <Skeleton className="w-12 h-12 rounded-full " />
      </div>
      <div className="ml-4 flex-1  border-grey-lighter py-4">
        <div className="flex items-bottom justify-between">
          <Skeleton width={100} />
          <Skeleton width={100} />
        </div>
        <Skeleton width={200} />
      </div>
    </div>
  );
};

export default ConversationSkeleton;
