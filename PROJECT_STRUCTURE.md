# TaskFlow API – Proje Genel Yapısı

Bu doküman, projedeki mevcut dosyaları, uygulama akışını, API endpoint’lerini, veri modelini ve bilinen sınırlamaları açıklar.

## 1. Projenin amacı

TaskFlow, ekip içindeki görevlerin oluşturulması, listelenmesi, detaylarının görüntülenmesi, güncellenmesi ve silinmesi için hazırlanmış basit bir REST API uygulamasıdır.

Uygulama:

- Node.js üzerinde çalışır.
- HTTP sunucusu ve routing için Express.js kullanır.
- Verileri bir veritabanında değil, JSON dosyasında saklar.
- Görevler için temel CRUD işlemlerini destekler.
- Gelen istekleri tarih, HTTP metodu ve URL bilgisiyle konsola yazar.

## 2. Kullanılan teknolojiler

| Teknoloji | Kullanım amacı |
| --- | --- |
| Node.js | JavaScript çalışma ortamı |
| Express.js 4 | HTTP sunucusu ve route yönetimi |
| JavaScript/CommonJS | Uygulama kodu ve modül sistemi |
| JSON dosyası | Basit kalıcı veri saklama |
| npm | Paket ve script yönetimi |
| Postman | API isteklerini manuel test etme |

Gereksinim: Node.js 18 veya üzeri ve npm.

## 3. Dizin ve dosya yapısı

```text
TNC-Backend project/
├── package.json
├── package-lock.json
├── README.md
├── PROJECT_INTRODUCTION.md
├── PROJECT_STRUCTURE.md
├── src/
│   ├── app.js
│   ├── controllers/
│   │   └── taskController.js
│   ├── data/
│   │   ├── taskStore.js
│   │   └── tasks.json
│   ├── middlewares/
│   │   └── logger.js
│   └── routes/
│       └── taskRoutes.js
└── postman/
    ├── globals/
    │   └── workspace.globals.yaml
    └── collections/
        └── New Collection/
            └── New Request.request.yaml
```

### Dosyaların sorumlulukları

#### `src/app.js`

Uygulamanın giriş noktasıdır.

- Express uygulamasını oluşturur.
- `express.json()` ile JSON request body desteğini etkinleştirir.
- Logger middleware’ini tüm isteklere uygular.
- `/` adresinde API hakkında temel bilgi döndürür.
- `/api/tasks` adresini task route’larına bağlar.
- Tanımsız adresler için `404` yanıtı verir.
- Geçersiz JSON ve beklenmeyen sunucu hataları için genel hata middleware’i içerir.
- `PORT` ortam değişkenini kullanır; verilmezse `3000` portunda başlar.

#### `src/routes/taskRoutes.js`

Görev endpoint’lerini controller fonksiyonlarına bağlar. İş mantığını doğrudan burada çalıştırmaz.

#### `src/controllers/taskController.js`

HTTP isteklerini karşılar ve `taskStore` fonksiyonlarını çağırır.

- Request body ve URL parametrelerini alır.
- Başarı veya hata durumuna göre HTTP status code döndürür.
- Veri saklama ayrıntılarını bilmez.

#### `src/data/taskStore.js`

Görev verilerinin okunması, yazılması ve değiştirilmesinden sorumludur.

- `tasks.json` dosyasını okur.
- Yeni görev oluşturur.
- Tüm görevleri getirir.
- ID’ye göre görev getirir.
- ID’ye göre görev günceller.
- ID’ye göre görev siler.

#### `src/data/tasks.json`

Görevlerin JSON array olarak tutulduğu veri dosyasıdır. Başlangıçta boş olabilir:

```json
[]
```

#### `src/middlewares/logger.js`

Her request için ISO formatında zaman damgası, HTTP metodu ve istek URL’sini konsola yazar. Daha sonra `next()` çağrısıyla isteği bir sonraki middleware veya route’a aktarır.

#### `README.md` ve `PROJECT_INTRODUCTION.md`

README temel kurulum ve endpoint bilgilerini, proje tanıtım dosyası ise uygulamanın amacı ve kapsamını açıklar.

#### `postman/`

Postman çalışma alanı için dışa aktarılmış ayarların bulunduğu dizindir. Mevcut request dosyası, görev endpoint’lerini tam olarak tanımlanmış bir collection şeklinde içermemektedir.

## 4. Uygulama başlangıç akışı

Uygulama `npm start` komutuyla başlatıldığında genel akış şöyledir:

```text
npm start
   ↓
src/app.js
   ↓
express.json()
   ↓
logger middleware
   ↓
/api/tasks route’ları
   ↓
controller
   ↓
taskStore
   ↓
src/data/tasks.json
```

Bir request geldiğinde önce JSON body ayrıştırılır, sonra logger request’i konsola yazar. İstek `/api/tasks` ile eşleşirse ilgili route controller’ı çağrılır. Controller, veri işlemini `taskStore` üzerinden yapar ve sonucu JSON olarak döndürür.

## 5. API endpoint’leri

Base URL:

```text
http://localhost:3000
```

| Method | Endpoint | Açıklama | Başarılı yanıt |
| --- | --- | --- | --- |
| `POST` | `/api/tasks` | Yeni görev oluşturur | `201 Created` |
| `GET` | `/api/tasks` | Tüm görevleri getirir | `200 OK` |
| `GET` | `/api/tasks/:id` | ID’ye göre görev getirir | `200 OK` |
| `PUT` | `/api/tasks/:id` | Görevi günceller | `200 OK` |
| `DELETE` | `/api/tasks/:id` | Görevi siler | `204 No Content` |

### 5.1 Yeni görev oluşturma

`POST /api/tasks`

Örnek request body:

```json
{
  "title": "API geliştirme",
  "description": "CRUD endpointlerini hazırla",
  "priority": "high",
  "assignee": "Batuhan Orhan",
  "status": "pending"
}
```

Desteklenen alanlar:

| Alan | Açıklama | Varsayılan |
| --- | --- | --- |
| `title` | Görev başlığı | Yok |
| `description` | Görev açıklaması | Yok |
| `priority` | Görev önceliği | Yok |
| `assignee` | Sorumlu kişi | Yok |
| `status` | Görevin mevcut durumu | `pending` |

Yanıt örneği:

```json
{
  "id": "1710000000000",
  "title": "API geliştirme",
  "description": "CRUD endpointlerini hazırla",
  "priority": "high",
  "assignee": "Batuhan Orhan",
  "status": "pending",
  "createdAt": "2026-10-19T10:00:00.000Z",
  "updatedAt": "2026-10-19T10:00:00.000Z"
}
```

`id`, `createdAt` ve `updatedAt` sunucu tarafından üretilir. Mevcut kodda zorunlu alan, tip veya enum doğrulaması bulunmamaktadır.

### 5.2 Tüm görevleri listeleme

`GET /api/tasks`

Yanıt, görevlerin array halidir:

```json
[
  {
    "id": "1710000000000",
    "title": "API geliştirme",
    "description": "CRUD endpointlerini hazırla",
    "priority": "high",
    "assignee": "Batuhan Orhan",
    "status": "pending",
    "createdAt": "2026-10-19T10:00:00.000Z",
    "updatedAt": "2026-10-19T10:00:00.000Z"
  }
]
```

### 5.3 Tek görev getirme

`GET /api/tasks/:id`

Örnek:

```text
GET /api/tasks/1710000000000
```

ID bulunamazsa:

```json
{
  "message": "Görev bulunamadı."
}
```

HTTP status: `404 Not Found`.

### 5.4 Görev güncelleme

`PUT /api/tasks/:id`

Gönderilen alanlar mevcut görevle birleştirilir. Örnek:

```json
{
  "status": "completed",
  "priority": "medium"
}
```

Güncelleme sırasında:

- `id` değiştirilemez.
- `createdAt` değiştirilemez.
- `updatedAt` yeni zamanla güncellenir.
- Request body içindeki diğer alanlar mevcut görevle birleştirilir.

Görev bulunamazsa `404 Not Found` ve `Görev bulunamadı.` mesajı döndürülür.

### 5.5 Görev silme

`DELETE /api/tasks/:id`

Silme başarılı olursa body içermeyen `204 No Content` yanıtı döner. ID bulunamazsa `404 Not Found` döner.

## 6. Görev veri modeli

Bir görev normalde aşağıdaki alanlardan oluşur:

```text
Task
├── id: String
├── title: String | undefined
├── description: String | undefined
├── priority: String | undefined
├── assignee: String | undefined
├── status: String
├── createdAt: ISO tarih String’i
└── updatedAt: ISO tarih String’i
```

`id`, oluşturma sırasında `Date.now()` değerinin string’e çevrilmesiyle üretilir. Tarih alanları `new Date().toISOString()` ile UTC tabanlı ISO formatında oluşturulur.

## 7. Hata davranışları

### Geçersiz JSON

Request body geçersiz JSON içeriyorsa Express hata middleware’i aşağıdaki yanıtı verir:

```json
{
  "message": "Geçersiz JSON gövdesi."
}
```

HTTP status: `400 Bad Request`.

### Bulunamayan route

Tanımlı olmayan bir endpoint’e istek atılırsa:

```json
{
  "message": "İstenen sayfa bulunamadı."
}
```

HTTP status: `404 Not Found`.

### Bulunamayan görev

GET, PUT veya DELETE işlemlerinde ID bulunamazsa:

```json
{
  "message": "Görev bulunamadı."
}
```

HTTP status: `404 Not Found`.

### Beklenmeyen sunucu hatası

Yakalanmayan hatalar konsola yazılır ve istemciye genel bir mesaj döner:

```json
{
  "message": "Sunucu hatası."
}
```

HTTP status: `500 Internal Server Error`.

## 8. Kurulum ve çalıştırma

Proje dizininde:

```bash
npm install
npm start
```

Geliştirme sırasında Node.js watch modu kullanılabilir:

```bash
npm run dev
```

Varsayılan adres:

```text
http://localhost:3000
```

Farklı port kullanmak için:

```powershell
$env:PORT=4000
npm start
```

## 9. Veri saklama davranışı

Veriler `src/data/tasks.json` dosyasından okunur ve her değişiklikte dosyaya tekrar yazılır. Bu yaklaşım eğitim ve küçük ölçekli kullanım için yeterlidir; her request’te dosya sistemi kullanıldığı için yüksek trafikli veya çok kullanıcılı sistemler için uygun değildir.

Uygulama yeniden başlatılsa bile `tasks.json` içindeki veriler korunur. Dosya silinir veya geçersiz JSON içerirse okuma sırasında hata oluşabilir.

## 10. Mevcut sınırlamalar

Mevcut kodda aşağıdaki özellikler bulunmamaktadır:

- Request validation
- Zorunlu alan kontrolü
- `priority` ve `status` için izin verilen değer kontrolü
- Kullanıcı veya ekip üyesi yönetimi
- Kimlik doğrulama ve yetkilendirme
- Veritabanı kullanımı
- Sayfalama, arama ve filtreleme
- Otomatik test suite’i
- Merkezi ve yapılandırılabilir loglama
- API dokümantasyonu için Swagger/OpenAPI
- Eşzamanlı dosya yazma güvenliği

Bu nedenle API, şu an temel CRUD ve eğitim amaçlı bir backend iskeleti olarak değerlendirilmelidir.

## 11. Örnek uçtan uca akış

```text
1. İstemci POST /api/tasks isteği gönderir.
2. express.json() request body’yi ayrıştırır.
3. logger middleware isteği konsola yazar.
4. taskRoutes POST route’unu createTask controller’ına yönlendirir.
5. createTask, req.body’yi taskStore.create() fonksiyonuna verir.
6. taskStore görev için ID ve tarih alanlarını üretir.
7. Görev tasks.json içine eklenir.
8. Controller 201 status code ve oluşturulan görevi döndürür.
```

## 12. Geliştirme için önerilen sonraki adımlar

Projeyi üretim kullanımına yaklaştırmak için öncelikli geliştirmeler şunlardır:

1. Request body doğrulaması eklemek.
2. `status` ve `priority` için izin verilen değerleri belirlemek.
3. Veritabanı katmanına geçmek.
4. Unit ve integration testleri eklemek.
5. Swagger/OpenAPI dokümantasyonu hazırlamak.
6. Kimlik doğrulama ve yetkilendirme eklemek.
7. Postman collection’ını tüm endpoint’leri içerecek şekilde tamamlamak.
8. Ortak hata formatı ve daha ayrıntılı loglama kullanmak.
