"use client"; // 确保这行代码在文件的最顶部

import React, { useState, useEffect } from 'react';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SubmitButton from "@/components/Common/Submit-Button";
import Link from "next/link";
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

const AuthForm = ({ method, searchParams }: AuthForm) => {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleRememberMeChange = (checked) => {
    setRememberMe(checked);
    if (checked) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  };

  const signIn = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return redirect(`/auth/login?error=${error.message}`);
      }

      return redirect(searchParams.next ? `/${searchParams.next}` : "/");
    } catch (error) {
      console.error("Sign in error:", error);
      return redirect(`/auth/login?error=${error.message}`);
    }
  };

  const signUp = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    try {
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

      if (data) {
        return redirect("/auth/signup?message=Check email to continue sign in process");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      return redirect(`/auth/signup?error=${error.message}`);
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-4">
      <SocialAuth />
      <Divider />
      <form className="animate-in flex flex-col w-full justify-center gap-4 text-foreground">
        {searchParams.message && <MessageCard message={searchParams.message} />}
        {searchParams.error && <ErrorCard error={searchParams.error} />}
        <EmailInput value={username} onChange={(e) => setUsername(e.target.value)} />
        <div className="flex flex-col gap-2">
          <PasswordInput method={method} />
          <div className="flex items-center justify-between">
            <Checkbox
              name="remember"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            >
              Remember Me
            </Checkbox>
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
