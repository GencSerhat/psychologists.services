# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Psychologists Services

Kullanıcıların psikologlar hakkında bilgi alabileceği, favorilere ekleyebileceği ve randevu oluşturabileceği **web tabanlı bir uygulama**.  
Projede kullanıcı giriş/çıkış, favoriler listesi, randevu formu ve detaylı psikolog kartları gibi fonksiyonlar bulunmaktadır.

---

##  Özellikler

-  **Psikolog Profilleri**: Deneyim, lisans, uzmanlık ve ücret bilgileri
-  **Favoriler**: Kullanıcı giriş yaptıktan sonra psikologları favorilere ekleyebilir
-  **Randevu Sistemi**: Kullanıcılar psikologla randevu almak için form doldurabilir
-  **Kimlik Doğrulama**: Firebase Authentication ile giriş/kayıt
-  **Veri Saklama**: Firebase Realtime Database ile randevular kaydedilir
-  **Responsive Tasarım**: Masaüstü ve mobil uyumlu

---

##  Kullanılan Teknolojiler

- **Frontend**
  - React 18
  - React Router
  - React Hook Form + Yup
  - CSS Modules
- **Backend / Database**
  - Firebase Authentication
  - Firebase Realtime Database
- **Diğer**
  - Vite (geliştirme ve build aracı)
  - ESLint & Prettier (kod kalitesi)

---


## 📑 Teknik Görev Dökümanı

- Kullanıcı giriş yapmadan favorilere erişemez
- `/favorites` route **PrivateRoute** ile korunur
- Randevu formunda:
  - Ad Soyad, Telefon, Saat, E-posta ve Mesaj alanları zorunludur
  - Form validasyonu Yup ile yapılır
  - Başarılı gönderim sonrası randevu Firebase DB’ye kaydedilir
- UI bileşenleri **React + CSS Modules** yapısında parçalı olarak organize edilmiştir

---

