import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#C85C5C', // Temaya uygun şık Rose-Kırmızı
        tabBarInactiveTintColor: '#777',
        headerShown: false,
        tabBarStyle: { backgroundColor: '#fff', height: 60, paddingBottom: 8 }
      }}
    >
      <Tabs.Screen
        name="home_sayfasi_iki"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favoriler" 
        options={{
          title: 'Favoriler',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "heart" : "heart-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="urun_sat" 
        options={{
          title: 'Ürün Sat',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dolap" 
        options={{
          title: 'Dolabım',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />
          ),
        }}
      />

      {/* Arka planda gizli kalacak rotalar */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="login_sayfasi_bir" options={{ href: null }} />
      <Tabs.Screen name="kayit_sayfasi_iki" options={{ href: null }} />
    </Tabs>
  );
}