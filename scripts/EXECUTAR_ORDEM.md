# 📋 SCRIPTS SQL - ORDEM DE EXECUÇÃO

Execute estes scripts no Supabase SQL Editor na ordem:

## ✅ 1. EXECUTADO
- `create_scheduled_tests_tables.sql` - Já executado com sucesso

## ⏳ 2. EXECUTAR AGORA (Nesta ordem)

### A) add_test_whitelist.sql
**O que faz:**
- Cria tabela `test_allowed_students` (whitelist)
- Funções para segunda chamada
- Atualiza policies de visualização

**Copiar e colar no SQL Editor do Supabase**

---

### B) create_written_test_system.sql
**O que faz:**
- Adiciona coluna `test_type` (WRITTEN vs MULTIPLE_CHOICE)
- Cria tabela `test_questions` (slides/fotos da prova)
- Cria tabela `student_answers` (respostas digitadas)
- Funções para correção manual

**Copiar e colar no SQL Editor do Supabase**

---

## ✅ Verificação

Após executar, verificar se as tabelas foram criadas:

```sql
-- Ver todas as tabelas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Deve mostrar:
-- - scheduled_tests ✓
-- - test_attempts ✓
-- - test_allowed_students ✓
-- - test_questions ✓
-- - student_answers ✓
```

## 🎯 Próximo Passo

Após executar os SQLs, continuar com:
1. Atualizar testService.ts
2. Implementar interface de seleção de fotos
3. Interface da prova para aluno
4. Interface de correção

---

**Executar os 2 scripts SQL agora para continuar!** ✅
