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
            className={`max-w-[80%] p-3 rounded-lg ${
              message.isUser
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            
            {/* Exibir orientação terapêutica se disponível */}
            {message.guidance && (
              <div className="mt-2 p-2 bg-blue-50 border-l-4 border-blue-400 text-blue-800 text-sm">
                <strong>💡 Orientação:</strong> {message.guidance}
              </div>
            )}
            
            {/* Exibir técnica aplicada se disponível */}
            {message.technique && (
              <div className="mt-2 p-2 bg-green-50 border-l-4 border-green-400 text-green-800 text-sm">
                <strong>🔧 Técnica:</strong> {message.technique}
              </div>
            )}
            
            {/* Exibir intervenção se disponível */}
            {message.intervention && (
              <div className="mt-2 p-2 bg-purple-50 border-l-4 border-purple-400 text-purple-800 text-sm">
                <strong>⚡ Intervenção:</strong> {message.intervention}
              </div>
            )}
            
            {/* Exibir sugestões se disponíveis */}
            {message.suggestions && message.suggestions.length > 0 && (
              <div className="mt-2 space-y-1">
                <p className="text-sm font-semibold text-gray-600">Sugestões:</p>
                {message.suggestions.map((suggestion, index) => (
                  <div key={index} className="text-sm bg-yellow-50 p-1 rounded">
                    • {suggestion}
                  </div>
                ))}
              </div>
            )}
            
            <p className="text-xs opacity-70 mt-2">
              {message.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
      
      {loading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              <span>ClaraMente está pensando...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default MessageList;