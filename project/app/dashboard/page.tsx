"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from "@/components/providers/supabase-auth-provider";
import { Entry } from "@/lib/supabase/types";

export default function Dashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchEntries() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('entries')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setEntries(data || []);
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, [user, supabase]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Entries</h1>
          <p className="text-muted-foreground">
            {loading ? "Loading entries..." : `${entries.length} entries found`}
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button className="bg-gradient-to-r from-primary to-secondary">
            <Plus className="mr-2 h-5 w-5" />
            New Entry
          </Button>
        </Link>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : entries.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          No entries yet. Start writing!
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <Card 
              key={entry.id} 
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <p className="text-muted-foreground text-sm">
                {new Date(entry.created_at).toLocaleString()}
              </p>
              <h3 className="text-lg font-semibold mt-2">
                {entry.content.slice(0, 50)}...
              </h3>
              <p className="line-clamp-3 text-muted-foreground mt-2">
                {entry.content}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
