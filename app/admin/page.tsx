import React from "react";
import { redirect } from "next/navigation";
import { getUsers } from "@/utils/dbHelper";
import { createClient } from "@/utils/supabase/server";
import { Card, CardBody, Divider, Link } from "@nextui-org/react";
import UsersTable from "@/components/admin/UsersTable";

const Admin = async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login?next=admin");
  }

  const users = await getUsers();

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 w-full px-6 py-6">
        <Card className="w-full">
          <CardBody>
            <p className="capitalize text-center w-full">
              This route is only available to Logged in Users and can be
              restricted to only Admins.{" "}
              <Link
                href={"https://www.youtube.com/watch?v=WUD1RLSd3U0"}
                color="primary"
                target="_blank"
              >
                Watch Tutorial
              </Link>
            </p>
          </CardBody>
        </Card>
        <Divider />
        <UsersTable users={users} />
      </div>
    </>
  );
};

export default Admin;
