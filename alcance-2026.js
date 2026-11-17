(function () {
  'use strict';
  const menu = document.querySelector('[data-menu]');
  const toggle = document.querySelector('[data-menu-toggle]');
  // Preserve the published menu behavior, returning keyboard focus on Escape.
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu && toggle &&
        toggle.getAttribute('aria-expanded') === 'true' && menu.contains(document.activeElement)) {
      toggle.focus();
    }
  }, true);
  document.querySelectorAll('[data-print]').forEach(function (button) {
    button.hidden = false;
    button.addEventListener('click', function () { window.print(); });
  });
  const fields = document.querySelector('[data-contact-builder]');
  if (!fields) return;
  const subject = document.getElementById('assunto');
  const city = document.getElementById('cidade');
  const mode = document.getElementById('forma');
  const preview = document.getElementById('mensagem');
  const link = document.getElementById('abrir-whatsapp');
  const params = new URLSearchParams(window.location.search);
  const allowedTopics = Array.from(subject.options).map(function (option) { return option.value; });
  if (allowedTopics.indexOf(params.get('assunto')) !== -1) subject.value = params.get('assunto');
  // Read only known route codes. Never echo arbitrary URL values into the message.
  const origins = {inventario:'roteiro de inventário',familia:'roteiro de pensão alimentícia',
    'area-familia':'página de Direito de Família','area-inventario':'página de Inventário e Sucessões',
    'area-consumidor':'página de Consumidor e Bancário','area-imobiliario':'página de Imobiliário e Agrário',
    'area-criminal':'página de Direito Criminal','area-civel':'página de Direito Cível',
    'area-empresarial':'página de Direito Empresarial','area-tributario':'página de Direito Tributário',
    'area-publico':'página de Fazendas Públicas','area-ambiental':'página de Direito Ambiental'};
  const origin = origins[params.get('origem')] || 'página de atendimento';
  function updateMessage() {
    const message = 'Olá, Dr. José Carlos. Gostaria de informações sobre atendimento jurídico.\n' +
      'Assunto: ' + subject.options[subject.selectedIndex].text + '.\n' +
      'Cidade: ' + city.value + '.\nPreferência: ' + mode.value + '.\n' +
      'Origem: site — ' + origin + '.\nGostaria de consultar a disponibilidade do escritório.';
    preview.textContent = message;
    link.href = 'https://wa.me/5562982091217?text=' + encodeURIComponent(message);
  }
  fields.hidden = false;
  fields.addEventListener('change', updateMessage);
  updateMessage();
})();
