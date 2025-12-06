'use client';

import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Chapter } from '@/types';

interface DragDropListProps {
  chapters: Chapter[];
  onReorder: (chapters: Chapter[]) => void;
  onSelect: (chapter: Chapter) => void;
  selectedId?: string;
}

export default function DragDropList({ chapters, onReorder, onSelect, selectedId }: DragDropListProps) {
  return (
    <Reorder.Group
      axis="y"
      values={chapters}
      onReorder={onReorder}
      className="space-y-2"
    >
      {chapters.map((chapter) => (
        <Reorder.Item
          key={chapter.id}
          value={chapter}
          whileDrag={{ scale: 1.05, opacity: 0.8 }}
          className={`p-4 bg-white rounded-lg shadow-md cursor-move border-2 ${
            selectedId === chapter.id ? 'border-rose-500' : 'border-warm-gray-200'
          }`}
          onClick={() => onSelect(chapter)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-warm-gray-800">{chapter.title}</h3>
              <p className="text-sm text-warm-gray-500">{chapter.date}</p>
            </div>
            <svg className="w-5 h-5 text-warm-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
