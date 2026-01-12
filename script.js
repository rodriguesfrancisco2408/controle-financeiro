let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let tipoAtual = "receita";

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

function salvar() {
  const valor = Number(document.getElementById("valor").value);
  const descricao =
    document.getElementById("descricao").value || "Sem descrição";

  if (!valor || valor <= 0) {
    alert("Informe um valor válido");
    return;
  }

  transacoes.push({
    tipo: tipoAtual,
    valor,
    descricao,
    data: new Date().toLocaleDateString("pt-BR")
  });

  localStorage.setItem("transacoes", JSON.stringify(transacoes));

  fecharModal();
  atualizarTela();
}

function atualizarTela() {
  let saldo = 0;
  let receitas = 0;
  let despesas = 0;

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  transacoes.forEach((t, index) => {
    if (t.tipo === "receita") {
      saldo += t.valor;
      receitas += t.valor;
    } else {
      saldo -= t.valor;
      despesas += t.valor;
    }

    const div = document.createElement("div");
    div.className = "card item";
    div.innerHTML = `
      <span>${t.descricao}</span>
      <strong>${t.tipo === "rece
