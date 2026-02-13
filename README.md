# GitHub Career Intelligence Platform

A production-ready tool to analyze GitHub profiles, generate portfolio scores, and simulate recruiter feedback.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Git

### 1. Backend Setup
The backend is built with FastAPI.

```bash
# Install dependencies (if not already done)
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Run the server
cd ..
./run_backend.bat
```
The API will be available at `http://localhost:8000`.
Swagger Docs: `http://localhost:8000/api/v1/docs`

### 2. Frontend Setup
The frontend is built with Next.js, Tailwind CSS, and Shadcn UI.

```bash
# Install dependencies (if not already done)
cd frontend
npm install

# Run the development server
cd ..
./run_frontend.bat
```
Open `http://localhost:3000` in your browser.

## 🏗 Architecture
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Recharts, Lucide React.
- **Backend**: FastAPI, Pydantic, HTTPX.
- **Scoring**: Custom weighted algorithm analyzing 6 dimensions of a profile.

## 🛠 Features (Current Status)
- [x] Profile Analysis (Stars, Forks, Languages)
- [x] Scoring Engine (0-100)
- [x] Interactive Dashboard
- [ ] Recruiter AI Simulation (Coming Soon)
- [ ] README Quality Analyzer (Coming Soon)
