# Content & Text Customization Guide

This guide details how to customize all text, captions, questions, memory pools, and titles in the application.

---

## 1. Modifying Memory Photos & Photo Pools

All global photo URLs are configured in `/src/data/memories.ts`.

To add, edit, or remove photos:
1. Open `/src/data/memories.ts`.
2. Locate the array `GLOBAL_PHOTO_POOL`:
   ```typescript
   export const GLOBAL_PHOTO_POOL: string[] = [
     'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
     'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
     // Add your custom image URLs here or local assets placed in /public
   ];
   ```
3. To use local photos, place your photos in the `/public` folder (e.g., `/public/memories/photo1.jpg`) and add `'/memories/photo1.jpg'` to `GLOBAL_PHOTO_POOL`.

---

## 2. Modifying Memory Captions & Pools

Captions for both the **Memory Vault** and **Bubble Memories** are stored in two independent shuffle pools inside `/src/data/memories.ts`:

```typescript
export const APP_CONFIG: AppConfig = {
  // ...
  captionPools: {
    // Pool A: Captions used in Scene 02 (Memory Vault Envelopes)
    poolA: [
      'Talking about life, dreams, and everything in between until the sun came up.',
      'No destination, endless laughter, and a playlist that defined our summer.',
      'Moments where one look was enough to make both of us burst into tears of joy.',
      // Add or edit captions here...
    ],
    // Pool B: Messages revealed when popping bubbles in Scene 03
    poolB: [
      'Laughter that made our stomachs hurt.',
      'Late night talks under the stars.',
      'Best friends forever, no matter the distance.',
      // Add or edit messages here...
    ],
  },
};
```

---

## 3. Editing Titles, Subtitles & Button Labels

All main scene configuration parameters, countdown dates, and titles are located in `/src/data/memories.ts` or directly within the respective scene components under `/src/components/`.

- **Opening Scene Title**: `/src/components/Scene1Intro/Scene1Container.tsx`
- **Video Security Questions**: `/src/components/VideoMessage/VideoMessageScene.tsx`
- **Friendship Promise Text**: `/src/components/Scene10Promise/FriendshipPromiseScene.tsx`
- **Award Certificates**: `/src/components/Certificate/FriendshipCertificateScene.tsx`
- **Two Love / Loyalty Questions**: `/src/components/Scene11TwoQuestions/TwoQuestionsScene.tsx`
- **Timeline Chapter Labels**: `/src/components/common/JourneyTimeline.tsx`
