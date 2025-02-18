"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Settings, LogOut } from "lucide-react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen grid grid-cols-[280px,1fr]">
      <aside className="border-r bg-muted/10 p-6 space-y-6">
        <div className="flex items-center gap-2 px-2">
          <h1 className="text-2xl font-bold">JustWrite</h1>
        </div>
        
        <nav className="space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start">
              <BookOpen className="mr-2 h-5 w-5" />
              Entries
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </Link>
        </nav>
        
        <div className="flex-1" />
        
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </aside>
      
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
