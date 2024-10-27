import React from "react";

export default function Tooltip({ children, label, position = "bottom" }) {
  if (position === "bottom") {
    return (
      <div className="relative whitespace-nowrap">
        <div className="peer">{children}</div>
        <div className="absolute opacity-0 -translate-y-2 transition duration-300 peer-hover:opacity-100 transform peer-hover:translate-y-0 left-1/2 -translate-x-1/2 top-8 z-50 bg-black rounded-md px-4  text-xs text-white py-0.5">
          <span className="relative z-50 text-[11px]">{label}</span>
          <div className="absolute left-1/2 -top-[2px] h-3 w-3 -translate-x-1/2 rotate-45 transform bg-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-2 h-0">
      <div className="peer">{children}</div>
      <div className="flex items-center peer-hover:opacity-100 opacity-0 transition duration-300">
        <span className="bg-black text-white text-[10px] rounded-sm inline z-50 max-w-[170px] text-center leading-4 p-1">
          {label}
        </span>
        <div className="absolute left-4 h-2 w-2 rotate-45 transform bg-black"></div>
      </div>
    </div>
  );
}
