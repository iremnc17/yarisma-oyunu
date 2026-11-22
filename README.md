# Gökyüzü Parkuru — Flutter Listeleme ve Kaydırma Mimarisi Yarışması

Domain maliyeti olmadan doğrudan **GitHub Pages (`github.io`)** üzerinde barındırılabilen, **40 kişilik** gerçek zamanlı çok oyunculu 3D sınıf içi bilgi yarışması.

## Dosya Yapısı
- `index.html`: **Oyuncu (Mobil) Ekranı** — Öğrenciler QR kodu okutup isim, soyisim ve 3 renkten (Kırmızı, Mavi, Yeşil) birini seçerek katılır. Kamera karakteri adım adım takip eder.
- `admin.html`: **Yönetici (Projeksiyon/Hoca) Ekranı** — Sabit geniş açıdan tüm yarışmacıları izler, QR kodu ekranda gösterir, oyunu başlatır ve her beyaz bloğa bağımsız tıklayarak kamerayı ilerletip soruları/şıkları inceler.
- `game-engine.js`: Three.js ile oluşturulmuş 14 beyaz dikdörtgen blok (Başlangıç + 12 Soru Bloğu + Bitiş), gökyüzü, bulutlar, sürekli zıplayan top karakterler ve 40 oyuncunun üst üste binmesini önleyen slot motoru.
- `questions.js`: *Flutter'da Listeleme, Kaydırma ve Performans Mimarisi* sunumundaki konulara göre hazırlanmış 12 adet 3 şıklı soru.
- `firebase-config.js`: 40 telefonun aynı anda senkronize oynaması için Firebase Realtime Database bağlantı ayarları.

## Kurulum ve GitHub Pages (`github.io`) Yayını
1. **Firebase Realtime Database Oluşturma (Ücretsiz):**
   - [Firebase Console](https://console.firebase.google.com/) üzerinden yeni bir proje oluşturun.
   - Sol menüden **Build > Realtime Database** seçin ve veritabanını **Test Mode** ile başlatın.
   - **Project Settings > General > Your apps (Web `</>`)** bölümünden verilen `firebaseConfig` bilgilerini kopyalayıp `firebase-config.js` dosyasındaki `FIREBASE_CONFIG` alanına yapıştırın.
2. **GitHub'a Yükleme:**
   - GitHub'da `yarisma-oyunu` adında herkese açık (Public) bir repository oluşturun.
   - Bu klasördeki tüm dosyaları (`index.html`, `admin.html`, `game-engine.js`, `questions.js`, `firebase-config.js`, `README.md`) repository'ye yükleyin.
   - **Settings > Pages** sekmesinden `Branch: main` seçip kaydedin.
3. **Linkler ve QR Kod:**
   - **Yönetici (Hoca) Linki:** `https://kullaniciadiniz.github.io/yarisma-oyunu/admin.html`
   - **Oyuncu (Mobil) Linki:** `https://kullaniciadiniz.github.io/yarisma-oyunu/index.html` (Yönetici ekranındaki QR kod bu linki otomatik üretir.)
