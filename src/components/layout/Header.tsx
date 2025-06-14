
"use client";

import Link from 'next/link';
import { HeartPulse, LogIn, LogOut, LayoutDashboard, Activity, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header() {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/analyze', label: 'Symptom Checker', icon: Activity },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresAuth: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <HeartPulse className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">HealthFlow AI</span>
        </Link>

        {/* Navigation Menu - Centered */}
        <nav className="mx-auto flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => {
            if (item.requiresAuth && !isAuthenticated && !isLoading) return null;
            if (item.requiresAuth && isLoading && !isAuthenticated) return null; 

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-foreground/60"
                )}
              >
                <item.icon className="inline-block h-4 w-4 mr-1 mb-0.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center justify-end space-x-4">
          {!isLoading && (
            isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Button>
            ) : (
               pathname !== '/login' && ( // Hide login button on login page
                <Button asChild variant="default" size="sm">
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </Link>
                </Button>
              )
            )
          )}
        </div>
      </div>
    </header>
  );
}
