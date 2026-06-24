import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor = 'text-[#f97316]',
  iconBg = 'bg-orange-50',
  isLoading,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === undefined || change === 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-500 truncate">{title}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">
              {value}
            </p>
            {change !== undefined && (
              <div className="mt-2 flex items-center gap-1.5">
                {isPositive && (
                  <TrendingUp className="h-3.5 w-3.5 text-green-600 shrink-0" />
                )}
                {isNegative && (
                  <TrendingDown className="h-3.5 w-3.5 text-red-500 shrink-0" />
                )}
                {isNeutral && (
                  <Minus className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                )}
                <span
                  className={cn(
                    'text-xs font-medium',
                    isPositive && 'text-green-600',
                    isNegative && 'text-red-500',
                    isNeutral && 'text-slate-400',
                  )}
                >
                  {isPositive ? '+' : ''}
                  {change?.toFixed(1)}%
                </span>
                {changeLabel && (
                  <span className="text-xs text-slate-400">{changeLabel}</span>
                )}
              </div>
            )}
          </div>

          <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg shrink-0', iconBg)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
