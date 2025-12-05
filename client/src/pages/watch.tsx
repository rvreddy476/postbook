import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play } from "lucide-react";
import coffeeImg from "@assets/generated_images/modern_minimalist_coffee_shop_interior.png";
import landscapeImg from "@assets/generated_images/scenic_mountain_landscape_at_sunset.png";
import manAvatar from "@assets/generated_images/professional_headshot_of_a_confident_man_with_a_beard.png";

export default function Watch() {
  const videos = [
    {
      id: 1,
      title: "Top 10 Coffee Shops in the World",
      thumbnail: coffeeImg,
      duration: "12:45",
      views: "1.2M views",
      time: "2 days ago",
      author: { name: "Coffee Explorer", avatar: manAvatar }
    },
    {
      id: 2,
      title: "Hiking the Alps: A Full Documentary",
      thumbnail: landscapeImg,
      duration: "45:20",
      views: "850K views",
      time: "1 week ago",
      author: { name: "Nature Channel", avatar: "" }
    },
    {
      id: 3,
      title: "How to start your own business in 2025",
      thumbnail: coffeeImg,
      duration: "22:10",
      views: "2.5M views",
      time: "3 days ago",
      author: { name: "BizInsider", avatar: "" }
    },
     {
      id: 4,
      title: "Relaxing Nature Sounds 4K",
      thumbnail: landscapeImg,
      duration: "3:00:00",
      views: "5M views",
      time: "1 month ago",
      author: { name: "Zen Mode", avatar: "" }
    }
  ];

  return (
    <AppLayout>
      <div className="py-6 space-y-6">
        <h1 className="text-2xl font-heading font-bold px-2">Watch TV</h1>
        
        <div className="grid grid-cols-1 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="border-none shadow-none bg-transparent hover:bg-card/50 transition-colors rounded-xl overflow-hidden cursor-pointer group">
              <div className="relative aspect-video bg-muted rounded-xl overflow-hidden mb-3">
                <img src={video.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-full">
                    <Play className="fill-white text-white h-8 w-8 ml-1" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md font-medium">
                  {video.duration}
                </span>
              </div>
              
              <div className="flex gap-3 px-2">
                <Avatar>
                  <AvatarImage src={video.author.avatar} />
                  <AvatarFallback>{video.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors">{video.title}</h3>
                  <div className="text-sm text-muted-foreground flex flex-wrap gap-x-1">
                    <span>{video.author.name}</span>
                    <span>•</span>
                    <span>{video.views}</span>
                    <span>•</span>
                    <span>{video.time}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}