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
    return "Witaj w Kuźni! 🔥 Masz pytanie o stronę, logo, proces współpracy? Działam.";
  }
  if (q.includes("nazywam się") || q.includes("jestem") || q.includes("mam na imię")) {
    const nameMatch = q.match(/(nazywam się|jestem|mam na imię)\s+([a-ząćęłńóśźżź\-]+)/i);
    if (nameMatch && nameMatch[2]) {
      const name = nameMatch[2][0].toUpperCase() + nameMatch[2].slice(1);
      return `Miło Cię widzieć, ${name}. Jaką formę nadajemy Twojej wizji?`;
    }
    return "Dobrze Cię widzieć. Jaki projekt dziś kujesz?";
  }

  // 2. GŁÓWNE USŁUGI
  if (q.includes("logo")) {
    return "Logo? Tworzymy unikalne znaki od 150€. Wektorowe, czytelne, z duszą. Nadajemy tożsamość, nie tylko grafikę.";
  }
  if (q.includes("strona") || q.includes("www") || q.includes("landing page")) {
    return "Strony startują od 400€. Projektujemy je od zera: UX, layout, responsywność, lekkość kodu. Do tego: CMS lub czysty HTML.";
  }
  if (q.includes("oferta") || q.includes("co robicie") || q.includes("jakie usługi")) {
    return "Specjalizujemy się w designie: strony, logo, branding, grafika użytkowa. Możliwe też naklejki, merch i AI-asystenci na zamówienie.";
  }

  // 3. PROCES WSPÓŁPRACY
  if (q.includes("jak to działa") || q.includes("etapy") || q.includes("proces")) {
    return "Etapy współpracy: 1) krótki brief, 2) szkice i konsultacja, 3) projekt główny, 4) poprawki, 5) finalizacja i pliki.";
  }
  if (q.includes("czy mogę coś zmienić") || q.includes("poprawki")) {
    return "Tak, zawsze przewidujemy 2–3 tury poprawek. Projekt to dialog, nie monolog.";
  }
  if (q.includes("jak długo") || q.includes("czas realizacji")) {
    return "Logo: 2–5 dni. Strona: 1–2 tygodnie. Wszystko zależy od zakresu i feedbacku. Nie robimy 'na kolanie'.";
  }

  // 4. KOSZTY I WARTOŚĆ
  if (q.includes("ile kosztuje") || q.includes("cena") || q.includes("drogo")) {
    return "Projekt logo od 150€, strona od 400€. Płacisz za indywidualne podejście i solidność, nie szablony z internetu.";
  }
  if (q.includes("czy mogę dostać rabat")) {
    return "W Kuźni magia kosztuje. Ale przy większym pakiecie – coś wykombinujemy.";
  }

  // 5. TECHNOLOGIA I EDUKACJA
  if (q.includes("cms") || q.includes("wordpress")) {
    return "Możemy zrobić stronę z CMS (np. WordPress), ale wolimy lekkie, ręcznie kodowane projekty bez zbędnych wtyczek.";
  }
  if (q.includes("ux") || q.includes("ui")) {
    return "UX to doświadczenie użytkownika. UI to jego opakowanie. Dobry projekt łączy jedno z drugim.";
  }
  if (q.includes("branding")) {
    return "Branding to nie tylko logo. To styl, ton, kolory, czcionki — cała opowieść o Twojej marce.";
  }
  if (q.includes("responsywny")) {
    return "Responsywność to zdolność strony do dostosowania się do każdego ekranu. Must-have w 2025.";

  }

  // 6. NIE NA TEMAT — HUMOR / ODCIĘCIE
  if (q.match(/\b(kocham cię|randka|romans|tęsknię)\b/)) {
    return "Nie jestem tu od romansów — jestem od brandingu. Skupmy się na logo, nie sercach. 😉";
  }
  if (q.match(/\b(kurw|chuj|pierd|idiot|głup|jeb)\b/)) {
    return "W Kuźni używamy języka ostrego... ale tylko do cięcia wektorów. Trzymajmy klasę.";
  }

  // 7. KONTAKT
  if (q.includes("kontakt") || q.includes("napisać") || q.includes("e-mail")) {
    return "Śmiało napisz na info@martynforge.com — zadziała szybciej niż bot z doliny krzemowej.";
  }
  if (q.includes("instagram") || q.includes("sociale") || q.includes("media społecznościowe")) {
    return "Znajdziesz nas jako @martynforge — tam wrzucamy procesy, efekty i zajawki.";

  }

  // 8. ZAKOŃCZENIA
  if (q.includes("pa") || q.includes("nara") || q.includes("do widzenia") || q.includes("do zobaczenia")) {
    return "Trzymaj się — Kuźnia otwarta 24/7. Wróć, gdy pomysł zapuka.";
  }

  // 9. DEFAULT — OGÓLNE PYTANIE
  if (q.length < 6) {
    return "Zadaj pytanie o logo, stronę, branding albo proces współpracy. Kuźnia czeka.";
  }

  return "Nie wszystko da się zmieścić w jednej odpowiedzi — chcesz pogadać o projekcie, technologii czy współpracy?";
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

const activateChat = () => {
  if (chatActivated) return;
  chatActivated = true;

  // Pokaż panele
  [mobileChat, desktopChat].forEach(panel => {
    if (panel) panel.classList.add("visible");
  });

  // Dodaj typing dots
  addTypingIndicator();

  setTimeout(() => {
    removeTypingIndicator();
    messages.push({ text: "W czym mogę pomóc?", sender: "ai" });
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
