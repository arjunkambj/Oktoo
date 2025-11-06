"use client";
import { useStackApp } from "@stackframe/stack";
import { Button } from "@heroui/button";
import { useState } from "react";
import { Icon } from "@iconify/react";

export default function CustomOAuthSignIn() {
  const app = useStackApp();

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen min-w-sm px-6 mx-auto">
      <Button
        onPress={async () => {
          setIsGoogleLoading(true);
          await app.signInWithOAuth("google");
          setIsGoogleLoading(false);
        }}
        variant="flat"
        className="w-full h-11 text-md"
        isLoading={isGoogleLoading}
      >
        <Icon icon="logos:google-icon" width={18} />
        Continue with Google
      </Button>
    </div>
  );
}
