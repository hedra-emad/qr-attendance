"use client";

import { auth, provider } from "../../../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("❌ فشل تسجيل الدخول");
    }
  };

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button
        onClick={login}
        className="w-[25%] bg-[#3b82f6]  text-white font-bold text-3xl px-4 py-2 rounded hover:"
      >
        تسجيل الدخول
      </button>
    </div>
  );
}
