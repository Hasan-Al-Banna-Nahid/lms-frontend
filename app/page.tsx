import React from "react";
import { Navbar } from "@/app/components/shared/navbar"; // Fixed path based on standard structure
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, Star, CheckCircle2 } from "lucide-react";
import Link from "next/link";

/**
 * HomePage Component
 * Fully centered content with production-grade UI alignment
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col w-full">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center">
        {/* Hero Section */}
        <section className="relative w-full overflow-hidden bg-white pt-16 lg:pt-24 pb-12 flex flex-col items-center">
          <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center">
            {/* Wrapper to ensure internal alignment is centered */}
            <div className="flex flex-col items-center text-center space-y-8 max-w-4xl">
              {/* Badge - Centered by flex parent */}
              <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 shadow-sm animate-fade-in">
                <Star className="mr-1 h-3.5 w-3.5 fill-current" />
                <span>
                  The most trusted LMS for Engineers in{" "}
                  {new Date().getFullYear()}
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl leading-[1.1]">
                Master New Skills with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  Expert-Led Courses
                </span>
              </h1>

              {/* Sub-heading */}
              <p className="max-w-2xl text-lg text-slate-600 leading-relaxed mx-auto">
                Build your professional expertise with production-grade
                curriculum. Learn architecture, clean code, and scalable systems
                from industry veterans.
              </p>

              {/* CTAs - Flex row on desktop, column on mobile */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-xl w-full sm:w-auto"
                >
                  <Link href={"/courses"} prefetch={false}>
                    Explore Courses
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg border-slate-200 w-full sm:w-auto"
                >
                  <PlayCircle className="mr-2 h-5 w-5 text-indigo-600" /> Watch
                  Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-slate-500">
                    Industry Certificates
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-slate-500">
                    Lifetime Access
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-slate-500">
                    Expert Support
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Background Decorative Element */}
          <div className="absolute top-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </section>

        {/* Call to Action / Feature Section */}
        <section className="w-full py-20 bg-slate-50 flex justify-center">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold text-slate-800">
              Start your journey today
            </h2>
            <p className="mt-4 text-slate-600">
              Join thousands of students learning from the best.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
