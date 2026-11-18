const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menu && nav) {
  const setMenu = open => {
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('is-open', open);
  };
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  });
}
const more = document.querySelector('#catalog-more');
if (more) {
  const cards = document.querySelector('#extra-categories');
  more.addEventListener('click', () => {
    const open = cards.hidden;
    if (!open && cards.contains(document.activeElement)) more.focus();
    cards.hidden = !open;
    more.setAttribute('aria-expanded', String(open));
    more.textContent = open ? 'Свернуть категории' : 'Показать все категории';
  });
}
const privacy = document.querySelector('#privacy');
document.querySelectorAll('[href="#privacy"]').forEach(link => {
  link.addEventListener('click', event => {
    if (typeof privacy.showModal !== 'function') return;
    event.preventDefault();
    privacy.showModal();
  });
});
const form = document.querySelector('#request-form');
if (form) {
  const interest = form.elements.interest;
  const contextText = document.querySelector('#request-context');
  const notice = document.querySelector('#form-notice');
  const fields = [form.elements.customer, form.elements.phone, interest, form.elements.agree];
  const applySelection = (topic, context = '') => {
    if ([...interest.options].some(option => option.value === topic)) interest.value = topic;
    contextText.textContent = context ? 'Ваш запрос — ' + context : '';
    validate(interest);
    notice.textContent = '';
  };
  const errorMessage = field => {
    switch (field.name) {
      case 'customer':
        return field.value.trim() ? '' : 'Укажите ваше имя.';
      case 'phone': {
        const phone = field.value.trim();
        if (!phone) return 'Укажите контактный телефон.';
        const digits = phone.replace(/\D/g, '');
        return /^\+?[\d\s()\-]+$/.test(phone) && digits.length >= 7 && digits.length <= 15
          ? '' : 'Введите номер из 7–15 цифр. Допустимы +, скобки, пробелы и дефисы.';
      }
      case 'interest':
        return field.value ? '' : 'Выберите тему обращения.';
      case 'agree':
        return field.checked ? '' : 'Подтвердите согласие для проверки формы.';
    }
  };
  function validate(field) {
    const error = errorMessage(field);
    document.getElementById(field.id + '-error').textContent = error;
    if (error) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
    return !error;
  }
  document.querySelectorAll('a[data-topic][href="#request"]').forEach(link => {
    link.addEventListener('click', () => applySelection(link.dataset.topic, link.dataset.context));
  });
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  if (category && category.length <= 100 && params.has('topic')) applySelection(params.get('topic'), category);
  form.addEventListener('input', event => {
    notice.textContent = '';
    if (event.target === interest) contextText.textContent = '';
    if (event.target.matches('[aria-invalid=true]')) validate(event.target);
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const invalid = fields.filter(field => !validate(field));
    if (invalid.length) {
      notice.textContent = '';
      invalid[0].focus();
      return;
    }
    notice.textContent = 'Форма работает в демонстрационном режиме. Отправка заявок будет доступна после подключения сервера.';
  });
}
