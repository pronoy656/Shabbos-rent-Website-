import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken =
    request.cookies.get("auth_token")?.value ||
    request.cookies.get("accessToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;

  // Parse authUser to get the exact role
  let exactRole = "";
  try {
    const authUserCookie = request.cookies.get("authUser")?.value;
    if (authUserCookie) {
      const parsedUser = JSON.parse(decodeURIComponent(authUserCookie));
      exactRole = parsedUser?.role || "";
    }
  } catch (e) {
    // ignore
  }

  const isAdmin = exactRole === "SUPER_ADMIN" || exactRole === "ADMIN" || userRole === "admin";
  const isOwner = exactRole === "OWNER";

  // Protect Admin Dashboard (/dashboard, /dashboard/...)
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    if (!authToken || !isAdmin) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("auth_token");
      res.cookies.delete("accessToken");
      res.cookies.delete("userRole");
      return res;
    }
  }

  // Protect User Dashboard (/user-dashboard, /user-dashboard/...)
  if (pathname === "/user-dashboard" || pathname.startsWith("/user-dashboard/")) {
    if (!authToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      res.cookies.delete("auth_token");
      res.cookies.delete("accessToken");
      return res;
    }
    
    // We no longer block RENTER/USER from accessing the dashboard
    // because a USER must be able to access the dashboard to add an apartment
    // and upgrade their role to OWNER.
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/user-dashboard",
    "/user-dashboard/:path*",
  ],
};
