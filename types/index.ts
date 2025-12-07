export interface Chapter {
  id: string;
  title: string;
  date: string; // ISO string
  text: string; // Anecdote
  photos: string[]; // URLs
  audioClipUrl?: string;
  interactionType: 'flip' | 'slider' | 'quiz' | 'none';
  quiz?: {
    question: string;
    options: string[];
    answerIndex: number;
  };
  place?: string;
  layoutHint: 'full-bleed' | 'two-column-left' | 'two-column-right' | 'centered';
}

export interface Message {
  id: string;
  author: string;
  relation: string;
  text: string;
  chapterId?: string;
  avatarUrl?: string;
  date: string; // ISO
  curated: boolean;
}

export interface Video {
  id: string;
  author: string;
  thumbnail: string; // URL
  videoUrl: string; // URL
  durationSec: number;
  date: string; // ISO
  transcript?: string;
}

export interface Audio {
  id: string;
  author: string;
  audioUrl: string; // URL
  durationSec?: number;
  date: string; // ISO
  transcript?: string;
}
