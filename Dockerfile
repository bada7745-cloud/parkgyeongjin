FROM node:24-bookworm-slim
WORKDIR /app
COPY --chown=node:node package.json ./
COPY --chown=node:node server ./server
COPY --chown=node:node dist ./dist
COPY --chown=node:node tests ./tests
COPY --chown=node:node release.cjs ./release.cjs
RUN node release.cjs && node --test tests/engine.test.cjs tests/server.test.cjs tests/update.test.cjs
RUN mkdir -p /data && chown node:node /data
USER node
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8787 DB_PATH=/data/game.sqlite
EXPOSE 8787
VOLUME ["/data"]
CMD ["node","server/server.cjs"]
