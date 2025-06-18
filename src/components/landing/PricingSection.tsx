
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Crown, Lock, Zap } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    free: {
      name: 'Grátis',
      price: 'R$ 0',
      period: '/mês',
      description: 'Perfeito para começar sua jornada de produtividade',
      features: [
        'Até 3 quadros Kanban',
        'Até 30 tarefas por quadro',
        'Calendário básico',
        'WhatsApp: 5 tarefas/semana',
        'Suporte da comunidade'
      ],
      limitations: [
        'Quadros limitados',
        'Sem sincronização Google Calendar',
        'Filtros básicos apenas',
        'WhatsApp limitado'
      ],
      cta: 'Começar Grátis',
      popular: false
    },
    premium: {
      name: 'Premium',
      price: activeTab === 'monthly' ? 'R$ 29' : 'R$ 290',
      period: activeTab === 'monthly' ? '/mês' : '/ano',
      discount: activeTab === 'yearly' ? 'Economize 17%' : null,
      description: 'Para profissionais que querem máxima produtividade',
      features: [
        'Quadros e tarefas ilimitados',
        'WhatsApp chatbot completo',
        'Sincronização Google Calendar',
        'Filtros e etiquetas avançadas',
        'Suporte prioritário',
        'Acesso antecipado a recursos',
        'Relatórios de produtividade',
        'Integração com Zapier'
      ],
      cta: 'Upgrade para Premium',
      popular: true
    }
  };

  return (
    <section id="pricing" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Planos Para Todos os Perfis
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Comece grátis e evolua conforme suas necessidades
          </p>
          
          <div className="inline-flex items-center bg-secondary p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === 'monthly' 
                  ? 'bg-white text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setActiveTab('yearly')}
              className={`px-6 py-2 rounded-lg transition-all relative ${
                activeTab === 'yearly' 
                  ? 'bg-white text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Anual
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">
                -17%
              </Badge>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className={`border-2 transition-all duration-300 hover:shadow-xl ${plans.free.popular ? 'border-primary' : 'border-border'}`}>
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <Zap className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-2xl mb-2">{plans.free.name}</CardTitle>
              <div className="text-4xl font-bold text-foreground">
                {plans.free.price}
                <span className="text-lg text-muted-foreground font-normal">
                  {plans.free.period}
                </span>
              </div>
              <p className="text-muted-foreground mt-2">{plans.free.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                {plans.free.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
                {plans.free.limitations.map((limitation, index) => (
                  <li key={index} className="flex items-center gap-3 text-muted-foreground">
                    <Lock className="w-5 h-5 flex-shrink-0" />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="block">
                <Button className="w-full" variant="outline">
                  {plans.free.cta}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="border-2 border-primary relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 premium-gradient"></div>
            <Badge className="absolute top-4 left-1/2 transform -translate-x-1/2 premium-gradient text-white">
              <Crown className="w-3 h-3 mr-1" />
              Mais Popular
            </Badge>
            
            <CardHeader className="text-center pb-8 pt-12">
              <div className="flex justify-center mb-4">
                <div className="p-3 premium-gradient rounded-2xl">
                  <Crown className="w-12 h-12 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl mb-2">{plans.premium.name}</CardTitle>
              <div className="text-4xl font-bold text-foreground">
                {plans.premium.price}
                <span className="text-lg text-muted-foreground font-normal">
                  {plans.premium.period}
                </span>
              </div>
              {plans.premium.discount && (
                <Badge className="mt-2 success-gradient text-white">
                  {plans.premium.discount}
                </Badge>
              )}
              <p className="text-muted-foreground mt-2">{plans.premium.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-8">
                {plans.premium.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/auth" className="block">
                <Button className="w-full premium-gradient shadow-lg text-white">
                  <Crown className="w-4 h-4 mr-2" />
                  {plans.premium.cta}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
