let tipoAtual = 'receita'
let transacoes = JSON.parse(localStorage.getItem('transacoes')) || []

const saldoEl = document.getElementById('saldo')
const receitasEl = document.getElementById('receitas')
const despesasEl = document.getElementById('despesas')
const listaEl = document.getElementById('lista')

const btnReceita = document.getElementById('btnReceita')
const btnDespesa = document.getElementById('btnDespesa')
const btnSalvar = document.getElementById('btnSalvar')
const btnCancelar = document.getElementById('btnCancelar')

const modal = document.getElementById('modal')
const tituloModal = document.getElementById('tituloModal')
const valorInput = document.getElementById('valor')
const descricaoInput = document.getElementById('descricao')
const dataInput = document.getElementById('data')

let grafico = null

btnReceita.onclick = () => abrirModal('receita')
btnDespesa.onclick = () => abrirModal('despesa')
btnCancelar.onclick = fecharModal
btnSalvar.onclick = salvarTransacao

function abrirModal(tipo) {
  tipoAtual = tipo
  tituloModal.innerText = tipo === 'receita' ? 'Nova Receita' : 'Nova Despesa'
  valorInput.value = ''
  descricaoInput.value = ''
  dataInput.value = ''
  modal.classList.remove('hidden')
}

function fecharModal() {
  modal.classList.add('hidden')
}

function salvarTransacao() {
  const valor = Number(valorInput.value)
  const descricao = descricaoInput.value.trim()
  const data = dataInput.value

  if (!valor || !descricao || !data) {
    alert('Preencha todos os campos')
    return
  }

  transacoes.push({
    tipo: tipoAtual,
    valor,
    descricao,
    data
  })

  localStorage.setItem('transacoes', JSON.stringify(transacoes))
  fecharModal()
  atualizarTela()
}

function atualizarTela() {
  listaEl.innerHTML = ''

  let totalReceitas = 0
  let totalDespesas = 0

  transacoes.forEach((t, index) => {
    if (t.tipo === 'receita') totalReceitas += t.valor
    else totalDespesas += t.valor

    const li = document.createElement('li')
    li.className = t.tipo

    li.innerHTML = `
      <div>
        <strong>${t.descricao}</strong><br>
        <small>${formatarData(t.data)}</small>
      </div>
      <span>${t.tipo === 'receita' ? '+' : '-'} R$ ${t.valor.toFixed(2)}</span>
      <button onclick="remover(${index})">🗑️</button>
    `

    listaEl.appendChild(li)
  })

  const saldo = totalReceitas - totalDespesas

  saldoEl.innerText = `R$ ${saldo.toFixed(2)}`
  receitasEl.innerText = `R$ ${totalReceitas.toFixed(2)}`
  despesasEl.innerText = `R$ ${totalDespesas.toFixed(2)}`

  atualizarGrafico(totalReceitas, totalDespesas)
}

function remover(index) {
  transacoes.splice(index, 1)
  localStorage.setItem('transacoes', JSON.stringify(transacoes))
  atualizarTela()
}

function formatarData(data) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
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
    }
  })
}

atualizarTela()
