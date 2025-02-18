"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { date: "Mon", productivity: 65 },
  { date: "Tue", productivity: 75 },
  { date: "Wed", productivity: 85 },
  { date: "Thu", productivity: 70 },
  { date: "Fri", productivity: 90 },
  { date: "Sat", productivity: 80 },
  { date: "Sun", productivity: 85 },
];

const mockEntries = [
  {
    id: 1,
    date: "2024-03-20",
    content: "Went for a morning run, had a productive work day...",
    feedback: "Great exercise routine! Consider adding more breaks during work.",
  },
  {
    id: 2,
    date: "2024-03-19",
    content: "Worked from home, attended virtual meetings...",
    feedback: "Good work-life balance. Try to include more physical activity.",
  },
];

export default function History() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Your Journey
        </h1>
        <p className="text-muted-foreground">Track your progress and insights over time</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="gradient-border overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl">Weekly Productivity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData}>
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="productivity"
                    stroke="url(#gradient)"
                    strokeWidth={3}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="50%" stopColor="hsl(var(--secondary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
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
            <CardTitle className="text-2xl">Past Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockEntries.map((entry) => (
                <div key={entry.id} className="border-b border-border/50 pb-4 last:border-0">
                  <p className="text-sm text-accent mb-2 font-medium">
                    {entry.date}
                  </p>
                  <p className="mb-2 leading-relaxed">{entry.content}</p>
                  <p className="text-sm text-secondary font-medium">{entry.feedback}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}