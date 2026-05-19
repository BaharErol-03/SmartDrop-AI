/**
 * SmartDrop AI — pazarlik_sayfasi.jsx
 * Çift tıklamayı ve çoklu siparişi engelleyen güvenlik kilidi eklendi!
 */

import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
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

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

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

const buildSystemPrompt = (urun) => {
  const fiyat = parseFloat(urun.price) || 0;
  const dipFiyat = Math.round(fiyat * 0.8);
  const cokDusuk = Math.round(fiyat * 0.6);

  return `Sen bir ikinci el pazaryeri uygulamasında satıcı temsilcisi olarak görev yapıyorsun. Adın "Pazar". Kullanıcı senden bu ürünü almak istiyor ve seninle pazarlık ediyor.
Sattığın ürün: ${urun.title}
Fiyat: ${fiyat}₺
Pazarlık stratejin:
- ${cokDusuk}₺ altındaki teklifleri reddediyorsun.
- ${dipFiyat}₺ ve üstü teklifleri kabul ediyorsun.
- ÖNEMLİ KURAL: Eğer kullanıcıyla anlaşırsan, cevabında kesinlikle "[ANLAŞTIK]" kelimesini geçir.`;
};

const sendToGemini = async (urun, conversationHistory, userMessage) => {
  const fiyat = parseFloat(urun.price) || 0;
  const dipFiyat = Math.round(fiyat * 0.8);
  const cokDusuk = Math.round(fiyat * 0.6);

  try {
    if (!GEMINI_API_KEY) throw new Error("KEY_MISSING");

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
        body: JSON.stringify({ contents }),
      },
    );

    if (!response.ok) throw new Error("QUOTA_ERROR");

    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text || "Tekrar dener misiniz?"
    );
  } catch (error) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mesaj = userMessage.toLowerCase();
        const rakamlar = mesaj.match(/\d+/);

        if (rakamlar) {
          const teklif = parseInt(rakamlar[0]);
          if (teklif < cokDusuk)
            resolve(
              `Maalesef ${teklif}₺ kurtarmıyor. Biraz daha çıkabilir misiniz? 🤖`,
            );
          else if (teklif < dipFiyat)
            resolve(`Gelin orta yolu bulalım, biraz artırın hemen vereyim. 🤖`);
          else
            resolve(
              `Harika, ${teklif}₺ benim için de makul. [ANLAŞTIK]! Siparişi onaylayabilirsiniz. 🎉🤖`,
            );
        } else resolve(`Fiyat teklifiniz nedir? Pazarlığa başlayabiliriz. 🤖`);
      }, 1000);
    });
  }
};

const buildWelcomeMessage = (title, price) => ({
  id: 1,
  sender: "bot",
  text: `Merhaba! "${title}" ilanını inceliyorsunuz. Fiyatım ${price}₺. Aklınızda bir teklif var mı? 😊`,
  time: new Date().toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  }),
});

export default function PazarlikScreen() {
  const { productId, title, price, imgUrl, location } = useLocalSearchParams();
  const router = useRouter();

  const aktifUrun = {
    title: title || "İkinci El Ürün",
    price: price || "100",
    location: location || "Belirtilmemiş",
    imgUrl: imgUrl || null,
  };

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    buildWelcomeMessage(aktifUrun.title, aktifUrun.price),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDealClosed, setIsDealClosed] = useState(false);
  const [finalPrice, setFinalPrice] = useState(aktifUrun.price);

  // ✅ YENİ EKLENDİ: Butona ikinci kez basılmasını engelleyecek kilit
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const scrollViewRef = useRef();

  useEffect(() => {
    setMessages([buildWelcomeMessage(aktifUrun.title, aktifUrun.price)]);
    setInputText("");
    setIsDealClosed(false);
    setIsOrderPlaced(false); // Yeni ürüne geçince kilidi sıfırlar
  }, [productId]);

  // ─── SİPARİŞİ ONAYLA (Çift Tıklama Koruması Eklendi) ───
  const handleSiparisiOnayla = async () => {
    if (isOrderPlaced) return; // Zaten tıklandıysa işlemi durdur!

    try {
      setIsLoading(true);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        if (Platform.OS === "web")
          window.alert("Sipariş vermek için giriş yapmalısınız.");
        else Alert.alert("Hata", "Sipariş vermek için giriş yapmalısınız.");
        return;
      }

      const userId = currentUser.uid;

      await addDoc(collection(db, "siparisler"), {
        kullaniciId: userId,
        urunId: productId || "bilinmeyen-id",
        urunAdi: aktifUrun.title,
        gorsel: aktifUrun.imgUrl,
        anlasilanFiyat: finalPrice,
        durum: "Hazırlanıyor",
        tarih: serverTimestamp(),
      });

      setIsOrderPlaced(true); // ✅ SİPARİŞ VERİLDİ KİLİDİNİ KAPAT!

      if (Platform.OS === "web") {
        window.alert("Tebrikler! Siparişiniz başarıyla oluşturuldu.");
        router.push("/siparislerim");
      } else {
        Alert.alert("Tebrikler!", "Siparişiniz başarıyla oluşturuldu.", [
          { text: "Tamam", onPress: () => router.push("/siparislerim") },
        ]);
      }
    } catch (error) {
      if (Platform.OS === "web") window.alert("Sipariş oluşturulamadı.");
      else Alert.alert("Hata", "Sipariş oluşturulamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isLoading || isDealClosed) return;

    const possiblePriceMatch = text.match(/\d+/);
    if (possiblePriceMatch) setFinalPrice(possiblePriceMatch[0]);

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
      let botReply = await sendToGemini(aktifUrun, history, text);
      let dealReached = false;
      if (botReply.includes("[ANLAŞTIK]")) {
        dealReached = true;
        botReply = botReply.replace("[ANLAŞTIK]", "").trim();
      }

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

      if (dealReached) setIsDealClosed(true);
    } catch (error) {
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
        {/* HEADER */}
        <View style={styles.topHeader}>
          <View style={styles.headerRow}>
            {/* ✅ GÜNCELLENDİ: Geri tuşu artık her koşulda Ana Ekrana dönecek */}
            <TouchableOpacity onPress={() => router.push("/home_sayfasi_iki")}>
              <Ionicons name="arrow-back" size={22} color={C.white} />
            </TouchableOpacity>
            <View style={styles.headerBotInfo}>
              <View style={styles.botAvatar}>
                <FontAwesome5 name="robot" size={16} color={C.primary} />
              </View>
              <View>
                <Text style={styles.headerTitle}>Pazar · AI Asistan</Text>
                <Text style={styles.onlineText}>● Çevrimiçi</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ÜRÜN KARTI */}
        <View style={styles.productCard}>
          {aktifUrun.imgUrl && (
            <Image
              source={{ uri: aktifUrun.imgUrl }}
              style={styles.productImage}
            />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.productTitle}>{aktifUrun.title}</Text>
            <Text style={styles.badgeTxt}>📍 {aktifUrun.location}</Text>
          </View>
          <Text style={styles.productPrice}>{aktifUrun.price}₺</Text>
        </View>

        {/* CHAT ALANI */}
        <ScrollView
          style={styles.chatArea}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.sender === "bot" ? styles.msgBotRow : styles.msgUserRow,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  msg.sender === "bot" ? styles.bubbleBot : styles.bubbleUser,
                ]}
              >
                <Text
                  style={
                    msg.sender === "bot" ? styles.textBot : styles.textUser
                  }
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* ALT ALAN */}
        {isDealClosed ? (
          <View style={styles.dealContainer}>
            <Text style={styles.dealText}>
              🎉 Anlaşma Sağlandı! ({finalPrice} ₺)
            </Text>

            {/* ✅ BUTON KİLİTLENDİ: Tıklanınca grileşecek ve "Sipariş Alındı" yazacak */}
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                isOrderPlaced && { backgroundColor: "#9e7272" },
              ]}
              onPress={handleSiparisiOnayla}
              disabled={isLoading || isOrderPlaced}
            >
              <Text style={styles.confirmBtnText}>
                {isOrderPlaced ? "Sipariş Alındı ✅" : "Siparişi Onayla"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.inputArea}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Mesaj yaz..."
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                <Ionicons name="send" size={16} color={C.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  topHeader: { backgroundColor: C.primary, padding: 16, paddingTop: 40 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  headerBotInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
    gap: 10,
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "bold", color: C.white },
  onlineText: { fontSize: 11, color: "#4ade80" },
  productCard: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: C.surface,
    margin: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  productImage: { width: 50, height: 50, borderRadius: 8, marginRight: 12 },
  productTitle: { fontSize: 14, fontWeight: "bold", color: C.textPrimary },
  badgeTxt: { fontSize: 12, color: C.textMuted, marginTop: 4 },
  productPrice: { fontSize: 16, fontWeight: "bold", color: C.primary },
  chatArea: { flex: 1, padding: 12 },
  messageRow: { flexDirection: "row", marginBottom: 10 },
  msgBotRow: { justifyContent: "flex-start" },
  msgUserRow: { justifyContent: "flex-end" },
  bubble: { padding: 12, borderRadius: 16, maxWidth: "80%" },
  bubbleBot: { backgroundColor: C.surface, borderBottomLeftRadius: 0 },
  bubbleUser: { backgroundColor: C.primary, borderBottomRightRadius: 0 },
  textBot: { color: C.textPrimary },
  textUser: { color: C.white },
  inputArea: { backgroundColor: C.surface, padding: 12 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bg,
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 48,
  },
  input: { flex: 1, fontSize: 14 },
  sendBtn: {
    backgroundColor: C.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dealContainer: {
    padding: 16,
    backgroundColor: C.surface,
    alignItems: "center",
  },
  dealText: {
    fontSize: 16,
    fontWeight: "bold",
    color: C.success,
    marginBottom: 12,
  },
  confirmBtn: {
    backgroundColor: C.success,
    padding: 14,
    borderRadius: 24,
    width: "100%",
    alignItems: "center",
  },
  confirmBtnText: { color: C.white, fontWeight: "bold", fontSize: 16 },
});
