# Backend propio para el formulario de contacto

Fecha: 2026-07-22

## Contexto

El formulario de contacto en [Contact.jsx](../../../src/components/Contact.jsx) usa EmailJS
(`@emailjs/browser`) para enviar los mensajes. La cuenta de EmailJS conectada por Gmail OAuth
empezó a fallar con `412 Precondition Failed` (token OAuth de Gmail invalidado del lado de
EmailJS). En vez de depender de un tercero, se reemplaza por un backend propio que envía los
correos por SMTP directamente, siguiendo el mismo patrón ya usado y probado en el proyecto
hermano `Portafolio-Programador/apps/backend`.

## Objetivo

Que los mensajes del formulario de contacto lleguen por correo al dueño del sitio
(`iossg8@gmail.com`), sin depender de EmailJS ni de ningún proveedor externo de "formularios a
email".

## Alcance

- Solo el envío de correo al recibir un mensaje de contacto. **No** se agrega persistencia en
  base de datos (a diferencia del proyecto de referencia, que sí loguea en MongoDB) — se decidió
  mantenerlo simple.
- Los campos del formulario no cambian: `name`, `email`, `message` (el proyecto de referencia
  tiene además `company`, pero el formulario actual de este proyecto no lo tiene y no se agrega).
- El proyecto pasa de ser un solo paquete en la raíz a un monorepo con dos servicios
  independientes (`apps/frontend`, `apps/backend`), porque se van a desplegar por separado.
- **Cada servicio es autónomo**: su propio `.env`/`.env.example`, su propio `Dockerfile` con su
  propia carpeta como build context. No hay `docker-compose.yml` ni ningún archivo que los
  orqueste juntos — eso quedó descartado explícitamente porque el despliegue es servicio por
  servicio.

## Arquitectura

```
Portafolio-web/
├── apps/
│   ├── frontend/          # app actual (React + Vite), movida tal cual desde la raíz
│   │   ├── src/
│   │   ├── public/
│   │   ├── index.html
│   │   ├── vite.config.js
│   │   ├── tailwind.config.js
│   │   ├── eslint.config.js
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   ├── nginx.conf
│   │   ├── .env.example
│   │   └── .env            (gitignored)
│   └── backend/            # nuevo servicio Express
│       ├── src/
│       │   ├── index.js
│       │   ├── mailer.js
│       │   └── routes/
│       │       └── contact.js
│       ├── package.json
│       ├── Dockerfile
│       ├── .dockerignore
│       ├── .env.example
│       └── .env            (gitignored)
├── pnpm-workspace.yaml      # packages: [apps/*] — solo para comodidad en dev local
├── package.json             # scripts raíz: dev, dev:frontend, dev:backend, build
└── docs/superpowers/specs/  # este documento
```

No existe `docker-compose.yml`: cada servicio se construye y despliega de forma aislada
(`docker build apps/backend` / `docker build apps/frontend`, cada uno con su carpeta como
contexto).

## Componentes

### `apps/backend`

- **`src/index.js`**: app Express. CORS restringido a `CLIENT_ORIGIN` (con excepción para
  `localhost` en desarrollo). Rate limiter (5 solicitudes / 15 min por IP) aplicado a `/api`.
  Monta la ruta de contacto y expone `GET /api/health`.
- **`src/mailer.js`**: transporter de Nodemailer configurado desde variables de entorno
  (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`). Loguea un warning si
  faltan variables requeridas, en vez de fallar al arrancar.
- **`src/routes/contact.js`**: `POST /api/contact`. Valida que `name`, `email` y `message` estén
  presentes y que `email` tenga formato válido. Envía el correo a `OWNER_EMAIL` con
  `replyTo` = correo del remitente, para poder responder directo desde el cliente de correo.
- **`.env.example`**:
  ```
  PORT=4000
  CLIENT_ORIGIN=https://tu-frontend-en-produccion.com
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=587
  SMTP_SECURE=false
  SMTP_USER=
  SMTP_PASS=
  MAIL_FROM=
  OWNER_EMAIL=iossg8@gmail.com
  ```
- **`Dockerfile`**: build context = `apps/backend/` (no la raíz del repo). Instala dependencias
  de producción, copia `src/`, expone el puerto y arranca con `npm run start`.

### `apps/frontend`

- Contenido movido tal cual desde la raíz actual del repo.
- Se elimina la dependencia `@emailjs/browser` y el archivo `src/config/emailjs.js`.
- [Contact.jsx](../../../src/components/Contact.jsx) cambia su `handleSubmit` para hacer
  `fetch(`${import.meta.env.VITE_API_URL}/contact`, { method: 'POST', ... })` en vez de llamar a
  `emailjs.send`. Los estados existentes (`idle` / `sending` / `success` / `error`) y los textos
  de traducción (`contact.form.success` / `contact.form.error`) se mantienen sin cambios.
- `vite.config.js` agrega proxy de desarrollo: `/api` → `http://localhost:4000` (o
  `VITE_DEV_API_TARGET` si se define), para evitar problemas de CORS en local.
- **`.env.example`**:
  ```
  VITE_API_URL=https://tu-backend-en-produccion.com/api
  ```
- **`Dockerfile` + `nginx.conf`**: build de producción servido por Nginx, con `location /api/`
  proxeado a la URL del backend (mismo patrón que el proyecto de referencia), solo para el caso
  de despliegue en un mismo host; si el backend vive en otro dominio, el frontend usa
  `VITE_API_URL` absoluto y Nginx no necesita proxear nada.

### Raíz del repo

- `pnpm-workspace.yaml` con `packages: [apps/*]`.
- `package.json` con scripts de conveniencia para desarrollo local (`dev`, `dev:frontend`,
  `dev:backend`, `build`); no participa en el despliegue de cada servicio.
- `.gitignore` actualizado para ignorar `.env` (actualmente no lo ignora).

## Flujo de datos

1. El usuario llena el formulario en `/contact` y da submit.
2. El frontend hace `POST {VITE_API_URL}/contact` con `{ name, email, message }`.
3. El backend valida los campos.
4. Si son válidos, Nodemailer envía el correo a `OWNER_EMAIL` con `replyTo` del remitente.
5. El backend responde `200` en éxito o un error (`400`/`429`/`500`/`502`) según el caso.
6. El frontend actualiza `status` a `success` o `error` y muestra el mensaje ya existente en la
   UI.

## Manejo de errores

| Caso | Código | Respuesta |
|---|---|---|
| Falta `name`, `email` o `message` | 400 | mensaje de validación |
| `email` con formato inválido | 400 | mensaje de validación |
| Falta `OWNER_EMAIL` en el servidor (error de despliegue) | 500 | mensaje genérico, se loguea en el servidor |
| Falla el envío SMTP | 502 | mensaje genérico, se loguea en el servidor |
| Más de 5 solicitudes / 15 min desde la misma IP | 429 | mensaje de rate limit |

## Fuera de alcance

- Persistencia en base de datos de los mensajes recibidos.
- Reenvío de CV por correo (el CV ya se descarga directo desde [About.jsx](../../../src/components/About.jsx), no se agrega esa funcionalidad).
- `docker-compose.yml` u orquestación conjunta de los dos servicios.
- Tests automatizados (el proyecto de referencia tampoco los tiene; se valida manualmente).
