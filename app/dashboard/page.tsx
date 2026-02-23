import { cookies } from "next/headers";
import Image from "next/image";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DollarSign,
  GraduationCap,
  Tag,
  PlayCircle,
  CheckCircle2,
} from "lucide-react";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

// Components
import { CreateAdminModal } from "@/app/components/dashboard/create-admin-modal";
import { UserActions } from "@/app/components/dashboard/user-actions";
import { InstructorActions } from "@/app/components/dashboard/InstructorActions";
import { LessonPlayer } from "@/app/components/dashboard/LessonPlayer";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const activeTab = searchParams.tab || "users";

  if (!token) redirect("/login");

  let userRole = "STUDENT";
  try {
    const decoded: any = jwtDecode(token);
    userRole = decoded.role;
  } catch (err) {
    redirect("/login");
  }

  // 1. Universal Data Fetching
  const [dashRes, catRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/cat`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  const dashResult = await dashRes.json();
  const catResult = await catRes.json();
  const data = dashResult?.data;
  const allCategories = catResult?.data || [];

  // 2. Role Based Specific Data
  let allUsers = [];
  let instructorCourses = [];
  let studentEnrolledCourses = [];

  // Admin/Super Admin Logic
  if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") {
    const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      cache: "no-store",
      headers: { Authorization: `Bearer ${token}` },
    });
    const userResult = await userRes.json();
    allUsers = userResult?.data || [];
  }

  // Instructor Logic
  if (userRole === "INSTRUCTOR") {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/course/my-courses`,
      {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const result = await res.json();
    instructorCourses = result?.data || [];
  }

  // Student Logic (Enrolled Courses)
  if (userRole === "STUDENT") {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/enrollments/my`,
      {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const result = await res.json();
    studentEnrolledCourses = result?.data || [];
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
      <div className="container mx-auto px-6">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3 italic">
            <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100">
              <LayoutDashboard className="h-7 w-7 text-white" />
            </div>
            {userRole.replace("_", " ")} Portal
          </h1>
          <div className="flex items-center gap-3">
            {userRole === "SUPER_ADMIN" && <CreateAdminModal token={token} />}
            {userRole === "INSTRUCTOR" && (
              <InstructorActions token={token} categories={allCategories} />
            )}
          </div>
        </div>

        {/* --- Global Stats --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard
            label="Total Users"
            value={data?.stats?.totalUsers || 0}
            icon={<Users />}
            color="bg-blue-500"
          />
          <StatCard
            label="Courses"
            value={data?.stats?.totalCourses || 0}
            icon={<BookOpen />}
            color="bg-amber-500"
          />
          <StatCard
            label="My Enrollments"
            value={data?.stats?.myEnrollments || 0}
            icon={<GraduationCap />}
            color="bg-indigo-500"
          />
          <StatCard
            label="Earnings/Revenue"
            value={`$${data?.stats?.totalRevenue || 0}`}
            icon={<DollarSign />}
            color="bg-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* 1. ADMIN/SUPER ADMIN VIEW */}
            {(userRole === "SUPER_ADMIN" || userRole === "ADMIN") && (
              <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex gap-4">
                  <TabLink
                    active={activeTab === "users"}
                    href="/dashboard?tab=users"
                    label="Users"
                  />
                  <TabLink
                    active={activeTab === "categories"}
                    href="/dashboard?tab=categories"
                    label="Categories"
                  />
                </div>
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-50">
                    {activeTab === "users"
                      ? allUsers.map((user: any) => (
                          <tr key={user.id} className="hover:bg-slate-50/50">
                            <td className="p-6 flex items-center gap-4">
                              <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold uppercase">
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
                        ))
                      : allCategories.map((cat: any) => (
                          <tr key={cat.id} className="hover:bg-slate-50/50">
                            <td className="p-6 font-bold">{cat.name}</td>
                            <td className="p-6 text-indigo-600 font-bold text-xs">
                              {cat._count?.courses || 0} Courses
                            </td>
                            <td className="p-6 text-right">
                              <button className="text-red-500 text-xs font-black">
                                DELETE
                              </button>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* 2. INSTRUCTOR & STUDENT VIEW (Course Content) */}
            {(userRole === "INSTRUCTOR" || userRole === "STUDENT") && (
              <div className="space-y-8">
                <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                  <PlayCircle className="text-indigo-600" />{" "}
                  {userRole === "INSTRUCTOR"
                    ? "My Created Courses"
                    : "My Learning Journey"}
                </h2>

                {(userRole === "INSTRUCTOR"
                  ? instructorCourses
                  : studentEnrolledCourses
                ).map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-black text-slate-800">
                        {item.title || item.course?.title}
                      </h3>
                      {userRole === "STUDENT" && (
                        <span className="flex items-center gap-1 text-emerald-500 text-[10px] font-black uppercase">
                          <CheckCircle2 size={14} /> Enrolled
                        </span>
                      )}
                    </div>
                    <LessonPlayer
                      lessons={item.lessons || item.course?.lessons}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- Right Sidebar --- */}
          <div className="space-y-6">
            <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-2">
                Top Courses <Tag className="h-5 w-5 text-indigo-600" />
              </h2>
              <div className="space-y-6">
                {(data?.popularCourses || []).slice(0, 3).map((course: any) => (
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

// Reusable Components
function StatCard({ label, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 hover:border-indigo-100 transition-all">
      <div
        className={`h-14 w-14 ${color} text-white rounded-2xl flex items-center justify-center shadow-lg`}
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

function TabLink({
  active,
  href,
  label,
}: {
  active: boolean;
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${active ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "bg-slate-50 text-slate-400 hover:text-slate-600"}`}
    >
      {label}
    </Link>
  );
}
