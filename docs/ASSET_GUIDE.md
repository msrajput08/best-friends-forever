# Asset & Media Management Guide

This guide explains recommended file formats, resolutions, and directory paths for media assets.

---

## 📁 Directory Paths

Place static assets in the `/public` folder:

```
public/
├── memories/        # Place custom photo memories (.jpg, .png, .webp)
├── videos/          # Place video messages (.mp4, .webm)
└── audio/           # Sound tracks or ambient background tracks
```

---

## 📷 Photo Requirements & Recommendations

- **Recommended Formats**: `.webp` (preferred for performance), `.jpg`, `.png`
- **Recommended Resolution**: 1200 x 800 pixels (3:2 aspect ratio) or 1080 x 1080 pixels (1:1 aspect ratio)
- **File Size**: Under 500 KB per photo for instant loading across mobile devices.

---

## 🎥 Video Requirements & Recommendations

- **Recommended Format**: `.mp4` (H.264 codec) or `.webm`
- **Recommended Resolution**: 1080p (1920x1080) or 720p (1280x720)
- **File Size**: Under 25 MB per video message.
- **Audio Codec**: AAC audio.

---

## 🎵 Audio Synthesis

Background sound effects and musical chords are synthesized purely via the Web Audio API (`/src/utils/sound.ts`), eliminating external audio file download dependencies and ensuring instantaneous response times across all mobile and desktop browsers.
