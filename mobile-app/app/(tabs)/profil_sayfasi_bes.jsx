/**
 * SmartDrop AI — ProfileScreen.jsx
 * Pinterest tasarımına uyarlanmış Rose/Kırmızı tema - Profil Ekranı
 */

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

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
  successSoft: "#d1fae5",
  warning: "#f59e0b",
  warningSoft: "#fef3c7",
  danger: "#ef4444",
};

// ─── AYAR SATIRI ──────────────────────────────────────────────────────
function AyarSatiri({ ikon, baslik, altMetin, renk = C.textPrimary, son = false }) {
  return (
    <TouchableOpacity style={[styles.ayarSatir, son && { borderBottomWidth: 0 }]}>
      <View style={[styles.ayarIkonKutu, { backgroundColor: `${renk}15` }]}>
        <Ionicons name={ikon} size={20} color={renk} />
      </View>
      <View style={styles.ayarMetinBlok}>
        <Text style={styles.ayarBaslik}>{baslik}</Text>
        {altMetin && <Text style={styles.ayarAltMetin}>{altMetin}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color={C.textDim} />
    </TouchableOpacity>
  );
}

// ─── ANA EKRAN ────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.ekran}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      <ScrollView contentContainerStyle={styles.kaydirma} showsVerticalScrollIndicator={false}>

        {/* ── ÜST HEADER + PROFİL (kırmızı banner) ─────────────────── */}
        <View style={styles.topHeader}>
          <View style={styles.hdCircle1} />
          <View style={styles.hdCircle2} />
          <View style={styles.hdCircle3} />

          {/* Header row */}
          <View style={styles.headerRow}>
            <TouchableOpacity>
              <Ionicons name="menu" size={24} color={C.white} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Profilim</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={13} color="rgba(255,255,255,0.85)" />
                <Text style={styles.headerLocation}>Merkez, Kütahya</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.profileBtnSmall}>
              <Ionicons name="settings-outline" size={19} color={C.primary} />
            </TouchableOpacity>
          </View>

          {/* Avatar ve kullanıcı bilgisi */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarKapsayici}>
              <View style={styles.avatar}>
                <Text style={styles.avatarHarf}>B</Text>
              </View>
              <TouchableOpacity style={styles.avatarDuzenle}>
                <Ionicons name="camera" size={13} color={C.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.kullaniciAdi}>Bahar Erol</Text>
            <Text style={styles.kullaniciTagline}>SmartDrop Üyesi · 2 yıldır aktif</Text>
          </View>
        </View>

        {/* ── BODY ──────────────────────────────────────────────────── */}
        <View style={styles.body}>

          {/* ── İSTATİSTİK KARTI ────────────────────────────────────── */}
          <View style={styles.istatistikKutusu}>
            <View style={styles.istatistikItem}>
              <Text style={styles.istatistikSayi}>24</Text>
              <Text style={styles.istatistikEtiket}>Anlaşma</Text>
            </View>
            <View style={styles.istatistikAyirici} />
            <View style={styles.istatistikItem}>
              <Text style={[styles.istatistikSayi, { color: C.success }]}>1.450 ₺</Text>
              <Text style={styles.istatistikEtiket}>Pazar Kârı</Text>
            </View>
            <View style={styles.istatistikAyirici} />
            <View style={styles.istatistikItem}>
              <Text style={[styles.istatistikSayi, { color: C.warning }]}>4.8</Text>
              <Text style={styles.istatistikEtiket}>Puanım</Text>
            </View>
          </View>

          {/* ── PAZAR ANALİZ KARTI ──────────────────────────────────── */}
          <View style={styles.aiAnalizKart}>
            {/* dekoratif nokta */}
            <View style={styles.analizDot} />

            <View style={styles.aiAnalizBaslikSatir}>
              <View style={styles.aiAsistanRozet}>
                <FontAwesome5 name="robot" size={13} color={C.white} />
                <Text style={styles.aiAsistanMetin}>Pazar Analizi</Text>
              </View>
              <Text style={styles.tarihText}>Bu Ay</Text>
            </View>

            <Text style={styles.analizMetni}>
              Asistanın Pazar, senin adına yaptığı pazarlıklarla bu ay bütçeni tam{" "}
              <Text style={{ fontWeight: "800", color: C.white }}>420 ₺</Text>{" "}
              korudu! Harika gidiyorsun. 🎉
            </Text>

            <View style={styles.miniBarArka}>
              <View style={[styles.miniBarOn, { width: "75%" }]} />
            </View>
            <Text style={styles.miniBarAltyazi}>
              Hedeflenen aylık tasarruf: %75 tamamlandı
            </Text>
          </View>

          {/* ── BAŞARI ROZETLERİ ────────────────────────────────────── */}
          <Text style={styles.bolumBaslik}>Başarılarım</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rozetSeridi}
          >
            {[
              { ikon: "ribbon", renk: C.success, bg: C.successSoft, label: "Sıkı Pazarlıkçı" },
              { ikon: "star", renk: C.warning, bg: C.warningSoft, label: "Güvenilir" },
              { ikon: "flash", renk: C.primary, bg: C.primarySoft, label: "Hızlı Alıcı" },
            ].map((r, i) => (
              <View key={i} style={styles.rozet}>
                <View style={[styles.rozetDaire, { backgroundColor: r.bg }]}>
                  <Ionicons name={r.ikon} size={24} color={r.renk} />
                </View>
                <Text style={styles.rozetMetin}>{r.label}</Text>
              </View>
            ))}
          </ScrollView>

          {/* ── AYARLAR LİSTESİ ─────────────────────────────────────── */}
          <View style={styles.ayarlarKutusu}>
            <AyarSatiri
              ikon="person-outline"
              baslik="Profil Bilgilerim"
              altMetin="Ad, adres, telefon"
              renk={C.primary}
            />
            <AyarSatiri
              ikon="basket-outline"
              baslik="Siparişlerim"
              altMetin="2 aktif kargo bekliyor"
              renk={C.primary}
            />
            <AyarSatiri
              ikon="wallet-outline"
              baslik="Ödeme Yöntemlerim"
              altMetin="Kayıtlı kartlarım"
              renk={C.primary}
            />
            <AyarSatiri
              ikon="notifications-outline"
              baslik="Bildirimler"
              altMetin="Pazarlık mesajları ve uyarılar"
              renk={C.primary}
            />
            <AyarSatiri
              ikon="help-circle-outline"
              baslik="Yardım Al"
              altMetin="Müşteri hizmetleri ve SSS"
              renk={C.primary}
              son
            />
          </View>

          {/* ── ÇIKIŞ BUTONU ────────────────────────────────────────── */}
          <TouchableOpacity style={styles.cikisBtn}>
            <Ionicons name="log-out-outline" size={20} color={C.danger} />
            <Text style={styles.cikisMetin}>Oturumu Kapat</Text>
          </TouchableOpacity>

        </View>

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

// ─── STİLLER ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  ekran: {
    flex: 1,
    backgroundColor: C.bg,
  },
  kaydirma: {
    flexGrow: 1,
  },

  // ── Üst Header ──
  topHeader: {
    backgroundColor: C.primary,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingTop: Platform.OS === "android" ? 16 : 10,
    paddingBottom: 36,
    paddingHorizontal: 20,
    overflow: "hidden",
    position: "relative",
    marginBottom: 22,
  },
  hdCircle1: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.10)",
    top: -50,
    right: -40,
  },
  hdCircle2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: 40,
    right: 80,
  },
  hdCircle3: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.06)",
    bottom: 20,
    left: 30,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.white,
    marginBottom: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLocation: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    marginLeft: 3,
  },
  profileBtnSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },

  // Avatar section
  avatarSection: {
    alignItems: "center",
  },
  avatarKapsayici: {
    position: "relative",
    marginBottom: 14,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  avatarHarf: {
    fontSize: 38,
    fontWeight: "800",
    color: C.primary,
  },
  avatarDuzenle: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.white,
  },
  kullaniciAdi: {
    fontSize: 22,
    fontWeight: "800",
    color: C.white,
    marginBottom: 4,
  },
  kullaniciTagline: {
    fontSize: 13,
    color: "rgba(255,255,255,0.78)",
    fontWeight: "500",
  },

  // ── Body ──
  body: {
    paddingHorizontal: 18,
  },

  // ── İstatistik ──
  istatistikKutusu: {
    flexDirection: "row",
    backgroundColor: C.surface,
    paddingVertical: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 18,
    shadowColor: C.primary,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  istatistikItem: {
    flex: 1,
    alignItems: "center",
  },
  istatistikSayi: {
    fontSize: 19,
    fontWeight: "800",
    color: C.textPrimary,
    marginBottom: 4,
  },
  istatistikEtiket: {
    fontSize: 12,
    color: C.textMuted,
    fontWeight: "600",
  },
  istatistikAyirici: {
    width: 1,
    height: "80%",
    alignSelf: "center",
    backgroundColor: C.border,
  },

  // ── AI Analiz ──
  aiAnalizKart: {
    backgroundColor: C.primary,
    padding: 20,
    borderRadius: 24,
    marginBottom: 22,
    overflow: "hidden",
    position: "relative",
    shadowColor: C.primary,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  analizDot: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -25,
    right: -20,
  },
  aiAnalizBaslikSatir: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  aiAsistanRozet: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.20)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  aiAsistanMetin: {
    fontSize: 12,
    fontWeight: "700",
    color: C.white,
    marginLeft: 6,
  },
  tarihText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
  },
  analizMetni: {
    fontSize: 14,
    color: "rgba(255,255,255,0.92)",
    lineHeight: 22,
    marginBottom: 16,
  },
  miniBarArka: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.20)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  miniBarOn: {
    height: "100%",
    backgroundColor: C.white,
    borderRadius: 4,
  },
  miniBarAltyazi: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "500",
  },

  // ── Rozetler ──
  bolumBaslik: {
    fontSize: 17,
    fontWeight: "800",
    color: C.textPrimary,
    marginBottom: 14,
  },
  rozetSeridi: {
    gap: 12,
    paddingBottom: 8,
    marginBottom: 22,
  },
  rozet: {
    width: 100,
    alignItems: "center",
  },
  rozetDaire: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.border,
  },
  rozetMetin: {
    fontSize: 12,
    fontWeight: "700",
    color: C.textPrimary,
    textAlign: "center",
  },

  // ── Ayarlar ──
  ayarlarKutusu: {
    backgroundColor: C.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
    marginBottom: 22,
    shadowColor: C.primary,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  ayarSatir: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  ayarIkonKutu: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  ayarMetinBlok: {
    flex: 1,
  },
  ayarBaslik: {
    fontSize: 15,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 2,
  },
  ayarAltMetin: {
    fontSize: 12,
    color: C.textMuted,
  },

  // ── Çıkış ──
  cikisBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  cikisMetin: {
    fontSize: 15,
    fontWeight: "700",
    color: C.danger,
    marginLeft: 6,
  },
});
