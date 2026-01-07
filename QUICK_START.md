# Guia de Início Rápido - PVO Modern

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

## Instalação e Execução

### 1. Backend (API Server)

```bash
# Navegar para a pasta do servidor
cd PVO-Modern/server

# As dependências já foram instaladas, mas caso precise:
# npm install

# Gerar Prisma Client e criar banco de dados
npm run prisma:generate
npm run prisma:migrate

# Popular banco com dados iniciais (categorias e usuários de teste)
npm run prisma:seed

# Iniciar servidor em modo desenvolvimento
npm run dev
```

O servidor estará rodando em: **http://localhost:3000**

### 2. Frontend (React App)

```bash
# Em outro terminal, navegar para a pasta do cliente
cd PVO-Modern/client

# As dependências já foram instaladas, mas caso precise:
# npm install

# Iniciar aplicação React
npm run dev
```

A aplicação estará disponível em: **http://localhost:5173**

## Acessando o Sistema

### Usuários de Teste (já criados no banco)

1. **Aluno**
   - Email: `aluno@pvo.mil.br`
   - Senha: `aluno123`

2. **Instrutor**
   - Email: `instrutor@pvo.mil.br`
   - Senha: `instrutor123`

3. **Administrador**
   - Email: `admin@pvo.mil.br`
   - Senha: `admin123`

## Testando a API

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aluno@pvo.mil.br","password":"aluno123"}'
```

### Listar Categorias
```bash
# Substitua SEU_TOKEN pelo token recebido no login
curl http://localhost:3000/api/equipment/categories \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Estrutura do Banco de Dados

O sistema foi inicializado com:
- 8 Categorias de equipamentos militares
- 3 Usuários de teste (Admin, Instrutor, Aluno)

Para visualizar o banco de dados:
```bash
cd server
npm run prisma:studio
```

Isso abrirá uma interface web em http://localhost:5555 para visualizar e editar dados.

## Próximos Passos

1. **Adicionar Equipamentos**: Use o painel de administrador para fazer upload de imagens e cadastrar equipamentos
2. **Criar Testes**: Instrutores podem criar testes padrão com equipamentos selecionados
3. **Treinar**: Alunos podem usar o modo de treinamento para estudar equipamentos
4. **Avaliar**: Fazer testes e visualizar resultados

## Scripts Úteis

### Backend
- `npm run dev` - Servidor em modo desenvolvimento (hot reload)
- `npm run build` - Build para produção
- `npm start` - Executar versão de produção
- `npm run prisma:studio` - Interface visual do banco
- `npm run prisma:seed` - Popular banco com dados iniciais

### Frontend
- `npm run dev` - Aplicação em modo desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção

## Troubleshooting

### Erro "Porta 3000 já em uso"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Erro "Porta 5173 já em uso"
O Vite usa a porta 5173 por padrão. Se estiver ocupada, ele automaticamente usa a próxima disponível (5174, etc).

### Resetar Banco de Dados
```bash
cd server
rm prisma/dev.db
npm run prisma:migrate
npm run prisma:seed
```

## Suporte

Para problemas ou dúvidas, verifique:
- Logs do servidor no terminal
- Console do navegador (F12) para erros do frontend
- Arquivo `server/.env` está configurado corretamente
- Arquivo `client/.env` está configurado corretamente
