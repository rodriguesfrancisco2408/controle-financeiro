let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let tipoAtual = "receita";
let grafico = null;

// ===== UTILIDADES DE DATA =====
function mesAtualISO() {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
}

function nomeMes(iso) {
  const [ano, mes] = iso.split("-");
  const data = new Date(ano, mes - 1);
  return data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

let mesSelecionado = mesAtualISO();

// ===== MIGRAR DADOS ANTIGOS =====
transacoes = transacoes.map(t => {
  if (!t.mes) {
    return { ...t, mes: mesAtualISO() };
  }
  return t;
});
salvarStorage();

// ===== MODAL =====
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

// ===== CRUD =====
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
    mes: mesSelecionado
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

// ===== SELETOR DE MÊS =====
function carregarMeses() {
  const select = document.getElementById("mesSelecionado");
  const meses = [...new Set(transacoes.map(t => t.mes))];

  if (!meses.includes(mesSelecionado)) meses.push(mesSelecionado);

  meses.sort().reverse();
  select.innerHTML = "";

  meses.forEach(m => {
    const option = document.createElement("option");
    option.value = m;
    option.text = nomeMes(m);
    if (m === mesSelecionado) option.selected = true;
    select.appendChild(option);
  });

  mesSelecionado = select.value;
}

// ===== ATUALIZAÇÃO =====
function atualizarTela() {
  carregarMeses();

  let saldo = 0, receitas = 0, despesas = 0;
  const lista = document.getElementById("lista");
  const vazio = document.getElementById("vazio");

  lista.innerHTML = "";

  const filtradas = transacoes
    .map((t, i) => ({ ...t, index: i }))
    .filter(t => t.mes === mesSelecionado);

  vazio.style.display = filtradas.length === 0 ? "block" : "none";

  filtradas.forEach(t => {
    if (t.tipo === "receita") {
      saldo += t.valor;
      receitas += t.valor;
    } else {
      saldo -= t.valor;
      despesas += t.valor;
    }

    const div = document.createElement("div");
    div.className = `card item ${t.tipo}`;
    div.innerHTML = `
      <span>${t.descricao}</span>
      <div>
        <strong>${t.tipo === "receita" ? "+" : "-"} R$ ${t.valor.toFixed(2)}</strong>
        <button class="remover" onclick="remover(${t.index})">🗑️</button>
      </div>
    `;
    lista.appendChild(div);
  });

  document.getElementById("saldo").innerText = `R$ ${saldo.toFixed(2)}`;
  document.getElementById("receitas").innerText = `R$ ${receitas.toFixed(2)}`;
  document.getElementById("despesas").innerText = `R$ ${despesas.toFixed(2)}`;

  atualizarGrafico(receitas, despesas);
}

// ===== GRÁFICO =====
function atualizarGrafico(receitas, despesas) {
  const ctx = document.getElementById("grafico").getContext("2d");
  if (grafico) grafico.destroy();

  grafico = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Receitas", "Despesas"],
      datasets: [{
        data: [receitas, despesas],
        backgroundColor: ["#2ecc71", "#e74c3c"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" }
      }
    }
  });
}

atualizarTela();
