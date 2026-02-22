"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/app/lib/validations/auth";
import { AuthWrapper } from "@/app/components/auth/auth-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Professional Register Page
 * Simplified to: First Name, Last Name, Email, and Password
 */
export default function RegisterPage() {
  const [type, setType] = React.useState("password");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });
  const handleShowPassword = () => {
    setType((prevType) => (prevType === "password" ? "text" : "password"));
  };
  const onSubmit = async (data: RegisterInput) => {
    try {
      toast.loading("Creating your account...");
      // API call simulation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Registered Data:", data);
      toast.dismiss();
      toast.success("Registration successful!");
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <AuthWrapper
      title="Create Account"
      description="Enter your information to get started"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-4">
          {/* First Name & Last Name Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  {...register("firstName")}
                  className="pl-10 h-12 rounded-xl border-slate-200"
                  placeholder="First Name"
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-[10px] ml-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  {...register("lastName")}
                  className="pl-10 h-12 rounded-xl border-slate-200"
                  placeholder="Last Name"
                />
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-[10px] ml-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                {...register("email")}
                className="pl-10 h-12 rounded-xl border-slate-200"
                placeholder="Email address"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                {...register("password")}
                type="password"
                className="pl-10 h-12 rounded-xl border-slate-200"
                placeholder="Password"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs ml-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleShowPassword}
            className="text-sm text-indigo-600 hover:underline transition-all"
          >
            Show Password
          </button>
        </div>

        <Button
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-lg shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            "Register Now"
          )}
        </Button>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-600 font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthWrapper>
  );
}
