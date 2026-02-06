"use client";

import { useState } from "react";

export default function LeadForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setDone(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);

    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      unit_type: String(fd.get("unit_type") ?? ""),
      message: String(fd.get("message") ?? ""),
      source: "alyousef-tower",
      website: String(fd.get("website") ?? ""), // honeypot
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setErr(data.error || "حصل خطأ، جرّب تاني.");
      } else {
        setDone("تم إرسال طلبك ✅ هنكلمك قريب.");
        (e.currentTarget as HTMLFormElement).reset();
      }
    } catch {
      setErr("مشكلة اتصال. حاول تاني.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md space-y-3">
      {/* Honeypot hidden */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" />

      <input
        name="name"
        placeholder="الاسم"
        required
        className="w-full rounded-xl border p-3"
      />

      <input
        name="phone"
        placeholder="رقم الموبايل"
        inputMode="tel"
        required
        className="w-full rounded-xl border p-3"
      />

      <select name="unit_type" defaultValue="" className="w-full rounded-xl border p-3">
        <option value="">نوع الوحدة (اختياري)</option>
        <option value="شقة">شقة</option>
        <option value="سويت">سويت</option>
        <option value="استثمار">استثمار</option>
      </select>

      <textarea
        name="message"
        placeholder="رسالة / وقت مناسب للاتصال (اختياري)"
        rows={3}
        className="w-full rounded-xl border p-3"
      />

      <button
        disabled={loading}
        type="submit"
        className="w-full rounded-xl bg-black px-4 py-3 font-semibold text-white disabled:opacity-60"
      >
        {loading ? "جاري الإرسال..." : "احجز معاينة / اطلب التفاصيل"}
      </button>

      {done && <p className="text-sm">{done}</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}
    </form>
  );
}
