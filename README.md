

# izimza Frontend

Bu proje, Vue 3, TypeScript ve Pinia kullanılarak geliştirilmiş iZimza arayüz uygulamasıdır.

## Kurulum

Projeyi lokal ortamda çalıştırmak için aşağıdaki adımlar izlenmelidir:

```bash id="kurulum1"
npm install
npm run dev:api
npm run dev
```

* Frontend: `http://localhost:5173`
* Mock API: `http://localhost:3001`

Opsiyonel olarak demo kullanıcı bilgileri ile giriş yapılabilir:

```bash id="kurulum2"
VITE_DEMO_EMAIL=demo@izimza.com
VITE_DEMO_PASSWORD=Demo123!
```

## Komutlar

Projede kullanılan temel komutlar aşağıda listelenmiştir:

| Komut                     | Açıklama                                        |
| ------------------------- | ----------------------------------------------- |
| `npm run dev`             | Vite geliştirme sunucusunu başlatır             |
| `npm run dev:api`         | json-server ve middleware ile mock API başlatır |
| `npm run build`           | Production build oluşturur                      |
| `npm run preview`         | Build çıktısını lokal ortamda sunar             |
| `npm run typecheck`       | TypeScript tip kontrolü yapar                   |
| `npm run lint`            | ESLint ile kod kalitesini analiz eder           |
| `npm run format`          | Prettier ile kod formatlama işlemi yapar        |
| `npm run test`            | Vitest ile birim testleri çalıştırır            |
| `npm run test:watch`      | Testleri izleme modunda çalıştırır              |
| `npm run test:coverage`   | Test çalıştırır ve coverage raporu oluşturur    |
| `npm run storybook`       | Storybook geliştirme ortamını başlatır          |
| `npm run build-storybook` | Storybook için statik build oluşturur           |

## Coverage Nedir, Ne İşe Yarar?

`npm run test:coverage` komutu, testlerin çalıştırılması sırasında hangi dosya ve satırların test edildiğini analiz eder ve raporlar.

Bu kapsamda:

* Konsol çıktısında özet metrikler sunulur (`Statements`, `Branches`, `Functions`, `Lines`)
* `coverage/index.html` altında detaylı bir HTML rapor oluşturulur
* `coverage/` klasörü yalnızca lokal analiz amacıyla kullanılır ve versiyon kontrolüne dahil edilmez

Bu raporlar, test kapsamındaki eksikliklerin tespit edilmesi ve test stratejisinin iyileştirilmesi açısından önemlidir.

## Proje Yapısı (Özet)

```text id="yapi1"
src/
  app/
  pages/
  widgets/
  features/
  entities/
  shared/
```

Daha detaylı mimari açıklama için: `src/ARCHITECTURE.md`


