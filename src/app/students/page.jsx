"use client";

import { db } from "../../../utils/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null);

  const studentsRef = collection(db, "students");

  const fetchStudents = async () => {
    const snapshot = await getDocs(studentsRef);
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStudents(list);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    if (editId) {
      // تعديل
      const studentDoc = doc(db, "students", editId);
      await updateDoc(studentDoc, { name, email });
      setEditId(null);
    } else {
      // إضافة جديد
      await addDoc(studentsRef, { name, email });
    }

    setName("");
    setEmail("");
    fetchStudents();
  };

  const handleEdit = (student) => {
    setName(student.name);
    setEmail(student.email);
    setEditId(student.id);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "students", id));
    fetchStudents();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">👥 إدارة الطلبة</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6 max-w-md">
        <input
          type="text"
          placeholder="اسم الطالب"
          className="w-full border px-2 py-1 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          className="w-full border px-2 py-1 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "تحديث الطالب" : "إضافة طالب"}
        </button>
      </form>

      <div className="space-y-3">
        {students.map((student) => (
          <div
            key={student.id}
            className="w-[50%] border-2 border-black p-2 flex justify-between items-center rounded"
          >
            <div>
              <p>{student.name}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleEdit(student)}
                className="text-blue-600 font-bold"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDelete(student.id)}
                className="text-red-600 font-bold"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
