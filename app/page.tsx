import { getProducts } from "@/utils/dbHelper";
import ProductCard from "@/components/Home/ProductCard";
import ProductSearch from "@/components/Home/ProductSearch";
import { redirect } from "next/navigation";

export interface ServerPage {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Index({ searchParams }: ServerPage) {
  if (searchParams.code) {
    return redirect(`/auth/callback?code=${searchParams.code}`);
  }

  const Products = await getProducts({ search: searchParams.search });

  return (
    <div className="flex flex-col gap-4 sm:gap-6 px-4 py-4 w-full">
      <ProductSearch />
      <div className="flex flex-wrap gap-4 justify-center items-center">
        {Products && Products?.length > 0 ? (
          <>
            {Products?.map((product) => {
              return <ProductCard key={product.id} product={product} />;
            })}
          </>
        ) : (
          <>No Products Available</>
        )}
      </div>
    </div>
  );
}
