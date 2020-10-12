import "./styles/main.scss";
import { fun } from "./dashboard.js"

const server = "http://localhost:3042";

fun();

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

fetch(`${server}/addresses`).then((response) => {
    return response.json();
  }).then(({ addresses }) => {
    removeAllChildNodes(addresses)
    for (let i=0; i<addresses.length; i++) {
      var address = document.createElement("li");
      var node = document.createTextNode(addresses[i]);
      address.appendChild(node);
      var element = document.getElementById("addresses");
      element.appendChild(address);
      }
});

document.getElementById("exchange-address").addEventListener('input', ({ target : {value} }) => {
  if(value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});

document.getElementById("transfer-amount").addEventListener('click', () => {
  const sender = document.getElementById("exchange-address").value;
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value;

  const body = JSON.stringify({
    sender, amount, recipient
  });

  const request = new Request(`${server}/send`, { method: 'POST', body });

  fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});
