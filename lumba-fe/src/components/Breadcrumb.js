import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Breadcrumb({ links, active, noHoverColor = false, custom = false }) {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  return (
    <div>
      {links.map((link, index) => {
        if (index === 0 && !custom) {
          return (
            <span key={index}>
              {link.label}
              <span className="px-2">{links.indexOf(link) != links.length - 1 && "/"}</span>
            </span>
          );
        }
        return (
          <span key={index}>
            <Link href={links.indexOf(link) === links.length - 1 ? link.href : link.href + "?type=" + type}>
              <span
                className={`${
                  active === link.label && "text-transparent bg-clip-text bg-gradient-to-r from-lightblue to-blue"
                } ${
                  !noHoverColor &&
                  "hover:text-transparent hover:bg-clip-text bg-gradient-to-r hover:from-lightblue hover:to-blue"
                }`}
              >
                {link.label}
              </span>
            </Link>
            <span className="px-2">{links.indexOf(link) != links.length - 1 && "/"}</span>
          </span>
        );
      })}
    </div>
  );
}
