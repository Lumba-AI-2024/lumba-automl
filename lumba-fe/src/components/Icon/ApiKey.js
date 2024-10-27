import React from "react";
import Tooltip from "../Tooltip";
import useCopyToClipboard from "../../hooks/useCopyToClipboard";

export default function ApiKey({ apiKey }) {
  const [value, copy] = useCopyToClipboard();

  return (
    <Tooltip label={value ? "Copied!" : "Copy API Key"}>
      <button
        className="hover:text-blue"
        onClick={() => {
          copy(apiKey);
        }}
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.25 7.5C6.25 8.88071 5.13071 10 3.75 10C2.36929 10 1.25 8.88071 1.25 7.5C1.25 6.11929 2.36929 5 3.75 5C5.13071 5 6.25 6.11929 6.25 7.5ZM6.25 7.5H13.75V9.375"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M11.25 7.5V9.375"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </Tooltip>
  );
}
