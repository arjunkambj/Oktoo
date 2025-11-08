import { v } from "convex/values";
import { action } from "../_generated/server";
import { httpAction } from "../_generated/server";

export const handleMetaCallback = action({
  args: {
    teamId: v.string(),
    userId: v.string(),
    accessToken: v.string(),
  },
  handler: async (ctx, args) => {
    const { teamId, userId, accessToken } = args;
  },
});

export const handleMetaWebhook = httpAction(async (ctx, request) => {
  return new Response("OK", { status: 200 });
});
