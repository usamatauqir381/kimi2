import React from 'react';
import { TrendingUp, TrendingDown, Minus, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  trendLabel?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'highlight' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  trendLabel,
  icon,
  className,
  variant = 'default',
  onClick,
}: KPICardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  
  const variantStyles = {
    default: 'bg-white',
    highlight: 'bg-[#0d4f42] text-white',
    success: 'bg-emerald-50 border-emerald-200',
    warning: 'bg-amber-50 border-amber-200',
    danger: 'bg-red-50 border-red-200',
  };

  const trendColors = {
    up: variant === 'highlight' ? 'text-emerald-300' : 'text-emerald-600',
    down: variant === 'highlight' ? 'text-red-300' : 'text-red-600',
    neutral: variant === 'highlight' ? 'text-gray-300' : 'text-gray-600',
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-200 hover:shadow-md',
        variantStyles[variant],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <span className={cn(
          'text-sm font-medium',
          variant === 'highlight' ? 'text-white/80' : 'text-muted-foreground'
        )}>
          {title}
        </span>
        <div className="flex items-center gap-2">
          {icon && (
            <div className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              variant === 'highlight' ? 'bg-white/10' : 'bg-muted'
            )}>
              {icon}
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  'h-6 w-6',
                  variant === 'highlight' ? 'text-white/60 hover:bg-white/10 hover:text-white' : ''
                )}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Export data</DropdownMenuItem>
              <DropdownMenuItem>Set alert</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className={cn(
            'text-3xl font-bold tracking-tight',
            variant === 'highlight' ? 'text-white' : ''
          )}>
            {value}
          </span>
          {trend && (
            <div className={cn('flex items-center gap-1 text-sm', trendColors[trend])}>
              <TrendIcon className="h-4 w-4" />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {subtitle && (
          <p className={cn(
            'mt-1 text-sm',
            variant === 'highlight' ? 'text-white/60' : 'text-muted-foreground'
          )}>
            {subtitle}
          </p>
        )}
        {trendLabel && (
          <p className={cn(
            'mt-2 text-xs',
            variant === 'highlight' ? 'text-white/50' : 'text-muted-foreground'
          )}>
            {trendLabel}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
