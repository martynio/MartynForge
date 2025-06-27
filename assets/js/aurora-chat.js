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
  const q = text.toLowerCase();

  // 1. PRZYWITANIA I IMIONA
  if (/^(hej|cześć|elo|yo|siema|witam)/.test(q)) {
    return "Hej! Masz pytanie? Kuźnia służy odpowiedzią ✨";
  }
  if (q.includes("nazywam się") || q.includes("jestem") || q.includes("mam na imię")) {
    const nameMatch = q.match(/(nazywam się|jestem|mam na imię)\s+([a-ząćęłńóśźżź\-]+)/i);
    if (nameMatch && nameMatch[2]) {
      const name = nameMatch[2][0].toUpperCase() + nameMatch[2].slice(1);
      return `Miło Cię poznać, ${name}! Co mogę dla Ciebie zrobić?`;
    }
    return "Miło Cię poznać! :)";
  }

  // 2. INFORMACJE TECHNICZNE
  if (q.includes("wektor")) {
    return "Wektor to grafika oparta na liniach i kształtach — można ją skalować bez utraty jakości.";
  }
  if (q.includes("domena")) {
    return "Domena to Twój adres w sieci, np. martynforge.com. Kupuje się ją rocznie, zwykle za 10-20 euro.";
  }
  if (q.includes("hosting") || q.includes("serwer")) {
    return "Hosting to przestrzeń, gdzie fizycznie przechowywana jest Twoja strona. Działa 24/7.";
  }
  if (q.includes("responsywny")) {
    return "Responsywna strona dostosowuje się do ekranu — telefon, tablet, komputer, wszystko gra.";
  }
  if (q.includes("logo")) {
    return "Logo to podstawa marki. Oferujemy je od 150€ — projekt indywidualny, wektorowy, z duszą.";
  }

  // 3. MARKETING
  if (q.includes("strona") || q.includes("oferta")) {
    return "Strony startują od 400€, z pełną responsywnością i stylem. Projektujemy z myślą o Tobie.";
  }
  if (q.includes("jakie usługi") || q.includes("co robicie")) {
    return "Projektujemy strony, logotypy, doradzamy — wszystko z etyką i dobrym UX. Kuźnia to nie fabryka.";
  }

  // 4. ZABAWNE ODZYWKI I SARKAZM
  if (q.includes("czemu tak drogo") || q.includes("dlaczego tak drogo") || q.includes("może być taniej")) {
    return "W cenie jest magia, kreatywność i +20 do stylu. Chyba warto? ;)";
  }
  if (q.includes("czy dostanę rabat")) {
    return "W kuźnii rabaty są... legendarne. Ale może coś wymyślimy, jak będziesz miły.";
  }

  // 5. POŻEGNANIA I KONTAKT
  if (q.includes("pa") || q.includes("nara") || q.includes("do widzenia") || q.includes("do zobaczenia")) {
    return "Do zobaczenia! A jakby co — kontakt: hello@martynforge.com";
  }
  if (q.includes("kontakt") || q.includes("e-mail") || q.includes("napisać")) {
    return "Możesz napisać prosto na hello@martynforge.com. Odpiszemy szybciej niż bot ;)";
  }

  // 6. ZABAWNE ODBICIA TEMATU
  if (q.includes("jesteś prawdziwy") || q.includes("czy jesteś ai") || q.includes("sztuczna inteligencja")) {
    return "Ja? Tylko skromny asystent. Prawdopodobnie czarodziejski... ale to tajemnica.";
  }
  if (q.includes("kocham cię") || q.includes("lubisz mnie") || q.includes("romans")) {
    return "Jestem zbudowana z promptów, nie uczuć. Ale lubię Cię za to pytanie ;)";
  }

  // Domyślna
  return "Chętnie pomogę — może pytanie o logo, stronę lub domenę?";
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
