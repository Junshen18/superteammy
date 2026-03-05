import { HeroSection } from "@/components/landing/HeroSection";
import { WhoWeAreSection } from "@/components/landing/WhoWeAreSection";
import { MissionSection } from "@/components/landing/MissionSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { EventsSection } from "@/components/landing/EventsSection";
import { MembersSpotlight } from "@/components/landing/MembersSpotlight";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { WallOfLove } from "@/components/landing/WallOfLove";
import { FAQSection } from "@/components/landing/FAQSection";
import { JoinCTA } from "@/components/landing/JoinCTA";
import {
  getStats,
  getEvents,
  getFeaturedMembers,
  getPartners,
  getTestimonials,
  getFAQs,
} from "@/lib/supabase/queries";

export default async function Home() {
  const [stats, events, members, partners, testimonials, faqs] =
    await Promise.all([
      getStats(),
      getEvents(),
      getFeaturedMembers(),
      getPartners(),
      getTestimonials(),
      getFAQs(),
    ]);

  return (
    <>
      <HeroSection />
      <div className="relative z-10 bg-background">
        <WhoWeAreSection />
        <div
          className="relative bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/images/mission-bg.png)" }}
        >
          <MissionSection />
          <StatsSection stats={stats} />
        </div>
        <EventsSection events={events} />
        <MembersSpotlight members={members} />
        <PartnersSection partners={partners} />
        <WallOfLove testimonials={testimonials} />
        <FAQSection faqs={faqs} />
        <JoinCTA />
      </div>
    </>
  );
}
