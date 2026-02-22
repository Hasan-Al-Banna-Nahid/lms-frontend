import Image from "next/image";
import {
  PlayCircle,
  Lock,
  User,
  BookOpen,
  Tag,
  BadgeCheck,
  Clock,
  Globe,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { EnrollButton } from "@/app/components/course/enroll-button";

/**
 * Utility to extract YouTube ID
 */
const getYouTubeId = (url: string) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/course/${id}`,
    { cache: "no-store" },
  );

  const result = await response.json();
  const course = result?.data;

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h1 className="text-3xl font-black text-slate-800">
          Course Not Found!
        </h1>
      </div>
    );
  }

  const previewLesson = course.lessons?.find((l: any) => l.isPreview);
  const videoId = previewLesson ? getYouTubeId(previewLesson.videoUrl) : null;

  // Instructor Full Name
  const instructorName = `${course.instructor?.firstName} ${course.instructor?.lastName}`;

  // Category Name (API তে category object থাকলে সেটি দেখাবে, না থাকলে 'General' দেখাবে)
  const categoryName = course.category?.name || "Web Development";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Video Player Section */}
            <div className="bg-black rounded-[32px] overflow-hidden shadow-2xl aspect-video relative group border-4 border-white">
              {videoId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="relative w-full h-full">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover opacity-60"
                  />
                </div>
              )}
            </div>

            {/* Course Information Card */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold uppercase tracking-wider">
                  <Tag className="h-3.5 w-3.5" />
                  {categoryName}
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold uppercase tracking-wider">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {course.status}
                </span>
              </div>

              <h1 className="text-4xl font-black text-slate-900 leading-tight">
                {course.title}
              </h1>

              <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-medium pt-2">
                <div className="flex items-center gap-2 text-indigo-600">
                  <User className="h-4 w-4" />
                  <span>By {instructorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <span>Last updated Feb 2026</span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-lg border-t pt-6">
                {course.description}
              </p>

              {/* Instructor Detail Box */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 mt-8">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
                  About Instructor
                </p>
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">
                    {course.instructor?.firstName?.[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-xl">
                      {instructorName}
                    </h4>
                    <p className="text-sm text-slate-500">
                      {course.instructor?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/50 sticky top-28">
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-black text-slate-900">
                    ${course.price}
                  </span>
                  <span className="text-lg text-slate-400 line-through font-medium">
                    $99.99
                  </span>
                </div>
              </div>

              <EnrollButton
                courseId={course.id}
                isAlreadyEnrolled={course.isEnrolled || false}
              />

              <div className="mt-10">
                <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  Course Content
                </h3>

                <div className="space-y-3">
                  {course.lessons?.map((lesson: any) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        {lesson.isPreview ? (
                          <PlayCircle className="h-5 w-5 text-indigo-600 fill-indigo-50" />
                        ) : (
                          <Lock className="h-5 w-5 text-slate-300 group-hover:text-slate-400" />
                        )}
                        <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600">
                          {lesson.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Full Lifetime Access</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Verified Instructor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
