let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let tipoAtual = "";
let indiceEdicao = null;
let grafico = null;

const valorInput = document.getElementById("valor");
const descricaoInput = document.getElementById("descricao");
const dataInput = document.getElementById("data");
const lista = document.getElementById("lista");

function abrirModal(tipo, index = null) {
  tipoAtual = tipo;
  indiceEdicao = index;

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

  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
  indiceEdicao = null;
}

function salvar() {
  const valor = Number(valorInput.value);
  const descricao = descricaoInput.value;
  const data = dataInput.value;

  if (!valor || !descricao || !data) {
    alert("Preencha todos os campos");
    return;
  }

  const transacao = {
    tipo: tipoAtual,
    valor,
    descricao,
    data
  };

  if (indiceEdicao !== null) {
    transacoes[indiceEdicao] = transacao;
  } else {
    transacoes.push(transacao);
  }

  localStorage.setItem("transacoes", JSON.stringify(transacoes));
  fecharModal();
  atualizar();
}

function deletar(index) {
  transacoes.splice(index, 1);
  localStorage.setItem("transacoes", JSON.stringify(transacoes));
  atualizar();
}

function atualizar() {
  lista.innerHTML = "";
  let receitas = 0;
  let despesas = 0;

  transacoes.forEach((t, i) => {
    if (t.tipo === "receita") receitas += t.valor;
    else despesas += t.valor;

    const li = document.createElement("li");
    li.innerHTML = `
      ${t.descricao} - R$ ${t.valor.toFixed(2)}
      <span>
        <button onclick="abrirModal('${t.tipo}', ${i})">✏️</button>
        <button onclick="deletar(${i})">🗑️</button>
      </span>
    `;
    lista.appendChild(li);
  });

  document.getElementById("saldo").innerText =
    `R$ ${(receitas - despesas).toFixed(2)}`;
  document.getElementById("receitas").innerText =
    `R$ ${receitas.toFixed(2)}`;
  document.getElementById("despesas").innerText =
    `R$ ${despesas.toFixed(2)}`;

  atualizarGrafico(receitas, despesas);
}

function atualizarGrafico(r, d) {
  const ctx = document.getElementById("grafico");
  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "pie",
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
