# =============================================================================
# SmartDrop AI — predict.py
# =============================================================================
# Bu script Node.js tarafından bir alt süreç (child process) olarak çağrılır.
# Görev:
#   1. Komut satırı argümanından (sys.argv[1]) JSON verisini oku.
#   2. Kayıtlı .pkl modellerini yükle.
#   3. Tahmin yap.
#   4. Sonucu konsola TEK SATIRLIK JSON olarak yaz.
#      (Node.js stdout'u okuyarak bu satırı parse edecek.)
#
# Kullanım (Node.js'ten çağrılır, elle de test edilebilir):
#   python predict.py '{"teslimat_saati":14,"bolge_yogunlugu":60,"kullanici_gecmis_basarisi":55,"adres_tipi":1,"hafta_sonu_mu":0}'
# =============================================================================

import sys
import json
import os

import joblib
import pandas as pd
import numpy as np
import sys
sys.stdout.reconfigure(encoding='utf-8')
# --------------------------------------------------------------------------
# 0. Hata çıktısı için yardımcı: her zaman tek satır JSON döndür
# --------------------------------------------------------------------------
def hata_donur(mesaj: str):
    """Hata durumunda Node.js'in parse edebileceği JSON çıktısı üretir."""
    print(json.dumps({"error": mesaj}, ensure_ascii=False))
    sys.exit(1)


# --------------------------------------------------------------------------
# 1. Komut satırı argümanını oku ve parse et
# --------------------------------------------------------------------------
if len(sys.argv) < 2:
    hata_donur("Eksik argüman: JSON verisi sys.argv[1] olarak gönderilmeli.")

try:
    veri = json.loads(sys.argv[1])
except json.JSONDecodeError as e:
    hata_donur(f"JSON parse hatası: {str(e)}")

# --------------------------------------------------------------------------
# 2. Model dosyalarının yolunu belirle
# --------------------------------------------------------------------------
# Bu script ai-engine/ klasöründe çalışır; modeller de aynı klasördedir.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
REG_PATH = os.path.join(BASE_DIR, "smartdrop_regressor.pkl")
CLF_PATH = os.path.join(BASE_DIR, "smartdrop_classifier.pkl")

# --------------------------------------------------------------------------
# 3. Modelleri yükle
# --------------------------------------------------------------------------
try:
    reg_model = joblib.load(REG_PATH)
    clf_model = joblib.load(CLF_PATH)
except FileNotFoundError as e:
    hata_donur(f"Model dosyası bulunamadı: {str(e)}. Önce model_builder.py çalıştırın.")
except Exception as e:
    hata_donur(f"Model yükleme hatası: {str(e)}")

# --------------------------------------------------------------------------
# 4. Gelen veriyi DataFrame'e dönüştür
# --------------------------------------------------------------------------
FEATURE_COLUMNS = [
    "teslimat_saati",
    "bolge_yogunlugu",
    "kullanici_gecmis_basarisi",
    "adres_tipi",
    "hafta_sonu_mu",
]

try:
    # Sadece modelin beklediği sütunları al; ekstra alan gelirse yoksay
    satir = {col: veri[col] for col in FEATURE_COLUMNS}
    df = pd.DataFrame([satir])
except KeyError as e:
    hata_donur(f"Eksik özellik (feature): {str(e)}")

# --------------------------------------------------------------------------
# 5. Tahmin yap
# --------------------------------------------------------------------------
try:
    reg_cikti = reg_model.predict(df)           # [[basari_ihtimali, karbon_kazanci]]
    clf_cikti = clf_model.predict(df)           # [yontem_sinifi]
    clf_olasiliklar = clf_model.predict_proba(df)  # [[p0, p1, p2]]
except Exception as e:
    hata_donur(f"Tahmin hatası: {str(e)}")

# --------------------------------------------------------------------------
# 6. Sonuçları anlamlı metin etiketlerine çevir
# --------------------------------------------------------------------------
YONTEM_ETIKETI = {
    0: "Ev Teslimi",
    1: "Akıllı Dolap",
    2: "Teslim Noktası",
}

basari_ihtimali  = round(float(reg_cikti[0][0]), 1)
karbon_kazanci   = round(float(reg_cikti[0][1]), 1)
yontem_sinifi    = int(clf_cikti[0])
yontem_metin     = YONTEM_ETIKETI[yontem_sinifi]

# Her sınıf için güven oranları (0-100 arası yüzde)
yontem_guven = {
    YONTEM_ETIKETI[i]: round(float(clf_olasiliklar[0][i]) * 100, 1)
    for i in range(3)
}

# --------------------------------------------------------------------------
# 7. Sonucu tek satır JSON olarak stdout'a yaz
# --------------------------------------------------------------------------
# Node.js bu satırı okuyup JSON.parse() ile işleyecek.
# ensure_ascii=False → Türkçe karakterler bozulmadan iletilir.
sonuc = {
    "basari_ihtimali": basari_ihtimali,          # % cinsinden (0-100)
    "onerilen_yontem": yontem_metin,             # "Ev Teslimi" | "Akıllı Dolap" | "Teslim Noktası"
    "yontem_sinifi": yontem_sinifi,              # 0 | 1 | 2
    "karbon_kazanci_gram": karbon_kazanci,       # gram CO₂
    "yontem_guven_oranlari": yontem_guven,       # Her seçenek için yüzde güven
}

print(json.dumps(sonuc, ensure_ascii=False))