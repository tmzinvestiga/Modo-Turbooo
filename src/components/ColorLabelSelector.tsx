
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import { colorOptions, pt } from '@/utils/localization';

interface ColorLabelSelectorProps {
  selectedColors: string[];
  onColorsChange: (colors: string[]) => void;
}

export const ColorLabelSelector = ({ selectedColors, onColorsChange }: ColorLabelSelectorProps) => {
  const toggleColor = (colorId: string) => {
    if (selectedColors.includes(colorId)) {
      onColorsChange(selectedColors.filter(id => id !== colorId));
    } else {
      onColorsChange([...selectedColors, colorId]);
    }
  };

  const removeColor = (colorId: string) => {
    onColorsChange(selectedColors.filter(id => id !== colorId));
  };

  return (
    <div className="space-y-3">
      <Label>{pt.modal.labels}</Label>
      
      {/* Selected Colors Display */}
      {selectedColors.length > 0 && (
        <div className="flex gap-2 mb-3 flex-wrap">
          {selectedColors.map((colorId) => {
            const color = colorOptions.find(c => c.id === colorId);
            if (!color) return null;
            
            return (
              <Badge 
                key={colorId} 
                className={`${color.bg} ${color.text} flex items-center gap-1 px-2 py-1`}
              >
                {color.name}
                <button
                  type="button"
                  onClick={() => removeColor(colorId)}
                  className="ml-1 hover:opacity-70 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
      
      {/* Color Selection Grid */}
      <div className="grid grid-cols-4 gap-2">
        {colorOptions.map((color) => {
          const isSelected = selectedColors.includes(color.id);
          
          return (
            <Button
              key={color.id}
              type="button"
              variant="outline"
              onClick={() => toggleColor(color.id)}
              className={`relative h-12 w-full ${color.bg} ${color.text} border-2 transition-all duration-200 hover:scale-105 ${
                isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
              }`}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="text-xs font-medium truncate">{color.name}</div>
                {isSelected && (
                  <Check className="w-4 h-4 absolute top-1 right-1" />
                )}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
