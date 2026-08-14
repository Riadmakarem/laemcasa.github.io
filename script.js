(() => {
  'use strict';

  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');
  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = lightbox?.querySelector('img');
  const lightboxCaption = lightbox?.querySelector('p');
  const plannerForm = document.querySelector('#planner-form');
  const orderDialog = document.querySelector('#order-dialog');
  const orderSummary = document.querySelector('#order-summary');
  const copyButton = document.querySelector('#copy-order');
  const toast = document.querySelector('#toast');

  // Header compacto após o primeiro trecho da página.
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Navegação móvel acessível.
  const setMenu = (open) => {
    menuButton?.setAttribute('aria-expanded', String(open));
    menuButton?.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    navigation?.classList.toggle('open', open);
    body.classList.toggle('menu-open', open);
  };

  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  navigation?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && body.classList.contains('menu-open')) setMenu(false);
  });

  // Entradas suaves ativadas apenas quando os elementos chegam ao viewport.
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('visible'));
  }

  const syncDialogState = () => {
    const dialogOpen = Boolean(lightbox?.open || orderDialog?.open);
    body.classList.toggle('dialog-open', dialogOpen);
  };

  // Galeria ampliada com <dialog>, teclado e legenda.
  document.querySelectorAll('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      if (!lightbox || !lightboxImage || !lightboxCaption) return;
      lightboxImage.src = item.dataset.src || '';
      lightboxImage.alt = item.dataset.alt || '';
      lightboxCaption.textContent = item.dataset.alt || '';
      lightbox.showModal();
      syncDialogState();
    });
  });

  lightbox?.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox.close());
  lightbox?.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox?.addEventListener('close', syncDialogState);

  // Links de serviço já deixam a opção correspondente marcada no planejador.
  document.querySelectorAll('[data-interest]').forEach((link) => {
    link.addEventListener('click', () => {
      const interest = link.dataset.interest;
      plannerForm?.querySelectorAll('input[name="interesse"]').forEach((input) => {
        if (input.value === interest) input.checked = true;
      });
    });
  });

  const formatDate = (value) => {
    if (!value) return 'a combinar';
    const [year, month, day] = value.split('-');
    return `${day}/${month}/${year}`;
  };

  const buildOrderMessage = (form) => {
    const data = new FormData(form);
    const interests = data.getAll('interesse');
    return [
      'Olá! Gostaria de conversar sobre uma experiência da Lá em Casa.',
      '',
      `Meu nome: ${data.get('nome')}`,
      `Ocasião: ${data.get('ocasiao')}`,
      `Data: ${formatDate(data.get('data'))}`,
      `Convidados: ${data.get('convidados') || 'a definir'}`,
      `Tenho interesse em: ${interests.length ? interests.join(', ') : 'gostaria de receber uma sugestão'}`,
      '',
      `Detalhes: ${data.get('detalhes') || 'podemos conversar sobre as possibilidades.'}`,
      '',
      'Aguardo o contato. Obrigado(a)!'
    ].join('\n');
  };

  plannerForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!plannerForm.reportValidity() || !orderDialog || !orderSummary) return;
    orderSummary.value = buildOrderMessage(plannerForm);
    orderDialog.showModal();
    syncDialogState();
  });

  orderDialog?.querySelector('.dialog-close')?.addEventListener('click', () => orderDialog.close());
  orderDialog?.addEventListener('click', (event) => {
    if (event.target === orderDialog) orderDialog.close();
  });
  orderDialog?.addEventListener('close', syncDialogState);

  let toastTimer;
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  };

  copyButton?.addEventListener('click', async () => {
    const message = orderSummary?.value || '';
    try {
      await navigator.clipboard.writeText(message);
      showToast('Mensagem copiada!');
      copyButton.textContent = 'Mensagem copiada';
    } catch {
      orderSummary?.focus();
      orderSummary?.select();
      const copied = document.execCommand('copy');
      showToast(copied ? 'Mensagem copiada!' : 'Selecione e copie a mensagem.');
    }
  });

  document.querySelector('#year').textContent = String(new Date().getFullYear());
})();
