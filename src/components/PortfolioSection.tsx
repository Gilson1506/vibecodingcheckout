import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface PortfolioProject {
    title: string;
    description: string;
    image_url: string;
    project_url: string;
}

interface PortfolioSectionProps {
    projects: PortfolioProject[];
}

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function PortfolioSection({ projects }: PortfolioSectionProps) {
    if (!projects || projects.length === 0) {
        return null;
    }

    return (
        <section className="py-20 px-4 bg-slate-50">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="text-center mb-12"
                >
                    <span className="text-sky-500 font-semibold tracking-wider text-sm uppercase mb-2 block">
                        Portfólio
                    </span>
                    <h3 className="text-3xl font-bold text-slate-900">
                        Projetos que Você Vai Construir
                    </h3>
                    <p className="text-slate-500 mt-2">
                        Veja exemplos de projetos desenvolvidos durante o curso
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer h-full">
                                <div className="aspect-video overflow-hidden bg-slate-100">
                                    {project.image_url ? (
                                        <img
                                            src={project.image_url}
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-100 to-sky-200">
                                            <span className="text-sky-500 font-bold text-4xl opacity-20">
                                                {project.title?.charAt(0) || 'P'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-5">
                                    <h4 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-sky-600 transition-colors">
                                        {project.title}
                                    </h4>
                                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                                        {project.description}
                                    </p>
                                    {project.project_url && (
                                        <a
                                            href={project.project_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sky-600 text-sm font-medium hover:text-sky-700"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Ver Projeto <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default PortfolioSection;
