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
  }

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
  document.getElementById("receitas").innerText = `R$ ${receitas.toFixed(2)}`;
  document.getElementById("despesas").innerText = `R$ ${despesas.toFixed(2)}`;
}

atualizarTela();
