import { APP_CONFIG, GLOBAL_PHOTO_POOL } from '../data/memories';
import { MemoryItem } from '../types';

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

class MemoryPoolService {
  private photoDeck: string[] = [];
  private poolADeck: string[] = [];
  private poolBDeck: string[] = [];
  private titleDeck: string[] = [];

  constructor() {
    this.resetSession();
  }

  public resetSession() {
  this.photoDeck = shuffleArray(GLOBAL_PHOTO_POOL);
  this.poolADeck = shuffleArray(APP_CONFIG.captionPools.poolA);
  this.poolBDeck = shuffleArray(APP_CONFIG.captionPools.poolB);
  this.titleDeck = shuffleArray(APP_CONFIG.memoryTitles);
}

  public getNextPhoto(): string {
    if (this.photoDeck.length === 0) {
      this.photoDeck = shuffleArray(GLOBAL_PHOTO_POOL);
    }
    return this.photoDeck.pop() || GLOBAL_PHOTO_POOL[0];
  }

  public getNextVaultCaption(): string {
    if (this.poolADeck.length === 0) {
      this.poolADeck = shuffleArray(APP_CONFIG.captionPools.poolA);
    }
    return this.poolADeck.pop() || APP_CONFIG.captionPools.poolA[0];
  }

  public getNextBubbleCaption(): string {
    if (this.poolBDeck.length === 0) {
      this.poolBDeck = shuffleArray(APP_CONFIG.captionPools.poolB);
    }
    return this.poolBDeck.pop() || APP_CONFIG.captionPools.poolB[0];
  }

  public getNextTitle(): string {
  if (this.titleDeck.length === 0) {
    this.titleDeck = shuffleArray(APP_CONFIG.memoryTitles);
  }

  return this.titleDeck.pop() || APP_CONFIG.memoryTitles[0];
}

  public generateVaultMemories(count: number = 6): MemoryItem[] {
     
    const memories: MemoryItem[] = [];
    for (let i = 0; i < count; i++) {
      memories.push({
        id: i + 1,
        title: this.getNextTitle(),
        dateTag: `CHAPTER 0${i + 1}`,
        imageUrl: this.getNextPhoto(),
        caption: this.getNextVaultCaption(),
        stampLabel: `SEALED MEMORY ${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i] || i + 1}`,
      });
    }

    return memories;
  }
}

export const memoryPoolService = new MemoryPoolService();
