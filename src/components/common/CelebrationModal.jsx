import React from 'react';
import Modal from './Modal';
import { Award, Sparkles, Trophy } from 'lucide-react';

export default function CelebrationModal({ isOpen, onClose, title, message, badge }) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Celebration" maxWidth="max-w-md">
      <div className="text-center py-4 space-y-4">
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/20 to-indigo-500/20 border-2 border-amber-400/50 flex items-center justify-center animate-bounce">
            <Trophy className="w-10 h-10 text-amber-400" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-indigo-400 animate-spin" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
          {badge && (
            <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
              {badge}
            </span>
          )}
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
          {message}
        </p>

        <div className="pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-98"
          >
            Keep Going! 🚀
          </button>
        </div>
      </div>
    </Modal>
  );
}
