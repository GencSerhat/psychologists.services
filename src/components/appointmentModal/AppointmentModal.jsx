import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { ref, push, set } from "firebase/database";
import { db } from "../../services/firebase.js";
import { useAuth } from "../../store/auth.jsx";
import styles from "./AppointmentModal.module.css";

const schema = yup.object({
  name: yup.string().min(2, "En az 2 karakter").required("Ad soyad zorunludur"),
  phone: yup.string().min(6, "Geçerli bir telefon girin").required("Telefon zorunludur"),
  time: yup.string().required("Saat zorunludur"),
  email: yup.string().email("Geçerli e-posta girin").required("E-posta zorunludur"),
  message: yup.string().min(10, "En az 10 karakter").required("Mesaj zorunludur")
});

export default function AppointmentModal({ psych, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched"
  });

  const onSubmit = async (values) => {
    setFormError("");
    if (!user) {
      onClose?.();
      navigate("/", { state: { requireAuth: true } });
      return;
    }
    try {
      const dst = push(ref(db, `appointments/${user.uid}`));
      await set(dst, {
        psychologistId: psych.id,
        name: values.name,
        phone: values.phone,
        time: values.time,
        email: values.email,
        message: values.message,
        createdAt: Date.now()
      });
      reset();
      onClose?.();
      alert("Başvurunuz gönderildi!");
    } catch {
      setFormError("Gönderim başarısız. Lütfen tekrar deneyin.");
    }
  };

  if (!psych) return null;

  return (
    <div className={styles.wrap}>
      <div className={styles.bigTitle}>Make an appointment with a psychologists</div>
      <div className={styles.bigSubtitle}>
        You are on the verge of changing your life for the better. Fill out the short form below to book your personal appointment with a professional psychologist. We guarantee confidentiality and respect for your privacy.
      </div>

      <div className={styles.doc}>
        <img className={styles.docAvatar} src={psych.avatar_url} alt={psych.name} />
        <div className={styles.docMeta}>
          <span className={styles.docLabel}>Your psychologists</span>
          <span className={styles.docName}>{psych.name}</span>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.field}>
          <input
            className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
            placeholder="Name"
            {...register("name")}
          />
          {errors.name && <span className={styles.error}>{errors.name.message}</span>}
        </div>

        <div className={styles.row}>
          <div className={styles.half}>
            <input
              className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
              placeholder="+380"
              {...register("phone")}
            />
            {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
          </div>
          <div className={styles.half}>
            <input
              type="time"
              className={`${styles.input} ${errors.time ? styles.inputError : ""}`}
              placeholder="00:00"
              {...register("time")}
            />
            {errors.time && <span className={styles.error}>{errors.time.message}</span>}
          </div>
        </div>

        <div className={styles.field}>
          <input
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            placeholder="Email"
            type="email"
            {...register("email")}
          />
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </div>

        <div className={styles.field}>
          <textarea
            className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
            placeholder="Comment"
            {...register("message")}
          />
          {errors.message && <span className={styles.error}>{errors.message.message}</span>}
        </div>

        {formError && <div className={styles.error}>{formError}</div>}

        <div className={styles.actions}>
          <button type="submit" className={styles.submit} disabled={isSubmitting}>
            {isSubmitting ? "Gönderiliyor..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
