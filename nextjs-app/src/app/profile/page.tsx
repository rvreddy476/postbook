"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, Film, Image, Users, MapPin, MoreHorizontal, PlusCircle, PenSquare, Settings, Plus, Phone, Mail, Heart, Briefcase, GraduationCap, Home, User, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("about");
  const [aboutSubTab, setAboutSubTab] = useState("overview");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const displayName = authUser 
    ? `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim() || authUser.username 
    : "User";

  const userInitials = authUser 
    ? `${authUser.firstName?.[0] || ""}${authUser.lastName?.[0] || ""}`.toUpperCase() 
    : "U";

  const user = {
    name: displayName,
    friends: "354 friends",
    bio: authUser?.bio || "Digital Designer & Photographer | capturing moments | travel enthusiast | based in NYC",
  };

  const aboutSections = [
    { id: "overview", label: "Overview" },
    { id: "work_education", label: "Work and education" },
    { id: "places_lived", label: "Places lived" },
    { id: "contact_basic", label: "Contact and basic info" },
    { id: "family_relationships", label: "Family and relationships" },
    { id: "details", label: "Details about you" },
    { id: "life_events", label: "Life events" },
  ];

  const renderAboutContent = () => {
    switch (aboutSubTab) {
      case "overview":
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
             <div>
                <h4 className="text-lg font-bold mb-4 text-foreground/90">Overview</h4>
                <div className="space-y-4">
                   <div className="flex items-center gap-3 group cursor-pointer p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-8 flex justify-center text-muted-foreground"><Briefcase size={24} /></div>
                      <div className="flex-1">
                          <p className="text-sm font-medium">Senior Designer at <span className="font-bold">Creative Studio</span></p>
                          <p className="text-xs text-muted-foreground">Past: Freelance Art Director</p>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 rounded-full"><PenSquare size={18} /></Button>
                   </div>

                   <div className="flex items-center gap-3 group cursor-pointer p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-8 flex justify-center text-muted-foreground"><GraduationCap size={24} /></div>
                      <div className="flex-1">
                          <p className="text-sm font-medium">Studied Fine Arts at <span className="font-bold">NYU</span></p>
                          <p className="text-xs text-muted-foreground">Class of 2018</p>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 rounded-full"><PenSquare size={18} /></Button>
                   </div>

                   <div className="flex items-center gap-3 group cursor-pointer p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-8 flex justify-center text-muted-foreground"><Home size={24} /></div>
                      <div className="flex-1">
                          <p className="text-sm font-medium">Lives in <span className="font-bold">New York, New York</span></p>
                          <p className="text-xs text-muted-foreground">From San Francisco, California</p>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 rounded-full"><PenSquare size={18} /></Button>
                   </div>

                   <div className="flex items-center gap-3 group cursor-pointer p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-8 flex justify-center text-muted-foreground"><Heart size={24} /></div>
                      <div className="flex-1">
                          <p className="text-sm font-medium">Single</p>
                      </div>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 rounded-full"><PenSquare size={18} /></Button>
                   </div>
                </div>
             </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <p>Content for {aboutSubTab.replace("_", " ")} will appear here.</p>
          </div>
        );
    }
  };

  return (
    <AppLayout showRightSidebar={false}>
      <div className="max-w-4xl mx-auto pb-8">
        <div className="relative">
          <div className="h-[300px] rounded-b-2xl overflow-hidden bg-gradient-to-br from-primary/30 to-secondary/30">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80" 
              className="w-full h-full object-cover" 
              alt="Cover" 
            />
          </div>

          <div className="px-6 lg:px-8">
            <div className="relative -mt-20 sm:-mt-24 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
              <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-background shadow-xl cursor-pointer group">
                <AvatarFallback className="text-4xl bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center sm:text-left pb-0 sm:pb-3">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-2 sm:gap-4">
                  <h1 className="text-2xl sm:text-3xl font-bold font-heading">{user.name}</h1>
                  <span className="text-muted-foreground text-sm">{user.friends}</span>
                </div>
                <p className="text-muted-foreground mt-1 text-sm max-w-md hidden sm:block">{user.bio}</p>
              </div>

              <div className="flex gap-2 mt-2 sm:mt-0 sm:pb-3">
                <Button className="rounded-full gap-2 shadow-md font-semibold">
                  <Plus size={16} /> Add to story
                </Button>
                <Button variant="outline" className="rounded-full gap-2 font-semibold">
                  <PenSquare size={16} /> Edit profile
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full"><MoreHorizontal size={18} /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem><Settings size={16} className="mr-2" /> Settings</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t border-border">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b border-border rounded-none">
              {[
                { value: "posts", label: "Posts", icon: Grid },
                { value: "about", label: "About", icon: User },
                { value: "friends", label: "Friends", icon: Users },
                { value: "photos", label: "Photos", icon: Image },
                { value: "videos", label: "Videos", icon: Film },
              ].map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-3 font-medium transition-colors"
                >
                  <tab.icon size={18} className="mr-2" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="about" className="mt-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-64 space-y-1 bg-card rounded-xl p-3">
                  {aboutSections.map(section => (
                    <button
                      key={section.id}
                      onClick={() => setAboutSubTab(section.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${aboutSubTab === section.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground/80'}`}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
                <div className="flex-1 bg-card rounded-xl p-6">
                  {renderAboutContent()}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="posts" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <p>Your posts will appear here.</p>
              </div>
            </TabsContent>

            <TabsContent value="friends" className="mt-6">
              <div className="bg-card rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-xl">Friends</h3>
                  <div className="relative w-64">
                    <Input placeholder="Search friends..." className="rounded-full bg-muted/50 border-none pl-10" />
                  </div>
                </div>
                <div className="text-center py-12 text-muted-foreground">
                  <p>Friends list will appear here.</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="photos" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <p>Photos will appear here.</p>
              </div>
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              <div className="text-center py-12 text-muted-foreground">
                <p>Videos will appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
