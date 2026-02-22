"use client";

import { useState, useRef, useEffect } from "react";
import { Trash2, ShieldCheck, Loader2, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserActions({
  userId,
  token,
}: {
  userId: string;
  token: string | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = async (type: "ROLE" | "DELETE", value?: string) => {
    if (!confirm(`Are you sure you want to proceed?`)) return;
    setLoading(true);
    setIsOpen(false);

    try {
      const url =
        type === "DELETE"
          ? `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`
          : `${process.env.NEXT_PUBLIC_API_URL}/users/status/${userId}`;

      const res = await fetch(url, {
        method: type === "DELETE" ? "DELETE" : "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: type === "ROLE" ? JSON.stringify({ role: value }) : undefined,
      });

      if (res.ok) router.refresh();
      else alert("Action failed");
    } catch (err) {
      alert("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-2 items-center" ref={menuRef}>
      {loading ? (
        <Loader2 className="animate-spin h-5 w-5 text-indigo-600" />
      ) : (
        <>
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl border transition-all ${
                isOpen
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-600"
              }`}
            >
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase">Change</span>
              <ChevronDown
                size={12}
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 z-[60] animate-in slide-in-from-top-2 duration-200">
                {["STUDENT", "INSTRUCTOR", "ADMIN", "SUPER_ADMIN"].map(
                  (role) => (
                    <button
                      key={role}
                      onClick={() => handleAction("ROLE", role)}
                      className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all"
                    >
                      Make {role}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => handleAction("DELETE")}
            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
          >
            <Trash2 size={18} />
          </button>
        </>
      )}
    </div>
  );
}
