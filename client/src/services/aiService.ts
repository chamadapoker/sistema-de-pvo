import { GoogleGenerativeAI } from "@google/generative-ai";

// ATENÇÃO: Em produção, isso deve vir de variáveis de ambiente (.env)
// VITE_GEMINI_API_KEY=...
// Por enquanto usaremos a chave hardcoded para facilitar o teste imediato
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhb2JvZ2dlcWhrc2F4a3V1ZGFwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzY2NjU0MCwiZXhwIjoyMDgzMjQyNTQwfQ.Fxi5q3ZTa-jF5oKneuxwh_J_CZ1qkhEJNrb5d18X9NQ";

// OBS: Essa chave acima parece ser do Supabase e não do Gemini.
// Vou usar a chave correta do Gemini que você forneceu anteriormente nos scripts Python se disponível,
// ou pedir para configurar.
// Vou configurar uma estrutura segura que tenta ler do .env primeiro.

const GEN_AI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_KEY_HERE";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEN_AI_KEY);

export const aiService = {
    async getTacticalIntel(equipmentName: string, category: string, country: string, userQuery?: string): Promise<string> {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

            let prompt = "";

            if (userQuery) {
                // Modo Pergunta Específica (Custom Request)
                prompt = `
                    ATUE COMO UM OFICIAL DE INTELIGÊNCIA MILITAR SÊNIOR.
                    RESPONDA SEMPRE EM PORTUGUÊS (PT-BR).
                    
                    OBJETIVO DA MISSÃO: Responder a uma solicitação específica de inteligência sobre o equipamento: ${equipmentName} (${category} - ${country}).
                    
                    SOLICITAÇÃO DO COMANDANTE (USUÁRIO): "${userQuery}"
                    
                    Forneça uma resposta detalhada, técnica e direta focada EXCLUSIVAMENTE na solicitação acima.
                    Use terminologia militar adequada.
                    Se a pergunta for sobre comparação, capacidade específica ou histórico, foque nisso.
                    
                    Formato: Markdown.
                `;
            } else {
                // Modo Relatório Padrão (Default Report)
                prompt = `
            ATUE COMO UM OFICIAL DE INTELIGÊNCIA MILITAR SÊNIOR.
            RESPONDA SEMPRE EM PORTUGUÊS (PT-BR).
            
            Gere um RELATÓRIO DE INTELIGÊNCIA TÁTICA (INTEL REPORT) sobre o seguinte equipamento:
            Equipamento: ${equipmentName}
            Categoria: ${category}
            País de Origem/Operador: ${country}

            O relatório deve ser IMPARCIAL, TÉCNICO e OBJETIVO. Use markdown.
            
            Estrutura Obrigatória:
            
            ### 1. PERFIL OPERACIONAL
            Analise a doutrina de uso desse equipamento. Para que ele foi criado? Qual a filosofia de combate dele?

            ### 2. PONTOS FORTES E VULNERABILIDADES
            *   **Forças:** (Ex: Alcance superior, blindagem reativa, discrição radar)
            *   **Fraquezas:** (Ex: Assinatura térmica alta, baixa mobilidade, dependência logística)

            ### 3. CONFLITOS RECENTES & PERFORMANCE REAL
            Liste onde esse equipamento (ou variantes dele) foi usado recentemente (ex: Ucrânia, Oriente Médio) e como ele se comportou. Se não houver uso recente, cite conflitos históricos relevantes.

            ### 4. CONTRAMEDIDAS RECOMENDADAS
            Como uma força inimiga deve engajar este equipamento? (Ex: "Atacar pelos flancos", "Usar jamming eletrônico").

            ---
            Finalize com uma conclusão de uma linha: "VEREDITO: [Alta/Média/Baixa] Ameaça em cenário convencional."
          `;
            }

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Erro ao gerar INTEL:", error);
            throw new Error("Falha na comunicação com o Centro de Inteligência (IA API Error).");
        }
    },

    async compareEquipment(itemA: string, itemB: string): Promise<string> {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

            const prompt = `
        ATUE COMO UM ANALISTA DE DEFESA.
        RESPONDA SEMPRE EM PORTUGUÊS (PT-BR).

        Realize uma SIMULAÇÃO DE COMBATE E COMPARAÇÃO TÉCNICA entre:
        
        LADO AZUL: ${itemA}
        LADO VERMELHO: ${itemB}

        Gere uma análise comparativa direta ("Head-to-Head").

        ### 1. COMPARAÇÃO DIRETA
        Compare em tabela ou tópicos: Armamento, Alcance, Mobilidade/Velocidade e Proteção.

        ### 2. SIMULAÇÃO DE ENGAJAMENTO
        Descreva um cenário hipotético de encontro entre eles. Quem tem a vantagem da "Primeira Visualização"? Quem tem a vantagem do "Primeiro Disparo"?

        ### 3. CAMPO DE BATALHA
        Em que terreno o Item A vence? Em que terreno o Item B vence?

        ### 4. VEREDITO FINAL
        Quem venceria em um duelo x1 estatisticamente?
      `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("Erro ao comparar:", error);
            throw new Error("Falha na simulação de combate.");
        }
    }
};
