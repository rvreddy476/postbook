import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, X, Users, User as UserIcon, Circle } from "lucide-react";
import { useMessenger, User } from "@/context/MessengerContext";
import { cn } from "@/lib/utils";

// Mock Data
import womanAvatar from "@assets/generated_images/professional_headshot_of_a_smiling_young_woman_with_glasses.png";
import manAvatar from "@assets/generated_images/professional_headshot_of_a_confident_man_with_a_beard.png";

const CONTACTS: User[] = [
  { id: '1', name: 'Sarah Jenkins', avatar: womanAvatar, status: 'online' },
  { id: '2', name: 'Mike Kogan', avatar: manAvatar, status: 'online' },
  { id: '3', name: 'Alex Rivera', avatar: '', status: 'offline' },
  { id: '4', name: 'Emily Chen', avatar: '', status: 'online' },
  { id: '5', name: 'David Kim', avatar: '', status: 'offline' },
  { id: '6', name: 'Lisa Wang', avatar: '', status: 'online' },
  { id: '7', name: 'James Wilson', avatar: '', status: 'offline' },
];

const GROUPS: User[] = [
  { id: 'g1', name: 'Dev Team', avatar: '', status: 'online', isGroup: true },
  { id: 'g2', name: 'Hiking Club', avatar: '', status: 'offline', isGroup: true },
  { id: 'g3', name: 'Project Alpha', avatar: '', status: 'online', isGroup: true },
];

export function MessengerSidebar() {
  const { isSidebarOpen, toggleSidebar, openChat } = useMessenger();
  const [search, setSearch] = useState("");

  if (!isSidebarOpen) return null;

  const filteredContacts = CONTACTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const filteredGroups = GROUPS.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-card border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-primary to-purple-600 text-white">
        <h2 className="font-heading font-bold text-lg flex items-center gap-2">
          Messenger
        </h2>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8 text-white hover:bg-white/20 hover:text-white">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search..." 
            className="pl-9 bg-muted/50" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <Tabs defaultValue="contacts" className="flex-1 flex flex-col min-h-0">
        <div className="px-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="contacts" className="gap-2"><UserIcon size={14} /> Contacts</TabsTrigger>
            <TabsTrigger value="groups" className="gap-2"><Users size={14} /> Groups</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="contacts" className="flex-1 flex flex-col mt-2 min-h-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="px-2 pb-4">
              <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Online</h3>
              {filteredContacts.filter(c => c.status === 'online').map(user => (
                <ContactItem key={user.id} user={user} onClick={() => openChat(user)} />
              ))}

              <h3 className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">Offline</h3>
              {filteredContacts.filter(c => c.status === 'offline').map(user => (
                <ContactItem key={user.id} user={user} onClick={() => openChat(user)} />
              ))}
              
               {/* Fake Infinite Scroll Loader */}
               <div className="space-y-1 mt-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 opacity-50 pointer-events-none">
                      <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                        <div className="h-2 w-16 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="groups" className="flex-1 flex flex-col mt-2 min-h-0 overflow-hidden">
           <ScrollArea className="h-full">
            <div className="px-2 pb-4">
              {filteredGroups.map(group => (
                 <ContactItem key={group.id} user={group} onClick={() => openChat(group)} />
              ))}
               <div className="p-4 text-center">
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Users size={14} /> Create New Group
                </Button>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContactItem({ user, onClick }: { user: User; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors text-left group"
    >
      <div className="relative">
        <Avatar className="h-10 w-10 border border-border">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        {user.status === 'online' && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full ring-1 ring-card"></span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">{user.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {user.isGroup ? `${Math.floor(Math.random() * 20) + 2} members` : (user.status === 'online' ? 'Active now' : 'Last seen recently')}
        </p>
      </div>
    </button>
  );
}