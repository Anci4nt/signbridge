export interface Landmark {
  x: number;
  y: number;
  z: number;
  /** Visibility/presence, 0–1 (optional, MediaPipe provides this). */
  visibility?: number;
}

/** A single hand's 21 landmarks as returned by MediaPipe. */
export interface HandLandmarks {
  landmarks: Landmark[];
  handedness: 'Left' | 'Right' | 'Unknown';
  score: number;
}

export type SignLabel =
  | 'NONE'
  | 'HELLO'
  | 'YES'
  | 'NO'
  | 'THANK YOU'
  | 'PLEASE'
  | 'HELP'
  | 'STOP'
  | 'WATER'
  | 'FOOD'
  | 'DOCTOR'
  | 'HOME'
  | 'SCHOOL'
  | 'FRIEND'
  | 'SORRY'
  | 'EMERGENCY'
  | 'BAD'
  | 'BOOK'
  | 'CAT'
  | 'DRINK'
  | 'HOT'
  | 'ILY'
  | 'KNOW'
  | 'LEARN'
  | 'ME'
  | 'PHONE'
  | 'SEE'
  | 'WELCOME'
  | 'YOU';

export interface PredictionResult {
  label: SignLabel;
  confidence: number;
  probabilities: number[];
}

export interface SignMeta {
  label: SignLabel;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export type ClassifierStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'error';

export interface HistoryEntry {
  id: string;
  label: SignLabel;
  confidence: number;
  timestamp: number;
}
