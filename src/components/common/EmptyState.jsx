import React from 'react';
import { Plus, Database, Sparkles, FolderSearch } from 'lucide-react';

export default function EmptyState({
  title = 'No applications tracked yet',
  description = 'Start building your job search momentum by logging your first application or wishlist role.',
  actionLabel = 'Add First Application',
  onAction,
  onLoadSamples,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
        <FolderSearch className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-semibold text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl shadow-sm transition-colors active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {actionLabel}
          </button>
        )}

        {onLoadSamples && (
          <button
            type="button"
            onClick={onLoadSamples}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Load Sample Data
          </button>
        )}
      </div>
    </div>
  );
}
