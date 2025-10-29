import React from "react";
import ChatWindow from "../../components/ChatWindow";
import SessionTimer from "../../components/SessionTimer";

export default function ChatPage() {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded shadow flex flex-col gap-6">
      <SessionTimer max={30} onExpire={() => alert("Sessão encerrada!")} />
      <ChatWindow />
    </div>
  );
}
