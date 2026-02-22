"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { GraduationCap, Menu, LogOut, LayoutDashboard } from "lucide-react";
import { NAV_LINKS } from "@/app/constants/navigation";
import { Button } from "@/components/ui/button";

/**
 * Modern Floating Capsule Navbar with Auth Logic
 */
export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check for authentication token on mount
  useEffect(() => {
    const token = Cookies.get("access_token");
    setIsLoggedIn(!!token);
  }, []);

  /**
   * Professional Logout Handler
   */
  const handleLogout = () => {
    Cookies.remove("access_token");
    setIsLoggedIn(false);
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <header
        className="w-full max-w-6xl h-16 flex items-center justify-between px-6 
                        bg-slate-900/90 backdrop-blur-xl border border-white/10 
                        rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.2)] 
                        transition-all duration-300"
      >
        {/* Brand Logo Section */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-indigo-600 p-1.5 rounded-lg transition-transform group-hover:rotate-12">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white hidden sm:block">
              LMS<span className="text-indigo-400">Master</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-slate-300 text-sm font-semibold transition-all hover:text-white relative"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons - Conditional Rendering based on Auth State */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            // Authenticated State UI
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-white/10 rounded-full flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-full px-4 transition-all"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            // Guest State UI
            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden xs:block">
                <Button
                  variant="ghost"
                  className="text-slate-300 font-bold hover:text-white hover:bg-white/10 rounded-full"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-sm font-bold rounded-full px-6 shadow-md shadow-indigo-500/20 transition-all active:scale-95">
                  Join Now
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full text-slate-300"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>
    </div>
  );
};
