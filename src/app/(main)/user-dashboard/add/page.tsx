"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddApartmentRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user-dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#4c55a4] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
