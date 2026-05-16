/**
 * SmartDrop AI — App.js (Ana Yönlendirici)
 * Pinterest tasarımına uyarlanmış Rose/Kırmızı tema
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Sayfaların importları
import LoginScreen from './login_sayfasi_bir';
import HomeScreen from './home_sayfasi_iki';
import RoutePlannerScreen from './rota_map_uc';
import NetworkScreen from './network_sayfasi_dort';
import ProfileScreen from './profil_sayfasi_bes';
import PazarlikScreen from './pazarlik_sayfasi';

// ─── ROSE/KIRMIZI RENK PALETİ ─────────────────────────────────────────
const C = {
  primary: '#C85C5C',
  primaryDark: '#B04848',
  white: '#ffffff',
  inactive: 'rgba(255,255,255,0.55)',
  bg: '#f9f0f0',
  tabBg: '#C85C5C',       // Tab bar kırmızı zemin
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Login');

  const renderScreen = () => {
    switch (activeTab) {
      case 'Login':
        return <LoginScreen onLoginSuccess={() => setActiveTab('Home')} />;
      case 'Home':
        return <HomeScreen setActiveTab={setActiveTab} />;
      case 'RoutePlanner':
        return <RoutePlannerScreen />;
      case 'Network':
        return <NetworkScreen />;
      case 'Profile':
        return <ProfileScreen />;
      case 'Pazarlik':
        return <PazarlikScreen />;
      default:
        return <HomeScreen setActiveTab={setActiveTab} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sayfa İçeriği */}
      <View style={styles.screenContainer}>
        {renderScreen()}
      </View>

      {/* ── ALT MENÜ (giriş sonrası, kırmızı zemin) ──────────────────── */}
      {activeTab !== 'Login' && (
        <View style={styles.tabBarContainer}>
          <View style={styles.tabBar}>
            <TabButton name="Home"         icon="home"        label="Ana Sayfa" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton name="RoutePlanner" icon="location"    label="Kargom"    activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton name="Pazarlik"     icon="chatbubbles" label="Pazarlık"  activeTab={activeTab} setActiveTab={setActiveTab} isPrimary />
            <TabButton name="Network"      icon="cube"        label="Dolaplar"  activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton name="Profile"      icon="person"      label="Hesabım"   activeTab={activeTab} setActiveTab={setActiveTab} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

// ─── ALT MENÜ BUTONU ──────────────────────────────────────────────────
const TabButton = ({ name, icon, label, activeTab, setActiveTab, isPrimary }) => {
  const isActive = activeTab === name;

  // Ortadaki "Pazarlık" butonu — yükseltilmiş beyaz daire
  if (isPrimary) {
    return (
      <TouchableOpacity
        style={styles.tabButtonCenter}
        onPress={() => setActiveTab(name)}
        activeOpacity={0.8}
      >
        <View style={[styles.centerIconWrap, isActive && styles.centerIconWrapActive]}>
          <Ionicons
            name={isActive ? icon : `${icon}-outline`}
            size={26}
            color={isActive ? C.primary : C.white}
          />
        </View>
        <Text style={[styles.tabLabel, { color: isActive ? C.white : C.inactive, fontWeight: '800' }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.tabButton}
      onPress={() => setActiveTab(name)}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isActive ? icon : `${icon}-outline`}
        size={22}
        color={isActive ? C.white : C.inactive}
      />
      <Text style={[styles.tabLabel, { color: isActive ? C.white : C.inactive }]}>
        {label}
      </Text>
      {/* Aktif nokta göstergesi */}
      {isActive && <View style={styles.activeDot} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  screenContainer: {
    flex: 1,
  },

  // ── Tab Bar ──
  tabBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 14,
    right: 14,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: C.tabBg,       // Kırmızı zemin
    borderRadius: 28,
    paddingVertical: 10,
    paddingHorizontal: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    // Derinlik gölgesi
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },

  // Normal tab butonu
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 3,
    fontWeight: '700',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: C.white,
    marginTop: 3,
  },

  // Orta yükseltilmiş buton (Pazarlık)
  tabButtonCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
    marginTop: -18,     // Yukarı kaldır
  },
  centerIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
    marginBottom: 3,
  },
  centerIconWrapActive: {
    backgroundColor: C.white,
    borderColor: C.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
});