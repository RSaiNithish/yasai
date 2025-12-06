'use client';

import { useState } from 'react';
import { Message } from '@/types';
import { formatDateShort } from '@/lib/utils';

interface MessageManagerProps {
  messages: Message[];
  onToggleCurated: (id: string, curated: boolean) => void;
}

export default function MessageManager({ messages, onToggleCurated }: MessageManagerProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-warm-gray-800 mb-4">Messages</h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className="p-4 border border-warm-gray-200 rounded-lg flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-warm-gray-800">{message.author}</span>
                <span className="text-sm text-warm-gray-500">({message.relation})</span>
                {message.curated && (
                  <span className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded">
                    Curated
                  </span>
                )}
              </div>
              <p className="text-sm text-warm-gray-600 line-clamp-2">{message.text}</p>
              <p className="text-xs text-warm-gray-400 mt-1">{formatDateShort(message.date)}</p>
            </div>
            <label className="flex items-center gap-2 ml-4">
              <input
                type="checkbox"
                checked={message.curated}
                onChange={(e) => onToggleCurated(message.id, e.target.checked)}
                className="w-4 h-4 text-rose-500 rounded focus:ring-rose-400"
              />
              <span className="text-sm text-warm-gray-700">Curated</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
