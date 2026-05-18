/**
 * SmartDrop AI — siparislerim.jsx
 * Gerçek kullanıcı oturumu ile çalışan güncel sürüm
 */

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { auth, db } from "../../firebaseConfig";

export default function SiparislerimSayfasi() {
  const router = useRouter();
  const [siparisler, setSiparisler] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sayfa her ekrana geldiğinde (odaklandığında) tetiklenecek yapı
  useFocusEffect(
    useCallback(() => {
      const siparisleriGetir = async () => {
        try {
          setLoading(true);
          const currentUser = auth.currentUser;

          // ✅ GÜNCELLENDİ: Gerçek giriş yoksa listeyi boş getir (Test hesabı iptal edildi)
          if (!currentUser) {
            setSiparisler([]);
            setLoading(false);
            return;
          }

          const userId = currentUser.uid;

          const q = query(
            collection(db, "siparisler"),
            where("kullaniciId", "==", userId),
          );

          const querySnapshot = await getDocs(q);
          const liste = [];
          querySnapshot.forEach((doc) => {
            liste.push({ id: doc.id, ...doc.data() });
          });

          setSiparisler(liste);
        } catch (error) {
          console.error("Siparişler çekilemedi:", error);
        } finally {
          setLoading(false);
        }
      };

      siparisleriGetir();

      return () => {};
    }, []),
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.gorsel || "https://via.placeholder.com/100" }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {item.urunAdi}
        </Text>
        <Text style={styles.price}>
          Anlaşılan Fiyat: {item.anlasilanFiyat} ₺
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{item.durum}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Giriş ekranına gitmemesi için doğrudan ana sayfaya yönlendiriyoruz */}
        <TouchableOpacity
          onPress={() => router.push("/home_sayfasi_iki")}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#2d1515" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Siparişlerim</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#C85C5C" />
        </View>
      ) : siparisler.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="basket-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>
            Henüz bir siparişiniz bulunmuyor.
          </Text>
        </View>
      ) : (
        <FlatList
          data={siparisler}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf8f8" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 40,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#f2dede",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#2d1515" },
  backBtn: { padding: 4 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { marginTop: 10, color: "#9e7272", fontSize: 14 },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f2dede",
  },
  image: { width: 70, height: 70, borderRadius: 8, backgroundColor: "#fcdada" },
  info: { flex: 1, marginLeft: 12, justifyContent: "center" },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2d1515",
    marginBottom: 4,
  },
  price: { fontSize: 14, color: "#C85C5C", fontWeight: "600", marginBottom: 6 },
  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#e6fbf4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: { fontSize: 11, color: "#10b981", fontWeight: "bold" },
});
