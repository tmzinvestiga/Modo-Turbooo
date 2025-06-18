
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, MessageCircle, Calendar, Filter, Crown } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Kanban Inteligente",
      description: "Organize suas tarefas com quadros totalmente personalizáveis e editáveis.",
      color: "bg-blue-500"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Integration",
      description: "Gerencie tarefas direto do WhatsApp com nosso chatbot inteligente.",
      color: "bg-green-500",
      premium: true
    },
    {
      icon: Calendar,
      title: "Calendário Integrado",
      description: "Sincronize com Google Calendar e visualize tarefas em diferentes perspectivas.",
      color: "bg-purple-500",
      premium: true
    },
    {
      icon: Filter,
      title: "Filtros Avançados",
      description: "Filtre por tags, prioridades, status e muito mais para focar no que importa.",
      color: "bg-orange-500",
      premium: true
    }
  ];

  return (
    <section id="features" className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Recursos Que Fazem a Diferença
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tudo que você precisa para ser mais produtivo em um só lugar
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover animate-scale-in border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 relative`}>
                  <feature.icon className="h-8 w-8 text-white" />
                  {feature.premium && (
                    <Crown className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
                  {feature.title}
                  {feature.premium && (
                    <Badge className="premium-gradient text-white text-xs">Pro</Badge>
                  )}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
