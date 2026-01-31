'use client';

import { Button } from '@/components/ui/button';
import { Monitor, Tablet, Smartphone, Undo, Redo } from 'lucide-react';
import { useBuilderStore } from '@/lib/stores/builder';

export function BuilderToolbar() {
  const { deviceView, setDeviceView, undo, redo, canUndo, canRedo } = useBuilderStore();

  return (
    <div className="flex items-center gap-2">
      {/* Device View Toggle */}
      <div className="flex items-center border rounded-lg p-1">
        <Button
          variant={deviceView === 'desktop' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setDeviceView('desktop')}
          className="h-7 w-7 p-0"
        >
          <Monitor className="h-4 w-4" />
        </Button>
        <Button
          variant={deviceView === 'tablet' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setDeviceView('tablet')}
          className="h-7 w-7 p-0"
        >
          <Tablet className="h-4 w-4" />
        </Button>
        <Button
          variant={deviceView === 'mobile' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setDeviceView('mobile')}
          className="h-7 w-7 p-0"
        >
          <Smartphone className="h-4 w-4" />
        </Button>
      </div>

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={!canUndo()}
          className="h-7 w-7 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={!canRedo()}
          className="h-7 w-7 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
