"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Calendar, MapPin, ArrowUpRight, Clock } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sampleEvents } from "@/lib/data";

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function EventsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const upcomingEvents = sampleEvents.filter((e) => e.is_upcoming);
  const pastEvents = sampleEvents.filter((e) => !e.is_upcoming);

  return (
    <section id="events" className="py-24 md:py-32 bg-[#0D0D20]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          label="Events"
          title="Join Our Upcoming Events"
          subtitle="Connect with the Malaysian Solana community at our meetups, hackathons, and workshops"
          labelColor="green"
        />

        {/* Upcoming Events */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {upcomingEvents.map((event, index) => (
            <motion.a
              key={event.id}
              href={event.luma_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group block p-6 rounded-2xl bg-surface/50 border border-white/5 hover:border-solana-green/20 transition-all duration-300 hover:bg-surface"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="px-3 py-1.5 rounded-lg bg-solana-green/10 text-solana-green text-xs font-semibold">
                  Upcoming
                </div>
                <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-solana-green transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-solana-green transition-colors">
                {event.title}
              </h3>
              <p className="text-sm text-muted mb-4 line-clamp-2">
                {event.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-dark">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-dark">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(event.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-dark">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-muted mb-6">Past Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastEvents.map((event) => (
                <a
                  key={event.id}
                  href={event.luma_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface/30 border border-white/5 hover:border-white/10 transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-muted-dark" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-solana-purple transition-colors">
                      {event.title}
                    </p>
                    <p className="text-xs text-muted-dark">
                      {formatDate(event.date)} &middot; {event.location}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* View All CTA */}
        <div className="text-center mt-12">
          <a
            href="https://lu.ma/superteammy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-solana-green border border-solana-green/20 hover:bg-solana-green/5 transition-all"
          >
            View All Events on Luma
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
