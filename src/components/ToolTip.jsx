import { useRef } from "react";

const ToolTip = ({ children, tooltip }) => {
  const tooltipRef = useRef(null);

  return (
    <div
      onMouseEnter={({ clientX }) => {
        if (!tooltipRef.current) return;

        tooltipRef.current.style.left = clientX + 10 + "px";
      }}
      className="group relative inline-block"
    >
      {children}
      {tooltip ? (
        <span
          ref={tooltipRef}
          className="invisible text-sm font-semibold group-hover:visible opacity-0 group-hover:opacity-100 transition bg-slate-500 text-white px-2 py-1 rounded absolute top-full mt-2 whitespace-nowrap"
        >
          {tooltip}
        </span>
      ) : null}
    </div>
  );
};

export default ToolTip;
