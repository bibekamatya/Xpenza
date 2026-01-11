import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLogin = req.nextUrl.pathname === "/login";

  // Skip auth in development
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  if (!isLoggedIn && !isOnLogin) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLoggedIn && isOnLogin) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
