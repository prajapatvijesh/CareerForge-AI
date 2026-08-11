import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ChatInput = ({ onSend, disabled }: { onSend: (message: string) => void, disabled?: boolean }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask for career advice, resume tips, or interview help..."
        disabled={disabled}
        className="w-full bg-gray-100 dark:bg-gray-700/50 border-0 rounded-full px-6 py-4 pr-14 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={!input.trim() || disabled}
        className="absolute right-2 rounded-full w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
};
