import React from "react";
import { GraduationCap } from "lucide-react";

interface AuthWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
}

/**
 * Reusable wrapper for Login and Register pages
 * Provides consistent styling and branding
 */
export const AuthWrapper = ({
  children,
  title,
  description,
}: AuthWrapperProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-[450px] space-y-8 bg-white p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
        <div className="text-center flex flex-col items-center">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="mt-2 text-slate-500 font-medium">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
};
