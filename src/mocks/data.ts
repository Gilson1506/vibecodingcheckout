// Mock data for the checkout page
export const MOCK_COURSE = {
    id: "evibe-coding-1.0",
    name: "E Vibe Coding 1.0",
    price: 29900, // 299.00 AOA in cents
    currency: "AOA",
    description: "Curso completo de desenvolvimento web do zero ao deploy",
    lessons: [
        { number: 1, title: "Introdução ao Desenvolvimento Web", duration: "45 min" },
        { number: 2, title: "HTML5 - Estrutura Semântica", duration: "60 min" },
        { number: 3, title: "CSS3 - Estilização Avançada", duration: "75 min" },
        { number: 4, title: "JavaScript - Fundamentos", duration: "90 min" },
        { number: 5, title: "JavaScript - DOM e Eventos", duration: "80 min" },
        { number: 6, title: "Responsividade e Mobile First", duration: "70 min" },
        { number: 7, title: "Flexbox e CSS Grid", duration: "85 min" },
        { number: 8, title: "Introdução ao React", duration: "100 min" },
        { number: 9, title: "React - Componentes e Props", duration: "95 min" },
        { number: 10, title: "React - Hooks e Estado", duration: "110 min" },
        { number: 11, title: "APIs REST e Fetch", duration: "80 min" },
        { number: 12, title: "Banco de Dados - Conceitos", duration: "70 min" },
        { number: 13, title: "Projeto Prático - Parte 1", duration: "120 min" },
        { number: 14, title: "Projeto Prático - Parte 2", duration: "120 min" },
        { number: 15, title: "Deploy e Publicação", duration: "60 min" },
    ],
};

export const MOCK_INSTRUCTOR = {
    name: "João Silva",
    title: "Full Stack Developer & Instructor",
    bio: "Com mais de 8 anos de experiência em desenvolvimento web, ajudei centenas de alunos a transformar suas carreiras. Especializado em criar aplicações modernas e escaláveis com React, Node.js e tecnologias em nuvem.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    yearsExperience: 8,
    studentsCount: 500,
    projectsCount: 50,
};

export const MOCK_BENEFITS = [
    {
        icon: "BookOpen",
        title: "15 Aulas Completas",
        description: "Conteúdo estruturado do zero até deploy",
    },
    {
        icon: "Users",
        title: "Comunidade Exclusiva",
        description: "Acesso ao grupo privado de alunos",
    },
    {
        icon: "Zap",
        title: "Projetos Práticos",
        description: "Aprenda fazendo com projetos reais",
    },
    {
        icon: "Award",
        title: "Certificado",
        description: "Receba seu certificado ao completar",
    },
    {
        icon: "CheckCircle2",
        title: "Suporte Vitalício",
        description: "Dúvidas respondidas sempre",
    },
    {
        icon: "Play",
        title: "Atualizações Grátis",
        description: "Novo conteúdo sem custo adicional",
    },
];

export const WHATSAPP_NUMBER = "244923456789";

// Mock API functions (will be replaced with real API calls later)
export const mockApi = {
    createOrder: async (data: {
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        paymentMethod: "multicaixa" | "referencia";
        amount: number;
    }) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        return {
            success: true,
            orderId: `ORD-${Date.now()}`,
            referenceNumber: data.paymentMethod === "referencia" ? `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : null,
            message: "Pedido criado com sucesso!",
        };
    },
};
