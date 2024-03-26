import React from "react";
import { ServerPage } from "@/app/page";
import { createClient } from "@/utils/supabase/server";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import SubmitButton from "@/components/Common/Submit-Button";
import { redirect } from "next/navigation";
import ErrorCard from "@/components/Common/ErrorCard";
import MessageCard from "@/components/Common/MessageCard";
import PasswordInput from "@/components/auth/PasswordInput";
import { Metadata } from "next";

const UpdatePassword = async ({ searchParams }: ServerPage) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login?next=auth/update-password");
  }

  const updatePassword = async (formData: FormData) => {
    "use server";
    const supabase = createClient();

    const newPassword = formData.get("password");
    const confirmPassword = formData.get("confirm-password");

    if (newPassword !== confirmPassword) {
      return redirect(`/auth/update-password?error=Passwords do not match`);
    }

    const { error } = await supabase.auth.updateUser({
      password: String(newPassword),
    });

    if (error) {
      return redirect(`/auth/update-password?error=${error.message}`);
    }

    return redirect(`/auth/update-password?message=Password Updated`);
  };

  return (
    <div className="flex-1 flex w-full sm:max-w-md justify-center items-center">
      <Card className="max-w-[400px] w-full h-full">
        <CardHeader className="flex justify-center w-full">
          Update Password
        </CardHeader>
        <Divider />
        <CardBody className="flex flex-col gap-4">
          {searchParams.error && <ErrorCard error={searchParams.error} />}
          {searchParams.message ? (
            <MessageCard message={searchParams.message} />
          ) : (
            <form
              action={updatePassword}
              className="flex flex-col gap-4 justify-center items-center w-full"
            >
              <PasswordInput method="none" label="New Password" />
              <PasswordInput
                method="none"
                name="confirm-password"
                label="Confirm Password"
              />
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
  );
};

export default UpdatePassword;

export const metadata: Metadata = {
  title: "Update Password",
};
