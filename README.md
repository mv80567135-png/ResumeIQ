# ResumeIQ - AI Resume Screening System

An automated resume analysis and skill matching system built with **Django REST Framework** and **React**.

---

## 🚀 Quick Start (ஒரே கிளிக்கில் தொடங்க)

### Option 1: Run via Batch File (Windows)
Double-click `start_app.bat` in the project root. This will automatically open both the Backend and Frontend in separate windows.

### Option 2: Manual Start

#### 1. Backend (Django)
```bash
cd backend/backend
python manage.py runserver 127.0.0.1:8000
```
API endpoints available at:
* `POST http://127.0.0.1:8000/api/screen/`
* `GET  http://127.0.0.1:8000/api/history/`
* `DELETE http://127.0.0.1:8000/api/history/clear/`

#### 2. Frontend (React)
```bash
cd frontend/frontend
npm start
```
Frontend runs at: `http://localhost:3000`

---

## 🛠️ Features & Improvements
- **Multi-Format Support:** PDF, DOCX, and TXT files.
- **Accurate Regex Matching:** Prevents false positives (e.g., words like `digital` no longer falsely trigger `git`).
- **Comprehensive Analysis:** Highlights both **Matched Skills** and **Missing Skills**.
- **Score Categorization:** Color-coded match percentage (High, Moderate, Needs Improvement).
- **History & Database Persistence:** Saves each evaluation to SQLite database with timestamps and ability to view/clear past screenings.
- **Robust Error Handling:** File validation, size limits (10MB max), and user-friendly error banners.
