# Friendship Day Interactive Experience — Project Documentation

Welcome to the **Friendship Day Interactive Experience**, a cinematic, emotional, full-stack web application designed to celebrate lifelong bond and best friendship through interactive memories, living letters, signed certificates, sacred promises, video messages, and an infinite cinematic memory loop.

---

## 🌟 Key Features

1. **Scene 01: The Countdown Wall**
   - Brick wall reveal with real-time countdown timer to Friendship Day.
   - Interactive brick tap effects and cinematic title lighting.

2. **Scene 02: The Memory Vault**
   - Sealed luxury parchment envelopes with wax seals and metallic textures.
   - Intelligent random memory selection from global photo pools.
   - Interactive inspection modal with customized captions.

3. **Scene 03: Floating Bubble Memories**
   - Physics-driven floating bubble particles with canvas rendering.
   - Interactive pop sounds and content discoveries (Photos, Messages, Glowing Hearts).
   - Require 7 meaningful discoveries before unlocking completion.

4. **Scene 04 & 05: Video Message Chambers**
   - Custom cinematic glass video player with interactive security question gates.
   - Auto-fading ambient soundscapes to keep video audio heroic.

5. **Scene 06 & 07: Living Letters**
   - Real-time parchment letter reader and editor.
   - Cloud persistence via Supabase with offline LocalStorage fallback.

6. **Scene 08 & 09: Friendship Award Certificates**
   - Reusable luxury embossed award certificate with foil borders and wax seals.
   - Digital signature pad supporting mouse, touch, and stylus input.
   - Instant PNG download export and cloud persistence.

7. **Scene 10: The Friendship Promise**
   - Luxury handmade paper with golden ink underline interaction.
   - Falling golden hearts, origami folding sequence, and wax seal closure.

7. **Scene 11 & 12: Two Questions & Conditional Result**
   - Floating glowing question cards with soft 3D flips.
   - Three distinct emotional outcomes based on answers (YES/YES, NO/NO, MIXED).

8. **Scene 13: The Finale & Cinematic Memory Loop**
   - Artistic silhouette illustration of best friends holding hands under sunset skies.
   - "Restart Our Journey" memory freeze transforming into a polaroid on a vintage wooden desk.

9. **Journey Timeline**
   - Persistent horizontal memory node navigation bar allowing seamless travel between chapters.

---

## 🛠️ Technology Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: `motion/react` (Framer Motion derivative) & HTML5 Canvas
- **Icons**: `lucide-react`
- **Database**: Supabase Free Tier (Firestore/PostgreSQL compatibility) with LocalStorage fallback
- **Audio Engine**: Web Audio API Sound Synthesizer (`/src/utils/sound.ts`)

---

## 📁 Folder Structure

```
├── docs/                      # Comprehensive Guides
│   ├── README.md              # Project Overview
│   ├── CONTENT_GUIDE.md       # Content & Text Editing Guide
│   ├── SUPABASE_GUIDE.md      # Database & Persistence Guide
│   ├── CONFIG_GUIDE.md        # Global Config Reference
│   ├── ASSET_GUIDE.md         # Image & Media Asset Guide
│   └── CUSTOMIZATION_GUIDE.md # Non-Developer Customization Guide
├── public/                    # Public static assets & media
├── src/
│   ├── components/            # Scene-by-scene UI components
│   ├── data/                  # Configuration & Memory Pools
│   ├── lib/                   # Supabase client configuration
│   ├── types.ts               # Global TypeScript definitions
│   ├── utils/                 # Audio engine & Memory pool algorithms
│   ├── App.tsx                # Main scene coordinator
│   └── index.css              # Custom Tailwind utilities & keyframes
└── package.json
```

---

## 🚀 Local Development & Build

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Local Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Build for Production / GitHub Pages**:
   ```bash
   npm run build
   ```

---

## 🌐 Environment Variables

Ensure `.env.example` contains the following keys:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
If Supabase keys are not provided, the application seamlessly operates using local storage fallback.
