import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SubmitButton from "@/components/Common/Submit-Button";
import Link from "next/link";
import { headers } from "next/headers";
import { Divider } from "@nextui-org/react";
import SocialAuth from "@/components/auth/SocialAuth";
import EmailInput from "@/components/auth/EmailInput";
import PasswordInput from "@/components/auth/PasswordInput";
import MessageCard from "@/components/Common/MessageCard";
import ErrorCard from "@/components/Common/ErrorCard";
import { Checkbox } from '@nextui-org/react';


interface AuthForm {
  method: "login" | "signup";
  searchParams: Record<string, string | string[] | undefined>;
}

const AuthForm = async ({ method, searchParams }: AuthForm) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect(`/profile`);
  }

  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect(`/auth/login?error=${error.message}`);
    }

    return redirect(searchParams.next ? `/${searchParams.next}` : "/");
  };
  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect(`/auth/signup?error=${error.message}`);
    }

    return redirect(
      "/auth/signup?message=Check email to continue sign in process"
    );
  };
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-4">
      <SocialAuth />
      <Divider />
      <form className="animate-in flex flex-col w-full justify-center gap-4 text-foreground">
        {searchParams.message && <MessageCard message={searchParams.message} />}
        {searchParams.error && <ErrorCard error={searchParams.error} />}
        <EmailInput />
        <div className="flex flex-col gap-2">
  <PasswordInput method={method} />
  <div className="flex items-center justify-between">
    <Checkbox name="remember">Remember Me</Checkbox>
    <Link
      className="text-blue-500"
      href={"/auth/reset-password"}
    >
      Forgot Password?
    </Link>
  </div>
</div>

        <SubmitButton
          formAction={method == "login" ? signIn : signUp}
          loadingText={method == "login" ? "Signing In..." : "Signing Up..."}
          fullWidth
          variant="solid"
          color="success"
        >
          {method == "login" ? "Sign In" : "Sign Up"}
        </SubmitButton>
        <p className="w-full text-center">
          {method == "login" ? (
            <>
              Don't have an account?{" "}
              <Link className="text-blue-500" href={"/auth/signup"}>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              Have an account?{" "}
              <Link className="text-blue-500" href={"/auth/login"}>
                Sign In
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
