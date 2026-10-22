import React, { useState, useRef, useEffect } from 'react';
import { APPLICATION_STATUSES, STATUS_CONFIG } from '../../constants/statuses';
import { ChevronDown } from 'lucide-react';

export default function StatusBadge({ status, onStatusChange, interactive = false, size = 'sm' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const config = STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    color: 'text-slate-400 bg-slate-800/50 border-slate-700',
    dotColor: 'bg-slate-400',
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const sizeClasses = size === 'xs' 
    ? 'text-xs px-2 py-0.5' 
    : size === 'lg' 
    ? 'text-sm px-3.5 py-1.5' 
    : 'text-xs px-2.5 py-1';

  if (!interactive || !onStatusChange) {
    return (
      <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.color} ${sizeClasses}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
        {config.label}
      </span>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-all hover:ring-2 hover:ring-indigo-500/20 active:scale-95 ${config.color} ${sizeClasses} cursor-pointer`}
        title="Click to update status"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
        <span>{config.label}</span>
        <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
      </button>

      {isOpen && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 mt-1.5 left-0 w-52 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl py-1 focus:outline-none backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            Change Status
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {Object.values(APPLICATION_STATUSES).map((st) => {
              const itemConfig = STATUS_CONFIG[st];
              const isSelected = st === status;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    onStatusChange(st);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                    isSelected 
                      ? 'bg-indigo-600/20 text-indigo-300 font-semibold' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${itemConfig.dotColor}`} />
                    {itemConfig.label}
                  </span>
                  {isSelected && <span className="text-indigo-400 text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
