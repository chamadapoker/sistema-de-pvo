# Script de Migração - Sistema Antigo para Supabase

## 📊 Dados Encontrados no Sistema Antigo

### Estrutura de Pastas:
- **Pasta 1**: 11 equipamentos
- **Pasta 2**: 14 equipamentos  
- **Pasta 3**: 1 equipamento
- **Pasta 4**: 1 equipamento
- **Pasta 5**: 13 equipamentos
- **Pasta 6**: 29 equipamentos
- **Pasta 7**: (vazio)
- **Pasta 8**: 18 equipamentos
- **Bitmaps**: 169 imagens de interface
- **MDB**: 1 banco de dados (Pvo.mdb)
- **fichas gif**: 44 fichas

### Total Estimado:
- **~3.000+ imagens de equipamentos** (baseado na nomenclatura 1P00101.jpg até 1P09704.jpg)
- **Banco de dados Access** com informações dos equipamentos

## 🔄 Processo de Migração

### Etapa 1: Extrair Dados do Access Database
1. Ler arquivo `Pvo.mdb`
2. Extrair informações de equipamentos
3. Mapear categorias

### Etapa 2: Upload de Imagens para Supabase Storage
1. Criar bucket `equipment-images`
2. Upload de todas as imagens JPG
3. Manter estrutura de pastas (categoria/imagem.jpg)

### Etapa 3: Popular Banco de Dados Supabase
1. Inserir categorias
2. Inserir equipamentos com referências às imagens
3. Criar relacionamentos

## 📝 Mapeamento de Categorias

Baseado na estrutura de pastas:
- Pasta 1 → Categoria 1 (Tanques)
- Pasta 2 → Categoria 2 (Veículos Blindados)
- Pasta 3 → Categoria 3 (Artilharia)
- Pasta 4 → Categoria 4 (Aeronaves)
- Pasta 5 → Categoria 5 (Helicópteros)
- Pasta 6 → Categoria 6 (Navios)
- Pasta 7 → Categoria 7 (Mísseis)
- Pasta 8 → Categoria 8 (Outros)

## 🚀 Próximos Passos

1. ✅ Criar script Python para ler o banco Access
2. ✅ Criar script para upload em massa de imagens
3. ✅ Criar script SQL para popular o Supabase
4. ⏳ Executar migração
5. ⏳ Validar dados migrados

---

**Nota**: A migração completa será feita amanhã junto com a integração do Supabase.
