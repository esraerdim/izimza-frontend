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
