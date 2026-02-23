"use client";

import { useState } from "react";
import { PlusCircle, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function InstructorActions({
  token,
  categories,
}: {
  token: string;
  categories: any[];
}) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: categories[0]?.id || "",
    lessonTitle: "",
    videoUrl: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 1: Create Course
      const courseRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/course`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            isPaid: parseFloat(formData.price) > 0,
            categoryId: formData.categoryId,
          }),
        },
      );

      const courseResult = await courseRes.json();

      if (courseResult.success) {
        const newCourseId = courseResult.data.id;

        // Step 2: Create Lesson
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lesson`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: formData.lessonTitle,
            content: "Welcome to the first lesson!",
            videoUrl: formData.videoUrl,
            order: 1,
            isPreview: true,
            courseId: newCourseId,
          }),
        });

        alert("Course & Lesson Published Successfully!");
        setShowModal(false);
        router.refresh();
      }
    } catch (error) {
      alert("Error publishing course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all"
      >
        <PlusCircle className="h-5 w-5" /> Quick Launch
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg p-8 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-black text-slate-900 mb-6">
              Create New Course
            </h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                  Course Title
                </label>
                <input
                  required
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-600 outline-none text-sm font-bold"
                  placeholder="e.g. Mastering Next.js"
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Price ($)
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none text-sm font-bold"
                    placeholder="49.99"
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">
                    Category
                  </label>
                  <select
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none text-sm font-bold"
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-black text-slate-900 mb-3 uppercase tracking-wider">
                  First Lesson Details
                </h3>
                <input
                  required
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none text-sm font-bold mb-3"
                  placeholder="Lesson Title (e.g. Intro)"
                  onChange={(e) =>
                    setFormData({ ...formData, lessonTitle: e.target.value })
                  }
                />
                <input
                  required
                  className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none text-sm font-bold"
                  placeholder="YouTube Video URL"
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                />
              </div>

              <button
                disabled={loading}
                className="w-full bg-indigo-600 text-white p-5 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Publish Now"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
