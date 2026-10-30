import React, { useState, useMemo } from 'react';
import { 
  Code2, 
  CheckCircle2, 
  Flame, 
  Circle, 
  ExternalLink, 
  Plus, 
  Search, 
  Sparkles, 
  RotateCcw, 
  BookOpen, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Filter, 
  Trophy, 
  Tag, 
  Clock, 
  Building2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  LEETCODE_STATUSES, 
  LEETCODE_STATUS_CONFIG, 
  DIFFICULTY_CONFIG, 
  LEETCODE_CATEGORIES 
} from '../constants/leetcodeProblems';
import Modal from '../components/common/Modal';

export default function LeetCodePracticePage() {
  const { 
    leetCodeProblems, 
    updateProblemStatus, 
    addLeetCodeProblem, 
    updateLeetCodeProblem, 
    deleteLeetCodeProblem, 
    resetLeetCodeProblems 
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');

  // New problem form state
  const [newProblem, setNewProblem] = useState({
    title: '',
    number: '',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    url: '',
    companies: '',
    notes: '',
    status: 'todo',
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const total = leetCodeProblems.length;
    const solved = leetCodeProblems.filter(p => p.status === LEETCODE_STATUSES.SOLVED).length;
    const working = leetCodeProblems.filter(p => p.status === LEETCODE_STATUSES.WORKING).length;
    const todo = leetCodeProblems.filter(p => p.status === LEETCODE_STATUSES.TODO).length;

    const easyTotal = leetCodeProblems.filter(p => p.difficulty === 'Easy').length;
    const easySolved = leetCodeProblems.filter(p => p.difficulty === 'Easy' && p.status === LEETCODE_STATUSES.SOLVED).length;

    const mediumTotal = leetCodeProblems.filter(p => p.difficulty === 'Medium').length;
    const mediumSolved = leetCodeProblems.filter(p => p.difficulty === 'Medium' && p.status === LEETCODE_STATUSES.SOLVED).length;

    const hardTotal = leetCodeProblems.filter(p => p.difficulty === 'Hard').length;
    const hardSolved = leetCodeProblems.filter(p => p.difficulty === 'Hard' && p.status === LEETCODE_STATUSES.SOLVED).length;

    const percent = total > 0 ? Math.round((solved / total) * 100) : 0;

    return {
      total,
      solved,
      working,
      todo,
      easyTotal,
      easySolved,
      mediumTotal,
      mediumSolved,
      hardTotal,
      hardSolved,
      percent,
    };
  }, [leetCodeProblems]);

  // Filter problems
  const filteredProblems = useMemo(() => {
    return leetCodeProblems.filter(problem => {
      // Search
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchesTitle = problem.title.toLowerCase().includes(q);
        const matchesCategory = problem.category.toLowerCase().includes(q);
        const matchesNumber = problem.number && String(problem.number).includes(q);
        const matchesCompany = problem.companies && problem.companies.some(c => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCategory && !matchesNumber && !matchesCompany) {
          return false;
        }
      }

      // Status
      if (selectedStatus !== 'ALL' && problem.status !== selectedStatus) {
        return false;
      }

      // Difficulty
      if (selectedDifficulty !== 'ALL' && problem.difficulty !== selectedDifficulty) {
        return false;
      }

      // Category
      if (selectedCategory !== 'ALL' && problem.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [leetCodeProblems, search, selectedStatus, selectedDifficulty, selectedCategory]);

  const handleStartEditNotes = (problem) => {
    setEditingNotesId(problem.id);
    setNotesDraft(problem.notes || '');
  };

  const handleSaveNotes = (problemId) => {
    updateLeetCodeProblem(problemId, { notes: notesDraft });
    setEditingNotesId(null);
  };

  const handleCreateProblem = (e) => {
    e.preventDefault();
    if (!newProblem.title.trim()) return;

    addLeetCodeProblem(newProblem);
    setIsAddModalOpen(false);
    setNewProblem({
      title: '',
      number: '',
      difficulty: 'Easy',
      category: 'Arrays & Hashing',
      url: '',
      companies: '',
      notes: '',
      status: 'todo',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Technical Assessment Readiness
            </span>
            <span className="text-xs text-slate-400">• HackerRank, CodeSignal & LeetCode Prep</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <Code2 className="w-6 h-6 text-indigo-400" />
            <span>Internship Coding Assessment Tracker</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-0.5">
            Track and master essential LeetCode algorithms for internship interviews and online technical assessments. Mark problems as <strong className="text-emerald-400">Solved</strong> or <strong className="text-amber-400">Working On It</strong> with a single click.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={resetLeetCodeProblems}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition-colors"
            title="Reset to default curated problems"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Problem</span>
          </button>
        </div>
      </div>

      {/* Progress & Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Overall Completion Card */}
        <div className="col-span-2 sm:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Overall Progress</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-100">{stats.solved}</span>
              <span className="text-xs text-slate-400 font-mono">/ {stats.total} solved</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${stats.percent}%` }}
              />
            </div>
            <span className="text-[11px] font-mono font-semibold text-emerald-400 mt-1 block">
              {stats.percent}% Completed
            </span>
          </div>
        </div>

        {/* Easy Solved */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-400">Easy</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-slate-100">{stats.easySolved}</span>
            <span className="text-xs text-slate-400 font-mono ml-1.5">/ {stats.easyTotal}</span>
            <p className="text-[11px] text-slate-500 mt-1">Foundation algorithms</p>
          </div>
        </div>

        {/* Medium Solved */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-400">Medium</span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-slate-100">{stats.mediumSolved}</span>
            <span className="text-xs text-slate-400 font-mono ml-1.5">/ {stats.mediumTotal}</span>
            <p className="text-[11px] text-slate-500 mt-1">Top OA assessment sweet spot</p>
          </div>
        </div>

        {/* Hard Solved */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-400">Hard</span>
            <span className="w-2 h-2 rounded-full bg-rose-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-slate-100">{stats.hardSolved}</span>
            <span className="text-xs text-slate-400 font-mono ml-1.5">/ {stats.hardTotal}</span>
            <p className="text-[11px] text-slate-500 mt-1">Advanced interview challenges</p>
          </div>
        </div>

        {/* Working on it count */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-400">In Progress</span>
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-amber-400">{stats.working}</span>
            <span className="text-xs text-slate-400 ml-1.5">active</span>
            <p className="text-[11px] text-slate-500 mt-1">Currently solving right now</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problem title, #number, category, or company (e.g. 'Two Sum', 'Amazon', 'binary')..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 max-w-[180px]"
            >
              <option value="ALL">All Categories</option>
              {LEETCODE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-medium text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>

          <button
            type="button"
            onClick={() => setSelectedStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedStatus === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All ({stats.total})
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus(LEETCODE_STATUSES.SOLVED)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedStatus === LEETCODE_STATUSES.SOLVED
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-950 text-emerald-400/80 hover:text-emerald-300 border border-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Solved ({stats.solved})
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus(LEETCODE_STATUSES.WORKING)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedStatus === LEETCODE_STATUSES.WORKING
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-950 text-amber-400/80 hover:text-amber-300 border border-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Working On It ({stats.working})
          </button>

          <button
            type="button"
            onClick={() => setSelectedStatus(LEETCODE_STATUSES.TODO)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedStatus === LEETCODE_STATUSES.TODO
                ? 'bg-slate-700 text-white shadow-sm'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Circle className="w-3.5 h-3.5" />
            Todo ({stats.todo})
          </button>

          <span className="text-xs text-slate-500 ml-auto font-mono">
            Showing {filteredProblems.length} of {leetCodeProblems.length}
          </span>
        </div>
      </div>

      {/* Problems List */}
      <div className="space-y-3">
        {filteredProblems.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <Code2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-200">No problems found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              No LeetCode problems match your current search or filter combination.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedStatus('ALL');
                setSelectedDifficulty('ALL');
                setSelectedCategory('ALL');
              }}
              className="mt-4 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredProblems.map((problem) => {
            const isSolved = problem.status === LEETCODE_STATUSES.SOLVED;
            const isWorking = problem.status === LEETCODE_STATUSES.WORKING;
            const isTodo = problem.status === LEETCODE_STATUSES.TODO;
            const diffConfig = DIFFICULTY_CONFIG[problem.difficulty] || DIFFICULTY_CONFIG.Medium;
            const statusConfig = LEETCODE_STATUS_CONFIG[problem.status] || LEETCODE_STATUS_CONFIG.todo;
            const isEditingThisNotes = editingNotesId === problem.id;

            return (
              <div
                key={problem.id}
                className={`group bg-slate-900 rounded-2xl border transition-all duration-200 p-4 sm:p-5 ${
                  isSolved
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : isWorking
                    ? 'border-amber-500/40 bg-amber-950/10 shadow-sm shadow-amber-500/5'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Problem Details */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="mt-1">
                      {isSolved ? (
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      ) : isWorking ? (
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 animate-pulse">
                          <Flame className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-500 flex items-center justify-center border border-slate-700">
                          <Code2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        {problem.number && (
                          <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                            #{problem.number}
                          </span>
                        )}

                        <a
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-bold text-slate-100 hover:text-indigo-400 transition-colors flex items-center gap-1.5 group-hover:underline"
                        >
                          <span>{problem.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
                        </a>

                        {/* Difficulty badge */}
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${diffConfig.color}`}>
                          {problem.difficulty}
                        </span>

                        {/* Category badge */}
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-800/60 border border-slate-700/80 px-2 py-0.5 rounded-full">
                          {problem.category}
                        </span>

                        {/* Current Status Badge */}
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${statusConfig.badgeClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Company Tags */}
                      {problem.companies && problem.companies.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="text-[10px] uppercase font-mono text-slate-500 flex items-center gap-1">
                            <Building2 className="w-3 h-3" /> Asked In:
                          </span>
                          {problem.companies.map((company, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/70"
                            >
                              {company}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Notes / Solution Approach */}
                      <div className="mt-2.5">
                        {isEditingThisNotes ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="text"
                              value={notesDraft}
                              onChange={(e) => setNotesDraft(e.target.value)}
                              placeholder="Approach, time/space complexity, edge cases..."
                              className="flex-1 bg-slate-950 border border-indigo-500/50 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSaveNotes(problem.id)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" /> Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingNotesId(null)}
                              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <BookOpen className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="italic">
                              {problem.notes ? problem.notes : 'No approach notes added yet.'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleStartEditNotes(problem)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-slate-300 transition-opacity"
                              title="Edit notes"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Buttons: Solved / Working on it / Todo */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800/80 shrink-0">
                    {/* Mark as Solved Button */}
                    <button
                      type="button"
                      onClick={() => updateProblemStatus(problem.id, LEETCODE_STATUSES.SOLVED)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSolved
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/30'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isSolved ? 'Solved ✓' : 'Mark Solved'}</span>
                    </button>

                    {/* Mark as Working on it Button */}
                    <button
                      type="button"
                      onClick={() => updateProblemStatus(problem.id, LEETCODE_STATUSES.WORKING)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isWorking
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-500/30'
                      }`}
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>{isWorking ? 'Working On It 🔥' : 'Working On It'}</span>
                    </button>

                    {/* Reset to Todo Button */}
                    <button
                      type="button"
                      onClick={() => updateProblemStatus(problem.id, LEETCODE_STATUSES.TODO)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isTodo
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-slate-950 hover:bg-slate-800 text-slate-500 hover:text-slate-300 border border-slate-800'
                      }`}
                      title="Reset status to Todo"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span className="hidden sm:inline">Todo</span>
                    </button>

                    {/* Delete Custom Problem */}
                    {problem.isCustom && (
                      <button
                        type="button"
                        onClick={() => deleteLeetCodeProblem(problem.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Remove custom problem"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Problem Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add LeetCode / Assessment Problem"
        subtitle="Add any custom technical assessment question or LeetCode problem assigned to you"
      >
        <form onSubmit={handleCreateProblem} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Problem Title *
            </label>
            <input
              type="text"
              required
              value={newProblem.title}
              onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
              placeholder="e.g. Two Sum, LRU Cache, Subarray Sum Equals K"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                LeetCode # (Optional)
              </label>
              <input
                type="number"
                value={newProblem.number}
                onChange={(e) => setNewProblem({ ...newProblem, number: e.target.value })}
                placeholder="e.g. 1"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Difficulty
              </label>
              <select
                value={newProblem.difficulty}
                onChange={(e) => setNewProblem({ ...newProblem, difficulty: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Category / Pattern
              </label>
              <select
                value={newProblem.category}
                onChange={(e) => setNewProblem({ ...newProblem, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {LEETCODE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Initial Status
              </label>
              <select
                value={newProblem.status}
                onChange={(e) => setNewProblem({ ...newProblem, status: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="todo">Todo</option>
                <option value="working">Working On It</option>
                <option value="solved">Solved</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              LeetCode / Assessment Link
            </label>
            <input
              type="url"
              value={newProblem.url}
              onChange={(e) => setNewProblem({ ...newProblem, url: e.target.value })}
              placeholder="https://leetcode.com/problems/..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Target Companies / Assessment Name
            </label>
            <input
              type="text"
              value={newProblem.companies}
              onChange={(e) => setNewProblem({ ...newProblem, companies: e.target.value })}
              placeholder="e.g. Amazon OA, Google, OCP Test (comma-separated)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Approach Notes / Key Patterns
            </label>
            <textarea
              rows={2}
              value={newProblem.notes}
              onChange={(e) => setNewProblem({ ...newProblem, notes: e.target.value })}
              placeholder="Key edge cases, hash map approach, O(n) runtime, etc."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
            >
              Add Problem
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
