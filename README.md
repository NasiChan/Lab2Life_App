Lab2Life
Personal Health Management Platform
Note: This project was created for ElleHacks in collaboration between Lyanghyeon, Nas, and Deniz.
⭐ Overview
Lab2Life is a personal health management platform that transforms bloodwork and medical documents into clear, actionable supplement, dietary, and lifestyle routines.
Users can upload lab results or medical documents as PDFs or images. Using Google Gemini, Lab2Life extracts key health markers such as vitamins, minerals, and blood values. Based on this data, the platform generates personalized recommendations tailored to the user’s health needs and daily routine.
Beyond analysis, Lab2Life helps users follow through by tracking medications and supplements, aligning them with the user’s wake-up and meal times, and sending timely notifications.
🩺 Key Features
Upload lab results as PDFs or images
AI-powered extraction of health markers
Personalized supplement recommendations
Medication and supplement tracking
Drug–supplement interaction warnings
Routine-based scheduling and notifications
💊 Pill Planner
The Pill Planner is a daily medication and supplement management system designed around the user’s real routine.
Key capabilities:
Users enter:
Wake-up time
Usual breakfast, lunch, and dinner times
Users log prescribed medications and supplements
Intake rules can be specified (e.g., take with food, evening only)
The app automatically schedules reminders based on meal times and preferences
Notifications are sent at the correct time (e.g., with dinner)
Planner views and tools:
Daily view organized by time blocks (Morning, Midday, Evening, Bedtime)
Weekly calendar view with progress indicators
Mark doses as taken or snoozed
Visual conflict warnings for separation rules (e.g., Iron + Calcium)
Daily completion tracking
🧠 AI Capabilities
Lab2Life integrates Google Gemini to:
Extract text from lab results and medical documents
Identify health markers and reference ranges
Generate personalized supplement and lifestyle recommendations
Detect drug and supplement interactions
🛠 Tech Stack
Frontend
React 18 + TypeScript
Tailwind CSS for styling and theming
shadcn/ui with Radix UI primitives
TanStack React Query for server state
Wouter for lightweight routing
Vite for development and builds
Backend
Node.js + Express
TypeScript (ES Modules)
RESTful API under /api
Multer for file uploads
Google Gemini via Replit AI Integrations
Database
PostgreSQL
Drizzle ORM with drizzle-zod validation
drizzle-kit for migrations
