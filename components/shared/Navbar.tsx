"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [seasonOpen, setSeasonOpen] = useState(false);
  const [fixturesOpen, setFixturesOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LEFT: LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/gnpl.jpg" 
            alt="GNPL Logo"
            className="w-12 h-12 rounded-full object-cover border border-gray-700"
          />
          <span className="text-white text-lg font-bold tracking-wide">
            GNPL
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">

          <Link href="/" className="text-gray-300 hover:text-cyan-400 transition">
            Home
          </Link>

          <Link href="/teams" className="text-gray-300 hover:text-cyan-400 transition">
            Teams
          </Link>

          {/* SEASON DROPDOWN */}
          <div 
            className="relative cursor-pointer"
            onMouseEnter={() => setSeasonOpen(true)}
            onMouseLeave={() => setSeasonOpen(false)}
          >
            <div className="flex items-center gap-1 text-gray-300 hover:text-cyan-400 transition">
              Season <ChevronDown className="w-4 h-4" />
            </div>

            {seasonOpen && (
              <div className="absolute top-8 left-0 bg-black border border-white/10 rounded-md w-40 p-2 shadow-xl">
                <Link href="/" className="block px-3 py-2 text-gray-300 hover:bg-white/10 rounded">
                  Season 2
                </Link>
                <Link href="/season1" className="block px-3 py-2 text-gray-300 hover:bg-white/10 rounded">
                  Season 1
                </Link>
              </div>
            )}
          </div>

          {/* FIXTURES DROPDOWN */}
          <div 
            className="relative cursor-pointer"
            onMouseEnter={() => setFixturesOpen(true)}
            onMouseLeave={() => setFixturesOpen(false)}
          >
            <div className="flex items-center gap-1 text-gray-300 hover:text-cyan-400 transition">
              Fixtures <ChevronDown className="w-4 h-4" />
            </div>

            {fixturesOpen && (
              <div className="absolute top-8 left-0 bg-black border border-white/10 rounded-md w-40 p-2 shadow-xl">
                <Link href="/fixtures" className="block px-3 py-2 text-gray-300 hover:bg-white/10 rounded">
                  Fixtures
                </Link>
                <Link href="/results" className="block px-3 py-2 text-gray-300 hover:bg-white/10 rounded">
                  Results
                </Link>
                <Link href="/standings" className="block px-3 py-2 text-gray-300 hover:bg-white/10 rounded">
                  Standings
                </Link>
              </div>
            )}
          </div>

          <Link href="/gallery" className="text-gray-300 hover:text-cyan-400 transition">
            Gallery
          </Link>

          <Link href="/sponsors" className="text-gray-300 hover:text-cyan-400 transition">
            Sponsors
          </Link>

          <Link href="/admin" className="text-gray-300 hover:text-cyan-400 transition">
            Admin
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/10 px-4 py-4 space-y-4">

          <Link href="/" className="block text-gray-300 hover:text-cyan-400">
            Home
          </Link>

          <Link href="/teams" className="block text-gray-300 hover:text-cyan-400">
            Teams
          </Link>

          <details className="text-gray-300">
            <summary className="flex items-center justify-between cursor-pointer">
              Season <ChevronDown size={16} />
            </summary>
            <div className="ml-4 mt-2 space-y-2">
              <Link href="/" className="block hover:text-cyan-400">Season 2</Link>
              <Link href="/season1" className="block hover:text-cyan-400">Season 1</Link>
            </div>
          </details>

          <details className="text-gray-300">
            <summary className="flex items-center justify-between cursor-pointer">
              Fixtures <ChevronDown size={16} />
            </summary>
            <div className="ml-4 mt-2 space-y-2">
              <Link href="/fixtures" className="block hover:text-cyan-400">Fixtures</Link>
              <Link href="/results" className="block hover:text-cyan-400">Results</Link>
              <Link href="/standings" className="block hover:text-cyan-400">Standings</Link>
            </div>
          </details>

          <Link href="/gallery" className="block text-gray-300 hover:text-cyan-400">
            Gallery
          </Link>

          <Link href="/sponsors" className="block text-gray-300 hover:text-cyan-400">
            Sponsors
          </Link>

          <Link href="/admin" className="block text-gray-300 hover:text-cyan-400">
            Admin
          </Link>
        </div>
      )}
    </nav>
  );
}
