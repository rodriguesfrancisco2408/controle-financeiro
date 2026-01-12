let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let tipoAtual = "receita";
let grafico = null;

// MÊS ATUAL PADRÃO
const agora = new Date();
let mesAtual = agora.toISOString().slice(0, 7);

function abrirModal(tipo) {
  tipoAtual = tipo;
  document.getElementById("tituloModal").innerText =
    tipo === "receita" ? "Nova Receita" : "Nova Despesa";
  document.getElementById("valor").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("modal").style.display = "block";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

function fecharModalFora(e) {
  if (e.target.id === "modal") fecharModal();
}

function salvar() {
  const valor = Number(document.getElementById("valor").value);
  const descricao = document.getElementById("descricao").value || "Sem descrição";

  if (!valor || valor <= 0) {
    alert("Informe um valor válido");
    return;
  }

  transacoes.push({
    tipo: tipoAtual,
    valor,
    descricao,
    mes: mesAtual
  });

  salvarStorage();
  fecharModal();
  atualizarTela();
}

function remover(indexGlobal) {
  if (confirm("Remover este lançamento?")) {
    transacoes.splice(indexGlobal, 1);
    salvarStorage();
    atualizarTela();
  }
}

function salvarStorage() {
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function carregarMeses() {
  const select = document.getElementById("mesSelecionado");
  const meses = [...new Set(transacoes.map(t => t.mes || mesAtual))];

  if (!meses.includes(mesAtual)) meses.push(mesAtual);
  meses.sort().reverse();

  select.innerHTML = "";
  meses.forEach(m => {
    const option = document.createElement("option");
    option.value = m;
    option.text = m;
    if (m === mesAtual) option.selected = true;
    select.appendChild(option);
  });

  mesAtual = select.value;
}

function atualizarTela() {
  carregarMeses();

  let saldo = 0, receitas = 0, despesas = 0;
  const lista = document.getElementById("lista");
  const vazio = document.getElementById("vazio");

  lista.innerHTML = "";

  const filtradas = transacoes
    .map((t, i) => ({ ...t, index: i }))
    .filter(t => (
