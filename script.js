let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let tipoAtual = "receita";

const saldoEl = document.getElementById("saldo");
const receitasEl = document.getElementById("receitas");
const despesasEl = document.getElementById("despesas");
const listaEl = document.getElementById("lista");

function abrirModal(tipo) {
  tipoAtual = tipo;
  document.getElementById("modal").classList.add("ativo");
}

function fecharModal() {
  document.getElementById("valor").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("modal").classList.remove("ativo");
}

function salvarTransacao() {
  const valor = parseFloat(document.getElementById("valor").value);
  const descricao = document.getElementById("descricao").value;

  if (!valor || !descricao) return;

  const data = new Date().toLocaleDateString("pt-BR");

  transacoes.push({
    id: Date.now(),
    tipo: tipoAtual,
    valor: valor,
    descricao: descricao,
    data: data
  });

  localStorage.setItem("transacoes", JSON.stringify(transacoes));
  fecharModal();
  atualizarTudo();
}

function removerTransacao(id) {
  transacoes = transacoes.filter(t => t.id !== id);
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
  atualizarTudo();
}

function atualizarTudo() {
  let receitas = 0;
  let despesas = 0;

  listaEl.innerHTML = "";

  transacoes.forEach(t => {
    if (t.tipo === "receita") receitas += t.valor;
    else despesas += t.valor;

    const item = document.createElement("div");
    item.className = "item";

    item.innerHTML = `
      <div>
        <strong class="${t.tipo}">${t.descricao}</strong><br>
        <small>${t.data}</small>
      </div>
      <div class="${t.tipo}">
        ${t.tipo === "receita" ? "+" : "-"} R$ ${t.valor.toFixed(2)}
        <button onclick="removerTransacao(${t.id})">🗑️</button>
      </div>
    `;

    listaEl.appendChild(item);
  });

  saldoEl.innerText = `R$ ${(receitas - despesas).toFixed(2)}`;
  receitasEl.innerText = `R$ ${receitas.toFixed(2)}`;
  despesasEl.innerText = `R$ ${despesas.toFixed(2)}`;

  atualizarGrafico(receitas, despesas);
}

let grafico;
function atualizarGrafico(receitas, despesas) {
  const ctx = document.getElementById("grafico").getContext("2d");

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Receitas", "Despesas"],
      datasets: [{
        data: [receitas, despesas],
        backgroundColor: ["#2ecc71", "#e74c3c"]
      }]
    }
  });
}

atualizarTudo();
