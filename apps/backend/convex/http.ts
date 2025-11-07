import { httpRouter } from "convex/server";
import { metaWebhook } from "./meta/index";

const http = httpRouter();

http.route({
  path: "/",
  method: "GET",
  handler: metaWebhook,
});
export default http;
