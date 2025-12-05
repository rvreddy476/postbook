import { type User, type InsertUser, type Post, type InsertPost, type Comment, type InsertComment, users, posts, comments, postLikes } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPosts(limit?: number): Promise<(Post & { author: User | null, likesCount: number, commentsCount: number })[]>;
  getPostById(id: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  likePost(postId: string, userId: string): Promise<void>;
  unlikePost(postId: string, userId: string): Promise<void>;
  isPostLiked(postId: string, userId: string): Promise<boolean>;
  
  getCommentsByPostId(postId: string): Promise<(Comment & { author: User | null })[]>;
  createComment(comment: InsertComment): Promise<Comment>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getPosts(limit = 20): Promise<(Post & { author: User | null, likesCount: number, commentsCount: number })[]> {
    const postsResult = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(limit);

    const enrichedPosts = await Promise.all(
      postsResult.map(async (post) => {
        const author = await this.getUser(post.authorId);
        const likesCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(postLikes)
          .where(eq(postLikes.postId, post.id));
        const commentsCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(comments)
          .where(eq(comments.postId, post.id));
        
        return {
          ...post,
          author: author || null,
          likesCount: Number(likesCount[0]?.count || 0),
          commentsCount: Number(commentsCount[0]?.count || 0),
        };
      })
    );

    return enrichedPosts;
  }

  async getPostById(id: string): Promise<Post | undefined> {
    const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
    return result[0];
  }

  async createPost(post: InsertPost): Promise<Post> {
    const result = await db.insert(posts).values(post).returning();
    return result[0];
  }

  async likePost(postId: string, userId: string): Promise<void> {
    await db.insert(postLikes).values({ postId, userId }).onConflictDoNothing();
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    await db.delete(postLikes).where(
      and(eq(postLikes.postId, postId), eq(postLikes.userId, userId))
    );
  }

  async isPostLiked(postId: string, userId: string): Promise<boolean> {
    const result = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
      .limit(1);
    return result.length > 0;
  }

  async getCommentsByPostId(postId: string): Promise<(Comment & { author: User | null })[]> {
    const commentsResult = await db
      .select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(comments.createdAt);

    return Promise.all(
      commentsResult.map(async (comment) => ({
        ...comment,
        author: await this.getUser(comment.authorId) || null,
      }))
    );
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const result = await db.insert(comments).values(comment).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
