import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/app/types/course";
import { User, Tag } from "lucide-react";

export const CourseCard = ({ course }: { course: Course }) => {
  return (
    <Link href={`/courses/${course.slug}`}>
      <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Thumbnail Container */}
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3">
            <Badge className="bg-white/90 backdrop-blur-md text-indigo-600 hover:bg-white">
              {course.category.name}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {course.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <User className="h-4 w-4" />
            <span>
              {course.instructor.firstName} {course.instructor.lastName}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            <span className="text-xl font-black text-slate-900">
              ${course.price}
            </span>
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">
              Enroll Now
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
