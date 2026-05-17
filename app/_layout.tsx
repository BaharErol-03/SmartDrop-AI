import { Drawer } from "expo-router/drawer";
import { Tabs } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, Text, TouchableOpacity, StyleSheet, DeviceEventEmitter } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import React, { useState, useEffect } from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

// ── 1. CUSTOM DRAWER (YAN MENÜ) ──
function CustomDrawerContent(props: DrawerContentComponentProps & { onLogout: () => void }) {
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = segments[segments.length - 1] || "";

  const menuItems = [
    { label: "Ana Ekran", icon: "home", path: "/home_sayfasi_iki", routeName: "home_sayfasi_iki" },
    { label: "Pazarlıklarım", icon: "chatbubbles", path: "/pazarlik_sayfasi", routeName: "pazarlik_sayfasi" },
    { label: "Profilim", icon: "person", path: "/profil_sayfasi_bes", routeName: "profil_sayfasi_bes" },
    { label: "Network", icon: "globe", path: "/network_sayfasi_dort", routeName: "network_sayfasi_dort" },
  ];

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}><Text style={styles.drawerTitle}>Menü</Text></View>
      <View style={styles.menuList}>
        {menuItems.map((item, index) => {
          const isActive = currentRoute === item.routeName;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, isActive && styles.activeMenuItem]}
              onPress={() => {
                props.navigation.closeDrawer();
                router.push(item.path as any);
              }}
            >
              <Ionicons 
                name={isActive ? (item.icon as any) : (`${item.icon}-outline` as any)} 
                size={22} 
                color={isActive ? "#B24B4B" : "#9e7272"} 
              />
              <Text style={[styles.menuLabel, isActive && styles.activeMenuLabel]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
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
    <Tabs screenOptions={{ tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint, headerShown: false, tabBarButton: HapticTab }}>
      <Tabs.Screen name="login_sayfasi_bir" options={{ href: null }} /> {/* Alt barda gizli */}
      <Tabs.Screen name="home_sayfasi_iki" options={{ title: 'Ana Ekran', tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} /> }} />
      <Tabs.Screen name="pazarlik_sayfasi" options={{ title: 'Pazarlıklar', tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} /> }} />
      <Tabs.Screen name="profil_sayfasi_bes" options={{ title: 'Profil', tabBarIcon: ({ color }) => <Ionicons size={24} name="person" color={color} /> }} />
      <Tabs.Screen name="network_sayfasi_dort" options={{ title: 'Network', tabBarIcon: ({ color }) => <Ionicons size={24} name="globe" color={color} /> }} />
    </Tabs>
  );
}

// ── 3. ROOT LAYOUT MAIN BİLEŞENİ ──
export default function RootLayout() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Giriş yap butonuna basıldığında burası tetiklenecek
    const loginSubscription = DeviceEventEmitter.addListener("onLoginSuccess", () => {
      setIsLoggedIn(true);
      router.replace("/home_sayfasi_iki");
    });

    return () => loginSubscription.remove();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.replace("/login_sayfasi_bir");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} onLogout={handleLogout} />}
        screenOptions={{
          headerShown: false,
          swipeEnabled: isLoggedIn, // Giriş yapılmadıysa yan menü çekilerek açılmaz
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
  drawerHeader: { paddingHorizontal: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: "#f2dede", marginBottom: 15 },
  drawerTitle: { fontSize: 18, fontWeight: "800", color: "#B24B4B" },
  menuList: { paddingHorizontal: 12, gap: 8 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, gap: 12 },
  activeMenuItem: { backgroundColor: "#fdeeee" },
  menuLabel: { fontSize: 14, fontWeight: "600", color: "#9e7272" },
  activeMenuLabel: { color: "#B24B4B", fontWeight: "700" },
  logoutContainer: { marginTop: "auto", marginBottom: 30, borderTopWidth: 1, borderTopColor: "#f2dede", paddingTop: 15, marginHorizontal: 15 },
  logoutButton: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, paddingHorizontal: 16 },
  logoutText: { fontSize: 14, fontWeight: "700", color: "#B24B4B" },
});