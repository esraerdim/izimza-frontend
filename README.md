# izimza-frontend

Vue 3 + TypeScript tabanli frontend case projesi.

## Calistirma

```bash
npm install
npm run dev:api
npm run dev
```

- Frontend: `http://localhost:5173`
- Fake API: `http://localhost:3001`

## Demo Hesap

- Email: `demo@izimza.com`
- Sifre: `Demo123!`

## OAuth2 Girisi (Zorunlu Madde)

Proje OAuth2 Authorization Code + PKCE akisini destekler.

1. `.env.example` dosyasini `.env` olarak kopyalayin.
2. Provider degerlerini doldurun (`VITE_OAUTH_*`).
3. Login ekraninda `OAuth2 ile Giris Yap` butonu gorunur.

### Google ile OAuth2 (onerilen)

Bu projede Google girisini Auth0 uzerinden acmak en stabil yoldur:

1. Auth0 > Authentication > Social > Google baglantisini aktif edin.
2. Auth0 Application (SPA) ayarlarinda callback olarak `http://localhost:5173/auth/callback` tanimlayin.
3. `.env` dosyaniza su degerleri girin:

```bash
VITE_OAUTH_AUTHORIZE_URL=https://YOUR_AUTH0_DOMAIN/authorize
VITE_OAUTH_TOKEN_URL=https://YOUR_AUTH0_DOMAIN/oauth/token
VITE_OAUTH_USERINFO_URL=https://YOUR_AUTH0_DOMAIN/userinfo
VITE_OAUTH_CLIENT_ID=YOUR_AUTH0_CLIENT_ID
VITE_OAUTH_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_OAUTH_SCOPE=openid profile email
VITE_OAUTH_CONNECTION=google-oauth2
VITE_OAUTH_PROMPT=select_account
VITE_OAUTH_BUTTON_LABEL=Google ile Giris Yap
VITE_GOOGLE_GSI_CLIENT_ID=YOUR_GOOGLE_WEB_CLIENT_ID
```

Frontend callback route:

- `/auth/callback`

Backend session bridge endpoint:

- `POST /api/auth/oauth-login`
  - Body: `{ "email": "...", "firstName": "...", "lastName": "..." }`
  - OAuth provider'dan donen profil emaili ile local user bulunur/olusturulur.
  - Basarili olunca mevcut sistemdeki `HttpOnly` session cookie set edilir.

## Fake API Mimarisi

`json-server`, `db.json` dosyasini veritabani gibi kullanir ve yazma islemlerini bu dosyaya kaydeder.

- `db.json`: seed/mock veriler
- `api/middleware.cjs`: auth ve custom endpoint davranislari
- `package.json > dev:api`: json-server + middleware komutu

## Frontend Architecture

Proje `Atomic Design + feature-oriented` yaklasimla kuruldu:

- `app/`: bootstrap, provider, global style
- `pages/`: route girisleri
- `widgets/`: page-level buyuk bloklar (organism/template)
- `features/`: domain/use-case modul sinirlari
- `shared/`: ortak ui/api/lib/type katmani

Detayli aciklama: `src/ARCHITECTURE.md`

## Endpointler

### Auth

- `POST /api/auth/login`
  - Body: `{ "email": "...", "password": "..." }`
  - Response: `{ "user": {...} }`
  - Not: Basarili giriste server `HttpOnly` session cookie set eder.
- `GET /api/auth/me`
  - Header gerekmez, cookie otomatik gider (`withCredentials: true`)
  - Response: kullanici profili
- `POST /api/auth/logout`
  - Session cookieyi temizler.
- `POST /api/auth/oauth-login`
  - OAuth callbackten gelen profile gore local session olusturur.

### Dashboard / Belgeler

- `GET /api/dashboard/stats`
- `GET /api/activities/list`
- `GET /documents` (json-server default endpoint)
- `GET /api/documents/recent`

### Profil

- `GET /api/profile/me`
- `PATCH /api/profile/me`

### Timestamp

- `POST /api/timestamp/upload`
  - Body: `{ "fileName": "ornek.pdf", "fileSizeMb": 2.3 }`
  - Eylem:
    - `documents` listesine yeni kayit ekler
    - `activities` listesine olay ekler
    - `dashboardStats.totalTimestamped` degerini artirir
    - `dashboardStats.remainingCredits` degerini azaltir

## Frontend Auth Akisi

- Login formu `POST /api/auth/login` cagirir.
- Donen session `HttpOnly` cookie olarak tutulur (frontend JS cookieye erisemez).
- Axios tum istekleri `withCredentials: true` ile gonderir.
- Router guard:
  - `GET /api/auth/me` ile session kontrol eder.
  - Session yoksa korumali sayfadan `/login`e yonlendirir.
  - Session varsa `/login`den dashboarda yonlendirir.
