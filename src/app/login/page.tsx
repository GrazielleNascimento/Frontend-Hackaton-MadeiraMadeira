'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProviderLoginSchema } from '../../../shared/schemas';
import { authService } from '@/services/api';
import Link from 'next/link';
import LogoIguanafix from '@/components/LogoIguadafix';

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProviderLoginSchema),
    defaultValues: {
      email: '',
      senha: '',
    },
  });

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      const response = await authService.login(values);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('providerId', response.data.id);
      window.location.href = '/dashboard';
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="flex flex-col justify-center items-center min-h-screen max-w-md w-full card">
        <LogoIguanafix></LogoIguanafix>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Bem-vindo de Volta</h1>
        <p className="text-gray-600 mb-6">Faça login para acessar sua conta</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              className="input-field"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Senha */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('senha')}
              className="input-field"
            />
            {errors.senha && <p className="text-red-600 text-sm mt-1">{errors.senha.message}</p>}
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Não tem conta?{' '}
          <Link href="/register" className="text-blue-600 font-semibold hover:underline">
            Cadastre-se aqui
          </Link>
        </p>
      </div>
    </div>
  );
}
