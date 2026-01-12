let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let tipoAtual = "receita";
let grafico = null;

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

  transacoes.push({ tipo: tipoAtual, valor, descricao });
  salvarStorage();
  fecharModal();
  atualizarTela();
}

function remover(index) {
  if (confirm("Remover este lançamento?")) {
    transacoes.splice(index, 1);
    salvarStorage();
    atualizarTela();
  }
}

function salvarStorage() {
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
}

function atualizarTela() {
  let saldo = 0, receitas = 0, despesas = 0;
  const lista = document.getElementById("lista");
  const vazio = document.getElementById("vazio");

  lista.innerHTML = "";

  if (transacoes.length === 0) {
    vazio.style.display = "block";
  } else {
    vazio.style.display = "none";
