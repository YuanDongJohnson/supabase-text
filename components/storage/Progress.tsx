import React from "react";
import { Progress } from "@nextui-org/react";
import { FileObject } from "@supabase/storage-js";
import { SupabaseClient } from "@supabase/supabase-js";

export function bytesToSize(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "n/a";
  const i = parseInt(
    Math.floor(Math.log(bytes) / Math.log(1024)).toString(),
    10
  );
  if (i === 0) return `${bytes} ${sizes[i]})`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

const getSumOfFilesSize = (files: FileObject[]) => {
  return files.reduce(
    (accumulator, file) => accumulator + file?.metadata?.size,
    0
  );
};

const getProgressColor = (value: number, maxValue: number) => {
  const percentage = (value / maxValue) * 100;

  if (percentage <= 50) {
    return "secondary";
  } else if (percentage > 50 && percentage < 90) {
    return "warning";
  } else {
    return "danger";
  }
};

export const UserProgress = ({ files }: { files: FileObject[] }) => {
  const value = getSumOfFilesSize(files);
  const maxValue = Number(process.env.UPLOAD_PER_USER);
  return (
    <Progress
      size="md"
      value={value}
      maxValue={maxValue}
      label="My Uploads"
      color={getProgressColor(value, maxValue)}
      showValueLabel={true}
      className="max-w-md"
    />
  );
};

export const isUserProgressAtMax = (files: FileObject[]) => {
  return getSumOfFilesSize(files) >= Number(process.env.UPLOAD_PER_USER);
};

export const TotalProgress = async ({
  supabase,
}: {
  supabase: SupabaseClient<any, "public", any>;
}) => {
  // returns folders in data
  const { data, error } = await supabase.storage
    .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
    .list();

  if (error) {
    console.error("Error listing folders:", error);
    return <></>;
  }

  const allFilesPromises = data?.map(async (folder) => {
    if (folder.name !== ".emptyFolderPlaceholder") {
      const { data, error } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
        .list(folder.name);

      if (!error) {
        return data;
      }
    }
    return [];
  });

  const allFiles = (await Promise.all(allFilesPromises)).flat();

  const value = getSumOfFilesSize(allFiles);
  const maxValue = Number(process.env.MAX_BUCKET_UPLOAD);
  return (
    <Progress
      size="md"
      label="Bucket Uploads"
      value={value}
      maxValue={maxValue}
      color={getProgressColor(value, maxValue)}
      showValueLabel={true}
      className="max-w-md"
    />
  );
};
