/**
 * SmartDrop AI — pazarlik_sayfasi.jsx
 * İkinci El Ürün Pazarlık Botu (Light Mode) - Firebase Firestore Entegrasyonlu
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

// 🔥 Firebase Firestore bağlantısı ve gerekli metotlar
import { db } from "../../firebaseConfig"; // Dosya yolunun doğruluğundan emin ol, gerekirse ../../../firebaseConfig yapabilirsin
import { collection, getDocs } from "firebase/firestore";

// ─── KURUMSAL VE SADE RENK PALETİ (LIGHT MODE) ─────────────────────────
const C = {
  bg: "#f8fafc",
  surface: "#ffffff",
  border: "#e2e8f0",
  primary: "#2563eb",
  primarySoft: "#eff6ff",
  textPrimary: "#0f172a",
  textMuted: "#64748b",
  success: "#10b981",
  warning: "#f59e0b",
};

export default function PazarlikScreen() {
  const [offer, setOffer] = useState("");
  const [messages, setMessages] = useState([]);
  const [botData, setBotData] = useState(null); // 🔥 Canlı bot verisi için state
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef();

  // ─── 🔥 FİREBASE'DEN CANLI BOT VERİLERİNİ ÇEKME SÜRECİ ──────────────────
  useEffect(() => {
    const botVerisiniGetir = async () => {
      try {
        setLoading(true);
        const botRef = collection(db, "bot_pazarliklar");
        const querySnapshot = await getDocs(botRef);
        
        if (!querySnapshot.empty) {
          // İlk dökümanı baz alıyoruz
          const firstDoc = querySnapshot.docs[0].data();
          setBotData(firstDoc);

          // İlk selamlama mesajını Firestore'dan gelen verilere göre dinamik oluşturuyoruz
          setMessages([
            {
              id: 1,
              sender: "bot",
              text: `Merhaba Bahar! İlgilendiğin '${firstDoc.urunAdi}' için satıcı adına buradayım. Ürünün liste fiyatı ${firstDoc.saticiFiyati} ₺. Aklındaki teklif nedir?`,
              time: new Date().toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      } catch (error) {
        console.error("Bot verisi çekilirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    botVerisiniGetir();
  }, []);

  // ─── AI PAZARLIK SİMÜLASYONU ──────────────────────────────────────────
  const handleSendOffer = () => {
    if (!offer.trim() || !botData) return;

    const userOffer = parseInt(offer.replace(/[^0-9]/g, ""), 10);
    if (isNaN(userOffer)) return;

    const newUserMsg = {
      id: Date.now(),
      sender: "user",
      text: `${userOffer.toLocaleString("tr-TR")} ₺ teklif ediyorum.`,
      time: new Date().toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setOffer("");

    // Bot Yanıtı (Yapay Zeka Düşünme Süresi Simülasyonu)
    setTimeout(() => {
      let botResponse = "";
      
      // Firestore'dan gelen hedef fiyatlara göre akıllı cevap simülasyonu
      const saticiFiyatiNum = parseInt(botData.saticiFiyati.replace(/[^0-9]/g, ""), 10) || 25000;
      const botunSonTeklifiNum = parseInt(botData.botunSonTeklifi.replace(/[^0-9]/g, ""), 10) || 22500;
      
      if (userOffer < botunSonTeklifiNum - 1500) {
        botResponse = `Bu cihaz çok temiz kullanılmış. ${userOffer.toLocaleString("tr-TR")} ₺ maalesef satıcının beklentisinin çok altında. Fiyatı biraz daha yükseltebilir misin?`;
      } else if (userOffer >= botunSonTeklifiNum - 1500 && userOffer < botunSonTeklifiNum) {
        botResponse = `Yaklaştık! Ancak piyasa şartlarında bu temizlikte bir cihaz için satıcı adına en son ${botunSonTeklifiNum.toLocaleString("tr-TR")} ₺ yapabilirim. Ortada buluşalım, ne dersin?`;
      } else if (userOffer >= botunSonTeklifiNum && userOffer < saticiFiyatiNum) {
        botResponse = `Teklifin mantıklı. ${userOffer.toLocaleString("tr-TR")} ₺ üzerinden satıcı adına anlaşmayı onaylıyorum! Hayırlı olsun. 🤝`;
      } else {
        botResponse = `Harika teklif! ${userOffer.toLocaleString("tr-TR")} ₺'ye anlaştık. Hemen ödeme ve kargo adımlarına geçebiliriz. 🚀`;
      }

      const newBotMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: botResponse,
        time: new Date().toLocaleTimeString("tr-TR", { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, newBotMsg]);
    }, 1200);
  };

  if (loading) {
    return (
      <View style={[styles.safe, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={{ marginTop: 10, color: C.textMuted, fontSize: 14 }}>Asistan bağlantısı kuruluyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <View style={styles.botAvatar}>
              <FontAwesome5 name="robot" size={16} color={C.primary} />
            </View>
            <View>
              <Text style={styles.headerTitle}>SmartTrade AI</Text>
              <Text style={styles.headerStatus}>Satıcı Asistanı • Çevrimiçi</Text>
            </View>
          </View>
        </View>

        {/* ── 🔥 CANLI İKİNCİ EL ÜRÜN KARTI (FIRESTORE) ── */}
        {botData && (
          <View style={styles.productCard}>
            <View style={styles.productIcon}>
              <Ionicons name="laptop-outline" size={28} color={C.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.productTitle}>{botData.urunAdi}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.badge}><Text style={styles.badgeTxt}>Durum: Canlı</Text></View>
                <View style={[styles.badge, {backgroundColor: '#fef3c7'}]}>
                  <Text style={[styles.badgeTxt, {color: C.warning}]} numberOfLines={1}>
                    {botData.botDurumMesaji}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ alignItems: "flex-end", marginLeft: 8 }}>
              <Text style={styles.productPrice}>{botData.saticiFiyati} ₺</Text>
              <Text style={styles.productLabel}>İstenen Fiyat</Text>
            </View>
          </View>
        )}

        {/* ── CHAT EKRANI ── */}
        <ScrollView 
          style={styles.chatArea} 
          contentContainerStyle={{ paddingBottom: 120 }}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <View style={styles.infoBubble}>
            <Ionicons name="shield-checkmark" size={12} color={C.textMuted} />
            <Text style={styles.infoText}>SmartDrop Güvenli Pazarlık Sistemi</Text>
          </View>

          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            return (
              <View key={msg.id} style={[styles.messageRow, isBot ? styles.msgBotRow : styles.msgUserRow]}>
                {isBot && <View style={styles.smallAvatar}><FontAwesome5 name="robot" size={10} color={C.primary} /></View>}
                <View style={[styles.bubble, isBot ? styles.bubbleBot : styles.bubbleUser]}>
                  <Text style={[styles.bubbleText, isBot ? styles.textBot : styles.textUser]}>
                    {msg.text}
                  </Text>
                  <Text style={[styles.timeText, isBot ? styles.timeBot : styles.timeUser]}>
                    {msg.time}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* ── TEKLİF GİRİŞ ALANI ── */}
        <View style={styles.inputArea}>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>₺</Text>
            <TextInput
              style={styles.input}
              placeholder={`Örn: ${botData ? botData.botunSonTeklifi : "23000"}`}
              placeholderTextColor={C.textMuted}
              keyboardType="numeric"
              value={offer}
              onChangeText={setOffer}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendOffer}>
              <Ionicons name="send" size={16} color="#fff" style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitleRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  botAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.primarySoft, alignItems: "center", center: "center", justifyContent: "center", borderWidth: 1, borderColor: `${C.primary}20` },
  headerTitle: { fontSize: 16, fontWeight: "700", color: C.textPrimary },
  headerStatus: { fontSize: 12, color: C.success, fontWeight: "600" },

  productCard: { flexDirection: "row", alignItems: "center", backgroundColor: C.surface, margin: 16, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: C.border, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  productIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: C.bg, alignItems: "center", justifyContent: "center", marginRight: 12 },
  productTitle: { fontSize: 14, fontWeight: "700", color: C.textPrimary, marginBottom: 6 },
  badgeRow: { flexDirection: "row", gap: 6, flexWrap: "wrap", maxWidth: "85%" },
  badge: { backgroundColor: C.primarySoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, maxWith: 150 },
  badgeTxt: { fontSize: 10, fontWeight: "600", color: C.primary },
  productPrice: { fontSize: 16, fontWeight: "800", color: C.textPrimary, marginBottom: 4 },
  productLabel: { fontSize: 10, color: C.textMuted },

  chatArea: { flex: 1, paddingHorizontal: 16 },
  infoBubble: { flexDirection: "row", alignItems: "center", alignSelf: "center", backgroundColor: "#e2e8f0", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, gap: 6, marginBottom: 16, marginTop: 8 },
  infoText: { fontSize: 10, color: C.textMuted, fontWeight: "600" },
  
  messageRow: { flexDirection: "row", marginBottom: 16, alignItems: "flex-end" },
  msgBotRow: { justifyContent: "flex-start" },
  msgUserRow: { justifyContent: "flex-end" },
  smallAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.primarySoft, alignItems: "center", justifyContent: "center", marginRight: 8, marginBottom: 4 },
  bubble: { maxWidth: "75%", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20 },
  bubbleBot: { backgroundColor: C.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: C.border },
  bubbleUser: { backgroundColor: C.primary, borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  textBot: { color: C.textPrimary },
  textUser: { color: "#fff" },
  timeText: { fontSize: 10, marginTop: 6, alignSelf: "flex-end" },
  timeBot: { color: C.textMuted },
  timeUser: { color: "rgba(255,255,255,0.7)" },

  inputArea: { padding: 16, paddingBottom: 80, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 25, paddingLeft: 16, paddingRight: 6, height: 50 },
  currencySymbol: { fontSize: 18, fontWeight: "600", color: C.textMuted, marginRight: 8 },
  input: { flex: 1, height: "100%", color: C.textPrimary, fontSize: 15 },
  sendBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.primary, alignItems: "center", justifyContent: "center" }
});