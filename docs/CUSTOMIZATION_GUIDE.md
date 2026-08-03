# Beginner Customization Guide

If you have minimal coding experience, follow these 3 simple steps to customize this website for your best friend.

---

## Step 1: Update Your Friend's Name & Countdown Date

Open `/src/data/memories.ts`:
1. Change the names and countdown target date if desired.
2. Edit the caption lists in `APP_CONFIG.captionPools.poolA` and `poolB`.

---

## Step 2: Add Your Personal Photos

1. Copy your favorite photos into the `/public/memories` folder.
2. Open `/src/data/memories.ts`.
3. Add the filenames to `GLOBAL_PHOTO_POOL`:
   ```typescript
   export const GLOBAL_PHOTO_POOL: string[] = [
     '/memories/photo1.jpg',
     '/memories/photo2.jpg',
     '/memories/photo3.jpg',
   ];
   ```

---

## Step 3: Edit Your Personal Video Messages & Security Questions

Open `/src/components/VideoMessage/VideoMessageScene.tsx`:
1. Search for `securityQuestion` to update the question asked before unlocking your video.
2. Search for `correctAnswer` to set the secret keyword.
3. Replace the placeholder video URL with your own `.mp4` link or local file path in `/public/videos/video.mp4`.

---

## 🔒 Files You Should NOT Edit (Unless Experienced)

- `/src/utils/sound.ts` (Audio Synthesizer Engine)
- `/src/utils/memoryPool.ts` (Global Shuffle Algorithm)
- `/src/lib/supabase.ts` (Database Synchronization Layer)
