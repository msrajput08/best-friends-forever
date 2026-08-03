# Application Configuration Reference

All global application behaviors are configurable via `APP_CONFIG` in `/src/data/memories.ts`.

---

## ⚙️ Configuration Properties

```typescript
export interface AppConfig {
  /** Enable or disable the bottom horizontal Journey Timeline navigation bar */
  enableTimeline: boolean;

  /** If true, visitors can jump to any chapter via the timeline. If false, visitors can only visit reached/unlocked chapters. */
  allowFreeNavigation: boolean;

  /** Number of meaningful bubble reveals required before unlocking Scene 03 completion */
  bubbleCompletionCount: number;

  /** Directory path where memory pool assets reside */
  memoryPoolFolder: string;

  /** Milliseconds for smooth camera transition between timeline scenes */
  transitionSpeed: number;

  /** Independent random shuffle caption pools */
  captionPools: {
    /** Captions assigned to Memory Vault envelopes */
    poolA: string[];
    /** Messages revealed inside floating bubbles */
    poolB: string[];
  };
}
```

---

## 🎨 Default Configuration Matrix

| Config Parameter | Default Value | Description |
| :--- | :--- | :--- |
| `enableTimeline` | `true` | Show horizontal memory nodes at bottom |
| `allowFreeNavigation` | `true` | Unrestricted timeline scene selection |
| `bubbleCompletionCount` | `7` | Required non-empty bubble pops to complete scene |
| `transitionSpeed` | `500` | Smooth transition duration in ms |
