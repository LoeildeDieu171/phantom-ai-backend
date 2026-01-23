const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let aiBusy = false;

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

function typeText(el, text, speed = 18) {
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
  const text = input.value.trim();
  if (!text || aiBusy) return;

  aiBusy = true;
  input.value = "";
  input.disabled = true;
  sendBtn.disabled = true;

  addMessage(text, "user");
  const aiBubble = addMessage("⏳ Phantom AI réfléchit…", "ai");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    aiBubble.textContent = "";
    typeText(aiBubble, data.response || "Erreur IA");

  } catch (err) {
    aiBubble.textContent = "Erreur serveur.";
  }

  aiBusy = false;
  input.disabled = false;
  sendBtn.disabled = false;
  input.focus();
}

sendBtn.onclick = sendMessage;
input.onkeydown = e => e.key === "Enter" && sendMessage();

window.onload = () => {
  addMessage("Salut. Je suis Phantom AI. Écris-moi un message.", "ai");
};
