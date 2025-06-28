import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (err) {
      console.error("❌ Error logging out:", err);
      alert("حصل خطأ أثناء تسجيل الخروج");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded mt-4"
    >
      🚪 تسجيل الخروج
    </button>
  );
}
