import { StackClientApp } from "@stackframe/stack";
import { stackServerApp } from "@/stack/server";
import { env } from "@/lib/env";

export const stackClientApp = new StackClientApp({
  projectId: env.NEXT_PUBLIC_STACK_PROJECT_ID,
  publishableClientKey: env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
  inheritsFrom: stackServerApp,
});
