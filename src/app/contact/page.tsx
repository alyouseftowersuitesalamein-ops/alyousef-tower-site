"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type UnitModel = {
  id: string;
  title: string;
  area: number; // m2
  swatch: string;
};

const PHONE_LOCAL = "01557309555";
const PHONE_E164 = "201557309555"; // +20 بدون +
const FACEBOOK_URL = "https://www.facebook.com/share/1HXMJTLWoc/";

const MODELS: UnitModel[] = [
  { id: "model_1", title: "نموذج 1", area: 130, swatch: "bg-yellow-200" },
  { id: "model_2", title: "نموذج 2", area: 125, swatch: "bg-emerald-200" },
  { id: "model_3", title: "نموذج 3", area: 145, swatch: "bg-orange-200" },
  { id: "model_4", title: "نموذج 4", area: 135, swatch: "bg-cyan-200" },
  { id: "model_5", title: "نموذج 5", area: 140, swatch: "bg-lime-200" },
  { id: "model_6", title: "نموذج 6", area: 105, swatch: "bg-amber-200" },
];

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// ✅ يقبل أرقام فقط + يسمح بـ + ومسافة وشرطة ويتشالوا تلقائيًا
function sanitizePhoneInput(v: string) {
  return v
    .replace(/[^\d+\s-]/g, "") // يشيل أي حروف
    .replace(/\s+/g, " ") // يقلل المسافات
    .slice(0, 20); // حد أقصى منطقي
}

// ✅ جديد: تحويل 24h -> 12h للعرض في رسالة الواتس فقط
function formatTime12h(time24: string) {
  // متوقع "HH:MM"
  const m = /^(\d{1,2}):(\d{2})$/.exec(time24);
  if (!m) return time24;

  let hh = parseInt(m[1], 10);
  const mm = m[2];

  const isPM = hh >= 12;
  const suffix = isPM ? "م" : "ص";
  hh = hh % 12;
  if (hh === 0) hh = 12;

  return `${hh}:${mm} ${suffix}`;
}

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [modelId, setModelId] = useState(MODELS[0]?.id ?? "");

  const [visitDate, setVisitDate] = useState(todayISO());
  const [visitTime, setVisitTime] = useState("18:00");

  const [contactMethod, setContactMethod] = useState<"whatsapp" | "call">(
    "whatsapp"
  );

  const [note, setNote] = useState("");

  const selectedModel = useMemo(
    () => MODELS.find((m) => m.id === modelId) ?? MODELS[0],
    [modelId]
  );

  // ✅ رسالة واتساب: منظمة + وقت بصيغة 12 ساعة
  const whatsappText = useMemo(() => {
    const modelText = `${selectedModel.title} (${selectedModel.area} م²)`;
    const timeDisplay = visitTime ? formatTime12h(visitTime) : "—";
    const when =
      visitDate && visitTime ? `${visitDate} - ${timeDisplay}` : "لم يتم تحديد";
    const methodText = contactMethod === "whatsapp" ? "واتساب" : "اتصال";
    const n = note.trim() ? `\nملاحظة: ${note.trim()}` : "";

    return (
      `مرحبًا، أريد حجز معاينة لبرج اليوسف - العلمين.\n` +
      `الاسم: ${name || "—"}\n` +
      `الموبايل: ${phone || "—"}\n` +
      `النموذج: ${modelText}\n` +
      `الموعد المقترح: ${when}\n` +
      `طريقة التواصل: ${methodText}${n}`
    );
  }, [name, phone, selectedModel, visitDate, visitTime, note, contactMethod]);

  const WHATSAPP_DEEPLINK = useMemo(() => {
    return `https://wa.me/${PHONE_E164}?text=${encodeURIComponent(whatsappText)}`;
  }, [whatsappText]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setDone(null);

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (trimmedName.length < 2) return setErr("الاسم قصير جدًا.");
    if (trimmedPhone.length < 8) return setErr("رقم الموبايل غير صحيح.");
    if (!visitDate) return setErr("اختار تاريخ المعاينة.");
    if (!visitTime) return setErr("اختار وقت المعاينة.");

    setLoading(true);
    try {
      const unitType = `${selectedModel.title} • ${selectedModel.area} م²`;

      // ✅ message الآن: note فقط
      const message = note.trim() ? note.trim() : "";

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          phone: trimmedPhone,
          unit_type: unitType,
          message,
          source: "alyousef-tower-contact",
          website: "",

          // ✅ أعمدة مستقلة (تُحفظ بصيغة 24 ساعة لثبات البيانات)
          preferred_date: visitDate,
          preferred_time: visitTime,
          preferred_contact: contactMethod,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setErr(data.error || "حصل خطأ أثناء إرسال الطلب. جرّب تاني.");
      } else {
        setDone("تم إرسال طلبك ✅ فريق المبيعات هيتواصل معك قريبًا.");
        setName("");
        setPhone("");
        setNote("");
        setContactMethod("whatsapp");
        setModelId(MODELS[0]?.id ?? "");
        setVisitDate(todayISO());
        setVisitTime("18:00");
      }
    } catch {
      setErr("مشكلة اتصال. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070a] text-white">
      {/* Background: premium */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-90 [background:radial-gradient(1200px_700px_at_50%_20%,rgba(255,255,255,0.06),transparent_55%),radial-gradient(900px_600px_at_80%_-10%,rgba(247,210,122,0.18),transparent_60%),radial-gradient(900px_700px_at_10%_10%,rgba(214,168,74,0.12),transparent_60%),radial-gradient(900px_700px_at_50%_115%,rgba(184,135,47,0.10),transparent_60%)]" />
        <div className="absolute inset-0 opacity-30 [background:linear-gradient(120deg,transparent,rgba(247,210,122,0.10),transparent)]" />
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:140px_140px]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22n%22 x=%220%22 y=%220%22 width=%22100%25%22 height=%22100%25%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/></filter><rect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22 opacity=%220.55%22/></svg>')]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl soft-ring">
              <Image
                src="/logo.jpeg"
                alt="AlYousef Tower Suites Alamein"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="leading-tight">
              <p className="font-[var(--font-cinzel)] text-sm tracking-[0.18em] text-white/90">
                ALYOUSEF
              </p>
              <p className="text-xs text-white/55">TOWER SUITES • ALAMEIN</p>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-2xl px-3 py-2 text-xs text-white/85 ring-1 ring-white/10 hover:bg-white/5 sm:px-4 sm:text-sm"
            >
              الرئيسية
            </Link>
            <Link
              href="/gallery"
              className="rounded-2xl px-3 py-2 text-xs text-white/85 ring-1 ring-white/10 hover:bg-white/5 sm:px-4 sm:text-sm"
            >
              الجاليري
            </Link>
          </nav>
        </header>

        {/* Body */}
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Left: info */}
          <section className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold-2)]" />
              تواصل سريع • حجز معاينة • اختيار نموذج
            </div>

            <h1 className="text-balance text-3xl font-semibold leading-tight md:text-5xl">
              <span className="font-[var(--font-cinzel)]">Contact</span>
              <span className="mx-2 text-white/40">/</span>
              <span className="gold-text font-[var(--font-cinzel)]">Booking</span>
            </h1>

            <p className="text-white/70 leading-relaxed">
              اختر النموذج والمساحة، وحدد موعد المعاينة المناسب، وسيتم التواصل معك
              فورًا لتأكيد التفاصيل والأسعار.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              <a
                href={`tel:${PHONE_LOCAL}`}
                className="glass rounded-2xl p-4 soft-ring hover:bg-white/5 transition"
              >
                <p className="text-xs text-white/55">اتصال مباشر</p>
                <p className="mt-1 text-sm font-semibold">{PHONE_LOCAL}</p>
              </a>

              <a
                href={WHATSAPP_DEEPLINK}
                target="_blank"
                rel="noreferrer"
                className="glass rounded-2xl p-4 soft-ring hover:bg-white/5 transition"
              >
                <p className="text-xs text-white/55">واتساب برسالة جاهزة</p>
                <p className="mt-1 text-sm font-semibold">فتح المحادثة</p>
              </a>

              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                className="glass rounded-2xl p-4 soft-ring hover:bg-white/5 transition"
              >
                <p className="text-xs text-white/55">Facebook</p>
                <p className="mt-1 text-sm font-semibold">زيارة الصفحة</p>
              </a>
            </div>

            <p className="text-xs text-white/45">
              * الصور/التصوّرات قد تكون تصميمية للشكل المتوقع وقد تختلف التفاصيل النهائية حسب التنفيذ.
            </p>
          </section>

          {/* Right */}
          <section className="glass rounded-3xl p-6 soft-ring">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold">اختيار النموذج + حجز المعاينة</h2>
              <span className="w-fit rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
                سريع • بروفيشنال • آمن
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {MODELS.map((m) => {
                const active = m.id === selectedModel?.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setModelId(m.id)}
                    className={[
                      "text-right rounded-2xl p-4 ring-1 transition",
                      "min-h-[76px]",
                      active
                        ? "ring-[var(--gold-2)] bg-white/10"
                        : "ring-white/10 bg-white/5 hover:bg-white/7",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{m.title}</p>
                        <p className="mt-1 text-xs text-white/60">{m.area} م²</p>
                      </div>
                      <span
                        className={`h-7 w-7 rounded-lg ring-1 ring-black/30 ${m.swatch}`}
                        aria-hidden
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <form onSubmit={submit} className="mt-6 grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-white/60">الاسم</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl bg-black/40 p-3 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-[var(--gold-2)]"
                    placeholder="اكتب اسمك"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-white/60">رقم الموبايل</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
                    className="w-full rounded-2xl bg-black/40 p-3 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-[var(--gold-2)]"
                    placeholder="مثال: 01xxxxxxxxx"
                    inputMode="tel"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-white/60">النموذج المختار</label>
                  <div className="rounded-2xl bg-black/40 p-3 text-sm ring-1 ring-white/10">
                    <span className="font-semibold">{selectedModel.title}</span>
                    <span className="mx-2 text-white/40">•</span>
                    <span className="text-white/80">{selectedModel.area} م²</span>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs text-white/60">طريقة التواصل</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setContactMethod("whatsapp")}
                      className={[
                        "rounded-2xl px-4 py-3 text-sm ring-1 transition",
                        contactMethod === "whatsapp"
                          ? "gold-gradient text-black ring-[var(--gold-2)]"
                          : "bg-white/5 text-white ring-white/10 hover:bg-white/7",
                      ].join(" ")}
                    >
                      واتساب
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactMethod("call")}
                      className={[
                        "rounded-2xl px-4 py-3 text-sm ring-1 transition",
                        contactMethod === "call"
                          ? "gold-gradient text-black ring-[var(--gold-2)]"
                          : "bg-white/5 text-white ring-white/10 hover:bg-white/7",
                      ].join(" ")}
                    >
                      اتصال
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-white/60">تاريخ المعاينة</label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    min={todayISO()}
                    className="w-full rounded-2xl bg-black/40 p-3 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-[var(--gold-2)]"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-white/60">وقت المعاينة</label>
                  <input
                    type="time"
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full rounded-2xl bg-black/40 p-3 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-[var(--gold-2)]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-white/60">ملاحظات (اختياري)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-2xl bg-black/40 p-3 text-sm ring-1 ring-white/10 focus:outline-none focus:ring-[var(--gold-2)]"
                  placeholder="اكتب أي تفاصيل إضافية..."
                  rows={3}
                />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  disabled={loading}
                  type="submit"
                  className="rounded-2xl px-6 py-3 text-sm font-semibold text-black gold-gradient hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "جاري الإرسال..." : "إرسال طلب الحجز"}
                </button>

                <a
                  href={WHATSAPP_DEEPLINK}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl px-6 py-3 text-center text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/5"
                >
                  فتح واتساب برسالة جاهزة
                </a>
              </div>

              {done && (
                <div className="rounded-2xl bg-emerald-500/10 p-3 text-sm text-emerald-200 ring-1 ring-emerald-500/20">
                  {done}
                </div>
              )}
              {err && (
                <div className="rounded-2xl bg-red-500/10 p-3 text-sm text-red-200 ring-1 ring-red-500/20">
                  {err}
                </div>
              )}

              <p className="text-xs text-white/45">
                بالضغط على “إرسال” أنت توافق على تواصل فريق المبيعات معك لتأكيد تفاصيل المعاينة.
              </p>
            </form>
          </section>
        </div>

        <div className="md:hidden sticky bottom-4 mt-10">
          <div className="mx-auto grid max-w-md grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-black/60 p-3 backdrop-blur">
            <a
              href={`tel:${PHONE_LOCAL}`}
              className="rounded-xl px-4 py-3 text-center text-sm text-white/90 ring-1 ring-white/10"
            >
              اتصال
            </a>
            <a
              href={WHATSAPP_DEEPLINK}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-black gold-gradient"
            >
              واتساب
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
