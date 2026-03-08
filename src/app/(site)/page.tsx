import { HeroSection } from "@/components/landing/HeroSection";
import { WhoWeAreSection } from "@/components/landing/WhoWeAreSection";
import { MissionSection } from "@/components/landing/MissionSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { EventsSection } from "@/components/landing/EventsSection";
import { MembersSpotlight } from "@/components/landing/MembersSpotlight";
import { PartnersSection } from "@/components/landing/PartnersSection";
import { WallOfLove } from "@/components/landing/WallOfLove";
import { FAQSection } from "@/components/landing/FAQSection";
import {
  getStats,
  getEvents,
  getFeaturedProfiles,
  getPartners,
  getTestimonials,
  getFAQs,
} from "@/lib/supabase/queries";

export default async function Home() {
  const [stats, events, profiles, partners, testimonials, faqs] =
    await Promise.all([
      getStats(),
      getEvents(),
      getFeaturedProfiles(),
      getPartners(),
      getTestimonials(),
      getFAQs(),
    ]);

  return (
    <>
      <HeroSection />
      <div className="relative z-10 bg-background">
        <WhoWeAreSection />
        <MissionSection />
        <StatsSection stats={stats} />
        <EventsSection events={events} />
        <MembersSpotlight profiles={profiles} />
        <PartnersSection partners={partners} />
        <WallOfLove testimonials={testimonials} />
        <FAQSection faqs={faqs} />
      </div>
    </>
  );
}
