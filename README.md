# PVO Modern - Sistema de Treinamento de Reconhecimento Visual

Sistema moderno de treinamento militar para reconhecimento visual de equipamentos, recriado com tecnologias atuais.

## Tecnologias

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router v6
- Zustand (State Management)
- React Query

### Backend
- Node.js + Express
- Prisma ORM
- SQLite/PostgreSQL
- JWT Authentication
- Multer (File Upload)

## Funcionalidades

### Para Alunos
- Login seguro
- Modo Treinamento - Estudar equipamentos por categoria
- Modo Teste - Testes cronometrados com feedback
- Histórico de desempenho
- Dashboard pessoal

### Para Instrutores
- Criar e gerenciar testes padrão
- Visualizar resultados dos alunos
- Upload de novos equipamentos
- Estatísticas e relatórios
- Exportar dados (PDF/CSV)

## Categorias de Equipamentos

1. **Aeronaves** - Aviões de combate e transporte
2. **Helicópteros** - Helicópteros de ataque e transporte
3. **Blindados** - Tanques e veículos blindados
4. **Embarcações** - Navios e embarcações militares
5. **Artilharia** - Sistemas de artilharia e canhões
6. **Mísseis** - Sistemas de mísseis diversos
7. **Equipamentos Eletrônicos** - Radares e sistemas eletrônicos
8. **Cocares** - Insígnias e marcações militares

## Instalação

### Backend
```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Estrutura do Projeto

```
PVO-Modern/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── store/         # Zustand stores
│   │   └── types/         # TypeScript types
│   └── public/
│
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── controllers/  # Controladores
│   │   ├── models/       # Modelos Prisma
│   │   ├── routes/       # Rotas da API
│   │   ├── middleware/   # Middlewares
│   │   ├── config/       # Configurações
│   │   └── utils/        # Utilitários
│   ├── uploads/          # Imagens enviadas
│   └── prisma/           # Schema do banco
│
└── README.md
```

## Licença

MIT License - Projeto educacional baseado no sistema PVO original (2010)

## Créditos

Sistema original desenvolvido para o 1°/10° GAv (Força Aérea Brasileira)
Versão moderna desenvolvida em 2026
 Aluno:
  - Email: aluno@pvo.mil.br
  - Senha: aluno123

  Instrutor:
  - Email: instrutor@pvo.mil.br
  - Senha: instrutor123

  Admin:
  - Email: admin@pvo.mil.br
  - Senha: admin123
