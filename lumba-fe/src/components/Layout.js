import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Whitespace from "./Whitespace";
import { useRouter } from "next/router";
import React from "react";

export default function Layout({ children }) {
  const { pathname, asPath } = useRouter();

  React.useEffect(() => {
    if (typeof window !== undefined) {
      window.scrollTo(0, 0);
    }
  }, [asPath]);

  const pathnames = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

  if (pathname === "/settings") {
    return (
      <div className="h-screen overflow-hidden max-w-[120rem] mx-auto shadow">
        <Navbar />
        <Whitespace />
        <div className="flex h-full overflow-auto">
          <Sidebar />
          <div className="layout-no-padding bg-gray/10 overflow-auto h-[calc(100vh-55px)]">{children}</div>
        </div>
      </div>
    );
  }

  if (pathnames.includes(pathname)) {
    return <div className="layout">{children}</div>;
  }
  return (
    <div className="h-screen overflow-hidden max-w-[120rem] mx-auto shadow">
      <Navbar />
      <Whitespace />
      <div className="flex h-full overflow-auto">
        <Sidebar />
        <div className="layout bg-gray/10 overflow-auto h-[calc(100vh-55px)]" id="layout">
          {children}
        </div>
      </div>
    </div>
  );
}
