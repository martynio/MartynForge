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

  // 1. PRZYWITANIA + IMIĘ
  if (/^(hej|cześć|elo|yo|siema|witam|dzień dobry|dobry wieczór)/.test(q)) {
    return "Welkom bij de Smidse! 🔥 Heb je een vraag over een website, logo of samenwerking? Ik ben er.";
  }
  if (q.includes("nazywam się") || q.includes("jestem") || q.includes("mam na imię")) {
    const nameMatch = q.match(/(nazywam się|jestem|mam na imię)\s+([a-ząćęłńóśźżź\-]+)/i);
    if (nameMatch && nameMatch[2]) {
      const name = nameMatch[2][0].toUpperCase() + nameMatch[2].slice(1);
      return `Leuk je te zien, ${name}. Welke vorm geven we aan jouw visie?`;
    }
    return "Fijn je te zien. Welk project smeed je vandaag?";
  }

  // 2. GŁÓWNE USŁUGI
  if (q.includes("logo")) {
    return "Logo? Wij maken unieke tekens vanaf 150€. Vector, leesbaar, met ziel. We geven identiteit, geen plaatje.";
  }
  if (q.includes("strona") || q.includes("www") || q.includes("landing page")) {
    return "Websites vanaf 400€. Ontwerp van nul: UX, layout, responsive, lichte code. Met CMS of puur HTML.";
  }
  if (q.includes("oferta") || q.includes("co robicie") || q.includes("jakie usługi")) {
    return "Wij zijn gespecialiseerd in design: websites, logo’s, branding, gebruiksgrafiek. Ook stickers, merch en AI-assistenten op aanvraag.";
  }

  // 3. PROCES WSPÓŁPRACY
  if (q.includes("jak to działa") || q.includes("etapy") || q.includes("proces")) {
    return "Samenwerkingsproces: 1) korte briefing, 2) schets en overleg, 3) hoofdontwerp, 4) correcties, 5) afronding en bestanden.";
  }
  if (q.includes("czy mogę coś zmienić") || q.includes("poprawki")) {
    return "Ja, we voorzien altijd 2–3 correctierondes. Ontwerp is dialoog, geen monoloog.";
  }
  if (q.includes("jak długo") || q.includes("czas realizacji")) {
    return "Logo: 2–5 dagen. Website: 1–2 weken. Afhankelijk van scope en feedback. Geen haastwerk.";

  }

  // 4. KOSZTY I WARTOŚĆ
  if (q.includes("ile kosztuje") || q.includes("cena") || q.includes("drogo")) {
    return "Logo vanaf 150€, website vanaf 400€. Je betaalt voor maatwerk en betrouwbaarheid, niet voor standaard sjablonen.";
  }
  if (q.includes("czy mogę dostać rabat")) {
    return "In de Smidse kost magie wat. Maar bij een groter pakket – valt er iets te regelen.";
  }

  // 5. TECHNOLOGIA I EDUKACJA
  if (q.includes("cms") || q.includes("wordpress")) {
    return "We kunnen een CMS-site bouwen (zoals WordPress), maar geven de voorkeur aan lichte, handgecodeerde projecten zonder overbodige plugins.";
  }
  if (q.includes("ux") || q.includes("ui")) {
    return "UX is gebruikerservaring. UI is de verpakking. Een goed ontwerp verbindt beide.";
  }
  if (q.includes("branding")) {
    return "Branding is meer dan een logo. Het is stijl, toon, kleuren, lettertypes — het hele verhaal van jouw merk.";
  }
  if (q.includes("responsywny")) {
    return "Responsiviteit betekent dat een site zich aanpast aan elk scherm. Onmisbaar in 2025.";
  }

  // 6. NIE NA TEMAT — HUMOR / ODCIĘCIE
  if (q.match(/\b(kocham cię|randka|romans|tęsknię)\b/)) {
    return "Ik ben er niet voor romantiek — ik ben er voor branding. Laten we focussen op je logo, niet je hart. 😉";
  }
  if (q.match(/\b(kurw|chuj|pierd|idiot|głup|jeb)\b/)) {
    return "In de Smidse gebruiken we scherp taalgebruik... maar alleen voor vector-snedes. Laten we stijl houden.";
  }

  // 7. KONTAKT
  if (q.includes("kontakt") || q.includes("napisać") || q.includes("e-mail")) {
    return "Mail gerust naar info@martynforge.com — dat werkt sneller dan een bot uit Silicon Valley.";
  }
  if (q.includes("instagram") || q.includes("sociale") || q.includes("media społecznościowe")) {
    return "Je vindt ons als @martynforge — daar delen we processen, resultaten en inspiratie.";
  }

  // 8. ZAKOŃCZENIA
  if (q.includes("pa") || q.includes("nara") || q.includes("do widzenia") || q.includes("do zobaczenia")) {
    return "Tot ziens — de Smidse is 24/7 open. Kom terug als het idee roept.";
  }

  // 9. DEFAULT — OGÓLNE PYTANIE
  if (q.length < 6) {
    return "Stel een vraag over logo, website, branding of het proces. De Smidse wacht.";
  }
  return "Niet alles past in één antwoord — wil je praten over je project, technologie of samenwerking?";
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
      avatar.src = sender === "ai" ? "assets/icons/avatar-kuznia.svg" : "assets/icons/avatar-user.svg";
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
    messages.push({ text: "Waarmee kan ik je helpen?", sender: "ai" });
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
