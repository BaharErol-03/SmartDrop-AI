import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  DeviceEventEmitter,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginSayfasi() {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [sifreGoster, setSifreGoster] = useState(false);
  const [aktifTab, setAktifTab] = useState("giris"); // "giris" | "kayit"

  const handleGiris = () => {
    DeviceEventEmitter.emit("onLoginSuccess");
  };

  const handleKayit = () => {
    // Kayıt mantığını buraya ekle
    DeviceEventEmitter.emit("onLoginSuccess");
  };

  const handleGoogle = () => {
    // Google OAuth buraya
    console.log("Google ile giriş");
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── LOGO / BAŞLIK ── */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Ionicons name="storefront" size={36} color="#ffffff" />
          </View>
          <Text style={styles.appName}>SmartDrop</Text>
          <Text style={styles.tagline}>Akıllı pazarlık, kolay alışveriş</Text>
        </View>

        {/* ── TAB: GİRİŞ / KAYIT ── */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, aktifTab === "giris" && styles.tabAktif]}
            onPress={() => setAktifTab("giris")}
          >
            <Text
              style={[
                styles.tabText,
                aktifTab === "giris" && styles.tabTextAktif,
              ]}
            >
              Giriş Yap
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, aktifTab === "kayit" && styles.tabAktif]}
            onPress={() => setAktifTab("kayit")}
          >
            <Text
              style={[
                styles.tabText,
                aktifTab === "kayit" && styles.tabTextAktif,
              ]}
            >
              Kayıt Ol
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── FORM ALANI ── */}
        <View style={styles.form}>
          {/* E-posta */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={18}
              color="#9e7272"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="E-posta adresiniz"
              placeholderTextColor="#c4a0a0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Şifre */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color="#9e7272"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Şifreniz"
              placeholderTextColor="#c4a0a0"
              value={sifre}
              onChangeText={setSifre}
              secureTextEntry={!sifreGoster}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setSifreGoster(!sifreGoster)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={sifreGoster ? "eye-off-outline" : "eye-outline"}
                size={18}
                color="#9e7272"
              />
            </TouchableOpacity>
          </View>

          {/* Şifremi Unuttum — sadece giriş tabında */}
          {aktifTab === "giris" && (
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Şifremi unuttum</Text>
            </TouchableOpacity>
          )}

          {/* Ana Buton */}
          <TouchableOpacity
            style={styles.mainBtn}
            onPress={aktifTab === "giris" ? handleGiris : handleKayit}
            activeOpacity={0.85}
          >
            <Text style={styles.mainBtnText}>
              {aktifTab === "giris" ? "Giriş Yap" : "Hesap Oluştur"}
            </Text>
          </TouchableOpacity>

          {/* Ayırıcı */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Butonu */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogle}
            activeOpacity={0.85}
          >
            <Ionicons
              name="logo-google"
              size={18}
              color="#B24B4B"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.googleBtnText}>Google ile Giriş Yap</Text>
          </TouchableOpacity>
        </View>

        {/* ── ALT NOT ── */}
        <Text style={styles.footerText}>
          Devam ederek <Text style={styles.footerLink}>Kullanım Koşulları</Text>
          {"'nı ve "}
          <Text style={styles.footerLink}>Gizlilik Politikası</Text>
          {"'nı kabul etmiş olursunuz."}
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fdf8f8" },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 48,
  },

  // Logo
  logoArea: { alignItems: "center", marginBottom: 36 },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#B24B4B",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#B24B4B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  appName: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2d1515",
    letterSpacing: 0.5,
  },
  tagline: { fontSize: 13, color: "#9e7272", marginTop: 4, fontWeight: "500" },

  // Tab
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#f2dede",
    borderRadius: 14,
    padding: 4,
    marginBottom: 28,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 11 },
  tabAktif: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 14, fontWeight: "600", color: "#9e7272" },
  tabTextAktif: { color: "#B24B4B", fontWeight: "800" },

  // Form
  form: { gap: 14 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#f0dada",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#2d1515" },
  eyeBtn: { padding: 4 },

  // Şifremi Unuttum
  forgotBtn: { alignSelf: "flex-end", marginTop: -4 },
  forgotText: { fontSize: 12, color: "#B24B4B", fontWeight: "600" },

  // Ana Buton
  mainBtn: {
    backgroundColor: "#B24B4B",
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#B24B4B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 4,
  },
  mainBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  // Ayırıcı
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginVertical: 4,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#f0dada" },
  dividerText: { fontSize: 12, color: "#c4a0a0", fontWeight: "600" },

  // Google
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#f0dada",
    backgroundColor: "#ffffff",
  },
  googleBtnText: { fontSize: 15, fontWeight: "700", color: "#2d1515" },

  // Footer
  footerText: {
    fontSize: 11,
    color: "#c4a0a0",
    textAlign: "center",
    marginTop: 32,
    lineHeight: 18,
  },
  footerLink: { color: "#B24B4B", fontWeight: "600" },
});
