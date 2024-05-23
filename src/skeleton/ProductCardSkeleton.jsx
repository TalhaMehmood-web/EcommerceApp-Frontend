import React from "react";
import Skeleton from "react-loading-skeleton";
const ProductCardSkeleton = () => {
  return (
    <div className="w-[14rem]">
      <Skeleton width={260} height={240} />

      <Skeleton width={200} height={15} />
      <Skeleton width={100} height={15} />
      <div className="flex space-x-2 flex-1  my-2">
        <Skeleton width={100} height={12} />
        <Skeleton width={140} height={12} />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
