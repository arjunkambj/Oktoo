import { httpRouter } from "convex/server";
import { handleMetaWebhook } from "./meta/action";

const http = httpRouter();

http.route({
  path: "/meta/webhook",
  method: "POST",
  handler: handleMetaWebhook,
});

export default http;
