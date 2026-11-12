# Safra Viva

## Sobre o projeto

O **Safra Viva** é o protótipo de um sistema de gerenciamento de produção agrícola, desenvolvido para praticar **HTML5, CSS3 e JavaScript**. O sistema é funcional: o usuário cadastra os seus próprios dados, que ficam salvos no navegador (localStorage). O projeto apresenta uma página inicial, páginas sobre produção, cronograma, pragas, fertilizantes, custos, ganho futuro, maquinário, fornecedores e um formulário de cadastro de safra.

## Tecnologias utilizadas

- **HTML5:** estruturação das páginas, tabelas, listas, links e formulário.
- **CSS3:** estilização de cores, textos, espaçamentos, tabelas, menu de navegação e rodapé, com um arquivo de CSS externo para cada página.
- **JavaScript:** `js/dados.js` (salva os dados e faz os cálculos, comum a todas as páginas) e um arquivo JavaScript para cada página.

## Funcionalidades

- Página inicial de apresentação do Safra Viva.
- Menu de navegação entre as 10 páginas.
- Tipo de produção e manejo utilizado em cada talhão.
- Cronograma de produção com etapas, datas e situação.
- Controle de pragas e de fertilizantes: o que possui, o que precisa, o que falta e quanto custa.
- Custo de produção por categoria e por hectare.
- Ganho futuro com base no valor da safra, em três cenários.
- Maquinário disponível e controle de revisões.
- Lista de fornecedores de sementes, fertilizantes e defensivos.
- Cadastro de safras, produtos, etapas, máquinas e fornecedores, com adição e remoção.
- Cálculos automáticos de falta de estoque, custo, receita, lucro e preço de equilíbrio.
- Botões **Começar do zero** e **Restaurar exemplos** na página inicial.

> **Observação:** os dados ficam salvos somente no navegador do usuário (localStorage), sem servidor. Ao abrir pela primeira vez, o site mostra dados fictícios de exemplo.

## Estrutura do projeto

```text
safra-viva/
├── html/
│   ├── home.html         # Página inicial
│   ├── producao.html      # Tipo de produção e manejo
│   ├── cronograma.html    # Cronograma de produção
│   ├── pragas.html        # Controle de pragas
│   ├── fertilizantes.html # Controle de fertilizantes
│   ├── custos.html        # Custo de produção
│   ├── ganho.html         # Ganho futuro
│   ├── maquinario.html    # Maquinário disponível
│   ├── fornecedores.html  # Lista de fornecedores
│   └── cadastro.html      # Formulário de cadastro de safra
├── css/
│   ├── home.css          # Estilo da página inicial
│   ├── producao.css
│   ├── cronograma.css
│   ├── pragas.css
│   ├── fertilizantes.css
│   ├── custos.css
│   ├── ganho.css
│   ├── maquinario.css
│   ├── fornecedores.css
│   └── cadastro.css       # Cada página tem o seu CSS externo
├── js/
│   ├── dados.js           # Parte comum: dados, cálculos e funções úteis
│   ├── insumos.js         # Parte comum de Pragas e Fertilizantes
│   └── home.js, producao.js, cronograma.js, pragas.js, fertilizantes.js,
│       custos.js, ganho.js, maquinario.js, fornecedores.js, cadastro.js
└── img/
    └── campo.svg          # Banner do cabeçalho
```

## Como executar

1. Baixe ou clone o repositório.
2. Abra a pasta do projeto no Visual Studio Code ou em outro editor.
3. Abra o arquivo `html/home.html` no navegador.
4. Utilize o menu para acessar as demais páginas.

Recomenda-se usar a extensão **Live Server** do Visual Studio Code (ou o Chrome/Edge), pois alguns navegadores não compartilham o armazenamento entre páginas abertas direto do arquivo.

## Objetivo

Forncer uma platafroma de gerenciamento agrícola em que o produtor veja tudo que possui para um melhor gerenciamento 
