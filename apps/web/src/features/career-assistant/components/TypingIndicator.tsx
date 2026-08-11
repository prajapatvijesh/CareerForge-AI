import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <div className="flex gap-4 items-start max-w-[90%]">
      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0 text-blue-600">
        <Bot className="w-5 h-5" />
      </div>
      <div className="bg-white dark:bg-gray-800 border px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5 h-12">
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        <span className="ml-2 text-sm text-gray-500 font-medium">Thinking...</span>
      </div>
    </div>
  );
};
