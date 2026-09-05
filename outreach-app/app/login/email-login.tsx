"use client";

import { FormEvent, useState } from "react";

export function EmailLogin() {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestCode() {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/auth/email/request", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось отправить код");
      setStep("verify");
      setMessage(`Код отправлен на ${data.email}`);
    } catch (value) {
      setError(value instanceof Error ? value.message : "Не удалось отправить код");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/email/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось войти");
      window.location.href = data.redirect || "/dashboard";
    } catch (value) {
      setError(value instanceof Error ? value.message : "Не удалось войти");
    } finally {
      setLoading(false);
    }
  }

  if (step === "request") {
    return (
      <div>
        {error ? <div className="alert error">{error}</div> : null}
        <button className="button primary large" type="button" onClick={requestCode} disabled={loading}>
          {loading ? "Отправляю код…" : "Получить код на Gmail"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={verifyCode}>
      {message ? <div className="alert success">{message}</div> : null}
      {error ? <div className="alert error">{error}</div> : null}
      <label>
        Код из письма
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="000000"
          required
        />
      </label>
      <button className="button primary large" type="submit" disabled={loading || code.length !== 6}>
        {loading ? "Проверяю…" : "Войти"}
      </button>
      <button className="button ghost" type="button" onClick={requestCode} disabled={loading}>
        Отправить код ещё раз
      </button>
    </form>
  );
}
