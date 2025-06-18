
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export const LandingHeader: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 glass-effect border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">MODO TURBO</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Depoimentos
            </a>
          </nav>
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link to="/auth">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Entrar
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="premium-gradient shadow-lg">
                Começar Grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
