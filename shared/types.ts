
export interface Provider {
  id: string;
  email: string;
  nome: string;
  cpfCnpj: string;
  areaAtuacao: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  createdAt: Date;
  updatedAt: Date;
}

export interface ProviderRegisterInput {
  email: string;
  senha: string;
  nome: string;
  cpfCnpj: string;
  areaAtuacao: string;
}

export interface ProviderLoginInput {
  email: string;
  senha: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  nome: string;
  token: string;
  status: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatbotRequest {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  userMessage: string;
}

export interface ChatbotResponse {
  response: string;
  suggestions?: Array<{ field: string; value: string }>;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}