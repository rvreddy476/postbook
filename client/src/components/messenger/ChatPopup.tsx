import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Minus, Phone, Video, Send, Image, Smile } from "lucide-react";
import { User } from "@/context/MessengerContext";

interface ChatPopupProps {
  user: User;
  onClose: () => void;
  index: number;
}

export function ChatPopup({ user, onClose, index }: ChatPopupProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{text: string, isMe: boolean}[]>([
     { text: "Hey, how are you?", isMe: false }
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    
    setMessages([...messages, { text: inputValue, isMe: true }]);
    setInputValue("");
    
    // Fake reply
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "That sounds great! 👍", isMe: false }]);
    }, 1500);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  // Calculate position: 
  // We want them to be shifted to the left of the sidebar (which is 320px wide)
  // The right offset needs to account for the sidebar width (320px) + some margin
  
  const sidebarWidth = 320; // w-80
  const chatWidth = 320; // w-80
  const gap = 20;
  
  // Position from right: Sidebar Width + Gap + (Index * (ChatWidth + Gap))
  // This pushes them to the left of the sidebar
  const rightPosition = sidebarWidth + gap + (index * (chatWidth + gap));

  return (
    <Card 
      className="fixed bottom-0 z-50 w-80 flex flex-col shadow-2xl border-t border-x border-border rounded-t-xl overflow-hidden bg-card animate-in slide-in-from-bottom duration-300"
      style={{ 
        right: isMinimized ? 'auto' : `${rightPosition}px`, 
        left: isMinimized ? `${20 + (index * 200)}px` : 'auto',
        height: isMinimized ? '48px' : '450px',
        transform: isMinimized ? 'translateY(0)' : 'translateY(0)' 
      }}
    >
      {/* Header */}
      <div 
        className="h-12 px-3 bg-primary text-primary-foreground flex items-center justify-between cursor-pointer hover:bg-primary/90 transition-colors"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <Avatar className="h-8 w-8 border border-primary-foreground/20">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-foreground">{user.name[0]}</AvatarFallback>
            </Avatar>
            {user.status === 'online' && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-primary rounded-full"></span>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-none">{user.name}</span>
            {!isMinimized && <span className="text-[10px] opacity-80 leading-none mt-1">{user.status === 'online' ? 'Active now' : 'Offline'}</span>}
          </div>
        </div>
        
        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
           {!isMinimized && (
             <>
               <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20">
                  <Phone size={14} />
               </Button>
               <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20">
                  <Video size={14} />
               </Button>
             </>
           )}
           <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setIsMinimized(!isMinimized)}>
              <Minus size={16} />
           </Button>
           <Button variant="ghost" size="icon" className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20 hover:text-red-200" onClick={onClose}>
              <X size={16} />
           </Button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <>
          <div className="flex-1 bg-muted/30 p-3 overflow-y-auto" ref={scrollRef}>
            <div className="space-y-3">
               <div className="flex justify-center my-2">
                 <span className="text-[10px] text-muted-foreground">Today</span>
               </div>
               {messages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${msg.isMe ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted text-foreground rounded-tl-none'}`}>
                     {msg.text}
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 bg-card border-t border-border">
            <form onSubmit={handleSend} className="flex gap-2">
              <div className="flex items-center gap-1">
                 <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Image size={18} />
                 </Button>
                 <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Smile size={18} />
                 </Button>
              </div>
              <Input 
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Aa" 
                className="h-9 bg-muted/50 border-none rounded-full px-4 focus-visible:ring-1" 
              />
              <Button type="submit" size="icon" className="h-9 w-9 rounded-full shrink-0" disabled={!inputValue.trim()}>
                <Send size={16} />
              </Button>
            </form>
          </div>
        </>
      )}
    </Card>
  );
}