"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Users,
  CalendarDays,
  Trophy,
  Image,
  Building2,
  ClipboardList,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function AdminDashboard() {
  const [stats, setStats] = useState({
    teams: 0,
    fixtures: 0,
    results: 0,
    sponsors: 0,
    gallery: 0,
  });

  const fetchStats = async () => {
    const tables = ["teams", "fixtures", "results", "sponsors", "gallery"];
    const resultsData: any = {};

    for (let table of tables) {
      const { count } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });
      resultsData[table] = count || 0;
    }

    setStats({
      teams: resultsData["teams"],
      fixtures: resultsData["fixtures"],
      results: resultsData["results"],
      sponsors: resultsData["sponsors"],
      gallery: resultsData["gallery"],
    });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const menu = [
    {
      title: "Teams",
      href: "/admin/teams",
      icon: <Users className="h-8 w-8 text-green-400" />,
      count: stats.teams,
    },
    {
      title: "Fixtures",
      href: "/admin/fixtures",
      icon: <CalendarDays className="h-8 w-8 text-green-400" />,
      count: stats.fixtures,
    },
    {
      title: "Results",
      href: "/admin/results",
      icon: <Trophy className="h-8 w-8 text-green-400" />,
      count: stats.results,
    },
    {
      title: "Gallery",
      href: "/admin/gallery",
      icon: <Image className="h-8 w-8 text-green-400" />,
      count: stats.gallery,
    },
    {
      title: "Sponsors",
      href: "/admin/sponsors",
      icon: <Building2 className="h-8 w-8 text-green-400" />,
      count: stats.sponsors,
    },
    {
      title: "Season Settings",
      href: "/admin/season",
      icon: <Settings className="h-8 w-8 text-green-400" />,
      count: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black py-10 px-6">
      <h1 className="text-4xl font-extrabold text-green-400 text-center mb-10 drop-shadow-lg">
        GNPL Admin Dashboard
      </h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu.map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className="bg-white/10 border border-white/20 backdrop-blur-xl shadow-lg hover:shadow-green-500/20 hover:scale-[1.03] transition-all cursor-pointer">
              <CardHeader className="flex items-center space-x-4">
                {item.icon}
                <CardTitle className="text-white text-xl">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="text-gray-300 text-sm">
                {item.count !== null ? (
                  <p className="text-green-300 font-semibold text-lg">
                    Total: {item.count}
                  </p>
                ) : (
                  <p className="text-gray-400">Configure season settings</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-16 max-w-4xl mx-auto text-center text-gray-400">
        <p className="text-lg">
          Welcome to the Gold Coast Nepalese Premier League admin panel.  
          Manage everything from here — teams, fixtures, results, sponsors, gallery and more.
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <AdminGuard>
      <AdminDashboard />
    </AdminGuard>
  );
}
