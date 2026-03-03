'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBuilderStore, type DeviceView } from '@/lib/stores/builder';

interface ResponsiveControlShellProps {
  label: string;
  children: ReactNode;
  className?: string;
  hasOverride?: boolean;
}

const DEVICE_CONFIG: Array<{ id: DeviceView; label: string; icon: typeof Monitor }> = [
  { id: 'desktop', label: 'Desktop', icon: Monitor },
  { id: 'tablet', label: 'Tablet', icon: Tablet },
  { id: 'mobile', label: 'Mobile', icon: Smartphone },
];

export function ResponsiveControlShell({
  label,
  children,
  className,
  hasOverride = false,
}: ResponsiveControlShellProps) {
  const { deviceView, setDeviceView } = useBuilderStore();
  const ActiveIcon = DEVICE_CONFIG.find((device) => device.id === deviceView)?.icon || Monitor;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-xs">{label}</Label>
          {hasOverride && <span className="h-2 w-2 rounded-full bg-violet-500" />}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <ActiveIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-36 p-1">
            {DEVICE_CONFIG.map((device) => {
              const Icon = device.icon;
              return (
                <Button
                  key={device.id}
                  type="button"
                  variant={deviceView === device.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2"
                  onClick={() => setDeviceView(device.id)}
                >
                  <Icon className="h-4 w-4" />
                  {device.label}
                </Button>
              );
            })}
          </PopoverContent>
        </Popover>
      </div>
      {children}
    </div>
  );
}

export function ResponsiveDevicePicker({ className }: { className?: string }) {
  const { deviceView, setDeviceView } = useBuilderStore();
  const ActiveIcon = DEVICE_CONFIG.find((device) => device.id === deviceView)?.icon || Monitor;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className={cn('h-7 w-7', className)}>
          <ActiveIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-36 p-1">
        {DEVICE_CONFIG.map((device) => {
          const Icon = device.icon;
          return (
            <Button
              key={device.id}
              type="button"
              variant={deviceView === device.id ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-2"
              onClick={() => setDeviceView(device.id)}
            >
              <Icon className="h-4 w-4" />
              {device.label}
            </Button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

