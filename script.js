document.addEventListener("DOMContentLoaded", () => {
  const botao = document.getElementById("btnTeste")
  const resultado = document.getElementById("resultado")

  botao.addEventListener("click", () => {
    resultado.textContent = "O JavaScript está funcionando!"
  })
})
