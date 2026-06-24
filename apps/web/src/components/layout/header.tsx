'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Bell, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/agenda': 'Agenda',
  '/agenda/novo': 'Novo Agendamento',
  '/clientes': 'Clientes',
  '/servicos': 'Serviços',
  '/servicos/novo': 'Novo Serviço',
  '/espacos': 'Espaços',
  '/financeiro': 'Financeiro',
  '/pacotes': 'Pacotes',
  '/relatorios': 'Relatórios',
  '/configuracoes': 'Configurações',
  '/configuracoes/horarios': 'Horários de Funcionamento',
};

const PAGE_ACTIONS: Record<string, { label: string; href: string }> = {
  '/agenda': { label: 'Novo Agendamento', href: '/agenda/novo' },
  '/clientes': { label: 'Novo Cliente', href: '/clientes/novo' },
  '/servicos': { label: 'Novo Serviço', href: '/servicos/novo' },
  '/espacos': { label: 'Novo Espaço', href: '/espacos/novo' },
  '/pacotes': { label: 'Novo Pacote', href: '/pacotes/novo' },
};

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  const title =
    Object.entries(PAGE_TITLES)
      .sort(([a], [b]) => b.length - a.length)
      .find(([key]) => pathname === key || pathname.startsWith(key + '/'))?.[1] ?? 'CombatSync';

  const action = PAGE_ACTIONS[pathname];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 lg:px-6">
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="text-slate-500 hover:text-slate-900 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title */}
      <h1 className="text-lg font-semibold text-slate-900 hidden sm:block">
        {title}
      </h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex items-center relative w-64">
        <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
        <Input
          placeholder="Pesquisar..."
          className="pl-9 h-9 bg-slate-50 border-slate-200 text-sm"
        />
      </div>

      {/* Action button */}
      {action && (
        <Button asChild size="sm">
          <Link href={action.href}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{action.label}</span>
          </Link>
        </Button>
      )}

      {/* Notifications */}
      <button
        className="relative text-slate-500 hover:text-slate-900 p-2 rounded-md transition-colors"
        aria-label="Notificações"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#f97316]" />
      </button>
    </header>
  );
}
