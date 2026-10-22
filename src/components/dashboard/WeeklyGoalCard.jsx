import React from 'react';
import { Target, Flame, Trophy, CalendarCheck2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function WeeklyGoalCard() {
  const { stats, settings } = useApp();

  const percent = stats.weeklyProgress;
  const isGoalReached = stats.hasReachedWeeklyGoal;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">
              Weekly Application Target
            </h3>
            <p className="text-xs text-slate-400">
              Target: <span className="font-medium text-slate-200">{settings.weeklyGoal} apps</span> / week
            </p>
          </div>
        </div>

        {isGoalReached ? (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" />
            Goal Reached!
          </span>
        ) : (
          <span className="text-xs font-mono font-medium text-slate-400">
            {settings.weeklyGoal - stats.sentThisWeek > 0 
              ? `${settings.weeklyGoal - stats.sentThisWeek} remaining`
              : 'On Track'}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5 mb-5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">
            {stats.sentThisWeek} of {settings.weeklyGoal} submitted
          </span>
          <span className="font-bold text-indigo-400">{percent}%</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isGoalReached 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                : 'bg-gradient-to-r from-indigo-500 to-indigo-400'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Streak & Consistency highlights */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Current Streak</span>
          </div>
          <div className="text-lg font-bold font-mono text-amber-400">
            {stats.currentStreak} <span className="text-xs font-normal text-slate-400">{stats.currentStreak === 1 ? 'day' : 'days'}</span>
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <Trophy className="w-3.5 h-3.5 text-indigo-400" />
            <span>Longest Streak</span>
          </div>
          <div className="text-lg font-bold font-mono text-indigo-400">
            {stats.longestStreak} <span className="text-xs font-normal text-slate-400">{stats.longestStreak === 1 ? 'day' : 'days'}</span>
          </div>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
            <CalendarCheck2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Active Days</span>
          </div>
          <div className="text-lg font-bold font-mono text-emerald-400">
            {stats.activeDaysCount} <span className="text-xs font-normal text-slate-400">days</span>
          </div>
        </div>
      </div>
    </div>
  );
}
