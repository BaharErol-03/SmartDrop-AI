import { Ionicons } from "@expo/vector-icons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { Tabs, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// 🔥 Firebase çıkış fonksiyonu ve config
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Yolunu projene göre kontrol et

// ── 1. CUSTOM DRAWER (YAN MENÜ) ──
function CustomDrawerContent(
  props: DrawerContentComponentProps & { onLogout: () => void },
) {
  const router = useRouter();

  const menuItems = [
    { label: "Ana Ekran", icon: "home", path: "/home_sayfasi_iki" },
    { label: "Pazarlıklarım", icon: "chatbubbles", path: "/pazarlik_sayfasi" },
    { label: "Profilim", icon: "person", path: "/profil_sayfasi_bes" },
    { label: "Siparişlerim", icon: "basket", path: "/siparislerim" },
  ];

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Menü</Text>
      </View>
      <View style={styles.menuList}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              props.navigation.closeDrawer();
              router.push(item.path as any);
            }}
          >
            <Ionicons
              name={`${item.icon}-outline` as any}
              size={22}
              color="#9e7272"
            />
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={props.onLogout}>
          <Ionicons name="log-out-outline" size={22} color="#B24B4B" />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── 2. TABS LAYOUT (ALT SEKMELER) ──
function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,

        // Genel menü tasarımı
        tabBarStyle: {
          height: Platform.OS === "ios" ? 85 : 70,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          marginBottom: Platform.OS === "web" ? 10 : 5,
          fontSize: 11,
          fontWeight: "600",
        },
        tabBarItemStyle: {
          justifyContent: "center",
          padding: 5,
        },
      }}
    >
      {/* ✅ KESİN ÇÖZÜM: Menüyü gizleme komutunu doğrudan bu sayfanın kendisine verdik! */}

      {/* Alt barda görünen sayfalar */}
      <Tabs.Screen
        name="home_sayfasi_iki"
        options={{
          title: "Ana Ekran",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pazarlik_sayfasi"
        options={{
          title: "Pazarlıklar",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profil_sayfasi_bes"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="person" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="siparislerim"
        options={{
          title: "Siparişlerim",
          tabBarIcon: ({ color }) => (
            <Ionicons size={24} name="basket" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

// ── 3. ROOT LAYOUT MAIN BİLEŞENİ ──
export default function RootLayout() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loginSubscription = DeviceEventEmitter.addListener(
      "onLoginSuccess",
      () => {
        setIsLoggedIn(true);
        router.replace("/home_sayfasi_iki");
      },
    );
    return () => loginSubscription.remove();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase oturumunu tamamen kapatır
    } catch (e) {
      console.log("Çıkış hatası", e);
    }
    setIsLoggedIn(false);
    router.replace("/login_sayfasi_bir");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => (
          <CustomDrawerContent {...props} onLogout={handleLogout} />
        )}
        screenOptions={{
          headerShown: false,
          swipeEnabled: isLoggedIn, // Giriş yapılmadıysa yan menüyü çektirmez
          drawerStyle: { backgroundColor: "#ffffff", width: 260 },
        }}
      >
        <Drawer.Screen name="(tabs)" />
      </Drawer>
    </GestureHandlerRootView>
  );
}

// ── STİLLER ──
const styles = StyleSheet.create({
  drawerContainer: { flex: 1, backgroundColor: "#ffffff", paddingTop: 50 },
  drawerHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f2dede",
    marginBottom: 15,
  },
  drawerTitle: { fontSize: 18, fontWeight: "800", color: "#B24B4B" },
  menuList: { paddingHorizontal: 12, gap: 8 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
  },
  menuLabel: { fontSize: 14, fontWeight: "600", color: "#9e7272" },
  logoutContainer: {
    marginTop: "auto",
    marginBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#f2dede",
    paddingTop: 15,
    marginHorizontal: 15,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  logoutText: { fontSize: 14, fontWeight: "700", color: "#B24B4B" },
});
