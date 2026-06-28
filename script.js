// 1. ПЛАВНАЯ ПРОКРУТКА К СЕКЦИЯМ ПО КЛИКУ В НАВИГАЦИИ
document.querySelectorAll('.nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// 2. ВАЛИДАЦИЯ ФОРМЫ ПОДПИСКИ
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('subscribeForm');
  const emailInput = document.getElementById('emailInput');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');

  // Проверяем, есть ли форма на странице
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Отключаем перезагрузку страницы

      // Скрываем старые сообщения
      errorMessage.style.display = 'none';
      successMessage.style.display = 'none';

      const email = emailInput.value.trim();

      // Проверка: поле не пустое и содержит @
      if (email === '' || !email.includes('@')) {
        errorMessage.style.display = 'block';
        emailInput.style.borderColor = '#EF4444'; // Красная рамка
        return;
      }

      // === УСПЕШНАЯ ПОДПИСКА ===
      successMessage.style.display = 'block';
      emailInput.style.borderColor = '#22C55E'; // Зелёная рамка
      emailInput.value = ''; // Очищаем поле

      // Скрываем сообщение об успехе через 3 секунды
      setTimeout(function() {
        successMessage.style.display = 'none';
        emailInput.style.borderColor = '#E5E7EB'; // Возвращаем стандартную рамку
      }, 3000);
    });

    // Убираем подсветку ошибки, когда пользователь начинает вводить email
    emailInput.addEventListener('input', function() {
      if (this.value.includes('@')) {
        errorMessage.style.display = 'none';
        this.style.borderColor = '#E5E7EB';
      }
    });
  }
});