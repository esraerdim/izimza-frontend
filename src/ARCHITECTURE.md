# Architecture Guide

Bu proje `Atomic Design + feature-oriented` yaklasimla kurgulanmistir.

## Katmanlar

- `app/`: uygulama bootstrap, provider ve global stil
- `pages/`: route entry componentleri
- `widgets/`: sayfa seviyesinde tekrar kullanilan buyuk parcalar
- `features/`: domain/use-case bazli is kurallari (auth, dashboard, vb.)
- `shared/`: butun projede ortak altyapi, ui atom/molecule, util ve type

## Atomic Design Kurali

- `shared/ui/atoms`: en kucuk tekrar kullanilabilir UI parcalari
- `shared/ui/molecules`: birden fazla atomu birlestiren UI bloklari
- `widgets`: organisms/template seviyesinde birlesimler
- `pages`: son kompozisyon

## Import Kurali

- Her katman kendi `index.ts` dosyasindan disari public API acar.
- Tuketim tarafinda mumkun oldugunca dosya yerine katman export'u import edilir.
- Ornek:
  - `import { useAuthStore } from '../../features/auth'`
  - `import { BaseButton } from '../../shared/ui'`

## Microfrontend Hazirlik Notu

- Route bazli ayrisabilir feature sinirlari korunur.
- `features/*` klasorleri bagimsiz moduller gibi ele alinir.
- `shared/*` ortak sozlesme katmani oldugu icin breaking degisiklikler kontrollu yapilir.
