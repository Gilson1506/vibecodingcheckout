import { CheckCircle2, Play, Award, BookOpen, Users, Zap, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckoutForm } from "@/components/CheckoutForm";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { InstructorSection } from "@/components/InstructorSection";
import { MuxPlayer } from "@/components/MuxPlayer";
import { PortfolioSection } from "@/components/PortfolioSection"; // Not used - portfolio has own page
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SnowEffect from "@/components/SnowEffect";
import { getActiveCheckoutConfig, CheckoutData, Benefit as BenefitType } from "@/lib/checkoutService";
import { Loader2 } from "lucide-react";

// Fallback data when no config exists
const FALLBACK_COURSE_PRICE = 60000; // in Kwanzas
const FALLBACK_WHATSAPP = "244923456789";
const FALLBACK_COURSE_NAME = "E Vibe Coding 1.0";

const FALLBACK_LESSONS = [
  { id: '1', title: "Introdução ao Desenvolvimento Web", duration_minutes: 45, order_index: 1 },
  { id: '2', title: "HTML5 - Estrutura Semântica", duration_minutes: 60, order_index: 2 },
  { id: '3', title: "CSS3 - Estilização Avançada", duration_minutes: 75, order_index: 3 },
  { id: '4', title: "JavaScript - Fundamentos", duration_minutes: 90, order_index: 4 },
  { id: '5', title: "React - Introdução", duration_minutes: 100, order_index: 5 },
];

const FALLBACK_BENEFITS = [
  { icon: 'BookOpen', title: "15 Aulas Completas", description: "Conteúdo estruturado do zero até deploy" },
  { icon: 'Users', title: "Comunidade Exclusiva", description: "Acesso ao grupo privado de alunos" },
  { icon: 'Zap', title: "Projetos Práticos", description: "Aprenda fazendo com projetos reais" },
  { icon: 'Award', title: "Certificado", description: "Receba seu certificado ao completar" },
  { icon: 'CheckCircle2', title: "Suporte Vitalício", description: "Dúvidas respondidas sempre" },
  { icon: 'Play', title: "Atualizações Grátis", description: "Novo conteúdo sem custo adicional" },
];

const iconMap: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Award: <Award className="w-6 h-6" />,
  CheckCircle: <CheckCircle2 className="w-6 h-6" />,
  CheckCircle2: <CheckCircle2 className="w-6 h-6" />,
  Play: <Play className="w-6 h-6" />,
  Star: <Star className="w-6 h-6" />,
  Heart: <Heart className="w-6 h-6" />,
};

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  const checkoutRef = useRef<HTMLDivElement>(null);
  const [showBuyButton, setShowBuyButton] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  // Fetch checkout config on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await getActiveCheckoutConfig();
        setCheckoutData(data);
      } catch (error) {
        console.error('Failed to load checkout config:', error);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  // Scroll handler for floating buy button
  useEffect(() => {
    const handleScroll = () => {
      if (!checkoutRef.current) return;
      const scrollPosition = window.scrollY;
      const checkoutPosition = checkoutRef.current.offsetTop;
      const windowHeight = window.innerHeight;

      if (scrollPosition > 400 && scrollPosition < (checkoutPosition - windowHeight / 2)) {
        setShowBuyButton(true);
      } else {
        setShowBuyButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCheckout = () => {
    checkoutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Extract config values with fallbacks
  const config = checkoutData?.config;
  const course = checkoutData?.course;
  const lessons = checkoutData?.lessons?.length ? checkoutData.lessons : FALLBACK_LESSONS;

  const courseName = course?.title || FALLBACK_COURSE_NAME;
  const coursePrice = course?.price_cents || FALLBACK_COURSE_PRICE; // price in Kwanzas
  const whatsappNumber = config?.whatsapp_number || FALLBACK_WHATSAPP;
  const benefits: BenefitType[] = config?.benefits?.length ? config.benefits : FALLBACK_BENEFITS;
  const priceDisplay = config?.price_display || `${coursePrice.toLocaleString('pt-AO')} Kz`;
  const priceSubtitle = config?.price_subtitle || "Pagamento único, sem mensalidades";
  const priceFeatures = config?.price_features?.length ? config.price_features : [
    "15 aulas completas", "Acesso ao grupo VIP", "Certificado Oficial", "Suporte direto com instrutor"
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-foreground overflow-x-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border shadow-sm"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-400 rounded-xl flex items-center justify-center shadow-md">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Vibe Coding</h1>
          </div>
          <Button onClick={scrollToCheckout} className="bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20 transition-all hover:scale-105">
            Comprar Agora
          </Button>
        </div>
      </motion.header>

      {/* Hero Section (Video) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-16 px-4 bg-slate-50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <span className="text-sky-500 font-semibold tracking-wider text-sm uppercase mb-2 block">Destaque</span>
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">{courseName}</h3>
            <p className="text-slate-500 text-lg">{config?.video_title || "Domine a web moderna com estilo"}</p>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/50"
          >
            {config?.mux_playback_id ? (
              <MuxPlayer
                playbackId={config.mux_playback_id}
                title={config.video_title || courseName}
                autoPlay={true}
                muted={true}
              />
            ) : (
              <div style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&controls=1&rel=0"
                  title={courseName}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Instructor Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <InstructorSection
          instructorName={config?.instructor_name || "João Silva"}
          instructorTitle={config?.instructor_title || "Full Stack Developer & Instructor"}
          instructorBio={config?.instructor_bio || "Com mais de 8 anos de experiência em desenvolvimento web, ajudei centenas de alunos a transformar suas carreiras."}
          instructorImage={config?.instructor_image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"}
          yearsExperience={config?.instructor_years_experience || 8}
          studentsCount={config?.instructor_students_count || 0}
          projectsCount={config?.instructor_projects_count || 50}
        />
      </motion.div>



      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h3 className="text-3xl font-bold text-slate-900">Por que escolher o {courseName}?</h3>
            <p className="text-slate-500 mt-2">Tudo o que você precisa para decolar sua carreira</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
                  <CardHeader>
                    <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 mb-2">
                      {iconMap[benefit.icon] || <Star className="w-6 h-6" />}
                    </div>
                    <CardTitle className="text-xl text-slate-800">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-500 leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Course Content Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-20 px-4 bg-slate-50/50"
      >
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-3xl font-bold text-center mb-16 text-slate-900">
            Conteúdo do Curso - {lessons.length} Aulas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {lessons.map((lesson, index) => {
              const thumbnailUrl = lesson.thumbnail_url;
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card className="border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all group cursor-default overflow-hidden h-full flex flex-col">
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden relative">
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={lesson.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-100 rounded-full flex items-center justify-center">
                            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500" />
                          </div>
                        </div>
                      )}
                      {/* Duration badge */}
                      <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-black/70 text-white text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                        {lesson.duration_minutes}min
                      </div>
                      {/* Order badge */}
                      <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-6 h-6 sm:w-7 sm:h-7 bg-sky-500 text-white rounded-md flex items-center justify-center font-bold text-xs sm:text-sm">
                        {lesson.order_index}
                      </div>
                    </div>
                    {/* Content - Compact */}
                    <CardContent className="p-2 sm:p-3 flex-1 flex flex-col">
                      <h4 className="font-medium text-xs sm:text-sm text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-2 mb-1">
                        {lesson.title}
                      </h4>
                      {lesson.description && (
                        <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-2 mt-auto">
                          {lesson.description}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>



        </div>
      </motion.section>

      {/* Guarantee Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-20 px-4"
      >
        <div className="container mx-auto max-w-3xl">
          <Card className="border-2 border-sky-100 bg-gradient-to-br from-sky-50 to-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <CardHeader className="text-center relative z-10">
              <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4 text-sky-600">
                <Award className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl text-slate-900">Garantia Incondicional de 30 Dias</CardTitle>
            </CardHeader>
            <CardContent className="text-center relative z-10 max-w-lg mx-auto">
              <p className="text-lg text-slate-600 mb-4">
                Não gostou do curso? Devolvemos 100% do seu dinheiro em até 30 dias, sem perguntas.
              </p>
              <p className="text-sm text-slate-400">
                Queremos que você tenha confiança na sua compra. Sua satisfação é nossa prioridade absoluta.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="py-10 px-4 bg-slate-900 text-white relative overflow-hidden"
      >
        <SnowEffect />
        <div className="container mx-auto max-w-2xl text-center relative z-10">
          <h3 className="text-3xl font-bold mb-8">Investimento Único</h3>
          <Card className="border-0 bg-white/5 shadow-2xl ring-1 ring-white/10">
            <CardContent className="p-8">
              <div className="mb-6">
                <p className="text-sky-400 font-medium text-lg mb-2">Acesso Total + Vitalício</p>
                <div className="text-6xl font-bold text-white mb-2 tracking-tight">
                  {priceDisplay}
                </div>
                <p className="text-slate-400">{priceSubtitle}</p>
              </div>
              <ul className="text-left space-y-3 mb-8 max-w-sm mx-auto">
                {priceFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-sky-400 flex-shrink-0" />
                    <span className="text-slate-200 text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={scrollToCheckout} size="lg" className="w-full bg-sky-500 hover:bg-sky-600 text-white text-lg py-6 shadow-lg shadow-sky-500/30 rounded-xl transition-all hover:scale-105 animate-pulse">
                Garantir Minha Vaga Agora
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Checkout Section */}
      <section ref={checkoutRef} className="py-24 px-4 bg-slate-50" id="checkout">
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h3 className="text-3xl font-bold text-center mb-4 text-slate-900">Finalizar Inscrição</h3>
            <p className="text-center text-slate-500 mb-12 max-w-2xl mx-auto">Preencha seus dados abaixo para receber o acesso imediato ao curso.</p>
            <CheckoutForm coursePrice={coursePrice} courseName={courseName} whatsappNumber={whatsappNumber} />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-sky-400 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-bold text-slate-800">Vibe Coding</h4>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Transformando carreiras através do ensino de programação prático, moderno e acessível.
              </p>
            </div>
            <div className="md:text-right">
              <h4 className="font-bold text-slate-800 mb-4">Fale Conosco</h4>
              <p className="text-slate-500 text-sm mb-3">Tire suas dúvidas antes de comprar</p>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sky-600 hover:text-sky-700 font-semibold">
                <Users className="w-4 h-4 mr-2" />
                Conversar no WhatsApp
              </a>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2026 Vibe Coding. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <WhatsAppButton phoneNumber={whatsappNumber} variant="floating" />

      {/* Floating Buy Button */}
      <AnimatePresence>
        {showBuyButton && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-6 left-6 z-50 md:bottom-8 md:left-8"
          >
            <Button
              onClick={scrollToCheckout}
              size="default"
              className="bg-sky-500 hover:bg-sky-600 text-white shadow-2xl shadow-sky-500/40 rounded-full px-5 py-3 h-auto text-sm font-bold hover:scale-105 transition-all flex items-center gap-2"
            >
              Comprar Agora
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
