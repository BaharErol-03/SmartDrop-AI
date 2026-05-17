import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

export default function HomeScreen() {
  const [urunler, setUrunler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hata, setHata] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const veriGetir = async () => {
      try {
        // Flask backend bağlantısı
        const response = await fetch('http://localhost:5000/api/urunler');
        if (!response.ok) throw new Error('Sunucu hatası');
        const data = await response.json();
        setUrunler(data);
        setHata(false);
      } catch (error) {
        console.log("Veri çekme hatası:", error);
        setHata(true);
      } finally {
        setLoading(false);
      }
    };
    veriGetir();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fcf8f8' }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* ── ÜST KULLANICI ALANI (DEĞİŞTİRİLMEDİ) ── */}
        <View style={styles.headerBackground}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity>
              <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.headerWelcome}>Merhaba Bahar! 👋</Text>
              <Text style={styles.headerLocation}>📍 Merkez, Kütahya</Text>
            </View>
            <TouchableOpacity style={styles.avatarCircle}>
              <Ionicons name="person" size={20} color="#C85C5C" />
            </TouchableOpacity>
          </View>

          {/* Arama Barı */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={{ marginRight: 10 }} />
            <TextInput 
              placeholder="Ürün, marka veya kategori ara..." 
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* ── PAZAR ASİSTAN BANNER (DEĞİŞTİRİLMEDİ) ── */}
        <View style={styles.assistantBanner}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.bannerTitle}>Ben Pazar, Asistanın! 🤖</Text>
            <Text style={styles.bannerSubtitle}>Senin yerine pazarlık yapıyorum, en iyi fiyatı buluyorum.</Text>
            <TouchableOpacity style={styles.bannerBtn}>
              <Text style={styles.bannerBtnText}>Başla</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.botIconCircle}>
            <FontAwesome5 name="robot" size={32} color="#C85C5C" />
          </View>
        </View>

        {/* ── DÖRT ANA BUTON (DEĞİŞTİRİLMEDİ) ── */}
        <View style={styles.quickButtonsRow}>
          <View style={styles.quickBtnWrapper}>
            <TouchableOpacity style={[styles.quickBtnCircle, { backgroundColor: '#fdebeb' }]}>
              <Ionicons name="camera" size={22} color="#E57373" />
            </TouchableOpacity>
            <Text style={styles.quickBtnLabel}>Ürün Sat</Text>
          </View>

          <View style={styles.quickBtnWrapper}>
            <TouchableOpacity style={[styles.quickBtnCircle, { backgroundColor: '#fff9e6' }]}>
              <Ionicons name="heart" size={22} color="#FFB74D" />
            </TouchableOpacity>
            <Text style={styles.quickBtnLabel}>Favoriler</Text>
          </View>

          <View style={styles.quickBtnWrapper}>
            <TouchableOpacity style={[styles.quickBtnCircle, { backgroundColor: '#e8f8f5' }]}>
              <Ionicons name="cube" size={22} color="#2ECC71" />
            </TouchableOpacity>
            <Text style={styles.quickBtnLabel}>Dolaplar</Text>
          </View>

          <View style={styles.quickBtnWrapper}>
            <TouchableOpacity style={[styles.quickBtnCircle, { backgroundColor: '#f5eef8' }]}>
              <Ionicons name="grid" size={22} color="#9B59B6" />
            </TouchableOpacity>
            <Text style={styles.quickBtnLabel}>Kategoriler</Text>
          </View>
        </View>

        {/* ── AKTİF PAZARLIKLARIM (DEĞİŞTİRİLMEDİ) ── */}
        <Text style={styles.sectionTitle}>Aktif Pazarlıklarım</Text>
        <View style={styles.pazarlikCard}>
          <View style={styles.pazarlikIconCircle}><Ionicons name="refresh" size={18} color="#FFB74D" /></View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.pazarlikItemTitle}>MacBook Pro M1 (16GB)</Text>
            <Text style={[styles.pazarlikStatus, { color: '#FFB74D' }]}>Pazarlık Sürüyor</Text>
          </View>
          <Text style={styles.pazarlikPrice}>23.500 ₺</Text>
        </View>

        <View style={styles.pazarlikCard}>
          <View style={[styles.pazarlikIconCircle, { backgroundColor: '#e8f8f5' }]}><Ionicons name="checkmark-circle" size={18} color="#2ECC71" /></View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.pazarlikItemTitle}>iPhone 11 64GB</Text>
            <Text style={[styles.pazarlikStatus, { color: '#2ECC71' }]}>Anlaşma Sağlandı!</Text>
          </View>
          <Text style={styles.pazarlikPrice}>980 ₺</Text>
        </View>

        {/* ── YAKININDAKİ ÜRÜNLER ALANI ── */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 10 }}>
          <Text style={styles.sectionTitleNoMargin}>Yakınındaki Ürünler</Text>
          <TouchableOpacity><Text style={{ color: '#C85C5C', fontWeight: 'bold', fontSize: 13 }}>Tümünü Gör</Text></TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.merkez}>
            <ActivityIndicator size="large" color="#C85C5C" />
          </View>
        ) : hata ? (
          <View style={styles.merkez}>
            <Text style={{ color: '#d9534f' }}>Veriler çekilemedi.</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingBottom: 20 }}>
            {urunler.map((item, index) => {
              // Fiyat anahtarını esnek kontrol etme (Büyük/küçük harf uyuşmazlığı çözümü)
              const netFiyat = item.price || item.Price || item.price_string || "";
              const netBaslik = item.title || item.Product_name || "İsimsiz Ürün";
              const netGorsel = item.imgUrl || item.Image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc";
              const netKonum = item.location || item.Address || "Kütahya, Merkez";

              return (
                <View key={item.asin || index} style={styles.productHorizontalCard}>
                  <Image source={{ uri: netGorsel }} style={styles.productImage} />
                  <View style={{ padding: 10, flex: 1, justifyContent: 'space-between' }}>
                    <Text style={styles.productCardTitle} numberOfLines={2}>{netBaslik}</Text>
                    
                    {/* Fiyat alanını dinamik yazdırıyoruz */}
                    <Text style={styles.productCardPrice}>
                      {netFiyat ? `${netFiyat} ₺` : "Fiyat Belirtilmedi"}
                    </Text>
                    
                    <Text style={styles.productCardLocation}>📍 {netKonum}</Text>
                    
                    <TouchableOpacity 
                      style={styles.detayBtn}
                      onPress={() => router.push({
                        pathname: '/modal', 
                        params: { 
                          title: netBaslik,
                          price: netFiyat,
                          imgUrl: netGorsel,
                          location: netKonum
                        }
                      })}
                    >
                      <Text style={styles.detayBtnText}>DETAY</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf8f8' },
  merkez: { padding: 30, justifyContent: 'center', alignItems: 'center' },
  
  // Üst Kırmızı Bölge
  headerBackground: { backgroundColor: '#C85C5C', padding: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, paddingBottom: 20 },
  headerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 15 },
  headerWelcome: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerLocation: { color: '#ffebee', fontSize: 12, opacity: 0.9, marginTop: 2 },
  avatarCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 12, height: 46 },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },

  // Asistan Banner
  assistantBanner: { backgroundColor: '#D97474', margin: 16, borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center' },
  bannerTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  bannerSubtitle: { color: '#fff', fontSize: 12, opacity: 0.9, marginBottom: 12, lineHeight: 16 },
  bannerBtn: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start' },
  bannerBtnText: { color: '#C85C5C', fontWeight: 'bold', fontSize: 13 },
  botIconCircle: { width: 55, height: 55, borderRadius: 27.5, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },

  // Dörtlü Butonlar
  quickButtonsRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10, paddingHorizontal: 8 },
  quickBtnWrapper: { alignItems: 'center' },
  quickBtnCircle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  quickBtnLabel: { fontSize: 12, color: '#555', fontWeight: '500' },

  // Başlıklar
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2d1515', marginLeft: 16, marginTop: 15, marginBottom: 10 },
  sectionTitleNoMargin: { fontSize: 16, fontWeight: 'bold', color: '#2d1515', marginLeft: 16 },

  // Pazarlık Kartları
  pazarlikCard: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 10, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#f0e4e4' },
  pazarlikIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff9e6', alignItems: 'center', justifyContent: 'center' },
  pazarlikItemTitle: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  pazarlikStatus: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  pazarlikPrice: { fontSize: 14, fontWeight: 'bold', color: '#333' },

  // Ürün Listesi (Yatay)
  productHorizontalCard: { width: 170, backgroundColor: '#fff', borderRadius: 16, marginLeft: 16, marginRight: 4, borderWidth: 1, borderColor: '#f0e4e4', overflow: 'hidden' },
  productImage: { width: '100%', height: 100, backgroundColor: '#f5f5f5' },
  productCardTitle: { fontSize: 12, fontWeight: '600', color: '#333', height: 34, lineHeight: 17 },
  productCardPrice: { fontSize: 14, fontWeight: 'bold', color: '#C85C5C', marginVertical: 4 },
  productCardLocation: { fontSize: 10, color: '#999' },
  detayBtn: { backgroundColor: '#C85C5C', borderRadius: 10, paddingVertical: 8, alignItems: 'center', marginTop: 6 },
  detayBtnText: { color: '#fff', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.5 }
});