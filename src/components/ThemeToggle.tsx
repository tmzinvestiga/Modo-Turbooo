
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  variant = 'outline' 
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleTheme}
      className={`transition-all duration-200 ${className}`}
      aria-label={`Mudar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
};
