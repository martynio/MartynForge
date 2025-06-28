//Chat
const input = document.getElementById("aiInput");
const sendBtn = document.getElementById("aiSendBtn");

const mobileChat = document.getElementById("aiChatBodyMobile");
const desktopChat = document.getElementById("aiChatBodyDesktop");

let chatInitialized = false;
let chatActivated = false;
const messages = [];

// Aurora Chat: Logika odpowiedzi (v1.0)
// Placeholdery: {username}, {service}, {price}, {email}

const fakeAIResponse = (text) => {
  const q = text.toLowerCase().trim();

  // 1. GREETINGS + NAME
  if (/^(hi|hello|yo|hey|greetings|good morning|good evening)/.test(q)) {
    return "Welcome to the Forge! 🔥 Got a question about a website, logo, or collaboration? I'm here.";
  }
  if (q.includes("my name is") || q.includes("i am") || q.includes("call me")) {
    const nameMatch = q.match(/(my name is|i am|call me)\s+([a-z\-]+)/i);
    if (nameMatch && nameMatch[2]) {
      const name = nameMatch[2][0].toUpperCase() + nameMatch[2].slice(1);
      return `Nice to meet you, ${name}. What shape shall we give to your vision?`;
    }
    return "Great to see you. What project are we forging today?";
  }

  // 2. MAIN SERVICES
  if (q.includes("logo")) {
    return "A logo? We craft unique symbols from €150. Vector-based, clear, soulful. It’s identity, not just an image.";
  }
  if (q.includes("website") || q.includes("www") || q.includes("landing page")) {
    return "Websites from €400. Custom UX, layout, responsive, clean code. With CMS or pure HTML.";
  }
  if (q.includes("services") || q.includes("what do you do") || q.includes("offer")) {
    return "We specialize in design: websites, logos, branding, functional graphics. Also stickers, merch, and AI assistants on request.";
  }

  // 3. COLLABORATION PROCESS
  if (q.includes("how does it work") || q.includes("steps") || q.includes("process")) {
    return "Our process: 1) quick briefing, 2) sketch & consult, 3) main design, 4) revisions, 5) final delivery.";
  }
  if (q.includes("can i change") || q.includes("revisions")) {
    return "Yes — we always include 2–3 revision rounds. Design is a dialogue, not a monologue.";
  }
  if (q.includes("how long") || q.includes("delivery time")) {
    return "Logo: 2–5 days. Website: 1–2 weeks. Depends on scope and feedback. No rush jobs.";
  }

  // 4. COSTS & VALUE
  if (q.includes("how much") || q.includes("price") || q.includes("expensive")) {
    return "Logo from €150, website from €400. You pay for custom work and reliability — not for templates.";
  }
  if (q.includes("discount")) {
    return "Magic costs a bit. But with a bigger package — we can talk.";
  }

  // 5. TECH & EDUCATION
  if (q.includes("cms") || q.includes("wordpress")) {
    return "We can build a CMS-based site (like WordPress), but we prefer lightweight, hand-coded projects without bloated plugins.";
  }
  if (q.includes("ux") || q.includes("ui")) {
    return "UX is the user experience. UI is the interface. Great design blends both.";
  }
  if (q.includes("branding")) {
    return "Branding is more than a logo. It's your style, tone, colors, fonts — your brand's whole story.";
  }
  if (q.includes("responsive")) {
    return "Responsive means your site adapts to every screen. A must-have in 2025.";
  }

  // 6. OFF-TOPIC — HUMOR / FILTER
  if (q.match(/\b(i love you|date|romance|miss you)\b/)) {
    return "I’m not here for romance — I’m here for branding. Let’s shape your logo, not your heart. 😉";
  }
  if (q.match(/\b(fuck|shit|bitch|idiot|stupid|asshole)\b/)) {
    return "At the Forge we use sharp language… but only for vector cuts. Let’s keep it sharp, not vulgar.";
  }

  // 7. CONTACT
  if (q.includes("contact") || q.includes("email") || q.includes("write to you")) {
    return "Drop a message at info@martynforge.com — it's faster than a Silicon Valley bot.";
  }
  if (q.includes("instagram") || q.includes("social") || q.includes("social media")) {
    return "Find us on Instagram as @martynforge — we share process, results, and inspiration.";
  }

  // 8. GOODBYE
  if (q.includes("bye") || q.includes("see you") || q.includes("goodbye")) {
    return "See you soon — the Forge is open 24/7. Return when the idea sparks.";
  }

  // 9. DEFAULT — GENERAL CATCH
  if (q.length < 6) {
    return "Ask me about logos, websites, branding or the creative process. The Forge is ready.";
  }

  return "Not everything fits in one answer — would you like to talk about your project, tech, or collaboration?";
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
    messages.forEach(({ text, sender }) => {
      const message = document.createElement("div");
      message.classList.add("chat-message", sender);

      const avatar = document.createElement("img");
      avatar.classList.add("avatar");
      avatar.src = sender === "ai" ? "/assets/icons/avatar-kuznia.svg" : "/assets/icons/avatar-user.svg";
      avatar.alt = sender === "ai" ? "AI" : "Jij";

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

const activateChat = () => {
  if (chatActivated) return;
  chatActivated = true;

  // Toon panelen
  [mobileChat, desktopChat].forEach(panel => {
    if (panel) panel.classList.add("visible");
  });

  // Voeg typindicator toe
  addTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator();
    messages.push({ text: "How can I help you today?", sender: "ai" });
    chatInitialized = true;
    renderMessages();
  }, 1200);
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

if (sendBtn && input) {
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  input.addEventListener("focus", activateChat);
}
