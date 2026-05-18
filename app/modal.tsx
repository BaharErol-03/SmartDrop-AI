import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 🔥 Firebase importlarını ekliyoruz (Dosya yolunun kendi projene göre doğru olduğundan emin ol)
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function DetailModal() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // URL'den gelen temel ID'yi alıyoruz (Firebase'den veriyi bu ID ile çekeceğiz)
  const productId = params.productId as string;

  // Firebase'den gelecek veriyi ve yüklenme durumunu tutacağımız state'ler
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Sayfa açıldığında Firebase'den verileri çekiyoruz
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "urunler", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProductData(docSnap.data());
        } else {
          console.log("Ürün bulunamadı!");
        }
      } catch (error) {
        console.error(
          "Firebase'den ürün detayı çekilirken hata oluştu:",
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // ── VERİ BİRLEŞTİRME (Firebase gelene kadar Params'ı göster, gelince Firebase ile ez) ──
  const title =
    productData?.Product_name || (params.title as string) || "İsimsiz Ürün";
  const price = productData?.Price
    ? String(productData.Price)
    : (params.price as string) || "Fiyat Belirtilmedi";
  const imgUrl =
    productData?.Image ||
    (params.imgUrl as string) ||
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc";
  const location =
    productData?.Address || (params.location as string) || "Konum Belirtilmedi";

  // Sabit veya Fallback Alanlar
  const condition =
    productData?.Condition ||
    (params.condition as string) ||
    "İkinci El (Temiz)";
  const sellerName =
    productData?.SellerName || (params.seller as string) || "Kullanıcı";
  const rating = productData?.Rating || (params.rating as string) || "4.5";

  // Açıklama kontrolü
  const fetchedDescription = productData?.Description || productData?.Aciklama;
  const description =
    fetchedDescription ||
    (params.description as string) ||
    `${title} ürünü satıştadır. Ürünün genel durumu temiz ve bakımlı olup, güncel konumu ${location} olarak belirlenmiştir. Fiyat teklifleri, teslimat şartları ve aklınıza takılan tüm detaylar için aşağıdaki "Pazar AI ile Pazarlık Yap" butonunu kullanarak yapay zeka asistanımızla anında görüşmeye ve pazarlığa başlayabilirsiniz.`;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── ÜST BAR ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹ Geri Dön</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ürün Detayları</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── ÜRÜN GÖRSELİ ── */}
        <Image source={{ uri: imgUrl }} style={styles.mainImage} />

        {/* ── DETAY İÇERİK ALANI ── */}
        <View style={styles.detailsContent}>
          {/* Başlık ve Fiyat */}
          <Text style={styles.productTitle}>{title}</Text>
          <Text style={styles.productPrice}>{`${price} ₺`}</Text>

          {/* Konum */}
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.productLocation}>{location}</Text>
          </View>

          <View style={styles.divider} />

          {/* ── ÜRÜN BİLGİLERİ ── */}
          <Text style={styles.sectionTitle}>Ürün Bilgileri</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoBadge}>
              <Text style={styles.badgeIcon}>🏷️</Text>
              <Text style={styles.infoBadgeText}>Durum: {condition}</Text>
            </View>
            <View style={styles.infoBadge}>
              <Text style={styles.badgeIcon}>🛡️</Text>
              <Text style={styles.infoBadgeText}>Güvenli Alışveriş</Text>
            </View>
          </View>

          {/* ── AÇIKLAMA ── */}
          <Text style={styles.sectionTitle}>Açıklama</Text>
          <View style={styles.descriptionBox}>
            {loading ? (
              <ActivityIndicator size="small" color="#C85C5C" />
            ) : (
              <Text style={styles.descriptionText}>{description}</Text>
            )}
          </View>

          <View style={styles.divider} />

          {/* ── SATICI BİLGİSİ ── */}
          <View style={styles.sellerRow}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.sellerName}>{sellerName}</Text>
              <Text
                style={styles.sellerStatus}
              >{`⭐ ${rating} Satıcı Puanı`}</Text>
            </View>
            <TouchableOpacity style={styles.takipEtBtn}>
              <Text style={styles.takipEtText}>Takip Et</Text>
            </TouchableOpacity>
          </View>

          {/* ── PAZAR AI PAZARLIK BUTONU (Yönlendirme Aynen Korundu) ── */}
          <TouchableOpacity
            style={styles.pazarlikActionBtn}
            onPress={() =>
              router.push({
                pathname: "/pazarlik_sayfasi" as any,
                // productId'yi de gönderiyoruz ki AI sohbeti her ürüne göre sıfırlayabilsin ve güncel fiyattan pazarlık yapsın
                params: { productId, title, price, imgUrl, location },
              })
            }
          >
            <Text style={styles.pazarlikActionBtnText}>
              Pazar AI ile Pazarlık Yap
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f8eeee",
  },
  backBtn: { paddingVertical: 4 },
  backBtnText: { color: "#C85C5C", fontSize: 15, fontWeight: "bold" },
  headerTitle: { fontSize: 15, fontWeight: "bold", color: "#2d1515" },
  mainImage: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
    backgroundColor: "#f9f9f9",
  },
  detailsContent: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  productTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
    lineHeight: 22,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#C85C5C",
    marginBottom: 6,
  },
  locationRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  locationIcon: { marginRight: 4, fontSize: 14 },
  productLocation: { fontSize: 12, color: "#777" },
  divider: { height: 1, backgroundColor: "#f5eded", marginVertical: 15 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2d1515",
    marginBottom: 10,
  },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 5 },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fdf3f3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#fcdcdc",
  },
  badgeIcon: { fontSize: 13, marginRight: 4 },
  infoBadgeText: { fontSize: 12, color: "#555", fontWeight: "500" },
  descriptionBox: {
    backgroundColor: "#fafafa",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f3f3f3",
    minHeight: 60,
    justifyContent: "center",
  },
  descriptionText: { fontSize: 13, color: "#555", lineHeight: 20 },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#f0e4e4",
  },
  sellerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fdebeb",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 16 },
  sellerName: { fontSize: 13, fontWeight: "bold", color: "#333" },
  sellerStatus: { fontSize: 11, color: "#777", marginTop: 2 },
  takipEtBtn: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#C85C5C",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  takipEtText: { color: "#C85C5C", fontSize: 11, fontWeight: "bold" },
  pazarlikActionBtn: {
    backgroundColor: "#C85C5C",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  pazarlikActionBtnText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});
