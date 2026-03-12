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
  getProfiles,
  getPartners,
  getTestimonials,
  getFAQs,
} from "@/lib/supabase/queries";

export default async function Home() {
  const [stats, events, profiles, partners, testimonials, faqs] =
    await Promise.all([
      getStats(),
      getEvents(),
      getProfiles(),
      getPartners(),
      getTestimonials(),
      getFAQs(),
    ]);

  return (
    <>
      <HeroSection />
      <div className="relative z-10 bg-background">
        <WhoWeAreSection />
        <hr className="border-white/20 w-full mx-auto my-0" />
        <MissionSection />
        <hr className="border-white/20 w-full mx-auto my-0" />
        <StatsSection stats={stats} />
        <hr className="border-white/20 w-full mx-auto my-0" />
        <EventsSection events={events} />
        <hr className="border-white/20 w-full mx-auto my-0" />
        <MembersSpotlight profiles={profiles} />
        <hr className="border-white/20 w-full mx-auto my-0" />
        <PartnersSection partners={partners} />
        <hr className="border-white/20 w-full mx-auto my-0" />
        <WallOfLove testimonials={testimonials} />
        <hr className="border-white/20 w-full mx-auto my-0" />
        <FAQSection faqs={faqs} />
      </div>
    </>
  );
}
