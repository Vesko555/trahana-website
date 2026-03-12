// 1. Глобална дефиниция на gtag (за да работят onclick събитията по бутоните)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// 2. Функция за зареждане на Google Analytics
function activateGA() {
    if (window.ga_activated) return; 
    
    const script = document.createElement('script');
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-60CX9BXBS4";
    document.head.appendChild(script);

    gtag('js', new Date());
    gtag('config', 'G-60CX9BXBS4');
    
    window.ga_activated = true;
    console.log("GA4 е активиран успешно!");
}

// 3. Логика за бисквитките и банера
document.addEventListener("DOMContentLoaded", function() {
    const consent = localStorage.getItem('cookie-consent');
    const banner = document.getElementById('cookie-banner');
    const btnAccept = document.getElementById('btn-accept');
    const btnDecline = document.getElementById('btn-decline');

    if (!banner) return; 

    if (consent === 'accepted') {
        activateGA();
    } else if (consent === null) {
        banner.style.display = 'block'; 
    }

    if (btnAccept) {
        btnAccept.onclick = function() {
            localStorage.setItem('cookie-consent', 'accepted');
            banner.style.display = 'none';
            activateGA();
        };
    }

    if (btnDecline) {
        btnDecline.onclick = function() {
            localStorage.setItem('cookie-consent', 'declined');
            banner.style.display = 'none';
        };
    }
});

// 4. Логика за Галерията (Слайдшоуто)
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function showSlide(index) {
  if (slides.length === 0) return;
  slides.forEach(slide => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

function changeSlide(direction) {
  if (slides.length === 0) return;
  currentSlide += direction;

  if (currentSlide < 0) {
    currentSlide = slides.length - 1;
  }

  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }

  showSlide(currentSlide);
}
