'use client';

import { motion } from 'framer-motion';
import { hoverLift } from '@/lib/animations';

interface MessageFiltersProps {
  relations: string[];
  selectedRelation: string | null;
  onRelationChange: (relation: string | null) => void;
  showCurated: boolean;
  onCuratedToggle: (show: boolean) => void;
  sortBy: 'newest' | 'oldest';
  onSortChange: (sort: 'newest' | 'oldest') => void;
}

export default function MessageFilters({
  relations,
  selectedRelation,
  onRelationChange,
  showCurated,
  onCuratedToggle,
  sortBy,
  onSortChange,
}: MessageFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-white/30"
    >
      <div className="flex flex-wrap gap-6 items-end">
        {/* Relation Filter */}
        <motion.div
          whileHover={hoverLift}
          className="flex-1 min-w-[200px]"
        >
          <label className="block text-sm font-semibold text-neutral-700 mb-3 uppercase tracking-wider">
            Filter by Relation
          </label>
          <motion.select
            whileFocus={{ scale: 1.02 }}
            value={selectedRelation || ''}
            onChange={(e) => onRelationChange(e.target.value || null)}
            className="w-full px-5 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 bg-white/80 backdrop-blur-sm font-medium text-neutral-800 transition-all cursor-pointer"
          >
            <option value="">All Relations</option>
            {relations.map((relation) => (
              <option key={relation} value={relation}>
                {relation}
              </option>
            ))}
          </motion.select>
        </motion.div>

        {/* Curated Toggle */}
        <motion.div
          whileHover={hoverLift}
          className="flex items-center gap-3 bg-white/60 backdrop-blur-sm px-5 py-3 rounded-xl border border-neutral-200 cursor-pointer"
          onClick={() => onCuratedToggle(!showCurated)}
        >
          <motion.input
            type="checkbox"
            id="curated"
            checked={showCurated}
            onChange={(e) => onCuratedToggle(e.target.checked)}
            className="w-5 h-5 text-rose-500 rounded focus:ring-rose-400 cursor-pointer"
          />
          <label htmlFor="curated" className="text-sm font-semibold text-neutral-700 cursor-pointer uppercase tracking-wider">
            Show Curated Only
          </label>
        </motion.div>

        {/* Sort */}
        <motion.div
          whileHover={hoverLift}
          className="flex items-center gap-3"
        >
          <label className="text-sm font-semibold text-neutral-700 uppercase tracking-wider">Sort:</label>
          <motion.select
            whileFocus={{ scale: 1.02 }}
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest')}
            className="px-5 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400/50 focus:border-rose-400 bg-white/80 backdrop-blur-sm font-medium text-neutral-800 transition-all cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </motion.select>
        </motion.div>
      </div>
    </motion.div>
  );
}
