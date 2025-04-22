let cpf = '';

const keypad = document.getElementById("keypad");
const btnLayout = [
  "7", "8", "9",
  "4", "5", "6",
  "1", "2", "3",
  "←", "0", "Confirma"
];

// Cria os botões com estilo catraca
btnLayout.forEach(label => {
  const btn = document.createElement("button");
  btn.textContent = label;

  btn.className =
    "py-3 px-4 text-xl font-bold rounded-lg bg-gray-700 hover:bg-gray-600 text-white border border-gray-500 shadow transition duration-150";

  if (label === "←") {
    btn.classList.add("bg-red-700", "hover:bg-red-600", "text-white");
    btn.onclick = backspace;
  } else if (label === "Confirma") {
    btn.classList.add("bg-green-600", "hover:bg-green-500", "text-white", "col-span-1");
    btn.onclick = confirmCPF;
  } else {
    btn.onclick = () => addDigit(label);
  }

  keypad.appendChild(btn);
});

function addDigit(digit) {
  if (cpf.length < 11) {
    cpf += digit;
    updateInput();
  }
}

function backspace() {
  cpf = cpf.slice(0, -1);
  updateInput();
}

function updateInput() {
  const formatted = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})$/, "$1.$2.$3-$4");
  document.getElementById("cpfInput").value = formatted;
}

async function confirmCPF() {
  const rawCpf = cpf;
  const msgDiv = document.getElementById("message");
  msgDiv.classList.remove("hidden");

  try {
    const res = await fetch(`https://recepcao-academia.vercel.app/alunos/${rawCpf}`);
    const data = await res.json();

    if (res.status === 200) {
      msgDiv.innerHTML = `✅ <strong>${data.mensagem}</strong>`;
      msgDiv.className = "bg-green-600 text-white rounded-xl py-4 px-3 text-center shadow-md";
    } else if (res.status === 403) {
      msgDiv.innerHTML = `🚫 <strong>Acesso negado!</strong><br>${data.mensagem}.`;
      msgDiv.className = "bg-red-600 text-white rounded-xl py-4 px-3 text-center shadow-md";
    } else if (res.status === 404) {
      msgDiv.innerHTML = `⚠️ <strong>${data.mensagem}</strong><br> Verifique o número digitado ou procure a secretaria.`;
      msgDiv.className = "bg-yellow-600 text-white rounded-xl py-4 px-3 text-center shadow-md";
    } else {
      msgDiv.innerHTML = `⚠️ Erro desconhecido.`;
      msgDiv.className = "bg-yellow-600 text-white rounded-xl py-4 px-3 text-center shadow-md";
    }
  } catch (err) {
    msgDiv.innerHTML = `⚠️ Erro ao conectar com o sistema.`;
    msgDiv.className = "bg-yellow-600 text-white rounded-xl py-4 px-3 text-center shadow-md";
  }

  // Limpa o CPF e atualiza a exibição
  cpf = '';
  updateInput();

  // Timer para esconder a mensagem após 2 segundos
  setTimeout(() => {
    msgDiv.classList.add("hidden");
  }, 2000);
}
