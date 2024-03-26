import {
  date,
  integer,
  pgTable,
  real,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  price: real("price").default(100.0).notNull(),
  discountPercentage: real("discount_percentage").default(0).notNull(),
  rating: real("rating").default(0).notNull(),
  stock: integer("stock").default(1).notNull(),
  brand: varchar("brand").notNull(),
  category: varchar("category").notNull(),
  thumbnail: varchar("thumbnail").notNull(),
  images: varchar("images").array().notNull(),
  createdAt: date("created_at").defaultNow().notNull(),
  updatedAt: date("updated_at").defaultNow().notNull(),
});

export const ProductType = products.$inferSelect;
