import * as React from "react";
import { clearCookie } from "../../helper/cookies";
import { useRouter } from "next/router";

export default function ProfileDropdown({ isVisible }) {
  const router = useRouter();

  const logout = () => {
    clearCookie();
    router.push("/login");
  };

  return (
    <div
      className={`${
        isVisible ? "block" : "hidden"
      } z-40 absolute right-0 top-full mt-2 shadow flex flex-col py-1 bg-white rounded-md w-20`}
    >
      <button
        onClick={() => router.push("/settings")}
        className="hover:text-white hover:bg-blue text-black/60 px-3 py-1 text-[11px]"
      >
        Settings
      </button>
      <button onClick={logout} className="hover:text-white hover:bg-lightpink text-black/60 px-3 py-1 text-[11px]">
        Log out
      </button>
    </div>
  );
}
