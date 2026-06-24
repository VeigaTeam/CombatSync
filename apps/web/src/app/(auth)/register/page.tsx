'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth.store';
import { api, getApiError } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { AuthResponse, RegisterRequest } from '@/types';

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  clinicName: z.string().min(2, 'Nome da academia deve ter ao menos 2 caracteres'),
  password: z
    .string()
    .min(8, 'A senha deve ter ao menos 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter ao menos uma letra maiúscula')
    .regex(/[0-9]/, 'Deve conter ao menos um número'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { setTokensAndUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) =>
      api.post<AuthResponse>('/auth/register', data).then((r) => r.data),
    onSuccess: (data) => {
      setTokensAndUser(
        data.tokens.accessToken,
        data.tokens.refreshToken,
        data.user,
      );
      router.push('/dashboard');
    },
  });

  async function onSubmit({ confirmPassword: _, ...values }: RegisterForm) {
    registerMutation.mutate(values);
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-slate-900">
          Criar conta
        </CardTitle>
        <CardDescription className="text-slate-500">
          Comece gratuitamente — sem cartão de crédito
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {registerMutation.error && (
            <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {getApiError(registerMutation.error)}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Seu nome</Label>
              <Input
                id="name"
                placeholder="João Silva"
                autoComplete="name"
                className={cn(errors.name && 'border-red-500')}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicName">Nome da academia</Label>
              <Input
                id="clinicName"
                placeholder="Fight Club Academia"
                className={cn(errors.clinicName && 'border-red-500')}
                {...register('clinicName')}
              />
              {errors.clinicName && (
                <p className="text-xs text-red-500">{errors.clinicName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="voce@academia.com"
              autoComplete="email"
              className={cn(errors.email && 'border-red-500')}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mín. 8 caracteres"
                autoComplete="new-password"
                className={cn('pr-10', errors.password && 'border-red-500')}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Repita a senha"
              autoComplete="new-password"
              className={cn(errors.confirmPassword && 'border-red-500')}
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Criando conta...' : 'Criar conta'}
          </Button>

          <p className="text-xs text-center text-slate-400">
            Ao criar uma conta você concorda com nossos{' '}
            <Link href="/termos" className="underline hover:text-slate-700">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link href="/privacidade" className="underline hover:text-slate-700">
              Política de Privacidade
            </Link>
            .
          </p>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Já tem uma conta?{' '}
          <Link
            href="/login"
            className="font-medium text-[#f97316] hover:underline"
          >
            Entrar
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
