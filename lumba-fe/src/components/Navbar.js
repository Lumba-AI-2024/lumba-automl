import Link from "next/link";
import * as React from "react";
import useCookie from "../hooks/useCookie";
import ProfileDropdown from "./Auth/ProfileDropdown";
import useOnClickOutside from "../hooks/useClickOutside";
import { useUser } from "../context/UserContext";
import Image from "next/image";
import UserCircle from "./Icon/UserCircle";
import QuestionCircle from "./Icon/QuestionCircle";
import ReplayTutorial from "./Tutorial/ReplayTutorial";

export default function Navbar() {
  const username = useCookie("username");

  const { updatedUser } = useUser();

  const [isVisible, setIsVisible] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const ref = React.useRef(null);

  const handleClickOutside = () => {
    setIsVisible(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  const ref2 = React.useRef(null);

  const handleClickOutside2 = () => {
    setIsOpen(false);
  };

  useOnClickOutside(ref2, handleClickOutside2);

  return (
    <nav className="layout mx-auto shadow-sm fixed w-full top-0 left-1/2 -translate-x-1/2 px-8 py-2 bg-white z-10">
      <div className="flex justify-between">
        <Link href="/">
          <img src="/assets/logo/Lumba.svg" alt="Lumba AI" />
        </Link>
        <div className="flex gap-4 items-center">
          <div ref={ref2} className="relative cursor-pointer" onClick={() => setIsOpen((prev) => !prev)}>
            <QuestionCircle />
            <ReplayTutorial isOpen={isOpen} />
          </div>
          <p>{updatedUser ? updatedUser["username"] : username}</p>
          <div
            onClick={() => setIsVisible((prev) => !prev)}
            className="w-8 h-8 rounded-full cursor-pointer relative"
            ref={ref}
          >
            {/* {updatedUser && updatedUser["profile_picture"] && (
              <Image
                src={`https://test.lumba-ai.tech${updatedUser["profile_picture"]}`}
                className="object-cover w-8 h-8 rounded-full"
                width={192}
                height={192}
                alt="profile"
              />
            )} */}
            {!updatedUser ||
              (!updatedUser["profile_picture"] ? (
                <UserCircle />
              ) : (
                <Image
                  src={`https://test.lumba-ai.tech${updatedUser["profile_picture"]}`}
                  className="object-cover w-8 h-8 rounded-full"
                  width={192}
                  height={192}
                  alt="profile"
                />
              ))}
            <ProfileDropdown isVisible={isVisible} />
          </div>
        </div>
      </div>
    </nav>
  );
}
