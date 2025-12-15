'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/services/api';
import Link from 'next/link';
import { VirtualAssistant } from '@/app/chatbot/VirtualAssistant';
import LogoIguanafix from '@/components/LogoIguadafix';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    profileCompletion: 75,
    documentsUploaded: 3,
    servicesActive: 2,
    totalEarnings: 0,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authService.getMe();
        setUser(response.data);
      } catch (error) {
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('providerId');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col min-h-screen justify-between items-center mb-8">
          <LogoIguanafix></LogoIguanafix>
          <div>
            <h1 className="text-4xl font-black text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Bem-vindo, {user?.name || 'Prestador'}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Sair
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Profile Completion */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Perfil Completo</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.profileCompletion}%</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${stats.profileCompletion}%` }}
              />
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Documentos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.documentsUploaded}/5</p>
              </div>
              <div className="text-4xl">📄</div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Faltam {5 - stats.documentsUploaded} documentos</p>
          </div>

          {/* Services */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Serviços Ativos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.servicesActive}</p>
              </div>
              <div className="text-4xl">⚙️</div>
            </div>
            <Link href="/services" className="text-xs text-blue-600 hover:underline mt-4 inline-block">
              Gerenciar serviços →
            </Link>
          </div>

          {/* Earnings */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Ganhos Totais</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">R$ {stats.totalEarnings}</p>
              </div>
              <div className="text-4xl">💰</div>
            </div>
            <p className="text-xs text-gray-500 mt-4">Este mês</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Informações Pessoais</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Nome</p>
                    <p className="text-gray-900 font-semibold">{user?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="text-gray-900 font-semibold">{user?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">CPF</p>
                    <p className="text-gray-900 font-semibold">{user?.cpf || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <p className="text-yellow-600 font-semibold">⏳ Pendente</p>
                  </div>
                </div>
                <Link
                  href="/profile/edit"
                  className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Editar Perfil
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Atividade Recente</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4 pb-3 border-b">
                  <div className="text-2xl">✅</div>
                  <div>
                    <p className="text-gray-900 font-medium">Cadastro Iniciado</p>
                    <p className="text-gray-600 text-sm">Há 2 horas</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 pb-3 border-b">
                  <div className="text-2xl">📄</div>
                  <div>
                    <p className="text-gray-900 font-medium">Documento Enviado</p>
                    <p className="text-gray-600 text-sm">Há 1 hora</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-2xl">💬</div>
                  <div>
                    <p className="text-gray-900 font-medium">Assistente Virtual Disponível</p>
                    <p className="text-gray-600 text-sm">Agora</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ações Rápidas</h2>
              <div className="space-y-3">
                <Link
                  href="/documents/upload"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition text-center font-medium"
                >
                  📤 Enviar Documentos
                </Link>
                <Link
                  href="/services/add"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition text-center font-medium"
                >
                  ➕ Adicionar Serviço
                </Link>
                <Link
                  href="/support"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition text-center font-medium"
                >
                  🆘 Suporte
                </Link>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Dica</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Complete seu perfil enviando todos os documentos necessários para aumentar suas chances de aprovação.
              </p>
              <p className="text-gray-600 text-xs mt-3">
                Precisa de ajuda? Clique no botão de chat abaixo! 👇
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Virtual Assistant */}
      <VirtualAssistant />
    </div>
  );
}
