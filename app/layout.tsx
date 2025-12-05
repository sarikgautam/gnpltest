import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import { ThemeProvider } from "next-themes";


export const metadata = {
  title: "GNPL - Gold Coast Nepalese Premier League",
  description: "Official website of Gold Coast Nepalese Premier League",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <ThemeProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
