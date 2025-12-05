import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { RightSidebar } from "./RightSidebar";
import { MessengerSidebar } from "@/components/messenger/MessengerSidebar";
import { ChatPopup } from "@/components/messenger/ChatPopup";
import { useMessenger } from "@/context/MessengerContext";
import { useLocation, Link } from "wouter";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, Film, Tv, Video, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppLayoutProps {
  children: React.ReactNode;
  showRightSidebar?: boolean;
}

export function AppLayout({ children, showRightSidebar = true }: AppLayoutProps) {
  const { activeChats, closeChat, closeSidebar, toggleSidebar, isSidebarOpen } = useMessenger();
  const [pathname] = useLocation();

  // Close messenger sidebar on route change
  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative">
      {/* Fixed Top Header */}
      <header className="w-full border-b border-primary/5 bg-white/80 backdrop-blur-2xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/feed" className="flex items-center gap-2.5 w-auto md:w-64 shrink-0 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all group-hover:scale-105" style={{background: 'linear-gradient(135deg, hsl(262 85% 58%), hsl(190 90% 50%))'}}>
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-gradient hidden md:block">PostBook</h1>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search PostBook..." 
              className="pl-10 bg-muted border-border focus-visible:ring-foreground/20 focus-visible:border-foreground/30 rounded-full hover:bg-muted/80 transition-colors"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 md:gap-2 justify-end flex-1 md:flex-none">
             {/* Messenger */}
             <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full hover:bg-primary/10 hover:text-primary ${isSidebarOpen ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
                onClick={toggleSidebar}
             >
                <MessageSquare size={22} />
             </Button>

             {/* Reels */}
             <Link href="/reels">
                <Button variant="ghost" size="icon" className={`rounded-full hover:bg-primary/10 hover:text-primary ${pathname === '/reels' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                  <Film size={22} />
                </Button>
             </Link>

             {/* TV / Watch */}
             <Link href="/watch">
                <Button variant="ghost" size="icon" className={`rounded-full hover:bg-primary/10 hover:text-primary ${pathname === '/watch' ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                  <Tv size={22} />
                </Button>
             </Link>

             {/* Go Live */}
             <Button variant="ghost" className="hidden md:flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full px-3">
                <Video size={22} />
                <span className="font-semibold text-sm">GO LIVE</span>
             </Button>
             <Button variant="ghost" size="icon" className="md:hidden text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full">
                <Video size={22} />
             </Button>

             {/* Notifications */}
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
        
        {/* Global Messenger Components */}
        <MessengerSidebar />
        
        {/* Chat Popups Container */}
        <div className="pointer-events-none z-50"> 
              {activeChats.map((user, index) => (
                <div key={user.id} className="pointer-events-auto">
                  <ChatPopup 
                    user={user} 
                    index={index}
                    onClose={() => closeChat(user.id)} 
                  />
                </div>
              ))}
        </div>

        <MobileNav />
      </div>
    </div>
  );
}