import React from "react";
import { Card, CardBody } from "@nextui-org/react";

const MessageCard = ({
  message,
}: {
  message: string | string[] | undefined;
}) => {
  return (
    <Card>
      <CardBody className="text-foreground text-center">{message}</CardBody>
    </Card>
  );
};

export default MessageCard;
