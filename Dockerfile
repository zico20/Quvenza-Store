# ============================================================================
# Multi-stage build for the softodeviq Next.js 16 app (standalone output).
# Stages: deps (install) → builder (prisma generate + next build) → runner (slim).
# ============================================================================

# ---- deps: install node_modules from lockfile ----
FROM node:20-alpine AS deps
# Prisma needs OpenSSL on Alpine
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: generate Prisma client + build Next ----
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Prisma client is generated at build time; DB is not contacted during build.
RUN npx prisma generate
# Build the Next app (standalone output). Disable telemetry for clean CI logs.
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx next build

# ---- runner: minimal production image ----
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Run as a non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Public assets + the standalone server + static chunks
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma schema + generated client + engine (needed at runtime for migrate/queries)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

USER nextjs
EXPOSE 3000

# next build (standalone) emits server.js at the app root
CMD ["node", "server.js"]
