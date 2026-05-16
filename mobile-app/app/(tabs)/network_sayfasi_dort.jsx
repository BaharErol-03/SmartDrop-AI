/**
 * SmartDrop AI — NetworkScreen.jsx
 * Pinterest tasarımına uyarlanmış Rose/Kırmızı tema - Teslimat Dolapları
 */

import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Svg, { Rect, Circle, G, Text as SvgText, Line } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

const { width: W } = Dimensions.get("window");
const MAP_W = W - 40;
const MAP_H = 210;

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
};

// ─── VERİ ─────────────────────────────────────────────────────────────
const FILTRELER = ["Bana En Yakın", "Boş Yer Var", "Sadece 7/24 Açık"];

const DOLAPLAR = [
  { id: "Sera AVM", x: MAP_W * 0.25, y: MAP_H * 0.40, bosYer: 12, renk: C.success },
  { id: "Zafer", x: MAP_W * 0.50, y: MAP_H * 0.72, bosYer: 2, renk: C.warning },
  { id: "DPÜ Kampüs", x: MAP_W * 0.80, y: MAP_H * 0.28, bosYer: 8, renk: C.success },
];

// ─── CİP ─────────────────────────────────────────────────────────────
function Cip({ metin, renk, arkaPlan }) {
  return (
    <View style={[styles.cip, { backgroundColor: arkaPlan, borderColor: `${renk}30` }]}>
      <Text style={[styles.cipMetin, { color: renk }]}>{metin}</Text>
    </View>
  );
}

// ─── HARİTA ───────────────────────────────────────────────────────────
function DolapHaritasi() {
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.haritaKapsayici}>
      {/* Harita Header */}
      <View style={styles.haritaHeader}>
        <Text style={styles.haritaBaslik}>Kütahya İçi Teslimat Noktaları</Text>
        <View style={styles.canliRozet}>
          <Animated.View style={[styles.canliNokta, { opacity: pulseAnim }]} />
          <Text style={styles.canliMetin}>CANLI</Text>
        </View>
      </View>

      {/* SVG Harita */}
      <Svg width={MAP_W} height={MAP_H}>
        {/* Zemin */}
        <Rect x={0} y={0} width={MAP_W} height={MAP_H} fill="#fdf5f5" />
        {/* Hafif grid çizgileri */}
        <Line x1={MAP_W * 0.33} y1={0} x2={MAP_W * 0.33} y2={MAP_H} stroke="#f0dada" strokeWidth={1} />
        <Line x1={MAP_W * 0.66} y1={0} x2={MAP_W * 0.66} y2={MAP_H} stroke="#f0dada" strokeWidth={1} />
        <Line x1={0} y1={MAP_H * 0.5} x2={MAP_W} y2={MAP_H * 0.5} stroke="#f0dada" strokeWidth={1} />

        {/* Kullanıcı konumu */}
        <Circle cx={MAP_W / 2} cy={MAP_H / 2} r={38} fill={C.primary} fillOpacity={0.08} />
        <Circle cx={MAP_W / 2} cy={MAP_H / 2} r={9} fill={C.primary} stroke={C.surface} strokeWidth={2.5} />
        <SvgText
          x={MAP_W / 2}
          y={MAP_H / 2 - 16}
          fontSize={10}
          fontWeight="700"
          fill={C.primary}
          textAnchor="middle"
        >
          Sen Buradasın
        </SvgText>

        {/* Dolap noktaları */}
        {DOLAPLAR.map((d, i) => (
          <G key={i}>
            <Circle cx={d.x} cy={d.y} r={20} fill={d.renk} fillOpacity={0.12} />
            <Circle cx={d.x} cy={d.y} r={9} fill={C.surface} stroke={d.renk} strokeWidth={3} />
            <SvgText
              x={d.x}
              y={d.y + 22}
              fontSize={10}
              fontWeight="700"
              fill={C.textPrimary}
              textAnchor="middle"
            >
              {d.id}
            </SvgText>
          </G>
        ))}
      </Svg>

      {/* Harita alt bilgi */}
      <View style={styles.haritaAlt}>
        <Ionicons name="information-circle" size={15} color={C.textMuted} />
        <Text style={styles.haritaAltBilgi}>
          Haritadaki noktalara tıklayarak yol tarifi alabilirsiniz.
        </Text>
      </View>
    </View>
  );
}

// ─── DETAYLI DOLAP KARTI ───────────────────────────────────────────────
function DetayliDolapKarti() {
  return (
    <View style={[styles.kart, styles.kartVurgulu]}>
      <View style={styles.kartUst}>
        <View style={styles.kartSolBlok}>
          <Text style={styles.kartBaslik}>Sera AVM SmartDrop</Text>
          <Text style={styles.kartAdres}>Eskişehir Karayolu, Merkez · 1.2 km</Text>
          <View style={styles.cipGrup}>
            <Cip metin="24/7 Açık" renk={C.primary} arkaPlan={C.primarySoft} />
            <Cip metin="Güvenlik Kameralı" renk={C.textMuted} arkaPlan="#f5f0f0" />
          </View>
        </View>
        <View style={styles.dolulukKutu}>
          <Text style={[styles.dolulukSayi, { color: C.success }]}>12</Text>
          <Text style={styles.dolulukMetin}>Boş Bölme</Text>
        </View>
      </View>

      <View style={styles.butonSatir}>
        <TouchableOpacity style={styles.yolTarifiBtn}>
          <Ionicons name="navigate" size={16} color={C.white} />
          <Text style={styles.yolTarifiMetin}>Yol Tarifi Al</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secBtn}>
          <Text style={styles.secMetin}>Bu Dolabı Seç</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── DARALTILMIŞ KART ─────────────────────────────────────────────────
function DaraltilmisDolapKarti({ baslik, adres, km, bosYer, renk, arkaPlan }) {
  return (
    <View style={styles.kart}>
      <View style={styles.kartUst}>
        <View style={styles.kartSolBlok}>
          <Text style={styles.kartBaslik}>{baslik}</Text>
          <Text style={styles.kartAdres}>{adres} · {km} km</Text>
        </View>
        <View style={[styles.kucukDolulukKutu, { backgroundColor: arkaPlan }]}>
          <Text style={[styles.kucukDolulukSayi, { color: renk }]}>{bosYer} Boş</Text>
        </View>
      </View>
    </View>
  );
}

// ─── ANA EKRAN ────────────────────────────────────────────────────────
export default function NetworkScreen() {
  const [aktifFiltre, setAktifFiltre] = useState("Bana En Yakın");
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.ekran}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      <ScrollView contentContainerStyle={styles.kaydirma} showsVerticalScrollIndicator={false}>

        {/* ── ÜST HEADER (kırmızı banner) ───────────────────────────── */}
        <View style={styles.topHeader}>
          <View style={styles.hdCircle1} />
          <View style={styles.hdCircle2} />

          <View style={styles.headerRow}>
            <TouchableOpacity>
              <Ionicons name="menu" size={24} color={C.white} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Teslimat Dolapları</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={13} color="rgba(255,255,255,0.85)" />
                <Text style={styles.headerLocation}>Merkez, Kütahya</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.profileBtn}>
              <Ionicons name="person" size={20} color={C.primary} />
            </TouchableOpacity>
          </View>

          {/* Alt açıklama */}
          <Text style={styles.headerSub}>
            Kargolarını güvenle bırakıp alabileceğin akıllı noktalar.
          </Text>
        </View>

        {/* ── BODY ──────────────────────────────────────────────────── */}
        <View style={styles.body}>

          {/* ── FİLTRELER ─────────────────────────────────────────── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtreSatir}
          >
            {FILTRELER.map((f) => {
              const aktif = f === aktifFiltre;
              return (
                <TouchableOpacity
                  key={f}
                  style={[styles.filtreCip, aktif && styles.filtreCipAktif]}
                  onPress={() => setAktifFiltre(f)}
                  activeOpacity={0.8}
                >
                  {aktif && (
                    <View style={styles.filtreDot} />
                  )}
                  <Text style={[styles.filtreCipMetin, aktif && styles.filtreCipMetinAktif]}>
                    {f}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* ── HARİTA ────────────────────────────────────────────── */}
          <DolapHaritasi />

          {/* ── LİSTE BAŞLIĞI ─────────────────────────────────────── */}
          <View style={styles.listeBaslikSatir}>
            <Text style={styles.listeBaslik}>Yakındaki Dolaplar</Text>
            <Text style={styles.listeSectionLink}>Tümünü Gör</Text>
          </View>

          {/* ── DOLAP LİSTESİ ─────────────────────────────────────── */}
          <DetayliDolapKarti />

          <DaraltilmisDolapKarti
            baslik="DPÜ Kampüs SmartDrop"
            adres="Evliya Çelebi Yerleşkesi"
            km="4.5"
            bosYer="8"
            renk={C.success}
            arkaPlan={C.successSoft}
          />

          <DaraltilmisDolapKarti
            baslik="Zafer Meydanı SmartDrop"
            adres="Vazo Heykeli Yanı, Merkez"
            km="0.5"
            bosYer="2"
            renk={C.warning}
            arkaPlan={C.warningSoft}
          />

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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: Platform.OS === "android" ? 16 : 10,
    paddingBottom: 28,
    paddingHorizontal: 20,
    overflow: "hidden",
    position: "relative",
    marginBottom: 22,
  },
  hdCircle1: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(255,255,255,0.10)",
    top: -45,
    right: -30,
  },
  hdCircle2: {
    position: "absolute",
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.07)",
    top: 30,
    right: 70,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
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
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  headerSub: {
    fontSize: 13,
    color: "rgba(255,255,255,0.82)",
    textAlign: "center",
    lineHeight: 19,
  },

  // ── Body ──
  body: {
    paddingHorizontal: 18,
  },

  // ── Filtreler ──
  filtreSatir: {
    gap: 10,
    paddingBottom: 8,
    marginBottom: 18,
  },
  filtreCip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
    gap: 6,
  },
  filtreCipAktif: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  filtreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.white,
  },
  filtreCipMetin: {
    fontSize: 13,
    color: C.textMuted,
    fontWeight: "600",
  },
  filtreCipMetinAktif: {
    color: C.white,
    fontWeight: "700",
  },

  // ── Harita ──
  haritaKapsayici: {
    backgroundColor: C.surface,
    borderRadius: 24,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
    shadowColor: C.primary,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  haritaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  haritaBaslik: {
    fontSize: 14,
    fontWeight: "700",
    color: C.textPrimary,
  },
  canliRozet: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.successSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  canliNokta: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: C.success,
  },
  canliMetin: {
    fontSize: 10,
    fontWeight: "800",
    color: C.success,
    marginLeft: 4,
  },
  haritaAlt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.primarySoft,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  haritaAltBilgi: {
    fontSize: 11,
    color: C.textMuted,
    fontWeight: "500",
    marginLeft: 6,
    flex: 1,
  },

  // ── Liste Başlığı ──
  listeBaslikSatir: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  listeBaslik: {
    fontSize: 17,
    fontWeight: "800",
    color: C.textPrimary,
  },
  listeSectionLink: {
    fontSize: 13,
    fontWeight: "600",
    color: C.primary,
  },

  // ── Kart ──
  kart: {
    backgroundColor: C.surface,
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.primary,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  kartVurgulu: {
    borderColor: C.primary,
    borderWidth: 2,
  },
  kartUst: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  kartSolBlok: {
    flex: 1,
    marginRight: 14,
  },
  kartBaslik: {
    fontSize: 15,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 4,
  },
  kartAdres: {
    fontSize: 12,
    color: C.textMuted,
    marginBottom: 12,
  },
  cipGrup: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  cip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  cipMetin: {
    fontSize: 11,
    fontWeight: "700",
  },

  dolulukKutu: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.successSoft,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  dolulukSayi: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 2,
  },
  dolulukMetin: {
    fontSize: 10,
    color: C.success,
    fontWeight: "600",
  },

  kucukDolulukKutu: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  kucukDolulukSayi: {
    fontSize: 13,
    fontWeight: "800",
  },

  butonSatir: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  yolTarifiBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.primary,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  yolTarifiMetin: {
    color: C.white,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },
  secBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.primarySoft,
    paddingVertical: 12,
    borderRadius: 14,
  },
  secMetin: {
    color: C.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
