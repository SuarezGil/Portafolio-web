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
