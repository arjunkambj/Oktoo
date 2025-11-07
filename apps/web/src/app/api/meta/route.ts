import { NextResponse, NextRequest } from "next/server";
import { FetchMetaAccessToken } from "@/integration/meta";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const state = params.get("state");
  const code = params.get("code");

  if (!state || !code) {
    return NextResponse.json({ error: "State is required" }, { status: 400 });
  }

  console.log("state and code received Step 1");

  const cookieStore = await cookies();
  const cookieState = cookieStore.get("meta:state");

  if (!cookieState || cookieState.value !== state) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  const accessTokenData = await FetchMetaAccessToken(code);

  return NextResponse.json({
    success: true,
    data: accessTokenData,
  });
}
