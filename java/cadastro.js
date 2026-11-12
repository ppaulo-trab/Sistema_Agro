/* js/cadastro.js  |  Página Cadastro
   Usa as funções de dados.js (carregue dados.js antes). */

function paginaCadastro() {
  $('form-safra').addEventListener('submit', function (ev) {
    ev.preventDefault();
    const plantio = $('plantio').value;
    const colheita = $('colheita').value;
    if (colheita <= plantio) {
      mensagem('cad-msg', 'A colheita precisa ser depois do início do plantio.', true);
      return;
    }

    const id = novoId();
    const etapas = [];
    if ($('gerar-etapas').checked) {
      const p = lerData(plantio);
      const c = lerData(colheita);
      etapas.push({ id: 1, nome: 'Preparo do solo', inicio: dataISO(somaDias(p, -15)), fim: dataISO(somaDias(p, -1)) });
      etapas.push({ id: 2, nome: 'Plantio', inicio: plantio, fim: dataISO(somaDias(p, 7)) });
      etapas.push({ id: 3, nome: 'Tratos culturais e controle de pragas', inicio: dataISO(somaDias(p, 8)), fim: dataISO(somaDias(c, -1)) });
      etapas.push({ id: 4, nome: 'Colheita', inicio: colheita, fim: dataISO(somaDias(c, 14)) });
    }

    dados.safras.push({
      id: id,
      talhao: $('talhao').value.trim(),
      cultura: $('cultura').value.trim(),
      area: lerNumero('area'),
      solo: $('solo').value,
      manejo: document.querySelector('input[name="manejo"]:checked').value,
      unidade: $('unidade').value,
      produtividade: lerNumero('produtividade'),
      preco: lerNumero('preco'),
      observacoes: $('obs').value.trim(),
      custos: {
        sementes: lerNumero('c-sementes'),
        maoDeObra: lerNumero('c-mao'),
        combustivel: lerNumero('c-combustivel'),
        manutencao: lerNumero('c-manutencao'),
        outros: lerNumero('c-outros')
      },
      etapas: etapas
    });
    dados.selecionada = id;
    salvar();
    ev.target.reset();
    mensagem('cad-msg', 'Safra salva! Veja em <a href="producao.html">Produção</a>, <a href="cronograma.html">Cronograma</a>, <a href="custos.html">Custos</a> ou <a href="ganho.html">Ganho futuro</a>.');
    $('cad-msg').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

paginaCadastro();