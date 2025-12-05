"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { CreatePost } from "@/components/feed/CreatePost";
import { PostCard } from "@/components/feed/PostCard";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface PostAuthor {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
}

interface Post {
  id: string;
  authorId: string;
  content: string;
  imageUrl: string | null;
  backgroundColor: string | null;
  feeling: string | null;
  createdAt: string;
  author: PostAuthor | null;
  likesCount: number;
  commentsCount: number;
}

const defaultPosts = [
  {
    id: "default-1",
    author: {
      name: "PostBook Team",
      handle: "postbook",
      avatar: "",
    },
    content: "Welcome to PostBook! We're excited to have you here. Start sharing your moments today.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80",
    likes: 5000,
    comments: 1200,
    time: "1d ago"
  },
  {
    id: "default-2",
    author: {
      name: "PostBook",
      handle: "postbook_official",
      avatar: "",
    },
    content: "Discover what's happening around you. Connect with friends, share your thoughts, and explore new content.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    likes: 856,
    comments: 42,
    time: "2d ago"
  }
];

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export default function Feed() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const handlePostCreated = () => {
    fetchPosts();
  };

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

  return (
    <AppLayout>
      <div className="space-y-6 py-6">
        <CreatePost onPostCreated={handlePostCreated} />
        
        <div className="space-y-6">
          {isLoading ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard 
                  key={post.id}
                  id={post.id}
                  author={{
                    name: post.author ? `${post.author.firstName || ""} ${post.author.lastName || ""}`.trim() || post.author.username : "Unknown User",
                    handle: post.author?.username || "user",
                    avatar: post.author?.avatarUrl || "",
                  }}
                  content={post.content}
                  image={post.imageUrl || undefined}
                  likes={post.likesCount}
                  comments={post.commentsCount}
                  time={formatTimeAgo(post.createdAt)}
                  backgroundColor={post.backgroundColor}
                  feeling={post.feeling}
                />
              ))}
              {defaultPosts.map((post) => (
                <PostCard 
                  key={post.id}
                  id={post.id}
                  author={post.author}
                  content={post.content}
                  image={post.image}
                  likes={post.likes}
                  comments={post.comments}
                  time={post.time}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function PostSkeleton() {
  return (
    <div className="bg-card rounded-lg p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-48 w-full rounded-lg" />
    </div>
  );
}
