// app/profil_duzenle.jsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    EmailAuthProvider,
    onAuthStateChanged,
    reauthenticateWithCredential,
    updatePassword,
    updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { auth, db } from "../firebaseConfig";

const showAlert = (title, message, buttons) => {
  if (Platform.OS === 'web') {
    const result = window.confirm(`${title}\n${message}`);
    if (result && buttons && buttons[0]?.onPress) buttons[0].onPress();
  } else {
    Alert.alert(title, message, buttons);
  }
};

export default function ProfilDuzenleEkran() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.replace("/login_sayfasi_bir");
        return;
      }
      setUser(u);
      setEmail(u.email || "");
      setDisplayName(u.displayName || "");
      try {
        const snap = await getDoc(doc(db, "kullanicilar", u.uid));
        if (snap.exists()) {
          const data = snap.data();
          setPhone(data.phone || "");
          setCity(data.city || "");
          setBio(data.bio || "");
        }
      } catch (e) {
        console.log("Profil çekme hatası:", e);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const handleKaydet = async () => {
    if (!displayName.trim()) {
      showAlert("Hata", "İsim alanı boş bırakılamaz.");
      return;
    }
    setSaving(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });

      if (newPassword) {
        if (newPassword.length < 6) {
          showAlert("Hata", "Yeni şifre en az 6 karakter olmalıdır.");
          setSaving(false);
          return;
        }
        if (!currentPassword) {
          showAlert("Şifre Gerekli", "Şifre değiştirmek için mevcut şifrenizi girin.");
          setSaving(false);
          return;
        }
        const cred = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, cred);
        await updatePassword(user, newPassword);
      }

      await setDoc(
        doc(db, "kullanicilar", user.uid),
        {
          displayName: displayName.trim(),
          phone: phone.trim(),
          city: city.trim(),
          bio: bio.trim(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      showAlert("Başarılı ✓", "Profiliniz güncellendi.", [
        { text: "Tamam", onPress: () => router.back() },
      ]);
    } catch (err) {
      console.error("HATA:", err.code, err.message);
      const msgs = {
        "auth/wrong-password": "Mevcut şifreniz yanlış.",
        "auth/invalid-credential": "Mevcut şifreniz yanlış.",
        "auth/requires-recent-login": "Güvenlik için lütfen çıkış yapıp tekrar giriş yapın.",
      };
      showAlert("Hata", msgs[err.code] || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C85C5C" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#C85C5C" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil Düzenle</Text>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>
              {displayName ? displayName[0].toUpperCase() : "?"}
            </Text>
          </View>
          <Text style={styles.avatarHint}>Profil fotoğrafı yakında</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.groupLabel}>Temel Bilgiler</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ad Soyad</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={16} color="#C85C5C" style={styles.inputIcon} />
              <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} placeholder="Adınız Soyadınız" placeholderTextColor="#c0a0a0" autoCapitalize="words" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-posta</Text>
            <View style={[styles.inputWrap, { backgroundColor: "#F5F0F0" }]}>
              <Ionicons name="mail-outline" size={16} color="#C85C5C" style={styles.inputIcon} />
              <Text style={[styles.input, { color: "#9e7272" }]}>{email}</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefon</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="call-outline" size={16} color="#C85C5C" style={styles.inputIcon} />
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="05xx xxx xx xx" placeholderTextColor="#c0a0a0" keyboardType="phone-pad" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Şehir</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="location-outline" size={16} color="#C85C5C" style={styles.inputIcon} />
              <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="İstanbul, Ankara..." placeholderTextColor="#c0a0a0" autoCapitalize="words" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hakkımda</Text>
            <View style={[styles.inputWrap, { alignItems: "flex-start", paddingTop: 10 }]}>
              <Ionicons name="document-text-outline" size={16} color="#C85C5C" style={[styles.inputIcon, { marginTop: 2 }]} />
              <TextInput style={[styles.input, { minHeight: 80 }]} value={bio} onChangeText={setBio} placeholder="Kendinizden kısaca bahsedin..." placeholderTextColor="#c0a0a0" multiline numberOfLines={3} textAlignVertical="top" />
            </View>
          </View>

          <Text style={[styles.groupLabel, { marginTop: 20 }]}>Şifre Değiştir</Text>
          <Text style={styles.groupHint}>Şifre değişikliği için mevcut şifreniz gereklidir.</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mevcut Şifre</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={16} color="#C85C5C" style={styles.inputIcon} />
              <TextInput style={[styles.input, { flex: 1 }]} value={currentPassword} onChangeText={setCurrentPassword} placeholder="Mevcut şifreniz" placeholderTextColor="#c0a0a0" secureTextEntry={!showCurrentPw} autoCapitalize="none" />
              <TouchableOpacity onPress={() => setShowCurrentPw(!showCurrentPw)} style={{ paddingHorizontal: 8 }}>
                <Ionicons name={showCurrentPw ? "eye-off-outline" : "eye-outline"} size={18} color="#9e7272" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Yeni Şifre</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-open-outline" size={16} color="#C85C5C" style={styles.inputIcon} />
              <TextInput style={[styles.input, { flex: 1 }]} value={newPassword} onChangeText={setNewPassword} placeholder="En az 6 karakter" placeholderTextColor="#c0a0a0" secureTextEntry={!showNewPw} autoCapitalize="none" />
              <TouchableOpacity onPress={() => setShowNewPw(!showNewPw)} style={{ paddingHorizontal: 8 }}>
                <Ionicons name={showNewPw ? "eye-off-outline" : "eye-outline"} size={18} color="#9e7272" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.7 }]} onPress={handleKaydet} disabled={saving} activeOpacity={0.8}>
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Değişiklikleri Kaydet</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF4F4" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FAF4F4" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 56, paddingHorizontal: 20, paddingBottom: 12, backgroundColor: "#FAF4F4" },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#FFF0F0", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#2D1515" },
  avatarSection: { alignItems: "center", paddingVertical: 20 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#C85C5C", alignItems: "center", justifyContent: "center", elevation: 4, shadowColor: "#C85C5C", shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  avatarInitial: { fontSize: 32, fontWeight: "800", color: "#fff" },
  avatarHint: { marginTop: 8, fontSize: 12, color: "#9e7272" },
  form: { paddingHorizontal: 20, paddingTop: 8 },
  groupLabel: { fontSize: 13, fontWeight: "800", color: "#C85C5C", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4, marginTop: 8 },
  groupHint: { fontSize: 12, color: "#9e7272", marginBottom: 12, lineHeight: 18 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", color: "#4A3B3B", marginBottom: 6 },
  inputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 10, borderWidth: 1, borderColor: "#F0DADA", paddingHorizontal: 12, paddingVertical: 10 },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: "#2D1515" },
  saveBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#C85C5C", borderRadius: 14, paddingVertical: 16, marginTop: 24, elevation: 4, shadowColor: "#C85C5C", shadowOpacity: 0.35, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  saveBtnText: { fontSize: 16, fontWeight: "800", color: "#fff" },
});
