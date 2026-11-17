FROM node:24-alpine AS build
WORKDIR /app
# nuxt prepare из postinstall требует исходную конфигурацию проекта.
COPY . .
RUN npm ci
ENV NITRO_PRESET=node-server
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /app/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
