# Deploy

## Local build

```bash
npm install
npm run build
```

Production files will be generated in `dist/`.

## Upload to server

Upload the full contents of `dist/` to your web root, for example:

- Apache: `public_html/`
- Nginx: `/var/www/scoot-bali/`

## SPA routing

This app uses `BrowserRouter`, so direct links like `/fleet/honda-pcx-160` need a fallback to `index.html`.

### Apache

The build already includes `.htaccess` from `public/.htaccess`.

### Nginx

Use:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## Preview locally

```bash
npm run preview
```
