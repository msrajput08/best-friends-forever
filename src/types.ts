export type ActiveScene =
  | 'SCENE_1'
  | 'SCENE_2'
  | 'SCENE_3'
  | 'SCENE_4'
  | 'SCENE_5'
  | 'SCENE_6'
  | 'SCENE_7'
  | 'SCENE_8'
  | 'SCENE_9'
  | 'SCENE_10'
  | 'SCENE_11'
  | 'SCENE_12'
  | 'SCENE_13';

export interface CertificateRecord {
  id: string;
  sceneId: string;
  friendName: string;
  signatureData: string;
  signedAt: string;
  updatedAt: string;
}

export interface LetterRecord {
  id: string;
  author: string;
  recipient: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface PromiseRecord {
  id: string;
  promiseText: string;
  acceptedAt: string;
  acceptedBy: string;
}

export interface AnswersRecord {
  id: string;
  answer1: 'YES' | 'NO';
  answer2: 'YES' | 'NO';
  createdAt: string;
}

export type Scene1Phase =
  | 'BLACK_SCREEN'
  | 'WALL_REVEAL'
  | 'COUNTDOWN'
  | 'SILENCE_HOLD'
  | 'ENERGY_BURST'
  | 'LETTER_REVEAL'
  | 'TITLE_FORMATION'
  | 'CELEBRATION'
  | 'SCENE1_COMPLETE';

export type Scene2Phase =
  | 'TRANSITION_SPIRAL'
  | 'VAULT_APPEAR'
  | 'AUTH_FORM'
  | 'UNLOCKING_ANIMATION'
  | 'VAULT_DOORS_OPEN'
  | 'ENVELOPES_ARRIVE'
  | 'ENVELOPES_INTERACTIVE'
  | 'SCENE2_ALL_EXPLORED'
  | 'SCENE2_COMPLETE';

export interface MemoryItem {
  id: number;
  title: string;
  dateTag: string;
  imageUrl: string;
  caption: string;
  stampLabel: string;
}

export interface BrickFragment {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  vz: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  color: string;
  opacity: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  decay: number;
  shape?: 'circle' | 'star' | 'confetti';
  rotation?: number;
  vRot?: number;
}

export interface Firework {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  exploded: boolean;
  particles: Particle[];
}

export interface Point2D {
  x: number;
  y: number;
}

export type BubbleContentType = 'NONE' | 'IMAGE' | 'MESSAGE' | 'HEARTS';

export interface BubbleData {
  id: string;
  x: number;
  y: number;
  size: 'small' | 'medium' | 'large';
  pixelSize: number;
  speedY: number;
  speedX: number;
  swayAmplitude: number;
  swayPhase: number;
  contentType: BubbleContentType;
  contentData?: {
    imageUrl?: string;
    message?: string;
  };
}

