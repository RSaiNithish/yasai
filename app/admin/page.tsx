'use client';

import { useState } from 'react';
import { getChapters, getMessages } from '@/lib/data';
import ChapterEditor from '@/components/admin/ChapterEditor';
import MessageManager from '@/components/admin/MessageManager';
import DragDropList from '@/components/admin/DragDropList';
import { Chapter, Message } from '@/types';
import Link from 'next/link';

export default function AdminPage() {
  const [chapters, setChapters] = useState<Chapter[]>(getChapters());
  const [messages, setMessages] = useState<Message[]>(getMessages());
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleSaveChapter = (chapter: Chapter) => {
    if (selectedChapter) {
      // Update existing
      setChapters(chapters.map(c => c.id === chapter.id ? chapter : c));
    } else {
      // Add new
      setChapters([...chapters, chapter]);
    }
    setShowEditor(false);
    setSelectedChapter(null);
  };

  const handleReorder = (newChapters: Chapter[]) => {
    setChapters(newChapters);
  };

  const handleToggleCurated = (id: string, curated: boolean) => {
    setMessages(messages.map(msg => msg.id === id ? { ...msg, curated } : msg));
  };

  const handleNewChapter = () => {
    setSelectedChapter(null);
    setShowEditor(true);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setShowEditor(true);
  };

  return (
    <div className="min-h-screen bg-warm-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-warm-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-warm-gray-800 hover:text-rose-500 transition-colors">
            ← Home
          </Link>
          <h1 className="text-2xl font-bold text-warm-gray-800">Admin Panel</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Chapters List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-warm-gray-800">Chapters</h2>
              <button
                onClick={handleNewChapter}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                + New Chapter
              </button>
            </div>

            <DragDropList
              chapters={chapters}
              onReorder={handleReorder}
              onSelect={handleEditChapter}
              selectedId={selectedChapter?.id}
            />
          </div>

          {/* Right Column - Editor or Message Manager */}
          <div>
            {showEditor ? (
              <ChapterEditor
                chapter={selectedChapter}
                onSave={handleSaveChapter}
                onCancel={() => {
                  setShowEditor(false);
                  setSelectedChapter(null);
                }}
              />
            ) : (
              <MessageManager
                messages={messages}
                onToggleCurated={handleToggleCurated}
              />
            )}
          </div>
        </div>

        {/* File Upload Stub */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-warm-gray-800 mb-4">File Upload (Stub)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-gray-700 mb-2">
                Upload Photos
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="w-full px-4 py-2 border border-warm-gray-300 rounded-lg"
                disabled
              />
              <p className="text-sm text-warm-gray-500 mt-1">File upload functionality is stubbed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-gray-700 mb-2">
                Upload Videos
              </label>
              <input
                type="file"
                accept="video/*"
                multiple
                className="w-full px-4 py-2 border border-warm-gray-300 rounded-lg"
                disabled
              />
              <p className="text-sm text-warm-gray-500 mt-1">File upload functionality is stubbed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
