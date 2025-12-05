import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerAuthRoutes } from "./authProxy";
import { insertPostSchema, insertCommentSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  registerAuthRoutes(app);

  app.get("/api/posts", async (req: Request, res: Response) => {
    try {
      const posts = await storage.getPosts(50);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/posts", async (req: Request, res: Response) => {
    try {
      const parsed = insertPostSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid post data", errors: parsed.error.errors });
      }
      const post = await storage.createPost(parsed.data);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.post("/api/posts/:postId/like", async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      await storage.likePost(postId, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  app.delete("/api/posts/:postId/like", async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      await storage.unlikePost(postId, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error unliking post:", error);
      res.status(500).json({ message: "Failed to unlike post" });
    }
  });

  app.get("/api/posts/:postId/comments", async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const comments = await storage.getCommentsByPostId(postId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/posts/:postId/comments", async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const parsed = insertCommentSchema.safeParse({ ...req.body, postId });
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid comment data", errors: parsed.error.errors });
      }
      const comment = await storage.createComment(parsed.data);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  return httpServer;
}
