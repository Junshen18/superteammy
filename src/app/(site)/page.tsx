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
  getCommunityTweets,
  getFAQs,
} from "@/lib/supabase/queries";

export default async function Home() {
  const results = await Promise.allSettled([
    getStats(),
    getEvents(),
    getProfiles(),
    getPartners(),
    getCommunityTweets(),
    getFAQs(),
  ]);

  const stats = results[0].status === "fulfilled" ? results[0].value : [];
  const events = results[1].status === "fulfilled" ? results[1].value : [];
  const profiles = results[2].status === "fulfilled" ? results[2].value : [];
  const partners = results[3].status === "fulfilled" ? results[3].value : [];
  const communityTweets = results[4].status === "fulfilled" ? results[4].value : [];
  const faqs = results[5].status === "fulfilled" ? results[5].value : [];

  return (
    <>
      <HeroSection />
      <div className="relative z-10 bg-background">
        <hr className="border-white/20 w-full mx-auto my-0" />
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
        <WallOfLove communityTweets={communityTweets} />
        <hr className="border-white/20 w-full mx-auto my-0" />
        <FAQSection faqs={faqs} />
        <hr className="border-white/20 w-full mx-auto my-0" />

      </div>
    </>
  );
}
