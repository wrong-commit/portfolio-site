FROM ubuntu:latest as builder

RUN apt-get update && apt-get install -y \
    build-essential \
    git

WORKDIR /tmp

# Clone Git Repositories
RUN git clone https://github.com/wrong-commit/AusPohzt && \
    git clone https://github.com/wrong-commit/node-proxy-monitor && \
    git clone https://github.com/wrong-commit/cryptor-and-loader
FROM node:lts-alpine
# Define Node environment variables
ENV NODE_ENV=production
ENV NODE_PORT=3000
WORKDIR /usr/src/app
# copy git repos from BUILDER image after cloning to /tmp/
COPY --from=builder /tmp/AusPohzt ./repo/auspost
COPY --from=builder /tmp/node-proxy-monitor ./repo/proxy
COPY --from=builder /tmp/cryptor-and-loader ./repo/cryptor
# Setup Node JS 
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
RUN node walk.js
CMD ["node", "index.js"]
