import { Chapter, Message, Video, Audio } from '@/types';
import chaptersData from '@/data/chapters.json';
import messagesData from '@/data/messages.json';
import videosData from '@/data/videos.json';
import audioData from '@/data/audio.json';

export function getChapters(): Chapter[] {
  return chaptersData as Chapter[];
}

export function getChapter(id: string): Chapter | undefined {
  return getChapters().find(chapter => chapter.id === id);
}

export function getMessages(filter?: {
  chapterId?: string;
  relation?: string;
  curated?: boolean;
}): Message[] {
  let messages = messagesData as Message[];
  
  if (filter?.chapterId) {
    messages = messages.filter(msg => msg.chapterId === filter.chapterId);
  }
  
  if (filter?.relation) {
    messages = messages.filter(msg => msg.relation === filter.relation);
  }
  
  if (filter?.curated !== undefined) {
    messages = messages.filter(msg => msg.curated === filter.curated);
  }
  
  // Sort by date (newest first)
  return messages.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getMessage(id: string): Message | undefined {
  return getMessages().find(msg => msg.id === id);
}

export function getVideos(): Video[] {
  return videosData as Video[];
}

export function getVideo(id: string): Video | undefined {
  return getVideos().find(video => video.id === id);
}

export function getAudios(): Audio[] {
  return audioData as Audio[];
}

export function getAudio(id: string): Audio | undefined {
  return getAudios().find(audio => audio.id === id);
}

export function getRelations(): string[] {
  const messages = getMessages();
  const relations = new Set(messages.map(msg => msg.relation));
  return Array.from(relations).sort();
}
