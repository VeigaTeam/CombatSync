'use client';

import Link from 'next/link';
import {
  Clock,
  User,
  Building2,
  Bell,
  Lock,
  Palette,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const SETTINGS_SECTIONS = [
  {
    title: 'Academia',
    items: [
      { label: 'Informações da Academia', description: 'Nome, logo, contato e endereço', icon: Building2, href: '/configuracoes/academia' },
      { label: 'Horários de Funcionamento', description: 'Configure os dias e horários de atendimento', icon: Clock, href: '/configuracoes/horarios' },
    ],
  },
  {
    title: 'Conta',
    items: [
      { label: 'Perfil', description: 'Seu nome, foto e informações pessoais', icon: User, href: '/configuracoes/perfil' },
      { label: 'Segurança', description: 'Senha e autenticação', icon: Lock, href: '/configuracoes/seguranca' },
    ],
  },
  {
    title: 'Preferências',
    items: [
      { label: 'Notificações', description: 'E-mail e lembretes automáticos', icon: Bell, href: '/configuracoes/notificacoes' },
      { label: 'Aparência', description: 'Tema e personalização visual', icon: Palette, href: '/configuracoes/aparencia' },
    ],
  },
];

export function ConfiguracoesContent() {
  return (
    <div className="max-w-2xl space-y-6">
      {SETTINGS_SECTIONS.map((section) => (
        <div key={section.title}>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            {section.title}
          </h3>
          <Card>
            <CardContent className="p-0">
              {section.items.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group"
                    >
                      <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-orange-50 transition-colors">
                        <Icon className="h-4.5 w-4.5 text-slate-500 group-hover:text-[#f97316] transition-colors" style={{ width: '18px', height: '18px' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500 truncate">{item.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 shrink-0" />
                    </Link>
                    {idx < section.items.length - 1 && <Separator />}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
