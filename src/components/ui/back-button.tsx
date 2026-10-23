"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      type="button"
      className="p-2 hover:bg-muted rounded-full transition-colors"
      title="Go Back"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
