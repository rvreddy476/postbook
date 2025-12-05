"use client";

import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Watch() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppLayout>
      <div className="py-8">
        <h1 className="text-3xl font-bold font-heading mb-6">Watch</h1>
        <div className="text-center py-12 text-muted-foreground">
          <p>Discover videos and live streams here.</p>
          <p className="mt-2 text-sm">Coming soon...</p>
        </div>
      </div>
    </AppLayout>
  );
}
