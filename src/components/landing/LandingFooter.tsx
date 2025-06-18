
import React from 'react';
import { Zap } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="bg-card border-t py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-primary rounded-xl">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">MODO TURBO</span>
            </div>
            <p className="text-muted-foreground">
              A plataforma de produtividade que transforma sua rotina em conquistas.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Produto</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#features" className="hover:text-foreground transition-colors">Recursos</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Preços</a></li>
              <li><a href="#demo" className="hover:text-foreground transition-colors">Demo</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Suporte</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#help" className="hover:text-foreground transition-colors">Central de Ajuda</a></li>
              <li><a href="#contact" className="hover:text-foreground transition-colors">Contato</a></li>
              <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><a href="#about" className="hover:text-foreground transition-colors">Sobre</a></li>
              <li><a href="#blog" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#careers" className="hover:text-foreground transition-colors">Carreiras</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2024 MODO TURBO. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
