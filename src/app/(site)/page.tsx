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
  getSiteContent,
} from "@/lib/supabase/queries";

export default async function Home() {
  const results = await Promise.allSettled([
    getStats(),
    getEvents(),
    getProfiles(),
    getPartners(),
    getCommunityTweets(),
    getFAQs(),
    getSiteContent(),
  ]);

  const stats = results[0].status === "fulfilled" ? results[0].value : [];
  const events = results[1].status === "fulfilled" ? results[1].value : [];
  const profiles = results[2].status === "fulfilled" ? results[2].value : [];
  const partners = results[3].status === "fulfilled" ? results[3].value : [];
  const communityTweets = results[4].status === "fulfilled" ? results[4].value : [];
  const faqs = results[5].status === "fulfilled" ? results[5].value : [];
  const siteContent = results[6].status === "fulfilled" ? results[6].value : {};

  return (
    <>
      <HeroSection content={siteContent.hero} />
      <div className="relative z-10 bg-background">
        <hr className="border-white/10 w-full mx-auto my-0" />
        <WhoWeAreSection content={siteContent.who_we_are} />
        <hr className="border-white/10 w-full mx-auto my-0" />
        <MissionSection content={siteContent.mission} />
        <hr className="border-white/10 w-full mx-auto my-0" />
        <StatsSection stats={stats} content={siteContent.stats} />
        <hr className="border-white/10 w-full mx-auto my-0" />
        <EventsSection events={events} content={siteContent.events} />
        <hr className="border-white/10 w-full mx-auto my-0" />
        <MembersSpotlight profiles={profiles} content={siteContent.members_spotlight} />
        <hr className="border-white/10 w-full mx-auto my-0" />
        <PartnersSection partners={partners} content={siteContent.partners} />
        <hr className="border-white/10 w-full mx-auto my-0" />
        <WallOfLove communityTweets={communityTweets} content={siteContent.wall_of_love} />
        <hr className="border-white/10 w-full mx-auto my-0" />
        <FAQSection faqs={faqs} content={siteContent.faq_section} />
        <hr className="border-white/10 w-full mx-auto my-0 hidden md:block" />

      </div>
    </>
  );
}
