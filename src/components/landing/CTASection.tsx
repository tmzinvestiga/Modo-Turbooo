
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, MessageCircle } from 'lucide-react';

export const CTASection: React.FC = () => {
  return (
    <section className="py-20 premium-gradient">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Pronto Para Turbinar Sua Produtividade?
        </h2>
        <p className="text-xl text-white/90 mb-10">
          Junte-se a milhares de usuários que já transformaram sua rotina
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90">
              <Zap className="mr-2 h-5 w-5" />
              Começar Agora - É Grátis!
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10">
            <MessageCircle className="mr-2 h-5 w-5" />
            Testar WhatsApp Bot
          </Button>
        </div>
      </div>
    </section>
  );
};
