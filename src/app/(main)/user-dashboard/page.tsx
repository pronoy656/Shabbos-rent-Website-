"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UserDashboardRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/user-dashboard/manage");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border-3 border-[#4c55a4] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
