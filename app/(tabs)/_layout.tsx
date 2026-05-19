import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#B24B4B",
        tabBarInactiveTintColor: "#9e7272",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f2dede",
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      {/* ── GİZLİ SAYFALAR (route çalışır ama menüde görünmez) ── */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="rota_map_uc" options={{ href: null }} />
      <Tabs.Screen name="login_sayfasi_bir" options={{ href: null }} />

      {/* ── GÖRÜNEN SEKMELER ── */}
      <Tabs.Screen
        name="home_sayfasi_iki"
        options={{
          title: "Ana Ekran",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pazarlik_sayfasi"
        options={{
          title: "Pazarlıklar",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profil_sayfasi_bes"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="siparislerim"
        options={{
          title: "Siparişlerim",
          tabBarIcon: ({ color }) => (
            <Ionicons name="basket" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
