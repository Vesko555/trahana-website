
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

// 3. Логика за банера - пускаме я чак когато HTML е зареден напълно
document.addEventListener("DOMContentLoaded", function() {
    const consent = localStorage.getItem('cookie-consent');
    const banner = document.getElementById('cookie-banner');
    const btnAccept = document.getElementById('btn-accept');
    const btnDecline = document.getElementById('btn-decline');

    if (!banner) return; // Ако го няма на страницата, не прави нищо

    // Проверка на съгласието
    if (consent === 'accepted') {
        activateGA();
    } else if (consent === null) {
        banner.style.display = 'block'; // Показваме го само на нови хора
    }

    // Клик на "Приемам"
    if (btnAccept) {
        btnAccept.onclick = function() {
            localStorage.setItem('cookie-consent', 'accepted');
            banner.style.display = 'none';
            activateGA();
        };
    }

    // Клик на "Отказвам"
    if (btnDecline) {
        btnDecline.onclick = function() {
            localStorage.setItem('cookie-consent', 'declined');
            banner.style.display = 'none';
            console.log("Потребителят отказа следене.");
        };
    }
});

let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

function changeSlide(direction) {
  currentSlide += direction;

  if (currentSlide < 0) {
    currentSlide = slides.length - 1;
  }

  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }

  showSlide(currentSlide);
}



const scriptURL = 'https://script.google.com/macros/s/AKfycbwmbVgf8qYRd3mjwt-Wlc7Dbw2NPMqiyP1qOAeFa6fU8-1DnYJQgTFC1fLXouvr0tAM/exec';
const form = document.getElementById('orderForm');
const btn = document.getElementById('submitBtn');
const msg = document.getElementById('thankYouMessage');

// Цени
const PRICE_PER_UNIT_BGN = 3.60;
const PRICE_PER_UNIT_EUR = 1.85;

// Елементи
const qtyHiddenInput = document.getElementById('quantity');
const totalPriceEl = document.getElementById('totalPrice');
const priceEuroEl = document.getElementById('priceEuro');
const customInput = document.getElementById('customInput');
const customQtyLabel = document.getElementById('customQtyLabel');

// Функция за избиране на готов пакет
function selectPkg(val, element) {
    document.querySelectorAll('.pkg-card').forEach(c => c.classList.remove('active'));
    element.classList.add('active');
    
    customInput.style.display = 'none';
    customQtyLabel.style.display = 'block';
    
    qtyHiddenInput.value = val;
    calculatePrice(val);
}

// Функция за активиране на "По избор"
function enableCustom(element) {
    document.querySelectorAll('.pkg-card').forEach(c => c.classList.remove('active'));
    element.classList.add('active');
    
    customQtyLabel.style.display = 'none';
    customInput.style.display = 'block';
    customInput.focus();
    
    if(!customInput.value || customInput.value < 5) customInput.value = 5;
    updateCustom(customInput.value);
}

// Функция при писане на ръка (По избор)
function updateCustom(val) {
    let num = parseInt(val);

    // Ако полето е празно или не е число, не правим нищо още (за да може да се трие)
    if (isNaN(num)) {
        calculatePrice(0); // Показва 0.00 лв
        return;
    }

    // Ако потребителят напише по-малко от 5, за нуждите на таблицата го правим 5
    // но му оставяме да вижда какво пише (ще го коригираме накрая)
    qtyHiddenInput.value = num;
    calculatePrice(num);
}

// ДОБАВИ ТОВА: Корекция при излизане от полето (Blur)
if (customInput) {
    customInput.addEventListener('blur', function() {
        let num = parseInt(this.value);
        if (isNaN(num) || num < 5) {
            alert("Минималното количество „По избор“ е 5 кутии.");
            this.value = 5;
            if (qtyHiddenInput) qtyHiddenInput.value = 5;
            if (typeof calculatePrice === "function") calculatePrice(5);
        }
    });
}

// Калкулатор
function calculatePrice(qty) {
    let totalBgn = (qty * PRICE_PER_UNIT_BGN).toFixed(2);
    let totalEur = (qty * PRICE_PER_UNIT_EUR).toFixed(2);

    // ПРОВЕРКА: Промени текста само ако елементите съществуват
    if (totalPriceEl) {
        totalPriceEl.innerText = '(' + totalBgn + ' лв.)';
    }
    
    if (priceEuroEl) {
        priceEuroEl.innerText = totalEur + ' €';
    }
}

// Първоначално изчисляване при зареждане
calculatePrice(5);

// ИЗПРАЩАНЕ - само ако формата съществува на страницата
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        
        // Малка проверка за количеството
        let finalQty = (qtyHiddenInput) ? parseInt(qtyHiddenInput.value) : 0;
        
        if (finalQty < 5) {
            alert("Минималното количество е 5 кутии.");
            return;
        }

        // Защита за бутона
        if (btn) {
            btn.disabled = true;
            btn.innerText = 'Обработка...';
        }

        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            form.style.display = 'none';
            if (msg) msg.style.display = 'block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        })
        .catch(error => {
            alert('Грешка при изпращането!');
            if (btn) {
                btn.disabled = false;
                btn.innerText = 'Приключване на поръчката';
            }
        });
    });
}



