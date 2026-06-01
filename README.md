# SocialApp — Full Stack Project

A social media feed where users can sign up, post text or images, like, and comment on posts.

**Tech Stack:** React.js · Node.js · Express · MongoDB · Material UI

---

## Project Structure

```
social-app/
├── backend/      Node.js + Express API
└── frontend/     React.js app
```

---

## Quick Start (Local Development)

### 1. Clone / download and open in VS Code

### 2. Set up MongoDB Atlas (free)
1. Go to https://cloud.mongodb.com and create a free account
2. Create a free M0 cluster
3. Under Security → Database Access, add a user with a password
4. Under Security → Network Access, add `0.0.0.0/0` (allow all)
5. Click Connect → Drivers → copy the connection string
6. Replace `<password>` with your actual password and add `/socialapp` before the `?`

### 3. Set up Cloudinary (free, for image uploads)
1. Go to https://cloudinary.com and create a free account
2. From your dashboard copy: Cloud Name, API Key, API Secret

### 4. Configure the backend
```bash
cd backend
cp .env.example .env
```
Open `.env` and fill in your MongoDB URI, JWT secret, and Cloudinary credentials.

### 5. Install and run the backend
```bash
cd backend
npm install
npm run dev
```
You should see: `Connected to MongoDB` and `Server running on port 5000`

### 6. Configure the frontend
```bash
cd frontend
cp .env.example .env
```
The default `.env` points to `http://localhost:5000/api` which is correct for local dev.

### 7. Install and run the frontend
```bash
cd frontend
npm install
npm start
```
Browser will open at http://localhost:3000

---

## Deployment

### Backend → Render (https://render.com)
1. Push the repo to GitHub (keep backend and frontend in separate folders)
2. New Web Service on Render → connect GitHub repo
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add all environment variables from your `.env` file
7. Deploy — copy the live URL

### Frontend → Vercel (https://vercel.com)
1. Import GitHub repo on Vercel
2. Root Directory: `frontend`
3. Add environment variable:
   - `REACT_APP_API_URL` = your Render backend URL + `/api`
4. Deploy

### Database → MongoDB Atlas
Already set up in step 2 above. Atlas is the cloud database.

---

## Features
- Signup and login with email and password (JWT authentication)
- Create posts with text, image, or both
- Public feed showing all posts (paginated, newest first)
- Like / unlike any post (toggle, tracks who liked)
- Comment on any post (press Enter or click send)
- Instant UI updates without page refresh
- Responsive layout — works on mobile and desktop

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | No | Create account |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/posts | Yes | Get all posts (paginated) |
| POST | /api/posts | Yes | Create a post |
| POST | /api/posts/:id/like | Yes | Toggle like |
| POST | /api/posts/:id/comment | Yes | Add a comment |
