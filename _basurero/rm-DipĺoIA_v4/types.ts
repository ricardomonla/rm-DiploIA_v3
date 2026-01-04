
export interface Annotation {
  id: string;
  timestamp: number;
  label: string;
  description?: string;
}

export interface Class {
  id: string;
  title: string;
  url: string;
  videoId: string;
  annotations: Annotation[];
}

export interface Course {
  id: string;
  title: string;
  classes: Class[];
}

export enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5
}
