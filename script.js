let tipoAtual = 'receita'
let transacoes = []

const modal = document.getElementById('modal')
const valorInput = document.getElementById('valor')
const descricaoInput = document.getElementById('descricao')
const dataInput = document.getElementById('data')

const saldoEl = document.getElementById('saldo')
const receitasEl = document.getElementById('receitas')
const despesasEl = document.getElementById('despesas')
const listaEl = document.getElementById('lista')

const btnReceita = document.getElementById('btnReceita')
const btnDespesa = document.getElementById('btnDespesa')
const btnSalvar = document.getElementById('btnSalvar')
const btnCancelar = document.getElementById('btnCancelar')

let grafico = null

// EVENTOS (AQUI ESTAVA O ERRO ANTES)
btnReceita.addEventListener('click', () => abrirModal('receita'))
btnDespesa.addEventListener('click', () => abrirModal('despesa'))
btnSalvar.addEventListener('click', salvarTransacao)
btnCancelar.addEventListener('click', fecharModal)

function abrirModal(tipo) {
  tipoAtual = tipo
  document.getElementById('tituloModal').innerText =
    tipo === 'receita' ? 'Nova Receita' : 'Nova Despesa'

  valorInput.value = ''
  descricaoInput.value = ''
  dataInput.value = ''

  modal.style.display = 'flex'
}

function fecharModal() {
  modal.style.display = 'none'
}

function salvarTransacao() {
  const valor = Number(valorInput.value)
  const descricao = descricaoInput.value
  const data = dataInput.value

  if (!valor || !descricao || !data) {
    alert('Preencha todos os campos')
    return
  }

  transacoes.push({
    valor,
    descricao,
    data,
    tipo: tipoAtual
  })

  fecharModal()
  atualizarTela()
}

function atualizarTela() {
  let totalReceitas = 0
  let totalDespesas = 0

  listaEl.innerHTML = ''

  transacoes.forEach((t) => {
    if (t.tipo === 'receita') totalReceitas += t.valor
    else totalDespesas += t.valor

    const item = document.createElement('div')
    item.className = 'item'

    item.innerHTML = `
      <span>${t.descricao} (${t.data})</span>
      <strong class="${t.tipo}">
        ${t.tipo === 'receita' ? '+' : '-'} R$ ${t.valor.toFixed(2)}
      </strong>
    `

    listaEl.appendChild(item)
  })

  const saldo = totalReceitas - totalDespesas

  saldoEl.innerText = `R$ ${saldo.toFixed(2)}`
  receitasEl.innerText = `R$ ${totalReceitas.toFixed(2)}`
  despesasEl.innerText = `R$ ${totalDespesas.toFixed(2)}`

  atualizarGrafico(totalReceitas, totalDespesas)
}

function atualizarGrafico(receitas, despesas) {
  const ctx = document.getElementById('grafico')

  if (grafico) grafico.destroy()

  grafico = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Receitas', 'Despesas'],
      datasets: [{
        data: [receitas, despesas],
        backgroundColor: ['#2ecc71', '#e74c3c']
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  })
}

// Fechar modal clicando fora
modal.addEventListener('click', (e) => {
  if (e.target === modal) fecharModal()
})
