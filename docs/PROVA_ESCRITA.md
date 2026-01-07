# 📝 Sistema de Prova Escrita - PVO POKER

## 🎯 Conceito Principal

Sistema onde o instrutor seleciona fotos específicas, o aluno digita as respostas, e o instrutor corrige manualmente.

---

## 🔄 Fluxo Completo

### **1️⃣ INSTRUTOR - Criar Prova**

```
┌─────────────────────────────────────────────────┐
│ CRIAR NOVA PROVA ESCRITA                        │
├─────────────────────────────────────────────────┤
│ Título: [Avaliação Aeronaves - Janeiro]        │
│ Data: [10/01/2026] Hora: [14:00]               │
│ Tipo: ● PROVA ESCRITA  ○ Múltipla Escolha     │
│                                                 │
│ ┌─────────────────────────────────────────┐    │
│ │ SELECIONAR FOTOS DA PROVA               │    │
│ │                                         │    │
│ │ Categoria: [Aeronaves ▼]                │    │
│ │                                         │    │
│ │ Equipamentos Disponíveis:               │    │
│ │ ☐ F-16 Fighting Falcon                  │    │
│ │ ☐ MIG-29 Fulcrum                        │    │
│ │ ☐ Su-27 Flanker                         │    │
│ │ ☐ F/A-18 Hornet                         │    │
│ │ ... (1600+ equipamentos)                │    │
│ │                                         │    │
│ │ [Buscar...]                             │    │
│ └─────────────────────────────────────────┘    │
│                                                 │
│ Fotos Selecionadas: 15                         │
│ 1. F-16 Fighting Falcon (foto 1)               │
│ 2. MIG-29 Fulcrum (foto 3)                     │
│ 3. Su-27 Flanker (foto 2)                      │
│ ... [Reordenar ↕]                               │
│                                                 │
│ [CANCELAR] [CRIAR PROVA] ✅                     │
└─────────────────────────────────────────────────┘
```

**Interface de Seleção de Fotos:**
- Grid visual com thumbnails
- Checkbox para selecionar
- Preview da foto ao clicar
- Arrastar para reordenar
- Indicador: "15/20 fotos selecionadas"

---

### **2️⃣ ALUNO - Fazer Prova**

```
┌─────────────────────────────────────────────────┐
│ AVALIAÇÃO AERONAVES - JANEIRO                   │
│ Questão 1 de 15                    ⏱️ 00:45     │
├──────────────────────────────────────────────── │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │                                        │    │
│  │                                        │    │
│  │         [FOTO DO EQUIPAMENTO]          │    │
│  │           (F-16 Fighting Falcon)       │    │
│  │                                        │    │
│  │                                        │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  Digite o nome do equipamento:                 │
│  ┌────────────────────────────────────────┐    │
│  │ F-16                              [✓]  │    │
│  └────────────────────────────────────────┘    │
│  ✓ Auto-salvando...                            │
│                                                 │
│  [← ANTERIOR]              [PRÓXIMA →]         │
│                                                 │
│  Progresso: ███████░░░░░░░░░ 7/15              │
└─────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Campo de texto auto-foco
- ✅ Auto-save a cada 3 segundos
- ✅ Salva ao pressionar Enter
- ✅ Navegação livre (pode voltar)
- ✅ Timer total da prova
- ✅ Indicador de progresso
- ✅ Botão "FINALIZAR PROVA" no final

---

### **3️⃣ INSTRUTOR - Corrigir Provas**

```
┌─────────────────────────────────────────────────┐
│ CORREÇÃO DE PROVAS                              │
├─────────────────────────────────────────────────┤
│                                                 │
│ 📋 Avaliação Aeronaves - Janeiro                │
│    15 questões | 20 alunos | 12 corrigidas     │
│    [VER PENDENTES: 8 PROVAS]                    │
│                                                 │
├─────────────────────────────────────────────────┤
│ Corrigir Prova de: João Silva                  │
│                                                 │
│ Questão 1 de 15                [PRÓXIMA →]      │
│                                                 │
│  ┌────────────────────────────────────────┐    │
│  │    [FOTO: F-16 Fighting Falcon]        │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  Resposta Esperada:                            │
│  └─ F-16 Fighting Falcon                        │
│                                                 │
│  Resposta do Aluno:                            │
│  └─ F-16                                        │
│                                                 │
│  Avaliação:                                    │
│  ● CORRETO ✅   ○ INCORRETO ❌   ○ PARCIAL      │
│                                                 │
│  Pontos: [1.0] / 1.0                           │
│                                                 │
│  Feedback (opcional):                          │
│  ┌────────────────────────────────────────┐    │
│  │ Resposta aceita. Poderia ter incluído  │    │
│  │ "Fighting Falcon" completo.            │    │
│  └────────────────────────────────────────┘    │
│                                                 │
│  [SALVAR E PRÓXIMA]                            │
│                                                 │
│  Progresso: ██████░░░░░░░░░ 6/15               │
└─────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ✅ Ver foto + resposta lado a lado
- ✅ Atalhos de teclado:
  - `1` = Correto
  - `0` = Incorreto
  - `Enter` = Salvar e próxima
- ✅ Pontuação parcial (0.5 pontos)
- ✅ Feedback opcional
- ✅ Navegação livre
- ✅ Auto-cálculo da nota final

---

## 📊 Estrutura de Dados

### **test_questions** (Questões da Prova)
```typescript
{
  id: UUID,
  test_id: UUID,
  equipment_id: number,      // Qual equipamento
  question_number: number,   // Ordem (1, 2, 3...)
  points: 1.0,              // Quanto vale
  created_at: timestamp
}
```

### **student_answers** (Respostas)
```typescript
{
  id: UUID,
  attempt_id: UUID,
  question_id: UUID,
  
  // RESPOSTA
  answer_text: "F-16",      // O que o aluno digitou
  
  // CORREÇÃO (NULL até instrutor corrigir)
  is_correct: null | true | false,
  points_earned: 1.0,       // Pode ser 0.5 (parcial)
  instructor_feedback: "...",
  corrected_by: UUID,
  corrected_at: timestamp,
  
  // TEMPO
  time_spent: 45,           // segundos
  answered_at: timestamp
}
```

---

## 🎮 Interface de Seleção de Fotos

```typescript
// Estado da criação de prova
interface CreateTestState {
  // Básico
  title: string;
  date: string;
  testType: 'WRITTEN' | 'MULTIPLE_CHOICE';
  
  // Seleção de fotos
  selectedCategory: number | null;
  selectedEquipments: Equipment[];
  
  // Busca
  searchTerm: string;
  availableEquipments: Equipment[];
}

// Grid de equipamentos
<div className="grid grid-cols-4 gap-4">
  {availableEquipments.map(equipment => (
    <div 
      className={`card ${selectedEquipments.includes(equipment) ? 'border-green-500' : ''}`}
      onClick={() => toggleEquipment(equipment)}
    >
      <img src={equipment.imagePath} />
      <p>{equipment.name}</p>
      {selected && <CheckIcon />}
    </div>
  ))}
</div>

// Lista de selecionados (reordenável)
<DragDropContext onDragEnd={handleReorder}>
  <Droppable>
    {selectedEquipments.map((eq, index) => (
      <Draggable key={eq.id} index={index}>
        <div>
          {index + 1}. {eq.name}
          <button onClick={() => remove(eq)}>×</button>
        </div>
      </Draggable>
    ))}
  </Droppable>
</DragDropContext>
```

---

## 🚀 Funções Principais

### **Backend (SQL)**
```sql
-- Criar questões da prova
INSERT INTO test_questions (test_id, equipment_id, question_number)
VALUES ...

-- Salvar resposta do aluno (auto-save)
INSERT INTO student_answers (attempt_id, question_id, answer_text)
VALUES ... ON CONFLICT UPDATE ...

-- Corrigir resposta
UPDATE student_answers SET
  is_correct = true,
  points_earned = 1.0,
  instructor_feedback = '...',
  corrected_by = $INSTRUCTOR_ID
WHERE id = $ANSWER_ID

-- Calcular nota final
SELECT calculate_written_test_score($ATTEMPT_ID)
```

### **Frontend (Service)**
```typescript
// Criar prova com questões
testService.createTestWithQuestions({
  ...testData,
  questions: selectedEquipments.map((eq, idx) => ({
    equipment_id: eq.id,
    question_number: idx + 1,
    points: 1.0
  }))
})

// Salvar resposta (auto-save)
testService.saveAnswer(attemptId, questionId, answerText)

// Corrigir resposta
testService.correctAnswer(answerId, {
  is_correct: true,
  points_earned: 1.0,
  feedback: "..."
})
```

---

## ✅ Status Implementação

**SQL:**
- ✅ Tabelas criadas
- ✅ Funções RPC criadas
- ✅ RLS configurado

**Service:**
- ⏳ Adicionar funções ao testService.ts

**Interface:**
- ⏳ Seleção de fotos (criar prova)
- ⏳ Interface da prova (aluno)
- ⏳ Interface de correção (instrutor)

---

## 🎯 Próximos Passos

1. Executar SQL no Supabase
2. Atualizar testService.ts
3. Criar interface de seleção de fotos
4. Criar interface da prova para aluno
5. Criar interface de correção para instrutor

**Quer que eu comece a implementar? 🚀**
