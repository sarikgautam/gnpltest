"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@gnpl.com"); // prefill if you want
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    if (data.user) {
      router.push("/admin"); // after login, go to admin home
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-black via-slate-900 to-black">
      <div className="w-full max-w-md bg-black/60 border border-white/15 rounded-2xl p-8 shadow-xl backdrop-blur-xl">
        <h1 className="text-2xl font-bold text-center text-green-400 mb-6">
          GNPL Admin Login
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/40 border-white/20 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black/40 border-white/20 text-white"
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-400">{errorMsg}</p>
          )}

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-400 text-black hover:bg-green-300 mt-2"
          >
            {loading ? "Logging in…" : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
