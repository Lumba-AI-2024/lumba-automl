import React from "react";

export default function Table({ children }) {
  return <table className="mt-2 mb-4 w-full pb-18 relative z-0 overflow-auto bg-white">{children}</table>;
}
