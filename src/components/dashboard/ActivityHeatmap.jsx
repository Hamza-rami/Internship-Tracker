import React, { useState } from 'react';
import { generateHeatmapData, formatDisplayDate } from '../../utils/dateUtils';
import { useApp } from '../../context/AppContext';
import { Calendar } from 'lucide-react';

export default function ActivityHeatmap() {
  const { applications } = useApp();
  const [hoveredDay, setHoveredDay] = useState(null);

  // Generate last 16 weeks of activity (approx. 4 months)
  const days = generateHeatmapData(applications, 16);

  // Color intensities
  const getColorClass = (count) => {
    if (count === 0) return 'bg-slate-950/80 border-slate-800/80';
    if (count === 1) return 'bg-indigo-900/60 border-indigo-700/60 text-indigo-200';
    if (count === 2) return 'bg-indigo-700 border-indigo-600 text-indigo-100';
    if (count === 3) return 'bg-indigo-600 border-indigo-500 text-white';
    return 'bg-indigo-500 border-indigo-400 text-white shadow-sm shadow-indigo-500/30';
  };

  const dayLabels = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">
              Application Activity Heatmap
            </h3>
            <p className="text-xs text-slate-400">
              Consistency over the last 16 weeks (Local Timezone)
            </p>
          </div>
        </div>

        {/* Hover info or prompt */}
        <div className="text-xs font-mono h-5 flex items-center">
          {hoveredDay ? (
            <span className="text-indigo-300 bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-800">
              {hoveredDay.count} application{hoveredDay.count === 1 ? '' : 's'} on {formatDisplayDate(hoveredDay.date)}
            </span>
          ) : (
            <span className="text-slate-500">Hover over a square for details</span>
          )}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-2 min-w-full">
          {/* Day of week labels */}
          <div className="grid grid-rows-7 gap-1.5 text-[10px] text-slate-500 font-mono pr-2 select-none">
            {dayLabels.map((lbl, idx) => (
              <div key={idx} className="h-3.5 flex items-center">
                {lbl}
              </div>
            ))}
          </div>

          {/* Days grid rendered column by column (weeks) */}
          <div className="grid grid-rows-7 grid-flow-col gap-1.5 flex-1">
            {days.map((d) => (
              <div
                key={d.date}
                onMouseEnter={() => setHoveredDay(d)}
                onMouseLeave={() => setHoveredDay(null)}
                className={`w-3.5 h-3.5 rounded-sm border transition-all cursor-pointer hover:scale-125 ${getColorClass(
                  d.count
                )} ${d.isToday ? 'ring-2 ring-amber-400/80 ring-offset-1 ring-offset-slate-900' : ''}`}
                title={`${d.count} apps on ${d.date}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full ring-2 ring-amber-400 ring-offset-1 ring-offset-slate-900 inline-block mr-1"></span>
          <span>Today</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-slate-950 border border-slate-800 inline-block" />
            <span className="w-3 h-3 rounded-sm bg-indigo-900/60 border border-indigo-700/60 inline-block" />
            <span className="w-3 h-3 rounded-sm bg-indigo-700 border border-indigo-600 inline-block" />
            <span className="w-3 h-3 rounded-sm bg-indigo-500 border border-indigo-400 inline-block" />
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
