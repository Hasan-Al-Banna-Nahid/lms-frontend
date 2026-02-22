"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/app/lib/axios";
import { useRouter } from "next/navigation";

interface EnrollButtonProps {
  courseId: string;
  isAlreadyEnrolled: boolean;
}

export const EnrollButton = ({
  courseId,
  isAlreadyEnrolled,
}: EnrollButtonProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    // Immediate check to prevent double clicking
    if (isAlreadyEnrolled) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post("/enroll", { courseId });

      if (response.data.success) {
        toast.success("Welcome to the course!");
        router.refresh(); // Triggers server-side data re-fetch
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleEnroll}
      disabled={loading || isAlreadyEnrolled}
      className={`w-full h-14 text-lg font-bold rounded-2xl transition-all duration-300 shadow-lg ${
        isAlreadyEnrolled
          ? "bg-emerald-50 text-emerald-600 border-2 border-emerald-100 cursor-default shadow-none"
          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 active:scale-95"
      }`}
    >
      {loading ? (
        <Loader2 className="animate-spin h-6 w-6" />
      ) : isAlreadyEnrolled ? (
        <span className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" /> Access Granted
        </span>
      ) : (
        <span className="flex items-center gap-2">
          Enroll Now <ArrowRight className="h-5 w-5" />
        </span>
      )}
    </Button>
  );
};
