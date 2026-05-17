import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProfilIslemleriEkran() {
  const router = useRouter();

  // TypeScript tür tanımlamaları (string, as any) tamamen temizlendi
  const butonTetikle = (butonismi, rota) => {
    if (rota) {
      router.push(rota);
    } else {
      Alert.alert(
        "Simülasyon Aktif",
        `"${butonismi}" ekranı şu an demo modundadır. Hackathon sunumu için koltuk pazarlık fonksiyonlarını inceleyebilirsiniz.`
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 20, paddingTop: 60 }}>
        <Text style={styles.pageTitle}>Profil İşlemleri</Text>
        
        {/* BUTON GRID ALANI */}
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => butonTetikle("Profil Düzenle")}>
            <Ionicons name="person-outline" size={24} color="#C85C5C" />
            <Text style={styles.actionText}>Profil Düzenle</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => butonTetikle("Ayarlar")}>
            <Ionicons name="settings-outline" size={24} color="#C85C5C" />
            <Text style={styles.actionText}>Ayarlar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => butonTetikle("Yardım")}>
            <Ionicons name="help-circle-outline" size={24} color="#C85C5C" />
            <Text style={styles.actionText}>Yardım</Text>
          </TouchableOpacity>
        </View>

        {/* AKTİF PAZARLIKLAR ALANI */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Devam Eden Pazarlıklarım</Text>
          
          <View style={styles.pazarlikCard}>
            <View style={styles.pazarlikLeft}>
              <View style={[styles.statusIndicator, { backgroundColor: '#FF9F43' }]} />
              <View>
                <Text style={{ fontWeight: '700', color: '#2D1515' }}>Sofa bed (Örnek)</Text>
                <Text style={{ fontSize: 12, color: '#777' }}>Pazar AI devrede</Text>
              </View>
            </View>
            <Text style={{ fontWeight: '800', color: '#C85C5C' }}>3.000 ₺</Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

// Hatalı olan 'weight' ve geçersiz sayılar tamamen düzeltildi
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAF4F4' 
  },
  pageTitle: {
    fontSize: 22, 
    fontWeight: '800', 
    marginBottom: 20, 
    color: '#2D1515'
  },
  actionGrid: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingVertical: 20, 
    backgroundColor: '#fff', 
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5
  },
  actionCard: { 
    alignItems: 'center', 
    justifyContent: 'center',
    width: '28%' 
  },
  actionText: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#4A3B3B', 
    textAlign: 'center',
    marginTop: 6
  },
  sectionContainer: {
    marginTop: 25
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D1515',
    marginBottom: 12
  },
  pazarlikCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10
  },
  pazarlikLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10
  }
});