// middleware.js
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { stackServerApp } from "@/stack/server";

const isauthroute = (path: string) => {
  return path.startsWith("/sign-in") || path.startsWith("/sign-up");
};

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();

  if (!isauthroute(request.nextUrl.pathname)) {
    return;
  }
  const user = await stackServerApp.getUser();
  if (isauthroute(request.nextUrl.pathname) && user) {
    return NextResponse.redirect(new URL("/overview", request.url));
  }
  return response;
}
