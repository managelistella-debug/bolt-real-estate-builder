'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAllIconNames, getIcon, IconName } from '@/lib/icons/iconLibrary';
import { Search } from 'lucide-react';

interface IconPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIcon: string;
  onSelectIcon: (iconName: string) => void;
  currentColor?: string;
}

export function IconPicker({ open, onOpenChange, selectedIcon, onSelectIcon, currentColor = '#10b981' }: IconPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const allIcons = getAllIconNames();

  const filteredIcons = allIcons.filter((iconName) =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectIcon = (iconName: string) => {
    onSelectIcon(iconName);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose an Icon</DialogTitle>
          <DialogDescription>
            Select an icon for your item. Search by name to quickly find what you need.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="icon-search">Search Icons</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="icon-search"
              placeholder="Type to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Icon Grid */}
        <div className="flex-1 overflow-y-auto py-4">
          {filteredIcons.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No icons found matching "{searchQuery}"
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-3">
              {filteredIcons.map((iconName) => {
                const IconComponent = getIcon(iconName);
                const isSelected = selectedIcon === iconName;
                return (
                  <button
                    key={iconName}
                    onClick={() => handleSelectIcon(iconName)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all hover:border-primary hover:bg-primary/5 ${
                      isSelected ? 'border-primary bg-primary/10' : 'border-muted'
                    }`}
                  >
                    <IconComponent className="w-8 h-8" color={currentColor} />
                    <span className="text-xs mt-2 text-center capitalize">{iconName}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Current Selection */}
        {selectedIcon && (
          <div className="border-t pt-4 flex items-center gap-3">
            <Label>Current Selection:</Label>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded">
              {(() => {
                const IconComponent = getIcon(selectedIcon);
                return <IconComponent className="w-5 h-5" color={currentColor} />;
              })()}
              <span className="text-sm font-medium capitalize">{selectedIcon}</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
