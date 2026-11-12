/* 
   Projeto Safra Viva
   Parte COMUM a todas as páginas (carregue este arquivo ANTES do js da página):
   1. guarda os dados do cliente no navegador (localStorage);
   2. faz os cálculos (falta, custo, receita, lucro, revisão);
   3. funções úteis (formatar moeda, datas, proteger texto). */

const CHAVE = 'safraViva';
const DIA = 24 * 60 * 60 * 1000;
const STATUS_MAQUINA = ['Disponível', 'Em uso', 'Em manutenção'];


/* ---------- 1. Funções úteis ---------- */

function $(id) {
  return document.getElementById(id);
}

// protege o HTML: o que o cliente digita nunca vira código da página
function esc(texto) {
  return String(texto == null ? '' : texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const formatoMoeda2 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatoNumero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });

function moeda(valor) { return formatoMoeda.format(Math.round(valor || 0)); }
function moeda2(valor) { return formatoMoeda2.format(valor || 0); }
function numero(valor) { return formatoNumero.format(valor || 0); }

function soma(lista, funcao) {
  return lista.reduce(function (total, item) { return total + funcao(item); }, 0);
}

// lê um campo de número; se estiver vazio, devolve 0
function lerNumero(id) {
  const n = parseFloat($(id).value);
  return isNaN(n) ? 0 : n;
}

function mensagem(id, texto, erro) {
  $(id).innerHTML = '<p class="msg' + (erro ? ' msg-erro' : '') + '">' + texto + '</p>';
}

/* datas */
const hoje = new Date();
hoje.setHours(0, 0, 0, 0);

function somaDias(base, n) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

function dataISO(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function lerData(iso) {
  const p = iso.split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
}

function formatarData(iso) {
  const p = iso.split('-');
  return p[2] + '/' + p[1] + '/' + p[0];
}


/* ---------- 2. Dados: exemplo, vazio, salvar e carregar ---------- */

function dadosExemplo() {
  function etapa(id, nome, a, b) {
    return { id: id, nome: nome, inicio: dataISO(somaDias(hoje, a)), fim: dataISO(somaDias(hoje, b)) };
  }

  return {
    proximoId: 100,
    exemplo: true,
    fazenda: 'Fazenda Boa Esperança',
    selecionada: 1,
    safras: [
      {
        id: 1, talhao: 'Talhão A · Várzea', cultura: 'Soja', area: 42, solo: 'Argiloso', manejo: 'Plantio direto',
        unidade: 'sc', produtividade: 62, preco: 112, observacoes: '',
        custos: { sementes: 17640, maoDeObra: 14000, combustivel: 8200, manutencao: 5400, outros: 18000 },
        etapas: [
          etapa(1, 'Preparo e calagem', -28, -10),
          etapa(2, 'Plantio e adubação de base', -9, 5),
          etapa(3, 'Controle de plantas daninhas', 15, 25),
          etapa(4, 'Controle de pragas e doenças', 30, 95),
          etapa(5, 'Colheita', 125, 150)
        ]
      },
      {
        id: 2, talhao: 'Talhão B · Encosta', cultura: 'Milho', area: 30, solo: 'Argilo-arenoso', manejo: 'Plantio direto',
        unidade: 'sc', produtividade: 135, preco: 56, observacoes: '',
        custos: { sementes: 23400, maoDeObra: 9000, combustivel: 7500, manutencao: 3900, outros: 12000 },
        etapas: [
          etapa(1, 'Preparo e calagem', -5, 10),
          etapa(2, 'Plantio', 11, 20),
          etapa(3, 'Controle de pragas', 25, 90),
          etapa(4, 'Adubação de cobertura', 35, 45),
          etapa(5, 'Colheita', 140, 165)
        ]
      },
      {
        id: 3, talhao: 'Talhão C · Alto', cultura: 'Café', area: 18, solo: 'Latossolo', manejo: 'Convencional',
        unidade: 'sc', produtividade: 28, preco: 1250, observacoes: '',
        custos: { sementes: 1800, maoDeObra: 95000, combustivel: 9000, manutencao: 8500, outros: 20000 },
        etapas: [
          etapa(1, 'Poda e tratos pós-colheita', -60, -30),
          etapa(2, 'Adubação parcelada', -20, 40),
          etapa(3, 'Controle de ferrugem e broca', 10, 120),
          etapa(4, 'Colheita', 230, 290)
        ]
      },
      {
        id: 4, talhao: 'Talhão D · Estufa', cultura: 'Hortaliças', area: 3, solo: 'Franco-arenoso', manejo: 'Orgânico irrigado',
        unidade: 'cx', produtividade: 1100, preco: 36, observacoes: '',
        custos: { sementes: 8400, maoDeObra: 22000, combustivel: 1400, manutencao: 2200, outros: 6000 },
        etapas: [
          etapa(1, 'Preparo dos canteiros', -30, -20),
          etapa(2, 'Transplante das mudas', -19, -12),
          etapa(3, 'Irrigação e tratos culturais', -11, 35),
          etapa(4, 'Controle biológico de pragas', -5, 30),
          etapa(5, 'Colheita', 36, 50)
        ]
      }
    ],
    insumos: [
      { id: 1, tipo: 'fertilizante', nome: 'Superfosfato simples', safraId: 1, unidade: 'kg', possui: 8000, precisa: 12600, preco: 2.85 },
      { id: 2, tipo: 'fertilizante', nome: 'Cloreto de potássio', safraId: 1, unidade: 'kg', possui: 6300, precisa: 6300, preco: 3.2 },
      { id: 3, tipo: 'fertilizante', nome: 'Calcário dolomítico', safraId: 1, unidade: 't', possui: 60, precisa: 84, preco: 145 },
      { id: 4, tipo: 'fertilizante', nome: 'NPK 04-14-08', safraId: 2, unidade: 'kg', possui: 1500, precisa: 9000, preco: 3.6 },
      { id: 5, tipo: 'fertilizante', nome: 'Ureia', safraId: 2, unidade: 'kg', possui: 0, precisa: 4500, preco: 3.9 },
      { id: 6, tipo: 'fertilizante', nome: 'NPK 20-05-20', safraId: 3, unidade: 'kg', possui: 5000, precisa: 9000, preco: 4.1 },
      { id: 7, tipo: 'fertilizante', nome: 'Composto orgânico', safraId: 4, unidade: 't', possui: 14, precisa: 15, preco: 220 },
      { id: 8, tipo: 'defensivo', nome: 'Herbicida glifosato', safraId: 1, unidade: 'L', possui: 90, precisa: 126, preco: 28 },
      { id: 9, tipo: 'defensivo', nome: 'Fungicida (triazol + estrobilurina)', safraId: 1, unidade: 'L', possui: 20, precisa: 42, preco: 185 },
      { id: 10, tipo: 'defensivo', nome: 'Inseticida piretroide', safraId: 1, unidade: 'L', possui: 0, precisa: 25, preco: 120 },
      { id: 11, tipo: 'defensivo', nome: 'Herbicida atrazina', safraId: 2, unidade: 'L', possui: 60, precisa: 60, preco: 32 },
      { id: 12, tipo: 'defensivo', nome: 'Inseticida para lagarta-do-cartucho', safraId: 2, unidade: 'L', possui: 5, precisa: 18, preco: 150 },
      { id: 13, tipo: 'defensivo', nome: 'Fungicida cúprico', safraId: 3, unidade: 'kg', possui: 40, precisa: 54, preco: 48 },
      { id: 14, tipo: 'defensivo', nome: 'Inseticida para broca-do-café', safraId: 3, unidade: 'L', possui: 10, precisa: 30, preco: 95 },
      { id: 15, tipo: 'defensivo', nome: 'Óleo de neem (biológico)', safraId: 4, unidade: 'L', possui: 8, precisa: 12, preco: 70 },
      { id: 16, tipo: 'defensivo', nome: 'Calda bordalesa', safraId: 4, unidade: 'kg', possui: 3, precisa: 6, preco: 22 }
    ],
    maquinas: [
      { id: 1, nome: 'Trator 4x4 de 110 cv', tipo: 'Trator', ano: 2019, horas: 3240, ultima: 3050, intervalo: 250, status: 'Em uso' },
      { id: 2, nome: 'Colheitadeira de grãos', tipo: 'Colheitadeira', ano: 2017, horas: 4810, ultima: 4500, intervalo: 500, status: 'Disponível' },
      { id: 3, nome: 'Plantadeira de 9 linhas', tipo: 'Plantadeira', ano: 2020, horas: 1260, ultima: 1100, intervalo: 250, status: 'Em uso' },
      { id: 4, nome: 'Pulverizador de barras 3.000 L', tipo: 'Pulverizador', ano: 2021, horas: 1890, ultima: 1650, intervalo: 250, status: 'Disponível' },
      { id: 5, nome: 'Distribuidor de calcário', tipo: 'Implemento', ano: 2018, horas: 760, ultima: 700, intervalo: 300, status: 'Disponível' },
      { id: 6, nome: 'Trator utilitário de 75 cv', tipo: 'Trator', ano: 2015, horas: 5210, ultima: 5000, intervalo: 250, status: 'Em manutenção' },
      { id: 7, nome: 'Irrigação por gotejamento', tipo: 'Irrigação', ano: 2022, horas: 2100, ultima: 2000, intervalo: 500, status: 'Em uso' }
    ],
    fornecedores: [
      { id: 1, nome: 'Sementes Planalto', categorias: ['Sementes'], contato: 'Marcos Tavares', telefone: '(44) 3555-0101', cidade: 'Cascavel · PR', prazo: 5, pagamento: '30/60 dias', nota: 5, produtos: 'Soja, milho e sorgo certificados' },
      { id: 2, nome: 'AgroSul Insumos', categorias: ['Fertilizantes', 'Defensivos'], contato: 'Patrícia Lemos', telefone: '(44) 3555-0142', cidade: 'Cascavel · PR', prazo: 3, pagamento: '30 dias', nota: 4, produtos: 'NPK, ureia, cloreto de potássio, herbicidas e fungicidas' },
      { id: 3, nome: 'Fertil Campo', categorias: ['Fertilizantes'], contato: 'Rogério Dias', telefone: '(43) 3555-0177', cidade: 'Londrina · PR', prazo: 7, pagamento: 'À vista, com 5% de desconto', nota: 4, produtos: 'Superfosfato, calcário e adubos foliares' },
      { id: 4, nome: 'Cooperativa Vale Verde', categorias: ['Sementes', 'Fertilizantes', 'Defensivos'], contato: 'Atendimento ao cooperado', telefone: '(44) 3555-0100', cidade: 'Toledo · PR', prazo: 2, pagamento: 'Pagamento na colheita', nota: 5, produtos: 'Linha completa de insumos com assistência técnica' },
      { id: 5, nome: 'Defensa Rural', categorias: ['Defensivos'], contato: 'Cláudio Prado', telefone: '(45) 3555-0199', cidade: 'Cascavel · PR', prazo: 4, pagamento: '30 dias', nota: 3, produtos: 'Inseticidas, acaricidas e adjuvantes' },
      { id: 6, nome: 'BioNatura Orgânicos', categorias: ['Sementes', 'Fertilizantes', 'Defensivos'], contato: 'Helena Corrêa', telefone: '(41) 3555-0123', cidade: 'Curitiba · PR', prazo: 6, pagamento: '30 dias', nota: 5, produtos: 'Sementes orgânicas, composto, óleo de neem e calda bordalesa' },
      { id: 7, nome: 'Mudas Serra Alta', categorias: ['Sementes'], contato: 'Jorge Nunes', telefone: '(35) 3555-0188', cidade: 'Varginha · MG', prazo: 10, pagamento: '50% no pedido e 50% na entrega', nota: 4, produtos: 'Mudas de café certificadas' }
    ]
  };
}

function dadosVazios() {
  return { proximoId: 100, exemplo: false, fazenda: 'Minha fazenda', selecionada: 0, safras: [], insumos: [], maquinas: [], fornecedores: [] };
}

let dados = carregar();

function carregar() {
  try {
    const texto = localStorage.getItem(CHAVE);
    if (texto) {
      const lido = JSON.parse(texto);
      if (lido && lido.safras && lido.insumos && lido.maquinas && lido.fornecedores) return lido;
    }
  } catch (erro) {
    /* sem armazenamento: usa os dados de exemplo só nesta página */
  }
  return dadosExemplo();
}

function salvar() {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(dados));
  } catch (erro) {
    /* ignora */
  }
}

function novoId() {
  dados.proximoId = dados.proximoId + 1;
  return dados.proximoId;
}

function armazenamentoFunciona() {
  try {
    localStorage.setItem('teste', '1');
    localStorage.removeItem('teste');
    return true;
  } catch (erro) {
    return false;
  }
}


/* ---------- 3. Cálculos ---------- */

function achar(lista, id) {
  return lista.find(function (item) { return item.id === Number(id); });
}

function nomeSafra(id) {
  const s = achar(dados.safras, id);
  return s ? s.cultura + ' · ' + s.talhao : 'Safra removida';
}

function safraSelecionada() {
  let s = achar(dados.safras, dados.selecionada);
  if (!s && dados.safras.length) {
    s = dados.safras[0];
    dados.selecionada = s.id;
  }
  return s;
}

function producaoTotal(s) { return s.area * s.produtividade; }
function receita(s) { return producaoTotal(s) * s.preco; }

function custoInsumos(s, tipo) {
  const lista = dados.insumos.filter(function (i) { return i.safraId === s.id && i.tipo === tipo; });
  return soma(lista, function (i) { return i.precisa * i.preco; });
}

function custoSafra(s) {
  const c = s.custos;
  return c.sementes + c.maoDeObra + c.combustivel + c.manutencao + c.outros +
    custoInsumos(s, 'fertilizante') + custoInsumos(s, 'defensivo');
}

function lucro(s) { return receita(s) - custoSafra(s); }

function infoInsumo(i) {
  const falta = Math.max(0, i.precisa - i.possui);
  let situacao = 'Completo';
  let classe = 'ok';
  if (falta > 0 && i.possui > 0) { situacao = 'Parcial'; classe = 'alerta'; }
  if (falta > 0 && i.possui <= 0) { situacao = 'Em falta'; classe = 'falta'; }
  return { falta: falta, custoFalta: falta * i.preco, situacao: situacao, classe: classe };
}

function infoMaquina(m) {
  const usado = Math.max(0, m.horas - m.ultima);
  const resta = m.intervalo - usado;
  return { usado: usado, resta: resta, classe: resta <= 0 ? 'falta' : (resta <= 20 ? 'alerta' : '') };
}

function textoRevisao(info) {
  return info.resta <= 0 ? 'vencida há ' + numero(-info.resta) + ' h' : numero(info.resta) + ' h';
}

function statusEtapa(e) {
  if (hoje > lerData(e.fim)) return { texto: 'Concluída', classe: 'ok' };
  if (hoje >= lerData(e.inicio)) return { texto: 'Em andamento', classe: 'alerta' };
  return { texto: 'Prevista', classe: '' };
}

function avisoSemSafras() {
  return '<p class="msg msg-erro">Nenhuma safra cadastrada. Cadastre uma na página <a href="cadastro.html">Cadastro</a>.</p>';
}

function preencherSelectSafras(select, comTodas) {
  let html = comTodas ? '<option value="todas">Todas as safras</option>' : '';
  html += dados.safras.map(function (s) {
    return '<option value="' + s.id + '">' + esc(s.cultura) + ' · ' + esc(s.talhao) + '</option>';
  }).join('');
  select.innerHTML = html;
}

// escuta os cliques nos botões de uma tabela ou lista
// cada botão tem data-acao="..." e a linha (tr ou li) tem data-id="..."
function aoClicarBotao(elemento, funcao) {
  elemento.addEventListener('click', function (ev) {
    const botao = ev.target.closest('button[data-acao]');
    if (!botao) return;
    const linha = botao.closest('tr, li');
    funcao(botao.dataset.acao, Number(linha.dataset.id));
  });
}



/* ---------- Aviso se o navegador não deixa salvar ---------- */

if (!armazenamentoFunciona()) {
  $('main').insertAdjacentHTML('afterbegin',
    '<p class="msg msg-erro">Seu navegador não está permitindo salvar dados. Abra o site pelo Live Server do VS Code ou use o Chrome.</p>');
}