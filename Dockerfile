# Install dependencies only when needed
FROM node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

FROM node:18-alpine AS openapi-generate

RUN apk add openjdk11-jre-headless

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm i -g @openapitools/openapi-generator-cli

RUN npm run openapi-gen

# Rebuild the source code only when needed
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=openapi-generate /app ./

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

ARG API_PATH
ARG NEXT_PUBLIC_API_PATH
ENV API_PATH $API_PATH
ENV NEXT_PUBLIC_API_PATH $NEXT_PUBLIC_API_PATH

RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm i sharp
ENV NEXT_SHARP_PATH /app/node_modules/sharp

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app ./

RUN chown -R nextjs:nodejs /app

USER nextjs

CMD ["npm", "start", "--", "--keepAliveTimeout", "60000"]
