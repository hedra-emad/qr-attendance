"use client";

import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../../utils/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ExportButton from "@/components/ExportButton";
import LogoutButton from "@/components/LogoutButton";

// حط هنا إيميلات الأدمنز
const adminEmails = ["emadhedra4@gmail.com", "admin2@gmail.com"];

export default function DashboardPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      setIsAdmin(adminEmails.includes(user.email));
    }
  }, [user, loading]);

  if (loading || !user) {
    return <p className="text-center mt-10">جاري التحقق من المستخدم...</p>;
  }

  return (
    <div className="w-full p-6">
      <div className="flex items-center flex-col gap-4">
        {!isAdmin && (
          <>
            <Link
              href="/attendance"
              className="bg-blue-600 p-3 mt-3  w-fit rounded-2xl"
            >
              📷 تسجيل الحضور
            </Link>
            <LogoutButton />
          </>
        )}

        {isAdmin && (
          <>
            <Link
              href="/students"
              className="bg-blue-600 p-3 mt-3  w-fit rounded-2xl"
            >
              إضافة +++{" "}
            </Link>
            <ExportButton />
            <LogoutButton />
          </>
        )}
      </div>
    </div>
  );
}
