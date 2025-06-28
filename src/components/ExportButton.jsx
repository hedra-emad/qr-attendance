"use client";

import { getDocs, collection, deleteDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ExportButton() {
  const handleExport = async () => {
    try {
      // 1. الطلبة
      const studentsSnap = await getDocs(collection(db, "students"));
      const students = studentsSnap.docs.map((doc) => doc.data());

      // 2. الحضور
      const attendanceSnap = await getDocs(collection(db, "attendance"));
      const attendanceDocs = attendanceSnap.docs;

      if (attendanceDocs.length === 0) {
        alert("⚠️ مفيش بيانات حضور لحد دلوقتي.");
        return;
      }

      const attendance = attendanceDocs.map((doc) => doc.data());

      // 3. إيميلات الحضور
      const attendanceEmails = attendance.map((a) => a.email);

      // 4. استخرج الغياب
      const absence = students.filter(
        (student) => !attendanceEmails.includes(student.email)
      );

      // 5. إعداد الملف
      const wb = XLSX.utils.book_new();
      const wsPresent = XLSX.utils.json_to_sheet(attendance);
      const wsAbsent = XLSX.utils.json_to_sheet(absence);
      XLSX.utils.book_append_sheet(wb, wsPresent, "الحضور");
      XLSX.utils.book_append_sheet(wb, wsAbsent, "الغياب");

      // 6. تحميل
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "attendance_report.xlsx"
      );

      // 7. مسح الحضور
      for (const docSnap of attendanceDocs) {
        await deleteDoc(docSnap.ref);
      }

      alert("✅ تم تحميل التقرير ومسح بيانات الحضور");
    } catch (err) {
      console.error(err);
      alert("❌ حصل خطأ أثناء التصدير أو المسح");
    }
  };

  return (
    <button
      onClick={handleExport}
      className="bg-blue-700 text-white px-4 py-2 rounded w-fit"
    >
      تحميل تقرير الحضور والغياب
    </button>
  );
}
