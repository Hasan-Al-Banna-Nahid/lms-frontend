import ProgressBar from "@/app/components/ProgressBar";
import { Suspense } from "react";

export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <Suspense fallback={null}>
      <ProgressBar />;
    </Suspense>
  );
}
