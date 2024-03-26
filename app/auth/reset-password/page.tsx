import React from "react";
import { createClient } from "@/utils/supabase/server";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import SubmitButton from "@/components/Common/Submit-Button";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ErrorCard from "@/components/Common/ErrorCard";
import MessageCard from "@/components/Common/MessageCard";
import { ServerPage } from "@/app/page";
import EmailInput from "@/components/auth/EmailInput";
import { Metadata } from "next";

export default async function Page({ searchParams }: ServerPage) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/auth/update-password");
  }

  const requestPasswordReset = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    const supabase = createClient();
    const headersList = headers();

    if (email === "") {
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${headersList.get(
        "origin"
      )}/auth/callback?next=auth/update-password`,
    });

    if (error) {
      return redirect(`/auth/reset-password?error=${error.message}`);
    } else {
      return redirect(
        `/auth/reset-password?message=Please Check Your Mail For Password Reset Link`
      );
    }
  };

  return (
    <>
      <div className="flex-1 flex w-full sm:max-w-md justify-center items-center">
        <Card className="max-w-[400px] w-full h-full">
          <CardHeader className="flex justify-center w-full">
            Reset Password
          </CardHeader>
          <Divider />
          <CardBody className="flex flex-col gap-4">
            {searchParams.error && <ErrorCard error={searchParams.error} />}
            {searchParams.message ? (
              <MessageCard message={searchParams.message} />
            ) : (
              <form
                action={requestPasswordReset}
                className="flex flex-col gap-4 justify-center items-center w-full"
              >
                <EmailInput />
                <SubmitButton
                  variant="solid"
                  color="success"
                  loadingText="Submitting..."
                >
                  Submit
                </SubmitButton>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export const metadata: Metadata = {
  title: "Reset Password",
};
