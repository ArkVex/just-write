"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PenLine, History, Settings, Menu, LogIn, UserPlus, CircleUserRound } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";
import { useAuth } from "@/components/providers/supabase-auth-provider";

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const routes = [
    {
      href: "/",
      label: "Write",
      icon: PenLine,
    },
    {
      href: "/history",
      label: "History",
      icon: History,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-2xl font-bold text-primary">
              JustWrite
            </Link>
            <div className="hidden md:flex md:space-x-2">
              {routes.map((route) => {
                const Icon = route.icon;
                const isActive = pathname === route.href;
                return (
                  <Button
                    key={route.href}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "relative h-10 px-4 py-2 transition-all duration-300",
                      isActive && "animated-gradient text-white"
                    )}
                    // Desktop: no onClick, so we can wrap Link with asChild
                    asChild
                  >
                    <Link href={route.href} className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{route.label}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {user ? (
              // No onClick here, so asChild + Link is fine
              <Button variant="outline" size="sm" className="border-primary/50 hover:border-primary" asChild>
                <Link href="/dashboard" className="flex items-center space-x-2">
                  <CircleUserRound className="h-5 w-5 text-primary" />
                  <span className="hidden sm:inline">{user.email?.split('@')[0]}</span>
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/signup" className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link href="/login" className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Link>
                </Button>
              </>
            )}
            <ModeToggle />
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {/* Mobile menu: remove Link and asChild, just use onClick + router */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {routes.map((route) => {
              const Icon = route.icon;
              const isActive = pathname === route.href;
              return (
                <Button
                  key={route.href}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push(route.href);
                  }}
                  className={cn(
                    "w-full justify-start h-10 px-4 py-2 transition-all duration-300",
                    isActive && "animated-gradient text-white"
                  )}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{route.label}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}