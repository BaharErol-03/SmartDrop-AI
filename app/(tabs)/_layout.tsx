import { View, Text, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../_layout"; // Üst klasördeki Context'i çağırıyoruz

export default function LoginSayfasi() {
  const { login } = useContext(AuthContext);

  const handleGiris = () => {
    // Giriş işlemleri başarılı olduğunda bu fonksiyon çalışır:
    login(); 
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Giriş Ekranı</Text>
      <TouchableOpacity 
        onPress={handleGiris}
        style={{ backgroundColor: '#B24B4B', padding: 15, borderRadius: 8, marginTop: 20 }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
}