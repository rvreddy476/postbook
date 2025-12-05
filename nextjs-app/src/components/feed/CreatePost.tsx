"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Image as ImageIcon, 
  Video, 
  Smile, 
  Activity, 
  BarChart2, 
  X, 
  Globe,
  Layout,
  Gift,
  MapPin,
  Type
} from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

const feelings = [
  { emoji: "🙂", label: "Happy" },
  { emoji: "🥰", label: "Loved" },
  { emoji: "😎", label: "Cool" },
  { emoji: "🤩", label: "Excited" },
  { emoji: "🤪", label: "Crazy" },
  { emoji: "😴", label: "Tired" },
];

const backgroundColors = [
  { id: 'default', bg: 'bg-white dark:bg-card text-foreground' },
  { id: 'red', bg: 'bg-gradient-to-br from-red-500 to-pink-600 text-white' },
  { id: 'blue', bg: 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white' },
  { id: 'green', bg: 'bg-gradient-to-br from-emerald-400 to-green-600 text-white' },
  { id: 'purple', bg: 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white' },
  { id: 'orange', bg: 'bg-gradient-to-br from-orange-400 to-amber-500 text-white' },
  { id: 'tea', bg: 'bg-[#C0BBB1] text-slate-900' }, 
  { id: 'chill', bg: 'bg-[#148290] text-white' },
];

interface CreatePostProps {
  onPostCreated?: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [activeTab, setActiveTab] = useState("compose");
  const [selectedColor, setSelectedColor] = useState(backgroundColors[0]);
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [selectedFeeling, setSelectedFeeling] = useState<{emoji: string, label: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userInitials = user 
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() 
    : "U";
  const displayName = user ? `${user.firstName} ${user.lastName}` : "User";

  const handlePostClick = () => {
    setIsOpen(true);
    setActiveTab("compose");
  };

  const resetPost = () => {
    setPostText("");
    setActiveTab("compose");
    setSelectedColor(backgroundColors[0]);
    setPollOptions(["", ""]);
    setSelectedFeeling(null);
    setMediaPreview(null);
    setIsOpen(false);
  };

  const handleSubmitPost = async () => {
    if (!user || (!postText && !mediaPreview)) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: user.id,
          content: postText,
          imageUrl: mediaPreview,
          backgroundColor: selectedColor.id !== 'default' ? selectedColor.id : null,
          feeling: selectedFeeling ? `${selectedFeeling.emoji} ${selectedFeeling.label}` : null,
        }),
      });

      if (response.ok) {
        resetPost();
        onPostCreated?.();
      }
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      setMediaType(file.type.startsWith('video') ? 'video' : 'image');
    }
  };

  return (
    <Card className="shadow-md border-none overflow-hidden bg-card/50 backdrop-blur-sm">
      <div className="p-4">
        <div className="flex gap-3 mb-4">
          <Avatar className="h-12 w-12 cursor-pointer ring-2 ring-primary/10 hover:ring-primary/30 transition-all">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{userInitials}</AvatarFallback>
          </Avatar>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <div 
                className="flex-1 bg-muted/40 hover:bg-muted/60 transition-all duration-300 rounded-2xl px-5 py-3 text-muted-foreground cursor-pointer text-left shadow-inner flex items-center justify-between group"
                onClick={handlePostClick}
                data-testid="button-create-post"
              >
                <span>What&apos;s on your mind, {user?.firstName || "there"}?</span>
                <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                   <ImageIcon size={18} />
                   <Smile size={18} />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden border-none shadow-2xl bg-card max-h-[85vh] h-[500px] flex flex-col">
              
              <div className="p-4 border-b flex justify-between items-center bg-muted/10">
                 <h2 className="text-lg font-bold font-heading">Create Post</h2>
                 <div className="flex items-center gap-3">
                   <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                     Drafts
                   </Button>
                   <Button 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-full font-semibold shadow-lg shadow-primary/20"
                    onClick={handleSubmitPost}
                    disabled={(!postText && !mediaPreview && !selectedFeeling) || isSubmitting}
                    data-testid="button-submit-post"
                   >
                     {isSubmitting ? "Posting..." : "Post"}
                   </Button>
                 </div>
              </div>

              <div className="flex flex-1 overflow-hidden">
                <Tabs 
                  defaultValue="compose" 
                  value={activeTab} 
                  onValueChange={setActiveTab} 
                  orientation="vertical" 
                  className="w-[200px] bg-muted/20 border-r flex flex-col"
                >
                  <TabsList className="flex flex-col h-auto bg-transparent p-2 gap-1 justify-start w-full">
                    <TabTrigger value="compose" icon={<Type size={18} />} label="Compose" />
                    <TabTrigger value="media" icon={<ImageIcon size={18} />} label="Photo/Video" />
                    <TabTrigger value="poll" icon={<BarChart2 size={18} />} label="Poll" />
                    <TabTrigger value="feeling" icon={<Smile size={18} />} label="Feeling" />
                    <TabTrigger value="checkin" icon={<MapPin size={18} />} label="Check In" />
                    <Separator className="my-2" />
                    <TabTrigger value="background" icon={<Layout size={18} />} label="Background" />
                    <TabTrigger value="gif" icon={<Gift size={18} />} label="GIF" />
                  </TabsList>
                  
                  <div className="mt-auto p-4">
                     <div className="bg-primary/5 rounded-xl p-3 text-xs text-muted-foreground text-center">
                        <p>Share with Public</p>
                     </div>
                  </div>
                </Tabs>

                <div className="flex-1 flex flex-col overflow-hidden relative bg-background">
                  <ScrollArea className="flex-1 p-6">
                     
                     <div className="flex items-center gap-3 mb-6">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">{userInitials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-sm">{displayName}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Globe size={12} /> Public
                            {selectedFeeling && (
                              <>
                                <span>•</span>
                                <span className="font-medium text-primary flex items-center gap-1">
                                  {selectedFeeling.emoji} feeling {selectedFeeling.label}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                     </div>

                     <div className={`min-h-[200px] transition-all duration-500 rounded-xl ${selectedColor.id !== 'default' ? `p-8 flex items-center justify-center text-center shadow-inner ${selectedColor.bg}` : ''}`}>
                        <Textarea 
                           value={postText}
                           onChange={(e) => setPostText(e.target.value)}
                           placeholder="What's on your mind?"
                           className={`border-none shadow-none resize-none focus-visible:ring-0 p-0 text-xl leading-relaxed bg-transparent ${selectedColor.id !== 'default' ? 'text-white text-center font-bold text-3xl placeholder:text-white/60' : 'placeholder:text-muted-foreground/40'}`}
                           data-testid="input-post-content"
                        />
                     </div>

                     {mediaPreview && (
                        <div className="mt-4 relative rounded-xl overflow-hidden border bg-black/5 group">
                           <Button 
                              size="icon" 
                              variant="secondary" 
                              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/60 text-white hover:bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                              onClick={() => setMediaPreview(null)}
                           >
                              <X size={14} />
                           </Button>
                           {mediaType === 'image' ? (
                              <img src={mediaPreview} alt="Preview" className="w-full max-h-[300px] object-contain" />
                           ) : (
                              <video src={mediaPreview} controls className="w-full max-h-[300px]" />
                           )}
                        </div>
                     )}

                     {activeTab === 'poll' && (
                        <div className="mt-6 border rounded-xl p-4 bg-muted/10 animate-in fade-in slide-in-from-bottom-4">
                           <h3 className="font-semibold mb-3 flex items-center gap-2"><BarChart2 size={18} className="text-primary"/> Poll Details</h3>
                           <div className="space-y-3">
                              {pollOptions.map((opt, i) => (
                                 <Input 
                                    key={i} 
                                    placeholder={`Option ${i + 1}`} 
                                    value={opt}
                                    onChange={(e) => {
                                       const newOpts = [...pollOptions];
                                       newOpts[i] = e.target.value;
                                       setPollOptions(newOpts);
                                    }}
                                 />
                              ))}
                              <Button variant="outline" size="sm" onClick={() => setPollOptions([...pollOptions, ""])} className="w-full border-dashed">
                                 + Add Option
                              </Button>
                           </div>
                        </div>
                     )}

                     {activeTab === 'media' && !mediaPreview && (
                        <div className="mt-6 border-2 border-dashed rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                           <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileSelect} />
                           <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                              <ImageIcon size={24} />
                           </div>
                           <p className="font-medium">Add Photos or Videos</p>
                           <p className="text-sm text-muted-foreground">or drag and drop</p>
                        </div>
                     )}

                     {activeTab === 'feeling' && (
                        <div className="mt-6 grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-bottom-4">
                           {feelings.map(f => (
                              <Button key={f.label} variant="ghost" className="justify-start h-auto py-3" onClick={() => { setSelectedFeeling(f); setActiveTab('compose'); }}>
                                 <span className="mr-2 text-xl">{f.emoji}</span> {f.label}
                              </Button>
                           ))}
                        </div>
                     )}

                     {activeTab === 'background' && (
                        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4">
                           <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Choose Background</h3>
                           <div className="grid grid-cols-4 gap-3">
                              {backgroundColors.map(c => (
                                 <div 
                                    key={c.id} 
                                    className={`aspect-square rounded-xl cursor-pointer ring-2 ring-offset-2 transition-all ${c.bg} ${selectedColor.id === c.id ? 'ring-primary scale-95' : 'ring-transparent hover:scale-105'}`}
                                    onClick={() => { setSelectedColor(c); setActiveTab('compose'); }}
                                 />
                              ))}
                           </div>
                        </div>
                     )}

                  </ScrollArea>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <Separator className="mb-3 opacity-50" />
        
        <div className="flex justify-between gap-2">
           <QuickActionButton 
             icon={<Video className="text-red-500" size={20} />} 
             label="Live Video" 
             onClick={() => { setIsOpen(true); setActiveTab("compose"); }}
           />
           <QuickActionButton 
             icon={<ImageIcon className="text-green-500" size={20} />} 
             label="Photo/Video" 
             onClick={() => { setIsOpen(true); setActiveTab("media"); setTimeout(() => fileInputRef.current?.click(), 100); }}
           />
           <QuickActionButton 
             icon={<Activity className="text-yellow-500" size={20} />} 
             label="Feeling/Activity" 
             onClick={() => { setIsOpen(true); setActiveTab("feeling"); }}
           />
        </div>
      </div>
    </Card>
  );
}

function TabTrigger({ value, icon, label }: { value: string, icon: React.ReactNode, label: string }) {
   return (
      <TabsTrigger 
         value={value} 
         className="w-full justify-start gap-3 px-4 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all"
      >
         {icon}
         <span>{label}</span>
      </TabsTrigger>
   );
}

function QuickActionButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <Button 
      variant="ghost" 
      className="flex-1 text-muted-foreground hover:bg-muted/50 hover:text-foreground gap-2 h-auto py-2.5 rounded-xl transition-all hover:scale-[1.02]"
      onClick={onClick}
    >
      {icon}
      <span className="font-medium text-sm text-foreground/80">{label}</span>
    </Button>
  );
}
