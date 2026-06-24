'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Dumbbell,
  Building2,
  DollarSign,
  Package,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Sword,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/auth.store';
import { initials } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Agenda', href: '/agenda', icon: Calendar },
  { label: 'Clientes', href: '/clientes', icon: Users },
  { label: 'Serviços', href: '/servicos', icon: Dumbbell },
  { label: 'Espaços', href: '/espacos', icon: Building2 },
  { label: 'Financeiro', href: '/financeiro', icon: DollarSign },
  { label: 'Pacotes', href: '/pacotes', icon: Package },
  { label: 'Relatórios', href: '/relatorios', icon: BarChart3 },
];

const BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: 'Configurações', href: '/configuracoes', icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-[#0f172a] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f97316]">
              <Sword className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Combat<span className="text-[#f97316]">Sync</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white lg:hidden p-1 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Separator className="bg-slate-800" />

        {/* Main navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <span
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                    active
                      ? 'bg-[#f97316]/15 text-[#f97316]'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100',
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4.5 w-4.5 shrink-0',
                      active ? 'text-[#f97316]' : '',
                    )}
                    style={{ width: '18px', height: '18px' }}
                  />
                  {item.label}
                  {item.badge && item.badge > 0 ? (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#f97316] text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  ) : null}
                </span>
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-slate-800" />

        {/* Bottom navigation */}
        <div className="px-3 py-3 space-y-1">
          {BOTTOM_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <span
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                    active
                      ? 'bg-[#f97316]/15 text-[#f97316]'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100',
                  )}
                >
                  <Icon style={{ width: '18px', height: '18px' }} />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <Separator className="bg-slate-800" />

        {/* User info */}
        <div className="p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={user?.avatarUrl} alt={user?.name} />
              <AvatarFallback className="bg-slate-700 text-slate-100 text-xs">
                {user ? initials(user.name) : 'CS'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-100 truncate">
                {user?.name ?? 'Usuário'}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {user?.email ?? ''}
              </p>
            </div>
            <button
              onClick={() => logout()}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
