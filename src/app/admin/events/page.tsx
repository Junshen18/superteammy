"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Calendar, MapPin } from "lucide-react";
import { sampleEvents } from "@/lib/data";
import type { Event } from "@/lib/types";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>(sampleEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    luma_url: "",
    is_upcoming: true,
  });

  function openCreate() {
    setEditingEvent(null);
    setFormData({ title: "", description: "", date: "", location: "", luma_url: "", is_upcoming: true });
    setIsModalOpen(true);
  }

  function openEdit(event: Event) {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.slice(0, 16),
      location: event.location,
      luma_url: event.luma_url,
      is_upcoming: event.is_upcoming,
    });
    setIsModalOpen(true);
  }

  function handleSave() {
    if (editingEvent) {
      setEvents(events.map((e) => (e.id === editingEvent.id ? { ...e, ...formData } : e)));
    } else {
      const newEvent: Event = {
        id: String(Date.now()),
        ...formData,
        image_url: "/images/events/placeholder.jpg",
        created_at: new Date().toISOString(),
      };
      setEvents([...events, newEvent]);
    }
    setIsModalOpen(false);
  }

  function handleDelete(id: string) {
    if (confirm("Delete this event?")) {
      setEvents(events.filter((e) => e.id !== id));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold text-white">Events</h1>
          <p className="text-sm text-muted mt-1">Manage events and meetups</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-solana-purple to-solana-green hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="p-5 rounded-xl bg-surface/50 border border-white/5 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-semibold text-white truncate">{event.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${event.is_upcoming ? "bg-solana-green/10 text-solana-green" : "bg-white/5 text-muted-dark"}`}>
                  {event.is_upcoming ? "Upcoming" : "Past"}
                </span>
              </div>
              <p className="text-sm text-muted mb-3 line-clamp-1">{event.description}</p>
              <div className="flex flex-wrap gap-4 text-xs text-muted-dark">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(event.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => openEdit(event)} className="p-2 rounded-lg hover:bg-white/5 text-muted hover:text-white transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(event.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-muted hover:text-red-400 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-surface border border-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">{editingEvent ? "Edit Event" : "Add Event"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-white/5 text-muted"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="Event title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-solana-purple/30" />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-solana-purple/30 resize-none" />
              <div className="grid grid-cols-2 gap-4">
                <input type="datetime-local" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-white text-sm focus:outline-none focus:border-solana-purple/30" />
                <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-solana-purple/30" />
              </div>
              <input type="url" placeholder="Luma URL" value={formData.luma_url} onChange={(e) => setFormData({ ...formData, luma_url: e.target.value })} className="w-full px-4 py-2.5 rounded-lg bg-background border border-white/5 text-white placeholder-muted-dark text-sm focus:outline-none focus:border-solana-purple/30" />
              <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
                <input type="checkbox" checked={formData.is_upcoming} onChange={(e) => setFormData({ ...formData, is_upcoming: e.target.checked })} className="rounded border-white/20 bg-background accent-solana-purple" /> Upcoming event
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm text-muted hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
                <button onClick={handleSave} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-solana-purple to-solana-green hover:opacity-90 transition-opacity">{editingEvent ? "Save" : "Add Event"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
