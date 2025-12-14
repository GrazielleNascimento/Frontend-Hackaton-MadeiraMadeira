'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import LogoIguanafix from '@/components/LogoIguadafix';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function VirtualAssistant() {
  const [isOpen, setIsOpen] = useState(false);
 // ...existing code...
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Olá! Sou a **Iamanos**, sua assistente virtual. Como posso ajudá-lo hoje?',
      timestamp: new Date(),
    },
  ]);
// ...existing code...
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading || !token) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      },
    ]);
    setLoading(true);

    try {
      // Chamar API do chatbot
      const response = await axios.post(
        `${API_URL}/chatbot/chat`,
        {
          message: userMessage,
          section: 'dashboard',
          sectionTitle: 'Assistente Virtual',
          context: {},
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.data.message || response.data.response,
          timestamp: new Date(),
        },
      ]);
    } catch (error: any) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '❌ Desculpe, ocorreu um erro. Tente novamente mais tarde.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = async (question: string) => {
    setInput(question);
    // Simular envio automático
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const quickQuestions = [
    '🤔 Como funciona o cadastro?',
    '📄 Quais documentos preciso?',
    '⏱️ Qual o prazo de aprovação?',
    '💰 Como recebo pelos serviços?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 bg-white rounded-lg shadow-2xl flex justify-center items-center min-h-screen flex-col h-96 border border-gray-200">
          <LogoIguanafix></LogoIguanafix>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Iamanos</h3>
              <p className="text-xs opacity-90">Assistente Virtual</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.length === 1 && (
              <div className="space-y-2">
                {quickQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 text-sm text-gray-700 transition"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.role === 'user' ? 'opacity-70' : 'text-gray-500'}`}>
                    {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 bg-white rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua pergunta..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm font-medium transition"
              >
                📤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all transform hover:scale-110 ${
          isOpen
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
        }`}
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}
