const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

let aiBusy = false;

/* Ajouter message */
function addMessage(text, type) {
  const div = document.createElement("div");
  div.classList.add("message", type);
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

/* Effet écriture progressive */
function typeText(element, text, speed = 22) {
  element.textContent = "";
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;
    chat.scrollTop = chat.scrollHeight;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

/* Faux cerveau IA (sera remplacé par API OpenAI) */
function generateAIResponse(userText) {
  const responses = [
    "Intéressant. Peux-tu m’en dire plus ?",
    "Je comprends. Voici ce que je peux te dire.",
    "Bonne question. Analysons ça ensemble.",
    "D’accord. Voilà une réponse claire.",
    "Hmm… réfléchissons intelligemment à ça."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

/* Envoyer message */
function sendMessage() {
  const text = input.value.trim();
  if (!text || aiBusy) return;

  aiBusy = true;
  input.value = "";
  input.disabled = true;
  sendBtn.disabled = true;

  addMessage(text, "user");

  const aiBubble = addMessage("", "ai");

  setTimeout(() => {
    const response = generateAIResponse(text);
    typeText(aiBubble, response);
  }, 400);

  setTimeout(() => {
    aiBusy = false;
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }, 1800);
}

/* Events */
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

/* Message d’accueil */
window.onload = () => {
  addMessage("Salut. Je suis Phantom AI. Écris-moi un message.", "ai");
};
