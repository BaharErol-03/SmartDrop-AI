// app/ayarlar.jsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { Alert, Platform, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../firebaseConfig";

const showAlert = (title, message, buttons) => {
  if (Platform.OS === 'web') {
    const result = window.confirm(`${title}\n${message}`);
    if (result && buttons && buttons[1]?.onPress) buttons[1].onPress();
  } else {
    Alert.alert(title, message, buttons);
  }
};

export default function AyarlarEkran() {
  const router = useRouter();
  const [bildirimler, setBildirimler] = useState(true);
  const [pazarlikBildirimi, setPazarlikBildirimi] = useState(true);

  const handleCikis = () => {
    showAlert(
      "Çıkış Yap",
      "Hesabınızdan çıkmak istediğinize emin misiniz?",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Çıkış Yap",
          style: "destructive",
          onPress: async () => {
            await signOut(auth);
            router.replace("/login_sayfasi_bir");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#C85C5C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Bildirimler */}
      <Text style={styles.sectionLabel}>Bildirimler</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="notifications-outline" size={20} color="#C85C5C" />
            <Text style={styles.rowText}>Tüm Bildirimler</Text>
          </View>
          <Switch
            value={bildirimler}
            onValueChange={setBildirimler}
            trackColor={{ false: "#F0DADA", true: "#C85C5C" }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="pricetag-outline" size={20} color="#C85C5C" />
            <Text style={styles.rowText}>Pazarlık Bildirimleri</Text>
          </View>
          <Switch
            value={pazarlikBildirimi}
            onValueChange={setPazarlikBildirimi}
            trackColor={{ false: "#F0DADA", true: "#C85C5C" }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Hesap */}
      <Text style={styles.sectionLabel}>Hesap</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.row} onPress={() => router.push("/profil_duzenle")}>
          <View style={styles.rowLeft}>
            <Ionicons name="person-outline" size={20} color="#C85C5C" />
            <Text style={styles.rowText}>Profili Düzenle</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9e7272" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row} onPress={handleCikis}>
          <View style={styles.rowLeft}>
            <Ionicons name="log-out-outline" size={20} color="#C85C5C" />
            <Text style={[styles.rowText, { color: "#C85C5C" }]}>Çıkış Yap</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9e7272" />
        </TouchableOpacity>
      </View>

      {/* Uygulama Hakkında */}
      <Text style={styles.sectionLabel}>Uygulama</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="information-circle-outline" size={20} color="#C85C5C" />
            <Text style={styles.rowText}>Versiyon</Text>
          </View>
          <Text style={styles.versionText}>1.0.0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF4F4", paddingTop: 56 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#FFF0F0", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#2D1515" },
  sectionLabel: { fontSize: 12, fontWeight: "800", color: "#C85C5C", letterSpacing: 0.8, textTransform: "uppercase", marginHorizontal: 20, marginTop: 20, marginBottom: 8 },
  card: { backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 16, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16 },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowText: { fontSize: 15, fontWeight: "600", color: "#2D1515" },
  divider: { height: 1, backgroundColor: "#FFF0F0", marginHorizontal: 16 },
  versionText: { fontSize: 14, color: "#9e7272", fontWeight: "600" },
});