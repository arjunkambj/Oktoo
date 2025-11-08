import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

export default async function SelectFormPage() {
  const user = await stackServerApp.getUser({});

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full h-full px-6">
      <div className="space-y-6 py-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Select lead forms
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose which Meta lead forms you want to sync for your workspace.
          </p>
        </div>
      </div>
    </div>
  );
}
