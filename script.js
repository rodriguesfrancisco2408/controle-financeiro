let saldo = 0;

const saldoEl = document.getElementById("saldo");
const listaEl = document.getElementById("lista");
const btnReceita = document.getElementById("btnReceita");
const btnDespesa = document.getElementById("btnDespesa");

btnReceita.addEventListener("click", () => {
  const valor = prompt("Valor da receita:");
  if (!valor) return;

  const num = Number(valor);
  saldo += num;

  saldoEl.textContent = saldo.toFixed(2);

  const li = document.createElement("li");
  li.textContent = `+ R$ ${num.toFixed(2)}`;
  listaEl.appendChild(li);
});

btnDespesa.addEventListener("click", () => {
  const valor = prompt("Valor da despesa:");
  if (!valor) return;

  const num = Number(valor);
  saldo -= num;

  saldoEl.textContent = saldo.toFixed(2);

  const li = document.createElement("li");
  li.textContent = `- R$ ${num.toFixed(2)}`;
  listaEl.appendChild(li);
});
