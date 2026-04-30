# Architecture

Bu proje, sürdürülebilirlik ve ölçeklenebilirlik hedefleri doğrultusunda Feature-Sliced Design (FSD) ve Atomic Design prensipleri birlikte kullanılarak yapılandırılmıştır.

## Katmanlar

Uygulama, sorumlulukların ayrıştırılması amacıyla aşağıdaki katmanlara bölünmüştür:

| Katman     | Amaç                                                                        |
| ---------- | --------------------------------------------------------------------------- |
| `app`      | Uygulama başlangıç noktası, provider’lar ve global konfigürasyon            |
| `pages`    | Route seviyesindeki giriş bileşenleri                                       |
| `widgets`  | Sayfa bazlı kompozit UI blokları                                            |
| `features` | Kullanıcı aksiyonlarına karşılık gelen iş akışları                          |
| `entities` | Domain modelleri, store yapıları, API katmanı ve tip tanımları              |
| `shared`   | Uygulama genelinde tekrar kullanılabilir yardımcı araçlar ve UI bileşenleri |

Katmanlar arası bağımlılık yönü aşağıdaki şekilde tanımlanmıştır:

```text
app -> pages -> widgets -> features -> entities -> shared
```

Bu yönün tersine olacak şekilde import yapılmamalıdır. Bu kural, katmanlar arası bağımlılıkların kontrol altında tutulmasını sağlar.

## UI Katmanı (Atomic Design)

`shared/ui` altında yer alan bileşenler, Atomic Design yaklaşımına uygun olarak organize edilmiştir:

* `atoms`
* `molecules`
* `organisms`

Bu katmandaki bileşenlerin mümkün olduğunca domain bağımsız olması hedeflenir. Domain’e özgü davranış gerektiren durumlarda ilgili mantık `entities` veya `features` katmanlarına taşınmalıdır.

## State Yönetimi

State yönetimi için Pinia kullanılmaktadır. Store yapıları domain bazlı olarak ayrıştırılmıştır:

* `useAuthStore`
* `useDocumentsStore`
* `useActivitiesStore`
* `useDashboardStore`

Store’lar arasında doğrudan bağımlılık oluşturulmaması esastır. Gerekli durumlarda orchestration üst katmanlarda gerçekleştirilmelidir.

## Import Kuralı

Modül tüketiminde, ilgili katmanın `index.ts` dosyaları üzerinden expose edilen public API’lerin kullanılması gerekmektedir:

```ts
import { useAuthStore } from '@/features/auth'
import { useDocumentsStore } from '@/entities/document'
import { BaseButton } from '@/shared/ui'
```

Bu yaklaşım, iç implementasyon detaylarının izole edilmesini ve modül sınırlarının korunmasını sağlar.

## Test ve Coverage

Test altyapısı aşağıdaki araçlar ile yapılandırılmıştır:

* Test framework: Vitest
* Component testleri: Vue Test Utils

Coverage süreci:

* Komut: `npm run test:coverage`
* Çıktı: `coverage/index.html`
* `coverage/` klasörü yalnızca rapor çıktısı içerir, kaynak kodun bir parçası değildir

Coverage raporları, test kapsamının analiz edilmesi ve eksik senaryoların tespit edilmesi amacıyla kullanılmaktadır.
