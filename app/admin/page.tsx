"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaUsers, FaUserPlus, FaTrophy, FaCalendarAlt, FaImage, FaBaseballBall, FaStar } from "react-icons/fa";
import { MdGroups, MdEventAvailable } from "react-icons/md";

export default function AdminHome() {
  const cards = [
    {
      title: "Manage Teams",
      desc: "Add, edit, update team details & logos",
      href: "/admin/teams",
      icon: <MdGroups size={32} />,
    },
    {
      title: "Add Team",
      desc: "Create and register a new cricket team",
      href: "/admin/teams/add",
      icon: <FaUsers size={32} />,
    },
    {
      title: "Manage Players",
      desc: "Edit player profiles, stats & team assignment",
      href: "/admin/players",
      icon: <FaUserPlus size={32} />,
    },
    {
      title: "Manage Squads",
      desc: "Assign players to teams for GNPL season",
      href: "/admin/teams",
      icon: <FaBaseballBall size={32} />,
    },
    {
      title: "Add Fixture",
      desc: "Create upcoming fixtures for the tournament",
      href: "/admin/fixtures/add",
      icon: <FaCalendarAlt size={32} />,
    },
    {
      title: "Manage Fixtures",
      desc: "Edit, update, or delete created fixtures",
      href: "/admin/fixtures",
      icon: <MdEventAvailable size={32} />,
    },
    {
      title: "Add Match Result",
      desc: "Add match results & upload scorecard screenshots",
      href: "/admin/results/add",
      icon: <FaTrophy size={32} />,
    },
    {
      title: "Manage Results",
      desc: "View and edit completed match results",
      href: "/admin/results",
      icon: <FaStar size={32} />,
    },
    {
      title: "Manage Sponsors",
      desc: "Add and update GNPL sponsors & links",
      href: "/admin/sponsors",
      icon: <FaImage size={32} />,
    },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen px-6 py-12 text-white bg-gradient-to-b from-black to-[#0b0f0c]">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-green-400 text-center mb-10 drop-shadow-lg"
          >
            GNPL Admin Dashboard
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Manage everything for Gold Coast Nepalese Premier League — teams, players, fixtures, results, and sponsors from here.
          </motion.p>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {cards.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={c.href}
                  className="block p-6 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl 
                             hover:bg-white/20 transition shadow-lg hover:shadow-green-500/40
                             cursor-pointer min-h-[170px]"
                >
                  <div className="text-green-400 mb-4">{c.icon}</div>
                  <h2 className="font-bold text-lg text-white">{c.title}</h2>
                  <p className="text-gray-300 text-sm mt-1">{c.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}
