import HeroSection from "@/components/hero/HeroSection";
import TeamsSection from "@/components/teams/TeamsSection";
import UpcomingFixtures from "@/components/fixtures/UpcomingFixtures";
import LatestResults from "@/components/results/LatestResults";
import SponsorsSection from "@/components/sponsors/SponsorsSection";
import GallerySection from "@/components/gallery/GallerySection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <div className="section-divider"></div>
      <TeamsSection />
      <div className="section-divider"></div>
      <LatestResults />
      <div className="section-divider"></div>
      <UpcomingFixtures />
      <div className="section-divider"></div>
      <GallerySection />
      <div className="section-divider"></div>
      <SponsorsSection />
      <div className="section-divider"></div>

      {/* More sections later */}
    </>
  );
}
