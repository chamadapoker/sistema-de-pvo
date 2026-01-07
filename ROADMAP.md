# 🚀 PVO POKER - ROADMAP COMPLETO DE IMPLEMENTAÇÃO

**Data de Início:** 07/01/2026
**Status:** Em Desenvolvimento Ativo

---

## 📋 LISTA COMPLETA DE PENDÊNCIAS

### ✅ **CONCLUÍDO**
- [x] Sistema de autenticação com Supabase Auth
- [x] 3 usuários de teste criados
- [x] Páginas redesenhadas (tema PVO POKER)
- [x] Sistema de permissões (RBAC)
- [x] Menu dinâmico por role
- [x] Tabelas de provas agendadas
- [x] Service layer (testService.ts)
- [x] Interface de gerenciamento de provas (instrutor)
- [x] Documentação completa

---

## 🔥 **PRIORIDADE MÁXIMA** (Esta Semana)

### **1. Sistema de Provas Escritas** ✍️
**SQL:**
- [ ] Executar `add_test_whitelist.sql` no Supabase
- [ ] Executar `create_written_test_system.sql` no Supabase

**Backend/Service:**
- [ ] Adicionar funções ao testService.ts:
  - [ ] createTestWithQuestions()
  - [ ] getTestQuestions()
  - [ ] saveStudentAnswer()
  - [ ] correctAnswer()
  - [ ] calculateFinalScore()

**Interface - Instrutor:**
- [ ] Página de criação de prova escrita
  - [ ] Seletor de tipo: Escrita vs Múltipla Escolha
  - [ ] Grid de seleção de equipamentos (fotos)
  - [ ] Busca e filtro por categoria
  - [ ] Preview das fotos selecionadas
  - [ ] Drag & drop para reordenar
- [ ] Página de correção de provas
  - [ ] Lista de provas pendentes
  - [ ] Interface de correção questão por questão
  - [ ] Atalhos de teclado (1=correto, 0=errado)
  - [ ] Feedback opcional
  - [ ] Auto-cálculo de nota

**Interface - Aluno:**
- [ ] Adaptar TestPage para provas agendadas
  - [ ] Modo ESCRITA: campo de texto + auto-save
  - [ ] Modo MÚLTIPLA ESCOLHA: botões de opção
  - [ ] Timer e progresso
  - [ ] Navegação entre questões
- [ ] Dashboard do aluno com contador regressivo
  - [ ] Card de próxima prova
  - [ ] Contador dias:horas:min:seg
  - [ ] Detalhes (local, horário, tipo)
  - [ ] Botão "INICIAR" quando liberada

**Estimativa:** 2-3 dias

---

### **2. Sistema de Segunda Chamada** 🔄
**Interface - Instrutor:**
- [ ] Botão "Ver Faltantes" em provas finalizadas
- [ ] Modal com lista de alunos que não fizeram
- [ ] Seleção múltipla de alunos
- [ ] Botão "Criar Segunda Chamada Automático"
- [ ] Indicador de whitelist na lista de provas

**Regras:**
- [ ] Prova sem whitelist → Todos veem
- [ ] Prova com whitelist → Só permitidos veem
- [ ] Alunos que já fizeram não veem segunda chamada

**Estimativa:** 1 dia

---

### **3. Gestão de Senhas (Admin)** 🔐
**Interface:**
- [ ] Página `/instructor/students` (Admin only)
- [ ] Lista de todos os alunos
- [ ] Botão "Resetar Senha" por aluno
- [ ] Modal de confirmação
- [ ] Geração de senha temporária
- [ ] Forçar troca no próximo login

**Estimativa:** 0.5 dia

---

## 🌍 **ALTA PRIORIDADE** (Próximas 2 Semanas)

### **4. Sistema de Países**
**SQL/Backend:**
- [ ] Criar tabela `countries` no Supabase
  ```sql
  - id, name, code, flag_url
  - region, capital, population
  - languages[], currency
  - military_budget, active_military
  - description, map_coordinates
  ```
- [ ] Criar tabela `country_equipment` (relacionamento)
- [ ] Popular com ~50 países principais
- [ ] API para buscar dados (REST Countries API)

**Interface:**
- [ ] Página `/student/countries` - Grid de países
  - [ ] Cards com bandeira
  - [ ] Filtro por região
  - [ ] Busca por nome
- [ ] Página `/student/countries/:id` - Detalhes
  - [ ] Header (bandeira, nome, mapa)
  - [ ] Tabs:
    - Informações Gerais
    - Forças Armadas
    - Aeronaves
    - Blindados
    - Navios
    - Outros
  - [ ] Grid de equipamentos que o país opera
  - [ ] Click no equipamento → Modal com ficha técnica

**Fontes de Dados:**
- REST Countries API (geografia)
- Global Firepower (dados militares)
- Scraping de Jane's Defence / GlobalSecurity

**Estimativa:** 3-4 dias

---

### **5. Fichas Técnicas Completas** 📋
**Estrutura:**
- [ ] Criar tabela `equipment_specs` no Supabase
  ```sql
  - equipment_id (FK)
  - manufacturer, year_introduced
  - dimensions (length, width, height)
  - weight, max_speed, range
  - armament[], crew
  - operators[] (países)
  - description
  ```

**Preenchimento com IA:**
- [ ] Script Python para processar equipamentos
  - [ ] Ler nome do equipamento
  - [ ] Buscar na Wikipedia (pt/en)
  - [ ] Parsear infobox
  - [ ] Buscar em APIs militares
  - [ ] Usar IA para preencher lacunas
  - [ ] Salvar no Supabase

**Interface:**
- [ ] Modal de ficha técnica em equipamentos
  - [ ] Tabs: Visão Geral, Especificações, Operadores
  - [ ] Fotos múltiplas (carrossel)
  - [ ] Dados formatados
  - [ ] Links para fontes

**Opções de IA:**
1. **OpenAI GPT-4** - Via API (pago mas preciso)
2. **Web Scraping** - Wikipedia + sites militares (grátis)
3. **Hybrid** - Scraping primeiro, IA preenche lacunas

**Estimativa:** 2-3 dias de desenvolvimento + tempo de processamento

---

## 📊 **MÉDIA PRIORIDADE** (Próximo Mês)

### **6. Sistema de Relatórios**
- [ ] Dashboard de estatísticas (instrutor)
- [ ] Gráficos de desempenho por aluno
- [ ] Análise por categoria
- [ ] Exportar para PDF/Excel
- [ ] Histórico completo de provas

### **7. Melhorias no Flashcards**
- [ ] Sistema de repetição espaçada (algoritmo)
- [ ] Estatísticas por bateria
- [ ] Modo "Revisar Erros"
- [ ] Gamificação (streaks, pontos)

### **8. Sistema de Notificações**
- [ ] Email quando prova é liberada
- [ ] Lembrete 24h antes da prova
- [ ] Notificação de nota disponível
- [ ] Sistema in-app

---

## 🎨 **BAIXA PRIORIDADE** (Futuro)

### **9. Features Avançadas**
- [ ] Modo escuro/claro toggle
- [ ] Customização de tema
- [ ] Sistema de conquistas/badges
- [ ] Ranking de alunos
- [ ] Modo offline (PWA)
- [ ] App mobile nativo

### **10. Administração**
- [ ] Backup automático
- [ ] Logs de auditoria
- [ ] Sistema de permissões granular
- [ ] Multi-tenant (múltiplos esquadrões)

---

## 📅 CRONOGRAMA ESTIMADO

**Semana 1 (07-13 Jan):**
- ✅ Sistemas de provas (escrita + segunda chamada)
- ✅ Dashboard do aluno
- ✅ Correção de provas

**Semana 2 (14-20 Jan):**
- ✅ Sistema de países (tabelas + UI)
- ✅ Fichas técnicas (estrutura + script IA)

**Semana 3 (21-27 Jan):**
- ✅ Processar fichas com IA (1600+ equipamentos)
- ✅ Polimento e testes
- ✅ Gestão de senhas

**Semana 4 (28 Jan - 03 Fev):**
- ✅ Sistema de relatórios
- ✅ Notificações
- ✅ Documentação final

---

## 🎯 MÉTRICAS DE SUCESSO

- [ ] 100% das provas podem ser criadas e corrigidas
- [ ] Todos os 1600+ equipamentos têm fichas técnicas
- [ ] 50+ países com dados completos
- [ ] Sistema usado por todo o esquadrão
- [ ] 0 bugs críticos
- [ ] Tempo de resposta < 2s

---

## 📝 NOTAS IMPORTANTES

**Não Esquecer:**
- ✅ Página de países
- ✅ Fichas técnicas com IA
- ✅ Segunda chamada
- ✅ Correção manual de provas
- ✅ Auto-save nas provas

**Decisões Técnicas:**
- Priorizar PROVA ESCRITA (é a principal)
- Usar IA para fichas técnicas (automático)
- Sistema de países com API externa
- Frontend mobile-first

**Riscos:**
- Volume de dados (1600+ equipamentos)
- Custo de API de IA (considerar alternativas)
- Performance com muitos alunos simultâneos

---

## ✅ CHECKLIST DE HOJE (07/01/2026)

**Prioridade URGENTE:**
1. [ ] Executar SQL: `add_test_whitelist.sql`
2. [ ] Executar SQL: `create_written_test_system.sql`
3. [ ] Atualizar `testService.ts` com novas funções
4. [ ] Começar interface de seleção de fotos

**Meta do dia:** Sistema de provas escritas funcionando no Backend

---

**Status Geral:** 🟡 Em Desenvolvimento (30% concluído)

**Última Atualização:** 07/01/2026 00:09
