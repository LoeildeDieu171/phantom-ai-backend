const chat = document.getElementById("chat-container");
const input = document.getElementById("user-input");
const button = document.getElementById("send-btn");

let aiBusy = false;

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  msg.appendChild(bubble);

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;

  if (sender === "ai") {
    typeText(bubble, text);
  } else {
    bubble.textContent = text;
  }
}

function typeText(element, text) {
  let i = 0;
  aiBusy = true;
  button.disabled = true;

  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      chat.scrollTop = chat.scrollHeight;
      setTimeout(typing, 18); // vitesse type ChatGPT
    } else {
      aiBusy = false;
      button.disabled = false;
    }
  }

  typing();
}

function fakeAIResponse(userText) {
  const responses = [
    "Bonne question. Laisse-moi t’expliquer ça clairement.",
    "Voici comment je vois les choses.",
    "Intéressant. Allons droit au but.",
    "D’accord. Voici une réponse détaillée.",
    "Je comprends ce que tu veux faire."
  ];

  const base = responses[Math.floor(Math.random() * responses.length)];
  return `${base}\n\nTu as écrit : "${userText}"\n\n(On branchera une vraie IA juste après.)`;
}

button.addEventListener("click", send);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});

function send() {
  if (aiBusy) return;

  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  setTimeout(() => {
    const reply = fakeAIResponse(text);
    addMessage(reply, "ai");
  }, 400);
}
