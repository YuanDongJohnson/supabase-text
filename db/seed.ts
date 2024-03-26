import { db } from "./index";
import { products } from "./schema";

const main = async () => {
  try {
    console.info("-------- Seeding database --------");

    // deletes all the existing data in the 'products' table
    await db.delete(products);

    const res = await fetch("https://dummyjson.com/products");
    const data = await res.json();
    await db.insert(products).values([...data.products]);

    console.info("-------- Database Updated --------");
    process.exit(0);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed database");
  }
};

main();
