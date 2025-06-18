
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Menu, 
  Zap, 
  Calendar, 
  BarChart3, 
  MessageCircle,
  Star, 
  CheckCircle,
  ArrowRight,
  Play,
  Crown,
  Lock,
  Smartphone,
  Filter,
  Users,
  Shield,
  Infinity
} from 'lucide-react';

export const LandingPage: React.FC = () => {
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
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
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

      {/* Hero Section */}
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

            {/* WhatsApp Integration Highlight */}
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
              <MessageCircle className="w-4 h-4" />
              Gerencie tarefas direto no WhatsApp
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
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
            {[
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
            ].map((feature, index) => (
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

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Planos Para Todos os Perfis
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Comece grátis e evolua conforme suas necessidades
            </p>
            
            {/* Billing Toggle */}
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

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              O Que Nossos Usuários Dizem
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
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
            ].map((testimonial, index) => (
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

      {/* CTA Section */}
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

      {/* Footer */}
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
    </div>
  );
};
