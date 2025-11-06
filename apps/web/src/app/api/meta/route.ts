import { NextResponse, NextRequest } from "next/server";
import { MetaClient } from "@/integration/meta";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const state = params.get("state");
  const code = params.get("code");

  if (!state || !code) {
    return NextResponse.json({ error: "State is required" }, { status: 400 });
  }

  console.log("Getting state and code", state, code);

  const metaClient = new MetaClient();
  const { success } = await metaClient.verifyMetaState(state, state);

  if (!success) {
    return NextResponse.json({ error: "Invalid state" }, { status: 400 });
  }

  console.log("Verified state", success);

  const { success: accessTokenSuccess, data: accessTokenData } =
    await metaClient.getAccessToken(code);
  console.log("Getting access token", accessTokenSuccess, accessTokenData);

  if (!accessTokenSuccess) {
    return NextResponse.json(
      { error: "Failed to get access token" },
      { status: 400 }
    );
  }

  const {
    success: longLivedAccessTokenSuccess,
    data: longLivedAccessTokenData,
  } = await metaClient.getLongLivedAccessToken(accessTokenData.access_token);

  if (!longLivedAccessTokenSuccess) {
    return NextResponse.json(
      { error: "Failed to get long lived access token" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, data: longLivedAccessTokenData });
}
