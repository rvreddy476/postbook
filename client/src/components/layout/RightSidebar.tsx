import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

import womanAvatar from "@assets/generated_images/professional_headshot_of_a_smiling_young_woman_with_glasses.png";
import manAvatar from "@assets/generated_images/professional_headshot_of_a_confident_man_with_a_beard.png";

export function RightSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-80 h-[calc(100vh-4rem)] sticky top-16 border-l border-border bg-card px-6 py-6 gap-8">
      {/* Search removed from here as it's in the top header now */}

      <div className="space-y-4">
        <h3 className="font-heading font-semibold text-lg text-muted-foreground text-xs uppercase tracking-wider">Sponsored</h3>
        <div className="rounded-xl overflow-hidden border border-border group cursor-pointer relative">
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" alt="Ad" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                <p className="font-bold text-sm">Nike Air Max</p>
                <p className="text-xs opacity-80">Just Do It.</p>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading font-semibold text-lg">Trending Now</h3>
        <div className="space-y-4">
          {["#TechInnovation", "Photography", "WorldCup2026", "AIArt"].map((topic) => (
            <div key={topic} className="flex justify-between items-center group cursor-pointer">
              <div>
                <p className="font-medium group-hover:text-primary transition-colors">{topic}</p>
                <p className="text-xs text-muted-foreground">12.5k Posts</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                +
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-heading font-semibold text-lg">Who to follow</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={womanAvatar} />
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Sarah Jenkins</span>
                <span className="text-xs text-muted-foreground">@sarahj_design</span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="h-8 text-xs rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary">
              Follow
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={manAvatar} />
                <AvatarFallback>MK</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Mike Kogan</span>
                <span className="text-xs text-muted-foreground">@mikek_dev</span>
              </div>
            </div>
            <Button size="sm" variant="outline" className="h-8 text-xs rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary">
              Follow
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}