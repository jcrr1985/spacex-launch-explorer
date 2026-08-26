# build the app
#
# debian slim and not alpine here: lmdb and msgpackr-extract ship prebuilt
# binaries for glibc, on musl npm falls back to node-gyp and the build needs
# python and a compiler. The final image is alpine anyway, so this costs
# nothing in the end.
FROM node:22-slim AS build

WORKDIR /app

# manifests first, so npm ci stays cached while only sources change
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# serve it
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/spaceX_kata/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
