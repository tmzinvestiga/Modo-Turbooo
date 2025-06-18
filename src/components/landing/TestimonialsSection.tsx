
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Maria Silva",
      role: "Gerente de Projetos",
      avatar: "M",
      content: "O MODO TURBO revolucionou minha forma de trabalhar. A integração com WhatsApp é simplesmente incrível!",
      rating: 5
    },
    {
      name: "João Santos",
      role: "Desenvolvedor",
      avatar: "J",
      content: "Interface linda e funcional. Minha equipe adotou em uma semana e a produtividade triplicou!",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "CEO Startup",
      avatar: "A",
      content: "O plano premium vale cada centavo. Os filtros avançados e integração com Google Calendar são game-changers.",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            O Que Nossos Usuários Dizem
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg card-hover">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
