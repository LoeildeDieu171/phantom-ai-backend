const chat = document.getElementById("chat-container");
const input = document.getElementById("user-input");
const button = document.getElementById("send-btn");

let history = [
  { role: "system", content: "Tu es Phantom AI, une IA intelligente, claire et utile." }
];

function addMessage(role, text = "") {
  const msg = document.createElement("div");
  msg.className = `message ${role}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  msg.appendChild(bubble);
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;

  return bubble;
}

async function send() {
  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  button.disabled = true;

  addMessage("user", text);
  history.push({ role: "user", content: text });

  const bubble = addMessage("ai", "");

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: history })
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    full += chunk;
    bubble.textContent += chunk;
    chat.scrollTop = chat.scrollHeight;
  }

  history.push({ role: "assistant", content: full });
  button.disabled = false;
}

button.onclick = send;

input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});
