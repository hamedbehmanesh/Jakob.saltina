# Canyon Bridge Studio — host

Serves the single-file Canyon Bridge Studio over HTTPS, the same way the
spray-path planner is hosted. Deploy to Render, point a subdomain at it,
share the link.

## What this is (and isn't)

The studio is a self-contained HTML file in `public/index.html`: inlined
three.js, the terrain heightmap, the satellite texture, and the app logic
(already obfuscated, with right-click / devtools shortcuts disabled).

This host **serves** that file with gzip + a few security headers. It does
**not** move the logic server-side — the browser still downloads the
client. The protection here is obfuscation, not a server boundary. For a
determined viewer that is not airtight; for sharing a demo link it is fine.

To hide the logic for real (like the spray app's `core.js`), the compute
would need to be extracted into a server module and the client made thin.
That is a rewrite, not a config change.

## Run locally

```bash
npm install
npm start
# open http://localhost:3000
```

## Deploy on Render

1. Push this folder to a **private** GitHub repo.
2. Render → New → Web Service → connect the repo.
3. Render reads `render.yaml`: runtime Node, `npm install`, `npm start`.
4. First deploy gives a `*.onrender.com` URL. Open it to confirm.

## Custom subdomain (Cloudflare)

Same as the spray app:

1. Render → service → Settings → Custom Domains → add
   `bridgestudio.hamedbehmanesh.com` (pick your subdomain).
2. Cloudflare → DNS → add a **CNAME**: name `bridgestudio`, target the
   `*.onrender.com` host Render shows. Proxy status: DNS only (grey cloud)
   until Render verifies, then you can proxy.
3. Wait for Render to show the domain as verified (TLS issued), then share
   `https://bridgestudio.hamedbehmanesh.com/`.

## Updating the studio

Replace `public/index.html` with a new build and push. Render auto-deploys
on push to `main`. Hard-refresh (Ctrl+Shift+R) if the browser cached the
old file.
