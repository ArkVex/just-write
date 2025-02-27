"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from "@/components/providers/supabase-auth-provider";
import { Entry } from "@/lib/supabase/types";
import { EntryDialog } from "@/components/entry-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const supabase = createClientComponentClient();
  const { user } = useAuth();
  const router = useRouter();

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

  const handleDelete = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      setEntries(entries.filter(entry => entry.id !== entryId));
      toast.success("Entry deleted successfully");
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error("Failed to delete entry");
    }
  };

  const handleEdit = (entry: Entry) => {
    setSelectedEntry(entry);
    setIsEditing(true);
  };

  const handleUpdate = async (updatedEntry: Entry) => {
    try {
      const { error } = await supabase
        .from('entries')
        .update({
          content: updatedEntry.content,
          // Add other fields you want to allow updating
        })
        .eq('id', updatedEntry.id);

      if (error) throw error;

      setEntries(entries.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      ));
      setIsEditing(false);
      setSelectedEntry(null);
      toast.success("Entry updated successfully");
    } catch (error) {
      console.error('Error updating entry:', error);
      toast.error("Failed to update entry");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Entries</h1>
        <p className="text-muted-foreground">
          {loading ? "Loading entries..." : `${entries.length} entries found`}
        </p>
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
              className="p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <p className="text-muted-foreground text-sm">
                  {new Date(entry.created_at).toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  {entry.productivity_score && (
                    <span className="text-sm font-medium text-primary">
                      {entry.productivity_score}/100
                    </span>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(entry)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(entry.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div 
                className="line-clamp-3 text-sm mt-2 cursor-pointer"
                onClick={() => {
                  setSelectedEntry(entry);
                  setIsEditing(false);
                }}
              >
                {entry.content}
              </div>
              {entry.key_accomplishments?.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {entry.key_accomplishments.length} accomplishments
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      <EntryDialog 
        open={!!selectedEntry} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedEntry(null);
            setIsEditing(false);
          }
        }}
        entry={selectedEntry}
        isEditing={isEditing}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
