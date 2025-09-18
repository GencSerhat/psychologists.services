import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../services/firebase.js";
import styles from "./AuthModal.module.css";

const loginSchema = yup.object({
  email: yup.string().email("Geçerli bir e-posta girin").required("E-posta zorunludur"),
  password: yup.string().min(6, "En az 6 karakter").required("Şifre zorunludur")
});

const registerSchema = yup.object({
  name: yup.string().min(2, "En az 2 karakter").required("Ad soyad zorunludur"),
  email: yup.string().email("Geçerli bir e-posta girin").required("E-posta zorunludur"),
  password: yup.string().min(6, "En az 6 karakter").required("Şifre zorunludur"),
  confirm: yup
    .string()
    .oneOf([yup.ref("password")], "Şifreler eşleşmiyor")
    .required("Tekrar şifre zorunludur")
});

export default function AuthModal() {
  const [tab, setTab] = useState("login");

  const [showPwdLogin, setShowPwdLogin] = useState(false);
  const [showPwdReg, setShowPwdReg] = useState(false);

  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [registerInfo, setRegisterInfo] = useState("");

  // LOGIN FORM
  const {
    register: regLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: loginSubmitting }
  } = useForm({ resolver: yupResolver(loginSchema), mode: "onTouched" });

  const onLogin = async (values) => {
    setLoginError("");
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      console.log("login success");
    } catch (e) {
      const map = {
        "auth/invalid-email": "E-posta geçersiz.",
        "auth/user-disabled": "Hesap devre dışı.",
        "auth/user-not-found": "Kullanıcı bulunamadı.",
        "auth/wrong-password": "Şifre hatalı.",
        "auth/too-many-requests": "Çok fazla deneme. Bir süre sonra tekrar deneyin."
      };
      setLoginError(map[e.code] || "Giriş başarısız. Bilgileri kontrol edin.");
    }
  };

  // REGISTER FORM
  const {
    register: regRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: registerSubmitting },
    reset: resetRegister
  } = useForm({ resolver: yupResolver(registerSchema), mode: "onTouched" });

  const onRegister = async ({ name, email, password }) => {
    setRegisterError("");
    setRegisterInfo("");
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      setRegisterInfo("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      resetRegister({ name: "", email: "", password: "", confirm: "" });
      setTab("login");
    } catch (e) {
      const map = {
        "auth/email-already-in-use": "Bu e-posta zaten kayıtlı.",
        "auth/invalid-email": "E-posta geçersiz.",
        "auth/weak-password": "Şifre çok zayıf (min 6 karakter)."
      };
      setRegisterError(map[e.code] || "Kayıt başarısız. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>{tab === "login" ? "Log In" : "Create account"}</div>
      <div className={styles.subtitle}>
        Welcome back! Please enter your credentials to access your account and continue your search for a psychologist.
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === "login" ? styles.tabActive : ""}`} onClick={() => setTab("login")}>
          Giriş
        </button>
        <button className={`${styles.tab} ${tab === "register" ? styles.tabActive : ""}`} onClick={() => setTab("register")}>
          Kayıt
        </button>
      </div>

      {tab === "login" && (
        <form className={styles.form} onSubmit={handleLoginSubmit(onLogin)} noValidate>
          <div className={styles.field}>
            <input type="email" placeholder="Email" className={`${styles.input} ${loginErrors.email ? styles.inputError : ""}`} {...regLogin("email")} />
            {loginErrors.email && <span className={styles.error}>{loginErrors.email.message}</span>}
          </div>

          <div className={styles.field}>
            <input
              type={showPwdLogin ? "text" : "password"}
              placeholder="Password"
              className={`${styles.input} ${loginErrors.password ? styles.inputError : ""}`}
              {...regLogin("password")}
            />
            <button type="button" className={styles.eye} onClick={() => setShowPwdLogin((v) => !v)} aria-label="Şifreyi göster/gizle">👁</button>
            {loginErrors.password && <span className={styles.error}>{loginErrors.password.message}</span>}
          </div>

          <button type="submit" className={styles.submit} disabled={loginSubmitting}>
            {loginSubmitting ? "Gönderiliyor..." : "Log in"}
          </button>
          {loginError && <div className={styles.error}>{loginError}</div>}
          {registerInfo && <div style={{fontSize:12, color:"#16a34a"}}>{registerInfo}</div>}
        </form>
      )}

      {tab === "register" && (
        <form className={styles.form} onSubmit={handleRegisterSubmit(onRegister)} noValidate>
          <div className={styles.field}>
            <input type="text" placeholder="Full name" className={`${styles.input} ${registerErrors.name ? styles.inputError : ""}`} {...regRegister("name")} />
            {registerErrors.name && <span className={styles.error}>{registerErrors.name.message}</span>}
          </div>

          <div className={styles.field}>
            <input type="email" placeholder="Email" className={`${styles.input} ${registerErrors.email ? styles.inputError : ""}`} {...regRegister("email")} />
            {registerErrors.email && <span className={styles.error}>{registerErrors.email.message}</span>}
          </div>

          <div className={styles.field}>
            <input
              type={showPwdReg ? "text" : "password"}
              placeholder="Password"
              className={`${styles.input} ${registerErrors.password ? styles.inputError : ""}`}
              {...regRegister("password")}
            />
            <button type="button" className={styles.eye} onClick={() => setShowPwdReg((v) => !v)} aria-label="Şifreyi göster/gizle">👁</button>
            {registerErrors.password && <span className={styles.error}>{registerErrors.password.message}</span>}
          </div>

          <div className={styles.field}>
            <input type="password" placeholder="Confirm password" className={`${styles.input} ${registerErrors.confirm ? styles.inputError : ""}`} {...regRegister("confirm")} />
            {registerErrors.confirm && <span className={styles.error}>{registerErrors.confirm.message}</span>}
          </div>

          <button type="submit" className={styles.submit} disabled={registerSubmitting}>
            {registerSubmitting ? "Gönderiliyor..." : "Create account"}
          </button>
          {registerError && <div className={styles.error}>{registerError}</div>}
        </form>
      )}
    </div>
  );
}
