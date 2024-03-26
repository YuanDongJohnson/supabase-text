import React from "react";
import { Input, InputProps } from "@nextui-org/react";

const EmailInput = (props: InputProps) => {
  return (
    <Input
      label="Email"
      name="email"
      placeholder="you@example.com"
      autoComplete="email"
      variant="bordered"
      isRequired
      {...props}
    />
  );
};

export default EmailInput;
