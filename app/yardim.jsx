// app/profil/yardim.jsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    UIManager,
    View
} from "react-native";
import { auth, db } from "../firebaseConfig";

// Android için LayoutAnimation aktifleştirme
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SSS_LISTESI = [
  {
    soru: "Pazar AI nasıl çalışır?",
    cevap:
      "Pazar AI, ürün fiyatını piyasa verilerine göre analiz eder ve sizin adınıza en iyi fiyat teklifini yapar. Siz sadece onaylarsınız, gerisi AI'ya kalır.",
  },
  {
    soru: "Pazarlık başlatmak için ne yapmam gerekiyor?",
    cevap:
      "Ana ekranda bir ürün arama kutusuna ürün adını veya bağlantısını yapıştırın, AI hedef fiyatı öneriyor. Onaylarsanız pazarlık başlar.",
  },
  {
    soru: "Pazarlığı iptal edebilir miyim?",
    cevap:
      'Evet. "Devam Eden Pazarlıklarım" listesindeki pazarlığa tıklayıp "Pazarlığı Sonlandır" seçeneğini kullanabilirsiniz.',
  },
  {
    soru: "Teklifim reddedilirse ne olur?",
    cevap:
      "AI, satıcının tutumuna göre yeni bir strateji önerir. İsterseniz farklı bir fiyatla devam edebilir ya da pazarlığı kapatabilirsiniz.",
  },
  {
    soru: "Kişisel verilerim güvende mi?",
    cevap:
      "Verileriniz Firebase güvenlik duvarıyla korunur ve asla üçüncü taraflarla paylaşılmaz. Hesabınızı sildiğinizde tüm veriniz kalıcı olarak silinir.",
  },
  {
    soru: "Uygulamayı nasıl güncellerim?",
    cevap:
      "App Store veya Google Play'den otomatik güncellemeler açıksa uygulama kendini günceller. Yoksa mağazadan manuel güncelleyebilirsiniz.",
  },
];

const KONU_LISTESI = [
  "Teknik Sorun",
  "Pazarlık Sorunu",
  "Ödeme Sorunu",
  "Hesap Sorunu",
  "Öneri / Geri Bildirim",
  "Diğer",
];

export default function YardimEkran() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [acikSSS, setAcikSSS] = useState(null);
  const [selectedKonu, setSelectedKonu] = useState(KONU_LISTESI[0]);
  const [mesaj, setMesaj] = useState("");
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [konuAcik, setKonuAcik] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  const toggleSSS = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAcikSSS(acikSSS === index ? null : index);
  };

  const handleGonder = async () => {
    if (!mesaj.trim()) {
      Alert.alert("Hata", "Lütfen mesajınızı yazın.");
      return;
    }
    setGonderiliyor(true);
    try {
      await addDoc(collection(db, "destek_talepleri"), {
        uid: user?.uid || "anonim",
        email: user?.email || "bilinmiyor",
        displayName: user?.displayName || "Misafir",
        konu: selectedKonu,
        mesaj: mesaj.trim(),
        durum: "beklemede",
        olusturmaTarihi: serverTimestamp(),
      });
      Alert.alert(
        "Talebiniz Alındı ✓",
        "En kısa sürede size dönüş yapacağız. Teşekkür ederiz!",
        [{ text: "Tamam", onPress: () => setMesaj("") }]
      );
    } catch (e) {
      Alert.alert("Hata", "Mesaj gönderilemedi: " + e.message);
    } finally {
      setGonderiliyor(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#C85C5C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yardım Merkezi</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.content}>
          {/* Hero */}
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <Ionicons name="headset-outline" size={36} color="#C85C5C" />
            </View>
            <Text style={styles.heroTitle}>Nasıl yardımcı olabiliriz?</Text>
            <Text style={styles.heroSubtitle}>
              Aşağıdan konuyu seçin ya da bize doğrudan mesaj gönderin.
            </Text>
          </View>

          {/* Hızlı Bağlantılar */}
          <View style={styles.quickRow}>
            <TouchableOpacity style={styles.quickCard} activeOpacity={0.7}>
              <Ionicons name="book-outline" size={22} color="#C85C5C" />
              <Text style={styles.quickText}>Kullanım{"\n"}Kılavuzu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} activeOpacity={0.7}>
              <Ionicons name="videocam-outline" size={22} color="#C85C5C" />
              <Text style={styles.quickText}>Video{"\n"}Eğitimler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickCard} activeOpacity={0.7}>
              <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
              <Text style={styles.quickText}>WhatsApp{"\n"}Destek</Text>
            </TouchableOpacity>
          </View>

          {/* SSS */}
          <Text style={styles.sectionLabel}>Sık Sorulan Sorular</Text>
          <View style={styles.sssContainer}>
            {SSS_LISTESI.map((item, index) => (
              <View key={index} style={[styles.sssItem, index < SSS_LISTESI.length - 1 && styles.sssBorder]}>
                <TouchableOpacity
                  style={styles.sssHeader}
                  onPress={() => toggleSSS(index)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.sssSoru}>{item.soru}</Text>
                  <Ionicons
                    name={acikSSS === index ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#C85C5C"
                  />
                </TouchableOpacity>
                {acikSSS === index && (
                  <Text style={styles.sssCevap}>{item.cevap}</Text>
                )}
              </View>
            ))}
          </View>

          {/* Destek Formu */}
          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>
            Destek Talebi Gönder
          </Text>
          <View style={styles.formCard}>
            {/* Konu Seçici */}
            <Text style={styles.label}>Konu</Text>
            <TouchableOpacity
              style={styles.konuSelector}
              onPress={() => setKonuAcik(!konuAcik)}
              activeOpacity={0.8}
            >
              <Text style={styles.konuText}>{selectedKonu}</Text>
              <Ionicons
                name={konuAcik ? "chevron-up" : "chevron-down"}
                size={16}
                color="#C85C5C"
              />
            </TouchableOpacity>

            {konuAcik && (
              <View style={styles.konuDropdown}>
                {KONU_LISTESI.map((k) => (
                  <TouchableOpacity
                    key={k}
                    style={[styles.konuOption, k === selectedKonu && styles.konuOptionActive]}
                    onPress={() => { setSelectedKonu(k); setKonuAcik(false); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.konuOptionText, k === selectedKonu && { color: "#C85C5C", fontWeight: "700" }]}>
                      {k}
                    </Text>
                    {k === selectedKonu && <Ionicons name="checkmark" size={16} color="#C85C5C" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Mesaj */}
            <Text style={[styles.label, { marginTop: 14 }]}>Mesajınız</Text>
            <View style={styles.textareaWrap}>
              <TextInput
                style={styles.textarea}
                value={mesaj}
                onChangeText={setMesaj}
                placeholder="Sorununuzu veya önerinizi detaylıca açıklayın..."
                placeholderTextColor="#c0a0a0"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                maxLength={1000}
              />
            </View>
            <Text style={styles.charCount}>{mesaj.length}/1000</Text>

            {/* Gönder */}
            <TouchableOpacity
              style={[styles.sendBtn, gonderiliyor && { opacity: 0.7 }]}
              onPress={handleGonder}
              disabled={gonderiliyor}
              activeOpacity={0.8}
            >
              {gonderiliyor ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="send-outline" size={18} color="#fff" />
                  <Text style={styles.sendBtnText}>Gönder</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF4F4" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#2D1515" },
  content: { padding: 20 },
  heroCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  heroIcon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  heroTitle: { fontSize: 17, fontWeight: "800", color: "#2D1515", marginBottom: 6 },
  heroSubtitle: { fontSize: 13, color: "#9e7272", textAlign: "center", lineHeight: 19 },
  quickRow: { flexDirection: "row", gap: 10, marginBottom: 24 },
  quickCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    gap: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  quickText: { fontSize: 11, fontWeight: "700", color: "#4A3B3B", textAlign: "center", lineHeight: 16 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#C85C5C",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  sssContainer: {
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  sssItem: { paddingHorizontal: 16, paddingVertical: 14 },
  sssBorder: { borderBottomWidth: 1, borderBottomColor: "#FFF5F5" },
  sssHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sssSoru: { flex: 1, fontSize: 14, fontWeight: "600", color: "#2D1515", marginRight: 8 },
  sssCevap: {
    marginTop: 10,
    fontSize: 13,
    color: "#6B4E4E",
    lineHeight: 20,
    backgroundColor: "#FFF8F8",
    borderRadius: 8,
    padding: 10,
  },
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  label: { fontSize: 13, fontWeight: "600", color: "#4A3B3B", marginBottom: 6 },
  konuSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#F0DADA",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#FFFAFA",
  },
  konuText: { fontSize: 14, color: "#2D1515", fontWeight: "600" },
  konuDropdown: {
    borderWidth: 1,
    borderColor: "#F0DADA",
    borderRadius: 10,
    marginTop: 6,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  konuOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#FFF5F5",
  },
  konuOptionActive: { backgroundColor: "#FFF0F0" },
  konuOptionText: { fontSize: 14, color: "#4A3B3B" },
  textareaWrap: {
    borderWidth: 1,
    borderColor: "#F0DADA",
    borderRadius: 10,
    backgroundColor: "#FFFAFA",
    padding: 12,
  },
  textarea: { fontSize: 14, color: "#2D1515", minHeight: 110 },
  charCount: { fontSize: 11, color: "#9e7272", textAlign: "right", marginTop: 4 },
  sendBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#C85C5C",
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 16,
    elevation: 3,
    shadowColor: "#C85C5C",
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  sendBtnText: { fontSize: 15, fontWeight: "800", color: "#fff" },
});