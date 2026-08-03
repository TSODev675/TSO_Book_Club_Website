# TSO Book Club

A professional internal web application for the CSIR TSO Book Club — managing members, books, meetings, reflections, and archives.

---

## 📁 Project Structure
tso-bookclub/
├── backend/ # Django REST API
├── frontend/ # React + Vite frontend
└── docker-compose.yml

---

## ✨ Features

### Members
- User registration with email verification
- Role-based access control (Admin / Member)
- Profile management and password change

### Books
- Curated book library
- Admin can add, edit, and remove books

### Meetings
- Schedule upcoming sessions with Microsoft Teams links
- Members can add meetings to Teams, Outlook, or Google Calendar
- Facilitator assignment per session

### Archive
- Past meeting notes and session summaries
- Video recording links
- Member reflections per session

### Messaging
- Direct messaging between members and admins

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.12, Django 6, Django REST Framework |
| Authentication | JWT (SimpleJWT) |
| API Docs | drf-spectacular (Swagger / ReDoc) |
| Frontend | React 19, Vite, TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| HTTP Client | Axios |
| State | React hooks + Context |
| Containerisation | Docker, Docker Compose |
| Database | SQLite (dev) |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.12+
- Node.js 20+
- Docker Desktop (optional)

---

### Option A — Local Development

**Backend:**
```bash
cd backend
python -m venv bkvenv
bkvenv\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

### Option B — Docker

```bash
docker compose up --build
```

---

## 🌐 Environment Variables

### `backend/.env`
```env
SECRET_KEY=your-django-secret-key
DEBUG=True
EMAIL_HOST_USER=your_gmail@gmail.com
EMAIL_HOST_PASSWORD=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

### `frontend/.env`
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/token/` | Login (get JWT) |
| POST | `/api/auth/token/refresh/` | Refresh token |
| GET | `/api/auth/verify-email/{uid}/{token}/` | Verify email |
| POST | `/api/auth/change-password/` | Change password |
| GET | `/api/books/` | List books |
| GET | `/api/meetings/upcoming/` | Upcoming meetings |
| GET | `/api/profiles/me/` | My profile |
| GET | `/api/messages/inbox/` | My inbox |
| GET | `/api/archives/` | All archives |
| GET | `/api/docs/` | Swagger UI |
| GET | `/api/redoc/` | ReDoc |

---

## 🖥 Access URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000/api/ |
| Swagger Docs | http://localhost:8000/api/docs/ |
| Django Admin | http://localhost:8000/admin/ |

---

## 🏗 Project Conventions

- Backend commits: `feat:`, `fix:`, `chore:`
- One feature per commit
- All changes developed on `dev` branch, merged to `main` when stable
- Never commit `.env`, `db.sqlite3`, or `__pycache__`

---

## 🎨 Branding

- **Primary colour:** CSIR Navy `#1B3A7A`
- **Accent:** CSIR Blue `#93B8F5`
- **Font (headings):** Playfair Display
- **Font (body):** Inter
- **Tagline:** *Touching lives through innovation*

---

## 👥 Built By

CSIR TSO Book Club Team — 2026