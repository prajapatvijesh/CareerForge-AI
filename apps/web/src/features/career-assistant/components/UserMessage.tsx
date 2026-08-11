import React from 'react';
import { User } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

export const UserMessage = ({ content }: { content: string }) => {
  const { user } = useAppSelector((state) => state.auth);
  
  return (
    <div className="flex gap-4 items-start self-end max-w-[85%] flex-row-reverse">
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white font-medium text-sm">
        {user?.name?.charAt(0) || <User className="w-4 h-4" />}
      </div>
      <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm shadow-sm whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
};
