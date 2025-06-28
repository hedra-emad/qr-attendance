"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../utils/firebase";
import LogoutButton from "@/components/LogoutButton";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AttendancePage() {
  const [user, loading] = useAuthState(auth);
  const [scanner, setScanner] = useState(null);
  const [result, setResult] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (user && !scanner) {
      const s = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: 250,
      });

      s.render(async (decodedText) => {
        s.clear();
        setScanner(null);
        try {
          const parsed = JSON.parse(decodedText);

          if (parsed.email !== user.email) {
            setResult("❌ QR لا يخص المستخدم الحالي.");
            return;
          }

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const ref = collection(db, "attendance");
          const q = query(
            ref,
            where("email", "==", parsed.email),
            where("timestamp", ">=", Timestamp.fromDate(today))
          );

          const snap = await getDocs(q);

          if (!snap.empty) {
            setResult("⚠️ تم تسجيل الحضور مسبقًا.");
            return;
          }

          await addDoc(ref, {
            name: parsed.name,
            email: parsed.email,
            timestamp: new Date(),
          });

          setResult("✅ تم تسجيل الحضور بنجاح 🎉");
        } catch (err) {
          console.error(err);
          setResult("❌ QR غير صالح.");
        }
      });

      setScanner(s);
    }
  }, [user, loading]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📷 تسجيل الحضور</h1>
      <div id="reader" className="mb-4" />
      <p className="text-lg text-center">{result}</p>
      <LogoutButton />
    </div>
  );
}
