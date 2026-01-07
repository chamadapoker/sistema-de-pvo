# Correção de Categorias e Dados PVO

Este arquivo explica como corrigir a categorização dos equipamentos no Supabase caso eles apareçam na categoria errada (ex: tudo na Categoria 1).

## O Problema
Devido a uma configuração inicial incorreta, muitos equipamentos foram importados para a "Categoria 1" (Aeronaves) mesmo pertencendo a outras categorias (Helicópteros, Navios, etc.).

## A Solução
Foi criado um script automático que:
1. Atualiza os nomes das categorias para os corretos (1=Aeronaves, 2=Helicópteros, etc).
2. Move os equipamentos para a categoria certa baseando-se no nome do arquivo (ex: `2P...` vai para Categoria 2).
3. Remove duplicatas que possam ter sido criadas.

## Como Usar

1. Abra o terminal na pasta `scripts`:
   ```powershell
   cd "C:\Users\Yoda\Downloads\DVD PVO 2010\PVO-Modern\scripts"
   ```

2. Execute o script de correção:
   ```powershell
   python fix_categories_and_data.py
   ```

3. Aguarde a mensagem "✅ Correção Concluída!".

## Quando Usar
- Se você perceber que novas imagens estão indo para a categoria errada.
- Após o término da migração completa, para garantir que tudo está 100% organizado.
