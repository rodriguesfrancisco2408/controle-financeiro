const API_URL = "https://script.google.com/macros/s/AKfycbxXzJJ3spmB1ZMZZVByZeK7n3h9ksYn_P1EA8YhIovl8-2ldZdILjues9RTuKoq_ih-Qg/exec";

let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let tipoAtual = "";
let indiceEdicao = null;
let grafico = null;

const modal = document.getElementById("modal");
const valorInput = document.getElementById("valor");
const descricaoInput = document.getElementById("descricao");
const dataInput = document.getElementById("data");

document.getElementById("btnReceita").onclick = () => abrirModal("receita");
document.getElementById("btnDespesa").onclick = () => abrirModal("despesa");
document.getElementById("btnCancelar").onclick = fecharModal;
document.getElementById("btnSalvar").onclick = salvarTransacao;

function abrirModal(tipo, index = null) {
  tipoAtual = tipo;
  indiceEdicao = index;
  modal.style.display = "flex";

  if (index !== null) {
    const t = transacoes[index];
    valorInput.value = t.valor;
    descricaoInput.value = t.descricao;
    dataInput.value = t.data;
  } else {
    valorInput.value = "";
    descricaoInput.value = "";
    dataInput.value = "";
  }
}

function fecharModal() {
  modal.style.display = "none";
  indiceEdicao = null;
}

function salvarTransacao() {
  const valor = Number(valorInput.value);
  const descricao = descricaoInput.value;
  const data = dataInput.value;

  if (!valor || !descricao || !data) return alert("Preencha tudo");

  const transacao = { tipo: tipoAtual, valor, descricao, data };

  if (indiceEdicao !== null) {
    transacoes[indiceEdicao] = transacao;
  } else {
    transacoes.push(transacao);
  }

  localStorage.setItem("transacoes", JSON.stringify(transacoes));
  fecharModal();
  atualizar();
}

function deletarTransacao(index) {
  transacoes.splice(index, 1);
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
  atualizar();
}

function atualizar() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  let receitas = 0;
  let despesas = 0;

  transacoes.forEach((t, index) => {
    if (t.tipo === "receita") receitas += t.valor;
    else despesas += t.valor;

    const li = document.createElement("li");
    li.innerHTML = `
      ${t.descricao} (${t.data}) - 
      <strong>${t.tipo === "receita" ? "+" : "-"} R$ ${t.valor}</strong>
      <button onclick="abrirModal('${t.tipo}', ${index})">Editar</button>
      <button onclick="deletarTransacao(${index})">🗑</button>
    `;
    lista.appendChild(li);
  });

  document.getElementById("saldo").innerText = `R$ ${(receitas - despesas).toFixed(2)}`;
  document.getElementById("receitas").innerText = `R$ ${receitas.toFixed(2)}`;
  document.getElementById("despesas").innerText = `R$ ${despesas.toFixed(2)}`;

  atualizarGrafico(receitas, despesas);
}

function atualizarGrafico(receitas, despesas) {
  const ctx = document.getElementById("grafico");

  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Receitas", "Despesas"],
      datasets: [{
        data: [receitas, despesas],
        backgroundColor: ["green", "red"]
      }]
    }
  });
}
async function carregarLancamentosServidor() {
  try {
    const resposta = await fetch(API_URL);
    const dados = await resposta.json();

    transacoes = dados;
    atualizarTudo();
  } catch (erro) {
    console.error("Erro ao carregar dados do servidor", erro);
  }
}
window.onload = carregarLancamentosServidor;

