import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebaseConfig';

const showAlert = (title, message, buttons) => {
  if (Platform.OS === 'web') {
    const result = window.confirm(`${title}\n${message}`);
    if (result && buttons && buttons[0]?.onPress) buttons[0].onPress();
  } else {
    Alert.alert(title, message, buttons);
  }
};

export default function ProfilIslemleriEkran() {
  const router = useRouter();

  const handleCikis = async () => {
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
      <Text style={styles.headerTitle}>Profil İşlemleri</Text>

      {/* Üst Buton Paneli */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/profil_duzenle")}>
          <View style={styles.iconCircle}>
            <Ionicons name="person-outline" size={24} color="#C85C5C" />
          </View>
          <Text style={styles.menuText}>Profil Düzenle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/ayarlar")}>
          <View style={styles.iconCircle}>
            <Ionicons name="settings-outline" size={24} color="#C85C5C" />
          </View>
          <Text style={styles.menuText}>Ayarlar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/yardim")}>
          <View style={styles.iconCircle}>
            <Ionicons name="help-circle-outline" size={24} color="#C85C5C" />
          </View>
          <Text style={styles.menuText}>Yardım</Text>
        </TouchableOpacity>
      </View>

      {/* Çıkış Yap */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleCikis}>
        <Ionicons name="log-out-outline" size={20} color="#C85C5C" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF4F4', paddingTop: 60, paddingHorizontal: 20 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#2D1515', marginBottom: 20 },
  menuContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  menuItem: { alignItems: 'center', flex: 1 },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  menuText: { fontSize: 13, fontWeight: '600', color: '#2D1515' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 30,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0DADA',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: '#C85C5C' },
});