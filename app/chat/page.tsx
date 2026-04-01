"use client";
import React from "react";
import ChatWindow from "../../components/ChatWindow";
import SessionTimer from "../../components/SessionTimer";

export default function ChatPage() {
  const handleSessionExpire = () => {
    alert("Sessão encerrada!");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 p-4">
      <div className="max-w-6xl mx-auto h-[calc(100vh-2rem)]">
        <div className="mb-4">
          <SessionTimer max={30} onExpire={handleSessionExpire} />
        </div>
        <ChatWindow />
      </div>
    </div>
  );
}