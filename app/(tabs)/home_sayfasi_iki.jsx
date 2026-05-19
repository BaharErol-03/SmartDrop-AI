import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebaseConfig"; // Kendi proje yoluna göre kontrol etmeyi unutma

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const [isExpanded, setIsExpanded] = useState(false);
  const [urunler, setUrunler] = useState([]);
  const [pazarliklar, setPazarliklar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [userData, setUserData] = useState({
    isim: "Kullanıcı",
    ilce: "Merkez",
    sehir: "Kütahya",
  });

  useEffect(() => {
    const verileriGetir = async () => {
      try {
        setLoading(true);

        const urunlerRef = collection(db, "urunler");
        const urunlerSnapshot = await getDocs(urunlerRef);
        const urunListesi = [];
        urunlerSnapshot.forEach((doc) => {
          urunListesi.push({ id: doc.id, ...doc.data() });
        });
        setUrunler(urunListesi);

        const pazarliklarRef = collection(db, "bot_pazarliklar");
        const pazarliklarSnapshot = await getDocs(pazarliklarRef);
        const pazarlikListesi = [];
        pazarliklarSnapshot.forEach((doc) => {
          pazarlikListesi.push({ id: doc.id, ...doc.data() });
        });
        setPazarliklar(pazarlikListesi);

        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDocRef = doc(db, "kullanicilar", currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const dbData = userDocSnapshot.data();
            setUserData({
              isim: dbData.isim || "Kullanıcı",
              ilce: dbData.ilce || "Merkez",
              sehir: dbData.sehir || "Kütahya",
            });
          }
        }
      } catch (error) {
        console.error("Veri çekilirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    verileriGetir();
  }, []);

  const filtrelenmisUrunler = urunler.filter((item) => {
    if (!item) return false;
    const urunAdi = item.Product_name
      ? String(item.Product_name).toLowerCase()
      : "";
    const adres = item.Address ? String(item.Address).toLowerCase() : "";
    const arananKelime = searchText.toLowerCase();
    return urunAdi.includes(arananKelime) || adres.includes(arananKelime);
  });

  const gosterilecekUrunler =
    searchText.length > 0
      ? filtrelenmisUrunler
      : isExpanded
        ? filtrelenmisUrunler
        : filtrelenmisUrunler.slice(0, 8);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C85C5C" />
        <Text style={{ marginTop: 10, color: "#9e7272" }}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ── ÜST HEADER ── */}
      <View style={styles.headerBackgroundSection}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Ionicons name="menu-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.welcomeText}>Merhaba {userData.isim}! 👋</Text>
            <Text style={styles.locationText}>
             
            </Text>
          </View>
          <TouchableOpacity
            style={styles.profileCircle}
            onPress={() => router.push("/profil_sayfasi_bes")}
          >
            <Ionicons name="person" size={20} color="#C85C5C" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#9e7272"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Ürün, marka veya kategori ara..."
            placeholderTextColor="#9e7272"
            style={styles.searchInput}
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Ionicons name="close-circle" size={18} color="#9e7272" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── YAKININDAKİ ÜRÜNLER ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Yakınındaki Ürünler</Text>
        <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
          <Text style={styles.seeAllTxt}>
            {isExpanded ? "Daha Az Gör" : "Tümünü Gör"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        {gosterilecekUrunler.length === 0 ? (
          <Text style={styles.emptyText}>Ürün bulunamadı.</Text>
        ) : (
          gosterilecekUrunler.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <Image
                source={{
                  uri: item.Image || "https://via.placeholder.com/150",
                }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.Product_name || "Ürün Adı"}
                </Text>
                <Text style={styles.productPriceMain}>
                  {item.Price || "0"} ₺
                </Text>
                <Text style={styles.productLocation} numberOfLines={1}>
                  📍 {item.Address || "Konum"}
                </Text>

                {/* ✅ GÜNCELLENEN KISIM: modal.tsx (Detay Sayfası) Yönlendirmesi */}
                <TouchableOpacity
                  style={styles.detayBtn}
                  onPress={() => {
                    router.push({
                      pathname: "/modal",
                      params: {
                        productId: item.id,
                        title: item.Product_name || "İsimsiz Ürün",
                        price: String(item.Price || "0"),
                        imgUrl: item.Image || "",
                        location: item.Address || "Konum Belirtilmemiş",
                      },
                    });
                  }}
                >
                  <Text style={styles.detayBtnTxt}>DETAY</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdf8f8" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdf8f8",
  },
  headerBackgroundSection: {
    backgroundColor: "#B24B4B",
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitleContainer: { alignItems: "center" },
  welcomeText: { fontSize: 18, fontWeight: "800", color: "#ffffff" },
  locationText: {
    fontSize: 11,
    color: "#fcdada",
    marginTop: 2,
    fontWeight: "600",
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: { flex: 1, color: "#2d1515", fontSize: 14 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2d1515",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
  },
  seeAllTxt: { color: "#C85C5C", fontSize: 12, fontWeight: "700" },
  emptyText: {
    color: "#9e7272",
    fontSize: 13,
    fontStyle: "italic",
    paddingHorizontal: 16,
  },
  pazarlikCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f0dada",
  },
  pazarlikLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  pazarlikIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e6fbf4",
    justifyContent: "center",
    alignItems: "center",
  },
  pazarlikUrunName: { fontSize: 14, fontWeight: "700", color: "#2d1515" },
  pazarlikStatus: {
    fontSize: 11,
    color: "#10b981",
    fontWeight: "600",
    marginTop: 2,
  },
  pazarlikLabel: { fontSize: 9, color: "#9e7272" },
  pazarlikPrice: { fontSize: 15, fontWeight: "800", color: "#2d1515" },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  productCard: {
    backgroundColor: "#ffffff",
    width: "48%",
    borderRadius: 20,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f2dede",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  productImage: { width: "100%", height: 120, backgroundColor: "#fcdada" },
  productInfo: { padding: 12 },
  productName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2d1515",
    marginBottom: 4,
  },
  productPriceMain: {
    fontSize: 14,
    fontWeight: "800",
    color: "#C85C5C",
    marginBottom: 4,
  },
  productLocation: { fontSize: 10, color: "#9e7272", marginBottom: 8 },
  detayBtn: {
    backgroundColor: "#C85C5C",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  detayBtnTxt: { color: "#ffffff", fontSize: 11, fontWeight: "700" },
});
