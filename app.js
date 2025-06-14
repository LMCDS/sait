const users = {
  "Leonardo01": "01121723",
  "Silvia": "Silvia123",
  "Hellen": "Hellen123",
  "Antonio": "Antonio123",
  "Albert": "Albert123",
  "Fabio": "Fabio123"
};

let betoneiras = [];
let filtroAtual = "todas";
let filtroTexto = "";

// Gera 120 betoneiras iniciais
function gerarBetoneiras() {
  betoneiras = [];
  for (let i = 1; i <= 120; i++) {
    const id = i;
    const nome = `BT${String(i).padStart(2, '0')} BETONEIRA 400L`;
    betoneiras.push({
      id,
      nome,
      status: "disponível",
      ultimoResponsavel: "N/A"
    });
  }
}

// Salva no localStorage
function salvarBetoneiras() {
  localStorage.setItem("betoneirasData", JSON.stringify(betoneiras));
}

// Carrega do localStorage
function carregarBetoneiras() {
  const data = localStorage.getItem("betoneirasData");
  if (data) {
    betoneiras = JSON.parse(data);
  } else {
    gerarBetoneiras();
    salvarBetoneiras();
  }
}

// Login
function login() {
  const user = document.getElementById("userSelect").value;
  const pass = document.getElementById("password").value;
  const errorBox = document.getElementById("loginError");

  if (users[user] === pass) {
    document.getElementById("loginBox").classList.add("hidden");
    document.getElementById("mainContent").classList.remove("hidden");
    carregarBetoneiras();
    renderTabela();
    errorBox.textContent = "";
    document.getElementById("mainContent").focus();
  } else {
    errorBox.textContent = "Senha incorreta!";
  }
}

// Logout
function logout() {
  location.reload();
}

// Renderiza a tabela
function renderTabela() {
  const tbody = document.querySelector("#betoneiraTable tbody");
  tbody.innerHTML = "";

  const listaFiltrada = betoneiras.filter(b => {
    const statusOk = filtroAtual === "todas" || b.status === filtroAtual;
    const texto = filtroTexto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const nome = b.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const textoOk = nome.includes(texto) || String(b.id).includes(texto);
    return statusOk && textoOk;
  });

  if (listaFiltrada.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.style.color = "#ef4444";
    td.style.fontWeight = "700";
    td.style.textAlign = "center";
    td.textContent = "Nenhuma betoneira encontrada";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  listaFiltrada.forEach((b, i) => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.textContent = b.id;

    const tdNome = document.createElement("td");
    tdNome.textContent = b.nome;

    const tdStatus = document.createElement("td");
    tdStatus.textContent = b.status;
    tdStatus.className = `status-${b.status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;

    const tdResp = document.createElement("td");
    tdResp.textContent = b.ultimoResponsavel;

    const tdAcao = document.createElement("td");
    const select = document.createElement("select");

    ["disponível", "alugada", "manutenção", "sucata"].forEach(status => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      if (status === b.status) option.selected = true;
      select.appendChild(option);
    });

    select.onchange = () => {
      const user = document.getElementById("userSelect").value;
      betoneiras[i].status = select.value;
      betoneiras[i].ultimoResponsavel = user;
      salvarBetoneiras();
      renderTabela();
    };

    tdAcao.appendChild(select);

    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdStatus);
    tr.appendChild(tdResp);
    tr.appendChild(tdAcao);

    tbody.appendChild(tr);
  });
}

// Filtrar por texto
function filtrarTexto(texto) {
  filtroTexto = texto.trim().toLowerCase();
  renderTabela();
}

// Definir filtro por status
function setFiltroStatus(status) {
  filtroAtual = status;
  document.querySelectorAll("#filterButtons button").forEach(btn => {
    const ativo = btn.dataset.filter === status;
    btn.classList.toggle("active", ativo);
    btn.setAttribute("aria-pressed", ativo.toString());
  });
  renderTabela();
}

// Eventos iniciais
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchInput").addEventListener("input", e => {
    filtrarTexto(e.target.value);
  });

  document.getElementById("searchInput").addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      filtrarTexto(e.target.value);
    }
  });

  document.getElementById("searchButton").addEventListener("click", () => {
    const valor = document.getElementById("searchInput").value;
    filtrarTexto(valor);
  });

  document.querySelectorAll("#filterButtons button").forEach(btn => {
    btn.addEventListener("click", () => {
      setFiltroStatus(btn.dataset.filter);
    });
  });
});
