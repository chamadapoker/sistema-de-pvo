# PVO POKER - Sistema de Fichas Técnicas e Países

## 📋 Fichas Técnicas de Equipamentos

### Conceito
Cada equipamento militar deve ter uma ficha técnica completa com especificações detalhadas.

### Estrutura da Ficha Técnica
```typescript
interface TechnicalSheet {
  // Identificação
  name: string;                    // Nome do equipamento
  code: string;                    // Código/Designação
  category: string;                 // Categoria (Aeronaves, Blindados, etc)
  country: string;                  // País de origem
  
  // Especificações Técnicas
  manufacturer: string;             // Fabricante
  yearIntroduced: number;          // Ano de introdução
  status: string;                   // Status (Ativo, Obsoleto, etc)
  
  // Dimensões e Peso
  length?: string;                  // Comprimento
  width?: string;                   // Largura
  height?: string;                  // Altura
  wingspan?: string;                // Envergadura (aviões)
  weight?: string;                  // Peso
  
  // Performance
  maxSpeed?: string;                // Velocidade máxima
  range?: string;                   // Alcance
  ceiling?: string;                 // Teto de serviço (aviões)
  armament?: string[];              // Armamento
  
  // Operacional
  crew?: number;                    // Tripulação
  capacity?: string;                // Capacidade de carga/passageiros
  
  // Usuários
  operators: string[];              // Países que operam
  
  // Descrição
  description: string;              // Descrição detalhada
  
  // Multimídia
  images: string[];                 // Array de URLs de imagens
  videos?: string[];                // Vídeos (opcional)
}
```

### Como Preencher Automaticamente

**Opção 1: IA Vision (Recommended)**
Posso ajudar a criar fichas técnicas se você me fornecer:
1. Nome do equipamento de uma foto
2. Eu busco dados em fontes públicas (Wikipedia, Jane's, etc)
3. Gero a ficha técnica estruturada

**Opção 2: Script de Mineração**
```python
# Script para buscar dados de equipamentos
import requests
from bs4 import BeautifulSoup

def get_equipment_data(equipment_name):
    # Buscar na Wikipedia
    wiki_url = f"https://pt.wikipedia.org/wiki/{equipment_name}"
    # Parse e extração de dados
    # Retornar ficha técnica
    pass
```

**Opção 3: Base de Dados Jane's / GlobalSecurity**
- Usar APIs ou scraping de sites especializados
- Jane's Defence Weekly
- GlobalSecurity.org
- Military-Today.com

---

## 🌍 Sistema de Estudo por Países

### Conceito
Permitir aos alunos estudar equipamentos militares organizados por país, com informações geográficas e demográficas.

### Estrutura de Dados - Países

```typescript
interface Country {
  // Básico
  id: string;
  name: string;
  flag: string;                     // URL da bandeira
  code: string;                     // Código ISO (BR, US, AR, etc)
  
  // Geografia
  region: string;                   // América do Sul, Europa, Ásia, etc
  mapCoordinates: {
    latitude: number;
    longitude: number;
  };
  borderCountries: string[];        // Países vizinhos
  
  // Demografia
  population: number;
  capital: string;
  languages: string[];
  currency: string;
  
  // Militar
  militaryBudget?: string;
  activeMilitary?: number;
  reserveMilitary?: number;
  
  // Equipamentos
  equipmentIds: number[];           // IDs dos equipamentos que o país opera
  
  // Descrição
  description: string;
  history: string;
}
```

### Funcionalidades Propostas

#### 1. **Página de Países** (`/student/countries`)
- Grid de cards com bandeiras de países
- Filtros por região (América do Sul, Europa, Ásia, África, Oceania)
- Busca por nome

#### 2. **Página de Detalhes do País** (`/student/countries/:id`)
- **Seção 1 - Informações Gerais**
  - Mapa com localização
  - Bandeira grande
  - População, idioma, capital
  - Países vizinhos

- **Seção 2 - Forças Armadas**
  - Orçamento militar
  - Efetivos (ativos + reserva)
  - Principais alianças (NATO, etc)

- **Seção 3 - Arsenal Militar**
  - Grid de equipamentos que o país opera
  - Filtrado por categoria
  - Cards com foto e nome
  - Click para ver ficha técnica

#### 3. **Comparação de Países**
- Selecionar 2-3 países
- Comparar lado a lado:
  - População vs Orçamento Militar
  - Quantidade de equipamentos por categoria
  - Gráficos comparativos

### Implementação Sugerida

```
/student/countries
├── Grid de países (cards com bandeira)
├── Filtro por região
└── Busca

/student/countries/:countryId
├── Header (Bandeira, Nome, Mapa)
├── Tabs:
│   ├── Informações Gerais
│   ├── Forças Armadas
│   ├── Aeronaves
│   ├── Blindados
│   ├── Navios
│   └── Outros Equipamentos
```

### Fontes de Dados

**Geografia e Demografia:**
- REST Countries API (https://restcountries.com/)
- World Bank Open Data
- CIA World Factbook

**Dados Militares:**
- Global Firepower (https://www.globalfirepower.com/)
- SIPRI Military Expenditure Database
- Jane's Defence Budgets

---

## 🎯 Roadmap de Implementação

### Fase 1: Fichas Técnicas ✅
- [x] Estrutura do banco de dados
- [ ] Interface de visualização
- [ ] Sistema de edição (Instrutor/Admin)
- [ ] Mineração de dados (script)

### Fase 2: Sistema de Países 🚧
- [ ] Tabela `countries` no Supabase
- [ ] Página de listagem de países
- [ ] Página de detalhes do país
- [ ] Integração com equipamentos
- [ ] Sistema de filtros

### Fase 3: Features Avançadas 🔮
- [ ] Comparação de países
- [ ] Mapas interativos
- [ ] Visualização de alianças militares
- [ ] Timeline histórico de conflitos
- [ ] Quiz por país

---

## 💡 Próximos Passos

1. **Você pode me fornecer exemplos** de fichas técnicas da pasta "fichas gif ods equipamentos"
2. **Eu posso criar um script** que preenche automaticamente as fichas técnicas
3. **Implementar o sistema de países** como uma nova feature completa

**Quer que eu comece por qual parte?**
- A) Criar script para preencher fichas técnicas
- B) Implementar sistema de países
- C) Ambos em paralelo
