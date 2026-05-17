import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';

// 🔥 Firebase Firestore bağlantısı ve gerekli metotlar
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
const { width } = Dimensions.get('window');

const HomeSayfasiIki = () => {
  const router = useRouter();
  const [urunler, setUrunler] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const firebaseVerileriniGetir = async () => {
      try {
        setLoading(true);
        
        // Firestore üzerindeki 'urunler' koleksiyonuna bağlanıyoruz
        const urunlerRef = collection(db, 'urunler');
        const querySnapshot = await getDocs(urunlerRef);
        
        const geciciListe = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          
          // Dataset başlıklarını (Product_name, Image, Price, Address) eski arayüz kodlarıyla tam uyumlu hale getiriyoruz
          geciciListe.push({
            id: doc.id,
            asin: doc.id, 
            title: data.Product_name || "İsimsiz Ürün",
            imgUrl: data.Image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
            price: data.Price || "0",
            location: data.Address || "Bilinmiyor"
          });
        });

        setUrunler(geciciListe);
      } catch (error) {
        console.error("Firebase veri çekme hatası: ", error);
      } finally {
        setLoading(false);
      }
    };

    firebaseVerileriniGetir();
  }, []);

  // ── YÜKLENİYOR DURUMU (LOADING ANIMASYONU) ──
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#C85C5C" />
        <Text style={styles.loadingText}>Ürünler buluttan yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      {/* ── BAŞLIK ALANI ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pazar Alanı</Text>
        <Text style={styles.headerSubtitle}>Buluttan gelen en güncel ilanlar</Text>
      </View>

      {/* ── ÜRÜN KARTLARI LİSTESİ ── */}
      <View style={styles.gridContainer}>
        {urunler.map((item) => (
          <View key={item.id} style={styles.card}>
            
            {/* Ürün Görseli */}
            <Image source={{ uri: item.imgUrl }} style={styles.cardImage} />
            
            {/* Kart İçerik Detayları */}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.cardPrice}>{item.price} ₺</Text>
              
              <View style={styles.locationContainer}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.cardLocation} numberOfLines={1}>{item.location}</Text>
              </View>

              {/* Detaylar Butonu (Gelişmiş Modal Sayfasına Veri Gönderimi) */}
              <TouchableOpacity 
                style={styles.detailButton}
                onPress={() => {
                  router.push({
                    pathname: '/modal',
                    params: { 
                      title: item.title, 
                      price: item.price, 
                      imgUrl: item.imgUrl, 
                      location: item.location 
                    }
                  });
                }}
              >
                <Text style={styles.detailButtonText}>Detayları Gör</Text>
              </TouchableOpacity>
            </View>

          </View>
        ))}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    color: '#777',
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f8eeee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d1515',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 30) / 2, // Ekran genişliğine göre iki sütunlu grid hizalaması
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f0e4e4',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
    backgroundColor: '#f9f9f9',
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C85C5C',
    marginBottom: 6,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  cardLocation: {
    fontSize: 11,
    color: '#777',
    flex: 1,
  },
  detailButton: {
    backgroundColor: '#C85C5C',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default HomeSayfasiIki;