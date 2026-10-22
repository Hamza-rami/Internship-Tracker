import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  RotateCcw, 
  Sparkles, 
  Quote, 
  Shuffle, 
  CheckSquare 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MOTIVATIONAL_QUOTES } from '../../constants/quotes';

export default function DailyActionPanel() {
  const { dailyTasks, toggleChecklistItem, resetDailyChecklist } = useApp();
  const [quoteIndex, setQuoteIndex] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));

  const items = dailyTasks.items || [];
  const completedCount = items.filter(i => i.completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Daily Checklist Column (2 cols) */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                  Daily Job Search Checklist
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {dailyTasks.date}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Resets every morning to keep your daily routine razor-sharp
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-semibold text-indigo-400">
                {completedCount}/{totalCount} ({progressPercent}%)
              </span>
              <button
                type="button"
                onClick={resetDailyChecklist}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title="Reset daily checklist"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden mb-4 border border-slate-800">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Checklist items */}
          <div className="space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleChecklistItem(item.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 text-xs leading-relaxed ${
                  item.completed
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200 line-through opacity-85'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                {item.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                )}
                <span>{item.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Motivational Quote Column (1 col) */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-900/30 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Daily Motivation
            </span>
            <button
              type="button"
              onClick={handleNextQuote}
              className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-indigo-950/50 rounded-lg transition-colors"
              title="Next quote"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative py-2">
            <Quote className="w-8 h-8 text-indigo-500/20 absolute -top-1 -left-1" />
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic pl-3 relative z-10">
              "{currentQuote.quote}"
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span className="text-[11px] font-mono text-indigo-400/90 font-medium">
            — {currentQuote.author}
          </span>
          <span className="text-[10px] text-slate-500">
            {quoteIndex + 1} of {MOTIVATIONAL_QUOTES.length}
          </span>
        </div>
      </div>
    </div>
  );
}
