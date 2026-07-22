FROM node:22-bookworm-slim AS base
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-workspace --frozen-lockfile --prod

COPY src ./src

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["node", "src/index.js"]
