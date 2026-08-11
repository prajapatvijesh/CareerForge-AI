import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { careerAssistantApi } from '../api/careerAssistant.api';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, MessageSquarePlus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ConversationSidebar = ({ currentId, onNewChat }: { currentId?: string, onNewChat: () => void }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  const { data, isLoading } = useQuery({
    queryKey: ['career-assistant-conversations'],
    queryFn: () => careerAssistantApi.getConversations()
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => careerAssistantApi.deleteConversation(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['career-assistant-conversations'] });
      if (currentId === deletedId) {
        navigate('/assistant');
      }
    }
  });

  return (
    <div className="w-64 border-r bg-white dark:bg-gray-800 hidden md:flex flex-col flex-shrink-0">
      <div className="p-4 border-b">
        <Button onClick={onNewChat} className="w-full justify-start" variant="outline">
          <MessageSquarePlus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2 mt-2">Recent Chats</h3>
        {isLoading ? (
          <div className="text-center text-sm text-gray-400 py-4">Loading...</div>
        ) : data?.conversations.length === 0 ? (
          <div className="text-center text-sm text-gray-400 py-4">No recent chats</div>
        ) : (
          <div className="space-y-1">
            {data?.conversations.map((conv: any) => (
              <div 
                key={conv._id} 
                className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${currentId === conv._id ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}`}
              >
                <Link to={`/assistant/${conv._id}`} className="flex items-center gap-2 flex-1 truncate">
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{conv.title || 'New Conversation'}</span>
                </Link>
                <button 
                  onClick={() => deleteMutation.mutate(conv._id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                  title="Delete chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
