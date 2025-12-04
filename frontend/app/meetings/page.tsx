"use client";

import { useState, useEffect } from "react";
import { MeetingsDataTable, type Meeting } from "@/components/tables/meetings-data-table";
import { createClient } from "@/lib/supabase/client";

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        setError(null);
        const supabase = createClient();

        const { data, error } = await supabase
          .from("document_metadata")
          .select("*")
          .not("type", "ilike", "policy")
          .not("type", "ilike", "document")
          .order("date", { ascending: false });

        if (error) throw error;

        setMeetings(data ?? []);
      } catch (err) {
        console.error("Error fetching meetings:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch meetings");
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading meetings</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return <MeetingsDataTable meetings={meetings} />;
}
