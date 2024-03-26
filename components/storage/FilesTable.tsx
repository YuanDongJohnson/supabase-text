"use client";
import React, { useMemo, useState } from "react";
import { FileObject } from "@supabase/storage-js";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  ButtonGroup,
  Link,
  Pagination,
} from "@nextui-org/react";
import { bytesToSize } from "@/components/storage/Progress";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaDownload, FaLink, FaRegCircleCheck } from "react-icons/fa6";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@supabase/supabase-js";
import ErrorCard from "@/components/Common/ErrorCard";
import MessageCard from "@/components/Common/MessageCard";

const FilesTable = ({ files, user }: { files: FileObject[]; user: User }) => {
  const supabase = createClient();
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState<Set<string> | "all">(
    new Set([])
  );
  const router = useRouter();
  const searchParams = useSearchParams();

  const rowsPerPage = 5;

  const pages = Math.ceil(files.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return files.slice(start, end);
  }, [page, files]);

  const deleteMultipleFiles = async () => {
    if (
      selectedKeys === "all" &&
      window.confirm(
        "Are you sure? This will delete all the files stored with your account"
      )
    ) {
      Array(...files).map(async (file) => {
        const { error } = await supabase.storage
          .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
          .remove([`${user.id}/${file.name}`]);
        if (error) {
          console.error(error);
        }
      });
    } else if (
      typeof selectedKeys === "object" &&
      window.confirm("Are you sure?")
    ) {
      for (const value of selectedKeys) {
        const file = files.find((file) => file.id == value);
        const { error } = await supabase.storage
          .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
          .remove([`${user.id}/${file?.name}`]);
        if (error) {
          console.error(error);
        }
      }
    }
    setSelectedKeys(new Set([]));
    router.refresh();
  };

  const columns = [
    { name: "FILE", uid: "file" },
    { name: "SIZE", uid: "size" },
    { name: "TYPE", uid: "type" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const returnFileUrl = (file: FileObject) => {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET}/${user.id}/${file.name}`;
  };

  const FileActions = ({ file }: { file: FileObject }) => {
    const [linkCopied, setLinkCopied] = useState(false);

    const copyLink = () => {
      navigator.clipboard.writeText(returnFileUrl(file));
      setLinkCopied(true);
      setTimeout(() => {
        setLinkCopied(false);
      }, 2000);
    };

    const downloadFile = async () => {
      const { data } = supabase.storage
        .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
        .getPublicUrl(`${user.id}/${file.name}`, {
          download: true,
        });
      window.open(data.publicUrl, "_blank");
    };

    const deleteFile = async () => {
      if (window.confirm("Are you sure?")) {
        const { error } = await supabase.storage
          .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET!)
          .remove([`${user.id}/${file.name}`]);
        if (error) {
          router.replace(`/storage?file_error=${error.message}`);
        }
        router.refresh();
      }
    };

    return (
      <ButtonGroup className="gap-1" variant="bordered" size="sm">
        <Button color="primary" isIconOnly onPress={copyLink}>
          {linkCopied ? <FaRegCircleCheck size={18} /> : <FaLink size={18} />}
        </Button>
        <Button color="secondary" isIconOnly onPress={downloadFile}>
          <FaDownload size={18} />
        </Button>
        <Button color="danger" isIconOnly onPress={deleteFile}>
          <MdOutlineDeleteOutline size={18} />
        </Button>
      </ButtonGroup>
    );
  };

  const topContent = (
    <div className="flex justify-between items-center gap-4">
      {searchParams.get("file_error") ? (
        <div className="w-full">
          <ErrorCard
            error={`FILE ERROR : ${searchParams.get("file_error")!}`}
          />
        </div>
      ) : (
        <div className="w-full flex justify-between">
          <MessageCard message={`Total Files : ${files.length}`} />
          <MessageCard
            message={`Selected Files : ${
              typeof selectedKeys == "object"
                ? selectedKeys?.size
                : files.length
            }`}
          />
        </div>
      )}
      <Button
        color="danger"
        isIconOnly
        onPress={deleteMultipleFiles}
        isDisabled={
          (typeof selectedKeys === "object" && selectedKeys.size < 1) ||
          files.length < 1
        }
      >
        <MdOutlineDeleteOutline size={18} />
      </Button>
    </div>
  );

  const bottomContent = (
    <div className="flex w-full justify-center">
      <Pagination
        isCompact
        showControls
        color="secondary"
        page={page}
        total={pages}
        onChange={(page) => setPage(page)}
      />
    </div>
  );

  return (
    <>
      <Table
        aria-label="Uploaded Files Table"
        topContent={topContent}
        bottomContent={bottomContent}
        topContentPlacement="outside"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => setSelectedKeys(keys as Set<string>)}
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={"end"}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent="No Files To Show">
          {(file) => (
            <TableRow key={file.id}>
              <TableCell>
                <Link
                  href={returnFileUrl(file)}
                  color="foreground"
                  target="_blank"
                >
                  {file.name}
                </Link>
              </TableCell>
              <TableCell>{bytesToSize(file.metadata.size)}</TableCell>
              <TableCell>{file.metadata.mimetype}</TableCell>
              <TableCell>
                <FileActions file={file} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default FilesTable;
