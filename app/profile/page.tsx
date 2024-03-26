import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Avatar,
  Button,
} from "@nextui-org/react";
import SubmitButton from "@/components/Common/Submit-Button";
import EmailInput from "@/components/auth/EmailInput";
import Link from "next/link";
import { Metadata } from "next";

const Profile = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login?next=profile");
  }

  const signOut = async () => {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/");
  };

  return (
    <>
      <div className="flex-1 flex w-full sm:max-w-md justify-center items-center">
        <Card className="max-w-[400px] w-full h-full">
          <CardHeader className="flex justify-center w-full">
            Your Account
          </CardHeader>
          <Divider />
          <CardBody className="flex flex-col gap-4 justify-center items-center">
            {user.user_metadata?.avatar_url && (
              <Avatar
                src={user.user_metadata?.avatar_url}
                alt="User Profile Picture"
                size="lg"
                showFallback
              />
            )}
            {user.user_metadata?.full_name && (
              <Input
                label="Name"
                value={user.user_metadata?.full_name}
                readOnly
                variant="bordered"
              />
            )}
            <EmailInput value={user.email} isReadOnly isRequired={false} />
            <Input
              label="Password"
              value={"••••••••"}
              isReadOnly
              variant="bordered"
              endContent={
                <Button
                  variant="bordered"
                  as={Link}
                  href="/auth/update-password"
                >
                  Update
                </Button>
              }
            />
            <div className="flex justify-center items-center w-full">
              <Button as={Link} href="/storage" variant="bordered" fullWidth>
                My Files
              </Button>
            </div>
          </CardBody>
          <Divider />
          <CardFooter>
            <div className="flex justify-center w-full items-center">
              <form action={signOut}>
                <SubmitButton
                  variant="ghost"
                  color="danger"
                  loadingText="Logging Out..."
                >
                  Logout
                </SubmitButton>
              </form>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Profile;

export const metadata: Metadata = {
  title: "Account",
};
