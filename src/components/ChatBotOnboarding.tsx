'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  section?: string;
}

interface SectionData {
  [key: string]: any;
}

const SECTIONS = [
  {
    id: '1',
    title: 'Documentos Pessoais',
    description: 'Foto de perfil, CNH/RG e Certidão de Antecedentes',
    fields: ['fotoPerfil', 'fotoCNHRG', 'certidaoAntecedentes'],
  },
  {
    id: '2',
    title: 'Informações Pessoais',
    description: 'Endereço, telefone e dados pessoais',
    fields: ['rg', 'telefone', 'estado', 'cidade', 'cep', 'bairro', 'logradouro', 'numero', 'complemento'],
  },
  {
    id: '3',
    title: 'Região de Interesse',
    description: 'Onde você quer trabalhar e categorias de serviço',
    fields: ['estadoServico', 'cidadeServico', 'categorias'],
  },
  {
    id: '4',
    title: 'Experiência',
    description: 'Certificados e referências profissionais',
    fields: ['certificados', 'referencias'],
  },
  {
    id: '5',
    title: 'Dados Fiscais',
    description: 'Informações bancárias e PIX',
    fields: ['cnpjMei', 'razaoSocial', 'cnpj', 'tipoConta', 'pixTipo', 'pixChave', 'banco', 'agencia', 'conta', 'nomeTitular', 'documentoTitular'],
  },
];

export function ChatBotOnboarding() {
  const [currentSection, setCurrentSection] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sectionData, setSectionData] = useState<SectionData>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const providerId = typeof window !== 'undefined' ? localStorage.getItem('providerId') : null;

  const section = SECTIONS[currentSection];

  // Scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Inicializar chatbot com mensagem de boas-vindas
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `Olá! 👋 Bem-vindo à Etapa 2 do cadastro. Vou ajudar você a completar seu perfil profissional.\n\nVamos começar com: **${section.title}**\n\n${section.description}\n\nComo posso ajudá-lo?`,
          section: section.id,
        },
      ]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, section: section.id }]);
    setLoading(true);

    try {
      // Chamar API do chatbot com Gemini
      const response = await axios.post(
        `${API_URL}/chatbot/chat`,
        {
          message: userMessage,
          section: section.id,
          sectionTitle: section.title,
          context: sectionData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const assistantMessage = response.data.message;
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: assistantMessage,
          section: section.id,
        },
      ]);

      // Atualizar dados da seção se houver
      if (response.data.extractedData) {
        setSectionData(prev => ({
          ...prev,
          ...response.data.extractedData,
        }));
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Desculpe, ocorreu um erro. Tente novamente.',
          section: section.id,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNextSection = async () => {
    if (currentSection < SECTIONS.length - 1) {
      // Salvar dados da seção atual
      try {
        await axios.put(
          `${API_URL}/providers/${providerId}/section/${section.id}`,
          sectionData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error('Erro ao salvar seção:', error);
      }

      // Ir para próxima seção
      setCurrentSection(prev => prev + 1);
      setMessages([
        {
          role: 'assistant',
          content: `Ótimo! Vamos para a próxima etapa: **${SECTIONS[currentSection + 1].title}**\n\n${SECTIONS[currentSection + 1].description}\n\nComo posso ajudá-lo?`,
          section: SECTIONS[currentSection + 1].id,
        },
      ]);
      setSectionData({});
    } else {
      // Finalizar cadastro
      handleCompleteRegistration();
    }
  };

  const handleCompleteRegistration = async () => {
    try {
      // Salvar última seção
      await axios.put(
        `${API_URL}/providers/${providerId}/section/${section.id}`,
        sectionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Marcar como completo
      await axios.post(
        `${API_URL}/providers/${providerId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redirecionar para dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Erro ao completar cadastro:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
          <p className="text-sm text-gray-600">Seção {currentSection + 1} de {SECTIONS.length}</p>
          
          {/* Progress Bar */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / SECTIONS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 border border-gray-200 px-4 py-3 rounded-lg rounded-bl-none">
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
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua resposta..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition"
            >
              Enviar
            </button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-3">
            {currentSection > 0 && (
              <button
                onClick={() => setCurrentSection(prev => prev - 1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
              >
                ← Voltar
              </button>
            )}
            <button
              onClick={handleNextSection}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition ml-auto"
            >
              {currentSection === SECTIONS.length - 1 ? 'Finalizar Cadastro' : 'Próxima Seção →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
