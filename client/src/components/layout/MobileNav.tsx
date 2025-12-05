import { Link, useLocation } from "wouter";
import { Home, Film, Tv, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMessenger } from "@/context/MessengerContext";

export function MobileNav() {
  const [location] = useLocation();
  const { toggleSidebar, isSidebarOpen } = useMessenger();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Film, label: "Reels", href: "/reels" },
    { icon: Tv, label: "Watch", href: "/watch" },
    { icon: MessageSquare, label: "Messenger", href: "#", isAction: true, action: toggleSidebar, active: isSidebarOpen },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 pb-safe">
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active !== undefined ? item.active : location === item.href;
          
          if (item.isAction) {
             return (
                <button 
                  key={item.label}
                  onClick={(e) => {
                    e.preventDefault();
                    item.action && item.action();
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
             )
          }

          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}