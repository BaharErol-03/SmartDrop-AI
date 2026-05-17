import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function DetailModal() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // ── DATASETTEN GELEN GERÇEK VERİLERİ YAKALAMA ──
  const title = params.title || "İsimsiz Ürün";
  const price = params.price || "Fiyat Belirtilmedi";
  const imgUrl = params.imgUrl || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc";
  const location = params.location || "Konum Belirtilmedi";
  
  // Datasetteki alan adlarına göre güvenli okuma:
  const description = params.description || params.Description || params.desc || "Bu ürün için detaylı bir açıklama belirtilmemiş.";
  const condition = params.condition || params.Condition || "İkinci El";
  const sellerName = params.seller || params.Seller || params.username || "Kullanıcı";
  const rating = params.rating || params.Rating || "4.5";

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
          
          {/* Başlık ve Fiyat (Hata veren string birleştirme düzeltildi) */}
          <Text style={styles.productTitle}>{title}</Text>
          <Text style={styles.productPrice}>{price} ₺</Text>
          
          {/* Konum */}
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="#C85C5C" style={{ marginRight: 4 }} />
            <Text style={styles.productLocation}>{location}</Text>
          </View>
          
          <View style={styles.divider} />

          {/* ── DATASETTEN GELEN ÜRÜN BİLGİLERİ ── */}
          <Text style={styles.sectionTitle}>Ürün Bilgileri</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoBadge}>
              <MaterialCommunityIcons name="tag-outline" size={16} color="#C85C5C" />
              <Text style={styles.infoBadgeText}>Durum: {condition}</Text>
            </View>
          </View>

          {/* ── DATASETTEN GELEN GERÇEK AÇIKLAMA ── */}
          <Text style={styles.sectionTitle}>Açıklama</Text>
          <Text style={styles.descriptionText}>{description}</Text>

          <View style={styles.divider} />

          {/* ── DATASETTEN GELEN SATICI BİLGİSİ ── */}
          <View style={styles.sellerRow}>
            <View style={styles.sellerAvatar}>
              <Ionicons name="person" size={20} color="#C85C5C" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.sellerName}>{sellerName}</Text>
              <Text style={styles.sellerStatus}>🌟 {rating} Satıcı Puanı</Text>
            </View>
            <TouchableOpacity style={styles.takipEtBtn}>
              <Text style={styles.takipEtText}>Takip Et</Text>
            </TouchableOpacity>
          </View>

          {/* ── PAZAR AI PAZARLIK BUTONU ── */}
          <TouchableOpacity 
            style={styles.pazarlikActionBtn}
            onPress={() => router.push({
              pathname: '/pazarlik_sayfasi',
              params: { 
                title: title, 
                price: price, 
                imgUrl: imgUrl 
              }
            })}
          >
            <Text style={styles.pazarlikActionBtnText}>Pazar AI ile Pazarlık Yap</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backBtn: { paddingVertical: 4 },
  backBtnText: { color: '#C85C5C', fontSize: 16, fontWeight: 'bold' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#2d1515' },
  mainImage: { width: '100%', height: 260, resizeMode: 'cover', backgroundColor: '#f9f9f9' },
  detailsContent: { padding: 20, flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: -20 },
  productTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  productPrice: { fontSize: 22, fontWeight: 'bold', color: '#C85C5C', marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  productLocation: { fontSize: 13, color: '#777' },
  divider: { height: 1, backgroundColor: '#f0e4e4', marginVertical: 15 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#2d1515', marginBottom: 10, marginTop: 5 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  infoBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fdf0f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#fcdcdc' },
  infoBadgeText: { fontSize: 12, color: '#555', marginLeft: 5, fontWeight: '500' },
  descriptionText: { fontSize: 13, color: '#666', lineHeight: 20 },
  sellerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fafafa', padding: 12, borderRadius: 14, marginBottom: 20, borderWidth: 1, borderColor: '#f0f0f0' },
  sellerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fdebeb', alignItems: 'center', justifyContent: 'center' },
  sellerName: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  sellerStatus: { fontSize: 11, color: '#777', marginTop: 2 },
  takipEtBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#C85C5C', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  takipEtText: { color: '#C85C5C', fontSize: 12, fontWeight: 'bold' },
  pazarlikActionBtn: { backgroundColor: '#C85C5C', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 5, marginBottom: 20 },
  pazarlikActionBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' }
});