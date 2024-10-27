import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;

  const pathnames = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

  if (pathnames.includes(pathname) && !!token) {
    req.nextUrl.pathname = "/";
    return NextResponse.redirect(req.nextUrl);
  }

  if (!pathnames.includes(pathname) && !token) {
    req.nextUrl.pathname = "/login";
    return NextResponse.redirect(req.nextUrl);
  }

  return NextResponse.next();
}

export const config = { matcher: "/((?!.*\\.|api\\/).*)" };
