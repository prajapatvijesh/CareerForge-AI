import React, { useEffect, useRef } from 'react';
import { Mic, Video, Type } from 'lucide-react';


interface AnswerInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({ value, onChange, disabled }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
      
      {/* Toolbar */}
      <div className="bg-slate-50 dark:bg-slate-900/80 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 flex items-center gap-2 text-sm font-semibold cursor-default">
            <Type className="w-4 h-4" /> Text Mode
          </button>
          
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-2" />
          
          <button disabled className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 opacity-50 cursor-not-allowed flex items-center gap-2 text-sm transition-colors" title="Coming soon">
            <Mic className="w-4 h-4" /> <span className="hidden sm:inline">Voice</span>
          </button>
          <button disabled className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 opacity-50 cursor-not-allowed flex items-center gap-2 text-sm transition-colors" title="Coming soon">
            <Video className="w-4 h-4" /> <span className="hidden sm:inline">Video</span>
          </button>
        </div>
        
        <div className="text-xs font-medium text-slate-400">
          {value.length} chars
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="Type your answer here... Using the STAR method (Situation, Task, Action, Result) is highly recommended."
          className="w-full min-h-[200px] bg-transparent border-none outline-none resize-none text-slate-700 dark:text-slate-300 leading-relaxed placeholder:text-slate-400"
          autoFocus
        />
      </div>
    </div>
  );
};
