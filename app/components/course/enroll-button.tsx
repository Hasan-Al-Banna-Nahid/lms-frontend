"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "@/app/lib/axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface EnrollButtonProps {
  courseId: string;
  isAlreadyEnrolled: boolean;
}

export const EnrollButton = ({
  courseId,
  isAlreadyEnrolled,
}: EnrollButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(isAlreadyEnrolled);
  const router = useRouter();

  const handleEnroll = async () => {
    const token = Cookies.get("access_token");

    // ১. চেক ইউজার লগড ইন
    if (!token) {
      toast.error("Please login to enroll in this course");
      return router.push("/login");
    }

    setLoading(true);
    const toastId = toast.loading("Processing your enrollment...");

    try {
      const response = await axiosInstance.post("/enroll", { courseId });

      if (response.data.success) {
        toast.success("Enrolled successfully! Enjoy learning.", {
          id: toastId,
        });
        setEnrolled(true);
        router.refresh(); // রিফ্রেশ টু আপডেট স্টেট
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Enrollment failed";

      // ২. যদি আগে থেকেই এনরোল থাকে
      if (message.toLowerCase().includes("already enrolled")) {
        setEnrolled(true);
        toast.error("You are already enrolled in this course.", {
          id: toastId,
        });
      } else {
        toast.error(message, { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleEnroll}
      disabled={loading || enrolled}
      className={`w-full h-14 text-lg font-bold rounded-2xl shadow-xl transition-all active:scale-95 ${
        enrolled
          ? "bg-green-100 text-green-600 hover:bg-green-100 cursor-not-allowed border-2 border-green-200"
          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
      }`}
    >
      {loading ? (
        <Loader2 className="animate-spin h-5 w-5" />
      ) : enrolled ? (
        <span className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" /> Already Enrolled
        </span>
      ) : (
        "Enroll Now"
      )}
    </Button>
  );
};
