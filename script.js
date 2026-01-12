// ===== ESTADO =====
let transacoes = JSON.parse(localStorage.getItem("transacoes")) || [];
let tipoAtual = "receita";

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

// ===== SALVAR =====
function salvar() {
  const valor = Number(document.getElementById("valor").value);
  const descricao = document.getElementById("descricao").value || "Sem descrição";

  if (!valor || valor <= 0) {
    alert("Informe um valor válido");
    return;
  }

  transacoes.push({
    tipo: tipoAtual,
    valor: valor,
    descricao: descricao,
    data: new Date().toLocaleDateString("pt-BR")
  });

  atualizarTela();
  fecharModal();
}

// ===== REMOVER =====
function remover(index) {
  if (confirm("Deseja remover este lançamento?")) {
    transacoes.splice(index, 1);
    atualizarTela();
  }
}

// ===== ATUALIZAR TELA =====
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
    div.className = `card item ${t.tipo}`;

    div.innerHTML = `
      <span>${t.descricao}</span>
      <div>
        <strong>${t.tipo === "receita" ? "+" : "-"} R$ ${t.valor.toFixed(2)}</strong>
        <button class="remover" onclick="remover(${index})">🗑️</button>
      </div>
    `;

    lista.appendChild(div);
  });

  document.getElementById("saldo").innerText = `R$ ${saldo.toFixed(2)}`;
  document.getElementById("receitas").innerText = `R$ ${receita
