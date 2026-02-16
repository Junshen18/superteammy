import { HeroSection } from "@/components/landing/HeroSection";
import { MissionSection } from "@/components/landing/MissionSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { EventsSection } from "@/components/landing/EventsSection";
import { MembersSpotlight } from "@/components/landing/MembersSpotlight";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { WallOfLove } from "@/components/landing/WallOfLove";
import { FAQSection } from "@/components/landing/FAQSection";
import { JoinCTA } from "@/components/landing/JoinCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <MissionSection />
      <StatsSection />
      <EventsSection />
      <MembersSpotlight />
      <PartnersSection />
      <WallOfLove />
      <FAQSection />
      <JoinCTA />
    </>
  );
}
