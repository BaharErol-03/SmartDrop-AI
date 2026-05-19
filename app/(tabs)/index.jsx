import { Redirect } from "expo-router";

export default function RootIndex() {
  // Uygulama sıfırdan her açıldığında zorunlu olarak login ekranına yönlendirir
  return <Redirect href="/login_sayfasi_bir" />;
}