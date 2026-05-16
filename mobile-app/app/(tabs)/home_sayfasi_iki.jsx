/**
 * SmartDrop AI — HomeScreen.jsx
 * Pinterest tasarımına uyarlanmış Rose/Kırmızı tema
 */

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons, FontAwesome5, Feather } from "@expo/vector-icons";

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
  white: "#ffffff",
  success: "#10b981",
  warning: "#f59e0b",
};

// ─── SAHTE VERİLER ─────────────────────────────────────────────────────
const PAZARLIKLAR = [
  {
    id: "1",
    urun: "MacBook Pro M1 (16GB)",
    durum: "Pazarlık Sürüyor",
    sonTeklif: "23.500 ₺",
    renk: C.warning,
    ikon: "sync",
  },
  {
    id: "2",
    urun: "iPhone 11 64GB",
    durum: "Anlaşma Sağlandı!",
    sonTeklif: "980 ₺",
    renk: C.success,
    ikon: "checkmark-circle",
  },
];

const URUNLER = [
  { id: "101", baslik: "Temiz iPhone 13", fiyat: "18.500 ₺", konum: "Merkez, Kütahya", fotoIkon: "phone-portrait-outline" },
  { id: "102", baslik: "Az Kullanılmış Bisiklet", fiyat: "2.400 ₺", konum: "Merkez, Kütahya", fotoIkon: "bicycle-outline" },
  { id: "103", baslik: "Çalışma Masası", fiyat: "850 ₺", konum: "Tavşanlı, Kütahya", fotoIkon: "desktop-outline" },
  { id: "104", baslik: "AirPods Pro", fiyat: "3.200 ₺", konum: "Merkez, Kütahya", fotoIkon: "headset-outline" },
];

export default function HomeScreen({ setActiveTab }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── ÜST HEADER (kırmızı) ──────────────────────────────────────── */}
        <View style={styles.topHeader}>
          {/* Dekoratif daireler */}
          <View style={styles.hdCircle1} />
          <View style={styles.hdCircle2} />

          <View style={styles.headerInner}>
            <TouchableOpacity style={styles.menuBtn}>
              <Ionicons name="menu" size={24} color={C.white} />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Merhaba Bahar! 👋</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={13} color="rgba(255,255,255,0.85)" />
                <Text style={styles.headerLocation}>Merkez, Kütahya</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => setActiveTab && setActiveTab("Profile")}
            >
              <Ionicons name="person" size={20} color={C.primary} />
            </TouchableOpacity>
          </View>

          {/* Arama Çubuğu — headerin içinde */}
          <View style={styles.searchBar}>
            <Feather name="search" size={18} color={C.textMuted} />
            <Text style={styles.searchText}>Ürün, marka veya kategori ara...</Text>
          </View>
        </View>

        {/* ── İÇERİK ALAN ─────────────────────────────────────────────── */}
        <View style={styles.body}>

          {/* ── AI ASISTAN KARTI (Banner) ──────────────────────────────── */}
          <TouchableOpacity
            style={styles.aiBanner}
            activeOpacity={0.82}
            onPress={() => setActiveTab && setActiveTab("Pazarlik")}
          >
            {/* Dekoratif daireler banner içinde */}
            <View style={styles.bannerDot1} />
            <View style={styles.bannerDot2} />

            <View style={styles.aiBannerLeft}>
              <Text style={styles.aiBannerTitle}>Ben Pazar, Asistanın! 🤖</Text>
              <Text style={styles.aiBannerSub}>
                Senin yerine pazarlık yapıyorum, en iyi fiyatı buluyorum.
              </Text>
              <TouchableOpacity style={styles.aiBannerBtn}>
                <Text style={styles.aiBannerBtnText}>Başla</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.aiBannerIconBox}>
              <FontAwesome5 name="robot" size={40} color={C.white} opacity={0.9} />
            </View>
          </TouchableOpacity>

          {/* ── HIZLI İŞLEMLER (kategori ikonları) ───────────────────── */}
          <View style={styles.quickActions}>
            {[
              { label: "Ürün Sat", icon: "camera", bg: "#fee2e2", color: "#ef4444" },
              { label: "Favoriler", icon: "heart", bg: "#fef3c7", color: "#f59e0b" },
              { label: "Dolaplar", icon: "cube", bg: "#d1fae5", color: "#10b981", tab: "Network" },
              { label: "Kategoriler", icon: "grid", bg: C.primarySoft, color: C.primary },
            ].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.actionBtn}
                onPress={() => item.tab && setActiveTab && setActiveTab(item.tab)}
              >
                <View style={[styles.actionIconWrap, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <Text style={styles.actionText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── AKTİF PAZARLIKLARIM ────────────────────────────────────── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aktif Pazarlıklarım</Text>
          </View>

          {PAZARLIKLAR.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.negotiationCard}
              onPress={() => setActiveTab && setActiveTab("Pazarlik")}
              activeOpacity={0.75}
            >
              <View style={[styles.negIcon, { backgroundColor: `${item.renk}18` }]}>
                <Ionicons name={item.ikon} size={20} color={item.renk} />
              </View>
              <View style={styles.negInfo}>
                <Text style={styles.negTitle}>{item.urun}</Text>
                <Text style={[styles.negStatus, { color: item.renk }]}>{item.durum}</Text>
              </View>
              <View style={styles.negPriceWrap}>
                <Text style={styles.negPriceLbl}>Son Teklif</Text>
                <Text style={styles.negPrice}>{item.sonTeklif}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* ── YAKININDAKI ÜRÜNLER (2li grid) ───────────────────────── */}
          <View style={[styles.sectionHeader, { marginTop: 8 }]}>
            <Text style={styles.sectionTitle}>Yakınındaki Ürünler</Text>
            <Text style={styles.sectionLink}>Tümünü Gör</Text>
          </View>

          <View style={styles.productGrid}>
            {URUNLER.map((urun) => (
              <TouchableOpacity key={urun.id} style={styles.productCard} activeOpacity={0.8}>
                {/* Fotoğraf placeholder */}
                <View style={styles.productImagePlaceholder}>
                  <Ionicons name={urun.fotoIkon} size={42} color={C.primary} opacity={0.25} />
                </View>
                <View style={styles.productDetails}>
                  <Text style={styles.productTitle} numberOfLines={1}>{urun.baslik}</Text>
                  <Text style={styles.productPrice}>{urun.fiyat}</Text>
                  <Text style={styles.productLocation}>
                    <Ionicons name="location-outline" size={10} color={C.textMuted} /> {urun.konum}
                  </Text>
                  <TouchableOpacity style={styles.moreBtn}>
                    <Text style={styles.moreBtnText}>DETAY</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>

        </View>

        {/* Alt boşluk */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── STİLLER ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flexGrow: 1,
  },

  // ── Üst Kırmızı Header ──
  topHeader: {
    backgroundColor: C.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: Platform.OS === "android" ? 16 : 10,
    paddingBottom: 28,
    paddingHorizontal: 20,
    overflow: "hidden",
    position: "relative",
  },
  hdCircle1: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.10)",
    top: -40,
    right: -30,
  },
  hdCircle2: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: 30,
    right: 60,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  menuBtn: {
    marginRight: 12,
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
    gap: 3,
  },
  headerLocation: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    marginLeft: 3,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Arama çubuğu (header içi) ──
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
  },
  searchText: {
    marginLeft: 10,
    color: C.textMuted,
    fontSize: 14,
  },

  // ── Body ──
  body: {
    paddingHorizontal: 18,
    paddingTop: 22,
  },

  // ── AI Banner ──
  aiBanner: {
    backgroundColor: C.primary,
    borderRadius: 24,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    overflow: "hidden",
    position: "relative",
  },
  bannerDot1: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.10)",
    bottom: -20,
    right: 60,
  },
  bannerDot2: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: -10,
    right: 110,
  },
  aiBannerLeft: {
    flex: 1,
  },
  aiBannerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.white,
    marginBottom: 6,
  },
  aiBannerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 18,
    marginBottom: 14,
  },
  aiBannerBtn: {
    alignSelf: "flex-start",
    backgroundColor: C.white,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 7,
  },
  aiBannerBtnText: {
    color: C.primary,
    fontWeight: "700",
    fontSize: 13,
  },
  aiBannerIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  // ── Hızlı İşlemler ──
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  actionBtn: {
    alignItems: "center",
    width: "22%",
  },
  actionIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 11,
    fontWeight: "600",
    color: C.textPrimary,
    textAlign: "center",
  },

  // ── Başlıklar ──
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.textPrimary,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: "600",
    color: C.primary,
  },

  // ── Pazarlık Kartları ──
  negotiationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    shadowColor: C.primary,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  negIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  negInfo: {
    flex: 1,
  },
  negTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 4,
  },
  negStatus: {
    fontSize: 12,
    fontWeight: "600",
  },
  negPriceWrap: {
    alignItems: "flex-end",
  },
  negPriceLbl: {
    fontSize: 10,
    color: C.textMuted,
    marginBottom: 2,
  },
  negPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: C.textPrimary,
  },

  // ── Ürün Grid ──
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: {
    width: "48%",
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: C.primary,
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  productImagePlaceholder: {
    width: "100%",
    height: 110,
    backgroundColor: C.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  productDetails: {
    padding: 12,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: C.primary,
    marginBottom: 4,
  },
  productLocation: {
    fontSize: 11,
    color: C.textMuted,
    marginBottom: 10,
  },
  moreBtn: {
    backgroundColor: C.primary,
    borderRadius: 8,
    paddingVertical: 5,
    alignItems: "center",
  },
  moreBtnText: {
    color: C.white,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
