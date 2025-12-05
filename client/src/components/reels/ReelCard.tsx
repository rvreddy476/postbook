import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Share2, MoreVertical, Music2, Smile, Image as ImageIcon, Gift, Sticker, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReelCardProps {
  author: {
    name: string;
    avatar: string;
  };
  description: string;
  song: string;
  videoPlaceholder: string;
  likes: string;
  comments: string;
}

export function ReelCard({ author, description, song, videoPlaceholder, likes, comments }: ReelCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentList, setCommentList] = useState([
    { id: 1, name: "Swamikumar Polampalli", text: "This is hilarious! 😂", time: "2m ago", avatar: "" },
    { id: 2, name: "Emily Chen", text: "Love the vibes! 😍", time: "5m ago", avatar: "" },
    { id: 3, name: "David Kim", text: "Where is this?", time: "10m ago", avatar: "" },
    { id: 4, name: "Sarah Jenkins", text: "Can't wait to see more!", time: "15m ago", avatar: "" },
    { id: 5, name: "Mike Kogan", text: "Awesome edit 🔥", time: "20m ago", avatar: "" },
  ]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setCommentList([
      ...commentList, 
      { id: Date.now(), name: "You", text: commentText, time: "Just now", avatar: "" }
    ]);
    setCommentText("");
  };

  return (
    <div className="flex h-full w-full max-w-7xl mx-auto items-center justify-center p-4 relative">
      
      {/* Video Container */}
      <div className="relative h-[90vh] w-auto aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0 z-20">
          <img 
            src={videoPlaceholder} 
            alt="Reel" 
            className="w-full h-full object-cover opacity-90"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/80 pointer-events-none" />

          {/* Bottom Info (Inside Video) */}
          <div className="absolute bottom-0 left-0 right-16 p-6 text-white z-20">
             <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white/20">
                  <AvatarImage src={author.avatar} />
                  <AvatarFallback>{author.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-base drop-shadow-md">{author.name}</span>
                <Button variant="outline" size="sm" className="h-7 text-xs bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white px-3 rounded-full backdrop-blur-md">Follow</Button>
             </div>
          </div>

          {/* Action Buttons (Floating Right Side of Video) */}
          <div className="absolute right-3 bottom-20 flex flex-col items-center gap-5 z-20">
              <div className="flex flex-col items-center gap-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className={cn("rounded-full h-10 w-10 bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10 transition-all", isLiked && "text-red-500 bg-red-500/20 border-red-500/50")}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
                </Button>
                <span className="text-white text-xs font-medium drop-shadow-md">{likes}</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className={cn("rounded-full h-10 w-10 bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10 transition-all", showComments && "bg-white text-black hover:bg-white/90")}
                  onClick={() => setShowComments(!showComments)}
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <span className="text-white text-xs font-medium drop-shadow-md">{comments}</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                 <Button size="icon" variant="ghost" className="rounded-full h-10 w-10 bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10 transition-all">
                  <Share2 className="h-5 w-5" />
                </Button>
                <span className="text-white text-xs font-medium drop-shadow-md">Share</span>
              </div>

              <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 text-white/60 hover:text-white transition-colors mt-2">
                <MoreVertical className="h-5 w-5" />
              </Button>
          </div>
      </div>

      {/* Comments Panel (Right Side - Absolute positioned) */}
      {showComments && (
        <div 
            className="absolute h-[90vh] w-[360px] bg-card rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-left-5 duration-300 z-10"
            style={{ left: 'calc(50% + (90vh * 9 / 32) + 24px)' }}
        >
           {/* Header */}
           <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
              <span className="font-semibold text-sm">Comments ({comments})</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted" onClick={() => setShowComments(false)}>
                 <X size={16} />
              </Button>
           </div>
   
           {/* Comments List */}
           <div className="flex-1 overflow-hidden flex flex-col bg-card relative">
              <ScrollArea className="flex-1 p-0">
                 <div className="p-4 space-y-6">
                    {commentList.map((comment) => (
                       <div key={comment.id} className="flex gap-3 group">
                          <Avatar className="h-8 w-8 mt-0.5 border border-border">
                             <AvatarFallback className="text-xs bg-muted text-muted-foreground">{comment.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                             <div className="flex items-baseline justify-between">
                                <span className="text-sm font-semibold text-foreground">{comment.name}</span>
                                <span className="text-[10px] text-muted-foreground">{comment.time}</span>
                             </div>
                             <p className="text-sm text-muted-foreground leading-relaxed">{comment.text}</p>
                             <div className="flex items-center gap-4 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-muted-foreground font-medium cursor-pointer hover:text-foreground">Reply</span>
                                <button className="text-muted-foreground hover:text-red-500 transition-colors">
                                   <Heart size={12} />
                                </button>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </ScrollArea>
           </div>
   
           {/* Footer: Add Comment */}
           <div className="p-4 bg-card border-t border-border space-y-3">
              <div className="flex justify-between px-2">
                  <button className="text-xl hover:scale-110 transition-transform">❤️</button>
                  <button className="text-xl hover:scale-110 transition-transform">🙌</button>
                  <button className="text-xl hover:scale-110 transition-transform">🔥</button>
                  <button className="text-xl hover:scale-110 transition-transform">👏</button>
                  <button className="text-xl hover:scale-110 transition-transform">😢</button>
              </div>
              <form onSubmit={handleAddComment} className="flex items-center gap-2 bg-muted/50 rounded-2xl px-3 py-1 border border-transparent focus-within:border-primary/30 focus-within:bg-muted transition-all">
                 <Input 
                    placeholder="Add a comment..." 
                    className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 h-10 px-0 placeholder:text-muted-foreground"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                 />
                 <Button 
                    type="submit" 
                    variant="ghost" 
                    size="sm" 
                    className={cn("text-primary font-semibold hover:bg-transparent hover:text-primary/80 px-0 transition-opacity", !commentText.trim() && "opacity-50 cursor-not-allowed")}
                    disabled={!commentText.trim()}
                 >
                    Post
                 </Button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}