
---

## 🛠️ Build System
- **Development**: `tsx` (server), Vite dev server (client)
- **Production**:
  - Server bundled with `esbuild`
  - Client built to `dist/public`
- Optimized dependency bundling for faster cold starts ⚡

---

## 🌐 External Dependencies

### 🤖 AI Services
- **Google Gemini** (via Replit AI Integrations)
- Environment variables:
  - `AI_INTEGRATIONS_GEMINI_API_KEY`
  - `AI_INTEGRATIONS_GEMINI_BASE_URL`

### 🧱 Database
- **PostgreSQL**
- Environment variable: `DATABASE_URL`
- Session storage: `connect-pg-simple`

### 📦 Key NPM Packages
- **@google/genai**
- **drizzle-orm / drizzle-kit**
- **@tanstack/react-query**
- **@radix-ui/***
- **react-hook-form + zod**
- **multer**

---

## ✅ Prerequisites
- A **Google Gemini API Key** 🔑  
  Get one from **Google AI Studio**

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <your-project-folder>
