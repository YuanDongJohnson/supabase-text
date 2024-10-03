"use client";
import React from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa6";

const SocialAuth = () => {
  const supabase = createClient();

  const redirectTo =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/auth/callback`
      : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback`;

  return (
    <div className="flex flex-col gap-4">
      <Button
        className="flex items-center justify-center w-full rounded-md h-10 font-medium shadow-input"
        variant="bordered"
        onPress={async () => {
          await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              queryParams: {
                access_type: "offline",
                prompt: "consent",
              },
              redirectTo,
            },
          });
        }}
      >
        <FcGoogle size={24} />
        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
          Login with Google
        </span>
      </Button>
      <Button
        className="flex items-center justify-center w-full rounded-md h-10 font-medium shadow-input"
        variant="bordered"
        onPress={async () => {
          await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
              queryParams: {
                access_type: "offline",
                prompt: "consent",
              },
             redirectTo,
            },
          });
        }}
      >
        <FaGithub size={24} />
        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
          Login with Github
        </span>
      </Button>
      <Button
        className="flex items-center justify-center w-full rounded-md h-10 font-medium shadow-input"
        variant="bordered"
        onPress={async () => {
          await supabase.auth.signInWithOAuth({
            provider: "facebook",
            options: {
              redirectTo,
            },
          });
        }}
      >
        <FaFacebook size={24} />
        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
          Login with Facebook
        </span>
      </Button>
    </div>
  );
};

export default SocialAuth;
