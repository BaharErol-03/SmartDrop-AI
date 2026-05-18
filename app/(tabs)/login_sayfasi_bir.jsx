import { DeviceEventEmitter, Text, TouchableOpacity, View } from "react-native";

export default function LoginSayfasi() {
  const handleGiris = () => {
    // _layout.tsx'teki listener'ı tetikler → isLoggedIn=true → home'a yönlendirir
    DeviceEventEmitter.emit("onLoginSuccess");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Giriş Ekranı</Text>
      <TouchableOpacity
        onPress={handleGiris}
        style={{
          backgroundColor: "#B24B4B",
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
}
