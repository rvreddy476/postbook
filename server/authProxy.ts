import type { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq, or } from "drizzle-orm";
import { z } from "zod";

function getJwtSecret(): string {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }
  if (process.env.NODE_ENV === "production") {
    console.warn("WARNING: JWT_SECRET not set in production. Using a generated secret.");
    return require("crypto").randomBytes(32).toString("hex");
  }
  return "dev-postbook-secret-key-NOT-FOR-PRODUCTION";
}

const JWT_SECRET = getJwtSecret();
const JWT_EXPIRES_IN = "7d";

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().optional(),
});

const loginSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone is required"),
  password: z.string().min(1, "Password is required"),
});

interface JwtPayload {
  userId: string;
  email: string;
  username: string;
}

function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function registerAuthRoutes(app: Express) {
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors.map(e => e.message)
      });
    }
    
    const { username, email, password, firstName, lastName, phoneNumber } = validation.data;
    
    try {
      const existingUser = await db.select()
        .from(users)
        .where(or(eq(users.email, email), eq(users.username, username || email.split("@")[0])))
        .limit(1);

      if (existingUser.length > 0) {
        return res.status(400).json({ message: "User with this email or username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const [newUser] = await db.insert(users).values({
        username: username || email.split("@")[0],
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phoneNumber: phoneNumber || null,
      }).returning();

      const token = generateToken({
        userId: newUser.id,
        email: newUser.email || "",
        username: newUser.username,
      });

      res.status(201).json({
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phoneNumber: newUser.phoneNumber,
          avatarUrl: newUser.avatarUrl,
          role: "user",
        },
      });
    } catch (error) {
      console.error(`Auth register error: ${error}`);
      res.status(500).json({ 
        message: "Registration failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors.map(e => e.message)
      });
    }
    
    const { emailOrPhone, password } = validation.data;

    try {
      const [user] = await db.select()
        .from(users)
        .where(or(
          eq(users.email, emailOrPhone),
          eq(users.username, emailOrPhone),
          eq(users.phoneNumber, emailOrPhone)
        ))
        .limit(1);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken({
        userId: user.id,
        email: user.email || "",
        username: user.username,
      });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          avatarUrl: user.avatarUrl,
          role: "user",
        },
      });
    } catch (error) {
      console.error(`Auth login error: ${error}`);
      res.status(500).json({ 
        message: "Login failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No authorization header" });
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    if (!payload) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    try {
      const [user] = await db.select()
        .from(users)
        .where(eq(users.id, payload.userId))
        .limit(1);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          avatarUrl: user.avatarUrl,
          role: "user",
        },
      });
    } catch (error) {
      console.error(`Auth me error: ${error}`);
      res.status(500).json({ 
        message: "Failed to get user",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}
