import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Code } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useRef, useState } from "react";

interface InstructorSectionProps {
  instructorName: string;
  instructorTitle: string;
  instructorBio: string;
  instructorImage: string;
  yearsExperience: number;
  studentsCount: number;
  projectsCount: number;
}

export function InstructorSection({
  instructorName,
  instructorTitle,
  instructorBio,
  instructorImage,
  yearsExperience,
  studentsCount,
  projectsCount,
}: InstructorSectionProps) {
  const [, navigate] = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for slide-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-10 md:py-12 px-4 bg-white overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Foto do Formador com animação slide-in */}
          <div className="flex justify-center">
            <div
              className={`relative w-72 h-72 md:w-[420px] md:h-[420px] transition-all duration-1000 ease-out ${isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-20'
                }`}
            >
              <img
                src={instructorImage}
                alt={instructorName}
                className="w-full h-full object-contain drop-shadow-2xl"
                style={{ imageRendering: 'auto' }}
                loading="eager"
              />
            </div>
          </div>

          {/* Informações do Formador */}
          <div className="space-y-6">
            <div>
              <h3 className="text-4xl font-bold text-foreground mb-2">{instructorName}</h3>
              <p className="text-lg text-accent font-semibold">{instructorTitle}</p>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">{instructorBio}</p>

            {/* Estatísticas */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Award className="w-6 h-6 text-accent" />
                </div>
                <p className="text-2xl font-bold text-foreground">{yearsExperience}+</p>
                <p className="text-sm text-muted-foreground">Anos de Experiência</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {studentsCount > 0 ? `${studentsCount}+` : 'Nova Sala'}
                </p>
                <p className="text-sm text-muted-foreground">Alunos</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Code className="w-6 h-6 text-accent" />
                </div>
                <p className="text-2xl font-bold text-foreground">{projectsCount}+</p>
                <p className="text-sm text-muted-foreground">Projetos</p>
              </div>
            </div>

            {/* Botão de Portfólio */}
            <Button
              onClick={() => navigate("/portfolio")}
              size="lg"
              className="w-full bg-accent text-white hover:bg-accent/90 font-semibold py-6"
            >
              Ver Portfólio Completo
            </Button>

            {/* Skills */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Especialidades:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "React",
                  "JavaScript",
                  "Node.js",
                  "Web Design",
                  "UX/UI",
                  "Full Stack",
                  "Responsive Design",
                  "Performance",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-50 text-accent rounded-full text-sm font-medium border border-accent/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
