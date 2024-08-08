# Guia de Gerenciamento de Branches

### `main`
- **Descrição**: Contém o código de produção, refletindo o estado mais estável do projeto.
- **Uso**: Atualizações são feitas através de merges da `release/` ao final de cada ciclo de lançamento.

### `develop`
- **Descrição**: Utilizada para o desenvolvimento diário e integração de novas funcionalidades.
- **Uso**: Serve como branch base para desenvolvimento, onde todas as funcionalidades e correções são desenvolvidas e testadas.

### `release/`
- **Descrição**: Prepara o próximo lançamento, permitindo ajustes finais e correções de bugs antes de migrar para `main`.
- **Nomenclatura**: `release/vX.Y`, por exemplo, `release/v1.0`.
- **Uso**: Criada a partir de `develop` quando o projeto atinge um ponto estável e está pronto para um novo lançamento. Depois dos ajustes e testes finais, é mesclada para `main` e de volta para `develop`.

### `hotfix/`
- **Descrição**: Corrige bugs críticos em produção que não podem aguardar um novo ciclo de lançamento.
- **Nomenclatura**: `hotfix/nome-do-problema`, por exemplo, `hotfix/critical-login-issue`.
- **Uso**: Criada diretamente de `main`, e após a correção e os testes, é mesclada em `main` e `develop`.

## Tipos de Branches e Uso

### Funcionalidades e Correções (`feature/` e `bugfix/`)
- **Descrição**: Utilizados para adicionar novas funcionalidades ou corrigir bugs.
- **Nomenclatura**: `feature/nome-da-funcionalidade` ou `bugfix/nome-do-bug`, por exemplo, `feature/add-login` ou `bugfix/fix-login`.
- **Procedimento**: Criar a partir de `develop`, desenvolver e testar a mudança. Após completar, realizar uma revisão em pares e mesclar de volta para `develop`.

## Procedimentos de Revisão e Testes

- **Revisão em Pares**: Cada nova funcionalidade ou correção deve ser revisada pelo outro membro da equipe antes de ser integrada à `develop`.
- **Testes**: Executar testes manualmente para validar todas as mudanças antes do merge. Garantir que `develop` esteja sempre em um estado funcional.

## Fluxo de Trabalho Recomendado

- **Início do Desenvolvimento**: Trabalhar diretamente na `develop` para tarefas menores ou criar uma nova `feature/` ou `bugfix/` para mudanças mais significativas.
- **Preparação de Lançamento**: Quando estiver pronto para um lançamento, transferir para a branch `release/` e iniciar uma fase de teste e correção final.
- **Correção de Problemas Críticos**: Utilizar a `hotfix/` para problemas urgentes em produção.
- **Lançamento**: Após aprovação e testes finais na `release/`, mesclar para `main` e garantir que `develop` seja atualizada com as mudanças.
