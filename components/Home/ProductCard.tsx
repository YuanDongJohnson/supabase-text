"use client";
import React from "react";
import { ProductType } from "@/db/schema";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Button,
  ButtonGroup,
} from "@nextui-org/react";
import { BiCartAdd } from "react-icons/bi";

interface Product {
  product: typeof ProductType;
}

const ProductCard = ({ product }: Product) => {
  return (
    <>
      <Card className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">{product.category}</p>
          <small className="text-default-500">{product.brand}</small>
          <h4 className="font-bold text-large">{product.title}</h4>
        </CardHeader>
        <CardBody className="overflow-visible py-2 justify-center">
          <Image
            alt="Card background"
            className="object-cover rounded-xl w-[270px] h-[180px]"
            src={product.thumbnail}
            isZoomed
          />
        </CardBody>
        <CardFooter className="flex w-full justify-center items-center">
          {product.stock < 1 ? (
            <>
              <Button
                className="text-tiny text-white bg-black/20"
                variant="bordered"
              >
                Notify me
              </Button>
            </>
          ) : (
            <div className="flex justify-between items-center w-full">
              <p className="text-medium font-medium">₹{product.price}</p>
              <ButtonGroup>
                <Button isIconOnly variant="bordered">
                  <BiCartAdd />
                </Button>
                <Button variant="bordered">Buy Now</Button>
              </ButtonGroup>
            </div>
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default ProductCard;
