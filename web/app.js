const input = document.getElementById("input");
const chat = document.getElementById("chat");
const send = document.getElementById("send");

send.onclick = async () => {
  if (!input.value.trim()) return;

  const userMsg = input.value;
  input.value = "";

  chat.innerHTML += `<div class="user">${userMsg}</div>`;
  const aiDiv = document.createElement("div");
  aiDiv.className = "ai";
  chat.appendChild(aiDiv);

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMsg })
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    aiDiv.textContent += decoder.decode(value);
  }
};
