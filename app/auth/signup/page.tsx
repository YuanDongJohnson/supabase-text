import { ServerPage } from "@/app/page";
import AuthForm from "@/components/auth/AuthForm";
import React from "react";
import { Metadata } from "next";

const SignUp = ({ searchParams }: ServerPage) => {
  return <AuthForm searchParams={searchParams} method="signup" />;
};

export default SignUp;

export const metadata: Metadata = {
  title: "Sign-up",
};
