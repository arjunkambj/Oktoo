"use server";

import { randomBytes } from "crypto";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
const META_DIALOG_URL = `https://www.facebook.com/v24.0/dialog/oauth`;
import { stackServerApp } from "@/stack/server";

export const createMetaState = async () => {
  console.log("[createMetaState] Step 1: Fetching user information");
  const user = await stackServerApp.getUser({});

  if (!user) {
    console.log("[createMetaState] Error: User not found");
    throw new Error("Team not found");
  }

  console.log("[createMetaState] Step 2: Fetching user teams");
  const team = await user.listTeams();

  if (team.length === 0) {
    console.log("[createMetaState] Error: No teams found for user");
    throw new Error("Team not found");
  }

  console.log("[createMetaState] Step 3: Generating state token");
  const state = randomBytes(128).toString("hex");

  console.log("[createMetaState] Step 4: Setting state cookie");
  const cookieStore = await cookies();

  cookieStore.set("meta:state", state, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  });

  console.log("[createMetaState] Step 5: Storing state in Redis");
  await redis.set(
    state,
    JSON.stringify({ userId: user.id, teamId: team[0]?.id }),
    {
      ex: 60 * 60 * 24,
    }
  );

  console.log("[createMetaState] Step 6: State created successfully");
  return state;
};

export const createMetaOAuthUrl = async (state: string) => {
  console.log(
    "[createMetaOAuthUrl] Step 1: Building Meta OAuth URL with state",
    state
  );
  const url = new URL(META_DIALOG_URL);
  url.searchParams.set("client_id", env.NEXT_PUBLIC_META_CLIENT_ID);
  url.searchParams.set("redirect_uri", `${env.NEXT_PUBLIC_APP_URL}/api/meta/`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);
  url.searchParams.set(
    "scope",
    [
      "business_management",
      "pages_show_list",
      "pages_manage_metadata",
      "pages_manage_ads",
      "leads_retrieval",
      "ads_read",
      "public_profile",
      "email",
    ].join(",")
  );
  console.log("[createMetaOAuthUrl] Step 2: OAuth URL created successfully");
  return url.toString();
};
