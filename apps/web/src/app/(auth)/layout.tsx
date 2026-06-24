import { Sword } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#f97316]/10" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#f97316]/5" />

        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f97316]">
              <Sword className="h-7 w-7 text-white" />
            </div>
            <span className="text-4xl font-bold text-white tracking-tight">
              Combat<span className="text-[#f97316]">Sync</span>
            </span>
          </div>

          <p className="text-slate-300 text-xl font-medium mb-4 max-w-sm">
            Gestão inteligente para academias e clínicas
          </p>
          <p className="text-slate-500 text-base max-w-xs mx-auto leading-relaxed">
            Agendamentos, clientes, finanças e relatórios — tudo em um só lugar.
          </p>

          {/* Feature list */}
          <div className="mt-12 space-y-4 text-left">
            {[
              'Agenda visual com arrastar e soltar',
              'Controle de pacotes de aulas',
              'Relatórios financeiros em tempo real',
              'Gestão de espaços e instrutores',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-[#f97316]/20 flex items-center justify-center shrink-0">
                  <div className="h-2 w-2 rounded-full bg-[#f97316]" />
                </div>
                <span className="text-slate-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f97316]">
              <Sword className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">
              Combat<span className="text-[#f97316]">Sync</span>
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
