/**  Página Home */

function paginaIndex() {
  function desenhar() {
    $('aviso-exemplos').hidden = !dados.exemplo;
    $('nome-fazenda').value = dados.fazenda;

    const area = soma(dados.safras, function (s) { return s.area; });
    const receitaTotal = soma(dados.safras, receita);
    const custoTotal = soma(dados.safras, custoSafra);
    $('resumo').innerHTML =
      '<li>Fazenda: <strong>' + esc(dados.fazenda) + '</strong></li>' +
      '<li>Área total: <strong>' + numero(area) + ' <abbr title="hectares">ha</abbr></strong>, divididos em ' + dados.safras.length + ' talhão(ões)</li>' +
      '<li>Receita estimada: <strong>' + moeda(receitaTotal) + '</strong></li>' +
      '<li>Custo de produção: <strong>' + moeda(custoTotal) + '</strong></li>' +
      '<li>Lucro projetado: <strong>' + moeda(receitaTotal - custoTotal) + '</strong></li>';

    const alertas = [];
    dados.insumos.forEach(function (i) {
      if (i.precisa > 0 && i.possui <= 0) {
        alertas.push(['falta', 'Sem estoque: ' + i.nome + ' (faltam ' + numero(i.precisa) + ' ' + i.unidade + ', ' + moeda(i.precisa * i.preco) + ')']);
      }
    });
    const parciais = dados.insumos.filter(function (i) { return i.possui > 0 && i.possui < i.precisa; });
    if (parciais.length) {
      alertas.push(['alerta', parciais.length + ' produto(s) com estoque abaixo do necessário. Falta comprar ' + moeda(soma(parciais, function (i) { return infoInsumo(i).custoFalta; })) + '.']);
    }
    dados.maquinas.forEach(function (m) {
      const r = infoMaquina(m);
      if (r.resta <= 0) alertas.push(['falta', m.nome + ': revisão vencida há ' + numero(-r.resta) + ' h de uso']);
      else if (r.resta <= 20) alertas.push(['alerta', m.nome + ': revisão em ' + numero(r.resta) + ' h de uso']);
      if (m.status === 'Em manutenção') alertas.push(['alerta', m.nome + ' está parado para manutenção']);
    });
    $('alertas').innerHTML = alertas.length
      ? '<ul>' + alertas.map(function (a) { return '<li class="' + a[0] + '">' + esc(a[1]) + '</li>'; }).join('') + '</ul>'
      : '<p>Nenhum alerta no momento.</p>';
  }

  $('form-fazenda').addEventListener('submit', function (ev) {
    ev.preventDefault();
    dados.fazenda = $('nome-fazenda').value.trim() || 'Minha fazenda';
    salvar();
    desenhar();
    mensagem('msg-dados', 'Nome da fazenda salvo.');
  });

  $('btn-zerar').addEventListener('click', function () {
    if (confirm('Apagar todos os dados e começar do zero?')) {
      dados = dadosVazios();
      salvar();
      desenhar();
      mensagem('msg-dados', 'Tudo limpo. Comece cadastrando sua primeira safra na página <a href="cadastro.html">Cadastro</a>.');
    }
  });

  $('btn-exemplo').addEventListener('click', function () {
    if (confirm('Substituir os seus dados pelos dados de exemplo?')) {
      dados = dadosExemplo();
      salvar();
      desenhar();
      mensagem('msg-dados', 'Dados de exemplo restaurados.');
    }
  });

  desenhar();
}

paginaIndex();