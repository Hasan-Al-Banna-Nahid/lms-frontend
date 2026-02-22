import { cookies } from "next/headers";
import Image from "next/image";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DollarSign,
  GraduationCap,
  Tag,
  ArrowRight,
} from "lucide-react";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { CreateAdminModal } from "@/app/components/dashboard/create-admin-modal";
import { UserActions } from "@/app/components/dashboard/user-actions";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const activeTab = searchParams.tab || "users"; // Default tab is users

  if (!token) redirect("/login");

  let userRole = "STUDENT";
  try {
    const decoded: any = jwtDecode(token);
    userRole = decoded.role;
  } catch (err) {
    redirect("/login");
  }

  // 1. Fetch Dashboard Stats
  const dashRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  const dashResult = await dashRes.json();
  const data = dashResult?.data;

  // 2. Fetch Data based on Active Tab
  let allUsers = [];
  let allCategories = [];

  if (userRole === "SUPER_ADMIN") {
    if (activeTab === "users") {
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });
      const userResult = await userRes.json();
      allUsers = userResult?.data || [];
    } else if (activeTab === "categories") {
      const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cat`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });
      const catResult = await catRes.json();
      allCategories = catResult?.data || [];
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100">
                <LayoutDashboard className="h-7 w-7 text-white" />
              </div>
              {userRole.replace("_", " ")} Portal
            </h1>
          </div>
          {userRole === "SUPER_ADMIN" && <CreateAdminModal token={token} />}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            label="Total Users"
            value={data?.stats?.totalUsers || 0}
            icon={<Users />}
            color="bg-blue-500"
          />
          <StatCard
            label="Live Courses"
            value={data?.stats?.totalCourses || 0}
            icon={<BookOpen />}
            color="bg-amber-500"
          />
          <StatCard
            label="Enrollments"
            value={data?.stats?.totalEnrollments || 0}
            icon={<GraduationCap />}
            color="bg-indigo-500"
          />
          <StatCard
            label="Revenue"
            value={`$${data?.stats?.totalRevenue || 0}`}
            icon={<DollarSign />}
            color="bg-emerald-500"
          />
        </div>

        {/* Tab Switcher */}
        {userRole === "SUPER_ADMIN" && (
          <div className="flex gap-2 mb-8 bg-slate-100 p-1.5 rounded-[20px] w-fit">
            <Link
              href="/dashboard?tab=users"
              className={`px-6 py-2.5 rounded-[16px] text-xs font-black uppercase transition-all ${
                activeTab === "users"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              User Management
            </Link>
            <Link
              href="/dashboard?tab=categories"
              className={`px-6 py-2.5 rounded-[16px] text-xs font-black uppercase transition-all ${
                activeTab === "categories"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Categories
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {/* Conditional Table Rendering */}
            <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900 capitalize">
                  {activeTab} Management
                </h2>
                {activeTab === "categories" && (
                  <Link
                    href="/dashboard/categories"
                    className="text-indigo-600 font-bold text-xs flex items-center gap-1 hover:underline"
                  >
                    View Full Page <ArrowRight size={14} />
                  </Link>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400">
                        {activeTab === "users" ? "Profile" : "Category Name"}
                      </th>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400">
                        {activeTab === "users" ? "Role" : "Course Count"}
                      </th>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {/* Render Users */}
                    {activeTab === "users" &&
                      allUsers.map((user: any) => (
                        <tr
                          key={user.id}
                          className="group hover:bg-slate-50/40 transition-all"
                        >
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                                {user.firstName[0]}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase">
                              {user.role}
                            </span>
                          </td>
                          <td className="p-6 text-right">
                            <UserActions userId={user.id} token={token} />
                          </td>
                        </tr>
                      ))}

                    {/* Render Categories */}
                    {activeTab === "categories" &&
                      allCategories.map((cat: any) => (
                        <tr
                          key={cat.id}
                          className="group hover:bg-slate-50/40 transition-all"
                        >
                          <td className="p-6 font-bold text-slate-900">
                            {cat.name}
                          </td>
                          <td className="p-6 font-bold text-indigo-600 text-xs">
                            {cat._count?.courses || 0} Courses
                          </td>
                          <td className="p-6 text-right">
                            <button className="text-slate-400 hover:text-red-600 px-4 transition-colors">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2">
                Popular Courses <Tag className="h-5 w-5 text-indigo-600" />
              </h2>
              <div className="space-y-6">
                {data?.popularCourses?.map((course: any) => (
                  <div key={course.id} className="group cursor-pointer">
                    <div className="relative h-40 w-full rounded-[24px] overflow-hidden mb-4 border border-slate-50">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover group-hover:scale-110 duration-500"
                      />
                    </div>
                    <h4 className="font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h4>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// Keep the StatCard component as it was...
function StatCard({ label, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 hover:border-indigo-100 transition-all group">
      <div
        className={`h-14 w-14 ${color} text-white rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110`}
      >
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <h3 className="text-2xl font-black text-slate-900">{value}</h3>
      </div>
    </div>
  );
}
