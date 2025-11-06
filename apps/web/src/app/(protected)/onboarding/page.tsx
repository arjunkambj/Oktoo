"use client";

import { Button } from "@heroui/button";
import { createMetaState } from "@/actions/meta";
import { useRouter } from "next/navigation";
import { createMetaOAuthUrl } from "@/actions/meta";

export default function OnboardingPage() {
  const router = useRouter();

  const handleMetaRedirect = async () => {
    const state = await createMetaState();
    const url = await createMetaOAuthUrl(state);
    router.push(url);
  };

  return (
    <div>
      <Button onPress={handleMetaRedirect}>Connect Meta</Button>
    </div>
  );
}
