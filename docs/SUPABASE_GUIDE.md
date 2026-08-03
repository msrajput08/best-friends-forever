# Supabase Database & Persistence Guide

This application provides real-time cloud synchronization using Supabase for living letters, signed certificates, friendship promises, and question answers.

---

## 1. Database Schema

Execute the following SQL queries in your Supabase SQL Editor to set up the required tables:

```sql
-- 1. Letters Table
CREATE TABLE IF NOT EXISTS letters (
  id BIGSERIAL PRIMARY KEY,
  scene_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
  id BIGSERIAL PRIMARY KEY,
  scene_id TEXT NOT NULL,
  friend_name TEXT NOT NULL,
  signature_data TEXT NOT NULL,
  signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Promises Table
CREATE TABLE IF NOT EXISTS promises (
  id BIGSERIAL PRIMARY KEY,
  scene_id TEXT NOT NULL,
  is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Answers Table
CREATE TABLE IF NOT EXISTS answers (
  id BIGSERIAL PRIMARY KEY,
  question_id TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 2. Row Level Security (RLS)

Enable RLS and allow public access for anonymous read/write operations (ideal for single-session gift applications):

```sql
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read/write letters" ON letters FOR ALL USING (true);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read/write certificates" ON certificates FOR ALL USING (true);

ALTER TABLE promises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read/write promises" ON promises FOR ALL USING (true);

ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read/write answers" ON answers FOR ALL USING (true);
```

---

## 3. LocalStorage Fallback

If `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are not set in `.env.example`, the client automatically degrades gracefully to browser `localStorage` without interrupting user experience or throwing modal errors.
