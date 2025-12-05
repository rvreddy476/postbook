"use client";

import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { RightSidebar } from "./RightSidebar";
import { useMessenger } from "@/context/MessengerContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, Film, Tv, Video, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
  showRightSidebar?: boolean;
}

export function AppLayout({ children, showRightSidebar = true }: AppLayoutProps) {
  const { closeSidebar, toggleSidebar, isSidebarOpen } = useMessenger();
  const pathname = usePathname();

  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative">
      <header className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/feed" className="flex items-center gap-2 w-auto md:w-64 shrink-0 cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">P</span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-primary hidden md:block">PostBook</h1>
          </Link>

          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search PostBook..." 
              className="pl-10 bg-muted/50 border-none focus-visible:ring-primary/20 rounded-full"
            />
          </div>

          <div className="flex items-center gap-1 md:gap-2 justify-end flex-1 md:flex-none">
             <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full hover:bg-primary/10 hover:text-primary ${isSidebarOpen ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
                onClick={toggleSidebar}
             >
                <MessageSquare size={22} />
             </Button>

             <Link href="/reels">
                <Button variant="ghost" size="icon" className={`rounded-full hover:bg-primary/10 hover:text-primary ${pathname === '/reels' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                  <Film size={22} />
                </Button>
             </Link>

             <Link href="/watch">
                <Button variant="ghost" size="icon" className={`rounded-full hover:bg-primary/10 hover:text-primary ${pathname === '/watch' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                  <Tv size={22} />
                </Button>
             </Link>

             <Button variant="ghost" className="hidden md:flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full px-3">
                <Video size={22} />
                <span className="font-semibold text-sm">GO LIVE</span>
             </Button>
             <Button variant="ghost" size="icon" className="md:hidden text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full">
                <Video size={22} />
             </Button>

             <Link href="/notifications">
                <Button variant="ghost" size="icon" className={`rounded-full hover:bg-primary/10 hover:text-primary ${pathname === '/notifications' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                  <Bell size={22} />
                </Button>
             </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-[1600px] mx-auto w-full">
        {pathname !== '/profile' && <Sidebar />}
        
        <main className="flex-1 min-w-0 pb-20 md:pb-0 pt-4">
          <div className={`mx-auto w-full ${pathname === '/profile' ? 'max-w-[85%]' : 'max-w-2xl'}`}>
            {children}
          </div>
        </main>

        {showRightSidebar && pathname !== '/profile' && <RightSidebar />}

        <MobileNav />
      </div>
    </div>
  );
}
