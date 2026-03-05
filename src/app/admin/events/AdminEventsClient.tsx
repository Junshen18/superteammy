"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, MoreVertical, Pencil, Archive, Calendar, MapPin, RefreshCw, ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Event } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AdminEventsClientProps {
  initialEvents: Event[];
}

export function AdminEventsClient({ initialEvents }: AdminEventsClientProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [archiveConfirm, setArchiveConfirm] = useState<{ id: string; title: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [toastExiting, setToastExiting] = useState(false);
  const [unsyncedCount, setUnsyncedCount] = useState<number | null>(null);

  async function fetchSyncStatus() {
    try {
      const res = await fetch("/api/luma-sync-status");
      if (!res.ok) return;
      const data = await res.json();
      setUnsyncedCount(data.unsyncedCount ?? 0);
    } catch {
      setUnsyncedCount(null);
    }
  }

  useEffect(() => {
    fetchSyncStatus();
  }, []);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!toast) return;
    setToastExiting(false);
    toastTimeoutRef.current = setTimeout(() => {
      setToastExiting(true);
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
        setToastExiting(false);
        toastTimeoutRef.current = null;
      }, 300);
    }, 4000);
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [toast]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    luma_url: "",
    image_url: "",
    is_upcoming: true,
  });

  function openCreate() {
    setEditingEvent(null);
    setFormData({ title: "", description: "", date: "", location: "", luma_url: "", image_url: "", is_upcoming: true });
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
      image_url: event.image_url || "",
      is_upcoming: event.is_upcoming,
    });
    setIsModalOpen(true);
  }

  async function handleSyncFromLuma() {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/sync-luma-events", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sync failed");
      const { data: fresh } = await supabase.from("events").select("*").order("date", { ascending: false });
      if (fresh) setEvents(fresh as Event[]);
      setToast({ message: `Added ${data.added} events from Luma`, type: "success" });
      await fetchSyncStatus();
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : "Sync failed", type: "error" });
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const { error } = await supabase.storage.from("event-covers").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("event-covers").getPublicUrl(path);
      setFormData((prev) => ({ ...prev, image_url: urlData.publicUrl }));
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : "Upload failed", type: "error" });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave() {
    if (editingEvent) {
      const { error } = await supabase
        .from("events")
        .update(formData)
        .eq("id", editingEvent.id);

      if (!error) {
        setEvents(events.map((e) => (e.id === editingEvent.id ? { ...e, ...formData } : e)));
      }
    } else {
      const { data, error } = await supabase
        .from("events")
        .insert({
          ...formData,
          image_url: formData.image_url || "",
        })
        .select()
        .single();

      if (!error && data) {
        setEvents([...events, data as Event]);
      }
    }
    setIsModalOpen(false);
  }

  function openArchiveConfirm(event: Event) {
    setArchiveConfirm({ id: event.id, title: event.title });
  }

  async function handleArchiveConfirm() {
    if (!archiveConfirm) return;
    const { error } = await supabase.from("events").update({ is_archived: true }).eq("id", archiveConfirm.id);
    if (!error) {
      setEvents(events.filter((e) => e.id !== archiveConfirm.id));
    }
    setArchiveConfirm(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage events and meetups. Sync from Luma (ICS), then upload cover images.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="outline"
              onClick={handleSyncFromLuma}
              disabled={isSyncing || unsyncedCount === 0}
              className="cursor-pointer"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isSyncing && "animate-spin")} /> {isSyncing ? "Syncing…" : "Sync from Luma"}
            </Button>
            {unsyncedCount != null && unsyncedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-medium text-white">
                {unsyncedCount > 99 ? "99+" : unsyncedCount}
              </span>
            )}
          </div>
          <Button onClick={openCreate} className="cursor-pointer">
            <Plus className="w-4 h-4 mr-2" /> Add Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4">
        {events.map((event) => (
          <Card key={event.id} className="flex flex-row items-start gap-4 p-4 overflow-hidden min-w-0 w-full max-w-full">
            {/* 1. Cover image */}
            <div className="size-24 shrink-0 rounded-lg bg-muted overflow-hidden">
              {event.image_url ? (
                <img src={event.image_url} alt="" className="w-full h-full object-cover object-center block" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-6 h-6 text-muted-foreground" /></div>
              )}
            </div>
            {/* 2. Event title, desc, date location */}
            <div className="flex-1 min-w-0 overflow-hidden min-h-0 py-1">
                <div className="flex items-center gap-2 mb-2 min-w-0 overflow-hidden">
                  <h3 className="text-base font-semibold truncate min-w-0 max-w-full" title={event.title}>
                    {event.title.length > 80 ? `${event.title.slice(0, 65)}...` : event.title}
                  </h3>
                  <span className={cn("shrink-0 px-2 py-0.5 rounded-full text-xs font-medium h-6 flex items-center justify-center", event.is_upcoming ? "bg-green-500/10 text-green-500" : "bg-muted text-white")}>
                    {event.is_upcoming ? "Upcoming" : "Past"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{event.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground min-w-0 overflow-hidden">
                  <span className="flex items-center gap-1 shrink-0"><Calendar className="w-3 h-3" />{new Date(event.date).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
                  <span className="flex items-center gap-1 min-w-0 max-w-[500px] flex-1 overflow-hidden" title={event.location}>
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="min-w-0 max-w-full truncate">{event.location}</span>
                  </span>
                </div>
              </div>
            {/* 3. Action */}
            <div className="shrink-0 ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0 cursor-pointer">
                    <MoreVertical className="w-4 h-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#0D0E08] border-white/10 text-white/60 [&_svg]:text-white/60">
                  <DropdownMenuItem onClick={() => openEdit(event)} className="cursor-pointer text-white/60 focus:bg-[#1a1b16] focus:text-white/60 [&_svg]:text-white/60"><Pencil className="w-4 h-4" /> Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openArchiveConfirm(event)} className="cursor-pointer text-white/60 focus:bg-[#1a1b16] focus:text-white/60 [&_svg]:text-amber-500"><Archive className="w-4 h-4" /> Archive</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#0D0E08] border-border/50 text-foreground [&_input]:bg-[#1a1b16] [&_input]:border-border/50 [&_textarea]:bg-[#1a1b16] [&_textarea]:border-border/50 [&_button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>{editingEvent ? "Edit Event" : "Add Event"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Event title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="cursor-text" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="flex min-h-[80px] w-full rounded-md border border-input bg-[#1a1b16] px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-text" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="datetime-local" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="cursor-pointer" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="cursor-text" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Luma URL</Label>
              <Input type="url" placeholder="https://lu.ma/..." value={formData.luma_url} onChange={(e) => setFormData({ ...formData, luma_url: e.target.value })} className="cursor-text" />
            </div>
            <div className="space-y-2">
              <Label>Cover image</Label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-lg bg-[#1a1b16] overflow-hidden shrink-0">
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-8 h-8 text-muted-foreground" /></div>
                  )}
                </div>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="cursor-pointer bg-[#0D0E08] border-border/50 hover:bg-[#1a1b16] hover:text-white">
                  {isUploading ? "Uploading…" : "Upload image"}
                </Button>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={formData.is_upcoming} onChange={(e) => setFormData({ ...formData, is_upcoming: e.target.checked })} className="rounded border-input cursor-pointer" /> Upcoming event
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="cursor-pointer bg-[#0D0E08] border-border/50 hover:bg-[#1a1b16] hover:text-white">Cancel</Button>
            <Button onClick={handleSave} className="cursor-pointer">{editingEvent ? "Save" : "Add Event"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive confirmation modal */}
      <Dialog open={!!archiveConfirm} onOpenChange={(open) => !open && setArchiveConfirm(null)}>
        <DialogContent className="max-w-md bg-[#0D0E08] border-white/10 text-foreground">
          <DialogHeader className="overflow-hidden min-w-0">
            <DialogTitle className="truncate" title={archiveConfirm?.title}>Archive {archiveConfirm?.title}?</DialogTitle>
            <p className="text-sm text-muted-foreground">It will be hidden from the landing page and won&apos;t be re-fetched on sync.</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveConfirm(null)} className="cursor-pointer bg-[#0D0E08] border-border/50 hover:bg-[#1a1b16] hover:text-white">Cancel</Button>
            <Button onClick={handleArchiveConfirm} className="cursor-pointer">Archive</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating toast - top center, auto-dismiss with fade out */}
      {toast && (
        <div
          className={cn(
            "fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-lg border border-white/10 bg-[#0D0E08] px-4 py-3 shadow-lg transition-all duration-300",
            toastExiting ? "-translate-y-4 opacity-0" : "translate-y-0 opacity-100"
          )}
        >
          <p className={cn("text-sm font-medium", toast.type === "error" ? "text-destructive" : "text-foreground")}>
            {toast.message}
          </p>
        </div>
      )}
    </div>
  );
}
