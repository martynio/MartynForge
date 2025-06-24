document.addEventListener('DOMContentLoaded', function () {
  // === Pasek językowy ===
  const langBar = document.querySelector('.language-bar');
  window.addEventListener('scroll', function () {
    if (!langBar) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    langBar.classList.toggle('hide-on-scroll', scrollTop !== 0);
  });

  // === Sekcja ABOUT: rotacja grafik ===
  const images = [
    'assets/about/anvil1.png',
    'assets/about/anvil2.png',
    'assets/about/anvil3.png',
    'assets/about/anvil4.png'
  ];
  let index = 0;
  const imageElement = document.getElementById('aboutImage');

  if (imageElement) {
    imageElement.style.transition = 'opacity 0.6s ease-in-out';
    setInterval(() => {
      imageElement.style.opacity = 0;
      setTimeout(() => {
        index = (index + 1) % images.length;
        imageElement.src = images[index];
        imageElement.style.opacity = 1;
      }, 400);
    }, 6000);
  }

  // === Newsletter ===
  const newsletterForm = document.querySelector("form[action='newsletter']");
  const submitBtn = document.querySelector('.mf-btn-submit');

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = this.querySelector("input[type='email']").value.trim();
      if (!email || !email.includes("@")) {
        alert("Podaj poprawny adres email.");
        return;
      }

      submitBtn.disabled = true;
      const originalText = submitBtn.innerText;
      submitBtn.innerText = '✓ Sent';
      submitBtn.style.backgroundColor = '#28a745';

      setTimeout(() => {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        submitBtn.style.backgroundColor = '';
      }, 2000);
    });
  }

  // === Placeholderowe przyciski ===
  document.querySelectorAll("a.btn[href='#']").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      alert("Funkcja w przygotowaniu: " + this.textContent.trim());
    });
  });

  // === Smooth scroll ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // === Animacje kliknięcia dla mf-btn ===
  document.querySelectorAll('.mf-btn').forEach(btn => {
    btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.97)');
    btn.addEventListener('mouseup', () => btn.style.transform = 'scale(1)');
    btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
  });

// === Aurora Mini: czat (1 kontener)
const chatBody = document.getElementById("aiChatBody");
const input = document.getElementById("aiInput");
const sendBtn = document.getElementById("aiSendBtn");

// Przeniesienie czatu na desktop do prawej kolumny
const desktopTarget = document.getElementById('aiChatBodyDesktopPlaceholder');
if (window.innerWidth >= 992 && chatBody && desktopTarget) {
  desktopTarget.appendChild(chatBody);
}

let chatInitialized = false;

const fakeAIResponse = (text) => {
  const q = text.toLowerCase();
  if (q.includes("logo")) return "Logo zazwyczaj od 150€, zależnie od stylu.";
  if (q.includes("strona")) return "Strony zaczynają się od 400€, z pełną responsywnością.";
  return "Chętnie pomogę — napisz więcej!";
};

const addMessage = (text, sender = "user") => {
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

  chatBody.appendChild(message);
  chatBody.scrollTop = chatBody.scrollHeight;
};

const sendMessage = () => {
  const text = input.value.trim();
  if (!text) return;

  if (!chatInitialized) {
    chatBody.style.display = "block";
    chatBody.classList.add("visible");
    addMessage("W czym mogę pomóc?", "ai");
    chatInitialized = true;
  }

  addMessage(text, "user");
  input.value = "";

  setTimeout(() => {
    addMessage(fakeAIResponse(text), "ai");
  }, 500);
};

if (sendBtn && input && chatBody) {
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
}

  // === Interaktywne kafelki usług ===
  const serviceCards = document.querySelectorAll('.service-card');

  function resetCards() {
    serviceCards.forEach(c => {
      c.classList.remove('focused', 'dimmed', 'active', 'activating');
      const d = c.querySelector('.service-details');
      if (d) {
        d.style.maxHeight = '0';
        d.style.opacity = '0';
      }
    });
  }

  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      const isFocused = card.classList.contains('focused');

      if (isFocused) {
        resetCards();
        return;
      }

      card.classList.add('activating');
      resetCards();

      setTimeout(() => {
        card.classList.add('focused', 'active');
        card.parentElement.classList.add('focused');
        serviceCards.forEach(c => {
          if (c !== card) c.classList.add('dimmed');
        });

        const details = card.querySelector('.service-details');
        if (details) {
          details.style.maxHeight = details.scrollHeight + 'px';
          details.style.opacity = '1';
        }

        card.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    });
  });
});
