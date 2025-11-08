import { NextResponse, NextRequest } from "next/server";
import { FetchMetaAccessToken } from "@/integration/meta";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@repo/backend/convex/_generated/api";
import { env } from "@/lib/env";

const convex = new ConvexHttpClient(env.CONVEX_URL);

export async function GET(request: NextRequest) {
  console.log("[API Meta Route] Step 1: Extracting state and code from request");
  const params = request.nextUrl.searchParams;
  const state = params.get("state");
  const code = params.get("code");

  if (!state || !code) {
    console.log("[API Meta Route] Error: Missing state or code");
    return NextResponse.json({ error: "State is required" }, { status: 400 });
  }

  console.log("[API Meta Route] Step 2: Validating state from cookie");
  const cookieStore = await cookies();
  const cookieState = cookieStore.get("meta:state");

  if (!cookieState || cookieState.value !== state) {
    console.log("[API Meta Route] Error: Invalid cookie state");
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  console.log("[API Meta Route] Step 3: Retrieving cached state from Redis");
  const cachedState = await redis.get<{ userId: string; teamId: string }>(
    state
  );

  if (!cachedState) {
    console.log("[API Meta Route] Error: State not found in Redis");
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  console.log("[API Meta Route] Step 4: Fetching Meta access token");
  const accessTokenData = await FetchMetaAccessToken(code);

  console.log("[API Meta Route] Step 5: Calling Convex syncMetaIntegration action");
  await convex.action(api.meta.action.syncMetaIntegration, {
    teamId: cachedState.teamId,
    userId: cachedState.userId,
    accessToken: accessTokenData.access_token,
  });

  console.log("[API Meta Route] Step 6: Cleaning up Redis state");
  await redis.del(state);

  console.log("[API Meta Route] Step 7: Returning success response");
  return NextResponse.json({
    success: true,
    data: accessTokenData,
  });
}
