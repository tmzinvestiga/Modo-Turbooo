
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, ArrowRight, Play, MessageCircle, Smartphone } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center animate-fade-in">
          <Badge className="mb-6 premium-gradient text-white">
            <Smartphone className="w-4 h-4 mr-2" />
            Nova integração WhatsApp disponível
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Turbine Sua
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
              Produtividade
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            A plataforma definitiva que combina Kanban inteligente, calendário sincronizado e 
            <strong className="text-primary"> integração WhatsApp</strong> para transformar sua rotina em conquistas épicas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 py-4 premium-gradient shadow-xl card-hover">
                <Zap className="mr-2 h-5 w-5" />
                Começar Gratuitamente
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2">
              <Play className="mr-2 h-5 w-5" />
              Ver Demo
            </Button>
          </div>

          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
            <MessageCircle className="w-4 h-4" />
            Gerencie tarefas direto no WhatsApp
          </div>
        </div>
      </div>
    </section>
  );
};
