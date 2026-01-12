let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let tipoAtual = "receita";

function abrirModal(tipo) {
  tipoAtual = tipo;
  document.getElementById("tituloModal").innerText =
    tipo === "receita" ? "Nova Receita" : "Nova Despesa";
  document.getElementById("modal").style.display = "block";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

function salvar() {
  const valor = Number(document.getElementById("valor").value);
  const descricao = document.getElementById("descricao").value || "Sem descrição";

  transacoes.push({ tipo: tipoAtual, valor, descricao });
  localStorage.setItem("transacoes", JSON.stringify(transacoes));

  fecharModal();
  atualizarTela();
}

function atualizarTela() {
  let saldo = 0, receitas = 0, despesas = 0;
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  transacoes.forEach((t, i) => {
    saldo += t.tipo === "receita" ? t.valor : -t.valor;
    t.tipo === "receita" ? receitas += t.valor : despesas += t.valor;

    const div = document.createElement("div");
    div.className = "card item";
    div.innerHTML = `
      <span>${t.descricao}</span>
      <strong>${t.tipo === "receita" ? "+" : "-"} R$ ${t.valor}</strong>
    `;
    lista.appendChild(div);
  });

  document.getElementById("saldo").innerText = `R$ ${saldo.toFixed(2)}`;
  document.getElementById("receitas").innerText = `R$ ${receitas.toFixed(2)}`;
  document.getElementById("despesas").innerText = `R$ ${despesas.toFixed(2)}`;
}

atualizarTela();
