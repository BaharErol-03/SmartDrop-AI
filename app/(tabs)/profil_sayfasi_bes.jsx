import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfilIslemleriEkran() {
  const router = useRouter();

  const butonTetikle = (butonismi, rota) => {
    if (rota) {
      router.push(rota);
    } else {
      Alert.alert(
        "Simülasyon Aktif",
        `"${butonismi}" ekranı şu an demo modundadır. Hackathon sunumu için koltuk pazarlık fonksiyonlarını inceleyebilirsiniz.`,
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 20, paddingTop: 60 }}>
        <Text style={styles.pageTitle}>Profil İşlemleri</Text>

        {/* ── BUTON GRID ALANI ── */}
        {/* ✅ flexDirection: 'row' + justifyContent: 'space-evenly' */}
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => butonTetikle("Profil Düzenle")}
          >
            {/* ✅ İkon boyutu 24 → 32 */}
            <Ionicons name="person-outline" size={32} color="#C85C5C" />
            <Text style={styles.actionText}>Profil Düzenle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => butonTetikle("Ayarlar")}
          >
            <Ionicons name="settings-outline" size={32} color="#C85C5C" />
            <Text style={styles.actionText}>Ayarlar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => butonTetikle("Yardım")}
          >
            <Ionicons name="help-circle-outline" size={32} color="#C85C5C" />
            <Text style={styles.actionText}>Yardım</Text>
          </TouchableOpacity>
        </View>

        {/* ── AKTİF PAZARLIKLAR ALANI ── */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Devam Eden Pazarlıklarım</Text>

          {/* ✅ Card görünümü: shadow, borderRadius, padding */}
          <View style={styles.pazarlikCard}>
            <View style={styles.pazarlikLeft}>
              <View
                style={[styles.statusIndicator, { backgroundColor: "#FF9F43" }]}
              />
              <View>
                <Text style={styles.pazarlikBaslik}>Sofa bed (Örnek)</Text>
                <Text style={styles.pazarlikAlt}>Pazar AI devrede</Text>
              </View>
            </View>
            <Text style={styles.pazarlikFiyat}>3.000 ₺</Text>
          </View>

          <View style={styles.pazarlikCard}>
            <View style={styles.pazarlikLeft}>
              <View
                style={[styles.statusIndicator, { backgroundColor: "#4ade80" }]}
              />
              <View>
                <Text style={styles.pazarlikBaslik}>Bisiklet (Örnek)</Text>
                <Text style={styles.pazarlikAlt}>Teklif bekleniyor</Text>
              </View>
            </View>
            <Text style={styles.pazarlikFiyat}>1.500 ₺</Text>
          </View>

          <View style={styles.pazarlikCard}>
            <View style={styles.pazarlikLeft}>
              <View
                style={[styles.statusIndicator, { backgroundColor: "#C85C5C" }]}
              />
              <View>
                <Text style={styles.pazarlikBaslik}>
                  Laptop Çantası (Örnek)
                </Text>
                <Text style={styles.pazarlikAlt}>Son teklif iletildi</Text>
              </View>
            </View>
            <Text style={styles.pazarlikFiyat}>450 ₺</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF4F4",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
    color: "#2D1515",
  },

  // ✅ flexDirection row + space-evenly
  actionGrid: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  actionCard: {
    alignItems: "center",
    justifyContent: "center",
    width: "28%",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A3B3B",
    textAlign: "center",
    marginTop: 8,
  },

  sectionContainer: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D1515",
    marginBottom: 12,
  },

  // ✅ Card görünümü: shadow + borderRadius + padding
  pazarlikCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  pazarlikLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  pazarlikBaslik: {
    fontWeight: "700",
    color: "#2D1515",
    fontSize: 14,
    marginBottom: 2,
  },
  pazarlikAlt: {
    fontSize: 12,
    color: "#9e7272",
  },
  pazarlikFiyat: {
    fontWeight: "800",
    color: "#C85C5C",
    fontSize: 15,
  },
});
