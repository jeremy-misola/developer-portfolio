"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Briefcase,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Shield,
  Settings,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminLayout = ({ children }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { isAuthenticated, isLoading } = useAdminAuth();

  const pathname = usePathname();

  // Redirect to login if not authenticated and not already on login page
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Testimonials', href: '/admin/testimonials', icon: Users },
    { name: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { name: 'Experience', href: '/admin/experience', icon: Briefcase },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setIsSidebarOpen(!isMobileView);
    };

    // Only run this effect after component has mounted (client-side)
    if (typeof window !== 'undefined') {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      setHasMounted(true);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of the admin panel.",
        });
        router.push('/admin/login');
      } else {
        toast({
          title: "Logout failed",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b backdrop-blur-md">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Admin Panel</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {hasMounted && (theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              ))}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AnimatePresence>
          {(hasMounted && (isSidebarOpen || !isMobile)) && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-full w-64 bg-card border-r z-40 lg:static lg:translate-x-0 lg:z-auto lg:border-r lg:shadow-none lg:flex lg:flex-col shadow-lg flex-shrink-0"
            >
              <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="p-6 border-b">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-8 w-8 text-primary" />
                    <div>
                      <h1 className="font-bold text-xl">Admin Panel</h1>
                      <p className="text-xs text-muted-foreground">Content Management</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4">
                  <div className="space-y-1 px-3">
                    {navigation.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href;
                      // Note: router.pathname might not be available or formatted same way in next-intl router
                      // but we can use simple conditional or comparison if needed.
                      return (
                        <Button
                          key={item.name}
                          variant={isActive ? "default" : "ghost"}
                          className={`w-full justify-start space-x-3 ${isActive ? 'bg-primary/10 hover:bg-primary/20' : ''}`}
                          onClick={() => router.push(item.href)}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-auto">{item.badge}</Badge>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleTheme}
                      className="rounded-full"
                    >
                      {hasMounted && (theme === 'dark' ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      ))}
                    </Button>
                  </div>

                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overlay for mobile */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isMobile && isSidebarOpen ? 'opacity-50' : ''}`}>
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;