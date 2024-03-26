"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { type ComponentProps } from "react";
import { Button, ButtonProps } from "@nextui-org/react";

type Props = ComponentProps<"button"> &
  ButtonProps & {
    loadingText: string;
  };

const SubmitButton = ({
  children,
  loadingText,
  color,
  variant,
  ...props
}: Props) => {
  const { pending } = useFormStatus();

  return (
    <Button
      isLoading={pending}
      isDisabled={pending}
      color={color}
      variant={variant}
      type="submit"
      {...props}
    >
      {pending ? loadingText : children}
    </Button>
  );
};

export default SubmitButton;
