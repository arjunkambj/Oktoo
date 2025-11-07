import { httpAction } from "../_generated/server";

export const metaWebhook = httpAction(async (ctx, request) => {
  const body = await request.json();

  return new Response("OK");
});
