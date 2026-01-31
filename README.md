
### ⚙️ Build System
- Development: tsx for server, Vite dev server for client  
- Production: esbuild bundles server to dist/index.cjs, Vite builds client to dist/public  
- Key dependencies bundled to reduce cold start times 🚀  

## 🔌 External Dependencies

### 🤖 AI Services
- **Google Gemini** (via Replit AI Integrations): Used for lab result analysis, health marker extraction, recommendation generation, and interaction checking  
- Environment variables:
  - `AI_INTEGRATIONS_GEMINI_API_KEY`  
  - `AI_INTEGRATIONS_GEMINI_BASE_URL`  

### 🛢️ Database
- **PostgreSQL**: Primary data store  
- Environment variable: `DATABASE_URL`  
- Session storage: connect-pg-simple for Express sessions  

### 📦 Key NPM Packages
- **@google/genai**: Gemini AI client  
- **drizzle-orm / drizzle-kit**: Database ORM and migrations  
- **@tanstack/react-query**: Server state management  
- **@radix-ui/***: Accessible UI primitives  
- **react-hook-form + zod**: Form handling with validation  
- **multer**: File upload handling  

## ✅ Prerequisites
- A **Google Gemini API Key** 🔑  
  You can obtain one from **Google AI Studio**.

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd <your-project-folder>
