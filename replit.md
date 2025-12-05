# PostBook - Social Media Platform

## Overview

PostBook is a full-stack social media application built with React, Express, and PostgreSQL. It provides core social networking features including user authentication, post creation and interaction, real-time messaging, reels/video content, and a watch feed. The application uses a modern tech stack with Drizzle ORM for database management, and shadcn/ui components for the user interface.

## Recent Changes (December 2025)

### Next.js Migration
- Migrated frontend from React/Vite to Next.js 15 with App Router
- Next.js app located in `/nextjs-app` directory
- Maintains exact same visual design with Blue Chill (#148290) and Tea (#C0BBB1) color palette
- All pages ported: home (login/register), feed, profile, reels, watch
- API requests proxied via `next.config.js` rewrites to Express backend on port 5000
- Uses React 19 with proper type resolution in monorepo structure

### Directory Structure
- `/client` - Original React/Vite frontend (legacy)
- `/nextjs-app` - New Next.js App Router frontend
- `/server` - Express backend (shared between both frontends)
- `/shared` - Shared TypeScript types and database schema

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite with custom plugins for runtime error handling and meta image injection
- **Styling:** Tailwind CSS v4 with custom design tokens
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Routing:** Wouter (lightweight client-side router)
- **State Management:** TanStack Query (React Query) for server state
- **Forms:** React Hook Form with Zod validation

**Design Decisions:**
- **Component Library:** Uses shadcn/ui "new-york" style variant for a modern, polished aesthetic with neutral base colors
- **Custom Fonts:** DM Sans for body text and Outfit for headings, loaded from Google Fonts
- **Responsive Design:** Mobile-first approach with dedicated mobile navigation component
- **Context Providers:** Separate contexts for authentication (AuthContext) and messaging (MessengerContext) to isolate concerns
- **Protected Routes:** Route-level authentication guards that redirect unauthenticated users to login

**Key Features:**
- Feed with post creation, likes, comments, and nested replies
- Reels modal viewer with infinite scroll capability
- Watch page for video content discovery
- User profile with tabs (About, Posts, Friends, Photos, Videos)
- Real-time messenger with chat popups and sidebar
- Responsive navigation (desktop sidebar + mobile bottom nav)

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with TypeScript (ESM modules)
- **Framework:** Express.js
- **Database ORM:** Drizzle ORM
- **Authentication:** JWT-based auth with bcryptjs password hashing
- **Session Management:** Designed for JWT token storage (local storage on client)

**Design Decisions:**
- **Monorepo Structure:** Client, server, and shared code in single repository
  - `/client` - React frontend
  - `/server` - Express backend
  - `/shared` - Shared TypeScript types and database schema
- **Build Process:** Custom esbuild configuration bundles server code with allowlisted dependencies to reduce cold start times
- **Authentication Flow:** 
  - Registration with email/username, password validation (min 8 chars, uppercase, lowercase, number)
  - Login accepts email or phone number
  - JWT tokens with 7-day expiration
  - Development fallback secret (production requires JWT_SECRET env var)
- **API Design:** RESTful endpoints with /api prefix
- **Storage Layer:** Abstracted through IStorage interface (DatabaseStorage implementation) for potential future flexibility

**API Endpoints:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication  
- `GET /api/posts` - Fetch posts with pagination
- `POST /api/posts` - Create new post
- `POST /api/posts/:postId/like` - Like/unlike posts
- Comment endpoints (referenced in storage layer)

### Database Architecture

**Database System:** PostgreSQL (via Neon serverless driver)

**Schema Design:**
- **users** - Core user accounts (id, username, password, email, firstName, lastName, phoneNumber, avatarUrl)
- **posts** - User posts (id, authorId, content, imageUrl, backgroundColor, feeling, createdAt)
- **postLikes** - Post like relationships (id, postId, userId, createdAt)
- **comments** - Post comments with nested reply support (id, postId, authorId, content, parentId, createdAt)

**Design Decisions:**
- **UUID Primary Keys:** Uses PostgreSQL's `gen_random_uuid()` for all primary keys
- **Denormalization:** Posts include optional styling (backgroundColor, feeling) for rich content
- **Referential Integrity:** Foreign key constraints on all relationships
- **Timestamps:** All entities track creation time with `defaultNow()`
- **Schema Validation:** Zod schemas generated from Drizzle schema for runtime validation

**Migration Strategy:**
- Drizzle Kit manages schema migrations in `/migrations` directory
- Push-based workflow with `npm run db:push` command

**Note on Architectural Document:**
An attached database architecture document (`postbookDB_1764777654445.md`) describes a microservices architecture with MongoDB for various services. This appears to be aspirational/future planning, as the current implementation uses a monolithic architecture with PostgreSQL only.

### Security Considerations

- **Password Security:** Bcrypt hashing with salt rounds
- **Input Validation:** Zod schemas validate all user inputs
- **SQL Injection Protection:** Drizzle ORM provides parameterized queries
- **Environment Variables:** Sensitive config (DATABASE_URL, JWT_SECRET) via environment variables
- **CORS:** Configured for production deployment

### Development Workflow

**Scripts:**
- `npm run dev` - Start development server with hot reload
- `npm run dev:client` - Start Vite dev server only (port 5000)
- `npm run build` - Production build (client + server)
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run check` - TypeScript type checking

**Development Environment:**
- Vite HMR via WebSocket on `/vite-hmr` path
- Custom logging middleware tracks request duration
- Error overlay for runtime errors (Replit plugin)
- Automatic index.html reloading with cache busting

## External Dependencies

### Third-Party Services

**Database:**
- **Neon Database** (@neondatabase/serverless) - Serverless PostgreSQL hosting
- Connection via DATABASE_URL environment variable
- Configured in `drizzle.config.ts` for migrations

### UI Component Libraries

**Radix UI:** Complete set of headless UI primitives
- Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu, Popover, Select, Tabs, Toast, Tooltip, and more
- Provides accessibility features out of the box

**Additional UI Dependencies:**
- **class-variance-authority** - Type-safe variant management for components
- **cmdk** - Command palette component
- **date-fns** - Date formatting and manipulation
- **lucide-react** - Icon library (specified in components.json)

### Build Tools & Deployment

**Replit-Specific Plugins:**
- `@replit/vite-plugin-runtime-error-modal` - Error overlay in development
- `@replit/vite-plugin-cartographer` - Development tooling (conditional)
- `@replit/vite-plugin-dev-banner` - Development banner (conditional)
- Custom `vite-plugin-meta-images` - Updates OpenGraph image URLs for Replit deployments

### Authentication & Security

- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation and verification
- **@hookform/resolvers** - Form validation resolver integration
- **zod** - Runtime type validation and schema generation

### Development Dependencies

- **TypeScript** - Type safety across full stack
- **tsx** - TypeScript execution for build scripts
- **esbuild** - Fast JavaScript bundler for server code
- **Vite** - Frontend build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework via @tailwindcss/vite plugin
- **Drizzle Kit** - Database migration toolkit