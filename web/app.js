const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const btn = document.getElementById("sendBtn");

let busy = false;

function addMessage(text, cls) {
  const div = document.createElement("div");
  div.className = `message ${cls}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

async function send() {
  if (busy) return;
  const text = input.value.trim();
  if (!text) return;

  busy = true;
  input.disabled = true;
  btn.disabled = true;

  addMessage(text, "user");
  input.value = "";

  const aiDiv = addMessage("", "ai");

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({message: text})
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    aiDiv.textContent += decoder.decode(value);
    chat.scrollTop = chat.scrollHeight;
  }

  busy = false;
  input.disabled = false;
  btn.disabled = false;
  input.focus();
}

btn.onclick = send;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});
