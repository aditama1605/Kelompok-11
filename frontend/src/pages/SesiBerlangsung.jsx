import React, { useState } from "react";
import { Send } from "lucide-react";

const LiveChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hallo dokter...", time: "11:31 AM", sender: "user" },
    { id: 2, text: "Saya ada keluhan dibagian saraf", time: "11:31 AM", sender: "user" },
    { id: 3, text: "Hallo kak, boleh dijelaskan lebih detail?", time: "11:35 AM", sender: "doctor", name: "Dokter Lorem", role: "Terapis" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: newMessage,
          time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true }),
          sender: "user",
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-900">TerapyCare</span>
                <span className="ml-4 text-red-600 font-bold">Care</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">Buat Janji</button>
              <button className="text-red-600 hover:text-red-700">Sesi Berlangsung</button>
              <button className="text-gray-600 hover:text-gray-900">Panduan</button>
              <div className="w-8 h-8 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Live Chat</h1>

        <div className="bg-white rounded-lg shadow border border-gray-200">
          {/* Messages */}
          <div className="h-96 p-4 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${message.sender === "user" ? "flex justify-end" : "flex justify-start"}`}
              >
                {message.sender === "doctor" && (
                  <div className="flex flex-col mr-2">
                    <img
                      src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><rect width='40' height='40' rx='20' fill='%23D1D5DB'/></svg>"
                      alt="Doctor avatar"
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                )}
                <div className={`max-w-xs ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"} rounded-lg px-4 py-2`}>
                  {message.sender === "doctor" && (
                    <div className="mb-1">
                      <span className="font-semibold">{message.name}</span>
                      <span className="text-sm text-gray-600 ml-2">{message.role}</span>
                    </div>
                  )}
                  <p>{message.text}</p>
                  <span className="text-xs text-right block mt-1 opacity-75">{message.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <form
              onSubmit={handleSubmit}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Start typing..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
