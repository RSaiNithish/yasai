'use client';

import { useState, useEffect } from 'react';
import { Chapter } from '@/types';

interface ChapterEditorProps {
  chapter: Chapter | null;
  onSave: (chapter: Chapter) => void;
  onCancel: () => void;
}

export default function ChapterEditor({ chapter, onSave, onCancel }: ChapterEditorProps) {
  const [formData, setFormData] = useState<Partial<Chapter>>({
    id: '',
    title: '',
    date: '',
    text: '',
    photos: [],
    interactionType: 'none',
    layoutHint: 'centered',
  });

  useEffect(() => {
    if (chapter) {
      setFormData(chapter);
    } else {
      setFormData({
        id: '',
        title: '',
        date: new Date().toISOString(),
        text: '',
        photos: [],
        interactionType: 'none',
        layoutHint: 'centered',
      });
    }
  }, [chapter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id && formData.title && formData.date && formData.text) {
      onSave(formData as Chapter);
    }
  };

  const addPhoto = () => {
    setFormData({
      ...formData,
      photos: [...(formData.photos || []), ''],
    });
  };

  const updatePhoto = (index: number, value: string) => {
    const photos = [...(formData.photos || [])];
    photos[index] = value;
    setFormData({ ...formData, photos });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-warm-gray-800 mb-4">
        {chapter ? 'Edit Chapter' : 'New Chapter'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-warm-gray-700 mb-2">
          ID
        </label>
        <input
          type="text"
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
          className="w-full px-4 py-2 border border-warm-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-warm-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-warm-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-warm-gray-700 mb-2">
          Date
        </label>
        <input
          type="datetime-local"
          value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ''}
          onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value).toISOString() })}
          className="w-full px-4 py-2 border border-warm-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-warm-gray-700 mb-2">
          Text (Anecdote)
        </label>
        <textarea
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-warm-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-warm-gray-700 mb-2">
          Interaction Type
        </label>
        <select
          value={formData.interactionType}
          onChange={(e) => setFormData({ ...formData, interactionType: e.target.value as any })}
          className="w-full px-4 py-2 border border-warm-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
        >
          <option value="none">None</option>
          <option value="flip">Flip Card</option>
          <option value="slider">Then/Now Slider</option>
          <option value="quiz">Quiz</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-warm-gray-700 mb-2">
          Layout Hint
        </label>
        <select
          value={formData.layoutHint}
          onChange={(e) => setFormData({ ...formData, layoutHint: e.target.value as any })}
          className="w-full px-4 py-2 border border-warm-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
        >
          <option value="centered">Centered</option>
          <option value="full-bleed">Full Bleed</option>
          <option value="two-column-left">Two Column Left</option>
          <option value="two-column-right">Two Column Right</option>
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-warm-gray-700">
            Photos
          </label>
          <button
            type="button"
            onClick={addPhoto}
            className="px-3 py-1 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
          >
            Add Photo
          </button>
        </div>
        <div className="space-y-2">
          {(formData.photos || []).map((photo, index) => (
            <input
              key={index}
              type="text"
              value={photo}
              onChange={(e) => updatePhoto(index, e.target.value)}
              placeholder="Photo URL"
              className="w-full px-4 py-2 border border-warm-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-warm-gray-200 text-warm-gray-800 font-semibold rounded-lg hover:bg-warm-gray-300 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
