import Link from "next/link";
import { LayoutDashboard, Tag } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
      <div className="container mx-auto px-6">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-10 bg-white p-2 rounded-[24px] border border-slate-100 w-fit shadow-sm">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase hover:bg-slate-50 transition-all focus:bg-indigo-600 focus:text-white"
          >
            <LayoutDashboard size={16} /> User Management
          </Link>
          <Link
            href="/dashboard/categories"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase hover:bg-slate-50 transition-all focus:bg-indigo-600 focus:text-white"
          >
            <Tag size={16} /> Categories
          </Link>
        </div>

        {/* Dynamic Content */}
        {children}
      </div>
    </div>
  );
}
