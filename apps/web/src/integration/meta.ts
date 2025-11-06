import { env } from "@/lib/env";

const META_API_VERSION = "v24.0";
const META_GRAPH_URL = `https://graph.facebook.com/${META_API_VERSION}`;
const META_DIALOG_URL = `https://www.facebook.com/${META_API_VERSION}/dialog/oauth`;

type SubscribeToWebhookParams = {
  accessToken: string;
  pageId: string;
  callbackUrl: string;
  verifyToken: string;
  fields?: string;
};

export class MetaClient {
  private readonly redirectUri = `${env.NEXT_PUBLIC_APP_URL}/api/meta/`;

  createOAuthUrl(state: string) {
    const url = new URL(META_DIALOG_URL);
    url.searchParams.set("client_id", env.NEXT_PUBLIC_META_CLIENT_ID);
    url.searchParams.set("redirect_uri", this.redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("state", state);
    url.searchParams.set(
      "scope",
      "leads.read_user_data,leads.read_user_targeting_criteria"
    );
    return url.toString();
  }

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
    return data.access_token as string;
  }

  async exchangeForLongLivedToken(shortLivedToken: string) {
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
    return data.access_token as string;
  }

  async getLongLivedAccessToken(code: string) {
    const shortLivedToken = await this.getAccessToken(code);
    return this.exchangeForLongLivedToken(shortLivedToken);
  }

  async getUserPages(
    accessToken: string,
    fields = "id,name,access_token,category"
  ) {
    const response = await fetch(
      `${META_GRAPH_URL}/me/accounts?${new URLSearchParams({
        fields,
      }).toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Meta pages");
    }

    const data = await response.json();
    return data.data;
  }

  async subscribeToLeadsWebhook({
    accessToken,
    pageId,
    callbackUrl,
    verifyToken,
    fields = "leadgen",
  }: SubscribeToWebhookParams) {
    const response = await fetch(`${META_GRAPH_URL}/${pageId}/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        object: "page",
        callback_url: callbackUrl,
        fields,
        verify_token: verifyToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to subscribe Meta webhook");
    }

    return response.json();
  }
}
