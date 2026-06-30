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

// ===== 4. МОДАЛЬНОЕ ОКНО =====
document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('modalOverlay');
  const openBtn = document.querySelector('.nav-btn');
  const closeBtn = document.getElementById('modalClose');
  const form = document.getElementById('modalForm');

  // Поля
  const nameInput = document.getElementById('modalName');
  const phoneInput = document.getElementById('modalPhone');
  const commentInput = document.getElementById('modalComment');
  const agreeCheck = document.getElementById('modalAgree');

  // Ошибки
  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const commentError = document.getElementById('commentError');

  // Уведомление внутри модалки
  const notification = document.createElement('div');
  notification.className = 'modal-notification';
  document.querySelector('.modal').appendChild(notification);

  // Таймер для скрытия уведомления
  let notificationTimer = null;

  // Открытие
  if (openBtn && overlay) {
    openBtn.addEventListener('click', function (e) {
      e.preventDefault();
      overlay.classList.add('active');
      document.body.classList.add('modal-open');
      form.reset();
      nameInput.classList.remove('error', 'success');
      phoneInput.classList.remove('error', 'success');
      commentInput.classList.remove('error', 'success');
      document.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
      hideNotification();
      // Разблокируем форму
      const formElements = form.querySelectorAll('input, textarea, button');
      formElements.forEach(el => el.disabled = false);
    });
  }

  // Закрытие
  function closeModal() {
    overlay.classList.remove('active');
    document.body.classList.remove('modal-open');
    hideNotification();
    const formElements = form.querySelectorAll('input, textarea, button');
    formElements.forEach(el => el.disabled = false);
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  // Закрытие по Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Маска для телефона
  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      let value = this.value.replace(/\D/g, '');
      let formatted = '';

      if (value.length === 0) {
        this.value = '';
        return;
      }

      if (value.startsWith('8') || value.startsWith('9')) {
        if (value.startsWith('8')) value = '7' + value.slice(1);
        else if (value.startsWith('9') && value.length === 11) value = '7' + value.slice(1);
      }

      if (!value.startsWith('7') && value.length > 0) {
        value = '7' + value;
      }

      const match = value.match(/^(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
      if (match) {
        let parts = [];
        if (match[1]) parts.push('+' + match[1]);
        if (match[2]) parts.push('(' + match[2]);
        if (match[3]) parts.push(') ' + match[3]);
        if (match[4]) parts.push(' ' + match[4]);
        if (match[5]) parts.push('-' + match[5]);
        formatted = parts.join('');
        formatted = formatted.replace(/\( /g, '(').replace(/ \) /g, ') ');
      }

      this.value = formatted.trim();
    });

    phoneInput.addEventListener('focus', function () {
      if (this.value === '') this.value = '+7 ';
    });
    phoneInput.addEventListener('blur', function () {
      if (this.value === '+7 ' || this.value === '+7' || this.value === '') {
        this.value = '';
        this.classList.remove('error', 'success');
      }
    });
  }

  // Валидация ФИО
  function validateName(name) {
    const trimmed = name.trim();
    const words = trimmed.split(/\s+/);
    if (words.length < 2) return false;
    for (let word of words) {
      if (!/^[A-ZА-Я][a-zа-я]*$/.test(word)) return false;
    }
    return true;
  }

  // Валидация телефона
  function validatePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 11 && digits.startsWith('7');
  }

  // Валидация комментария
  function validateComment(comment) {
    return comment.trim().length >= 10;
  }

  // Проверка всех полей (без чекбокса)
  function validateAllFields() {
    const isNameValid = validateName(nameInput.value);
    const isPhoneValid = validatePhone(phoneInput.value);
    const isCommentValid = validateComment(commentInput.value);

    return {
      isNameValid,
      isPhoneValid,
      isCommentValid,
      allValid: isNameValid && isPhoneValid && isCommentValid
    };
  }

  // Динамическая валидация
  nameInput.addEventListener('input', function () {
    if (this.value.trim().length > 0) {
      if (validateName(this.value)) {
        this.classList.remove('error');
        this.classList.add('success');
        nameError.classList.remove('visible');
      } else {
        this.classList.remove('success');
        this.classList.add('error');
        nameError.classList.add('visible');
      }
    } else {
      this.classList.remove('error', 'success');
      nameError.classList.remove('visible');
    }
  });

  phoneInput.addEventListener('input', function () {
    const digits = this.value.replace(/\D/g, '');
    if (digits.length > 0) {
      if (validatePhone(this.value)) {
        this.classList.remove('error');
        this.classList.add('success');
        phoneError.classList.remove('visible');
      } else {
        this.classList.remove('success');
        this.classList.add('error');
        phoneError.classList.add('visible');
      }
    } else {
      this.classList.remove('error', 'success');
      phoneError.classList.remove('visible');
    }
  });

  commentInput.addEventListener('input', function () {
    if (this.value.trim().length > 0) {
      if (validateComment(this.value)) {
        this.classList.remove('error');
        this.classList.add('success');
        commentError.classList.remove('visible');
      } else {
        this.classList.remove('success');
        this.classList.add('error');
        commentError.classList.add('visible');
      }
    } else {
      this.classList.remove('error', 'success');
      commentError.classList.remove('visible');
    }
  });

  // Показать уведомление внутри модалки
  function showNotification(message, type) {
    if (notificationTimer) {
      clearTimeout(notificationTimer);
      notificationTimer = null;
    }

    notification.textContent = message;
    notification.className = 'modal-notification show ' + type;
  }

  // Скрыть уведомление
  function hideNotification() {
    notification.classList.remove('show', 'success', 'error');
    notification.textContent = '';
    if (notificationTimer) {
      clearTimeout(notificationTimer);
      notificationTimer = null;
    }
  }

  // Отправка формы
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (notificationTimer) {
      clearTimeout(notificationTimer);
      notificationTimer = null;
    }

    // 1. Сначала проверяем все поля
    const validation = validateAllFields();

    if (!validation.isNameValid) {
      nameInput.classList.add('error');
      nameError.classList.add('visible');
    } else {
      nameInput.classList.remove('error');
      nameInput.classList.add('success');
      nameError.classList.remove('visible');
    }

    if (!validation.isPhoneValid) {
      phoneInput.classList.add('error');
      phoneError.classList.add('visible');
    } else {
      phoneInput.classList.remove('error');
      phoneInput.classList.add('success');
      phoneError.classList.remove('visible');
    }

    if (!validation.isCommentValid) {
      commentInput.classList.add('error');
      commentError.classList.add('visible');
    } else {
      commentInput.classList.remove('error');
      commentInput.classList.add('success');
      commentError.classList.remove('visible');
    }

    // 2. Если поля невалидны — показываем ошибку
    if (!validation.allValid) {
      showNotification('Please fill in all fields correctly.', 'error');
      notificationTimer = setTimeout(function () {
        hideNotification();
        notificationTimer = null;
      }, 3000);
      return;
    }

    // 3. Если поля валидны — проверяем чекбокс
    if (!agreeCheck.checked) {
      showNotification('Please agree to the Privacy Policy.', 'error');
      notificationTimer = setTimeout(function () {
        hideNotification();
        notificationTimer = null;
      }, 3000);
      return;
    }

    // ===== УСПЕХ =====
    const formElements = form.querySelectorAll('input, textarea, button');
    formElements.forEach(el => el.disabled = true);

    showNotification('Thank you! Your request has been sent successfully!', 'success');

    notificationTimer = setTimeout(function () {
      closeModal();
      form.reset();
      document.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
      document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
        el.classList.remove('error', 'success');
      });
      hideNotification();
      formElements.forEach(el => el.disabled = false);
      notificationTimer = null;
    }, 3000);
  });
});