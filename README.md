# TaskFlow API

TaskFlow, ekip içerisindeki görevlerin oluşturulması, listelenmesi, görüntülenmesi, güncellenmesi ve silinmesi için hazırlanmış Express.js REST API projesidir.

## Gereksinimler

- Node.js 18 veya üzeri
- npm

## Kurulum

```bash
npm install
npm start
```

Sunucu varsayılan olarak `http://localhost:3000` adresinde çalışır. Farklı bir port için `PORT` ortam değişkeni kullanılabilir.

## Endpoint'ler

| Method | Endpoint | Açıklama |
| --- | --- | --- |
| POST | `/api/tasks` | Yeni görev oluşturur |
| GET | `/api/tasks` | Tüm görevleri listeler |
| GET | `/api/tasks/:id` | Belirli görevi getirir |
| PUT | `/api/tasks/:id` | Görevi günceller |
| DELETE | `/api/tasks/:id` | Görevi siler |

Görev gövdesi JSON formatındadır. Örnek:

```json
{
  "title": "API geliştirme",
  "description": "Görev CRUD endpointlerini hazırla",
  "priority": "high",
  "assignee": "Batuhan Orhan",
  "status": "pending"
}
```

Veriler eğitim projesinin temel veri yönetimi amacıyla `src/data/tasks.json` dosyasında tutulur.

## Logger middleware

Her isteğin zaman damgası, HTTP metodu ve endpoint bilgisi konsola yazdırılır.

## Test

Temel CRUD akışı Postman ile sırasıyla POST, GET liste, GET detay, PUT ve DELETE istekleri kullanılarak test edilmelidir.
