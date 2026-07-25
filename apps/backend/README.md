# Backend de contacto

Servicio Express que recibe el formulario de contacto del frontend y lo envía por correo.

- `POST /api/contact` — recibe `{ name, email, message }` y reenvía el mensaje a `OWNER_EMAIL`.
- `GET /api/health` — chequeo de salud.

## Configuración

El envío de correo usa la [API HTTP de Brevo](https://developers.brevo.com/reference/sendtransacemail)
(no SMTP), para evitar bloqueos de puertos SMTP salientes en hostings como Railway o Vercel.

1. Copia `.env.example` a `.env`:

   ```bash
   cp .env.example .env
   ```

2. Crea una cuenta en https://app.brevo.com, verifica un remitente en
   **Settings → Senders, Domains & Dedicated IPs** y genera una API key en
   **Settings → SMTP & API → API Keys**.

3. Completa en `.env`:
   - `BREVO_API_KEY`: la API key generada.
   - `MAIL_FROM`: el correo verificado como remitente en Brevo.
   - `OWNER_EMAIL`: a dónde llegan los mensajes del formulario.

4. Instala dependencias y arranca:

   ```bash
   pnpm install
   pnpm --filter portafolio-backend dev
   ```

   Queda escuchando en `http://localhost:4000` (o el `PORT` que definas).

## Despliegue

Este servicio se construye y despliega de forma independiente:

```bash
docker build -t portafolio-backend apps/backend
docker run -d --env-file apps/backend/.env -p 4000:4000 portafolio-backend
```

Asegúrate de que `CLIENT_ORIGIN` en el `.env` de producción apunte al dominio real donde vive
el frontend, para que CORS lo permita.
