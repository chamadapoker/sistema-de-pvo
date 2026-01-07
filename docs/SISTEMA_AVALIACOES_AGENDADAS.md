# PVO POKER - Sistema de Avaliações Agendadas

## 🎯 Conceito Geral

Sistema de avaliações presenciais controladas onde:
- **Instrutor/Admin** cria e agenda provas
- **Alunos** fazem login individual e realizam provas simultaneamente
- **Controle total** sobre quando e onde as provas acontecem
- **Gerenciamento de senhas** apenas por Admin

---

## 📋 Estrutura de Dados

### 1. Tabela: `scheduled_tests` (Provas Agendadas)

```sql
CREATE TABLE scheduled_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Informações Básicas
  title VARCHAR(255) NOT NULL,              -- "Avaliação Mensal - Aeronaves"
  description TEXT,                         -- Descrição da prova
  
  -- Configuração da Prova
  category_id INTEGER REFERENCES categories(id),  -- Bateria (opcional - pode ser mista)
  question_count INTEGER NOT NULL DEFAULT 20,      -- Número de questões
  time_per_question INTEGER NOT NULL DEFAULT 15,   -- Segundos por questão
  passing_score INTEGER DEFAULT 70,                -- Nota mínima para aprovação
  
  -- Agendamento
  scheduled_date TIMESTAMP NOT NULL,        -- Data e hora da prova
  location VARCHAR(255),                    -- Local físico (ex: "Sala 101")
  duration_minutes INTEGER,                 -- Duração total estimada
  
  -- Controle de Acesso
  status VARCHAR(50) DEFAULT 'SCHEDULED',   -- SCHEDULED, ACTIVE, FINISHED, CANCELLED
  is_active BOOLEAN DEFAULT FALSE,          -- Se está liberada para realização
  start_time TIMESTAMP,                     -- Quando foi liberada
  end_time TIMESTAMP,                       -- Quando foi encerrada
  
  -- Criação
  created_by UUID REFERENCES auth.users(id), -- Quem criou (Instrutor/Admin)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Tabela: `test_attempts` (Tentativas/Respostas)

```sql
CREATE TABLE test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Referências
  test_id UUID REFERENCES scheduled_tests(id),
  student_id UUID REFERENCES auth.users(id),
  
  -- Dados da Tentativa
  started_at TIMESTAMP DEFAULT NOW(),
  finished_at TIMESTAMP,
  
  -- Resultados
  score INTEGER,                            -- Pontuação (0-100)
  correct_answers INTEGER,                  -- Número de acertos
  total_questions INTEGER,                  -- Total de questões
  time_taken INTEGER,                       -- Tempo gasto em segundos
  
  -- Detalhes (JSON com todas as respostas)
  answers JSONB,                            -- Array de {question_id, answer, is_correct, time_spent}
  
  -- Status
  status VARCHAR(50) DEFAULT 'IN_PROGRESS', -- IN_PROGRESS, COMPLETED, ABANDONED
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Tabela: `users` (Extensão - Gestão de Senhas)

```sql
-- Adicionar campos à tabela de usuários
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS 
  password_reset_required BOOLEAN DEFAULT FALSE,
  password_last_changed TIMESTAMP,
  password_changed_by UUID REFERENCES auth.users(id);
```

---

## 🎮 Fluxo de Funcionamento

### **INSTRUTOR/ADMIN**

#### 1. Criar Prova (/instructor/tests/create)
```
┌─────────────────────────────────────┐
│ CRIAR NOVA AVALIAÇÃO                │
├─────────────────────────────────────┤
│ Título: [Avaliação Mensal]          │
│ Bateria: [Aeronaves ▼]              │
│ Nº Questões: [20]                   │
│ Tempo/Questão: [15s]                │
│                                     │
│ Data: [07/01/2026]                  │
│ Hora: [14:00]                       │
│ Local: [Sala de Treinamento 1]     │
│                                     │
│ Nota Mínima: [70%]                  │
│                                     │
│ [AGENDAR PROVA]                     │
└─────────────────────────────────────┘
```

#### 2. Gerenciar Provas (/instructor/tests)
```
┌─────────────────────────────────────────────────────┐
│ PROVAS AGENDADAS                                    │
├─────────────────────────────────────────────────────┤
│ 📅 07/01/2026 14:00 - Sala 1                        │
│ Avaliação Mensal - Aeronaves                        │
│ 20 questões | 5 min | 12 alunos inscritos           │
│ Status: AGENDADA ⏱️                                  │
│ [LIBERAR] [EDITAR] [CANCELAR]                       │
├─────────────────────────────────────────────────────┤
│ 📅 05/01/2026 14:00 - Sala 2                        │
│ Avaliação Semanal - Blindados                       │
│ 15 questões | 3.75 min | 12/12 concluídas           │
│ Status: FINALIZADA ✅                                │
│ [VER RESULTADOS]                                    │
└─────────────────────────────────────────────────────┘
```

#### 3. Liberar Prova Manualmente
```
No momento da prova, instrutor clica em [LIBERAR]:
┌─────────────────────────────────────┐
│ ⚠️ LIBERAR AVALIAÇÃO?                │
├─────────────────────────────────────┤
│ Título: Avaliação Mensal            │
│ Alunos: 12 aguardando               │
│                                     │
│ Ao liberar, todos os alunos         │
│ poderão iniciar a prova.            │
│                                     │
│ [CANCELAR] [LIBERAR AGORA] ✅       │
└─────────────────────────────────────┘
```

#### 4. Acompanhamento em Tempo Real
```
┌─────────────────────────────────────────────────────┐
│ PROVA ATIVA - Avaliação Mensal                      │
│ ⏱️ Iniciada há 3 minutos                             │
├─────────────────────────────────────────────────────┤
│ 👤 João Silva        ● EM ANDAMENTO (Q 5/20)        │
│ 👤 Maria Santos      ✅ CONCLUÍDA (85%)              │
│ 👤 Carlos Souza      ● EM ANDAMENTO (Q 12/20)       │
│ 👤 Ana Costa         ⏸️ AGUARDANDO                    │
│                                                     │
│ [ENCERRAR PROVA PARA TODOS]                         │
└─────────────────────────────────────────────────────┘
```

---

### **ALUNO**

#### 1. Portal do Aluno - Dashboard
```
┌─────────────────────────────────────────────────────┐
│ QG OPERACIONAL                                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 🚨 PRÓXIMA AVALIAÇÃO                                │
│ ┌───────────────────────────────────────────────┐   │
│ │ Avaliação Mensal - Aeronaves                  │   │
│ │                                               │   │
│ │ ⏰ TEMPO RESTANTE                             │   │
│ │    00:23:45:12                                │   │
│ │    (Dias:Horas:Min:Seg)                       │   │
│ │                                               │   │
│ │ 📍 Local: Sala de Treinamento 1               │   │
│ │ 📅 Data: 07/01/2026 às 14:00                  │   │
│ │ 🎯 Bateria: Aeronaves                         │   │
│ │ ❓ Questões: 20                                │   │
│ │ ⏱️ Tempo: 15s por questão                      │   │
│ │                                               │   │
│ │ Status: ⏳ AGUARDANDO LIBERAÇÃO                │   │
│ └───────────────────────────────────────────────┘   │
│                                                     │
│ [QUANDO LIBERADA: INICIAR PROVA]                    │
└─────────────────────────────────────────────────────┘
```

#### 2. Prova Liberada
```
Quando instrutor libera:
┌─────────────────────────────────────┐
│ ✅ PROVA LIBERADA!                   │
├─────────────────────────────────────┤
│ A avaliação está disponível.        │
│                                     │
│ Você tem até 14:30 para completar.  │
│                                     │
│ [INICIAR AGORA] 🚀                  │
└─────────────────────────────────────┘
```

---

## 🔐 Gestão de Senhas (Admin Only)

### Interface: /instructor/students (Admin)
```
┌─────────────────────────────────────────────────────┐
│ GERENCIAR ALUNOS                                    │
├─────────────────────────────────────────────────────┤
│ 👤 João Silva                                       │
│    Email: joao.silva@pvo.mil.br                     │
│    Última atividade: 05/01/2026                     │
│    [RESETAR SENHA] [DESATIVAR]                      │
├─────────────────────────────────────────────────────┤
│ 👤 Maria Santos                                     │
│    Email: maria.santos@pvo.mil.br                   │
│    Última atividade: 06/01/2026                     │
│    [RESETAR SENHA] [DESATIVAR]                      │
└─────────────────────────────────────────────────────┘
```

Ao clicar em [RESETAR SENHA]:
```
┌─────────────────────────────────────┐
│ RESETAR SENHA - João Silva          │
├─────────────────────────────────────┤
│ Nova Senha: [●●●●●●●●]              │
│ Confirmar:  [●●●●●●●●]              │
│                                     │
│ ☑️ Forçar troca no próximo login     │
│                                     │
│ [CANCELAR] [RESETAR SENHA]          │
└─────────────────────────────────────┘
```

---

## 🚀 Implementação Técnica

### 1. Backend (Supabase)
- ✅ Criar tabelas `scheduled_tests` e `test_attempts`
- ✅ Criar RLS (Row Level Security) policies
- ✅ Criar funções para liberar/encerrar provas
- ✅ Criar trigger para atualizar status automaticamente

### 2. Frontend - Instrutor
- Página `/instructor/tests` - Lista de provas
- Página `/instructor/tests/create` - Criar prova
- Página `/instructor/tests/:id` - Detalhes e controle da prova
- Página `/instructor/students` - Gerenciar alunos (Admin)

### 3. Frontend - Aluno
- Dashboard mostrando próxima prova com contador
- Botão "INICIAR" só aparece quando prova está liberada
- Interface de prova (já existe, só adaptar)
- Salvar respostas em tempo real

### 4. Segurança
- ✅ Aluno só vê suas próprias provas
- ✅ Aluno só pode iniciar se prova estiver `is_active = true`
- ✅ Admin tem acesso total
- ✅ Instrutor gerencia suas provas

---

## 📊 Benefícios

✅ **Controle Total** - Instrutor decide quando liberar
✅ **Justiça** - Todos fazem ao mesmo tempo
✅ **Segurança** - Senhas gerenciadas pelo Admin
✅ **Rastreabilidade** - Registro completo de todas as tentativas
✅ **Presencial** - Sistema perfeito para sala de aula
✅ **Mobile-First** - Funciona perfeitamente em celulares

---

## 🎯 O QUE VOCÊ ACHA?

Essa estrutura atende suas necessidades? 

**Próximos Passos:**
1. Criar as tabelas no Supabase
2. Implementar interface de criação de provas (Instrutor)
3. Implementar dashboard do aluno com contador
4. Implementar gestão de senhas (Admin)
5. Sistema de liberação manual

**Posso começar agora mesmo! Quer que eu implemente?** 🚀
