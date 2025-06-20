// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import io from 'socket.io-client';

// const API_URL = "http://localhost:8000/api";
// const SOCKET_URL = "http://localhost:3001";

// const ChatModal = ({ isOpen, onClose, currentUserId, currentUserRole, chatPartner }) => {
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const messagesEndRef = useRef(null);
//     const token = localStorage.getItem("token");
//     const socketRef = useRef(null);

//     useEffect(() => {
//         if (!isOpen || !chatPartner) return;

//         socketRef.current = io(SOCKET_URL, {
//             auth: { token },
//             transports: ['websocket']
//         });

//         const roomId = [currentUserId, chatPartner.id].sort().join('-');
//         socketRef.current.emit('joinRoom', roomId);

//         socketRef.current.on('receiveMessage', (message) => {
//             setMessages(prev => [...prev, message]);
//             scrollToBottom();
//         });

//         fetchMessages();

//         return () => {
//             if (socketRef.current) {
//                 socketRef.current.off('receiveMessage');
//                 socketRef.current.disconnect();
//             }
//         };
//     }, [isOpen, chatPartner, currentUserId]);

//     const fetchMessages = async () => {
//         try {
//             const response = await axios.get(`${API_URL}/chat/messages/${chatPartner.id}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setMessages(response.data.messages);
//             setError(null);
//             scrollToBottom();
//         } catch (error) {
//             console.error("Error fetching messages:", error);
//             setError("Gagal memuat pesan. Silakan coba lagi.");
//         }
//     };

//     const sendMessage = async () => {
//         if (!newMessage.trim()) return;

//         setIsLoading(true);
//         try {
//             const roomId = [currentUserId, chatPartner.id].sort().join('-');
            
//             socketRef.current.emit('sendMessage', {
//                 room: roomId,
//                 senderId: currentUserId,
//                 receiverId: chatPartner.id,
//                 message: newMessage,
//                 senderRole: currentUserRole,
//                 createdAt: new Date().toISOString()
//             });

//             await axios.post(
//                 `${API_URL}/chat/send`,
//                 {
//                     receiver_id: chatPartner.id,
//                     message: newMessage
//                 },
//                 {
//                     headers: { Authorization: `Bearer ${token}` }
//                 }
//             );

//             setNewMessage("");
//             setError(null);
//         } catch (error) {
//             console.error("Gagal mengirim pesan:", error);
//             setError("Gagal mengirim pesan. Silakan coba lagi.");
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col shadow-xl">
//                 <div className="p-4 border-b flex justify-between items-center bg-blue-600 text-white">
//                     <h3 className="text-lg font-semibold">Chat dengan {chatPartner.name}</h3>
//                     <button 
//                         onClick={onClose} 
//                         className="text-white hover:text-gray-200 text-2xl focus:outline-none"
//                         disabled={isLoading}
//                     >
//                         &times;
//                     </button>
//                 </div>

//                 <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
//                     {error && (
//                         <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded mb-4">
//                             {error}
//                         </div>
//                     )}
                    
//                     {messages.length > 0 ? (
//                         messages.map((msg) => (
//                               <div
//                                   key={msg.id || msg._id}
//                                   className={`flex ${msg.sender_id === currentUserId || msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
//                               >
//                                 <div
//                                     className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
//                                         msg.sender_id === currentUserId
//                                             ? 'bg-blue-600 text-white rounded-br-none'
//                                             : 'bg-gray-200 text-gray-800 rounded-bl-none'
//                                     } shadow relative`}
//                                 >
//                                     <p className="break-words">{msg.message}</p>
//                                     <p className={`text-xs mt-1 opacity-70 ${
//                                         msg.sender_id === currentUserId ? 'text-blue-100' : 'text-gray-500'
//                                     }`}>
//                                         {new Date(msg.created_at || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                                     </p>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="flex items-center justify-center h-full">
//                             <p className="text-gray-500">Belum ada pesan</p>
//                         </div>
//                     )}
//                     <div ref={messagesEndRef} />
//                 </div>

//                 <div className="p-4 border-t bg-white">
//                     <div className="flex items-center">
//                         <input
//                             type="text"
//                             value={newMessage}
//                             onChange={(e) => setNewMessage(e.target.value)}
//                             placeholder="Ketik pesan..."
//                             className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
//                             disabled={isLoading}
//                         />
//                         <button
//                             onClick={sendMessage}
//                             disabled={isLoading || !newMessage.trim()}
//                             className={`bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors
//                                         ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                         >
//                             {isLoading ? '...' : 'Kirim'}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ChatModal;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";

const API_URL = "http://localhost:8000/api";
const SOCKET_URL = "http://localhost:3001";

const ChatModal = ({ isOpen, onClose, currentUserId, currentUserRole, chatPartner }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");
  const socketRef = useRef(null);

useEffect(() => {
  if (!isOpen || !chatPartner || !chatPartner.id) {
    console.log("ChatModal closed or invalid chatPartner:", { isOpen, chatPartner });
    return;
  }

  socketRef.current = io(SOCKET_URL, {
    auth: { token },
    // Remove transports to allow polling fallback during debugging
    // transports: ["websocket"],
  });

  socketRef.current.on("connect", () => {
    console.log("Socket.IO connected:", socketRef.current.id);
    const roomId = [currentUserId, chatPartner.id].sort().join("-");
    socketRef.current.emit("joinRoom", roomId);
  });

  socketRef.current.on("receiveMessage", (message) => {
    console.log("Received message:", message);
    const normalizedMessage = {
      sender_id: message.senderId,
      message: message.message,
      created_at: message.createdAt || new Date().toISOString(),
    };
    setMessages((prev) => [...prev, normalizedMessage]);
    scrollToBottom();
  });

  socketRef.current.on("connect_error", (err) => {
    console.error("Socket.IO connection error:", err.message);
    setError("Gagal terhubung ke server chat. Silakan coba lagi.");
  });

  fetchMessages();

  return () => {
    if (socketRef.current) {
      socketRef.current.off("receiveMessage");
      socketRef.current.off("connect_error");
      socketRef.current.disconnect();
    }
  };
}, [isOpen, chatPartner, currentUserId]);

  const fetchMessages = async () => {
    if (!chatPartner?.id || !token) return;
    try {
      const response = await axios.get(`${API_URL}/chat/messages/${chatPartner.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Normalize messages from API
      const normalizedMessages = (response.data.messages || []).map((msg) => ({
        ...msg,
        sender_id: msg.sender_id || msg.senderId,
        created_at: msg.created_at || msg.createdAt,
      }));
      setMessages(normalizedMessages);
      setError(null);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Gagal memuat pesan. Silakan coba lagi.");
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !chatPartner?.id || !token) return;

    setIsLoading(true);
    try {
      const roomId = [currentUserId, chatPartner.id].sort().join("-");
      const messageData = {
        room: roomId,
        senderId: currentUserId,
        receiverId: chatPartner.id,
        message: newMessage,
        senderRole: currentUserRole,
        createdAt: new Date().toISOString(),
      };

      // Emit to Socket.IO
      socketRef.current.emit("sendMessage", messageData);

      // Send to backend
      const response = await axios.post(
        `${API_URL}/chat/send`,
        {
          receiver_id: chatPartner.id,
          message: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message !== "Pesan berhasil dikirim") {
        throw new Error("Gagal menyimpan pesan di server");
      }

      setNewMessage("");
      setError(null);
    } catch (error) {
      console.error("Gagal mengirim pesan:", error);
      setError("Gagal mengirim pesan: " + (error.response?.data?.message || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!isOpen || !chatPartner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col shadow-xl">
        <div className="p-4 border-b flex justify-between items-center bg-blue-600 text-white">
          <h3 className="text-lg font-semibold">
            Chat dengan {chatPartner?.name || "Unknown"}
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl focus:outline-none"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded mb-4">
              {error}
            </div>
          )}
          {messages.length > 0 ? (
            messages.map((msg, index) => {
              const senderId = msg.sender_id || msg.senderId;
              const timestamp = msg.created_at || msg.createdAt;
              const messageKey = msg.id || `${senderId}-${timestamp || index}`;

              return (
                <div
                  key={messageKey}
                  className={`flex ${
                    senderId === currentUserId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      senderId === currentUserId
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    } shadow relative`}
                  >
                    <p className="break-words">{msg.message || "Pesan tidak tersedia"}</p>
                    <p
                      className={`text-xs mt-1 opacity-70 ${
                        senderId === currentUserId ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {timestamp
                        ? new Date(timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Waktu tidak tersedia"}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Belum ada pesan</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t bg-white">
          <div className="flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && !isLoading && sendMessage()}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !newMessage.trim()}
              className={`bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "..." : "Kirim"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;