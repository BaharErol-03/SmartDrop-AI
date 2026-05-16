/**
 * SmartDrop AI — RoutePlannerScreen.jsx (Kargo Takibi)
 * Pinterest tasarımına uyarlanmış Rose/Kırmızı tema
 */

import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
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
  warning: "#f59e0b",
};

const { width: W } = Dimensions.get("window");

// ─── CANLI NABIZ ANİMASYONU ────────────────────────────────────────────
function PulseDot({ color = C.primary, size = 12 }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.6, duration: 1000, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.25, duration: 1000, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity,
          transform: [{ scale }],
        }}
      />
      <View style={{
        position: "absolute",
        width: size / 2,
        height: size / 2,
        borderRadius: size / 4,
        backgroundColor: color,
      }} />
    </View>
  );
}

// ─── TİMELİNE ITEM ────────────────────────────────────────────────────
function TimelineItem({ title, subtitle, time, isActive, isLast, isCompleted }) {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[
          styles.timelineDot,
          isCompleted
            ? { backgroundColor: C.primary, borderColor: C.primary }
            : isActive
            ? { backgroundColor: C.surface, borderColor: C.primary, borderWidth: 3 }
            : { backgroundColor: C.surface, borderColor: C.textDim, borderWidth: 2 },
        ]}>
          {isCompleted && <Ionicons name="checkmark" size={10} color={C.white} />}
        </View>
        {!isLast && (
          <View style={[styles.timelineLine, isCompleted && { backgroundColor: C.primary }]} />
        )}
      </View>

      <View style={styles.timelineContent}>
        <View style={styles.timelineTextWrap}>
          <Text style={[styles.timelineTitle, (isActive || isCompleted) && { color: C.textPrimary }]}>
            {title}
          </Text>
          <Text style={styles.timelineSub}>{subtitle}</Text>
        </View>
        <Text style={[styles.timelineTime, isActive && { color: C.primary, fontWeight: "700" }]}>
          {time}
        </Text>
      </View>
    </View>
  );
}

// ─── ANA EKRAN ────────────────────────────────────────────────────────
export default function KargoTakipScreen() {
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.primary} />

      <Animated.View style={{ flex: 1, opacity: fade }}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* ── ÜST HEADER (kırmızı banner) ───────────────────────────── */}
          <View style={styles.topHeader}>
            <View style={styles.hdCircle1} />
            <View style={styles.hdCircle2} />

            <View style={styles.headerRow}>
              <TouchableOpacity>
                <Ionicons name="menu" size={24} color={C.white} />
              </TouchableOpacity>
              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>Sipariş Takibi</Text>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={13} color="rgba(255,255,255,0.85)" />
                  <Text style={styles.headerLocation}>Merkez, Kütahya</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.profileBtn}>
                <Ionicons name="person" size={20} color={C.primary} />
              </TouchableOpacity>
            </View>

            {/* Sipariş no etiketi */}
            <View style={styles.orderBadge}>
              <Ionicons name="cube-outline" size={14} color={C.white} />
              <Text style={styles.orderBadgeText}>Sipariş No: #SD-9824</Text>
            </View>
          </View>

          {/* ── BODY ──────────────────────────────────────────────────── */}
          <View style={styles.body}>

            {/* ── HARİTA KARTI ────────────────────────────────────────── */}
            <View style={styles.mapCard}>
              {/* Sahte harita arka planı */}
              <View style={styles.mapBackground}>
                {/* Grid çizgileri efekti */}
                <View style={styles.mapGrid} />
                <Ionicons name="map-outline" size={110} color={C.border} style={{ opacity: 0.6 }} />

                {/* Rota çizgisi */}
                <View style={styles.mapRouteLine} />

                {/* Kurye marker */}
                <View style={[styles.mapMarker, { top: 36, left: "18%" }]}>
                  <View style={styles.courierMarkerBubble}>
                    <FontAwesome5 name="shipping-fast" size={13} color={C.white} />
                  </View>
                  <PulseDot color={C.primary} size={20} />
                </View>

                {/* Ev marker */}
                <View style={[styles.mapMarker, { bottom: 28, right: "18%" }]}>
                  <View style={styles.homeMarkerBubble}>
                    <Ionicons name="home" size={14} color={C.primary} />
                  </View>
                  <Text style={styles.mapHomeLabel}>Bahar ın Evi</Text>
                </View>
              </View>

              {/* Alt bilgi barı */}
              <View style={styles.mapInfoBar}>
                <View style={styles.mapInfoItem}>
                  <Ionicons name="time-outline" size={16} color={C.primary} />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.mapInfoLabel}>Teslimat Süresi</Text>
                    <Text style={styles.mapInfoValue}>20 dk - 3 saat</Text>
                  </View>
                </View>
                <View style={styles.mapInfoDivider} />
                <View style={styles.mapInfoItem}>
                  <Ionicons name="location-outline" size={16} color={C.primary} />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={styles.mapInfoLabel}>Olivia Wilson!</Text>
                    <Text style={styles.mapInfoValue}>Vijay Nagar</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.feedbackBtn}>
                  <Text style={styles.feedbackBtnText}>Feedback</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── KURYE BİLGİ KARTI ────────────────────────────────────── */}
            <View style={styles.courierCard}>
              <View style={styles.courierAvatar}>
                <Text style={styles.courierAvatarText}>AY</Text>
              </View>
              <View style={styles.courierInfo}>
                <Text style={styles.courierName}>Ahmet Yılmaz</Text>
                <View style={styles.courierRatingRow}>
                  <Ionicons name="star" size={12} color={C.warning} />
                  <Text style={styles.courierRatingText}>4.9 (120 Teslimat)</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.callBtn}>
                <Ionicons name="call" size={19} color={C.white} />
              </TouchableOpacity>
            </View>

            {/* ── AI BİLGİ BANNER ─────────────────────────────────────── */}
            <View style={styles.aiInfoBanner}>
              <View style={styles.aiBannerDot1} />
              <Ionicons name="flash" size={18} color={C.white} style={{ marginRight: 10 }} />
              <Text style={styles.aiInfoText}>
                Trafik açık. Kargonuzun{" "}
                <Text style={{ fontWeight: "800" }}>14:30 da</Text>{" "}
                ulaşması bekleniyor.
              </Text>
            </View>

            {/* ── TESLİMAT AŞAMALARI ──────────────────────────────────── */}
            <View style={styles.timelineCard}>
              <Text style={styles.timelineHeader}>Teslimat Durumu</Text>

              <TimelineItem
                title="Sipariş Onaylandı"
                subtitle="Satıcı teklifinizi kabul etti."
                time="Dün 10:15"
                isCompleted
              />
              <TimelineItem
                title="Kargoya Verildi"
                subtitle="Ürün kargo şubesine teslim edildi."
                time="Dün 16:45"
                isCompleted
              />
              <TimelineItem
                title="Dağıtıma Çıktı"
                subtitle="Kurye Kütahya Merkez bölgesinde dağıtımda."
                time="Bugün 09:30"
                isActive
              />
              <TimelineItem
                title="Teslim Edilecek"
                subtitle="Adresinize ulaştırılacak."
                time="Bekleniyor"
                isLast
              />
            </View>

          </View>

          <View style={{ height: 110 }} />
        </ScrollView>
      </Animated.View>
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
    marginBottom: 16,
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
  orderBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    gap: 6,
  },
  orderBadgeText: {
    color: C.white,
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 6,
  },

  // ── Body ──
  body: {
    paddingHorizontal: 18,
  },

  // ── Harita Kartı ──
  mapCard: {
    backgroundColor: C.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
    marginBottom: 18,
    shadowColor: C.primary,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  mapBackground: {
    height: 190,
    backgroundColor: "#fdf5f5",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  mapGrid: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    opacity: 0.04,
    backgroundColor: C.primary,
  },
  mapRouteLine: {
    position: "absolute",
    top: 48,
    left: "22%",
    right: "22%",
    bottom: 38,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderColor: C.primary,
    borderStyle: "dashed",
    borderBottomLeftRadius: 30,
    opacity: 0.35,
  },
  mapMarker: {
    position: "absolute",
    alignItems: "center",
  },
  courierMarkerBubble: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 10,
    top: -8,
    shadowColor: C.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  homeMarkerBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.white,
    borderWidth: 2,
    borderColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  mapHomeLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: C.textPrimary,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  mapInfoBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  mapInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  mapInfoLabel: {
    fontSize: 11,
    color: C.textMuted,
  },
  mapInfoValue: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textPrimary,
  },
  mapInfoDivider: {
    width: 1,
    height: 32,
    backgroundColor: C.border,
    marginHorizontal: 12,
  },
  feedbackBtn: {
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  feedbackBtnText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "700",
  },

  // ── Kurye Kartı ──
  courierCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 16,
    shadowColor: C.primary,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  courierAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: C.border,
  },
  courierAvatarText: {
    fontSize: 15,
    fontWeight: "800",
    color: C.primary,
  },
  courierInfo: {
    flex: 1,
  },
  courierName: {
    fontSize: 15,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 4,
  },
  courierRatingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  courierRatingText: {
    fontSize: 12,
    color: C.textMuted,
    marginLeft: 4,
    fontWeight: "500",
  },
  callBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.success,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── AI Bilgi Banner ──
  aiInfoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 18,
    overflow: "hidden",
    position: "relative",
  },
  aiBannerDot1: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.08)",
    right: -15,
    top: -15,
  },
  aiInfoText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.92)",
    flex: 1,
    lineHeight: 19,
  },

  // ── Timeline ──
  timelineCard: {
    backgroundColor: C.surface,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.primary,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  timelineHeader: {
    fontSize: 16,
    fontWeight: "800",
    color: C.textPrimary,
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: "row",
    minHeight: 60,
  },
  timelineLeft: {
    alignItems: "center",
    width: 24,
    marginRight: 14,
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: C.border,
    marginTop: -2,
    marginBottom: -2,
  },
  timelineContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 24,
  },
  timelineTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.textMuted,
    marginBottom: 4,
  },
  timelineSub: {
    fontSize: 12,
    color: C.textMuted,
    lineHeight: 17,
  },
  timelineTime: {
    fontSize: 11,
    fontWeight: "600",
    color: C.textMuted,
  },
});
