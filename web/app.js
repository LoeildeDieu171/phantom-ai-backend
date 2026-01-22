const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let aiBusy = false;
let memory = JSON.parse(localStorage.getItem("phantomMemory") || "[]");

// =====================
// UTILS
// =====================

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

function saveMemory(role, content) {
  memory.push({ role, content });
  memory = memory.slice(-10); // limite mémoire
  localStorage.setItem("phantomMemory", JSON.stringify(memory));
}

// =====================
// TYPE EFFECT
// =====================

async function typeStream(element, response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  element.textContent = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    element.textContent += decoder.decode(value);
    chat.scrollTop = chat.scrollHeight;
  }
}

// =====================
// SEND MESSAGE
// =====================

async function sendMessage() {
  if (aiBusy) return;

  const text = input.value.trim();
  if (!text) return;

  aiBusy = true;
  input.disabled = true;
  sendBtn.disabled = true;

  input.value = "";

  addMessage(text, "user");
  saveMemory("user", text);

  const aiBubble = addMessage("…", "ai");

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        memory: memory
      })
    });

    if (!res.ok) {
      aiBubble.textContent = "Erreur serveur.";
    } else {
      await typeStream(aiBubble, res);
      saveMemory("assistant", aiBubble.textContent);
    }

  } catch {
    aiBubble.textContent = "Erreur serveur.";
  }

  aiBusy = false;
  input.disabled = false;
  sendBtn.disabled = false;
  input.focus();
}

// =====================
// EVENTS
// =====================

sendBtn.onclick = sendMessage;

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
