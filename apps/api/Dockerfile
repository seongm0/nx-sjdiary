FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system api && \
          adduser --system -G api api

COPY dist/apps/api .
RUN chown -R api:api .

RUN npm ci --omit=dev -f

CMD [ "node", "main.js" ]
