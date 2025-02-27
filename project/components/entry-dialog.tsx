"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Entry } from "@/lib/supabase/types";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

interface EntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: Entry | null;
  isEditing?: boolean;
  onUpdate?: (entry: Entry) => void;
}

export function EntryDialog({ 
  open, 
  onOpenChange, 
  entry, 
  isEditing = false,
  onUpdate 
}: EntryDialogProps) {
  const [editedContent, setEditedContent] = useState(entry?.content || "");

  useEffect(() => {
    if (entry) {
      setEditedContent(entry.content);
    }
  }, [entry]);

  const handleSave = () => {
    if (!entry || !onUpdate) return;
    
    onUpdate({
      ...entry,
      content: editedContent
    });
  };

  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            {isEditing ? "Edit Entry" : "Journal Entry"}
          </DialogTitle>
          <p className="text-muted-foreground">
            {new Date(entry.created_at).toLocaleString()}
          </p>
        </DialogHeader>

        <ScrollArea className="h-full pr-4">
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[200px]"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Entry Content */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Entry</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{entry.content}</p>
              </div>

              {/* Productivity Score */}
              {entry.productivity_score && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Productivity Score</h3>
                  <p className="text-2xl font-bold text-primary">
                    {entry.productivity_score}/100
                  </p>
                </div>
              )}

              {/* Key Accomplishments */}
              {entry.key_accomplishments?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Accomplishments</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {entry.key_accomplishments.map((item, i) => (
                      <li key={i} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Areas for Improvement */}
              {entry.areas_for_improvement?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Areas for Improvement</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {entry.areas_for_improvement.map((item, i) => (
                      <li key={i} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actionable Tips */}
              {entry.actionable_tips?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Actionable Tips</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {entry.actionable_tips.map((item, i) => (
                      <li key={i} className="text-muted-foreground">{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
