import React from "react";
import { Input } from "@nextui-org/react";
import { FiSearch } from "react-icons/fi";
import { redirect } from "next/navigation";

const ProductSearch = () => {
  const searchProducts = async (formData: FormData) => {
    "use server";
    const searchKey = formData.get("search");
    return redirect(`/?search=${searchKey}`);
  };

  return (
    <form
      className="flex justify-center sm:justify-end items-center"
      action={searchProducts}
    >
      <Input
        variant="bordered"
        name="search"
        placeholder="Search For Products..."
        isClearable
        size="md"
        startContent={<FiSearch size={20} />}
        className="w-full max-w-xs"
      />
    </form>
  );
};

export default ProductSearch;
