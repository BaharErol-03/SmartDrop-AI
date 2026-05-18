import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  DeviceEventEmitter,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../firebaseConfig"; // Yolun doğru olduğundan emin ol

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ─── GİRİŞ YAPMA FONKSİYONU ───
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Uyarı", "Lütfen e-posta ve şifrenizi boş bırakmayın.");
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Başarılı olursa _layout.tsx içindeki dinleyiciye haber gönderir ve sayfayı değiştirir
      DeviceEventEmitter.emit("onLoginSuccess");
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Hata",
        "Giriş yapılamadı. E-posta veya şifrenizi kontrol edin.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ─── YENİ KAYIT OLMA FONKSİYONU ───
  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert("Uyarı", "Lütfen e-posta ve şifrenizi boş bırakmayın.");
      return;
    }
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Tebrikler!", "Kaydınız başarıyla oluşturuldu.", [
        {
          text: "Uygulamaya Gir",
          onPress: () => DeviceEventEmitter.emit("onLoginSuccess"),
        },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Hata",
        "Kayıt olunamadı. Şifrenizin en az 6 haneli olduğundan emin olun.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.formBox}>
          <Text style={styles.title}>SmartDrop a Hoş Geldiniz</Text>
          <Text style={styles.subtitle}>
            Giriş yapın veya yeni bir hesap oluşturun.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="E-posta adresiniz"
            placeholderTextColor="#9e7272"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Şifreniz"
            placeholderTextColor="#9e7272"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#C85C5C"
              style={{ marginVertical: 20 }}
            />
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.loginBtn]}
                onPress={handleLogin}
              >
                <Text style={styles.loginBtnText}>Giriş Yap</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.registerBtn]}
                onPress={handleRegister}
              >
                <Text style={styles.registerBtnText}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fdf8f8" },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  formBox: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f0dada",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2d1515",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#9e7272",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#f9f0f0",
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#2d1515",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0dada",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  loginBtn: { backgroundColor: "#C85C5C", marginRight: 8 },
  loginBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  registerBtn: {
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#C85C5C",
    marginLeft: 8,
  },
  registerBtnText: { color: "#C85C5C", fontSize: 16, fontWeight: "700" },
});
