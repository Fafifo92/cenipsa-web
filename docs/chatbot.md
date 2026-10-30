# Chatbot de CENIPSA: web y WhatsApp

La firma pidió un chatbot con el flujo «Bienvenida → menú de 6 opciones → preguntas por
categoría → botones sugeridos → asesor humano». Quedó resuelto en tres capas:

## 1. Asistente virtual en la página de preguntas frecuentes (ya implementado)

`/faq/` y `/en/faq/` abren con un **asistente guiado** (`src/components/FaqAssistant.astro`) que
sigue exactamente el flujo enviado: bienvenida, menú (1–5 categorías + 6. Ubicación y cita),
respuestas con botones sugeridos y «Hablar con un asesor humano», que abre el chat de tawk.to
(o WhatsApp si el chat aún no cargó). Funciona igual en el celular y no depende de servicios
externos.

La base de conocimiento es `src/content/faq/faq.json` (ES) y `src/data/faq.en.json` (EN):
cada pregunta tiene `category`, `answer` y `links` (los «botones sugeridos»; `href: "whatsapp"`
abre WhatsApp). Al editar ese archivo se actualizan a la vez el asistente, el acordeón de la
página y el schema FAQPage para Google.

## 2. Chat en vivo de tawk.to en todo el sitio (ya implementado)

El widget nativo de Tawk aparece en todas las páginas (abajo a la derecha; WhatsApp queda abajo
a la izquierda). Se activa/desactiva con `CHAT_ENABLED` en `src/lib/site.ts`.

Para que el **mismo bot** responda dentro del chat de Tawk, se configura en el panel de Tawk
(lo hace la firma con su usuario; las credenciales no se guardan en el código):

1. **Administración → Canales → Widget de chat → Contenido**: mensaje de bienvenida =
   «¡Hola! Bienvenido a CENIPSA S.A.S. / Inteligencia Investigativa…» (texto del documento).
2. **Administración → Respuestas rápidas (Shortcuts)**: crear una por pregunta (P1–P14) con la
   respuesta del documento, para que el asesor responda con un clic.
3. **Chatbot / AI Assist (si el plan lo incluye)**: crear el flujo con los 6 botones del menú
   y, como fuente de conocimiento, la URL `https://www.inteligenciainvestigativa.com/faq/`.
4. **Idioma del widget**: Español, y horario de atención para el mensaje «fuera de línea».

## 3. WhatsApp (celular)

Para el número 317 423 2502 con **WhatsApp Business** (app gratuita):

- **Mensaje de bienvenida**: el texto de bienvenida y el menú numerado (1–6).
- **Respuestas rápidas**: una por categoría (`/legal`, `/personal`, `/empresas`, `/abogados`,
  `/precios`, `/cita`) con las respuestas del documento.
- **Mensaje de ausencia** fuera del horario.

Un bot de WhatsApp totalmente automático (que responda solo según el número que escriba el
cliente) requiere la **API de WhatsApp Business** a través de un proveedor (p. ej. el propio
tawk.to, Twilio o 360dialog), con costo por conversación. Se puede integrar más adelante si la
firma lo decide.

## Seguridad

Las credenciales del panel de Tawk llegaron por correo en un documento: se recomienda **cambiar
esa contraseña** y activar la verificación en dos pasos en la cuenta de Tawk.
