import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardBody, Divider } from "@nextui-org/react";
import Upload from "@/components/storage/Upload";
import { ServerPage } from "@/app/page";
import ErrorCard from "@/components/Common/ErrorCard";
import FilesTable from "@/components/storage/FilesTable";
import { FileObject } from "@supabase/storage-js";
import {
  TotalProgress,
  UserProgress,
  isUserProgressAtMax,
} from "@/components/storage/Progress";
import { Metadata } from "next";

const Storage = async ({ searchParams }: ServerPage) => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login?next=storage");
  }

  let files: FileObject[] = [];

  if (!searchParams.fetch_error) {
    // fetching user files
    // fetching on server side so files are updated instantly after a route refresh
    const { data, error } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
      .list(user.id, {
        sortBy: {
          column: "updated_at",
          order: "desc",
        },
      });
    if (error) {
      return redirect(`/storage?fetch_error=${error.message}`);
    }

    files = data;
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 w-full px-6 py-6">
        <Card className="w-full">
          <CardBody className="capitalize text-center">
            This route is only available to Logged in Users
          </CardBody>
        </Card>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <UserProgress files={files} />
          <TotalProgress supabase={supabase} />
        </div>
        <Divider />
        {searchParams.fetch_error && (
          <ErrorCard
            error={`There Was An Error fetching files : ${searchParams.fetch_error}`}
          />
        )}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex sm:w-3/5 sm:order-1 order-2">
            <FilesTable files={files} user={user} />
          </div>
          <div className="flex flex-col sm:w-2/5 sm:order-2 order-1 gap-6 items-center sm:items-end">
            <Upload user={user} disabled={isUserProgressAtMax(files)} />
            <Divider className="sm:hidden" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Storage;

export const metadata: Metadata = {
  title: "Files",
};
