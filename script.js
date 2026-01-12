let tipoAtual = "receita";
let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let grafico = null;

const modal = document.getElementById("modal");
const tituloModal = document.getElementById("tituloModal");
const valorInput = document.getElementById("valor");
const descricaoInput = document.getElementById("descricao");
const dataInput = document.getElementById("data");

const saldoEl = document.getElementById("saldo");
const receitasEl = document.getElementById("receitas");
const despesasEl = document.getElementById("despesas");
const listaEl = document.getElementById("lista");

document.getElementById("btnReceita").onclick = () => abrirModal("receita");
document.getElementById("btnDespesa").onclick = () => abrirModal("despesa");
document.getElementById("btnCancelar").onclick = fecharModal;
document.getElementById("btnSalvar").onclick = salvar;

function abrirModal(tipo) {
  tipoAtual = tipo;
  tituloModal.innerText = tipo === "receita" ? "Nova Receita" : "Nova Despesa";
  valorInput.value = "";
  descricaoInput.value = "";
  dataInput.value = new Date().toISOString().split("T")[0];
  modal.classList.remove("hidden");
}

function fecharModal() {
  modal.classList.add("hidden");
}

function salvar() {
  const valor = Number(valorInput.value);
  if (!valor) return alert("Informe um valor");

  transacoes.push({
    id: Date.now(),
    tipo: tipoAtual,
    valor,
    descricao: descricaoInput.value,
    data: dataInput.value
  });

  localStorage.setItem("transacoes", JSON.stringify(transacoes));
  fecharModal();
  atualizar();
}

function remover(id) {
  transacoes = transacoes.filter(t => t.id !== id);
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
  atualizar();
}

function atualizar() {
  listaEl.innerHTML = "";

  let receitas = 0;
  let despesas = 0;

  transacoes.forEach(t => {
    if (t.tipo === "receita") receitas += t.valor;
    else despesas += t.valor;

    const li = document.createElement("li");
    li.className = t.tipo;
    li.innerHTML = `
      <span>${t.descricao} (${t.data})</span>
      <span>R$ ${t.valor.toFixed(2)} 🗑️</span>
    `;
    li.onclick = () => remover(t.id);
    listaEl.appendChild(li);
  });

  saldoEl.innerText = `R$ ${(receitas - despesas).toFixed(2)}`;
  receitasEl.innerText = `R$ ${receitas.toFixed(2)}`;
  despesasEl.innerText = `R$ ${despesas.toFixed(2)}`;

  atualizarGrafico(receitas, despesas);
}

function atualizarGrafico(r, d) {
  const ctx = document.getElementById("grafico");

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Receitas", "Despesas"],
      datasets: [{
        data: [r, d],
        backgroundColor: ["#2ecc71", "#e74c3c"]
      }]
    }
  });
}

atualizar();
