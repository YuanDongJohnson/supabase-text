"use client";
import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Listbox,
  ListboxItem,
  ScrollShadow,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { MdDeleteOutline } from "react-icons/md";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { bytesToSize } from "@/components/storage/Progress";

const Upload = ({ user, disabled }: { user: User; disabled: boolean }) => {
  const router = useRouter();
  const [files, setFiles] = useState<File[] | null>(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (files: File[]) => {
    setFiles(files);
  };

  const supabase = createClient();

  const uploadFiles = async () => {
    if (files) {
      Array(...files).map(async (file) => {
        setLoading(true);
        await supabase.storage
          .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
          .upload(`${user.id}/${file.name}`, file);
        setLoading(false);
        setFiles([]);
        router.refresh();
      });
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col gap-4">
      <Card className="w-full max-w-sm h-full min-h-40 max-h-48">
        <CardBody>
          <FileUploader
            handleChange={handleChange}
            name="file"
            multiple
            classes="custom-file-uploader"
            minSize={0.01}
            maxSize={50}
            disabled={disabled}
            // styles added in globals.css
          />
        </CardBody>
        <CardFooter>
          <p className="w-full text-center text-[#666] text-sm">
            File Size Allowed: 10KB - 50MB
          </p>
        </CardFooter>
      </Card>
      {files && files.length > 0 && (
        <>
          <div className="w-full flex justify-between gap-4 h-fit min-h-10">
            <Button
              variant="solid"
              color="secondary"
              fullWidth
              onPress={uploadFiles}
              isLoading={loading}
            >
              {loading
                ? "Uploading..."
                : `Upload ${
                    files.length == 1 ? "1 File" : `${files.length} Files`
                  } To Bucket`}
            </Button>
            <Button
              isIconOnly
              isDisabled={loading}
              color="danger"
              variant="flat"
              onPress={() => {
                setFiles([]);
              }}
            >
              <MdDeleteOutline size={20} />
            </Button>
          </div>
          <ScrollShadow className="w-full h-full min-h-20 max-h-[250px]">
            <div className="w-full border-small rounded-small border-default-200 dark:border-default-100">
              <Listbox aria-label="Uploaded Files">
                {Array(...files).map((file) => {
                  return (
                    <ListboxItem
                      description={bytesToSize(file.size)}
                      classNames={{
                        title: "max-w-[90%] truncate",
                        wrapper: "max-w-[90%]",
                      }}
                      endContent={
                        <>
                          <Button
                            size="sm"
                            isIconOnly
                            onPress={() => {
                              const updatedFiles = Array(...files).filter(
                                (f) => f.name !== file.name
                              );
                              setFiles(updatedFiles);
                            }}
                            variant="bordered"
                            color="danger"
                            isDisabled={loading}
                          >
                            <MdDeleteOutline size={20} />
                          </Button>
                        </>
                      }
                      key={file.name}
                    >
                      {file.name}
                    </ListboxItem>
                  );
                })}
              </Listbox>
            </div>
          </ScrollShadow>
        </>
      )}
    </div>
  );
};

export default Upload;
