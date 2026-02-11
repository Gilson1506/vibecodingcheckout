import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { getActiveCheckoutConfig } from "@/lib/checkoutService";
import { Loader2 } from "lucide-react";

interface PortfolioProject {
  title: string;
  description: string;
  image_url: string;
  images?: string[];
  project_url: string;
}

export default function Portfolio() {
  const [, navigate] = useLocation();
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const data = await getActiveCheckoutConfig();
        if (data?.config?.portfolio_projects) {
          setProjects(data.config.portfolio_projects);
        }
      } catch (error) {
        console.error("Error loading portfolio:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, []);

  const getProjectImages = (project: PortfolioProject): string[] => {
    if (project.images && project.images.length > 0) {
      return project.images.filter(Boolean);
    }
    return project.image_url ? [project.image_url] : [];
  };

  // Ensure URL has protocol prefix
  const ensureAbsoluteUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <h1 className="text-xl font-bold text-slate-800">Portfólio</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-sky-50 via-white to-white">
        <div className="container mx-auto max-w-4xl text-center">
          <span className="inline-block px-4 py-1 bg-sky-100 text-sky-600 rounded-full text-sm font-semibold mb-4">
            Trabalhos Realizados
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Projetos do Instrutor</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Conheça alguns dos projetos desenvolvidos utilizando as mesmas técnicas que você aprenderá no curso.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {projects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">Nenhum projeto disponível no momento.</p>
              <Button onClick={() => navigate("/")} className="mt-4 bg-sky-500 hover:bg-sky-600 text-white">
                Voltar ao Início
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {projects.map((project, projectIndex) => {
                const images = getProjectImages(project);
                const hasMultipleImages = images.length > 1;

                return (
                  <Card key={projectIndex} className="border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="md:flex">
                      {/* Images Grid */}
                      <div className="md:w-1/2 lg:w-3/5 p-4 bg-slate-50">
                        {images.length === 1 ? (
                          // Single image - large display
                          <div
                            className="aspect-video rounded-lg overflow-hidden cursor-pointer"
                            onClick={() => setSelectedImage(images[0])}
                          >
                            <img
                              src={images[0]}
                              alt={project.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : images.length === 2 ? (
                          // 2 images - side by side
                          <div className="grid grid-cols-2 gap-2">
                            {images.map((img, idx) => (
                              <div
                                key={idx}
                                className="aspect-video rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => setSelectedImage(img)}
                              >
                                <img
                                  src={img}
                                  alt={`${project.title} ${idx + 1}`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            ))}
                          </div>
                        ) : images.length === 3 ? (
                          // 3 images - 1 large + 2 small
                          <div className="grid grid-cols-2 gap-2">
                            <div
                              className="row-span-2 rounded-lg overflow-hidden cursor-pointer"
                              onClick={() => setSelectedImage(images[0])}
                            >
                              <img
                                src={images[0]}
                                alt={`${project.title} 1`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            {images.slice(1).map((img, idx) => (
                              <div
                                key={idx}
                                className="aspect-video rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => setSelectedImage(img)}
                              >
                                <img
                                  src={img}
                                  alt={`${project.title} ${idx + 2}`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          // 4 images - 2x2 grid
                          <div className="grid grid-cols-2 gap-2">
                            {images.map((img, idx) => (
                              <div
                                key={idx}
                                className="aspect-video rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => setSelectedImage(img)}
                              >
                                <img
                                  src={img}
                                  alt={`${project.title} ${idx + 1}`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Image count badge */}
                        {hasMultipleImages && (
                          <p className="text-xs text-slate-400 mt-2 text-center">
                            {images.length} imagens • Clique para ampliar
                          </p>
                        )}
                      </div>

                      {/* Content */}
                      <div className="md:w-1/2 lg:w-2/5 p-6 flex flex-col justify-center">
                        <CardHeader className="p-0 mb-4">
                          <CardTitle className="text-2xl text-slate-800 mb-2">{project.title}</CardTitle>
                          <CardDescription className="text-slate-500 text-base leading-relaxed">
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                          {project.project_url && (
                            <a href={ensureAbsoluteUrl(project.project_url)} target="_blank" rel="noopener noreferrer">
                              <Button className="w-full md:w-auto bg-sky-500 hover:bg-sky-600 text-white">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Ver Projeto Online
                              </Button>
                            </a>
                          )}
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-slate-300"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Imagem ampliada"
            className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center text-slate-400 text-sm">
          <p>&copy; 2026 Vibe Coding. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
