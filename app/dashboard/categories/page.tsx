import { cookies } from "next/headers";
import Image from "next/image";
import {
  Trash2,
  Edit3,
  Tag,
  Layers,
  PlayCircle,
  User as UserIcon,
  PlusCircle,
  Link as LinkIcon,
} from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreateCategoryModal } from "@/app/components/dashboard/create-category-modal";

export default async function CategoriesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  // ১. সব ক্যাটাগরি ফেচ করা
  const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cat`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  const catResult = await catRes.json();
  const categories = catResult?.data || [];

  // ২. সব কোর্স ফেচ করা (যাতে আমরা categoryId দিয়ে ফিল্টার করতে পারি)
  const courseRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  const courseResult = await courseRes.json();
  const allCourses = courseResult?.data || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-12 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100">
                <Layers className="h-7 w-7 text-white" />
              </div>
              Platform Collections
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              Dynamic Course-to-Category Alignment based on CID.
            </p>
          </div>
          <CreateCategoryModal token={token} />
        </div>

        {/* ক্যাটাগরি লুপ */}
        <div className="space-y-12">
          {categories.map((cat: any) => {
            // ফিল্টারিং লজিক: এই ক্যাটাগরির ID এর সাথে যে কোর্সগুলোর categoryId মিলে যায়
            const matchedCourses = allCourses.filter(
              (course: any) => course.categoryId === cat.id,
            );

            return (
              <div key={cat.id} className="space-y-6">
                {/* Category Bar */}
                <div className="flex items-center justify-between bg-white px-8 py-6 rounded-[30px] border border-slate-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-indigo-600"></div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <Tag size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                        {cat.name}
                      </h2>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <LinkIcon size={10} /> ID: {cat.id}
                        </span>
                        <span className="px-3 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">
                          {matchedCourses.length} Aligned Courses
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={20} />
                  </button>
                </div>

                {/* কোর্সের গ্রিড যা এই ক্যাটাগরির সাথে কানেক্টেড */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {matchedCourses.length > 0 ? (
                    matchedCourses.map((course: any) => (
                      <div
                        key={course.id}
                        className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-indigo-100/40 transition-all"
                      >
                        <div className="relative h-48 w-full">
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                        <div className="p-6 space-y-4">
                          <h3 className="text-lg font-black text-slate-900 line-clamp-1 group-hover:text-indigo-600">
                            {course.title}
                          </h3>
                          <div className="flex items-center justify-between border-y border-slate-50 py-3">
                            <div className="flex items-center gap-2">
                              <UserIcon size={14} className="text-slate-400" />
                              <span className="text-[10px] font-black text-slate-600 uppercase">
                                {course.instructor?.firstName}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <PlayCircle
                                size={14}
                                className="text-indigo-500"
                              />
                              <span className="text-[10px] font-black text-indigo-600 uppercase">
                                {course.lessons?.length || 0} Lessons
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link
                              prefetch={false}
                              href={`/dashboard/courses/edit/${course.id}`}
                              className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-indigo-600 transition-all"
                            >
                              Edit
                            </Link>
                            <button className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white/40 border-2 border-dashed border-slate-200 rounded-[35px] text-slate-300">
                      <PlusCircle size={32} className="mb-2 opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-widest">
                        No course aligned to {cat.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
