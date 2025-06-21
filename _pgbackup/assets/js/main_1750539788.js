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

  // === Formularz wyszukiwania ===
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const value = this.querySelector("input[type='text']").value.trim();
      alert(value ? "Wyszukujesz: " + value : "Wpisz coś, co chcesz znaleźć!");
    });
  }

  // === Formularz newslettera ===
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
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'scale(0.97)';
    });
    btn.addEventListener('mouseup', () => {
      btn.style.transform = 'scale(1)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'scale(1)';
    });
  });

  // === AI Modal Bot ===
 const entryBar = document.getElementById("ai-entry");
const chatPanel = document.getElementById("aiChatPanel");
const openBtn = document.getElementById("aiOpenBtn");
const closeBtn = document.getElementById("aiCloseBtn");
const chatInput = document.getElementById("aiChatInput");
const chatBody = document.getElementById("aiChatBody");
const sendBtn = document.getElementById("aiSendBtn");

const fakeAIResponse = (userText) => {
  if (userText.toLowerCase().includes("logo")) return "Logo zaczyna się od 150€, ale zależy od stylu.";
  return "Chętnie pomogę — opowiedz więcej.";
};

const addMessage = (text, sender = "user") => {
  const div = document.createElement("div");
  div.classList.add("mb-2", "text-start");
  div.innerHTML = `<span class="badge ${sender === "ai" ? 'bg-warning text-dark' : 'bg-primary'}">${text}</span>`;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
};

const sendMessage = () => {
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(text, "user");
  chatInput.value = "";

  setTimeout(() => {
    addMessage(fakeAIResponse(text), "ai");
  }, 500);
};

[entryBar, openBtn].forEach(el => el?.addEventListener("click", () => {
  chatPanel.style.display = "block";
}));

closeBtn?.addEventListener("click", () => {
  chatPanel.style.display = "none";
});

sendBtn?.addEventListener("click", sendMessage);
chatInput?.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

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

