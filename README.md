# 🌍 Deprem Veri İzleme ve Analiz Projesi

> Türkiye geneli deprem verilerini **web scraping** ile toplayan, veri tabanına kaydeden, REST API sunan ve interaktif grafiklerle analiz eden tam donanımlı modern uygulama.

---

## 🚀 Proje Özeti

Bu proje, Türkiye'deki deprem verilerini çeşitli kaynaklardan otomatik olarak çeken bir **backend** servisi ile, bu verileri görselleştiren ve analiz etmeyi kolaylaştıran **frontend** arayüzünden oluşur.  

- 📡 **Scraping:** Axios ve Cheerio ile güncel deprem verilerini web'den çeker  
- 🕒 **Zamanlanmış Görevler:** node-cron ile veri periyodik olarak güncellenir  
- 💾 **Veri Tabanı:** PostgreSQL kullanılarak veriler saklanır  
- 🔌 **API:** Express.js üzerinden RESTful API sunulur  
- ⚛️ **Frontend:** React, Redux Toolkit ve D3.js ile güçlü, interaktif grafikler  
- 🗺️ **Harita:** Leaflet ile deprem noktalarının coğrafi gösterimi  
- 🎨 **Stil:** TailwindCSS ile modern, hızlı ve responsive tasarım  

---

## 🧩 Teknolojiler & Mimari

| Katman       | Teknoloji & Kütüphane            | Amaç                                            | Emoji  |
|--------------|---------------------------------|------------------------------------------------|--------|
| Backend      | Node.js, Express.js              | API sunma, veri yönetimi                         | 🖥️     |
|              | Axios, Cheerio                  | Web scraping                                    | 🕷️     |
|              | node-cron                      | Zamanlanmış görevler                             | ⏰     |
|              | PostgreSQL                     | Veritabanı                                      | 🗄️     |
| Frontend     | React                         | UI oluşturma                                    | ⚛️     |
|              | Redux Toolkit                 | Global durum yönetimi                            | 🔄     |
|              | D3.js                        | Veri görselleştirme                              | 📊     |
|              | Leaflet                      | Harita gösterimi                                | 🗺️     |
|              | TailwindCSS                  | Hızlı ve modern stil                             | 🎨     |

---

## 🏗️ Proje Yapısı

```plaintext
/
├─ backend/           # Node.js API & scraping servisleri
│  ├─ controllers/
│  ├─ routes/
│  ├─ services/       # Scraping ve cron job
│  ├─ db/             # PostgreSQL bağlantı & sorgular
│  ├─ .env            # Gizli anahtarlar, DB bağlantı
│  └─ index.js        # API ana dosyası
│
├─ frontend/          # React SPA
│
│  │  ├─ components/  # Grafikler, filtreler, modallar
│  │  ├─ redux/       # State yönetimi
│  │  └─ styles/      # Tailwind konfigürasyonları
│  ├─ public/
│  └─ vite.config.js  # Vite yapılandırması
│
├─ .gitignore
├─ README.md
└─ package.json       # Monorepo için ortak bağımlılıklar (isteğe bağlı)
         

```



# 🔥 Projenin Öne Çıkan Özellikleri

- 🔍 **Web Scraping:**  
  Belirli aralıklarla güncel deprem verilerini otomatik çekip veritabanına kaydeder.

- ⏲️ **Cron Job:**  
  Otomatik scraping görevlerini düzenli ve sorunsuz çalıştırır.

- 📈 **Detaylı Grafikler:**  
  Bölgelere göre büyüklük, zaman, derinlik analizleri ve interaktif tablolar sunar.

- 🗺️ **Harita Entegrasyonu:**  
  Depremlerin coğrafi konumlarını dinamik olarak gösterir.

- 🔍 **Filtreleme:**  
  Bölge bazlı, büyüklük veya tarih filtresi ile kullanıcı dostu deneyim sağlar.
