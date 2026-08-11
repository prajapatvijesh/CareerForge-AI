import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { careerAssistantApi, AssistantMessage } from '../api/careerAssistant.api';
import { ConversationSidebar } from '../components/ConversationSidebar';
import { CareerContextCard } from '../components/CareerContextCard';
import { ChatInput } from '../components/ChatInput';
import { UserMessage } from '../components/UserMessage';
import { AssistantMessage as AssistantMessageBubble } from '../components/AssistantMessage';
import { TypingIndicator } from '../components/TypingIndicator';
import { LimitReachedCard } from '../components/LimitReachedCard';
import { Bot, MessageSquarePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CareerAssistantPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [contextSnapshot, setContextSnapshot] = useState<any>(null);
  const [isLimitReached, setIsLimitReached] = useState(false);

  const { data: conversation, isLoading: isLoadingConv } = useQuery({
    queryKey: ['career-assistant-conversation', id],
    queryFn: () => careerAssistantApi.getConversationDetails(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (conversation) {
      setMessages(conversation.messages);
      setContextSnapshot(conversation.contextSnapshot);
    } else if (!id) {
      setMessages([]);
      setContextSnapshot(null);
    }
  }, [conversation, id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: (message: string) => careerAssistantApi.chat({ message, conversationId: id }),
    onSuccess: (data, variables) => {
      // Add the assistant's response to the local state
      setMessages((prev) => [
        ...prev,
        {
          role: 'ASSISTANT',
          content: data.answer,
          recommendations: data.recommendations,
          nextActions: data.nextActions,
          createdAt: new Date().toISOString()
        }
      ]);
      
      if (!id && data.conversationId) {
        queryClient.invalidateQueries({ queryKey: ['career-assistant-conversations'] });
        navigate(`/assistant/${data.conversationId}`, { replace: true });
      }
    },
    onError: (error: any) => {
      if (error.response?.status === 429) {
        setIsLimitReached(true);
        // Remove the optimistically added user message
        setMessages((prev) => prev.slice(0, -1));
      }
    }
  });

  const handleSendMessage = (content: string) => {
    if (!content.trim() || chatMutation.isPending) return;
    
    // Optimistically add user message
    setMessages((prev) => [
      ...prev,
      {
        role: 'USER',
        content,
        createdAt: new Date().toISOString()
      }
    ]);
    
    chatMutation.mutate(content);
  };

  const startNewChat = () => {
    navigate('/assistant');
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <ConversationSidebar currentId={id} onNewChat={startNewChat} />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b bg-white dark:bg-gray-800 flex items-center px-4 md:px-6 justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <h1 className="font-semibold text-gray-900 dark:text-white">CareerForge AI Assistant</h1>
          </div>
          <Button variant="outline" size="sm" onClick={startNewChat} className="md:hidden">
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </header>

        {/* Messages / Context Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6 scroll-smooth">
          {(!id && messages.length === 0) ? (
            <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">How can I help your career today?</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
                I can analyze your profile, suggest resume improvements, prepare you for interviews, or recommend skills to learn.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                {[
                  "What should I improve first?",
                  "Why am I not getting interviews?",
                  "What skills should I learn next?",
                  "How can I improve my resume?"
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="p-4 text-left rounded-xl border bg-white dark:bg-gray-800 hover:border-blue-500 hover:shadow-sm transition-all"
                  >
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
              {/* Context Card (if available) */}
              {contextSnapshot && (
                <CareerContextCard context={contextSnapshot} />
              )}
              
              {messages.map((msg, idx) => (
                msg.role === 'USER' ? (
                  <UserMessage key={idx} content={msg.content} />
                ) : (
                  <AssistantMessageBubble 
                    key={idx} 
                    content={msg.content} 
                    recommendations={msg.recommendations} 
                    nextActions={msg.nextActions} 
                  />
                )
              ))}

              {chatMutation.isPending && <TypingIndicator />}
              
              {isLimitReached && <LimitReachedCard />}

              {chatMutation.isError && !isLimitReached && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl text-center text-sm">
                  Something went wrong. Please try again.
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-white dark:bg-gray-800 border-t">
          <div className="max-w-4xl mx-auto w-full">
            <ChatInput 
              onSend={handleSendMessage} 
              disabled={chatMutation.isPending || isLimitReached || isLoadingConv} 
            />
            <p className="text-center text-xs text-gray-400 mt-3">
              AI can make mistakes. Consider verifying important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
