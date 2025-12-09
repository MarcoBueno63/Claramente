"use client";
import { memo } from 'react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
  guidance?: string;
  technique?: string;
  intervention?: string;
}

interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

const MessageList = memo(function MessageList({ messages, loading }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[80%] p-4 rounded-2xl shadow-lg ${
              message.isUser
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white'
                : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
            }`}
          >
            <p className="whitespace-pre-wrap font-medium leading-relaxed">{message.content}</p>
            
            {/* Exibir orientação terapêutica se disponível */}
            {message.guidance && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400 text-blue-900 dark:text-blue-100 text-sm rounded-r-lg">
                <strong>💡 Orientação:</strong> {message.guidance}
              </div>
            )}
            
            {/* Exibir técnica aplicada se disponível */}
            {message.technique && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 dark:border-green-400 text-green-900 dark:text-green-100 text-sm rounded-r-lg">
                <strong>🔧 Técnica:</strong> {message.technique}
              </div>
            )}
            
            {/* Exibir intervenção se disponível */}
            {message.intervention && (
              <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/30 border-l-4 border-purple-500 dark:border-purple-400 text-purple-900 dark:text-purple-100 text-sm rounded-r-lg">
                <strong>⚡ Intervenção:</strong> {message.intervention}
              </div>
            )}
            
            {/* Exibir sugestões se disponíveis */}
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Sugestões:</p>
                {message.suggestions.map((suggestion, index) => (
                  <div key={index} className="text-sm bg-yellow-50 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 p-2 rounded-lg border border-yellow-200 dark:border-yellow-700 font-medium">
                    • {suggestion}
                  </div>
                ))}
              </div>
            )}
            
            <p className={`text-xs mt-2 ${message.isUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
      
      {loading && (
        <div className="flex justify-start">
          <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 p-4 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-3 border-purple-500 border-t-transparent"></div>
              <span className="font-medium">ClaraMente está pensando...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default MessageList;