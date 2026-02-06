import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070a] text-white">
      {/* Background: premium luxury (grain + vignette + glow + subtle grid) */}
      <div className="pointer-events-none absolute inset-0">
        {/* Vignette */}
        <div className="absolute inset-0 [background:radial-gradient(1200px_700px_at_50%_20%,rgba(255,255,255,0.06),transparent_55%),radial-gradient(900px_600px_at_80%_-10%,rgba(247,210,122,0.18),transparent_60%),radial-gradient(900px_700px_at_10%_10%,rgba(214,168,74,0.12),transparent_60%),radial-gradient(900px_700px_at_50%_115%,rgba(184,135,47,0.10),transparent_60%)] opacity-90" />

        {/* Soft diagonal sheen */}
        <div className="absolute inset-0 opacity-35 [background:linear-gradient(120deg,transparent,rgba(247,210,122,0.10),transparent)]" />

        {/* Premium subtle grid */}
        <div className="absolute inset-0 opacity-25 [background:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:120px_120px]" />

        {/* Film grain */}
        <div className="absolute inset-0 opacity-[0.08] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22n%22 x=%220%22 y=%220%22 width=%22100%25%22 height=%22100%25%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/></filter><rect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22 opacity=%220.55%22/></svg>')]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10">
        {/* Top Nav */}
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

          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/gallery"
              className="rounded-2xl px-4 py-2 text-sm text-white/80 ring-1 ring-white/10 hover:bg-white/5"
            >
              الجاليري
            </Link>
            <Link
              href="/contact"
              className="rounded-2xl px-4 py-2 text-sm font-semibold text-black gold-gradient hover:opacity-90"
            >
              تواصل / حجز معاينة
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="grid flex-1 items-center gap-10 pt-10 md:grid-cols-2 md:pt-16">
          {/* Left */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold-2)]" />
              برج تحت الإنشاء • تصوّرات تصميمية للشكل المتوقع
            </div>

            <h1 className="text-balance text-4xl font-semibold leading-tight md:text-6xl">
              <span className="font-[var(--font-cinzel)] tracking-tight">
                AlYousef Tower Suites
              </span>
              <span className="mt-2 block gold-text font-[var(--font-cinzel)]">
                Alamein
              </span>
            </h1>

            <p className="text-pretty text-base leading-relaxed text-white/70 md:text-lg">
              برج اليوسف في العلمين — رؤية سكنية فاخرة بتفاصيل فندقية. واجهة راقية،
              تشطيبات محسوبة، ومساحات عملية تناسب السكن والاستثمار، مع خدمات ترفع
              مستوى الراحة والأمان.
            </p>

            {/* New: value bullets */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="glass rounded-2xl p-4">
                <p className="text-xs text-white/55">أسلوب الحياة</p>
                <p className="mt-1 text-sm font-semibold">
                  تجربة فندقية • مدخل فخم • إدارة راقية
                </p>
              </div>
              <div className="glass rounded-2xl p-4">
                <p className="text-xs text-white/55">راحة وطمأنينة</p>
                <p className="mt-1 text-sm font-semibold">
                  أمن وحراسة • نظام دخول منظم • خدمة عملاء
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/gallery"
                className="rounded-2xl px-6 py-3 text-center text-sm font-semibold text-black gold-gradient hover:opacity-90"
              >
                مشاهدة الجاليري
              </Link>
              <Link
                href="/contact"
                className="rounded-2xl px-6 py-3 text-center text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/5"
              >
                تواصل وحجز معاينة
              </Link>
            </div>

            {/* Feature strip */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="glass rounded-2xl p-4">
                <p className="text-xs text-white/55">الموقع</p>
                <p className="mt-1 text-sm font-semibold">العلمين</p>
                <p className="mt-1 text-xs text-white/55">
                  قرب الخدمات والمولات والمعالم
                </p>
              </div>
              <div className="glass rounded-2xl p-4">
                <p className="text-xs text-white/55">الحالة</p>
                <p className="mt-1 text-sm font-semibold">تحت الإنشاء</p>
                <p className="mt-1 text-xs text-white/55">
                  متابعة التنفيذ خطوة بخطوة
                </p>
              </div>
              <div className="glass rounded-2xl p-4">
                <p className="text-xs text-white/55">الوحدات</p>
                <p className="mt-1 text-sm font-semibold">شقق • سويت</p>
                <p className="mt-1 text-xs text-white/55">
                  مناسبة للسكن والاستثمار
                </p>
              </div>
            </div>
          </div>

          {/* Right: premium card */}
          <div className="relative">
            <div className="glass rounded-3xl p-6 soft-ring">
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/70">AlYousef Tower</p>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
                  Luxury • Suites
                </span>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl ring-1 ring-white/10">
                <Image
                  src="/logo.jpeg"
                  alt="Brand visual"
                  width={1200}
                  height={700}
                  className="h-[260px] w-full object-cover opacity-95"
                />
              </div>

              {/* New: highlights list */}
              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <p className="text-xs text-white/55">مميزات أساسية</p>
                  <p className="mt-1 text-sm font-semibold">
                    مصاعد فاخرة • مدخل فندقي • أمن وحراسة
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs text-white/55">مناسب لـ</p>
                    <p className="mt-1 text-sm font-semibold">
                      سكن • مصيف • استثمار
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs text-white/55">الأسعار</p>
                    <p className="mt-1 text-sm font-semibold">
                      عند التواصل
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-white/45">
                * الصور المعروضة قد تكون تصوّرات تصميمية للشكل المتوقع، وقد تختلف
                التفاصيل النهائية حسب التنفيذ.
              </p>
            </div>

            {/* floating glow */}
            <div className="pointer-events-none absolute -right-12 -top-10 h-64 w-64 rounded-full bg-[var(--gold-2)]/14 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-[var(--gold-1)]/10 blur-3xl" />
          </div>
        </section>

        {/* Mobile bottom actions */}
        <div className="md:hidden sticky bottom-4">
          <div className="mx-auto flex max-w-md gap-3 rounded-2xl border border-white/10 bg-black/60 p-3 backdrop-blur">
            <Link
              href="/gallery"
              className="flex-1 rounded-xl px-4 py-3 text-center text-sm text-white/90 ring-1 ring-white/10"
            >
              الجاليري
            </Link>
            <Link
              href="/contact"
              className="flex-1 rounded-xl px-4 py-3 text-center text-sm font-semibold text-black gold-gradient"
            >
              تواصل / حجز
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
