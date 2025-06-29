"use client";

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Loader2, HeartPulse, LayoutDashboard, Stethoscope, LogOut } from 'lucide-react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
          <p>Redirecting to login...</p>
      </div>
    );
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/analyze', label: 'Symptom Analysis', icon: Stethoscope },
  ];

  return (
    <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex min-h-screen">
            <Sidebar>
                <SidebarHeader className='p-4'>
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <HeartPulse className="h-8 w-8 text-secondary" />
                        <span className="font-bold text-xl text-sidebar-foreground">MediTrack</span>
                    </Link>
                </SidebarHeader>

                <SidebarMenu className='flex-1 p-4'>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={{children: item.label}}
                      >
                         <Link href={item.href}>
                            <item.icon className="inline-block h-5 w-5 mr-2" />
                            <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                         </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
                
                <SidebarFooter className='p-4'>
                    <Button variant="ghost" onClick={logout} className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <LogOut className="mr-2 h-5 w-5" />
                        <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                    </Button>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <Header />
                <main className="flex-grow p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </SidebarInset>
        </div>
    </SidebarProvider>
  );
}
