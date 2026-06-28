// 1. БУРГЕР-МЕНЮ
document.addEventListener('DOMContentLoaded', function () {
  const burger = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Закрываем меню при клике на ссылку
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function () {
        burger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
});

// 2. ПЛАВНАЯ ПРОКРУТКА
document.querySelectorAll('.nav a[href^="#"], .mobile-link[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// 3. ВАЛИДАЦИЯ ПОДПИСКИ
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('subscribeForm');
  const emailInput = document.getElementById('emailInput');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errorMessage.style.display = 'none';
      successMessage.style.display = 'none';

      const email = emailInput.value.trim();
      if (email === '' || !email.includes('@')) {
        errorMessage.style.display = 'block';
        emailInput.style.borderColor = '#EF4444';
        return;
      }

      successMessage.style.display = 'block';
      emailInput.style.borderColor = '#22C55E';
      emailInput.value = '';

      setTimeout(() => {
        successMessage.style.display = 'none';
        emailInput.style.borderColor = '#E5E7EB';
      }, 3000);
    });

    emailInput.addEventListener('input', function () {
      if (this.value.includes('@')) {
        errorMessage.style.display = 'none';
        this.style.borderColor = '#E5E7EB';
      }
    });
  }
});