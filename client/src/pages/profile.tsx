import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, Film, Image, Users, MapPin, MoreHorizontal, PlusCircle, PenSquare, ChevronDown, Settings, Plus, Phone, Mail, Globe, Link as LinkIcon, Heart, Briefcase, GraduationCap, Home, User, Search, UserCheck, MessageCircle, Info, Star, Calendar } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

import womanAvatar from "@assets/generated_images/professional_headshot_of_a_smiling_young_woman_with_glasses.png";
import landscapeImg from "@assets/generated_images/scenic_mountain_landscape_at_sunset.png";
import coffeeImg from "@assets/generated_images/modern_minimalist_coffee_shop_interior.png";
import skateImg from "@assets/generated_images/person_skateboarding_in_an_urban_park.png";
import chefImg from "@assets/generated_images/chef_plating_a_gourmet_dish.png";

export default function Profile() {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState("about");
  const [aboutSubTab, setAboutSubTab] = useState("overview");

  const displayName = authUser 
    ? `${authUser.firstName || ""} ${authUser.lastName || ""}`.trim() || authUser.username 
    : "Sarah Jenkins";

  const userInitials = authUser 
    ? `${authUser.firstName?.[0] || ""}${authUser.lastName?.[0] || ""}`.toUpperCase() 
    : "SJ";

  const user = {
    name: displayName,
    friends: "354 friends",
    avatar: authUser?.avatarUrl || womanAvatar,
    cover: landscapeImg,
    bio: authUser?.bio || "Digital Designer & Photographer 📸 | capturing moments | travel enthusiast ✈️ | based in NYC",
  };

  const posts = [
    { id: 1, image: landscapeImg, type: "image" },
    { id: 2, image: coffeeImg, type: "image" },
    { id: 3, image: skateImg, type: "video" },
    { id: 4, image: chefImg, type: "video" },
    { id: 5, image: landscapeImg, type: "image" },
    { id: 6, image: coffeeImg, type: "image" },
  ];

  const friends = [
    { id: 1, name: "Michael Chen", mutual: 12, avatar: user.avatar },
    { id: 2, name: "Jessica Lee", mutual: 5, avatar: womanAvatar },
    { id: 3, name: "David Kim", mutual: 8, avatar: user.avatar },
    { id: 4, name: "Emily Wilson", mutual: 23, avatar: womanAvatar },
    { id: 5, name: "Robert Taylor", mutual: 2, avatar: user.avatar },
    { id: 6, name: "Lisa Anderson", mutual: 15, avatar: womanAvatar },
    { id: 7, name: "James Martin", mutual: 7, avatar: user.avatar },
    { id: 8, name: "Sarah White", mutual: 4, avatar: womanAvatar },
  ];

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
      case "work_education":
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h4 className="text-lg font-bold mb-4 text-foreground/90">Work</h4>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 group cursor-pointer p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Briefcase size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-base font-semibold">Creative Studio</p>
                        <p className="text-sm text-foreground/80">Senior Designer · 2020 - Present</p>
                        <p className="text-xs text-muted-foreground">New York, NY</p>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 rounded-full"><PenSquare size={18} /></Button>
                 </div>

                 <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 px-0 gap-2 h-auto font-semibold text-base py-2 w-full justify-start -ml-2 pl-2">
                    <PlusCircle size={22} />
                    Add a workplace
                 </Button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-foreground/90">College</h4>
               <div className="space-y-4">
                 <div className="flex items-center gap-3 group cursor-pointer p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <GraduationCap size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-base font-semibold">New York University (NYU)</p>
                        <p className="text-sm text-foreground/80">Bachelor of Fine Arts · 2014 - 2018</p>
                        <p className="text-xs text-muted-foreground">Graphic Design & Photography</p>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 rounded-full"><PenSquare size={18} /></Button>
                 </div>

                 <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 px-0 gap-2 h-auto font-semibold text-base py-2 w-full justify-start -ml-2 pl-2">
                    <PlusCircle size={22} />
                    Add college
                 </Button>
               </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-foreground/90">High school</h4>
              <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 px-0 gap-2 h-auto font-semibold text-base py-2 w-full justify-start -ml-2 pl-2">
                <PlusCircle size={22} />
                Add high school
              </Button>
            </div>
          </div>
        );
      case "places_lived":
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h4 className="text-lg font-bold mb-4 text-foreground/90">Places lived</h4>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 group cursor-pointer p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <MapPin size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-base font-semibold">New York, New York</p>
                        <p className="text-sm text-muted-foreground">Current city</p>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 rounded-full"><PenSquare size={18} /></Button>
                 </div>

                 <div className="flex items-center gap-3 group cursor-pointer p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <MapPin size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-base font-semibold">San Francisco, California</p>
                        <p className="text-sm text-muted-foreground">Hometown</p>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 rounded-full"><PenSquare size={18} /></Button>
                 </div>

                 <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 px-0 gap-2 h-auto font-semibold text-base py-2 w-full justify-start -ml-2 pl-2">
                    <PlusCircle size={22} />
                    Add city
                 </Button>
              </div>
            </div>
          </div>
        );
      case "contact_basic":
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h4 className="text-lg font-bold mb-4 text-foreground/90">Contact info</h4>
              <div className="space-y-4">
                 <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 px-0 gap-2 h-auto font-semibold text-base py-2 w-full justify-start -ml-2 pl-2">
                    <PlusCircle size={22} />
                    Add a mobile phone
                 </Button>
                 
                 <div className="flex items-center justify-between group p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 flex justify-center text-muted-foreground"><Mail size={22} /></div>
                        <div>
                            <p className="text-sm font-medium">sarah.jenkins@example.com</p>
                            <p className="text-xs text-muted-foreground">Email</p>
                        </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><Settings size={16} /></Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><PenSquare size={16} /></Button>
                    </div>
                 </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-foreground/90">Websites and social links</h4>
              <div className="space-y-4">
                 <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 px-0 gap-2 h-auto font-semibold text-base py-2 w-full justify-start -ml-2 pl-2">
                    <PlusCircle size={22} />
                    Add a website
                 </Button>
                 <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 px-0 gap-2 h-auto font-semibold text-base py-2 w-full justify-start -ml-2 pl-2">
                    <PlusCircle size={22} />
                    Add social link
                 </Button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4 text-foreground/90">Basic info</h4>
              <div className="space-y-4">
                 <div className="flex items-center justify-between group p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 flex justify-center text-muted-foreground"><User size={22} /></div>
                        <div>
                            <p className="text-sm font-medium">Female</p>
                            <p className="text-xs text-muted-foreground">Gender</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100"><PenSquare size={16} /></Button>
                 </div>

                 <div className="flex items-center justify-between group p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 flex justify-center text-muted-foreground"><Users size={22} /></div>
                        <div>
                            <p className="text-sm font-medium">she/her</p>
                            <p className="text-xs text-muted-foreground">System pronouns</p>
                        </div>
                    </div>
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100"><PenSquare size={16} /></Button>
                 </div>

                 <div className="flex items-center justify-between group p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 flex justify-center text-muted-foreground"><Calendar size={22} /></div>
                        <div>
                            <p className="text-sm font-medium">July 12, 1996</p>
                            <p className="text-xs text-muted-foreground">Birth Date</p>
                        </div>
                    </div>
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100"><PenSquare size={16} /></Button>
                 </div>

                 <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 px-0 gap-2 h-auto font-semibold text-base py-2 w-full justify-start -ml-2 pl-2">
                    <PlusCircle size={22} />
                    Add a language
                 </Button>
              </div>
            </div>
          </div>
        );
      case "family_relationships":
        return (
            <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h4 className="text-lg font-bold mb-4 text-foreground/90">Relationship</h4>
              <div className="space-y-4">
                 <div className="flex items-center gap-3 group cursor-pointer p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Heart size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-base font-semibold">Single</p>
                        <p className="text-xs text-muted-foreground">Since 2022</p>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 rounded-full"><PenSquare size={18} /></Button>
                 </div>

                 <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 px-0 gap-2 h-auto font-semibold text-base py-2 w-full justify-start -ml-2 pl-2">
                    <PlusCircle size={22} />
                    Add a relationship status
                 </Button>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4 text-foreground/90">Family members</h4>
              <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 px-0 gap-2 h-auto font-semibold text-base py-2 w-full justify-start -ml-2 pl-2">
                <PlusCircle size={22} />
                Add family member
              </Button>
            </div>
          </div>
        );
      case "details":
          return (
            <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h4 className="text-lg font-bold mb-4 text-foreground/90">About you</h4>
                   <div className="p-4 bg-muted/30 rounded-xl border border-border/50 mb-4">
                       <p className="text-sm text-foreground/80 italic">"Digital Designer & Photographer 📸 | capturing moments | travel enthusiast ✈️ | based in NYC"</p>
                   </div>
                   <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 px-0 gap-2 h-auto font-semibold text-base py-2 w-full justify-start -ml-2 pl-2">
                    <PenSquare size={22} />
                    Edit details about you
                  </Button>
                </div>
                
                <div>
                    <h4 className="text-lg font-bold mb-4 text-foreground/90">Name pronunciation</h4>
                    <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 px-0 gap-2 h-auto font-semibold text-base py-2 w-full justify-start -ml-2 pl-2">
                        <PlusCircle size={22} />
                        Add name pronunciation
                    </Button>
                </div>

                <div>
                    <h4 className="text-lg font-bold mb-4 text-foreground/90">Other names</h4>
                    <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 px-0 gap-2 h-auto font-semibold text-base py-2 w-full justify-start -ml-2 pl-2">
                        <PlusCircle size={22} />
                        Add a nickname, a birth name...
                    </Button>
                </div>
                
                <div>
                    <h4 className="text-lg font-bold mb-4 text-foreground/90">Favorite quotes</h4>
                    <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 px-0 gap-2 h-auto font-semibold text-base py-2 w-full justify-start -ml-2 pl-2">
                        <PlusCircle size={22} />
                        Add your favorite quotes
                    </Button>
                </div>
            </div>
          );
      case "life_events":
          return (
            <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                    <h4 className="text-lg font-bold mb-4 text-foreground/90">Life events</h4>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 group cursor-pointer p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Briefcase size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-base font-semibold">Started New Job at Creative Studio</p>
                                <p className="text-sm text-muted-foreground">2020</p>
                            </div>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 rounded-full"><PenSquare size={18} /></Button>
                        </div>
                        
                        <div className="flex items-center gap-3 group cursor-pointer p-2 -ml-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <GraduationCap size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-base font-semibold">Graduated from NYU</p>
                                <p className="text-sm text-muted-foreground">2018</p>
                            </div>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 rounded-full"><PenSquare size={18} /></Button>
                        </div>
                        
                        <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 px-0 gap-2 h-auto font-semibold text-base py-2 w-full justify-start -ml-2 pl-2">
                            <PlusCircle size={22} />
                            Add a life event
                        </Button>
                    </div>
                </div>
            </div>
          );
      default:
        return (
            <div className="text-center py-10 text-muted-foreground">
                <p>Select a section to view details.</p>
            </div>
        );
    }
  };

  return (
    <AppLayout>
      <div className="bg-card md:rounded-b-xl shadow-sm border-b border-border/50 mb-6 overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-64 md:h-[450px] w-full bg-muted">
            <img src={user.cover} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute bottom-4 right-4">
                <Button variant="secondary" size="sm" className="bg-background/80 backdrop-blur-sm hover:bg-background text-foreground font-medium shadow-sm">
                    <Image className="w-4 h-4 mr-2" />
                    Edit cover photo
                </Button>
            </div>
        </div>

        {/* Profile Header Info */}
        <div className="px-4 pb-4 md:px-8 md:pb-8 relative">
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 md:-mt-8 gap-4 md:gap-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="h-32 w-32 md:h-44 md:w-44 rounded-full border-[4px] border-card overflow-hidden bg-background relative z-10">
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute bottom-2 right-2 z-20 bg-muted rounded-full p-1.5 border-2 border-card cursor-pointer hover:bg-muted/80">
                        <Image className="w-5 h-5 text-foreground" />
                    </div>
                </div>

                {/* Name & Friends */}
                <div className="flex-1 mb-2 md:mb-4 pt-2 md:pt-0">
                    <h1 className="text-3xl font-heading font-bold text-foreground">{user.name}</h1>
                    <p className="text-muted-foreground font-medium text-base hover:underline cursor-pointer">{user.friends}</p>
                    {/* Friend Avatars Preview could go here */}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mb-4 md:mb-6 w-full md:w-auto">
                    <Button className="bg-primary hover:bg-primary/90 text-white font-semibold gap-2 flex-1 md:flex-none">
                        <PlusCircle size={18} />
                        Add to story
                    </Button>
                    <Button variant="secondary" className="bg-muted hover:bg-muted/80 text-foreground font-semibold gap-2 flex-1 md:flex-none">
                        <PenSquare size={18} />
                        Edit profile
                    </Button>
                    <Button variant="secondary" className="bg-muted hover:bg-muted/80 text-foreground w-10 px-0">
                        <ChevronDown size={18} />
                    </Button>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-border/60 my-1" />

            {/* Profile Navigation Tabs */}
            <div className="flex items-center gap-1 md:gap-2 overflow-x-auto no-scrollbar py-1">
                {["Posts", "About", "Friends", "Photos", "Reels", "Check-ins"].map((tab, i) => {
                    const tabKey = tab.toLowerCase();
                    const isActive = activeTab === tabKey;
                    return (
                        <Button 
                            key={tab}
                            variant="ghost"
                            onClick={() => setActiveTab(tabKey)}
                            className={`font-medium text-muted-foreground hover:bg-muted hover:text-foreground h-10 rounded-lg px-4 ${isActive ? 'text-primary bg-transparent relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-primary after:rounded-t-full rounded-b-none hover:bg-transparent' : ''}`}
                        >
                            {tab}
                        </Button>
                    );
                })}
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="font-medium text-muted-foreground hover:bg-muted hover:text-foreground h-10 rounded-lg px-4 gap-1">
                            More
                            <ChevronDown size={14} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40">
                        <DropdownMenuItem>Sports</DropdownMenuItem>
                        <DropdownMenuItem>Music</DropdownMenuItem>
                        <DropdownMenuItem>Movies</DropdownMenuItem>
                        <DropdownMenuItem>TV shows</DropdownMenuItem>
                        <DropdownMenuItem>Books</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                
                <div className="flex-1" />
                
                <Button variant="ghost" size="icon" className="bg-muted/50 hover:bg-muted rounded-lg">
                    <MoreHorizontal size={20} />
                </Button>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-4 px-0 md:px-4 pb-8 max-w-3xl mx-auto">
          {activeTab === 'posts' && (
              /* Feed Column */
              <div className="space-y-4">
                  {/* Create Post Placeholder */}
                  <div className="bg-card rounded-xl border border-border/50 p-4 shadow-sm flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted overflow-hidden shrink-0">
                          <img src={user.avatar} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 bg-muted/50 rounded-full flex items-center px-4 text-muted-foreground cursor-pointer hover:bg-muted transition-colors">
                          What's on your mind?
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                          <Button size="icon" variant="ghost" className="rounded-full bg-muted/30 hover:bg-muted text-green-500">
                              <Image size={20} />
                          </Button>
                      </div>
                  </div>

                  {/* Filter Posts */}
                  <div className="bg-card rounded-xl border border-border/50 p-4 shadow-sm flex justify-between items-center">
                      <h3 className="font-heading font-bold text-lg">Posts</h3>
                      <div className="flex gap-2">
                          <Button variant="secondary" size="sm" className="bg-muted hover:bg-muted/80">
                              <MoreHorizontal size={16} className="mr-2" />
                              Filters
                          </Button>
                          <Button variant="secondary" size="sm" className="bg-muted hover:bg-muted/80">
                              <Settings size={16} className="mr-2" />
                              Manage posts
                          </Button>
                      </div>
                  </div>

                  {/* Mock Posts Feed */}
                  {posts.map((post) => (
                      <div key={post.id} className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                          <div className="p-4 flex gap-3 items-center">
                              <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                                  <img src={user.avatar} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                  <h4 className="font-bold text-sm">{user.name}</h4>
                                  <p className="text-xs text-muted-foreground">2h · <MapPin size={10} className="inline" /></p>
                              </div>
                              <Button variant="ghost" size="icon"><MoreHorizontal size={20} /></Button>
                          </div>
                          <div className="px-4 pb-2">
                              <p>Loving this view! 😍 #travel #vibes</p>
                          </div>
                          <div className="w-full bg-muted aspect-video relative">
                              <img src={post.image} className="w-full h-full object-cover" />
                          </div>
                          <div className="p-2 border-t border-border/50 flex justify-between">
                              <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground hover:text-primary">Like</Button>
                              <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground hover:text-primary">Comment</Button>
                              <Button variant="ghost" className="flex-1 gap-2 text-muted-foreground hover:text-primary">Share</Button>
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {activeTab === 'about' && (
              <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                  <div className="grid grid-cols-12 min-h-[500px]">
                      {/* Left Sidebar for About */}
                      <div className="col-span-4 border-r border-border/50 p-2 md:p-4">
                          <h3 className="font-heading font-bold text-xl px-4 mb-3">About</h3>
                          <div className="space-y-1">
                              {aboutSections.map((section) => (
                                  <Button
                                      key={section.id}
                                      variant="ghost"
                                      onClick={() => setAboutSubTab(section.id)}
                                      className={`w-full justify-start font-medium rounded-lg h-10 px-4 ${aboutSubTab === section.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                                  >
                                      {section.label}
                                  </Button>
                              ))}
                          </div>
                      </div>
                      
                      {/* Right Content for About */}
                      <div className="col-span-8 p-6 md:p-8">
                          {renderAboutContent()}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'friends' && (
            <div className="bg-card rounded-xl border border-border/50 shadow-sm p-4">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-heading font-bold text-xl">Friends</h3>
                    <div className="flex gap-2">
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input placeholder="Search friends" className="pl-9 bg-muted/50 border-none h-9 w-64" />
                         </div>
                         <Button variant="ghost" className="text-primary h-9">Friend requests</Button>
                         <Button variant="ghost" className="text-primary h-9">Find friends</Button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {friends.map((friend) => (
                        <div key={friend.id} className="flex items-center gap-4 p-3 border border-border/50 rounded-xl hover:bg-muted/30 transition-colors">
                             <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                                <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
                             </div>
                             <div className="flex-1 min-w-0">
                                 <h4 className="font-bold text-base truncate">{friend.name}</h4>
                                 <p className="text-xs text-muted-foreground mb-2">{friend.mutual} mutual friends</p>
                                 <div className="flex gap-2">
                                     {/* Just visual buttons for now */}
                                 </div>
                             </div>
                             <Button size="icon" variant="ghost" className="text-muted-foreground"><MoreHorizontal size={20} /></Button>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {activeTab === 'photos' && (
              <div className="bg-card rounded-xl border border-border/50 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="font-heading font-bold text-xl">Photos</h3>
                      <Button variant="ghost" className="text-primary h-9">Add photos/video</Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-1 rounded-lg overflow-hidden">
                      {posts.map((post, i) => (
                          <div key={i} className="aspect-square bg-muted relative group cursor-pointer">
                              <img src={post.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button variant="secondary" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">View</Button>
                              </div>
                          </div>
                      ))}
                      {/* Repeat posts to fill grid */}
                      {posts.map((post, i) => (
                          <div key={`dup-${i}`} className="aspect-square bg-muted relative group cursor-pointer">
                              <img src={post.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          </div>
                      ))}
                  </div>
              </div>
          )}
          
          {activeTab === 'reels' && (
              <div className="bg-card rounded-xl border border-border/50 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="font-heading font-bold text-xl">Reels</h3>
                  </div>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Mock Reels */}
                      {[1, 2, 3, 4].map((item) => (
                          <div key={item} className="aspect-[9/16] bg-black rounded-lg overflow-hidden relative group cursor-pointer">
                              <img src={skateImg} className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                              <div className="absolute bottom-2 left-2 text-white font-bold flex items-center gap-1">
                                  <Film size={14} />
                                  <span className="text-sm">12.5K</span>
                              </div>
                          </div>
                      ))}
                   </div>
              </div>
          )}
      </div>
    </AppLayout>
  );
}