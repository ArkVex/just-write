"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Sparkles, Pencil } from "lucide-react";
import Link from "next/link";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from "@/components/providers/supabase-auth-provider";
import { AIAnalysisDialog } from "@/components/ai-analysis-dialog";
import { useRouter } from 'next/navigation';

export default function Home() {
  const supabase = createClientComponentClient();
  const { user } = useAuth();
  const router = useRouter();
  const [entry, setEntry] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Add ref for scroll container
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to continue");
      router.push('/login');
      return;
    }

    if (!entry.trim()) {
      toast.error("Please write something before submitting");
      return;
    }

    setLoading(true);
    try {
      // Send to Gemini API first
      console.log('📝 Sending entry to analyze...');
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: entry.trim()
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const {
        success,
        analysis,
        score,
        accomplishments,
        improvements,
        tips,
        error
      } = await response.json();

      if (!success) {
        throw new Error(error || 'Failed to get analysis');
      }

      // Handle Supabase save if user is logged in
      if (user) {
        console.log('Saving entry with feedback for user:', user.id);

        const { data, error } = await supabase
          .from('entries')
          .insert({
            content: entry.trim(),
            user_id: user.id,
            productivity_score: score,
            key_accomplishments: accomplishments,
            areas_for_improvement: improvements,
            actionable_tips: tips
          })
          .select()
          .single();

        if (error) {
          console.error('Database error:', error);
          throw error;
        }

        console.log('Entry saved with feedback:', data);
      }

      console.log('✅ Analysis received:', analysis);
      setFeedback(analysis);
      setEntry("");
      setShowAnalysis(true); // Show dialog after successful analysis
      toast.success("Entry analyzed successfully!");

      // Scroll to top smoothly after successful submission
      containerRef.current?.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    } catch (error: any) {
      console.error('❌ Error:', error);
      toast.error(error.message || "Failed to analyze entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 relative">
      <div className="noise opacity-20 fixed inset-0" />

      {/* Fixed background elements */}
      <div className="fixed w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] top-0 -left-20 bg-primary/20 blur-3xl opacity-20" />
      <div className="fixed w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bottom-0 -right-20 bg-secondary/20 blur-3xl opacity-20" />

      {/* Scrollable content container */}
      <div
        ref={containerRef}
        className="relative z-10 h-screen overflow-y-auto px-4 pt-16 pb-8"
      >
        <div className="max-w-xl mx-auto space-y-6">
          {/* Title section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-6"
          >
            <h1 className=" text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              JustWrite
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Transform your daily reflections into meaningful insights
            </p>
          </motion.div>

          {/* Input card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border border-primary/10 shadow-lg shadow-primary/5 overflow-hidden backdrop-blur-xl">
              <div className="p-3 sm:p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Pencil className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold">How was your day?</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">Share your thoughts freely</p>
                  </div>
                </div>

                <Textarea
                  placeholder="Today I..."
                  className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base bg-background/50 rounded-lg border border-primary/10 focus:border-primary/30 transition-all p-2 sm:p-3 resize-none"
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      handleSubmit();
                    }
                  }}
                />

                <Button
                  type="button"
                  className="w-full h-10 sm:h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity rounded-lg text-white font-medium text-sm sm:text-base"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    "Analyzing..."
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Get AI Insights
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>

          <AIAnalysisDialog
            open={showAnalysis}
            onOpenChange={setShowAnalysis}
            analysis={feedback}
          />
        </div>
      </div>

      {/* Fixed login button */}
      <div className="fixed top-4 right-4 z-20">
        <Button 
          variant="ghost" 
          className="hover:bg-primary/10"
          onClick={() => {
            if (!user && router.pathname !== '/login') {
              toast.error("Please sign in to access the dashboard");
              router.push('/login');
              return;
            }
            router.push('/dashboard');
          }}
        >
          {user ? 'Dashboard' : 'Login'}
        </Button>
      </div>
    </div>
  );
}