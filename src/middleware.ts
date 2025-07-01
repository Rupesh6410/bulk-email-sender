// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuth = !!token;
  const isPublic = ["/", "/signin", "/signup"].some((route) =>
    pathname.startsWith(route)
  );

  // Block access to protected routes if not authenticated
  if (!isAuth && !isPublic) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/create/:path*", "/history/:path*", "/", "/signin"],
};
