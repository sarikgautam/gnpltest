"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

// ---------- TYPES ----------
interface Season {
  id: string;
  name: string;
  start_date: string;
  hero_bg: string | null;
  active: boolean;
}

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  started: boolean;
}

// ---------- COUNTDOWN HELPER ----------
function computeCountdown(targetDate: string): CountdownState {
  const start = new Date(targetDate).getTime();
  const now = Date.now();

  if (now >= start) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true };
  }

  let diff = start - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * 86400000;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 3600000;

  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * 60000;

  const seconds = Math.floor(diff / 1000);

  return { days, hours, minutes, seconds, started: false };
}

// ---------- COMPONENT ----------
export default function HeroSection() {
  const [season, setSeason] = useState<Season | null>(null);
  const [countdown, setCountdown] = useState<CountdownState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch active season
  const fetchSeason = async () => {
    const { data, error } = await supabase
      .from("seasons")
      .select("*")
      .eq("active", true)
      .single();

    if (!error && data) {
      const s = data as Season;
      setSeason(s);
      setCountdown(computeCountdown(s.start_date));
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSeason();
  }, []);

  useEffect(() => {
    if (!season?.start_date) return;

    const interval = setInterval(() => {
      setCountdown(computeCountdown(season.start_date));
    }, 1000);

    return () => clearInterval(interval);
  }, [season?.start_date]);

  // Background fallback
  const bg = season?.hero_bg || "/hero.jpg";

  // ---------- Loading Skeleton ----------
  if (loading || !countdown) {
    return (
      <section className="relative min-h-[70vh] bg-black flex items-center justify-center">
        <div className="animate-pulse text-center space-y-4">
          <div className="h-10 w-56 bg-white/10 mx-auto rounded" />
          <div className="h-8 w-40 bg-white/10 mx-auto rounded" />
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/70 to-black/80" />

      {/* Glow lights */}
      <motion.div
        className="absolute -top-20 -left-20 h-72 w-72 bg-green-500/20 blur-3xl rounded-full"
        animate={{ x: [0, 25, -15, 0], y: [0, 15, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute -bottom-20 -right-20 h-80 w-80 bg-emerald-400/20 blur-3xl rounded-full"
        animate={{ x: [0, -20, 15, 0], y: [0, -15, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-block px-4 py-1 bg-white/10 border border-white/20 backdrop-blur-sm text-xs text-green-300 tracking-[0.25em] uppercase mb-4 rounded-full">
            GNPL — Gold Coast Nepalese Premier League
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-xl">
            GNPL <span className="text-green-400">Season&nbsp;2</span>
          </h1>

          <p className="mt-4 text-gray-200 text-base md:text-lg">
            The biggest Nepalese cricket league on the Gold Coast — the battle for glory begins.
          </p>

          {/* COUNTDOWN OR LIVE */}
          {!countdown.started ? (
            <div className="mt-8">

                            <p className="text-sm uppercase tracking-[0.25em] text-gray-300 mb-3">
                Season starts in
              </p>

              <div className="flex justify-center gap-4">
                {[
                  { label: "Days", value: countdown.days },
                  { label: "Hours", value: countdown.hours },
                  { label: "Minutes", value: countdown.minutes },
                  { label: "Seconds", value: countdown.seconds },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    className="flex flex-col items-center justify-center w-20 h-20 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-[0_0_20px_rgba(0,255,150,0.3)]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="text-2xl font-bold text-green-400">
                      {String(item.value).padStart(2, "0")}
                    </span>
                    <span className="text-xs uppercase tracking-wide text-gray-300">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-8 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-green-500/20 border border-green-400/60 backdrop-blur-md">
              <span className="h-2 w-2 bg-green-300 rounded-full animate-ping"></span>
              <span className="text-green-300 font-semibold">Season is LIVE!</span>
            </div>
          )}

          {/* CTA BUTTON */}
          <div className="mt-10">
            <Button
              asChild
              className="px-8 py-4 text-lg font-semibold bg-green-400 text-black hover:bg-green-300 shadow-[0_0_20px_rgba(0,255,150,0.6)] rounded-full"
            >
              <a href="/fixtures">View Fixtures</a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

