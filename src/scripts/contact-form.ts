/**
 * Envío del formulario de contacto (progressive enhancement):
 * - Honeypot antispam.
 * - reCAPTCHA v3 invisible cuando hay clave de sitio (data-recaptcha).
 * - POST fetch al endpoint (Formspree u otro) con redirección a la página de gracias.
 * - Sin endpoint: fallback a mailto: con el mensaje prellenado.
 */

interface GrecaptchaV3 {
  ready(cb: () => void): void;
  execute(siteKey: string, opts: { action: string }): Promise<string>;
}
const grecaptchaApi = () => (window as unknown as { grecaptcha?: GrecaptchaV3 }).grecaptcha;

let recaptchaLoading: Promise<void> | null = null;

function loadRecaptcha(siteKey: string): Promise<void> {
  if (grecaptchaApi()) return Promise.resolve();
  if (recaptchaLoading) return recaptchaLoading;
  recaptchaLoading = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('recaptcha load failed'));
    document.head.appendChild(s);
  });
  return recaptchaLoading;
}

async function recaptchaToken(siteKey: string): Promise<string | null> {
  try {
    await loadRecaptcha(siteKey);
    const grecaptcha = grecaptchaApi();
    if (!grecaptcha) return null;
    await new Promise<void>((r) => grecaptcha.ready(() => r()));
    return await grecaptcha.execute(siteKey, { action: 'contact' });
  } catch {
    return null; // no bloquea el envío si reCAPTCHA falla
  }
}

function initContactForm() {
  const form = document.getElementById('contact-form') as HTMLFormElement | null;
  if (!form || form.dataset.bound === 'true') return;
  form.dataset.bound = 'true';

  const siteKey = form.dataset.recaptcha ?? '';
  // Precarga reCAPTCHA al primer foco para que el token esté listo al enviar.
  if (siteKey) {
    form.addEventListener('focusin', () => loadRecaptcha(siteKey), { once: true });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const honeypot = form.querySelector<HTMLInputElement>('input[name="_gotcha"]');
    if (honeypot?.value) return; // bot detectado

    const data = new FormData(form);

    if (form.dataset.endpoint !== 'true') {
      // Sin endpoint: abre el cliente de correo con el mensaje prellenado.
      const subject = `Consulta web — ${data.get('name') ?? ''}`;
      const body = [
        `Nombre: ${data.get('name') ?? ''}`,
        `Email: ${data.get('email') ?? ''}`,
        `Teléfono: ${data.get('phone') ?? ''}`,
        `Servicio: ${data.get('service') ?? ''}`,
        '',
        String(data.get('message') ?? ''),
      ].join('\n');
      window.location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const setBusy = (busy: boolean) => {
      if (!button) return;
      button.disabled = busy;
      button.textContent = busy ? (button.dataset.sending ?? '…') : (button.dataset.label ?? 'Enviar');
    };
    setBusy(true);

    if (siteKey) {
      const token = await recaptchaToken(siteKey);
      if (token) data.set('g-recaptcha-response', token);
    }

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        window.location.assign(form.dataset.thanks ?? '/gracias/');
        return;
      }
      throw new Error(`HTTP ${res.status}`);
    } catch {
      setBusy(false);
      form.querySelector('.form-error')?.remove();
      const p = document.createElement('p');
      p.className = 'form-error mt-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700';
      p.setAttribute('role', 'alert');
      p.textContent = form.dataset.error ?? 'No pudimos enviar el mensaje.';
      form.appendChild(p);
    }
  });
}

initContactForm();
document.addEventListener('astro:page-load', initContactForm);
