'use client';

import LogoIguanafix from '@/components/LogoIguadafix';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="flex flex-col justify-center items-center min-h-screen max-w-2xl w-full text-center">
        <LogoIguanafix></LogoIguanafix>
        <h1 className="text-5xl font-black text-gray-900 mb-4">
          Bem-vindo ao Cadastro de Prestadores
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Junte-se à nossa plataforma e comece a oferecer seus serviços
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Começar Cadastro
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-gray-200 text-gray-900 font-bold rounded-lg hover:bg-gray-300 transition-colors"
          >
            Já tenho conta
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="font-bold text-lg mb-2">Rápido</h3>
            <p className="text-gray-600">Cadastre-se em poucos minutos com nosso assistente inteligente</p>
          </div>
          <div className="card">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-bold text-lg mb-2">Seguro</h3>
            <p className="text-gray-600">Seus dados são protegidos com as melhores práticas de segurança</p>
          </div>
          <div className="card">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="font-bold text-lg mb-2">Assistência</h3>
            <p className="text-gray-600">Chatbot inteligente para responder suas dúvidas 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
}
