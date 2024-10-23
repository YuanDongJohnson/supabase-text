import React, { useState } from "react";
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
import { Checkbox, Dialog, DialogOverlay, DialogContent } from '@nextui-org/react';

interface AuthForm {
  method: "login" | "signup";
  searchParams: Record<string, string | string[] | undefined>;
}

const AuthForm = ({ method, searchParams }: AuthForm) => {
  const supabase = createClient();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const {
    data: { user },
  } = user ? { data: { user: null } } : supabase.auth.getUser();

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  if (user) {
    return redirect(`/profile`);
  }

  const signIn = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Handle error, possibly show a message to the user
      return;
    }

    closeAuthModal();
    redirect(searchParams.next ? `/${searchParams.next}` : "/");
  };

  const signUp = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      // Handle error, possibly show a message to the user
      return;
    }

    closeAuthModal();
    // Redirect to a confirmation page or similar
  };

  return (
    <>
      {method === "login" ? (
        <Button onClick={openAuthModal} variant="bordered">
          Login
        </Button>
      ) : (
        <Button onClick={openAuthModal} variant="bordered">
          Sign Up
        </Button>
      )}

      <DialogOverlay isOpen={isAuthModalOpen} onDismiss={closeAuthModal}>
        <DialogContent>
          <Dialog close={closeAuthModal}>
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
                formAction={method === "login" ? signIn : signUp}
                loadingText={method === "login" ? "Signing In..." : "Signing Up..."}
                fullWidth
                variant="solid"
                color="success"
              >
                {method === "login" ? "Sign In" : "Sign Up"}
              </SubmitButton>
              <p className="w-full text-center">
                {method === "login" ? (
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
          </Dialog>
        </DialogContent>
      </DialogOverlay>
    </>
  );
};

export default AuthForm;
