# Lab2Life

A personal health management platform that transforms bloodwork and medical documents into actionable supplements, dietary, and lifestyle recommendations.

---

Note: This project was created for ElleHacks in collaboration between Lyanghyeon, Nas, and Deniz.

## ⭐ Overview

**Lab2Life** helps users better understand and manage their health by turning lab results and medical documents into clear, personalized routines.
Users can upload bloodwork or health documents as PDFs or images, and the platform uses **Google Gemini** to extract key health markers such as vitamins, minerals, and blood values, Based on this data, Lab2Life generates tailored recommendations for ones routine/lifestyle.

The platform also includes medication and supplement tracking, reminders, and drug-supplement interaction warnings to support safer daily health routines.

---

## 🩺 Key Features

- Upload lab results as PDFs or images
- AI-powered extraction of health markers
- Personalized supplement reccomendations
- Medication and supplement tracking
- Drug and supplement interaction warnings
- Scheduled reminders for pills and supplements

---

## 💊 Pill Planner

The **Pill Planner** is a supplement tracking system designed for daily use.
- Daily view organized by time blocks (Morning, Midday, Evening, Bedtime)
- Weekly calendar view with progress indicators
- Mark doses as taked or snoozed
- Visual conflict warnings for seperation rules (e.g., Iron + Calcium)
- Daily completion tracking

---

## 🧠 AI Capabilities

Lab2Life integrates Google Gemini to:

- Extract text from lab results and medical documents
- Identify health markers and reference ranges
- Generate personalized health recommendations
- Detect drug and supplement interactions

---

## 🛠 Tech Stack
Frontend

- React 18 + TypeScript
- Tailwind CSS for styling and theming
- shadcn/ui with Radix UI primitives
- TanStack React Query for server state
- Wouter for lightweight routing
- Vite for development and builds

Backend

- Node.js + Express
- TypeScript (ES Modules)
- RESTful API under /api
- Multer for file uploads
- Google Gemini via Replit AI Integrations

Database

- PostgreSQL
- Drizzle ORM with drizzle-zod validation
- drizzle-kit for migrations
