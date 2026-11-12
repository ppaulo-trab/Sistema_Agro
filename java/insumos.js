/* Parte comum de Pragas e Fertilizantes. */

function paginaInsumos(tipo) {
  const filtro = $('filtro-safra');

  function listaAtual() {
    return dados.insumos.filter(function (i) {
      return i.tipo === tipo && (filtro.value === 'todas' || i.safraId === Number(filtro.value));
    });
  }

  function linha(i) {
    const f = infoInsumo(i);
    return '<tr data-id="' + i.id + '">' +
      '<td>' + esc(i.nome) + '<br><small>' + esc(nomeSafra(i.safraId)) + '</small></td>' +
      '<td class="num"><input type="number" min="0" step="any" class="cel" value="' + i.possui + '" data-possui aria-label="Quantidade em estoque de ' + esc(i.nome) + '"> ' + esc(i.unidade) + '</td>' +
      '<td class="num">' + numero(i.precisa) + ' ' + esc(i.unidade) + '</td>' +
      '<td class="num c-falta">' + numero(f.falta) + ' ' + esc(i.unidade) + '</td>' +
      '<td class="num">' + moeda2(i.preco) + '</td>' +
      '<td class="num c-custo">' + moeda(f.custoFalta) + '</td>' +
      '<td class="c-meter">' + medidor(i) + '</td>' +
      '<td class="c-situacao ' + f.classe + '">' + f.situacao + '</td>' +
      '<td><button type="button" class="botao-pequeno" data-acao="remover">Remover</button></td></tr>';
  }

  function medidor(i) {
    const max = i.precisa > 0 ? i.precisa : 1;
    return '<meter min="0" max="' + max + '" value="' + Math.min(i.possui, max) + '"></meter>';
  }

  // totais, resumo e lista de compras
  function atualizarResumo() {
    const lista = listaAtual();
    const necessario = soma(lista, function (i) { return i.precisa * i.preco; });
    const completar = soma(lista, function (i) { return infoInsumo(i).custoFalta; });
    const emFalta = lista.filter(function (i) { return infoInsumo(i).situacao === 'Em falta'; }).length;

    $('resumo-insumos').innerHTML =
      '<li>Produtos controlados: <strong>' + lista.length + '</strong> (' + emFalta + ' em falta)</li>' +
      '<li>Custo total necessário: <strong>' + moeda(necessario) + '</strong></li>' +
      '<li>Falta comprar: <strong>' + moeda(completar) + '</strong></li>';

    $('total-insumos').innerHTML = '<tr><td colspan="5">Total para completar o estoque</td><td class="num">' + moeda(completar) + '</td><td colspan="3"></td></tr>';

    const compras = lista.filter(function (i) { return infoInsumo(i).falta > 0; })
      .sort(function (a, b) { return infoInsumo(b).custoFalta - infoInsumo(a).custoFalta; });
    $('lista-compras').innerHTML = compras.length
      ? '<p>Do mais caro para o mais barato:</p><ol>' + compras.map(function (i) {
        const f = infoInsumo(i);
        return '<li>' + esc(i.nome) + ': ' + numero(f.falta) + ' ' + esc(i.unidade) + ' &ndash; ' + moeda(f.custoFalta) + '</li>';
      }).join('') + '</ol><p><strong>Total: ' + moeda(completar) + '.</strong> Procure os produtos na página <a href="fornecedores.html">Fornecedores</a>.</p>'
      : '<p>Nada a comprar: o estoque cobre toda a necessidade.</p>';
  }

  function desenhar() {
    $('ins-aviso').innerHTML = dados.safras.length ? '' : avisoSemSafras();
    $('ins-conteudo').hidden = !dados.safras.length;
    if (!dados.safras.length) return;

    const lista = listaAtual();
    $('lista-insumos').innerHTML = lista.length
      ? lista.map(linha).join('')
      : '<tr><td colspan="9" class="vazio">Nenhum produto cadastrado para este filtro. Use o formulário abaixo.</td></tr>';
    atualizarResumo();
  }

  preencherSelectSafras(filtro, true);
  preencherSelectSafras($('ins-safra'), false);
  preencherSelectSafras($('calc-safra'), false);

  filtro.addEventListener('change', desenhar);

  // ao mudar "Possui", atualiza só a linha (o cursor não se perde)
  $('lista-insumos').addEventListener('change', function (ev) {
    if (!ev.target.hasAttribute('data-possui')) return;
    const tr = ev.target.closest('tr');
    const i = achar(dados.insumos, tr.dataset.id);
    i.possui = Math.max(0, parseFloat(ev.target.value) || 0);
    ev.target.value = i.possui;
    salvar();
    const f = infoInsumo(i);
    tr.querySelector('.c-falta').textContent = numero(f.falta) + ' ' + i.unidade;
    tr.querySelector('.c-custo').textContent = moeda(f.custoFalta);
    tr.querySelector('.c-meter').innerHTML = medidor(i);
    const sit = tr.querySelector('.c-situacao');
    sit.textContent = f.situacao;
    sit.className = 'c-situacao ' + f.classe;
    atualizarResumo();
  });

  aoClicarBotao($('lista-insumos'), function (acao, id) {
    if (acao === 'remover' && confirm('Remover este produto?')) {
      dados.insumos = dados.insumos.filter(function (i) { return i.id !== id; });
      salvar();
      desenhar();
    }
  });

  $('form-insumo').addEventListener('submit', function (ev) {
    ev.preventDefault();
    dados.insumos.push({
      id: novoId(),
      tipo: tipo,
      nome: $('ins-nome').value.trim(),
      safraId: Number($('ins-safra').value),
      unidade: $('ins-unidade').value,
      possui: lerNumero('ins-possui'),
      precisa: lerNumero('ins-precisa'),
      preco: lerNumero('ins-preco')
    });
    salvar();
    ev.target.reset();
    mensagem('ins-msg', 'Produto adicionado.');
    desenhar();
  });

  /* calculadora: área da safra × dose por hectare */
  function calcular() {
    const s = achar(dados.safras, $('calc-safra').value);
    const dose = parseFloat($('calc-dose').value);
    const unidade = $('calc-unidade').value;
    if (!s || !(dose > 0)) {
      $('calc-resultado').textContent = 'Informe a dose por hectare.';
      return;
    }
    $('calc-resultado').innerHTML = numero(s.area) + ' ha &times; ' + numero(dose) + ' ' + esc(unidade) + '/ha = <strong>' + numero(s.area * dose) + ' ' + esc(unidade) + '</strong>';
  }
  $('form-calc').addEventListener('input', calcular);
  $('form-calc').addEventListener('submit', function (ev) { ev.preventDefault(); calcular(); });

  desenhar();
  calcular();
}