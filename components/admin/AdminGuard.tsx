"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

interface Props {
  children: ReactNode;
}

export default function AdminGuard({ children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/admin/login");
        setAllowed(false);
      } else {
        setAllowed(true);
      }

      setChecking(false);
    };

    checkUser();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-gray-300">
        Checking admin access…
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}
