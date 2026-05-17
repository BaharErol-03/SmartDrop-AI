import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Firebase Bağlantılarımız
import { auth, db } from "../firebaseConfig"; // firebaseConfig dosyanızın yoluna göre burayı ayarlayabilirsiniz (örn: '../../firebaseConfig')
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterScreen() {
  const router = useRouter();
  
  // Form State'leri
  const [isim, setIsim] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ilce, setIlce] = useState("");
  const [sehir, setSehir] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const handleRegister = async () => {
    // Boş alan kontrolü
    if (!isim || !email || !password || !ilce || !sehir) {
      Alert.alert("Hata", "Lütfen tüm alanları eksiksiz doldurun.");
      return;
    }

    try {
      setLoading(true);

      // 1. Firebase Auth ile E-posta ve Şifre hesabı oluşturma
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Auth tarafında oluşan benzersiz 'uid' ile Firestore 'kullanicilar' koleksiyonuna doküman açma
      await setDoc(doc(db, "kullanicilar", user.uid), {
        isim: isim,
        email: email,
        ilce: ilce,
        sehir: sehir,
        createdAt: new Date().toISOString()
      });

      Alert.alert("Başarılı", "Hesabınız başarıyla oluşturuldu!", [
        { text: "Giriş Yap", onPress: () => router.replace("/login_sayfasi_bir") }
      ]);

    } catch (error) {
      console.error(error);
      let hataMesaji = "Kayıt yapılırken bir sorun oluştu.";
      
      if (error.code === "auth/email-already-in-use") {
        hataMesaji = "Bu e-posta adresi zaten kullanımda.";
      } else if (error.code === "auth/weak-password") {
        hataMesaji = "Şifreniz çok zayıf. En az 6 karakter olmalıdır.";
      } else if (error.code === "auth/invalid-email") {
        hataMesaji = "Lütfen geçerli bir e-posta adresi girin.";
      }
      
      Alert.alert("Hata", hataMesaji);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Logo Alanı (Login sayfasıyla uyumlu) */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="basket" size={32} color="#C85C5C" />
          </View>
          <Text style={styles.brandText}>SmartDrop'a Kayıt Olun</Text>
        </View>

        {/* Ad Soyad Girişi */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#9e7272" style={styles.icon} />
          <TextInput 
            placeholder="Adınız Soyadınız" 
            placeholderTextColor="#b59494"
            value={isim}
            onChangeText={setIsim}
            style={styles.input}
          />
        </View>

        {/* E-posta Girişi */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#9e7272" style={styles.icon} />
          <TextInput 
            placeholder="E-posta adresiniz" 
            placeholderTextColor="#b59494"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        {/* Şifre Girişi */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#9e7272" style={styles.icon} />
          <TextInput 
            placeholder="Şifreniz" 
            placeholderTextColor="#b59494"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
            autoCapitalize="none"
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setSecureText(!secureText)}>
            <Ionicons name={secureText ? "eye-off-outline" : "eye-outline"} size={20} color="#9e7272" />
          </TouchableOpacity>
        </View>

        {/* İlçe Girişi */}
        <View style={styles.inputContainer}>
          <Ionicons name="location-outline" size={20} color="#9e7272" style={styles.icon} />
          <TextInput 
            placeholder="İlçe (Örn: Merkez)" 
            placeholderTextColor="#b59494"
            value={ilce}
            onChangeText={setIlce}
            style={styles.input}
          />
        </View>

        {/* Şehir Girişi */}
        <View style={styles.inputContainer}>
          <Ionicons name="map-outline" size={20} color="#9e7272" style={styles.icon} />
          <TextInput 
            placeholder="Şehir (Örn: Kütahya)" 
            placeholderTextColor="#b59494"
            value={sehir}
            onChangeText={setSehir}
            style={styles.input}
          />
        </View>

        {/* Kayıt Butonu */}
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Kayıt Ol</Text>}
        </TouchableOpacity>

        {/* Geri Dönüş Linki */}
        <TouchableOpacity onPress={() => router.push("/login_sayfasi_bir")} style={styles.linkContainer}>
          <Text style={styles.linkText}>Zaten bir hesabınız var mı? <Text style={{ fontWeight: "700" }}>Giriş Yap</Text></Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fdf8f8", padding: 24, justifyContent: "center" },
  logoContainer: { alignItems: "center", marginBottom: 30 },
  logoCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  brandText: { fontSize: 20, fontWeight: "800", color: "#B24B4B", marginTop: 12 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: "#f2dede", borderRadius: 16, paddingHorizontal: 16, height: 54, marginBottom: 16 },
  icon: { marginRight: 12 },
  input: { flex: 1, color: "#2d1515", fontSize: 15 },
  button: { backgroundColor: "#C85C5C", height: 54, borderRadius: 16, justifyContent: "center", alignItems: "center", marginTop: 10, shadowColor: "#C85C5C", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 3 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  linkContainer: { marginTop: 20, alignItems: "center" },
  linkText: { color: "#9e7272", fontSize: 14 }
});