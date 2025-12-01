import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { name: "Dashboard", href: "/admin" },
    { name: "Season Settings", href: "/admin/settings" },
    { name: "Teams", href: "/admin/teams" },
    { name: "Players", href: "/admin/players" },
    { name: "Fixtures", href: "/admin/fixtures" },
    { name: "Results", href: "/admin/results" },
    { name: "Sponsors", href: "/admin/sponsors" },
    { name: "Gallery", href: "/admin/gallery" },
    { name: "Navbar Settings", href: "/admin/settings/navbar" },
    { name: "Footer Settings", href: "/admin/settings/footer" },
  ];

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <aside className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 p-5 overflow-y-auto hidden md:block">
        <h2 className="text-2xl font-bold mb-8">GNPL Admin</h2>

        <nav className="flex flex-col space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 rounded hover:bg-gray-700 transition text-sm"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 p-6">{children}</main>
    </div>
  );
}
