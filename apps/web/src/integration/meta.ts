import { env } from "@/lib/env";
const META_API_VERSION = "v24.0";
const META_GRAPH_URL = `https://graph.facebook.com/${META_API_VERSION}`;

export class MetaClient {
  private readonly redirectUri = `${env.NEXT_PUBLIC_APP_URL}/api/meta/`;

  async getAccessToken(code: string) {
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
        redirect_uri: this.redirectUri,
      }).toString(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Meta access token");
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  }

  async getLongLivedAccessToken(shortLivedToken: string) {
    const response = await fetch(
      `${META_GRAPH_URL}/oauth/access_token?${new URLSearchParams({
        grant_type: "fb_exchange_token",
        client_id: env.NEXT_PUBLIC_META_CLIENT_ID,
        client_secret: env.META_CLIENT_SECRET,
        fb_exchange_token: shortLivedToken,
      }).toString()}`
    );

    if (!response.ok) {
      throw new Error("Failed to exchange Meta access token");
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  }

  async verifyMetaState(state: string, cookieState: string) {
    if (cookieState !== state) {
      throw new Error("Invalid state");
    }

    return { success: true };
  }
}
