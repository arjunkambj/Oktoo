import { env } from "@/lib/env";

const META_API_VERSION = "v24.0";
const META_GRAPH_URL = `https://graph.facebook.com/${META_API_VERSION}`;

const redirectUri = `${env.NEXT_PUBLIC_APP_URL}/api/meta/`;

export const FetchMetaAccessToken = async (code: string) => {
  console.log("[FetchMetaAccessToken] Step 1: Preparing Meta OAuth token request");
  const response = await fetch(`${META_GRAPH_URL}/oauth/access_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: env.NEXT_PUBLIC_META_CLIENT_ID,
      client_secret: env.META_CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }).toString(),
  });

  if (!response.ok) {
    console.log("[FetchMetaAccessToken] Error: Failed to fetch access token", response.statusText);
    throw new Error(
      `Failed to fetch Meta access token: ${response.statusText}`
    );
  }

  console.log("[FetchMetaAccessToken] Step 2: Parsing access token response");
  const data = await response.json();
  console.log("[FetchMetaAccessToken] Step 3: Access token received successfully", data);
  return data;
};
