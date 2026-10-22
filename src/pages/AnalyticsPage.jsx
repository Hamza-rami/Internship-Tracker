import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  CartesianGrid 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Percent, 
  CheckCircle2, 
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { APPLICATION_METHODS, STATUS_CONFIG } from '../constants/statuses';

export default function AnalyticsPage() {
  const { applications, stats } = useApp();

  // Method performance distribution
  const methodData = APPLICATION_METHODS.map(m => {
    const appsInMethod = applications.filter(a => a.applicationMethod === m);
    const interviews = appsInMethod.filter(a => a.status === 'Interview' || a.interviewDate).length;
    const offers = appsInMethod.filter(a => a.status === 'Offer').length;
    return {
      method: m,
      total: appsInMethod.length,
      interviews,
      offers,
    };
  }).filter(item => item.total > 0);

  // Funnel steps
  const funnelSteps = [
    { label: 'Total Submitted', count: stats.totalSubmitted, color: '#6366f1' },
    { label: 'Responses Received', count: Math.round(stats.totalSubmitted * (stats.responseRate / 100)), color: '#38bdf8' },
    { label: 'Interviews / Assessments', count: stats.interviewsScheduled + stats.technicalAssessments, color: '#22d3ee' },
    { label: 'Offers Received', count: stats.offersReceived, color: '#10b981' },
  ];

  // Work arrangement data
  const arrangementCounts = {};
  applications.forEach(a => {
    const arr = a.workArrangement || 'Other';
    arrangementCounts[arr] = (arrangementCounts[arr] || 0) + 1;
  });

  const arrangementData = Object.entries(arrangementCounts).map(([name, value]) => ({
    name,
    value
  }));

  const arrangementColors = ['#6366f1', '#06b6d4', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
          <span>Search Analytics & Insights</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Measure what works, identify bottlenecks in your recruiting pipeline, and optimize conversion.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <BarChart3 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No data available for analytics</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Once you log applications and update their statuses, detailed conversion funnels and effectiveness metrics will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Top Conversion Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                  Response Rate
                  <span title="Explicit reply (Interview, Tech, Offer, or Rejection) divided by Total Submitted" className="cursor-help">
                    <HelpCircle className="w-3 h-3 text-slate-500" />
                  </span>
                </span>
                <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Percent className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-bold font-mono text-slate-100">
                {stats.responseRate}%
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Percentage of applications that got a response
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">
                  Interview Conversion
                </span>
                <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-bold font-mono text-cyan-400">
                {stats.interviewConversionRate}%
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Applications progressing to interviews
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-400">
                  Offer Conversion
                </span>
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Award className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl font-bold font-mono text-emerald-400">
                {stats.offerConversionRate}%
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Final offers secured from all submitted apps
              </p>
            </div>
          </div>

          {/* Funnel Pipeline Visual */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm text-slate-100 mb-1">
              Application Conversion Funnel
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Track drop-off between initial submission and final offer
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {funnelSteps.map((step, idx) => {
                const base = funnelSteps[0].count || 1;
                const pct = Math.round((step.count / base) * 100);

                return (
                  <div key={idx} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 relative overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 bottom-0 opacity-10"
                      style={{ backgroundColor: step.color, width: `${pct}%` }}
                    />
                    <div className="relative z-10">
                      <span className="text-xs font-medium text-slate-400 block mb-1">
                        {step.label}
                      </span>
                      <div className="text-2xl font-bold font-mono text-slate-100">
                        {step.count}
                      </div>
                      <span className="text-[11px] font-mono font-medium" style={{ color: step.color }}>
                        {idx === 0 ? '100% of funnel' : `${pct}% of total`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Method Comparison & Work Arrangement Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Applications by Method */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-sm text-slate-100 mb-1">
                Effectiveness by Application Method
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Compare which channels yield the highest volume and interviews
              </p>

              {methodData.length === 0 ? (
                <div className="h-56 flex items-center justify-center text-xs text-slate-500">
                  No method data available
                </div>
              ) : (
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={methodData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="method" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                      />
                      <Bar dataKey="total" name="Total Applied" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="interviews" name="Interviews" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Work Arrangements (Remote vs Hybrid vs Onsite) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-sm text-slate-100 mb-1">
                  Work Arrangements Breakdown
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Distribution of Remote, Hybrid, and Onsite targets
                </p>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={arrangementData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {arrangementData.map((entry, index) => (
                          <Cell 
                            key={`arr-${index}`} 
                            fill={arrangementColors[index % arrangementColors.length]} 
                            stroke="#0f172a" 
                            strokeWidth={2} 
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-slate-800 text-xs">
                {arrangementData.map((item, idx) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: arrangementColors[idx % arrangementColors.length] }} 
                    />
                    <span className="text-slate-300">{item.name}:</span>
                    <span className="font-mono font-bold text-slate-100">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
