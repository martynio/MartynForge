document.addEventListener('DOMContentLoaded', function () {
  const langBar = document.querySelector('.language-bar');

  // Pasek językowy
  window.addEventListener('scroll', function () {
    if (!langBar) return;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    langBar.classList.toggle('hide-on-scroll', scrollTop !== 0);
  });

  // Formularz szukania
  const searchForm = document.getElementById("search-form");
  if (searchForm) {
    searchForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const value = this.querySelector("input[type='text']").value.trim();
      alert(value ? "Wyszukujesz: " + value : "Wpisz coś, co chcesz znaleźć!");
      // Można dodać: location.href = "/search?q=" + encodeURIComponent(value);
    });
  }

  // Formularz newslettera
  const newsletterForm = document.querySelector("form[action='newsletter']");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const email = this.querySelector("input[type='email']").value.trim();
      alert(email && email.includes("@")
        ? "Dziękujemy! Dodano do newslettera: " + email
        : "Podaj poprawny adres email.");
    });
  }

  // Placeholderowe przyciski
  document.querySelectorAll("a.btn[href='#']").forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      alert("Funkcja w przygotowaniu: " + this.textContent.trim());
    });
  });
});
