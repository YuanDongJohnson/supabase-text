import { createClient } from "@/utils/supabase/server";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { IoPersonCircleOutline } from "react-icons/io5";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <Button href="/profile" variant="bordered" as={Link} isIconOnly>
      <IoPersonCircleOutline size={24} />
    </Button>
  ) : (
    <Button href="/auth/login" variant="bordered" as={Link}>
      Login
    </Button>
  );
}
