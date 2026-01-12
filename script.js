const botao = document.getElementById('btnTeste')
const texto = document.getElementById('resultado')

botao.addEventListener('click', () => {
  texto.innerText = 'O JavaScript está funcionando!'
})
