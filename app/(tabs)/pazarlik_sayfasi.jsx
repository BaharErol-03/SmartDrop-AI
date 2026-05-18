/**
 * SmartDrop AI — pazarlik_sayfasi.jsx
 * Gemini API + Expo Router params · Rose/Kırmızı Tema
 */

import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─── 🔑 GEMİNİ API ANAHTARIN BURAYA GİR ──────────────────────────────

const GEMINI_API_KEY = "API_KEY_YAZILACAK";
// ─────────────────────────────────────────────────────────────────────

// ─── ROSE/KIRMIZI RENK PALETİ ─────────────────────────────────────────
const C = {
  bg: "#f9f0f0",
  surface: "#ffffff",
  border: "#f0dada",
  primary: "#C85C5C",
  primaryDark: "#B04848",
  primarySoft: "#f9ecec",
  textPrimary: "#2d1515",
  textMuted: "#9e7272",
  textDim: "#c4a0a0",
  white: "#ffffff",
  success: "#10b981",
  warning: "#f59e0b",
};

// ─── SİSTEM PROMPTU ───────────────────────────────────────────────────
const buildSystemPrompt = (urun) => {
  const fiyat = parseFloat(urun.Price) || 0;
  const dipFiyat = Math.round(fiyat * 0.8);
  const cokDusuk = Math.round(fiyat * 0.6);

  return `Sen bir ikinci el pazaryeri uygulamasında satıcı temsilcisi olarak görev yapıyorsun. Adın "Pazar". Kullanıcı senden bu ürünü almak istiyor ve seninle pazarlık ediyor.

Sattığın ürün: ${urun.Product_name}
Konum: ${urun.Address}
Fiyat: ${fiyat}₺

Kişiliğin:
- Sıcakkanlı, samimi ve Türkçe konuşan birisin
- Deneyimli bir satıcısın, pazarlığa alışkınsın
- Ürününü sahipleniyorsun ama makul tekliflere açıksın
- Kısa ve doğal cevaplar veriyorsun, 2-3 cümle yeterli

Pazarlık stratejin:
- ${cokDusuk}₺ altındaki teklifleri reddediyorsun, ürünün değerini anlatıyorsun
- ${cokDusuk}₺ ile ${dipFiyat}₺ arası tekliflerde müzakere ediyorsun, orta yol arıyorsun  
- ${dipFiyat}₺ ve üstü teklifleri kabul ediyorsun, anlaşmayı onaylıyorsun
- Asla bu fiyat sınırlarından bahsetmiyorsun, doğal bir satıcı gibi davranıyorsun

Kullanıcı seninle normal sohbet de edebilir. Ürün hakkında sorular sorabilir, pazarlık yapmak yerine sadece bilgi almak isteyebilir. Her durumda doğal ve samimi cevap ver.`;
};

// ─── GEMİNİ API FONKSİYONU ────────────────────────────────────────────
const sendToGemini = async (urun, conversationHistory, userMessage) => {
  const systemPrompt = buildSystemPrompt(urun);

  const formattedHistory = conversationHistory.map((msg) => ({
    role: msg.sender === "user" ? "user" : "model",
    parts: [{ text: msg.text }],
  }));

  const contents = [
    { role: "user", parts: [{ text: systemPrompt }] },
    { role: "model", parts: [{ text: "Tabii, sizi dinliyorum!" }] },
    ...formattedHistory,
    { role: "user", parts: [{ text: userMessage }] },
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 250,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Hata kodu: ${response.status}`);
  }

  const data = await response.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Bir sorun oluştu, tekrar dener misin?"
  );
};

// ─── HAZIR MESAJ ÖNERİLERİ ────────────────────────────────────────────
const getQuickMessages = (urun) => {
  const fiyat = parseFloat(urun.Price) || 100;
  return [
    `${Math.round(fiyat * 0.75)}₺ olur mu?`,
    "Ürün ne durumda?",
    `${Math.round(fiyat * 0.85)}₺ verebilirim`,
  ];
};

// ─── ANA EKRAN ────────────────────────────────────────────────────────
export default function PazarlikScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const aktifUrun = {
    Product_name: params.Product_name || "İkinci El Ürün",
    Price: params.Price || "100",
    Address: params.Address || "Belirtilmemiş",
    Image: params.Image || null,
  };

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: `Merhaba! "${aktifUrun.Product_name}" ilanını inceliyorsunuz. ${aktifUrun.Price === "Free" ? "Bu ürünü ücretsiz veriyorum" : `Fiyatım ${aktifUrun.Price}₺`}. Aklınızda bir teklif var mı, yoksa önce ürün hakkında bilgi almak ister misiniz? 😊`,
      time: new Date().toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const scrollViewRef = useRef();
  const quickMessages = getQuickMessages(aktifUrun);

  // ─── ÜRÜN DEĞİŞİNCE SOHBETİ SIFIRLA ──────────────────────────────
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: "bot",
        text: `Merhaba! "${aktifUrun.Product_name}" ilanını inceliyorsunuz. ${aktifUrun.Price === "Free" ? "Bu ürünü ücretsiz veriyorum" : `Fiyatım ${aktifUrun.Price}₺`}. Aklınızda bir teklif var mı, yoksa önce ürün hakkında bilgi almak ister misiniz? 😊`,
        time: new Date().toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInputText("");
    setApiError(null);
  }, [params.Product_name]);

  // ─── MESAJ GÖNDER ─────────────────────────────────────────────────
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    setApiError(null);
    const history = messages.filter((m) => m.id !== 1);
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const botReply = await sendToGemini(aktifUrun, history, text);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: botReply,
          time: new Date().toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      setApiError(error.message);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: `⚠️ Hata: ${error.message}`,
          time: new Date().toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* ── HEADER ────────────────────────────────────────────────── */}
        <View style={styles.topHeader}>
          <View style={styles.hdCircle1} />
          <View style={styles.hdCircle2} />
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={C.white} />
            </TouchableOpacity>
            <View style={styles.headerBotInfo}>
              <View style={styles.botAvatar}>
                <FontAwesome5 name="robot" size={16} color={C.primary} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Pazar · AI Asistan</Text>
                <View style={styles.onlineRow}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>Çevrimiçi</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.infoBtn}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={C.white}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── ÜRÜN KARTI ────────────────────────────────────────────── */}
        <View style={styles.productCard}>
          {aktifUrun.Image ? (
            <Image
              source={{ uri: aktifUrun.Image }}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.productIconWrap}>
              <Ionicons name="cube-outline" size={26} color={C.primary} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {aktifUrun.Product_name}
            </Text>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Ionicons name="location-outline" size={10} color={C.primary} />
                <Text style={styles.badgeTxt}> {aktifUrun.Address}</Text>
              </View>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.productPrice}>
              {aktifUrun.Price === "Free" ? "Ücretsiz" : `${aktifUrun.Price}₺`}
            </Text>
            <Text style={styles.productLabel}>İstenen Fiyat</Text>
          </View>
        </View>

        {/* ── CHAT ALANI ────────────────────────────────────────────── */}
        <ScrollView
          style={styles.chatArea}
          contentContainerStyle={{
            paddingBottom: 20,
            paddingTop: 8,
            flexGrow: 1,
          }}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          <View style={styles.infoBubble}>
            <Ionicons name="shield-checkmark" size={11} color={C.textMuted} />
            <Text style={styles.infoText}>
              SmartDrop Güvenli Pazarlık Sistemi
            </Text>
          </View>

          {messages.map((msg) => {
            const isBot = msg.sender === "bot";
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  isBot ? styles.msgBotRow : styles.msgUserRow,
                ]}
              >
                {isBot && (
                  <View style={styles.smallAvatar}>
                    <FontAwesome5 name="robot" size={9} color={C.primary} />
                  </View>
                )}
                <View
                  style={[
                    styles.bubble,
                    isBot ? styles.bubbleBot : styles.bubbleUser,
                    msg.isError && styles.bubbleError,
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      isBot ? styles.textBot : styles.textUser,
                    ]}
                  >
                    {msg.text}
                  </Text>
                  <Text
                    style={[
                      styles.timeText,
                      isBot ? styles.timeBot : styles.timeUser,
                    ]}
                  >
                    {msg.time}
                  </Text>
                </View>
              </View>
            );
          })}

          {isLoading && (
            <View style={[styles.messageRow, styles.msgBotRow]}>
              <View style={styles.smallAvatar}>
                <FontAwesome5 name="robot" size={9} color={C.primary} />
              </View>
              <View
                style={[styles.bubble, styles.bubbleBot, styles.loadingBubble]}
              >
                <ActivityIndicator size="small" color={C.primary} />
                <Text style={styles.loadingText}>Pazar yazıyor...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* ── HAZIR MESAJ ÖNERİLERİ ─────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRow}
        >
          {quickMessages.map((q) => (
            <TouchableOpacity
              key={q}
              style={styles.quickBtn}
              onPress={() => setInputText(q)}
              disabled={isLoading}
            >
              <Text style={styles.quickBtnText}>{q}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── INPUT ALANI ───────────────────────────────────────────── */}
        <View style={styles.inputArea}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Mesaj yaz veya teklif ver..."
              placeholderTextColor={C.textMuted}
              value={inputText}
              onChangeText={setInputText}
              editable={!isLoading}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              multiline={false}
            />
            <TouchableOpacity
              style={[styles.sendBtn, isLoading && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={C.white} />
              ) : (
                <Ionicons
                  name="send"
                  size={16}
                  color={C.white}
                  style={{ marginLeft: 2 }}
                />
              )}
            </TouchableOpacity>
          </View>
          {apiError && <Text style={styles.errorText}>⚠️ {apiError}</Text>}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── STİLLER ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  topHeader: {
    backgroundColor: C.primary,
    paddingTop: Platform.OS === "android" ? 16 : 10,
    paddingBottom: 18,
    paddingHorizontal: 18,
    overflow: "hidden",
    position: "relative",
  },
  hdCircle1: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(255,255,255,0.10)",
    top: -35,
    right: -25,
  },
  hdCircle2: {
    position: "absolute",
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: 25,
    right: 65,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBotInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    marginHorizontal: 12,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: C.white,
    marginBottom: 2,
  },
  onlineRow: { flexDirection: "row", alignItems: "center" },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#4ade80",
  },
  onlineText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
    marginLeft: 4,
  },
  infoBtn: { padding: 4 },

  productCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  productImage: {
    width: 54,
    height: 54,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: C.primarySoft,
  },
  productIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: C.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 6,
  },
  badgeRow: { flexDirection: "row", gap: 6 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  badgeTxt: { fontSize: 10, fontWeight: "700", color: C.primary },
  productPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: C.primary,
    marginBottom: 2,
  },
  productLabel: { fontSize: 10, color: C.textMuted },

  // ✅ flex:1 ile chat alanı tüm boşluğu kaplar
  chatArea: { flex: 1, paddingHorizontal: 14 },

  infoBubble: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: C.primarySoft,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 5,
    marginBottom: 14,
    marginTop: 4,
  },
  infoText: {
    fontSize: 10,
    color: C.textMuted,
    fontWeight: "600",
    marginLeft: 4,
  },
  messageRow: {
    flexDirection: "row",
    marginBottom: 14,
    alignItems: "flex-end",
  },
  msgBotRow: { justifyContent: "flex-start" },
  msgUserRow: { justifyContent: "flex-end" },
  smallAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 20,
  },
  bubbleBot: {
    backgroundColor: C.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  bubbleUser: { backgroundColor: C.primary, borderBottomRightRadius: 4 },
  bubbleError: { backgroundColor: "#fff0f0", borderColor: "#ffcccc" },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 14,
  },
  loadingText: {
    fontSize: 13,
    color: C.textMuted,
    fontStyle: "italic",
    marginLeft: 8,
  },
  bubbleText: { fontSize: 14, lineHeight: 21 },
  textBot: { color: C.textPrimary },
  textUser: { color: C.white },
  timeText: { fontSize: 10, marginTop: 6, alignSelf: "flex-end" },
  timeBot: { color: C.textMuted },
  timeUser: { color: "rgba(255,255,255,0.65)" },

  // ✅ paddingVertical azaltıldı — gereksiz boşluk giderildi
  quickRow: { gap: 8, paddingHorizontal: 14, paddingVertical: 2 },
  quickBtn: {
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.primary,
    borderRadius: 30,
    paddingVertical: 5,
    paddingHorizontal: 13,
    alignItems: "center",
    alignSelf: "flex-start",
  },
  quickBtnText: { fontSize: 12, fontWeight: "700", color: C.primary },

  inputArea: {
    paddingHorizontal: 14,
    paddingTop: 6,
    // ✅ Android'de tab bar kadar boşluk bırakılıyordu, düzeltildi
    paddingBottom: Platform.OS === "ios" ? 24 : 12,
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bg,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 25,
    paddingLeft: 16,
    paddingRight: 6,
    height: 52,
  },
  input: { flex: 1, height: "100%", color: C.textPrimary, fontSize: 15 },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: C.textDim },
  errorText: {
    fontSize: 11,
    color: "#ef4444",
    marginTop: 6,
    textAlign: "center",
  },
});
