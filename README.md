# 🌟 LearnLanguage — Yapay Zeka Destekli Kelime Öğrenme Platformu

LearnLanguage, kullanıcıların İngilizce kelime dağarcıklarını zenginleştirmek, kelimeleri görsel ve işitsel hafıza teknikleriyle pekiştirmek ve yapay zeka entegrasyonu ile aktif öğrenim sağlamak amacıyla tasarlanmış modern, şık ve tam donanımlı bir web uygulamasıdır.

Bu proje, öğrencilerin kelimeleri düzenli tekrarlarla öğrenmesini sağlayan adaptif bir algoritmayı, eğlenceli kelime oyunlarını (Wordle), etkileşimli testleri ve son teknoloji yapay zeka (LLM) tabanlı hikaye ve görsel üretim araçlarını tek bir çatı altında birleştirir.

---

## 👥 Proje Katılımcıları (Geliştiriciler)

Bu proje, aşağıdaki değerli ekip üyelerinin özverili çalışmalarıyla hayata geçirilmiştir:

*   **Şahin Temel**
*   **Ebubekir Ömer Yeniçağ**
*   **Özgür Küsmüş**
*   **Hamza Burak**

---

## 📝 Öğrenci Beyanı (İsterlerin Karşılanma Durumu)

Proje kapsamında talep edilen tüm isterler eksiksiz bir şekilde tamamlanmış, modern bir arayüz ve robust bir arka yüz mimarisi ile hayata geçirilmiştir.

| İsterler | Gerçekleştirildi | Öğrenci Beyanı / Detaylar |
| :--- | :---: | :--- |
| **Kullanıcı Kayıt Modülü** | **Evet** | **Firebase Authentication** tabanlı güvenli kayıt, giriş, şifremi unuttum ve şifre sıfırlama akışları oluşturulmuştur. Sunucu tarafında JWT doğrulaması ile oturum güvenliği en üst düzeye çıkarılmıştır. |
| **Kelime Ekleme Modülü** | **Evet** | Kullanıcılar kendi öğrenmek istedikleri kelimeleri İngilizce ve Türkçe karşılıklarıyla ekleyebilirler. Kelime eklerken **görsel (resim) yükleme**, **telaffuz için ses dosyası yükleme** ve **örnek cümleler ekleme** desteği tam olarak sağlanmıştır. |
| **Sınav Modülü (Test)** | **Evet** | Kullanıcının henüz tam öğrenemediği kelimelerden dinamik olarak 10 soruluk sınavlar oluşturulur. Doğru bilinen kelimeler Leitner benzeri bir streak sistemine aktarılır, yanlış bilinenlerde ise streak sıfırlanır. |
| **Ayarlar Modülü (Kelime Sıklığı)** | **Evet** | Kullanıcılar günlük hedefleyecekleri yeni kelime çalışma sıklığını (günlük kelime limiti) parametrik olarak ayarlayabilir. Ayarlar veri tabanında kullanıcıya özel saklanır. |
| **Analiz Rapor Modülü** | **Evet** | Öğrenilen kelime sayısı, öğrenilme aşamasındaki kelimeler ve henüz başlanmayan kelimeler görsel yüzdeler halinde raporlanır. Ayrıca her kelimenin doğru cevap serisi (streak) ve son görülme tarihi detaylıca listelenir. |
| **Bulmaca (Wordle)** | **Evet** | Kelime dağarcığını eğlenceli bir yolla pekiştirmek için 5 harfli kelimelerle oynanan modern bir **Wordle oyunu** entegre edilmiştir. Şık animasyonlar ve başarı kontrolü mevcuttur. |
| **Word Chain (LLM Hikaye + Görsel)** | **Evet** | Kullanıcının seçtiği kelimeler **Google Gemini (2.5-Flash) API**'sine gönderilerek kelimelerin bir zincir halinde (Word Chain) birbirine bağlandığı anlamlı bir İngilizce hikaye oluşturulur. Hikayeye uygun görsel ise **Pollinations AI** yardımıyla üretilir ve geçmişe kaydedilir. |

---

## 🛠️ Kullanılan Teknolojiler

Platform, modern web standartlarına uygun olarak en güncel kütüphane ve teknolojiler ile geliştirilmiştir:

### 💻 Ön Yüz (Frontend)
*   **React 19 & TypeScript:** Bileşen tabanlı, tip güvenli modern ön yüz mimarisi.
*   **Vite:** Hızlı derleme ve üstün geliştirici deneyimi sağlayan yeni nesil araç zinciri.
*   **Zustand:** Performanslı, sade ve modern global durum yönetimi (Global State Management).
*   **React Router DOM v6:** Akıcı sayfa geçişleri ve istemci taraflı yönlendirme.
*   **Axios:** Sunucuyla asenkron iletişim için HTTP istemcisi.
*   **Firebase Client SDK:** İstemci tarafı kullanıcı kimlik doğrulama işlemleri.
*   **Vanilla CSS (Premium Dark Theme):** `#0e0f13` (koyu arka plan), `#c9a96e` (elegant altın vurgular) ve `#16181f` (kart yapıları) renk paletleri ile tasarlanmış modern, akıcı geçişli ve duyarlı arayüz tasarımı.

### ⚙️ Arka Yüz (Backend & Veri Tabanı)
*   **Node.js & Express:** Hızlı, modüler ve yüksek performanslı RESTful API sunucusu.
*   **TypeScript (ts-node & tsc):** Arka yüzde de tam tip güvenliği.
*   **PostgreSQL (`pg`):** İlişkisel veri modeli, kelimeler, örnek cümleler, hikaye geçmişi ve kullanıcı ilerleme verilerinin güvenli saklanması.
*   **Firebase Admin SDK:** İstemciden gelen Firebase token'larının sunucu tarafında doğrulanması ve yetkilendirme güvenliği.
*   **Multer:** Kelime kartlarına eklenecek görsel ve ses dosyalarının sunucuya güvenle yüklenmesi.

### 🤖 Yapay Zeka & Harici Servisler
*   **Google Gemini AI API (gemini-2.5-flash):** Akıllı, bağlama uygun ve seçilen kelimeleri kalın harflerle (bold) vurgulayan yaratıcı Word Chain hikaye yazarı.
*   **Pollinations.ai API:** Üretilen hikaye temasına uygun artistik görselleri gerçek zamanlı ve anahtar kelime sınırlaması olmadan oluşturan ücretsiz görsel jeneratörü.

---

## 🗄️ Veri Tabanı Şeması (PostgreSQL)

Projeyi ayağa kaldırmadan önce PostgreSQL veri tabanınızda aşağıdaki tabloları oluşturmanız gerekmektedir. Bu SQL komutlarını veri tabanı yönetim aracınızda (pgAdmin, DBeaver vb.) çalıştırabilirsiniz:

```sql
-- 1. Kullanıcılar Tablosu
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  firebase_uid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Kelimeler Tablosu
CREATE TABLE words (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  eng_word VARCHAR(255) NOT NULL,
  tur_word VARCHAR(255) NOT NULL,
  image_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Örnek Cümleler Tablosu
CREATE TABLE samples (
  id SERIAL PRIMARY KEY,
  word_id INT REFERENCES words(id) ON DELETE CASCADE,
  sentence TEXT NOT NULL
);

-- 4. Yapay Zeka Destekli Hikayeler (Word Chain) Tablosu
CREATE TABLE stories (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  words VARCHAR(255)[] NOT NULL,
  story_text TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Kelime Öğrenme İlerlemesi Tablosu
CREATE TABLE word_progress (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  word_id INT REFERENCES words(id) ON DELETE CASCADE,
  correct_streak INT DEFAULT 0,
  mastered BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMP,
  UNIQUE(user_id, word_id)
);

-- 6. Kullanıcı Ayarları Tablosu
CREATE TABLE user_settings (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  daily_word_count INT DEFAULT 10,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## ⚙️ Kurulum Adımları (Adım Adım)

Projenin yerel bilgisayarınızda çalıştırılabilmesi için aşağıdaki adımları sırasıyla takip ediniz:

### 1. Gerekli Önkoşullar
Bilgisayarınızda şunların kurulu olduğundan emin olun:
*   [Node.js](https://nodejs.org/) (v18 veya üzeri önerilir)
*   [PostgreSQL](https://www.postgresql.org/) (veya bulut tabanlı bir PostgreSQL servisi - örn. Neon.tech, Supabase)
*   Bir Firebase Projesi (Authentication aktif edilmiş olmalı)

---

### 2. Arka Yüz (Backend - API) Kurulumu

1.  `api` dizinine geçiş yapın:
    ```bash
    cd api
    ```
2.  Gerekli tüm bağımlılıkları yükleyin:
    ```bash
    npm install
    ```
3.  `.env` dosyasını oluşturun:
    `api` klasörü altındaki `.env.example` dosyasını kopyalayıp adını `.env` yapın ve kendi bilgilerinize göre doldurun:
    ```env
    PORT=5001
    DATABASE_URL=postgresql://kullanici_adi:sifre@localhost:5432/veritabani_adi
    JWT_SECRET=RastgeleUzunBirKarakterDizisiGiriniz
    
    # Firebase Admin SDK Hizmet Hesabı Bilgileri
    FIREBASE_PROJECT_ID=proje-id-niz
    FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@proje-id.iam.gserviceaccount.com
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7...\n-----END PRIVATE KEY-----\n"
    
    # Google AI Studio Gemini API Anahtarı
    GEMINI_API_KEY=AIzaSyDkYourGeminiApiKeyHere
    ```

---

### 3. Ön Yüz (Frontend - Web UI) Kurulumu

1.  Projenin kök dizinine dönüp ardından `web` dizinine geçiş yapın:
    ```bash
    cd ../web
    ```
2.  Gerekli tüm bağımlılıkları yükleyin:
    ```bash
    npm install
    ```
3.  `.env` dosyasını oluşturun:
    `web` klasörü altındaki `.env.example` dosyasını kopyalayıp adını `.env` yapın ve kendi bilgilerinizle doldurun (Firebase web yapılandırma ayarlarınız Firebase konsolunda mevcuttur):
    ```env
    # Sunucu Bağlantı Adresi
    VITE_API_BASE_URL=http://localhost:5001
    
    # Web Client Firebase Yapılandırması
    VITE_FIREBASE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxx
    VITE_FIREBASE_AUTH_DOMAIN=proje-id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=proje-id
    VITE_FIREBASE_STORAGE_BUCKET=proje-id.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxx
    VITE_FIREBASE_APP_ID=1:xxxxxxxxx:web:xxxxxxxxx
    ```

---

## 🚀 Çalıştırma Komutları

Kurulumları tamamladıktan sonra hem sunucuyu (API) hem de ön yüzü (Vite) eş zamanlı olarak başlatmanız gerekmektedir. 

### 1. Arka Yüzü (API) Başlatma
`api` dizininde terminali açıp şu komutu çalıştırın:
```bash
npm run dev
```
*   **Çıktı:** `Backend çalışıyor: http://localhost:5001`
*   Bu komut arka planda `nodemon` ile çalışır ve kod değişikliği yaptığınızda otomatik olarak yeniden başlar.

### 2. Ön Yüzü (Web) Başlatma
`web` dizininde ayrı bir terminal açıp şu komutu çalıştırın:
```bash
npm run dev
```
*   **Çıktı:** Uygulama yerel ağınızda hazır olacaktır (genellikle `http://localhost:5173`).
*   Tarayıcınızı açıp bu adrese giderek uygulamayı kullanmaya başlayabilirsiniz!

---

## 💎 Temel Özellikler & Öğrenme Akışı

1.  **Kişiselleştirilmiş Kelime Girişi:** İster resimli, ister ses kayıtlı olarak kendi kelimelerinizi girin ve örnek cümlelerle zenginleştirin.
2.  **Akıllı Tekrar ve Leitner Algoritması:** Öğrendiğiniz kelimeleri pekiştirmek için her gün 10 kelimelik dinamik sınavlara katılın. Sınavda doğru cevapladığınız kelimenin başarı puanı (streak) artar, 6 seviyeye ulaşan kelimeler "Tamamen Öğrenildi" (Mastered) olarak işaretlenir. Yanlış bildiğiniz kelimelerin seviyesi ise hemen sıfırlanarak tekrar havuzuna alınır.
3.  **Yapay Zeka ile Doğal Öğrenim (Word Chain):** Tek seferde ezberlemeye çalışmak yerine, seçtiğiniz kelimelerin birbiri ardına bağlandığı eğlenceli ve akıcı İngilizce hikayeleri Gemini AI sizin için yazar, Pollinations AI ise bunu resmeder.
4.  **Eğlenceli Wordle Bulmacası:** Tamamen entegre Wordle ekranı ile kelimelerin harflerini tahmin ederek zihninizi tazeleyin.
5.  **Gelişmiş Analiz Paneli:** Öğrenme hızınızı, kelime dağarcığınızın gelişimini yüzdelik grafikler ve detaylı kelime durum listesi ile anlık olarak takip edin.
