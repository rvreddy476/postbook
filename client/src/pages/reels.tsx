import { AppLayout } from "@/components/layout/AppLayout";
import { ReelCard } from "@/components/reels/ReelCard";
import { useState, useEffect, useRef } from "react";
import { X, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import skateImg from "@assets/generated_images/person_skateboarding_in_an_urban_park.png";
import chefImg from "@assets/generated_images/chef_plating_a_gourmet_dish.png";
import womanAvatar from "@assets/generated_images/professional_headshot_of_a_smiling_young_woman_with_glasses.png";
import manAvatar from "@assets/generated_images/professional_headshot_of_a_confident_man_with_a_beard.png";

export default function Reels() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const reels = [
    {
      id: 1,
      author: { name: "SkateLife", avatar: manAvatar },
      description: "Morning session at the park 🛹🔥 #skateboarding #urban",
      song: "Original Audio - SkateLife",
      videoPlaceholder: skateImg,
      likes: "12.5K",
      comments: "450"
    },
    {
      id: 2,
      author: { name: "GourmetChef", avatar: womanAvatar },
      description: "Plating perfection. It's all in the details. 👨‍🍳✨",
      song: "Classical Vibes - Symphony",
      videoPlaceholder: chefImg,
      likes: "8.2K",
      comments: "210"
    },
    {
      id: 3,
      author: { name: "SkateLife", avatar: manAvatar },
      description: "Another day, another trick 🛹",
      song: "Original Audio - SkateLife",
      videoPlaceholder: skateImg,
      likes: "5.2K",
      comments: "120"
    },
    {
      id: 4,
      author: { name: "GourmetChef", avatar: womanAvatar },
      description: "Dessert time! 🍰",
      song: "Sweet Melodies",
      videoPlaceholder: chefImg,
      likes: "15K",
      comments: "800"
    },
    {
      id: 5,
      author: { name: "SkateLife", avatar: manAvatar },
      description: "Night riding 🌙",
      song: "LoFi Beats",
      videoPlaceholder: skateImg,
      likes: "8K",
      comments: "300"
    },
    {
      id: 6,
      author: { name: "GourmetChef", avatar: womanAvatar },
      description: "Masterclass preview 🎓",
      song: "Epic Intro",
      videoPlaceholder: chefImg,
      likes: "20K",
      comments: "1.2K"
    }
  ];

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  // Scroll to the selected reel when modal opens
  useEffect(() => {
    if (isModalOpen && scrollContainerRef.current) {
      const element = scrollContainerRef.current.children[selectedIndex] as HTMLElement;
      if (element) {
        element.scrollIntoView({ behavior: "auto" });
      }
    }
  }, [isModalOpen, selectedIndex]);

  return (
    <AppLayout showRightSidebar={true}>
      <div className="py-6">
        <h1 className="text-2xl font-heading font-bold mb-6 px-2">Explore Reels</h1>
        
        {/* Grid View */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-2">
           {reels.map((reel, index) => (
             <div 
                key={reel.id} 
                className="aspect-[9/16] relative rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => openModal(index)}
             >
                <img src={reel.videoPlaceholder} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white h-8 w-8" />
                </div>
                <div className="absolute bottom-2 left-2 text-white text-xs font-medium drop-shadow-md">
                   {reel.likes} likes
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Full Screen Modal with Scrollable Feed */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
           {/* Close Button */}
           <Button 
              size="icon" 
              variant="ghost" 
              className="absolute top-6 right-6 text-white/70 hover:text-white hover:bg-white/10 rounded-full h-12 w-12 z-50"
              onClick={() => setIsModalOpen(false)}
           >
              <X size={32} />
           </Button>

           {/* Scrollable Reel Container */}
           <div 
            ref={scrollContainerRef}
            className="w-full h-full overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden"
           >
              {reels.map((reel) => (
                <div key={reel.id} className="w-full h-full snap-center flex items-center justify-center p-4">
                   <ReelCard {...reel} />
                </div>
              ))}
           </div>
        </div>
      )}
    </AppLayout>
  );
}