


interface FeedbackPanelProps {
  question: string;
  answer: string;
  score: number;
  feedback: string;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ question, answer, score, feedback }) => {
  return (
    <div className="bg-white dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
      <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">{question}</h3>
      
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl mb-4 border border-slate-100 dark:border-slate-800">
        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{answer || <span className="italic text-slate-400">No answer provided.</span>}</p>
      </div>

      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 shadow-sm ${
          score >= 8 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' :
          score >= 5 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' :
          'bg-rose-100 text-rose-700 dark:bg-rose-900/30'
        }`}>
          {score}/10
        </div>
        <div className="flex-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">AI Feedback</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{feedback}</p>
        </div>
      </div>
    </div>
  );
};
