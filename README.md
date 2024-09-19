# Apartly

A new and exciting way to rent apartments with ease.

## Development

First run `npm install` before anything else.

Install and run locally (http://localhost:5173):

```sh
npm run dev
```

Build and preview (http://localhost:4173):

```sh
npm run build && npm run preview
```

Build and host for production (http://localhost:3000):

```sh
npm run build && node build
```

You can pass a `HOST=127.0.0.1` and `PORT=80` if you want to change the IP and port.

You can view `packages.json` for more scripts to run like:

```sh
npm run supa:link && npm run supa:gen
```

But that should already be up to date and committed.

## Extra

If you need to reverse from lat/long, you can fetch this API: `https://nominatim.openstreetmap.org/reverse?lat=43.5&lon=-73.5&format=jsonv2` or use an existing package.