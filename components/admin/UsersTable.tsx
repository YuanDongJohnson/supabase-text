"use client";
import React from "react";
import { User as UserType } from "@supabase/supabase-js";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
  Pagination,
} from "@nextui-org/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiSearch } from "react-icons/fi";

const UsersTable = ({ users }: { users: UserType[] }) => {
  const [filterValue, setFilterValue] = React.useState("");
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.user_metadata?.full_name
          ?.toLowerCase()
          .includes(filterValue.toLowerCase())
      );
    }
    return filteredUsers;
  }, [users, filterValue]);

  const items = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [currentPage, filteredItems, rowsPerPage]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setCurrentPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const headerColumns = [
    { name: "USER", uid: "user" },
    { name: "ROLE", uid: "role" },
    { name: "PROVIDER", uid: "provider" },
    { name: "LAST_SIGN_IN", uid: "last_sign_in" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-sm",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name..."
            size="md"
            startContent={<FiSearch className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total users : {users.length}
          </span>
        </div>
      </div>
    );
  }, [filterValue, onSearchChange, users.length, hasSearchFilter]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          page={currentPage}
          total={pages}
          variant="light"
          onChange={setCurrentPage}
        />
      </div>
    );
  }, [items.length, currentPage, pages, hasSearchFilter]);

  const RenderUser = ({ user }: { user: UserType }) => {
    return (
      <User
        name={user.user_metadata?.full_name}
        avatarProps={{
          radius: "full",
          size: "sm",
          src: user.user_metadata?.avatar_url,
          isBordered: true,
          showFallback: true,
          name: undefined,
        }}
        classNames={{
          description: "text-default-500",
        }}
        description={user.email}
      />
    );
  };

  const Actions = () => {
    return (
      <div className="relative flex justify-end items-center gap-2">
        <Dropdown
          className="bg-background border-1 border-default-200"
          aria-label="Action"
        >
          <DropdownTrigger>
            <Button isIconOnly radius="full" size="sm" variant="light">
              <BsThreeDotsVertical className="text-default-400" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Actions Menu">
            <DropdownItem>View</DropdownItem>
            <DropdownItem>Edit</DropdownItem>
            <DropdownItem>Delete</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  };

  return (
    <>
      <Table
        isCompact
        aria-label="Table Showing Users Information"
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper:
              "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={{
          wrapper: ["max-h-[382px]", "max-w-3xl", "sm:max-w-full"],
          th: [
            "bg-transparent",
            "text-default-500",
            "border-b",
            "border-divider",
          ],
          td: [
            // changing the rows border radius
            // first
            "group-data-[first=true]:first:before:rounded-none",
            "group-data-[first=true]:last:before:rounded-none",
            // middle
            "group-data-[middle=true]:before:rounded-none",
            // last
            "group-data-[last=true]:first:before:rounded-none",
            "group-data-[last=true]:last:before:rounded-none",
          ],
        }}
        selectionMode="multiple"
        topContent={topContent}
        bottomContent={bottomContent}
        topContentPlacement="outside"
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn key={column.uid} align="end">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No users found"}>
          {items.map((user) => {
            return (
              <TableRow key={user.id}>
                <TableCell>
                  <RenderUser user={user} />
                </TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell className="capitalize">
                  {user.app_metadata.provider}
                </TableCell>
                <TableCell>
                  {new Date(String(user.last_sign_in_at)).toDateString()}
                </TableCell>
                <TableCell>
                  <Actions />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default UsersTable;
