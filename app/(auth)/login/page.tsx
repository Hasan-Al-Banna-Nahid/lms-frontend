"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Mail, Lock, Loader2 } from "lucide-react";

import { loginSchema, LoginInput } from "@/app/lib/validations/auth";
import { AuthWrapper } from "@/app/components/auth/auth-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/app/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const [type, setType] = React.useState("password");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  const handleShowPassword = () => {
    setType((prevType) => (prevType === "password" ? "text" : "password"));
  };
  /**
   * Professional Login Handler
   * Manually sets the access_token in cookies after a successful API response
   */
  const onSubmit = async (data: LoginInput) => {
    const loadingToast = toast.loading("Authenticating your credentials...");

    try {
      const response = await axiosInstance.post("/login", data);

      // Extracting token from backend response body
      const { token } = response.data;

      if (token) {
        // Manually setting the token in cookies for the Axios Interceptor
        Cookies.set("access_token", token, {
          expires: 7, // Token valid for 7 days
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        toast.success("Login successful! Welcome back.", { id: loadingToast });

        // Redirecting to the home page or dashboard after successful login
        router.push("/");
        router.refresh(); // Refresh to update server components with new auth state
      } else {
        throw new Error("Token not found in response");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Invalid email or password";
      toast.error(errorMessage, { id: loadingToast });
      console.error("Login Error:", error);
    }
  };

  return (
    <AuthWrapper
      title="Welcome Back"
      description="Please enter your details to login"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                {...register("email")}
                type="email"
                className="pl-10 h-12 rounded-xl"
                placeholder="name@company.com"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <Input
                {...register("password")}
                type={type}
                className="pl-10 h-12 rounded-xl"
                placeholder="••••••••"
              />
            </div>
            <button
              type="button"
              onClick={handleShowPassword}
              className="text-sm text-indigo-600 hover:underline transition-all"
            >
              Show Password
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-lg transition-all active:scale-[0.98]"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : (
            "Sign In"
          )}
        </Button>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              prefetch={false}
              className="text-indigo-600 font-bold hover:underline transition-all"
            >
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </AuthWrapper>
  );
}
