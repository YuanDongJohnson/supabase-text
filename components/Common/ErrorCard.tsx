import React from "react";
import { Card, CardBody } from "@nextui-org/react";

const ErrorCard = ({ error }: { error: string | string[] | undefined }) => {
  return (
    <Card>
      <CardBody className="text-red-500 text-center">{error}</CardBody>
    </Card>
  );
};

export default ErrorCard;
