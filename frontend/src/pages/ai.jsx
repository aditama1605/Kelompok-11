import React, { useState, useEffect } from "react";

const TherapyAI = () => {
  const apiKey = "AIzaSyD0sjeQfsq8OPwIJgaTIHu1mCCtToOPVYA";
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const systemPrompt = `You are Terapy AI, a specialized assistant focused exclusively on health and physiotherapy. You can only answer questions related to health, wellness, medical conditions, physiotherapy techniques, exercises, and rehabilitation. If a question is unrelated to these topics, politely respond with: "Maaf, saya hanya bisa menjawab pertanyaan terkait kesehatan dan fisioterapi. Silakan ajukan pertanyaan lain." Do not provide any information outside these domains. Always respond in Indonesian, and keep answers concise and accurate.`;

  function isHealthOrPhysioRelated(message) {
    const keywords = [
      'kesehatan', 'fisioterapi', 'sakit', 'nyeri', 'cedera', 'olahraga', 
      'rehabilitasi', 'terapi', 'penyakit', 'otot', 'sendi', 'tulang', 
      'latihan', 'pemulihan', 'fisik', 'keseimbangan', 'postur', 
      'gerakan', 'perawatan', 'medis', 'keseleo', 'peregangan'
    ];
    const lowerMessage = message.toLowerCase();
    return keywords.some(keyword => lowerMessage.includes(keyword));
  }

  async function callGeminiAPI(prompt) {
    setIsTyping(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser: ${prompt}`
            }]
          }]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No response from API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'Maaf, terjadi kesalahan saat mempblues permintaan Anda.';
    } finally {
      setIsTyping(false);
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      text: inputMessage,
      isUser: true,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    if (!isHealthOrPhysioRelated(inputMessage)) {
      const botResponse = {
        text: 'Maaf, saya hanya bisa menjawab pertanyaan terkait kesehatan dan fisioterapi. Silakan ajukan pertanyaan lain.',
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botResponse]);
      return;
    }

    const botResponseText = await callGeminiAPI(inputMessage);
    const botResponse = {
      text: botResponseText,
      isUser: false,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, botResponse]);
  };

  useEffect(() => {
    const welcomeMessage = {
      text: "Halo, saya Terapy AI, asisten khusus untuk kesehatan dan fisioterapi. Silakan tanyakan tentang kesehatan, penyakit, latihan fisioterapi, atau rehabilitasi!",
      isUser: false,
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  }, []);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Terapy AI</h2>
        <p className="text-sm text-gray-500">Asisten kesehatan dan fisioterapi Anda</p>
      </div>
      
      {/* Chat container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-xs sm:max-w-md md:max-w-lg ${message.isUser ? 'flex-row-reverse' : ''}`}>
              
              {/* Message bubble */}
              <div 
                className={`mx-2 px-4 py-2 rounded-lg ${message.isUser 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-200 rounded-tl-none'}`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs mt-1 opacity-70 text-right">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex max-w-xs sm:max-w-md md:max-w-lg">
              <div className="mx-2 px-4 py-2 rounded-lg bg-white border border-gray-200 rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ketik pesan Anda..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};

export default TherapyAI;