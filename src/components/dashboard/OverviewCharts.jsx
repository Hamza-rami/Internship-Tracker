import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { STATUS_CONFIG, APPLICATION_STATUSES } from '../../constants/statuses';
import { generateTimelineData } from '../../utils/stats';
import { TrendingUp, PieChart as PieIcon } from 'lucide-react';

export default function OverviewCharts({ applications = [], stats }) {
  const timelineData = generateTimelineData(applications);

  // Status Distribution data
  const statusData = Object.entries(stats.statusCounts || {})
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      name: status,
      value: count,
      color: STATUS_CONFIG[status]?.accentColor || '#6366f1'
    }));

  const CustomTimelineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs space-y-1 backdrop-blur-md">
          <p className="font-semibold text-slate-200">{label}</p>
          <p className="text-indigo-400 font-mono">
            New Apps: <span className="font-bold">{payload[0].value}</span>
          </p>
          {payload[1] && (
            <p className="text-slate-400 font-mono">
              Cumulative: <span className="font-bold text-slate-200">{payload[1].value}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900 border border-slate-700/80 p-2.5 rounded-xl shadow-xl text-xs backdrop-blur-md">
          <p className="font-semibold" style={{ color: data.payload.color }}>
            {data.name}
          </p>
          <p className="text-slate-200 font-mono">
            {data.value} application{data.value === 1 ? '' : 's'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Timeline Chart (2 cols) */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100">
                Applications Over Time
              </h3>
              <p className="text-xs text-slate-400">
                Volume and cumulative pace of applications submitted
              </p>
            </div>
          </div>
        </div>

        {timelineData.length < 2 ? (
          <div className="h-64 flex flex-col items-center justify-center text-xs text-slate-500 text-center">
            <p>Log a few applications with dates to visualize your momentum trendline.</p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  allowDecimals={false} 
                />
                <Tooltip content={<CustomTimelineTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="urlColorCount" 
                  name="Applications"
                />
                <Area 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="#38bdf8" 
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  fillOpacity={1} 
                  fill="urlColorCum" 
                  name="Cumulative"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Status Distribution (1 col) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <PieIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-slate-100">
                  Status Breakdown
                </h3>
                <p className="text-xs text-slate-400">
                  Distribution across pipeline stages
                </p>
              </div>
            </div>
          </div>

          {statusData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-xs text-slate-500">
              <p>No statuses to display yet</p>
            </div>
          ) : (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Legend list */}
        {statusData.length > 0 && (
          <div className="grid grid-cols-2 gap-1.5 pt-3 border-t border-slate-800/80 text-[11px] max-h-28 overflow-y-auto">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}:</span>
                <span className="font-mono font-semibold text-slate-100">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
