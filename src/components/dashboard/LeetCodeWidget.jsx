import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  CheckCircle2, 
  Flame, 
  ArrowRight, 
  ExternalLink,
  Trophy
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LEETCODE_STATUSES } from '../../constants/leetcodeProblems';

export default function LeetCodeWidget() {
  const { leetCodeProblems, updateProblemStatus } = useApp();

  const total = leetCodeProblems.length;
  const solved = leetCodeProblems.filter(p => p.status === LEETCODE_STATUSES.SOLVED).length;
  const working = leetCodeProblems.filter(p => p.status === LEETCODE_STATUSES.WORKING);
  const percent = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
              LeetCode & Assessment Readiness
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                {solved}/{total} Solved
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Practice high-yield algorithms for internship coding rounds
            </p>
          </div>
        </div>

        <Link
          to="/practice"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <span>Open Prep</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Target Algorithms Mastered</span>
          </span>
          <span className="font-mono font-bold text-emerald-400">{percent}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Currently Working On Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Currently In Progress ({working.length})</span>
          </span>
          {working.length === 0 && (
            <span className="text-[11px] text-slate-500">Pick a problem to start!</span>
          )}
        </div>

        {working.length > 0 ? (
          <div className="space-y-2">
            {working.slice(0, 3).map((problem) => (
              <div
                key={problem.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${
                    problem.difficulty === 'Easy'
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                      : problem.difficulty === 'Medium'
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                  }`}>
                    {problem.difficulty}
                  </span>
                  <a
                    href={problem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-slate-200 hover:text-indigo-400 truncate flex items-center gap-1"
                  >
                    <span>{problem.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => updateProblemStatus(problem.id, LEETCODE_STATUSES.SOLVED)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-[11px] font-semibold rounded-lg border border-emerald-500/30 transition-all shrink-0"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Mark Solved</span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-center">
            <p className="text-xs text-slate-400">
              No problem marked as in progress. Jump into{' '}
              <Link to="/practice" className="text-indigo-400 hover:underline font-semibold">
                Two Sum, 3Sum, or Binary Search
              </Link>{' '}
              to start practicing!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
