/**
 * SmartDrop AI — LoginScreen.jsx
 * Pinterest tasarımına uyarlanmış Rose/Kırmızı tema
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

// ─── ROSE/KIRMIZI RENK PALETİ ─────────────────────────────────────────
const C = {
  bg: "#ffffff",
  primary: "#C85C5C",        // Ana rose-red
  primaryDark: "#B04848",    // Koyu varyant (hover/press)
  primarySoft: "#f9ecec",    // Açık arka plan tonu
  primaryLight: "#f0d5d5",   // Input border aktif
  surface: "#ffffff",
  border: "#e8d5d5",
  textPrimary: "#2d1515",
  textMuted: "#9e7272",
  white: "#ffffff",
  dot: "#d98080",            // Dekoratif daire rengi
};

export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = () => {
    if (onLoginSuccess) onLoginSuccess();
  };

  const handleGoogle = () => {
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── DEKORATİF DAIRELER (arka plan) ─── */}
      <View pointerEvents="none" style={styles.decorLayer}>
        <View style={[styles.dot, { width: 90, height: 90, top: -30, right: -30, opacity: 0.18 }]} />
        <View style={[styles.dot, { width: 55, height: 55, top: 80, right: 40, opacity: 0.12 }]} />
        <View style={[styles.dot, { width: 40, height: 40, top: 160, left: 10, opacity: 0.10 }]} />
        <View style={[styles.dot, { width: 70, height: 70, bottom: 120, left: -20, opacity: 0.15 }]} />
        <View style={[styles.dot, { width: 45, height: 45, bottom: 200, right: 20, opacity: 0.10 }]} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── ÜST BANNER (kırmızı hero alan) ─────────────────────────── */}
          <View style={styles.heroBanner}>
            {/* Dekoratif iç daireler */}
            <View style={styles.heroCircle1} />
            <View style={styles.heroCircle2} />

            {/* Logo kutusu */}
            <View style={styles.logoBox}>
              <Ionicons name="bag-handle" size={38} color={C.primary} />
            </View>

            <Text style={styles.heroTitle}>SmartDrop a{"\n"}Hoş Geldiniz!</Text>
            <Text style={styles.heroSubtitle}>
              Yapay zeka asistanınız Pazar,{"\n"}sizin için en iyi fiyatı bulsun.
            </Text>
          </View>

          {/* ── FORM KARTI ──────────────────────────────────────────────── */}
          <View style={styles.formCard}>

            {/* E-posta */}
            <Text style={styles.label}>E-posta</Text>
            <View style={[styles.inputWrap, emailFocused && styles.inputFocused]}>
              <Feather name="mail" size={18} color={emailFocused ? C.primary : C.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-posta adresiniz"
                placeholderTextColor={C.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>

            {/* Şifre */}
            <Text style={styles.label}>Şifre</Text>
            <View style={[styles.inputWrap, passwordFocused && styles.inputFocused]}>
              <Feather name="lock" size={18} color={passwordFocused ? C.primary : C.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Şifreniz"
                placeholderTextColor={C.textMuted}
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.eyeBtn}
              >
                <Feather
                  name={passwordVisible ? "eye-off" : "eye"}
                  size={17}
                  color={C.textMuted}
                />
              </TouchableOpacity>
            </View>

            {/* Şifremi unuttum */}
            <TouchableOpacity style={styles.forgotWrap}>
              <Text style={styles.forgotText}>Şifremi Unuttum</Text>
            </TouchableOpacity>

            {/* Giriş Yap Butonu — rose-red dolu */}
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={handleLogin}
              style={styles.loginBtn}
            >
              <Text style={styles.loginBtnText}>Giriş Yap</Text>
              {/* Küçük dekoratif nokta */}
              <View style={styles.btnDot} />
            </TouchableOpacity>

            {/* Ayırıcı */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Butonu — beyaz outline */}
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={handleGoogle}
              style={styles.googleBtn}
            >
              <Ionicons name="logo-google" size={19} color={C.primary} style={{ marginRight: 10 }} />
              <Text style={styles.googleBtnText}>Google ile Hızlı Giriş</Text>
            </TouchableOpacity>

            {/* Kayıt Ol */}
            <View style={styles.registerRow}>
              <Text style={styles.registerBase}>Hesabınız yok mu? </Text>
              <TouchableOpacity>
                <Text style={styles.registerLink}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── STİLLER ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: 36,
  },

  // ── Dekoratif katman ──
  decorLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  dot: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: C.primary,
  },

  // ── Hero Banner ──
  heroBanner: {
    backgroundColor: C.primary,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingTop: 52,
    paddingBottom: 48,
    paddingHorizontal: 28,
    alignItems: "center",
    marginBottom: 28,
    overflow: "hidden",
    position: "relative",
  },
  heroCircle1: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255,255,255,0.10)",
    top: -40,
    right: -30,
  },
  heroCircle2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -20,
    left: 20,
  },
  logoBox: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: C.white,
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 21,
  },

  // ── Form Kart ──
  formCard: {
    marginHorizontal: 20,
    backgroundColor: C.white,
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 24,
    shadowColor: C.primary,
    shadowOpacity: 0.10,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: C.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.primarySoft,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 18,
  },
  inputFocused: {
    borderColor: C.primary,
    backgroundColor: "#fff5f5",
  },
  inputIcon: {
    marginRight: 11,
  },
  input: {
    flex: 1,
    color: C.textPrimary,
    fontSize: 15,
  },
  eyeBtn: {
    padding: 4,
    marginLeft: 8,
  },

  // ── Şifremi Unuttum ──
  forgotWrap: {
    alignSelf: "flex-end",
    marginBottom: 22,
    marginTop: -6,
  },
  forgotText: {
    color: C.primary,
    fontSize: 13,
    fontWeight: "600",
  },

  // ── Giriş Butonu ──
  loginBtn: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.primary,
    height: 54,
    borderRadius: 16,
    marginBottom: 22,
    overflow: "hidden",
    position: "relative",
  },
  loginBtnText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  btnDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    right: 18,
    top: "50%",
    marginTop: -6,
  },

  // ── Ayırıcı ──
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  dividerText: {
    color: C.textMuted,
    fontSize: 13,
    marginHorizontal: 12,
  },

  // ── Google Butonu ──
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: C.border,
    height: 54,
    borderRadius: 16,
    marginBottom: 26,
  },
  googleBtnText: {
    color: C.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },

  // ── Kayıt Ol ──
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerBase: {
    color: C.textMuted,
    fontSize: 14,
  },
  registerLink: {
    color: C.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
