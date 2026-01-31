# 🧬 Lab2Life - Personal Health Management Platform

Lab2Life is a personal health management platform that transforms bloodwork and medical documents into actionable health recommendations 💡.

---

📌 Note: This project was created for ElleHacks in collaboration between Lyanghyeon, Nas, and Deniz.

## ⭐ Overview

**Lab2Life** helps users manage their health by tracking supplements and overall wellness 🩺. Users can upload lab results as a PDF or image 📄, and the app uses Google Gemini to extract key health markers such as vitamins, minerals, and blood values. It then generates personalized supplement 💊, dietary 🥗, and physical activity 🏃‍♀️ recommendations.  
The platform also supports medication and supplement tracking with reminders ⏰ and drug interaction checking ⚠️.

## 🏗️ System Architecture

### 🎨 Frontend Architecture
- **Framework**: React 18 with TypeScript  
- **Routing**: Wouter (lightweight React router)  
- **State Management**: TanStack React Query for server state  
- **UI Components**: shadcn/ui built on Radix UI primitives  
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support 🌙☀️)  
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)  

### 🧠 Backend Architecture
- **Runtime**: Node.js with Express  
- **Language**: TypeScript with ES modules  
- **API Pattern**: RESTful JSON API under /api prefix  
- **File Uploads**: Multer with memory storage for lab result processing  
- **AI Integration**: Google Gemini via Replit AI Integrations for:
  - Lab result text extraction and analysis  
  - Health marker extraction  
  - Recommendation generation  
  - Drug interaction checking  

### 🗄️ Data Layer
- **Database**: PostgreSQL  
- **ORM**: Drizzle ORM with drizzle-zod for validation  
- **Schema Location**: shared/schema.ts (shared between client and server)  
- **Migrations**: drizzle-kit with migrations in /migrations directory  

### 📊 Key Data Models
- **Users**: Authentication with username/password  
- **Lab Results**: Uploaded documents with processing status  
- **Health Markers**: Extracted values (vitamins, minerals, blood values) with normal ranges  
- **Medications**: User medications with dosage, frequency, timing, timeBlock, foodRule, separationRules  
- **Supplements**: User supplements with dosage, timeBlock, foodRule, separationRules  
- **Recommendations**: AI-generated health recommendations (supplement, dietary, physical)  
- **Reminders**: Smart notifications ⏰ scheduled using user-defined wake-up and meal times  
- **Interactions**: Drug/supplement interaction warnings ⚠️  
- **Pill Stacks**: Groups of pills taken together at specific times  
- **Pill Doses**: Daily tracking of individual pill doses with status (pending/taken/snoozed)  

### 📅 Pill Planner Feature
The Pill Planner (`/planner`) is a mobile-first daily/weekly medication and supplement tracker:
- **Daily View**: Pills organized by time blocks (Morning, Midday, Evening, Bedtime)  
- **Weekly View**: Calendar grid showing pill dots for each day/time block  
- **Dose Tracking**: Mark pills as taken or snooze for later  
- **Progress Tracking**: Completion percentage for each day 📈  
- **Conflict Detection**: Visual warnings for separation rules (e.g., Iron + Calcium)  
- **Food Rules**: Tags indicating whether to take with food 🍽️ or on an empty stomach  

### 🗂️ Project Structure
