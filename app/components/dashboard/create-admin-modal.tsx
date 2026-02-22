"use client";

import { useState } from "react";
import { UserPlus, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface ModalProps {
  token: string | undefined;
}

export function CreateAdminModal({ token }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/create-admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Passing the token safely
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await res.json();

      if (res.ok && result.success) {
        alert("Admin account created successfully!");
        setIsOpen(false);
        router.refresh(); // Refresh the user list in dashboard
      } else {
        alert(result.message || "Something went wrong");
      }
    } catch (err) {
      alert("Network error. Please check your API connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
      >
        <UserPlus className="h-5 w-5" /> Create Admin
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-2xl font-black text-slate-900">New Admin</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    required
                    className="p-4 bg-slate-50 border border-slate-100 rounded-2xl w-full outline-none focus:border-indigo-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    required
                    className="p-4 bg-slate-50 border border-slate-100 rounded-2xl w-full outline-none focus:border-indigo-600"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="p-4 bg-slate-50 border border-slate-100 rounded-2xl w-full outline-none focus:border-indigo-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="p-4 bg-slate-50 border border-slate-100 rounded-2xl w-full outline-none focus:border-indigo-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Register Admin Account"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
