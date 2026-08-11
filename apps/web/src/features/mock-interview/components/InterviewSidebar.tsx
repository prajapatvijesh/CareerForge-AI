
import { CheckCircle2, ChevronRight } from 'lucide-react';

interface InterviewSidebarProps {
  questions: any[];
  currentIndex: number;
  onSelect: (index: number) => void;
  answers: any[];
}

export const InterviewSidebar: React.FC<InterviewSidebarProps> = ({ questions, currentIndex, onSelect, answers }) => {
  return (
    <aside className="w-full lg:w-72 bg-white dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-slate-900 dark:text-white">Questions</h3>
        <p className="text-xs text-slate-500 mt-1">{answers.length} of {questions.length} answered</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {questions.map((q, idx) => {
          const isActive = currentIndex === idx;
          const isAnswered = answers.some(a => a.questionId === q.id && a.answerText.trim().length > 0);
          
          return (
            <button
              key={q.id}
              onClick={() => onSelect(idx)}
              className={`w-full text-left p-3 rounded-2xl flex items-start gap-3 transition-colors ${
                isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-900/50' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isAnswered ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <div className={`w-4 h-4 rounded-full border-2 ${isActive ? 'border-indigo-500' : 'border-slate-300 dark:border-slate-700'}`} />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className={`text-sm truncate font-medium ${isActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                  Question {idx + 1}
                </p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{q.type}</p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
