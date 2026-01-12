let transacoes = []
let tipoAtual = "receita"

const modal = document.getElementById("modal")
const valorInput = document.getElementById("valor")
const descricaoInput = document.getElementById("descricao")
const dataInput = document.getElementById("data")

const saldoEl = document.getElementById("saldo")
const receitasEl = document.getElementById("receitas")
const despesasEl = document.getElementById("despesas")
const listaEl = document.getElementById("lista")

const btnReceita = document.getElementById("btnReceita")
const btnDespesa = document.getElementById("btnDespesa")
const btnSalvar = document.getElementById("btnSalvar")
const btnCancelar = document.getElementById("btnCancelar")

let grafico = null

btnReceita.onclick = () => abrirModal("receita")
btnDespesa.onclick = () => abrirModal("despesa")
btnCancelar.onclick = fecharModal
btnSalvar.onclick = salvar

function abrirModal(tipo) {
  tipoAtual = tipo
  document.getElementById("tituloModal").innerText =
    tipo === "receita" ? "Nova Receita" : "Nova Despesa"
  modal.classList.remove("hidden")
}

function fecharModal() {
  modal.classList.add("hidden")
  valorInput.value = ""
  descricaoInput.value = ""
  dataInput.value = ""
}

function salvar() {
  const valor = Number(valorInput.value)
  if (!valor) return

  transacoes.push({
    tipo: tipoAtual,
    valor,
    descricao: descricaoInput.value,
    data: dataInput.value
  })

  fecharModal()
  renderizar()
}

function deletarTransacao(index) {
  transacoes.splice(index, 1)
  renderizar()
}

function renderizar() {
  listaEl.innerHTML = ""

  let receitas = 0
  let despesas = 0

  transacoes.forEach((t, index) => {
    const li = document.createElement("li")

    li.innerHTML = `
      <span>
        ${t.descricao || "(sem descrição)"} 
        ${t.data ? " - " + t.data : ""}
      </span>

      <div>
        <strong style="color:${t.tipo === "receita" ? "green" : "red"}">
          ${t.tipo === "receita" ? "+" : "-"} R$ ${t.valor.toFixed(2)}
        </strong>
        <button 
          style="margin-left:10px; cursor:pointer"
          onclick="deletarTransacao(${index})"
        >🗑</button>
      </div>
    `

    listaEl.appendChild(li)

    t.tipo === "receita" ? receitas += t.valor : despesas += t.valor
  })

  saldoEl.innerText = `R$ ${(receitas - despesas).toFixed(2)}`
  receitasEl.innerText = `R$ ${receitas.toFixed(2)}`
  despesasEl.innerText = `R$ ${despesas.toFixed(2)}`

  atualizarGrafico(receitas, despesas)
}

function atualizarGrafico(r, d) {
  const ctx = document.getElementById("graficoPizza")

  if (grafico) grafico.destroy()

  grafico = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Receitas", "Despesas"],
      datasets: [{
        data: [r, d],
        backgroundColor: ["#2ecc71", "#e74c3c"]
      }]
    }
  })
}
