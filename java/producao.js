/* Parte comum de Produção. */

function paginaProducao() {
  function desenhar() {
    $('prod-caption').textContent = 'Talhões da ' + dados.fazenda;
    $('lista-safras').innerHTML = dados.safras.length
      ? dados.safras.map(function (s) {
        return '<tr data-id="' + s.id + '">' +
          '<td>' + esc(s.talhao) + '</td>' +
          '<td>' + esc(s.cultura) + '</td>' +
          '<td class="num">' + numero(s.area) + '</td>' +
          '<td>' + esc(s.solo) + '</td>' +
          '<td>' + esc(s.manejo) + '</td>' +
          '<td>' + esc(s.observacoes || '-') + '</td>' +
          '<td><button type="button" class="botao-pequeno" data-acao="remover">Remover</button></td></tr>';
      }).join('')
      : '<tr><td colspan="7" class="vazio">Nenhum talhão cadastrado. Use a página Cadastro.</td></tr>';
    $('total-area').textContent = numero(soma(dados.safras, function (s) { return s.area; }));
  }

  aoClicarBotao($('lista-safras'), function (acao, id) {
    if (acao === 'remover' && confirm('Remover esta safra e os insumos ligados a ela?')) {
      dados.safras = dados.safras.filter(function (s) { return s.id !== id; });
      dados.insumos = dados.insumos.filter(function (i) { return i.safraId !== id; });
      salvar();
      desenhar();
    }
  });

  desenhar();
}

paginaProducao();