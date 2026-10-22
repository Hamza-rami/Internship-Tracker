import React from 'react';
import { MILESTONES } from '../../constants/statuses';
import { useApp } from '../../context/AppContext';
import { Award, Check, Lock } from 'lucide-react';

export default function MilestonesCard() {
  const { stats, triggerCelebration } = useApp();
  const currentCount = stats.totalSubmitted;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">
              Career Search Milestones
            </h3>
            <p className="text-xs text-slate-400">
              Celebrate your perseverance at each benchmark
            </p>
          </div>
        </div>
        <span className="text-xs font-mono font-semibold text-indigo-400">
          {currentCount} submitted total
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {MILESTONES.map((m) => {
          const isUnlocked = currentCount >= m.count;
          const progress = Math.min(100, Math.round((currentCount / m.count) * 100));

          return (
            <div
              key={m.count}
              onClick={() => {
                if (isUnlocked) {
                  triggerCelebration(
                    `Milestone Reached: ${m.title}! 🏆`,
                    `You have completed ${m.count} submitted applications! Great job maintaining momentum!`,
                    `${m.count} Apps`
                  );
                }
              }}
              className={`p-3 rounded-xl border flex flex-col justify-between transition-all ${
                isUnlocked
                  ? 'bg-indigo-950/30 border-indigo-500/40 text-slate-100 cursor-pointer hover:border-indigo-400 hover:shadow-md'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-base font-bold font-mono ${isUnlocked ? 'text-indigo-400' : 'text-slate-500'}`}>
                    {m.count}
                  </span>
                  {isUnlocked ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                      <Check className="w-3 h-3" />
                    </span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>
                <div className="text-xs font-semibold truncate text-slate-200">
                  {m.title}
                </div>
              </div>

              <div className="mt-3">
                <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isUnlocked ? 'bg-emerald-500' : 'bg-indigo-500/50'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 font-mono mt-1 block text-right">
                  {isUnlocked ? 'Unlocked' : `${progress}%`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
