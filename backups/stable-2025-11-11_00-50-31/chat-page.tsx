"use client";
import React from "react";
import ChatWindow from "../../components/ChatWindow";
import SessionTimer from "../../components/SessionTimer";

export default function ChatPage() {
  const handleSessionExpire = () => {
    alert("Sessão encerrada!");
  };

  return (
    <div className="w-full h-screen bg-gray-100 dark:bg-gray-800 flex flex-col p-4 gap-4">
      <div className="flex-shrink-0">
        <SessionTimer max={30} onExpire={handleSessionExpire} />
      </div>
      <div className="flex-1 min-h-0 max-w-6xl mx-auto w-full">
        <ChatWindow />
      </div>
    </div>
  );
}