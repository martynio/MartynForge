document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById("aiInput");
  const sendBtn = document.getElementById("aiSendBtn");

  const mobileChat = document.getElementById("aiChatBodyMobile");
  const desktopChat = document.getElementById("aiChatBodyDesktop");

  let chatInitialized = false;
  const messages = [];

  const fakeAIResponse = (text) => {
    const q = text.toLowerCase();
    if (q.includes("logo")) return "Logo zazwyczaj od 150€, zależnie od stylu.";
    if (q.includes("strona")) return "Strony zaczynają się od 400€, z pełną responsywnością.";
    return "Chętnie pomogę — napisz więcej!";
  };

  const addTypingIndicator = () => {
    [mobileChat, desktopChat].forEach(panel => {
      if (!panel) return;
      const typing = document.createElement("div");
      typing.classList.add("chat-message", "ai", "typing");
      typing.id = "typing-indicator";

      const avatar = document.createElement("img");
      avatar.classList.add("avatar");
      avatar.src = "assets/icons/avatar-kuznia.svg";
      avatar.alt = "AI";

      const bubble = document.createElement("div");
      bubble.classList.add("bubble");
      bubble.innerHTML = '<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';

      typing.appendChild(avatar);
      typing.appendChild(bubble);
      panel.appendChild(typing);
      panel.scrollTop = panel.scrollHeight;
    });
  };

  const removeTypingIndicator = () => {
    document.querySelectorAll('#typing-indicator').forEach(el => el.remove());
  };

  const renderMessages = () => {
    [mobileChat, desktopChat].forEach(panel => {
      if (!panel) return;
      panel.innerHTML = "";
      panel.classList.add("visible", "fade-in");

      messages.forEach(({ text, sender }) => {
        const message = document.createElement("div");
        message.classList.add("chat-message", sender);

        const avatar = document.createElement("img");
        avatar.classList.add("avatar");
        avatar.src = sender === "ai" ? "assets/icons/avatar-kuznia.svg" : "assets/icons/avatar-user.svg";
        avatar.alt = sender === "ai" ? "AI" : "Ty";

        const bubble = document.createElement("div");
        bubble.classList.add("bubble");
        bubble.textContent = text;

        if (sender === "ai") {
          message.appendChild(avatar);
          message.appendChild(bubble);
        } else {
          message.appendChild(bubble);
          message.appendChild(avatar);
        }

        panel.appendChild(message);
      });

      panel.scrollTop = panel.scrollHeight;
    });
  };

  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;

    messages.push({ text, sender: "user" });
    renderMessages();
    input.value = "";

    addTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      messages.push({ text: fakeAIResponse(text), sender: "ai" });
      renderMessages();
    }, 1200);
  };

  // === Inicjalizacja: kliknięcie inputa ===
  input.addEventListener("focus", () => {
    if (!chatInitialized) {
      setTimeout(() => {
        messages.push({ text: "W czym mogę pomóc?", sender: "ai" });
        renderMessages();
        chatInitialized = true;
      }, 600); // opóźnienie powitania
    }
  });

  if (sendBtn && input) {
    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }
});
