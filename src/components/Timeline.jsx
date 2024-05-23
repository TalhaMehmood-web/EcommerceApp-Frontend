import React from "react";

const Timeline = ({ orderStatus }) => {
  const stages = [
    { title: "Received", checked: orderStatus !== "Pending" || true },
    {
      title: "Processing",
      checked:
        orderStatus === "Processing" ||
        orderStatus === "Shipped" ||
        orderStatus === "Delivered",
    },
    {
      title: "Shipped",
      checked: orderStatus === "Shipped" || orderStatus === "Delivered",
    },
    { title: "Delivered", checked: orderStatus === "Delivered" },
  ];

  return (
    <div className="flex items-center p-3">
      {stages.map((stage, index) => (
        <React.Fragment key={index}>
          <div
            className={`w-6 h-6 rounded-full flex relative items-center justify-center border-2 ${
              stage.checked
                ? "bg-green-500 border-green-500"
                : "border-blue-500 bg-blue-500 opacity-50 "
            }`}
          >
            <span className="text-white">{stage.checked ? "✓" : "✕"}</span>
            <p className="absolute top-6">{stage.title}</p>
          </div>
          {index !== stages.length - 1 && (
            <div
              className={`${
                stage.checked && stages[index + 1].checked
                  ? "bg-green-500"
                  : "bg-blue-500 bg-opacity-50"
              } h-1 flex-grow`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Timeline;
