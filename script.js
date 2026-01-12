document.addEventListener("DOMContentLoaded", () => {
  let receitas = 0
  let despesas = 0

  const saldoEl = document.getElementById("saldo")
  const receitasEl = document.getElementById("receitas")
  const despesasEl = document.getElementById("despesas")
  const lista = document.getElementById("lista")

  const btnReceita = document.getElementById("btnReceita")
  const btnDespesa = document.getElementById("btnDespesa")

  function atualizar() {
    const saldo = receitas - despesas
    saldoEl.textContent = `R$ ${saldo.toFixed(2)}`
    receitasEl.textContent = receitas.toFixed(2)
    despesasEl.textContent = despesas.toFixed(2)
  }

  function adicionar(tipo) {
    const valor = prompt("Digite o valor:")
    const descricao = prompt("Digite a descrição:")

    if (!valor || isNaN(valor)) return

    const li = document.createElement("li")
    li.innerHTML = `
      <span>${descricao}</span>
      <strong>${tipo === "receita" ? "+" : "-"} R$ ${Number(valor).toFixed(2)}</strong>
    `

    if (tipo === "receita") {
      receitas += Number(valor)
    } else {
      despesas += Number(valor)
    }

    lista.appendChild(li)
    atualizar()
  }

  btnReceita.addEventListener("click", () => adicionar("receita"))
  btnDespesa.addEventListener("click", () => adicionar("despesa"))

  atualizar()
})
