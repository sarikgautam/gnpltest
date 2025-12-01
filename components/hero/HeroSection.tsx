"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getCountdown } from "@/lib/countdown";
import { Button } from "@/components/ui/button";

type CountdownState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  started: boolean;
};

export default function HeroSection() {
  const [season, setSeason] = useState<any>(null);
  const [countdown, setCountdown] = useState<CountdownState | null>(null);
  const [loading, setLoading] = useState(true);

  // Get active season
  const fetchSeason = async () => {
    const { data } = await supabase
      .from("seasons")
      .select("*")
      .eq("active", true)
      .single();

    if (data) {
      setSeason(data);
      setCountdown(getCountdown(data.start_date));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSeason();
  }, []);

  // Update countdown every second
  useEffect(() => {
    if (!season?.start_date) return;
    const interval = setInterval(() => {
      setCountdown(getCountdown(season.start_date));
    }, 1000);
    return () => clearInterval(interval);
  }, [season?.start_date]);

  const bgImage = "/hero.jpg";

  if (loading) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center bg-black text-gray-300">
        Loading…
      </section>
    );
  }

  return (
    <section
      className="relative min-h-[85vh] flex items-center justify-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* STADIUM SPOTLIGHTS */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />

      {/* VIGNETTE EDGES */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none rounded-xl shadow-inner" />

      {/* LEFT SPOTLIGHT */}
      <div className="absolute top-0 left-0 w-[40%] h-[70%] bg-green-400/10 blur-3xl opacity-40" />

      {/* RIGHT SPOTLIGHT */}
      <div className="absolute top-0 right-0 w-[40%] h-[70%] bg-green-500/10 blur-3xl opacity-40" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-4xl px-6 text-center">

        {/* TAG */}
        <div className="inline-block mb-4 px-5 py-1 rounded-full bg-green-500/20 border border-green-400/40 text-green-200 text-xs uppercase tracking-widest shadow-md">
          Gold Coast Nepalese Premier League
        </div>

        {/* TITLE */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
          GNPL <span className="text-green-400">Season 2</span>
        </h1>

        {/* SUBTITLE */}
        <p className="mt-4 text-gray-200 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          High energy. Big hits. Fierce rivalries.  
          Welcome to the Gold Coast’s Nepalese premier cricket tournament.
        </p>

        {/* COUNTDOWN */}
        {!countdown?.started ? (
          <div className="mt-10">
            <p className="text-gray-300 text-xs uppercase tracking-widest mb-3">
              Season starts in
            </p>

            {/* Countdown Boxes */}
            <div className="flex justify-center gap-4">
              {[
                { label: "Days", value: countdown.days },
                { label: "Hours", value: countdown.hours },
                { label: "Minutes", value: countdown.minutes },
                { label: "Seconds", value: countdown.seconds },
              ].map((item) => (
                <div
                  key={item.label}
                  className="
                    w-16 md:w-20 h-16 md:h-20
                    bg-black/30 border border-green-400/40 backdrop-blur-md 
                    rounded-xl flex flex-col items-center justify-center 
                    shadow-[0_0_15px_rgba(0,255,120,0.15)]
                  "
                >
                  <span className="text-green-300 text-xl md:text-2xl font-bold">
                    {item.value.toString().padStart(2, "0")}
                  </span>
                  <span className="text-gray-300 text-[10px] uppercase mt-1">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 px-5 py-2 rounded-full bg-green-500/30 border border-green-400/40 text-green-200 font-semibold shadow-md">
            Season is Live!
          </div>
        )}

        {/* BUTTON */}
        <div className="mt-10">
          <Button
            asChild
            className="
              px-8 py-5 text-base md:text-lg font-semibold 
              bg-green-400 hover:bg-green-300 
              text-black rounded-full shadow-lg
            "
          >
            <a href="/fixtures">View Fixtures</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
