"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/providers/supabase-auth-provider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Bell, ChartBar } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const { user } = useAuth();
  const router = useRouter();

  const handleExport = () => {
    toast.success("Data exported successfully!");
  };

  const handleReset = () => {
    toast.success("Data reset successfully!");
  };

  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to access settings");
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Preferences
        </h1>
        <p className="text-muted-foreground">Customize your JustWrite experience</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="gradient-border overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <span>Daily Reminders</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive gentle nudges to log your activities
                </p>
              </div>
              <Switch className="data-[state=checked]:bg-primary" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center space-x-2">
                  <ChartBar className="h-4 w-4 text-secondary" />
                  <span>Weekly Insights</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get a summary of your habits and progress
                </p>
              </div>
              <Switch className="data-[state=checked]:bg-secondary" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass-effect border-2 border-accent/20">
          <CardHeader>
            <CardTitle className="text-2xl">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full border-2 hover:border-secondary/50 hover:text-secondary transition-colors"
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Your Data
            </Button>
            <Button
              variant="destructive"
              className="w-full bg-destructive/10 hover:bg-destructive/20 text-destructive hover:text-destructive"
              onClick={handleReset}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Reset All Data
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}