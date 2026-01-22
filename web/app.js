const chat = document.getElementById("chat");
const input = document.getElementById("input");
const send = document.getElementById("send");

let busy = false;

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

function typeEffect(el, text, speed = 15) {
  el.textContent = "";
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    chat.scrollTop = chat.scrollHeight;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

async function sendMessage() {
  if (busy) return;
  const text = input.value.trim();
  if (!text) return;

  busy = true;
  input.value = "";
  input.disabled = true;
  send.disabled = true;

  addMessage(text, "user");
  const aiBubble = addMessage("...", "ai");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message: text})
    });

    const data = await res.json();
    if (data.reply) {
      typeEffect(aiBubble, data.reply);
    } else {
      aiBubble.textContent = "Erreur IA.";
    }
  } catch {
    aiBubble.textContent = "Erreur serveur.";
  }

  busy = false;
  input.disabled = false;
  send.disabled = false;
  input.focus();
}

send.onclick = sendMessage;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});
