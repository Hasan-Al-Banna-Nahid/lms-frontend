"use client";

import { useState } from "react";
import { Tag, X, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateCategoryModal({ token }: { token: string | undefined }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setIsOpen(false);
        router.refresh(); // Refresh server component data
      } else {
        alert("Could not create category. It might already exist.");
      }
    } catch (err) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
      >
        <Plus className="h-5 w-5" /> New Category
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl animate-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Add Category
                </h2>
                <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">
                  Create a new course group
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-4">
                  Category Name
                </label>
                <input
                  name="name"
                  autoFocus
                  placeholder="e.g. Graphics Design"
                  required
                  className="p-5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-[24px] w-full outline-none transition-all font-bold text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-100 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Save and Publish"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
