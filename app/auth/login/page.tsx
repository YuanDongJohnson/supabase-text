import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import { ServerPage } from "@/app/page";
import { Metadata } from "next";

export default function Login({ searchParams }: ServerPage) {
  return <AuthForm method="login" searchParams={searchParams} />;
}

export const metadata: Metadata = {
  title: "Login",
};
