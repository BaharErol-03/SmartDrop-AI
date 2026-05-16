# =============================================================================
# SmartDrop AI — Teslimat Başarı Tahmini ve Yöntem Önerisi
# =============================================================================
# Bu script:
#   1. Gerçekçi sentetik bir teslimat veri seti üretir.
#   2. Üç ayrı hedef değişkeni (basari_ihtimali, onerilen_yontem,
#      karbon_kazanci_gram) için iki ML modeli eğitir.
#   3. Eğitilen modelleri backend'de kullanmak üzere .pkl dosyaları olarak
#      dışa aktarır.
#   4. Örnek bir sipariş için tahmin yaparak çıktıyı ekrana basar.
#
# Gereksinimler (requirements.txt):
#   pip install -r requirements.txt
# =============================================================================

import numpy as np
import pandas as pd
import joblib
import os
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    mean_absolute_error,
    accuracy_score,
    classification_report,
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

# Tekrar üretilebilir sonuçlar için rastgele tohum sabitleme
RANDOM_SEED = 42
np.random.seed(RANDOM_SEED)

# Model dosyalarının kaydedileceği dizin (bu scriptin bulunduğu klasör)
OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

# =============================================================================
# 1. SENTETİK VERİ SETİ ÜRETİMİ
# =============================================================================

def sentetik_veri_uret(n_kayit: int = 5000) -> pd.DataFrame:
    """
    Gerçek dünya dağılımlarını taklit eden sentetik teslimat verisi üretir.

    Parametreler
    ------------
    n_kayit : int
        Üretilecek örnek sayısı (varsayılan 5 000).

    Dönüş
    -----
    pd.DataFrame
        Bağımsız değişkenler ve üç hedef sütun içeren veri çerçevesi.
    """

    # --- Bağımsız Değişkenler (Features) ------------------------------------

    # Teslimat saati: gün içinde tüm saatler eşit olasılıklı değil;
    # gerçekte öğleden sonra (12-18) yoğunlaşır.
    teslimat_saati = np.random.choice(
        range(24),
        size=n_kayit,
        p=_saat_olasiliklari(),
    )

    # Bölge yoğunluğu: 0-100 arası trafik + kargo kalabalık skoru
    bolge_yogunlugu = np.random.beta(a=2, b=3, size=n_kayit) * 100

    # Kullanıcının geçmiş teslimat alma başarı yüzdesi (0-100)
    kullanici_gecmis_basarisi = np.clip(
        np.random.normal(loc=72, scale=20, size=n_kayit), 0, 100
    )

    # Adres tipi: 0 = Ev, 1 = İş Yeri, 2 = Site/Güvenlikli
    adres_tipi = np.random.choice([0, 1, 2], size=n_kayit, p=[0.55, 0.30, 0.15])

    # Hafta sonu mu? Cumartesi-Pazar = 1, diğerleri = 0
    hafta_sonu_mu = np.random.choice([0, 1], size=n_kayit, p=[0.71, 0.29])

    # --- Hedef Değişken 1: Başarı İhtimali (Regresyon) ----------------------
    # Gerçek hayat mantığına dayalı kural tabanlı hesaplama + gürültü.

    # Saate göre katsayı: iş saatleri (9-17) daha başarılı
    saat_katsayi = np.array([_saat_katsayi(s) for s in teslimat_saati])

    # Bölge yoğunluğu arttıkça başarı düşer
    yogunluk_etkisi = (100 - bolge_yogunlugu) / 100  # 0-1 aralığı

    # İş yeri (1) ve site (2) için farklı etki katsayıları
    adres_etkisi = np.where(
        adres_tipi == 1, 1.10,   # İş yeri: alıcı orada olma ihtimali yüksek
        np.where(adres_tipi == 2, 0.90, 1.00)  # Site: güvenlik gecikmesi
    )

    # Hafta sonu evde bulunma oranı biraz daha yüksek
    hafta_sonu_etkisi = np.where(hafta_sonu_mu == 1, 1.05, 1.00)

    basari_ihtimali = (
        kullanici_gecmis_basarisi
        * saat_katsayi
        * yogunluk_etkisi
        * adres_etkisi
        * hafta_sonu_etkisi
    )
    # Gürültü ekle ve 0-100 aralığına sıkıştır
    basari_ihtimali += np.random.normal(0, 5, n_kayit)
    basari_ihtimali = np.clip(basari_ihtimali, 0, 100)

    # --- Hedef Değişken 2: Önerilen Yöntem (Sınıflandırma) -----------------
    # İş kurallarına dayalı atama; böylece model bu kuralları öğrenir.
    #   0 → Ev Teslimi
    #   1 → Akıllı Dolap
    #   2 → Teslim Noktası

    onerilen_yontem = _yontem_ata(
        basari_ihtimali, bolge_yogunlugu, adres_tipi
    )

    # --- Hedef Değişken 3: Karbon Kazancı (Regresyon) -----------------------
    # Tekrar dağıtıma çıkmaktan kaçınılan CO2 miktarı (gram cinsinden).
    # Ortalama bir "failed delivery" → ~1 200g CO2 ek salınım.
    # Başarısız teslimat olasılığı düştükçe kurtarılan CO2 artar.
    # Akıllı dolap rota optimizasyonu sayesinde ek kazanç sağlar.

    baz_kurtarilan = (1 - basari_ihtimali / 100) * 1200
    dolap_bonus = np.where(onerilen_yontem == 1, 150, 0)
    nokta_bonus = np.where(onerilen_yontem == 2, 80, 0)
    karbon_kazanci_gram = (
        baz_kurtarilan + dolap_bonus + nokta_bonus
        + np.random.normal(0, 30, n_kayit)
    )
    karbon_kazanci_gram = np.clip(karbon_kazanci_gram, 0, None)

    # --- DataFrame Oluştur --------------------------------------------------
    df = pd.DataFrame(
        {
            "teslimat_saati": teslimat_saati,
            "bolge_yogunlugu": np.round(bolge_yogunlugu, 2),
            "kullanici_gecmis_basarisi": np.round(kullanici_gecmis_basarisi, 2),
            "adres_tipi": adres_tipi,
            "hafta_sonu_mu": hafta_sonu_mu,
            # Hedefler
            "basari_ihtimali": np.round(basari_ihtimali, 2),
            "onerilen_yontem": onerilen_yontem,
            "karbon_kazanci_gram": np.round(karbon_kazanci_gram, 2),
        }
    )
    return df


# --- Yardımcı Fonksiyonlar --------------------------------------------------

def _saat_olasiliklari() -> list:
    """
    24 saatlik olasılık dağılımı döndürür.
    Mesai saatleri (9-18) ve öğleden sonra pik saatleri (13-16) ağırlıklı.
    """
    olasiliklar = [
        0.005, 0.003, 0.002, 0.002, 0.003, 0.005,  # 00-05 (gece)
        0.010, 0.020, 0.040, 0.055, 0.065, 0.070,  # 06-11 (sabah)
        0.075, 0.080, 0.080, 0.075, 0.065, 0.060,  # 12-17 (öğleden sonra)
        0.055, 0.050, 0.040, 0.030, 0.020, 0.010,  # 18-23 (akşam)
    ]
    # Olasılıkların toplamını 1'e normalize et
    toplam = sum(olasiliklar)
    return [p / toplam for p in olasiliklar]


def _saat_katsayi(saat: int) -> float:
    """
    Verilen teslimat saatine göre başarı çarpanı döndürür.
    Öğle saatleri için azami, gece/sabah erken için asgari değer.
    """
    if 9 <= saat <= 18:
        return 1.0          # Standart mesai: en iyi oran
    elif 18 < saat <= 21:
        return 0.90         # Akşam: biraz düşük
    elif 7 <= saat < 9:
        return 0.85         # Sabah erken: kişiler henüz ayrılmış olabilir
    else:
        return 0.70         # Gece/çok erken: düşük başarı


def _yontem_ata(
    basari: np.ndarray,
    yogunluk: np.ndarray,
    adres: np.ndarray,
) -> np.ndarray:
    """
    İş kurallarına göre önerilen teslimat yöntemini belirler.

    Kural özeti:
    - Başarı < 40 VEYA yoğunluk > 75  → Akıllı Dolap (1)
    - Başarı 40-65 VEYA adres İş Yeri → Teslim Noktası (2)
    - Diğer                            → Ev Teslimi (0)
    """
    yontem = np.zeros(len(basari), dtype=int)

    akilli_dolap_mask = (basari < 40) | (yogunluk > 75)
    teslim_nokta_mask = ~akilli_dolap_mask & ((basari < 65) | (adres == 1))

    yontem[akilli_dolap_mask] = 1
    yontem[teslim_nokta_mask] = 2
    # Geri kalanlar zaten 0 (Ev Teslimi)
    return yontem


# =============================================================================
# 2. MODEL EĞİTİMİ
# =============================================================================

FEATURE_COLUMNS = [
    "teslimat_saati",
    "bolge_yogunlugu",
    "kullanici_gecmis_basarisi",
    "adres_tipi",
    "hafta_sonu_mu",
]


def model_egit(df: pd.DataFrame):
    """
    Veri setinden iki model eğitir ve değerlendirme metriklerini yazdırır.

    Model 1 — RandomForestRegressor:
        Hedefler: basari_ihtimali, karbon_kazanci_gram (MultiOutput)

    Model 2 — RandomForestClassifier:
        Hedef : onerilen_yontem

    Dönüş
    -----
    tuple: (regressor_pipeline, classifier_pipeline)
    """

    X = df[FEATURE_COLUMNS]

    # --- 2A. Regresyon Modeli -----------------------------------------------
    print("\n" + "=" * 60)
    print("MODEL 1: Başarı İhtimali & Karbon Kazancı (Regresör)")
    print("=" * 60)

    # İki hedefi tek seferde tahmin etmek için MultiOutputRegressor kullanmak
    # yerine her ikisini de DataFrame olarak veriyoruz; RandomForest bunu
    # doğrudan destekler (sklearn çoklu çıktı).
    y_reg = df[["basari_ihtimali", "karbon_kazanci_gram"]]

    X_train_r, X_test_r, y_train_r, y_test_r = train_test_split(
        X, y_reg, test_size=0.20, random_state=RANDOM_SEED
    )

    # Pipeline: ölçekleme + model
    # Not: RandomForest ölçeklemeye ihtiyaç duymaz ama pipeline
    # yapısı backend entegrasyonunu kolaylaştırır.
    reg_pipeline = Pipeline(
        [
            ("scaler", StandardScaler()),
            (
                "model",
                RandomForestRegressor(
                    n_estimators=200,      # 200 ağaç — iyi denge: hız vs doğruluk
                    max_depth=12,          # Aşırı öğrenmeyi önlemek için derinlik sınırı
                    min_samples_leaf=5,    # Her yaprakta en az 5 örnek
                    random_state=RANDOM_SEED,
                    n_jobs=-1,             # Tüm CPU çekirdeklerini kullan
                ),
            ),
        ]
    )

    reg_pipeline.fit(X_train_r, y_train_r)
    y_pred_r = reg_pipeline.predict(X_test_r)

    mae_basari = mean_absolute_error(y_test_r["basari_ihtimali"], y_pred_r[:, 0])
    mae_karbon = mean_absolute_error(y_test_r["karbon_kazanci_gram"], y_pred_r[:, 1])

    print(f"  Başarı İhtimali  — Test MAE : {mae_basari:.2f} puan")
    print(f"  Karbon Kazancı   — Test MAE : {mae_karbon:.2f} gram")

    # --- 2B. Sınıflandırma Modeli -------------------------------------------
    print("\n" + "=" * 60)
    print("MODEL 2: Önerilen Teslimat Yöntemi (Sınıflandırıcı)")
    print("=" * 60)

    y_clf = df["onerilen_yontem"]

    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(
        X, y_clf, test_size=0.20, random_state=RANDOM_SEED
    )

    clf_pipeline = Pipeline(
        [
            ("scaler", StandardScaler()),
            (
                "model",
                RandomForestClassifier(
                    n_estimators=200,
                    max_depth=10,
                    min_samples_leaf=5,
                    class_weight="balanced",  # Dengesiz sınıf dağılımını dengeler
                    random_state=RANDOM_SEED,
                    n_jobs=-1,
                ),
            ),
        ]
    )

    clf_pipeline.fit(X_train_c, y_train_c)
    y_pred_c = clf_pipeline.predict(X_test_c)

    acc = accuracy_score(y_test_c, y_pred_c)
    print(f"  Doğruluk (Accuracy) : {acc * 100:.2f}%\n")

    # Sınıf başına detaylı rapor
    yontem_isimleri = ["Ev Teslimi", "Akıllı Dolap", "Teslim Noktası"]
    print(
        classification_report(
            y_test_c,
            y_pred_c,
            target_names=yontem_isimleri,
        )
    )

    # Özellik önem sıralaması (yorumlanabilirlik için — jüri sorusu!)
    print("\n  [Regresör] Özellik Önem Sıralaması:")
    feature_importances = reg_pipeline.named_steps["model"].feature_importances_
    for ozellik, onem in sorted(
        zip(FEATURE_COLUMNS, feature_importances),
        key=lambda x: x[1],
        reverse=True,
    ):
        print(f"    {ozellik:<35} {onem:.4f}")

    return reg_pipeline, clf_pipeline


# =============================================================================
# 3. MODELLERİ DIŞA AKTAR (.pkl)
# =============================================================================

def modelleri_kaydet(reg_pipeline, clf_pipeline, output_dir: str = OUTPUT_DIR):
    """
    Eğitilmiş pipeline'ları .pkl formatında diske kaydeder.
    Backend (FastAPI / Flask vb.) bu dosyaları yükleyip tahmin yapabilir.
    """
    reg_path = os.path.join(output_dir, "smartdrop_regressor.pkl")
    clf_path = os.path.join(output_dir, "smartdrop_classifier.pkl")

    joblib.dump(reg_pipeline, reg_path)
    joblib.dump(clf_pipeline, clf_path)

    print("\n" + "=" * 60)
    print("Modeller başarıyla kaydedildi:")
    print(f"  Regresör  → {reg_path}")
    print(f"  Sınıflandırıcı → {clf_path}")
    print("=" * 60)

    return reg_path, clf_path


# =============================================================================
# 4. ÖRNEK TAHMİN (PREDICT)
# =============================================================================

def ornek_tahmin_yap(reg_pipeline, clf_pipeline):
    """
    Örnek bir teslimat siparişi için tahmin üretir ve sonuçları yorumlar.
    Backend'de bu fonksiyon API endpoint'inden gelen JSON verisini alacak.
    """

    # Örnek sipariş: hafta içi saat 14:00, orta yoğunluklu bölge,
    # geçmişi ortalama bir kullanıcı, iş yeri adresi
    ornek_siparis = pd.DataFrame(
        [
            {
                "teslimat_saati": 14,
                "bolge_yogunlugu": 60.0,
                "kullanici_gecmis_basarisi": 55.0,
                "adres_tipi": 1,       # İş yeri
                "hafta_sonu_mu": 0,    # Hafta içi
            }
        ]
    )

    # Tahmin
    reg_cikti = reg_pipeline.predict(ornek_siparis)
    clf_cikti = clf_pipeline.predict(ornek_siparis)
    clf_olasiliklar = clf_pipeline.predict_proba(ornek_siparis)

    tahmin_basari = reg_cikti[0][0]
    tahmin_karbon = reg_cikti[0][1]
    tahmin_yontem = clf_cikti[0]

    yontem_etiketi = {0: "Ev Teslimi", 1: "Akıllı Dolap", 2: "Teslim Noktası"}
    yontem_isimleri = ["Ev Teslimi", "Akıllı Dolap", "Teslim Noktası"]

    print("\n" + "=" * 60)
    print("ÖRNEK TAHMİN SONUCU")
    print("=" * 60)
    print("Giriş Verisi:")
    print(ornek_siparis.to_string(index=False))
    print()
    print("Tahmin Çıktıları:")
    print(f"  ✔ Başarı İhtimali    : %{tahmin_basari:.1f}")
    print(f"  ✔ Önerilen Yöntem    : {yontem_etiketi[tahmin_yontem]} (Sınıf {tahmin_yontem})")
    print(f"  ✔ Karbon Kazancı     : {tahmin_karbon:.1f} gram CO₂")
    print()
    print("Yöntem Güven Oranları:")
    for isim, olasilik in zip(yontem_isimleri, clf_olasiliklar[0]):
        print(f"    {isim:<20} %{olasilik * 100:.1f}")

    # Yorumlama
    print()
    print("Yorum:")
    if tahmin_basari < 50:
        print(
            f"  Kullanıcının evde/işte bulunma ihtimali düşük (%{tahmin_basari:.0f})."
        )
        print(
            f"  '{yontem_etiketi[tahmin_yontem]}' önerisi başarısız teslimatı "
            f"önleyerek {tahmin_karbon:.0f}g CO₂ tasarrufu sağlar."
        )
    else:
        print(
            f"  Teslimat yüksek başarı olasılığıyla (%{tahmin_basari:.0f}) "
            f"tamamlanabilir."
        )
    print("=" * 60)


# =============================================================================
# 5. ANA AKIŞ
# =============================================================================

if __name__ == "__main__":
    print("SmartDrop AI — Model Eğitim Süreci Başlatılıyor...\n")

    # Adım 1: Sentetik veri üret
    print("Adım 1/4 → Sentetik veri üretiliyor (5 000 kayıt)...")
    df = sentetik_veri_uret(n_kayit=5000)
    print(f"  Veri üretildi. Şekil: {df.shape}")
    print(df.describe().to_string())

    # İsteğe bağlı: veriyi CSV olarak kaydet (analiz / sunum için kullanışlı)
    csv_yolu = os.path.join(OUTPUT_DIR, "sentetik_veri.csv")
    df.to_csv(csv_yolu, index=False)
    print(f"\n  Veri CSV olarak kaydedildi → {csv_yolu}")

    # Adım 2: Modelleri eğit
    print("\nAdım 2/4 → Modeller eğitiliyor...")
    reg_pipeline, clf_pipeline = model_egit(df)

    # Adım 3: Modelleri kaydet
    print("\nAdım 3/4 → Modeller dışa aktarılıyor...")
    modelleri_kaydet(reg_pipeline, clf_pipeline)

    # Adım 4: Örnek tahmin
    print("\nAdım 4/4 → Örnek sipariş için tahmin yapılıyor...")
    ornek_tahmin_yap(reg_pipeline, clf_pipeline)

    print("\nTüm adımlar tamamlandı. Modeller backend'e entegre edilmeye hazır!")