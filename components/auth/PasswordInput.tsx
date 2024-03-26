"use client";
import React, { useState } from "react";
import { Button, Input, InputProps } from "@nextui-org/react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface PasswordInputProps extends InputProps {
  method: "login" | "signup" | "none";
}

const PasswordInput = (props: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <Input
      name="password"
      label="Password"
      placeholder="••••••••"
      autoComplete={
        props.method == "login"
          ? "current-password"
          : props.method == "signup"
          ? "new-password"
          : "off"
      }
      variant="bordered"
      isRequired
      endContent={
        <Button
          onPress={toggleVisibility}
          isIconOnly
          size="sm"
          className="ms-2"
        >
          {isVisible ? <FaRegEye /> : <FaRegEyeSlash />}
        </Button>
      }
      type={isVisible ? "text" : "password"}
      {...props}
    />
  );
};

export default PasswordInput;
