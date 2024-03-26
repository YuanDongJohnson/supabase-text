import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@/utils/supabase/admin";
import { cache } from "react";

export const getProducts = cache(
  async ({ search }: { search?: string | string[] | undefined } = {}) => {
    try {
      const supabase = createClient();
      let query = supabase.from("products").select();
      if (search) query = query.ilike("title", `%${search}%`);
      const { data } = await query;
      return data;
    } catch (error) {
      console.error("Error getting products: ", error);
    }
  }
);

export const getUsers = cache(async () => {
  const supabase = createAdminClient();
  // Defaults to return 50 users per page.
  // https://supabase.com/docs/reference/javascript/auth-admin-listusers
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("Error getting Users : ", error);
    return [];
  }
  return users;
});
