// Canyon Bridge Studio — host server
// Serves the single-file studio over HTTPS with compression and basic
// hardening. The app itself is a self-contained HTML in /public.
//
// NOTE: this does NOT move the app's logic server-side. The browser still
// downloads the (obfuscated) client. For true source hiding, extract the
// compute into a server module and ship a thin client (see README).

const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// gzip/deflate — the inlined three.js + satellite texture compress well,
// so this cuts the ~3.6 MB payload down a lot over the wire.
app.use(compression());

// Light hardening + discourage framing/embedding and hotlinking.
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// Serve the studio. index.html is the only public asset.
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  setHeaders(res, filePath) {
    if (filePath.endsWith('index.html')) {
      // Always serve the latest build; the HTML itself is the app.
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
}));

app.get('/healthz', (_req, res) => res.type('text').send('ok'));

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Canyon Bridge Studio running on :${PORT}`);
});
