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
The project also includes separate static entry points for `/admin/` and `/mobile/`.

### Apache

The build already includes `.htaccess` from `public/.htaccess`.
It also redirects `/admin` to `/admin/` and `/mobile` to `/mobile/`.

### Nginx

Use:

```nginx
location = /admin {
  return 301 /admin/;
}

location = /mobile {
  return 301 /mobile/;
}

location /admin/ {
  try_files $uri $uri/ /admin/index.html;
}

location /mobile/ {
  try_files $uri $uri/ /mobile/index.html;
}

location / {
  try_files $uri $uri/ /index.html;
}
```

## Preview locally

```bash
npm run preview
```
