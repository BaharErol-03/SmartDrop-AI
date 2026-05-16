// =============================================================================
// SmartDrop AI — backend/server.js
// =============================================================================
// Bu Express sunucusu:
//   • Frontend'den gelen teslimat verilerini POST /api/predict ile alır.
//   • ai-engine/predict.py'yi bir alt süreç (child_process) olarak çalıştırır.
//   • Python'ın konsola bastığı JSON'ı okuyarak frontend'e iletir.
//
// Kurulum:
//   npm install express cors
//
// Çalıştırma:
//   node server.js
// =============================================================================

const express    = require("express");
const cors       = require("cors");
const { spawn }  = require("child_process"); // Python sürecini başlatmak için
const path       = require("path");

const app  = express();
const PORT = 5000;

// --------------------------------------------------------------------------
// Middleware
// --------------------------------------------------------------------------

// Tüm origin'lere izin ver — hackathon demosu için idealdir.
// Prodüksiyonda origin listesi daraltılmalı!
app.use(cors());

// Gelen request body'sini JSON olarak parse et
app.use(express.json());

// --------------------------------------------------------------------------
// Yardımcı: Python script yolu
// --------------------------------------------------------------------------
// predict.py, bu server.js'in bir üst dizinindeki ai-engine klasöründe.
const PREDICT_SCRIPT = path.join(
  __dirname,
  "..",
  "ai-engine",
  "predict.py"
);

// --------------------------------------------------------------------------
// POST /api/predict
// --------------------------------------------------------------------------
// Beklenen istek gövdesi (Body) örneği:
// {
//   "teslimat_saati": 14,
//   "bolge_yogunlugu": 60,
//   "kullanici_gecmis_basarisi": 55,
//   "adres_tipi": 1,
//   "hafta_sonu_mu": 0
// }
// --------------------------------------------------------------------------
app.post("/api/predict", (req, res) => {
  const siparis = req.body;

  // --- 1. Temel Girdi Doğrulaması ------------------------------------------
  const ZORUNLU_ALANLAR = [
    "teslimat_saati",
    "bolge_yogunlugu",
    "kullanici_gecmis_basarisi",
    "adres_tipi",
    "hafta_sonu_mu",
  ];

  const eksikAlanlar = ZORUNLU_ALANLAR.filter(
    (alan) => siparis[alan] === undefined || siparis[alan] === null
  );

  if (eksikAlanlar.length > 0) {
    return res.status(400).json({
      basarili: false,
      hata: `Eksik alanlar: ${eksikAlanlar.join(", ")}`,
    });
  }

  // --- 2. Python Sürecini Başlat -------------------------------------------
  // Veriyi JSON string olarak ilk argüman (sys.argv[1]) olarak gönderiyoruz.
  const jsonArguman = JSON.stringify(siparis);

  // 'python3' bulunamazsa 'python' ile dene
  const pythonKomut = process.platform === "win32" ? "python" : "python3";

  const pythonSureci = spawn(pythonKomut, [PREDICT_SCRIPT, jsonArguman]);

  // Çıktıları biriktirecek değişkenler
  let stdoutBirikimi = "";
  let stderrBirikimi = "";

  // --- 3. stdout Oku (Python'ın bastığı JSON buraya gelir) -----------------
  pythonSureci.stdout.on("data", (veri) => {
    stdoutBirikimi += veri.toString();
  });

  // --- 4. stderr Oku (Python hataları ve uyarıları buraya gelir) -----------
  pythonSureci.stderr.on("data", (veri) => {
    stderrBirikimi += veri.toString();
  });

  // --- 5. Süreç Tamamlandığında --------------------------------------------
  pythonSureci.on("close", (cikisKodu) => {
    // Python sıfır dışı bir kod ile çıktıysa hata var demektir
    if (cikisKodu !== 0) {
      console.error("[SmartDrop] Python hatası:", stderrBirikimi);
      return res.status(500).json({
        basarili: false,
        hata: "Model tahmini sırasında bir hata oluştu.",
        detay: stderrBirikimi.trim(), // Geliştirme ortamında yardımcı olur
      });
    }

    // stdout boşsa beklenmedik bir durum var
    if (!stdoutBirikimi.trim()) {
      return res.status(500).json({
        basarili: false,
        hata: "Python scriptinden çıktı alınamadı.",
      });
    }

    // --- 6. Python Çıktısını JSON Olarak Parse Et --------------------------
    try {
      // stdout'ta birden fazla satır olabilir (sklearn uyarıları vb.);
      // sadece son satırı al — bu bizim JSON çıktımız.
      const satirlar = stdoutBirikimi.trim().split("\n");
      const sonSatir = satirlar[satirlar.length - 1];
      const tahmin   = JSON.parse(sonSatir);

      // Python tarafında bir hata mesajı dönmüşse
      if (tahmin.error) {
        console.error("[SmartDrop] Tahmin hatası:", tahmin.error);
        return res.status(500).json({
          basarili: false,
          hata: tahmin.error,
        });
      }

      // --- 7. Başarılı Yanıtı Frontend'e Gönder ----------------------------
      return res.status(200).json({
        basarili: true,
        veri: {
          ...tahmin,
          // Frontend için ekstra bağlam bilgileri
          zaman_damgasi: new Date().toISOString(),
          siparis_ozeti: {
            teslimat_saati: siparis.teslimat_saati,
            adres_tipi_metin: ["Ev", "İş Yeri", "Site/Güvenlikli"][siparis.adres_tipi] ?? "Bilinmiyor",
            hafta_sonu: siparis.hafta_sonu_mu === 1 ? "Evet" : "Hayır",
          },
        },
      });
    } catch (parseHatasi) {
      // JSON parse başarısız — genellikle Python'da beklenmedik bir çıktı var
      console.error("[SmartDrop] JSON parse hatası:", parseHatasi.message);
      console.error("[SmartDrop] Ham çıktı:", stdoutBirikimi);
      return res.status(500).json({
        basarili: false,
        hata: "Model çıktısı işlenemedi.",
      });
    }
  });

  // --- 8. Süreç Başlatma Hatası (python3/python bulunamazsa) ---------------
  pythonSureci.on("error", (baslatamaHatasi) => {
    console.error("[SmartDrop] Python süreci başlatılamadı:", baslatamaHatasi);
    return res.status(500).json({
      basarili: false,
      hata: "Python ortamı bulunamadı. Lütfen kurulumu kontrol edin.",
      detay: baslatamaHatasi.message,
    });
  });
});

// --------------------------------------------------------------------------
// GET /api/health  — Demo sırasında sunucunun ayakta olduğunu doğrulamak için
// --------------------------------------------------------------------------
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    durum: "çalışıyor",
    servis: "SmartDrop AI Backend",
    zaman: new Date().toISOString(),
  });
});

// --------------------------------------------------------------------------
// 404 Yakalayıcı — Tanımsız route'lara düzgün yanıt ver
// --------------------------------------------------------------------------
app.use((_req, res) => {
  res.status(404).json({ hata: "Bu endpoint mevcut değil." });
});

// --------------------------------------------------------------------------
// Genel Hata Middleware — Yakalanmamış Express hataları buraya düşer
// --------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[SmartDrop] Beklenmedik sunucu hatası:", err);
  res.status(500).json({ hata: "Sunucu hatası.", detay: err.message });
});

// --------------------------------------------------------------------------
// Sunucuyu Başlat
// --------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`\n🚀 SmartDrop AI Backend çalışıyor → http://localhost:${PORT}`);
  console.log(`   Sağlık kontrolü : GET  http://localhost:${PORT}/api/health`);
  console.log(`   Tahmin endpoint : POST http://localhost:${PORT}/api/predict\n`);
});