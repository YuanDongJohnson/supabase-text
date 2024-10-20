import { Button, Dialog, DialogOverlay, DialogContent, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { IoPersonCircleOutline } from "react-icons/io5";

export default function AuthButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const supabase = createClient();
  const [user, setUser] = useState(null);

  // 在组件加载时检查用户是否已经登录
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();
  }, [supabase]);

  return (
    <>
      {user ? (
        <Button as={Link} href="/profile" variant="bordered" startIcon={<IoPersonCircleOutline size={24} />}>
          Profile
        </Button>
      ) : (
        <Button onClick={onOpen} variant="bordered" startIcon={<IoPersonCircleOutline size={24} />}>
          Login
        </Button>
      )}

      <DialogOverlay isOpen={isOpen} onDismiss={onClose}>
        <DialogContent>
          <Button
            as={Link}
            href="/auth/login"
            variant="bordered"
            onClick={onClose}
            autoFocus
          >
            Login
          </Button>
        </DialogContent>
      </DialogOverlay>
    </>
  );
}
