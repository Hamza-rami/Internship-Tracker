import React from 'react';
import { 
  ShieldCheck, 
  HardDrive, 
  Terminal, 
  Award, 
  Lightbulb, 
  Code2, 
  Database,
  ExternalLink
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Track1337 v1.0
          </span>
          <span className="text-xs text-slate-400">Personal & Offline-First</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
          About Track1337
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
          Crafted specifically for students at <strong>1337</strong> in Morocco (and peer developers worldwide) preparing to launch their tech careers.
          Zero servers, zero analytics, zero paid databases — 100% private to your local computer.
        </p>
      </div>

      {/* Architecture & Privacy Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <HardDrive className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-slate-100">100% Local Storage</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            All your company notes, recruiter contacts, and application records reside strictly inside your browser's <code className="font-mono text-indigo-300">localStorage</code>.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-slate-100">Zero Cloud or Telemetry</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No external database or server can access your data. You don't need an internet connection to run or view your tracker.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
          <h3 className="font-semibold text-sm text-slate-100">JSON Portability</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Easily export full JSON backups in one click. You can move your database to any computer or restore it whenever needed.
          </p>
        </div>
      </div>

      {/* Practical Job Hunting Guide for 1337 Students */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-100">
              Pro-Tips for 1337 Students & Tech Interns
            </h3>
            <p className="text-xs text-slate-400">
              How to maximize your chances when applying in Morocco and for remote teams
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <h4 className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              1. Translate 1337 Projects into Impact
            </h4>
            <p className="text-slate-400 text-[11px]">
              Don't just write "ft_transcendence" or "minishell" on your CV. Highlight the technical architecture:
              <em> "Built real-time multiplayer Pong with WebSockets, Docker microservices, PostgreSQL, and OAuth2 42 Auth"</em>. Recruiters love tangible systems.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <h4 className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              2. Follow Up Proactively
            </h4>
            <p className="text-slate-400 text-[11px]">
              If you haven't received a response after 5 to 7 days, send a polite follow-up message to the hiring manager on LinkedIn. It shows genuine enthusiasm and often pulls your application out of the pile.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <h4 className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              3. Target Moroccan Hubs & Remote
            </h4>
            <p className="text-slate-400 text-[11px]">
              Explore Casablanca (Nearshore & CFC), Rabat (Technopolis), Benguerir (UM6P/1337 ecosystem), as well as French/European remote opportunities hiring Moroccan developers.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <h4 className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5" />
              4. Consistency Beats Volume
            </h4>
            <p className="text-slate-400 text-[11px]">
              Sending 2 tailored, well-researched applications with customized notes every day yields a dramatically higher interview conversion than blast-applying to 50 jobs with an generic resume.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
