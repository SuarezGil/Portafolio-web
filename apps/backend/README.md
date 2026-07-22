# Backend de contacto

Servicio Express que recibe el formulario de contacto del frontend y lo envía por correo.

- `POST /api/contact` — recibe `{ name, email, message }` y reenvía el mensaje a `OWNER_EMAIL`.
- `GET /api/health` — chequeo de salud.

## Configuración

1. Copia `.env.example` a `.env` y completa las variables SMTP:

   ```bash
   cp .env.example .env
   ```

2. Con Gmail: activa verificación en dos pasos y genera una "contraseña de aplicación" en
   https://myaccount.google.com/apppasswords. Usa esa contraseña de 16 caracteres como `SMTP_PASS`.

3. Instala dependencias y arranca:

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
