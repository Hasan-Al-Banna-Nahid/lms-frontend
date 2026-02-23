"use client";

import { useState } from "react";
import { PlayCircle, Lock, MonitorPlay, CheckCircle } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  isPreview: boolean;
}

export function LessonPlayer({ lessons }: { lessons: Lesson[] }) {
  // প্রথম লেসনটিকে ডিফল্ট হিসেবে সিলেক্ট করা
  const [activeVideo, setActiveVideo] = useState(lessons?.[0]?.videoUrl || "");
  const [activeLessonId, setActiveLessonId] = useState(lessons?.[0]?.id || "");

  if (!lessons || lessons.length === 0) {
    return (
      <div className="p-10 text-center bg-slate-50 rounded-[24px] border-2 border-dashed border-slate-200">
        <MonitorPlay className="mx-auto h-10 w-10 text-slate-300 mb-3" />
        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
          No lessons found in this course
        </p>
      </div>
    );
  }

  // YouTube সাধারণ লিঙ্ককে Embed লিঙ্কে কনভার্ট করার ফাংশন
  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes("youtube.com/watch?v=")) {
        const videoId = url.split("v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
      return url;
    } catch (error) {
      return url;
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* --- Main Video Player (Left/Top) --- */}
      <div className="xl:col-span-8">
        <div className="relative aspect-video rounded-[32px] overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-slate-200">
          {activeVideo ? (
            <iframe
              className="w-full h-full"
              src={getEmbedUrl(activeVideo)}
              title="Course Lesson"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full flex-col gap-4">
              <div className="p-4 bg-slate-800 rounded-full animate-pulse">
                <PlayCircle size={40} className="text-indigo-400" />
              </div>
              <p className="text-slate-400 font-bold">
                Please select a lesson to start
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h4 className="text-lg font-black text-slate-900">
            Now Playing: {lessons.find((l) => l.id === activeLessonId)?.title}
          </h4>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase">
              HD 1080p
            </span>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase">
              Online
            </span>
          </div>
        </div>
      </div>

      {/* --- Playlist / Lesson Sidebar (Right/Bottom) --- */}
      <div className="xl:col-span-4">
        <div className="bg-slate-50 rounded-[32px] p-4 border border-slate-100 max-h-[500px] overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-4 px-2">
            <h5 className="font-black text-slate-400 text-[10px] uppercase tracking-widest">
              Course Content ({lessons.length} Lessons)
            </h5>
          </div>

          <div className="space-y-3">
            {lessons.map((lesson, index) => {
              const isActive = activeLessonId === lesson.id;
              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setActiveVideo(lesson.videoUrl);
                    setActiveLessonId(lesson.id);
                  }}
                  className={`w-full group p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 text-left ${
                    isActive
                      ? "bg-white text-indigo-600 shadow-xl shadow-indigo-100 ring-1 ring-indigo-100"
                      : "bg-transparent text-slate-500 hover:bg-white hover:shadow-md"
                  }`}
                >
                  <div
                    className={`h-10 w-10 flex-shrink-0 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-slate-400 border border-slate-200"
                    }`}
                  >
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </div>

                  <div className="flex-grow">
                    <p
                      className={`text-sm font-bold line-clamp-1 ${isActive ? "text-slate-900" : "text-slate-500"}`}
                    >
                      {lesson.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {lesson.isPreview ? (
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">
                          Preview Access
                        </span>
                      ) : (
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                          Premium Lesson
                        </span>
                      )}
                    </div>
                  </div>

                  {isActive ? (
                    <div className="flex items-center justify-center">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
                      </span>
                    </div>
                  ) : (
                    <PlayCircle
                      className="text-slate-200 group-hover:text-indigo-400 transition-colors"
                      size={18}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
