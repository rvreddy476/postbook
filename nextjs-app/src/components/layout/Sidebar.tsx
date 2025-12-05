"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, Tv, MessageSquare, Bell, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMessenger } from "@/context/MessengerContext";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Sidebar() {
  const pathname = usePathname();
  const { toggleSidebar, isSidebarOpen } = useMessenger();
  const { user, logout } = useAuth();

  const navItems = [
    { icon: Film, label: "Reels", href: "/reels" },
    { icon: Tv, label: "Watch", href: "/watch" },
    { icon: MessageSquare, label: "Messenger", href: "#", isAction: true, action: toggleSidebar, active: isSidebarOpen },
    { icon: Bell, label: "Notifications", href: "/notifications" },
  ];

  const userInitials = user 
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() 
    : "U";

  const displayName = user 
    ? `${user.firstName} ${user.lastName}` 
    : "User";

  return (
    <aside className="hidden md:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 border-r border-border bg-card px-4 py-6 z-40">
      <Link href="/profile" className="flex items-center gap-3 p-3 mb-6 rounded-xl hover:bg-muted transition-all cursor-pointer group border border-transparent hover:border-border/50" data-testid="link-profile">
        <Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:border-primary transition-colors">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{userInitials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
            <span className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors" data-testid="text-username">{displayName}</span>
            <span className="text-xs text-muted-foreground">View Profile</span>
        </div>
      </Link>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active !== undefined ? item.active : pathname === item.href;
          
          if (item.isAction) {
             return (
               <button 
                key={item.label}
                onClick={(e) => {
                  e.preventDefault();
                  item.action && item.action();
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium cursor-pointer",
                  isActive 
                    ? "bg-primary/10 text-primary font-semibold" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                data-testid={`button-${item.label.toLowerCase()}`}
               >
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {item.label}
               </button>
             )
          }

          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
              isActive 
                ? "bg-primary/10 text-primary font-semibold" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )} data-testid={`link-${item.label.toLowerCase()}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-border space-y-2">
        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all font-medium" data-testid="link-settings">
            <Settings size={24} />
            Settings
        </Link>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 px-4 py-6 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
          data-testid="button-logout"
        >
          <LogOut size={24} />
          Logout
        </Button>
      </div>
    </aside>
  );
}
