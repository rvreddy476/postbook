"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Smile, Image as ImageIcon, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  id?: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
  backgroundColor?: string | null;
  feeling?: string | null;
}

interface Comment {
    id: number;
    name: string;
    role?: string;
    text: string;
    time: string;
    avatar: string;
    likes: number;
    replies?: Comment[];
}

export function PostCard({ author, content, image, time }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [visibleComments, setVisibleComments] = useState(3);
  const [commentText, setCommentText] = useState("");
  
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const scrollRef = useRef<HTMLDivElement | null>(null);
  
  const [commentList, setCommentList] = useState<Comment[]>([
    { id: 1, name: "Jane Cooper", role: "Product Designer", text: "This is amazing!", time: "2m ago", avatar: "", likes: 4 },
    { id: 2, name: "Wade Warren", role: "Frontend Dev", text: "Love the colors in this.", time: "5m ago", avatar: "", likes: 1 },
    { id: 3, name: "Esther Howard", role: "Project Manager", text: "Can't wait to see more updates.", time: "12m ago", avatar: "", likes: 0 },
    { id: 4, name: "Cameron Williamson", role: "Marketing", text: "Great work on this!", time: "15m ago", avatar: "", likes: 2 },
    { id: 5, name: "Jenny Wilson", role: "Developer", text: "Looks fantastic", time: "18m ago", avatar: "", likes: 3 },
  ]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setCommentList([
      ...commentList, 
      { id: Date.now(), name: "User", role: "Member", text: commentText, time: "Just now", avatar: "", likes: 0 }
    ]);
    setCommentText("");
    if (commentList.length >= visibleComments) {
        setVisibleComments(prev => prev + 1);
    }
  };

  const handleReplySubmit = (e: React.FormEvent, parentId: number) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply: Comment = {
        id: Date.now(),
        name: "User",
        role: "Member",
        text: replyText,
        time: "Just now",
        avatar: "",
        likes: 0
    };

    setCommentList(prevComments => 
        prevComments.map(comment => 
            comment.id === parentId 
                ? { ...comment, replies: [...(comment.replies || []), newReply] }
                : comment
        )
    );
    
    setReplyText("");
    setReplyingToId(null);
  };

  const handleLoadMore = () => {
      setVisibleComments(prev => prev + 3);
      setTimeout(() => {
          if (scrollRef.current) {
              const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
              if (scrollContainer) {
                  scrollContainer.scrollTop = scrollContainer.scrollHeight;
              }
          }
      }, 100);
  };

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 p-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border cursor-pointer">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm hover:underline cursor-pointer">{author.name}</span>
              <span className="text-muted-foreground text-xs">• {time}</span>
            </div>
            <span className="text-muted-foreground text-xs">@{author.handle}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="p-0">
        {content && <p className="px-5 pb-4 text-sm leading-relaxed whitespace-pre-wrap">{content}</p>}
        
        {image && (
          <div className="relative aspect-video w-full overflow-hidden bg-muted cursor-pointer">
            <img 
              src={image} 
              alt="Post content" 
              className="object-cover w-full h-full hover:scale-[1.01] transition-transform duration-500"
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-3 flex flex-col gap-3 border-t border-border/50 bg-card/50">
        <div className="flex items-center justify-between w-full px-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("rounded-full hover:bg-red-50 hover:text-red-500 transition-colors", isLiked && "text-red-500")}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={cn("h-6 w-6", isLiked && "fill-current")} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn("rounded-full hover:bg-primary/5 hover:text-primary transition-colors", showComments && "text-primary bg-primary/5")}
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>

            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 hover:text-primary transition-colors">
              <Share2 className="h-6 w-6" />
            </Button>

            <Button 
                variant="ghost" 
                size="icon" 
                className={cn("rounded-full hover:bg-primary/5 hover:text-primary transition-colors", isSaved && "text-primary fill-current")}
                onClick={() => setIsSaved(!isSaved)}
            >
                <Bookmark className={cn("h-6 w-6", isSaved && "fill-current")} />
            </Button>
        </div>
        
        {showComments && (
          <div className="w-full pt-2 animate-in slide-in-from-top-2 duration-200">
            <div className="flex gap-3 mb-4">
               <Avatar className="h-8 w-8 shrink-0">
                 <AvatarFallback>U</AvatarFallback>
               </Avatar>
               <div className="flex-1 relative">
                 <form onSubmit={handleAddComment} className="relative">
                   <Input 
                     placeholder="Add a comment..." 
                     className="pr-20 h-10 rounded-full bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/20"
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                   />
                   <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
                     <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-full">
                       <Smile size={16} />
                     </Button>
                     <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-full">
                       <ImageIcon size={16} />
                     </Button>
                   </div>
                 </form>
               </div>
            </div>

            <ScrollArea className="max-h-[300px] pr-4 -mr-4">
                <div className="space-y-3 pl-11 pb-2">
                {commentList.slice(0, visibleComments).map((comment) => (
                    <div key={comment.id} className="flex flex-col gap-2">
                        <div className="flex gap-3 group">
                            <Avatar className="h-8 w-8 shrink-0 border border-border">
                                <AvatarImage src={comment.avatar} />
                                <AvatarFallback className="text-xs bg-muted text-muted-foreground">{comment.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="bg-muted/30 rounded-xl p-2.5 relative">
                                    <div className="flex items-baseline justify-between mb-0.5">
                                        <div>
                                        <span className="text-sm font-semibold text-foreground mr-2 cursor-pointer hover:underline">{comment.name}</span>
                                        {comment.role && <span className="text-xs text-muted-foreground hidden sm:inline-block">• {comment.role}</span>}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground">{comment.time}</span>
                                    </div>
                                    <p className="text-sm text-foreground/90 leading-relaxed">{comment.text}</p>
                                </div>
                                
                                <div className="flex items-center gap-3 mt-1 ml-2">
                                    <div className="flex items-center gap-1">
                                        <button className="text-[10px] font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                                            Like {comment.likes > 0 && `(${comment.likes})`}
                                        </button>
                                    </div>
                                    <button 
                                        className="text-[10px] font-medium text-muted-foreground hover:text-primary transition-colors"
                                        onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                                    >
                                        Reply
                                    </button>
                                </div>

                                {replyingToId === comment.id && (
                                    <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="flex gap-2">
                                            <Input 
                                                autoFocus
                                                placeholder={`Reply to ${comment.name}...`}
                                                className="h-8 text-xs bg-muted/30 rounded-full"
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                            />
                                            <Button type="submit" size="sm" className="h-8 rounded-full px-3" disabled={!replyText.trim()}>
                                                Reply
                                            </Button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>

                        {comment.replies && comment.replies.length > 0 && (
                            <div className="pl-11 space-y-2">
                                {comment.replies.map((reply) => (
                                    <div key={reply.id} className="flex gap-3 group">
                                        <Avatar className="h-6 w-6 shrink-0 border border-border">
                                            <AvatarImage src={reply.avatar} />
                                            <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">{reply.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="bg-muted/20 rounded-xl p-2 relative">
                                                <div className="flex items-baseline justify-between mb-0.5">
                                                    <span className="text-xs font-semibold text-foreground mr-2">{reply.name}</span>
                                                    <span className="text-[10px] text-muted-foreground">{reply.time}</span>
                                                </div>
                                                <p className="text-xs text-foreground/90 leading-relaxed">{reply.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                
                {visibleComments < commentList.length && (
                    <div className="pl-11 pt-1">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-muted-foreground hover:text-foreground text-xs font-medium h-auto py-1 px-2"
                            onClick={handleLoadMore}
                        >
                            Load more comments <ChevronDown size={12} className="ml-1" />
                        </Button>
                    </div>
                )}
                </div>
            </ScrollArea>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
