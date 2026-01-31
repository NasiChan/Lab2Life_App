Lab2Life - Personal Health Management Platform
Lab2Life is a personal health management platform that transforms bloodwork and medical documents into actionable health recommendations.
Note: This project was created for ElleHacks in collaboration between Lyanghyeon, Nas, and Deniz.
⭐ Overview
Lab2Life helps users manage their health by turning lab results and medical documents into personalized supplement, dietary, and lifestyle routines.
Users can upload lab results as PDFs or images, and the app uses Google Gemini to extract key health markers such as vitamins, minerals, and blood values. Based on this data, Lab2Life generates tailored supplement, dietary, and physical activity recommendations.
The platform also supports medication and supplement tracking, allowing users to define their daily routine (wake-up time and meal times) and receive smart notifications at the correct times. Drug and supplement interaction warnings help users follow safer daily health routines.
System Architecture
Frontend Architecture
Framework: React 18 with TypeScript
Routing: Wouter (lightweight React router)
State Management: TanStack React Query for server state
UI Components: shadcn/ui built on Radix UI primitives
Styling: Tailwind CSS with CSS variables for theming (light/dark mode support)
Build Tool: Vite with path aliases (@/, @shared/, @assets/)
Backend Architecture
Runtime: Node.js with Express
Language: TypeScript with ES modules
API Pattern: RESTful JSON API under /api prefix
File Uploads: Multer with memory storage for lab result processing
AI Integration: Google Gemini via Replit AI Integrations for:
Lab result text extraction and analysis
Health marker extraction
Recommendation generation
Drug and supplement interaction checking
Data Layer
Database: PostgreSQL
ORM: Drizzle ORM with drizzle-zod for validation
Schema Location: shared/schema.ts (shared between client and server)
Migrations: drizzle-kit with migrations in /migrations directory
Key Data Models
Users: Authentication with username/password
Lab Results: Uploaded documents with processing status
Health Markers: Extracted values (vitamins, minerals, blood values) with normal ranges
Medications: User medications with dosage, frequency, timing, timeBlock, foodRule, separationRules
Supplements: User supplements with dosage, timeBlock, foodRule, separationRules
Recommendations: AI-generated health recommendations (supplement, dietary, physical)
Reminders: Scheduled reminders based on user routine and intake rules
Interactions: Drug/supplement interaction warnings
Pill Stacks: Groups of pills taken together at specific times
Pill Doses: Daily tracking of individual pill doses with status (pending, taken, snoozed)
Conversations/Messages: AI chat history (Replit integration module)
Pill Planner Feature
The Pill Planner (/planner) is a mobile-first medication and supplement tracking system built around the user’s daily routine.
Users can:
Set their wake-up time
Enter usual breakfast, lunch, and dinner times
Log prescribed medications and supplements
Define intake rules (e.g., take with food, evening only)
Lab2Life automatically schedules reminders and sends notifications at the appropriate routine-based times, such as with dinner or after waking up.
Planner Capabilities
Daily View: Pills organized by time blocks (Morning, Midday, Evening, Bedtime)
Weekly View: Calendar grid with progress indicators
Dose Tracking: Mark pills as taken or snooze for later
Progress Tracking: Daily completion percentage
Conflict Detection: Visual warnings for separation rules (e.g., Iron + Calcium)
Food Rules: Clear indicators for with food or empty stomach
Project Structure
├── client/src/              # React frontend
│   ├── components/          # UI components (shadcn/ui)
│   ├── pages/               # Route pages
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Utilities and query client
├── server/                  # Express backend
│   ├── replit_integrations/ # AI integration modules
│   └── routes.ts            # API route definitions
├── shared/                  # Shared types and schema
└── migrations/              # Database migrations
Build System
Development: tsx for server, Vite dev server for client
Production: esbuild bundles server to dist/index.cjs, Vite builds client to dist/public
Key dependencies bundled to reduce cold start times
External Dependencies
AI Services
Google Gemini (via Replit AI Integrations)
Lab result analysis
Health marker extraction
Recommendation generation
Drug interaction checking
Environment variables:
AI_INTEGRATIONS_GEMINI_API_KEY
AI_INTEGRATIONS_GEMINI_BASE_URL
Database
PostgreSQL: Primary data store
Environment variable: DATABASE_URL
Session storage: connect-pg-simple for Express sessions
Key NPM Packages
@google/genai: Gemini AI client
drizzle-orm / drizzle-kit: Database ORM and migrations
@tanstack/react-query: Server state management
@radix-ui/*: Accessible UI primitives
react-hook-form + zod: Form handling with validation
multer: File upload handling
