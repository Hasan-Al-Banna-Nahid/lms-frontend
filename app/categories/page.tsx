import Image from "next/image";
import Link from "next/link";
import {
  Search,
  BookOpen,
  ArrowRight,
  Star,
  Layers,
  LayoutGrid,
} from "lucide-react";

export default async function GlobalCategoriesPage() {
  const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cat`, {
    cache: "no-store",
  });
  const catResult = await catRes.json();
  const categories = catResult?.data || [];

  const courseRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course`, {
    cache: "no-store",
  });
  const courseResult = await courseRes.json();
  const allCourses = courseResult?.data || [];

  return (
    <div className="min-h-screen bg-[#FCFDFF]">
      {/* Minimal Header Section */}
      <section className="pt-24 pb-16 border-b border-slate-100 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full mb-4">
                <LayoutGrid size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[2px]">
                  Course Catalog
                </span>
              </div>
              <h1 className="text-5xl font-black text-slate-900 leading-tight tracking-tighter">
                Find the perfect{" "}
                <span className="text-indigo-600">collection</span> for your
                career.
              </h1>
            </div>

            {/* Clean Search Input */}
            <div className="w-full md:w-[400px] relative group">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="space-y-24">
            {categories.map((cat: any) => {
              const matchedCourses = allCourses.filter(
                (course: any) => course.categoryId === cat.id,
              );

              if (matchedCourses.length === 0) return null;

              return (
                <div
                  key={cat.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  {/* Category Section Title */}
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
                        <Layers size={20} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
                          {cat.name}
                        </h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {matchedCourses.length} Courses available
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/categories/${cat.id}`}
                      className="group flex items-center gap-2 text-sm font-black text-slate-900 hover:text-indigo-600 transition-all"
                    >
                      Browse All{" "}
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>

                  {/* Modern Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {matchedCourses.map((course: any) => (
                      <Link
                        href={`/courses/${course.id}`}
                        key={course.id}
                        className="group bg-white rounded-[32px] border border-slate-100 hover:border-transparent hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden"
                      >
                        {/* Thumbnail Container */}
                        <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-4 py-1.5 bg-white/95 backdrop-blur rounded-xl text-[10px] font-black text-slate-900 uppercase shadow-sm">
                              {cat.name}
                            </span>
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="p-7 space-y-5">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase">
                              <BookOpen size={12} />{" "}
                              {course.lessons?.length || 0} Lessons
                            </span>
                          </div>

                          <h3 className="text-xl font-black text-slate-900 leading-snug min-h-[56px] line-clamp-2">
                            {course.title}
                          </h3>

                          {/* Instructor & Pricing */}
                          <div className="pt-5 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white uppercase shadow-md shadow-indigo-100">
                                {course.instructor?.firstName[0]}
                              </div>
                              <span className="text-xs font-bold text-slate-700">
                                {course.instructor?.firstName}{" "}
                                {course.instructor?.lastName}
                              </span>
                            </div>
                            <div className="text-xl font-black text-indigo-600">
                              ${course.price}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
