import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/app/types/course";
import { User } from "lucide-react";

/**
 * Updated CourseCard with correct data mapping
 * Uses course.id for dynamic routing and handles category name
 */
export const CourseCard = ({ course }: { course: Course }) => {
  return (
    <Link href={`/courses/${course.id}`} className="group">
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
            {/* Displaying Category Name dynamically */}
            <Badge className="bg-white/90 backdrop-blur-md text-indigo-600 hover:bg-white border-none shadow-sm">
              {course.category?.name || "Web Development"}
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-3">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {course.title}
          </h3>

          {/* Instructor Info */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <span className="font-medium">
              {course.instructor.firstName} {course.instructor.lastName}
            </span>
          </div>

          {/* Price & Action Section */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                Course Price
              </span>
              <span className="text-xl font-black text-slate-900">
                ${course.price}
              </span>
            </div>
            <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider group-hover:bg-indigo-600 group-hover:text-white transition-all">
              Enroll Now
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
