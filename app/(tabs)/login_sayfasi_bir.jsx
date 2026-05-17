import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
// Firebase Auth metotlarını ve kendi yapılandırmamızı çağırıyoruz
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Giriş mi Kayıt mı kontrolü

  // 🔐 Giriş Yapma Fonksiyonu
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Giriş başarılı olunca auth dinleyicisi otomatik olarak ana sayfaya yönlendirecektir
    } catch (error) {
      console.error(error);
      Alert.alert("Giriş Hatası", "E-posta veya şifre hatalı.");
    } finally {
      setLoading(false);
    }
  };

  // 📝 Kayıt Olma Fonksiyonu
  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Hata", "Lütfen tüm alanları doldurun.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Hata", "Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert("Başarılı", "Hesabınız oluşturuldu ve giriş yapıldı!");
    } catch (error) {
      console.error(error);
      Alert.alert("Kayıt Hatası", "Bu e-posta adresi zaten kullanımda olabilir veya geçersizdir.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Başlık */}
      <Text style={styles.logoText}>SmartDrop</Text>

      {/* Input Alanları */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="E-posta Adresi"
          placeholderTextColor="#cca3a3"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Şifre"
          placeholderTextColor="#cca3a3"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      {/* Ana Tetikleyici Buton (Giriş Yap / Kayıt Ol) */}
      <TouchableOpacity 
        style={styles.mainButton} 
        onPress={isSignUp ? handleSignUp : handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.mainButtonText}>
            {isSignUp ? "Hesap Oluştur ve Katıl" : "Giriş Yap"}
          </Text>
        )}
      </TouchableOpacity>

      {/* Alt Değiştirme Butonu (Modlar arası geçiş) */}
      <TouchableOpacity 
        style={styles.switchButton} 
        onPress={() => setIsSignUp(!isSignUp)}
      >
        <Text style={styles.switchButtonText}>
          {isSignUp 
            ? "Zaten hesabın var mı? Giriş Yap" 
            : "Hesabın yok mu? Hemen Kayıt Ol"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdf8f8",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#B24B4B",
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  inputContainer: {
    width: "100%",
    gap: 16,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    backgroundColor: "#ffffff",
    height: 54,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#2d1515",
    borderWidth: 1,
    borderColor: "#f2dede",
  },
  mainButton: {
    width: "100%",
    backgroundColor: "#C85C5C",
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#C85C5C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  mainButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  switchButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
  switchButtonText: {
    color: "#B24B4B",
    fontSize: 14,
    fontWeight: "600",
  },
});