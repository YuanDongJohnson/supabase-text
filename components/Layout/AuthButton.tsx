import { createClient } from "@/utils/supabase/server";
import { Button, Dialog, DialogContent, DialogTitle, DialogFooter, DialogButton } from "@nextui-org/react";
import Link from "next/link";
import { useState } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";

export default function AuthButton() {
  const supabase = createClient();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginModalOpen = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const {
    data: { user },
  } = user ? { data: { user: null } } : await supabase.auth.getUser();

  return (
    <>
      {user ? (
        <Button href="/profile" variant="bordered" as={Link} isIconOnly>
          <IoPersonCircleOutline size={24} />
        </Button>
      ) : (
        <Button onClick={handleLoginModalOpen} variant="bordered" as={Link}>
          Login
        </Button>
      )}
      <Dialog open={isLoginModalOpen} onClose={handleLoginModalClose}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          {/* 在这里添加登录表单的代码 */}
          <p>Please log in to your account.</p>
        </DialogContent>
        <DialogFooter>
          <DialogButton onClick={handleLoginModalClose} variant="outlined">
            Close
          </DialogButton>
          <DialogButton onClick={handleLoginModalClose} variant="contained" color="primary">
            Login
          </DialogButton>
        </DialogFooter>
      </Dialog>
    </>
  );
}
