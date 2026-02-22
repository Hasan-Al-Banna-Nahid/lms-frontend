import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckCircle, PlayCircle, Clock, Globe } from "lucide-react";

export default async function CourseDetailsPage({
  params,
}: {
  params: { slug: string };
}) {
  // Fetch specific course by slug
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/course/${params.slug}`,
  );
  const result = await response.json();
  const course = result.data;

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Header */}
      <section className="bg-slate-900 py-16 text-white">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-indigo-400 font-bold tracking-widest uppercase text-sm">
              {course.category.name}
            </span>
            <h1 className="text-4xl md:text-5xl font-black">{course.title}</h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              {course.description}
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-400" />
                <span>Last updated Feb 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-400" />
                <span>English / Bengali</span>
              </div>
            </div>
          </div>

          {/* Video/Enrollment Card */}
          <div className="bg-white rounded-3xl p-4 shadow-2xl shadow-indigo-500/10 border border-slate-100 text-slate-900">
            <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
              <Image
                src={course.thumbnail}
                alt="Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-all cursor-pointer">
                <PlayCircle className="h-16 w-16 text-white" />
              </div>
            </div>
            <div className="px-4 pb-4">
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-black">${course.price}</span>
                <span className="text-slate-400 line-through">$99.99</span>
              </div>
              <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-lg font-bold rounded-2xl mb-4">
                Enroll in Course
              </Button>
              <p className="text-center text-xs text-slate-400 font-medium">
                30-Day Money-Back Guarantee
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
