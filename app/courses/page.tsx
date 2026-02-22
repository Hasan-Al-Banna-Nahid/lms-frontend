import axiosInstance from "@/app/lib/axios";
import { CourseCard } from "@/app/components/shared/course-card";
import { Course } from "@/app/types/course";

export default async function CoursesPage() {
  // Fetching data server-side
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course`, {
    cache: "no-store",
  });
  const result = await response.json();
  const courses: Course[] = result.data;

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900">
            Explore Our Courses
          </h1>
          <p className="text-slate-500 mt-2">
            Learn from the industry experts with production-ready content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
