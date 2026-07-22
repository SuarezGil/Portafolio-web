# Backend propio para el formulario de contacto — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar EmailJS en el formulario de contacto por un backend propio (Express + Nodemailer) que envía los mensajes por SMTP directamente al correo del dueño del sitio.

**Architecture:** El repo pasa de ser un único paquete a un monorepo pnpm (`apps/frontend` + `apps/backend`). El backend expone `POST /api/contact`, valida el payload y envía el correo por SMTP. El frontend deja de usar `@emailjs/browser` y llama a ese endpoint con `fetch`. Cada servicio es independiente: su propio `.env`/`.env.example`, su propio `Dockerfile` con su propia carpeta como build context. No hay `docker-compose.yml`.

**Tech Stack:** Express 5, Nodemailer 7, express-rate-limit, cors, dotenv (backend, Node 22); React 19 + Vite 8 (frontend, sin cambios de stack); pnpm workspaces.

## Global Constraints

- Campos del formulario: solo `name`, `email`, `message` (no se agrega `company`).
- Sin persistencia en base de datos (no MongoDB).
- Sin tests automatizados — cada tarea se verifica manualmente (curl / navegador), igual que el proyecto de referencia `Portafolio-Programador/apps/backend`.
- Sin `docker-compose.yml` ni ningún archivo que orqueste ambos servicios juntos.
- Cada servicio (`apps/frontend`, `apps/backend`) debe poder construirse con `docker build` usando su propia carpeta como contexto, sin depender de archivos fuera de ella.
- `OWNER_EMAIL` por defecto en el ejemplo: `iossg8@gmail.com`.
- Spec completa: [docs/superpowers/specs/2026-07-22-backend-contact-service-design.md](../specs/2026-07-22-backend-contact-service-design.md)

---

### Task 1: Reestructurar el repo como monorepo pnpm

**Files:**
- Move: `src/` → `apps/frontend/src/`
- Move: `public/` → `apps/frontend/public/`
- Move: `index.html` → `apps/frontend/index.html`
- Move: `package.json` → `apps/frontend/package.json`
- Move: `vite.config.js` → `apps/frontend/vite.config.js`
- Move: `tailwind.config.js` → `apps/frontend/tailwind.config.js`
- Move: `eslint.config.js` → `apps/frontend/eslint.config.js`
- Move: `README.md` → `apps/frontend/README.md`
- Delete: `pnpm-lock.yaml` (se regenera a nivel raíz para todo el workspace)
- Create: `pnpm-workspace.yaml`
- Create: `package.json` (nuevo, raíz del workspace)
- Create: `README.md` (nuevo, raíz — descripción breve del monorepo)

**Interfaces:**
- Produces: comando `pnpm --filter portafolio-frontend dev` funcional desde la raíz; script raíz `pnpm dev` (arrancará también el backend una vez exista en Task 2, por ahora solo corre el frontend porque es el único paquete).

- [ ] **Step 1: Mover los archivos del frontend a `apps/frontend/`**

```bash
mkdir -p apps/frontend
git mv src apps/frontend/src
git mv public apps/frontend/public
git mv index.html apps/frontend/index.html
git mv package.json apps/frontend/package.json
git mv vite.config.js apps/frontend/vite.config.js
git mv tailwind.config.js apps/frontend/tailwind.config.js
git mv eslint.config.js apps/frontend/eslint.config.js
git mv README.md apps/frontend/README.md
git rm pnpm-lock.yaml
```

- [ ] **Step 2: Renombrar el paquete del frontend y agregar el proxy de dev**

Editar `apps/frontend/package.json`, cambiar solo el campo `"name"`:

```json
{
  "name": "portafolio-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emailjs/browser": "^4.4.1",
    "@tailwindcss/vite": "^4.3.0",
    "framer-motion": "^12.40.0",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-icons": "^5.6.0",
    "react-router-dom": "^7.17.0",
    "tailwindcss": "^4.3.0"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.3.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.6.0",
    "vite": "^8.0.12"
  }
}
```

(`@emailjs/browser` se elimina en el Task 3, junto con el resto de la migración a `fetch`. Aquí solo se renombra el paquete para no mezclar dos cambios en un mismo paso.)

Editar `apps/frontend/vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const devApiTarget = process.env.VITE_DEV_API_TARGET || 'http://localhost:4000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: devApiTarget,
        changeOrigin: true,
      },
    },
  },
})
```

- [ ] **Step 3: Crear los archivos de workspace en la raíz**

Crear `pnpm-workspace.yaml`:

```yaml
packages:
  - apps/*
```

Crear `package.json` (raíz):

```json
{
  "name": "portafolio-monorepo",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "dev:frontend": "pnpm --filter portafolio-frontend dev",
    "dev:backend": "pnpm --filter portafolio-backend dev",
    "build": "pnpm --filter portafolio-frontend build"
  }
}
```

Crear `README.md` (raíz):

```markdown
# Portafolio de Iosef Suárez Gil

Monorepo con dos servicios independientes:

- [`apps/frontend`](apps/frontend) — sitio en React + Vite.
- [`apps/backend`](apps/backend) — servicio Express que envía el formulario de contacto por correo.

Cada servicio se despliega por separado (Dockerfile propio, `.env` propio). Ver el `README.md`
de cada carpeta para su configuración específica.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Levanta el frontend en `http://localhost:5173` y el backend en `http://localhost:4000` en paralelo.
```

- [ ] **Step 4: Instalar dependencias y regenerar el lockfile a nivel workspace**

```bash
pnpm install
```

Expected: crea `pnpm-lock.yaml` en la raíz y `node_modules` dentro de `apps/frontend` (todavía no hay `apps/backend`, se agrega en el Task 2 y este comando se vuelve a correr).

- [ ] **Step 5: Verificar que el frontend sigue funcionando igual que antes**

```bash
pnpm --filter portafolio-frontend dev
```

Expected: Vite arranca en `http://localhost:5173` sin errores. Abre esa URL en el navegador y confirma que el sitio carga igual que antes de mover archivos (Hero, About, Projects, Contact). Detén el servidor (Ctrl+C) al terminar de verificar.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Restructure repo into a pnpm workspace (apps/frontend)"
```

---

### Task 2: Crear el servicio backend (`apps/backend`)

**Files:**
- Create: `apps/backend/package.json`
- Create: `apps/backend/src/mailer.js`
- Create: `apps/backend/src/routes/contact.js`
- Create: `apps/backend/src/index.js`
- Create: `apps/backend/.env.example`
- Create: `apps/backend/.env` (local, no se commitea)
- Create: `apps/backend/.gitignore`

**Interfaces:**
- Produces: `POST http://localhost:4000/api/contact` con body `{ name, email, message }`, responde `200 { message }` en éxito o `400/429/500/502 { error }`. `GET http://localhost:4000/api/health` responde `{ status: 'ok' }`.
- Consumes: nada de tareas anteriores (paquete independiente).

- [ ] **Step 1: Crear `package.json` del backend**

```json
{
  "name": "portafolio-backend",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "express-rate-limit": "^8.2.1",
    "nodemailer": "^7.0.9"
  }
}
```

- [ ] **Step 2: Crear el transporter de Nodemailer**

Crear `apps/backend/src/mailer.js`:

```js
import nodemailer from 'nodemailer'

const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS']
const missing = requiredVars.filter((key) => !process.env[key])

if (missing.length > 0) {
  console.warn(
    `[mailer] Faltan variables de entorno: ${missing.join(', ')}. ` +
      'El envío de correos fallará hasta que se configuren (ver .env.example).'
  )
}

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const MAIL_FROM = process.env.MAIL_FROM || process.env.SMTP_USER
```

- [ ] **Step 3: Crear la ruta de contacto**

Crear `apps/backend/src/routes/contact.js`:

```js
import { Router } from 'express'
import { transporter, MAIL_FROM } from '../mailer.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const OWNER_EMAIL = process.env.OWNER_EMAIL

const router = Router()

router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body ?? {}

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Nombre, correo y mensaje son obligatorios.' })
  }

  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: 'Proporciona un correo electrónico válido.' })
  }

  if (!OWNER_EMAIL) {
    console.error('[contact] Falta configurar OWNER_EMAIL en las variables de entorno.')
    return res.status(500).json({ error: 'El formulario no está disponible por el momento.' })
  }

  try {
    await transporter.sendMail({
      from: MAIL_FROM,
      to: OWNER_EMAIL,
      replyTo: email,
      subject: `Nuevo mensaje de contacto de ${name}`,
      text: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`,
      html: `
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Correo:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${String(message).replace(/\n/g, '<br/>')}</p>
      `,
    })

    res.status(200).json({ message: 'Mensaje enviado correctamente.' })
  } catch (error) {
    console.error('[contact] Error al enviar el correo:', error)
    res.status(502).json({ error: 'No se pudo enviar el mensaje. Intenta nuevamente más tarde.' })
  }
})

export default router
```

- [ ] **Step 4: Crear el servidor Express**

Crear `apps/backend/src/index.js`:

```js
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { rateLimit } from 'express-rate-limit'
import contactRouter from './routes/contact.js'

const app = express()
const PORT = process.env.PORT || 4000
const CLIENT_ORIGINS = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
const isProduction = process.env.NODE_ENV === 'production'

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || CLIENT_ORIGINS.includes(origin)) return callback(null, true)
      if (!isProduction && /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        return callback(null, true)
      }
      callback(new Error('Origen no permitido por CORS'))
    },
  })
)
app.use(express.json())

const mailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
})

app.use('/api', mailLimiter)
app.use('/api', contactRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

const server = app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`)
})

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `\nEl puerto ${PORT} ya está en uso por otro proceso.\n` +
        'Cierra la instancia existente o cambia PORT en .env.\n'
    )
    process.exit(1)
  }
  throw error
})
```

- [ ] **Step 5: Crear `.env.example`, `.env` local y `.gitignore` del backend**

Crear `apps/backend/.env.example`:

```
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
OWNER_EMAIL=iossg8@gmail.com
```

Crear `apps/backend/.gitignore`:

```
node_modules
.env
```

Crear `apps/backend/.env` (copia local para probar, con `OWNER_EMAIL` vacío a propósito para verificar el error 500 en el Step 7 — se completa con credenciales reales en el Step 8):

```
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```

- [ ] **Step 6: Instalar dependencias del workspace (incluye ahora el backend)**

```bash
pnpm install
```

Expected: agrega `apps/backend` a `node_modules`/`pnpm-lock.yaml` sin tocar las dependencias ya instaladas del frontend.

- [ ] **Step 7: Verificar validaciones y health check sin credenciales SMTP**

```bash
pnpm --filter portafolio-backend dev
```

Expected: log `Backend escuchando en http://localhost:4000` (puede mostrar el warning de `[mailer] Faltan variables de entorno...`, es esperado porque `.env` todavía no tiene SMTP configurado).

En otra terminal:

```bash
curl http://localhost:4000/api/health
```

Expected: `{"status":"ok"}`

```bash
curl -X POST http://localhost:4000/api/contact -H "Content-Type: application/json" -d "{}"
```

Expected: `400` con `{"error":"Nombre, correo y mensaje son obligatorios."}`

```bash
curl -X POST http://localhost:4000/api/contact -H "Content-Type: application/json" -d "{\"name\":\"Prueba\",\"email\":\"no-es-un-correo\",\"message\":\"hola\"}"
```

Expected: `400` con `{"error":"Proporciona un correo electrónico válido."}`

```bash
curl -X POST http://localhost:4000/api/contact -H "Content-Type: application/json" -d "{\"name\":\"Prueba\",\"email\":\"test@test.com\",\"message\":\"hola\"}"
```

Expected: `500` con `{"error":"El formulario no está disponible por el momento."}` (porque `OWNER_EMAIL` no está configurado en el `.env` local todavía). Detén el servidor (Ctrl+C) al terminar.

- [ ] **Step 8: Nota para el usuario — completar credenciales reales (fuera del alcance de este task automatizado)**

Antes de desplegar, edita `apps/backend/.env` con tus credenciales SMTP reales (por ejemplo Gmail + contraseña de aplicación, ver https://myaccount.google.com/apppasswords) y `OWNER_EMAIL=iossg8@gmail.com`. Vuelve a correr `pnpm --filter portafolio-backend dev` y repite el último `curl` del Step 7 — ahora debería responder `200` y llegarte el correo a la bandeja de entrada. Este paso requiere una cuenta de correo real, así que no forma parte de la verificación automatizada del plan.

- [ ] **Step 9: Commit**

```bash
git add apps/backend package.json pnpm-lock.yaml pnpm-workspace.yaml
git commit -m "Add backend service for the contact form (Express + Nodemailer)"
```

(El `.env` local no se commitea porque `apps/backend/.gitignore` lo excluye.)

---

### Task 3: Conectar el frontend al backend y eliminar EmailJS

**Files:**
- Modify: `apps/frontend/src/components/Contact.jsx`
- Delete: `apps/frontend/src/config/emailjs.js`
- Modify: `apps/frontend/package.json` (quitar `@emailjs/browser`)
- Create: `apps/frontend/.env.example`
- Create: `apps/frontend/.env` (local, no se commitea)
- Modify: `.gitignore` (raíz, para que `apps/frontend/.env` y `apps/backend/.env` queden ignorados desde cualquier punto del repo)

**Interfaces:**
- Consumes: `POST {VITE_API_URL}/contact` del backend creado en Task 2 (`{ name, email, message }` → `200 { message }` o error `{ error }`).

- [ ] **Step 1: Quitar el uso de EmailJS en `Contact.jsx`**

En `apps/frontend/src/components/Contact.jsx`, reemplazar los imports:

```js
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../context/I18nContext'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG } from '../config/emailjs'
```

por:

```js
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useI18n } from '../context/I18nContext'
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi'
```

Y reemplazar `handleSubmit`:

```js
  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          to_name: 'Iosef',
        },
        EMAILJS_CONFIG.PUBLIC_KEY,
      )
      if (result.status === 200) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }
```

por:

```js
  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        setStatus('success')
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }
```

- [ ] **Step 2: Eliminar el archivo de configuración de EmailJS**

```bash
git rm apps/frontend/src/config/emailjs.js
```

- [ ] **Step 3: Quitar la dependencia `@emailjs/browser`**

En `apps/frontend/package.json`, quitar la línea `"@emailjs/browser": "^4.4.1",` del bloque `dependencies`, quedando:

```json
  "dependencies": {
    "@tailwindcss/vite": "^4.3.0",
    "framer-motion": "^12.40.0",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-icons": "^5.6.0",
    "react-router-dom": "^7.17.0",
    "tailwindcss": "^4.3.0"
  },
```

- [ ] **Step 4: Crear las variables de entorno del frontend**

Crear `apps/frontend/.env.example`:

```
# Desarrollo local: usa el proxy de Vite (ver vite.config.js) hacia el backend
VITE_API_URL=/api

# Producción (backend en otro dominio):
# VITE_API_URL=https://tu-backend-en-produccion.com/api
```

Crear `apps/frontend/.env` (para desarrollo local):

```
VITE_API_URL=/api
```

- [ ] **Step 5: Ignorar los `.env` de ambos servicios desde la raíz**

En `.gitignore` (raíz), agregar al final:

```
# Environment variables
.env
```

- [ ] **Step 6: Reinstalar dependencias (quita `@emailjs/browser` de `node_modules`)**

```bash
pnpm install
```

Expected: `pnpm-lock.yaml` ya no lista `@emailjs/browser`.

- [ ] **Step 7: Verificación manual end-to-end**

En una terminal:

```bash
pnpm dev:backend
```

En otra terminal, completa `apps/backend/.env` con tus credenciales SMTP reales (ver Task 2, Step 8) antes de este paso si quieres ver el correo llegar de verdad; si no, puedes dejarlo sin credenciales y solo confirmar que la UI muestra el error correctamente.

```bash
pnpm dev:frontend
```

Abre `http://localhost:5173/contact` en el navegador:
1. Envía el formulario con datos válidos.
2. Con `OWNER_EMAIL`/SMTP configurados correctamente: debe aparecer el mensaje de éxito (`contact.form.success`) y llegarte el correo a la bandeja de entrada.
3. Sin credenciales SMTP configuradas: debe aparecer el mensaje de error (`contact.form.error`) — confirma en la consola del backend que logueó `[contact] Error al enviar el correo`.
4. Revisa la pestaña Network del navegador: la request debe ir a `/api/contact` y, gracias al proxy de Vite, resolverse contra `http://localhost:4000/api/contact` sin errores de CORS.

Detén ambos servidores (Ctrl+C) al terminar.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Replace EmailJS with a call to the self-hosted contact backend"
```

---

### Task 4: Dockerizar cada servicio de forma independiente

**Files:**
- Create: `apps/backend/Dockerfile`
- Create: `apps/backend/.dockerignore`
- Create: `apps/backend/package-lock.json` (generado, solo para el build de Docker — el desarrollo local sigue usando pnpm)
- Create: `apps/frontend/Dockerfile`
- Create: `apps/frontend/nginx.conf`
- Create: `apps/frontend/.dockerignore`
- Create: `apps/frontend/package-lock.json` (generado, mismo motivo)

**Interfaces:**
- Produces: imágenes Docker `portafolio-backend` y `portafolio-frontend`, cada una construible con su propia carpeta como build context (`docker build apps/backend`, `docker build apps/frontend`), sin depender de archivos fuera de esa carpeta.

- [ ] **Step 1: Generar el lockfile de npm del backend (para el build de Docker)**

```bash
cd apps/backend
npm install --package-lock-only
cd ../..
```

Expected: crea `apps/backend/package-lock.json`. No borra ni afecta `node_modules` ni el `pnpm-lock.yaml` de la raíz — es un archivo aparte que solo usa el `Dockerfile`.

- [ ] **Step 2: Crear el Dockerfile y `.dockerignore` del backend**

Crear `apps/backend/Dockerfile`:

```dockerfile
FROM node:22-bookworm-slim AS base
WORKDIR /app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends ca-certificates \
	&& update-ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["npm", "run", "start"]
```

Crear `apps/backend/.dockerignore`:

```
node_modules
npm-debug.log
.env
```

- [ ] **Step 3: Construir la imagen del backend y verificar que arranca**

```bash
docker build -t portafolio-backend apps/backend
```

Expected: build exitoso (`Successfully tagged portafolio-backend`).

```bash
docker run --rm -d --name portafolio-backend-test -p 4001:4000 -e OWNER_EMAIL=iossg8@gmail.com -e CLIENT_ORIGIN=http://localhost:5173 portafolio-backend
```

```bash
curl http://localhost:4001/api/health
```

Expected: `{"status":"ok"}`

```bash
docker stop portafolio-backend-test
```

- [ ] **Step 4: Generar el lockfile de npm del frontend (para el build de Docker)**

```bash
cd apps/frontend
npm install --package-lock-only
cd ../..
```

Expected: crea `apps/frontend/package-lock.json`.

- [ ] **Step 5: Crear el Dockerfile, `nginx.conf` y `.dockerignore` del frontend**

Crear `apps/frontend/nginx.conf`:

```
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

(Sin proxy `/api/` acá: como cada servicio se despliega por separado y sin red compartida, el frontend llama directo a la URL absoluta del backend vía `VITE_API_URL`, y el backend permite ese origen por CORS mediante `CLIENT_ORIGIN`.)

Crear `apps/frontend/Dockerfile`:

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

FROM nginx:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Crear `apps/frontend/.dockerignore`:

```
node_modules
dist
npm-debug.log
.env
```

- [ ] **Step 6: Construir la imagen del frontend y verificar que sirve el sitio**

```bash
docker build -t portafolio-frontend --build-arg VITE_API_URL=https://tu-backend-en-produccion.com/api apps/frontend
```

Expected: build exitoso (`Successfully tagged portafolio-frontend`).

```bash
docker run --rm -d --name portafolio-frontend-test -p 8080:80 portafolio-frontend
```

```bash
curl -s http://localhost:8080 | grep -o "<title>[^<]*</title>"
```

Expected: `<title>Iosef Suárez Gil | Full Stack Developer</title>`

```bash
docker stop portafolio-frontend-test
```

- [ ] **Step 7: Commit**

```bash
git add apps/backend/Dockerfile apps/backend/.dockerignore apps/backend/package-lock.json apps/frontend/Dockerfile apps/frontend/nginx.conf apps/frontend/.dockerignore apps/frontend/package-lock.json
git commit -m "Add independent Dockerfiles for frontend and backend"
```

---

### Task 5: Limpieza final y verificación de repo

**Files:**
- Modify: `.gitignore` (raíz) — confirmar cobertura de `node_modules`, `dist`, `.env` en cualquier profundidad
- Review: `apps/backend/README.md` (nuevo, documentación de configuración del servicio)

**Interfaces:**
- Ninguna nueva — este task es de verificación y documentación, no agrega código funcional.

- [ ] **Step 1: Crear un README breve para el backend**

Crear `apps/backend/README.md`:

```markdown
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
```

- [ ] **Step 2: Confirmar que `.gitignore` cubre lo necesario**

Ejecutar:

```bash
git status --ignored
```

Expected: `apps/frontend/node_modules`, `apps/backend/node_modules`, `apps/frontend/.env`, `apps/backend/.env` y `apps/frontend/dist` aparecen bajo "Ignored files" — no en "Untracked files".

- [ ] **Step 3: Verificación final de que no queda ningún rastro de EmailJS**

```bash
grep -ri "emailjs" -r apps/frontend/src apps/frontend/package.json
```

Expected: sin resultados (exit code 1 / "no matches").

- [ ] **Step 4: Commit**

```bash
git add apps/backend/README.md
git commit -m "Document backend service configuration and deployment"
```

## Self-Review Notes

- **Cobertura de la spec:** monorepo pnpm (Task 1), servicio backend sin Mongo con endpoint `/api/contact` y rate limit (Task 2), frontend sin EmailJS usando `fetch` (Task 3), Dockerfiles independientes sin `docker-compose` (Task 4), `.env` por servicio y limpieza de `.gitignore` (Tasks 3 y 5) — todos los puntos de la spec quedan cubiertos.
- **Placeholders:** ninguno — cada paso trae el código completo a escribir.
- **Consistencia de tipos/nombres:** `transporter`/`MAIL_FROM` exportados desde `mailer.js` y consumidos igual en `contact.js`; `OWNER_EMAIL`/`CLIENT_ORIGIN`/`SMTP_*` se usan con el mismo nombre en `.env.example`, `index.js`, `mailer.js`, `contact.js`, el `Dockerfile` y el `README.md` del backend; `VITE_API_URL` se usa igual en `Contact.jsx`, `.env.example` y el `Dockerfile` del frontend.
