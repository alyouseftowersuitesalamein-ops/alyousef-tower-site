"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type GalleryItem =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster?: string; title: string; note?: string };

const ITEMS: GalleryItem[] = [
  {
    type: "video",
    src: "/tower.mp4",
    poster: "video-poster.png", // لو مش موجودة هنfallback للّوجو
    title: "فيديو تعريفي — AlYousef Tower Suites",
    note: "الفيديو تعريفي للمشروع — الصور بالأسفل هي التصوّرات المعتمدة لشكل البرج.",
  },

  // ✅ صور الجاليري — غيّر الأسماء حسب ملفاتك داخل public/gallery/
  { type: "image", src: "/1.jpeg", alt: "AlYousef Tower Render 1" },
  { type: "image", src: "/2.jpeg", alt: "AlYousef Tower Render 2" },
  { type: "image", src: "/3.jpeg", alt: "AlYousef Tower Render 3" },
  { type: "image", src: "/4.jpeg", alt: "AlYousef Tower Render 4" },
  { type: "image", src: "/5.jpeg", alt: "AlYousef Tower Render 5" },
  { type: "image", src: "/6.jpeg", alt: "AlYousef Tower Render 6" },
];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null
  );

  const videoItem = useMemo(
    () => ITEMS.find((x) => x.type === "video") as Extract<GalleryItem, { type: "video" }> | undefined,
    []
  );

  const images = useMemo(
    () => ITEMS.filter((x) => x.type === "image") as Extract<GalleryItem, { type: "image" }>[],
    []
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070a] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-90 [background:radial-gradient(1200px_700px_at_50%_20%,rgba(255,255,255,0.06),transparent_55%),radial-gradient(900px_600px_at_80%_-10%,rgba(247,210,122,0.18),transparent_60%),radial-gradient(900px_700px_at_10%_10%,rgba(214,168,74,0.12),transparent_60%),radial-gradient(900px_700px_at_50%_115%,rgba(184,135,47,0.10),transparent_60%)]" />
        <div className="absolute inset-0 opacity-25 [background:linear-gradient(120deg,transparent,rgba(247,210,122,0.10),transparent)]" />
        <div className="absolute inset-0 opacity-20 [background:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:140px_140px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
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
              href="/contact"
              className="rounded-2xl px-3 py-2 text-xs font-semibold text-black gold-gradient hover:opacity-90 sm:px-4 sm:text-sm"
            >
              تواصل / حجز
            </Link>
          </nav>
        </header>

        {/* Title */}
        <section className="mt-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold-2)]" />
            جاليري المشروع • صور + فيديو
          </div>

          <h1 className="text-balance text-3xl font-semibold leading-tight md:text-5xl">
            <span className="font-[var(--font-cinzel)]">Gallery</span>
            <span className="mx-2 text-white/35">/</span>
            <span className="gold-text font-[var(--font-cinzel)]">AlYousef Tower</span>
          </h1>

        </section>

        {/* Video Section */}
        {videoItem && (
          <section className="mt-8 glass rounded-3xl p-5 soft-ring">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-white/70">فيديو</p>
                <h2 className="mt-1 text-lg font-semibold">{videoItem.title}</h2>
                {videoItem.note && (
                  <p className="mt-2 text-xs text-white/55">{videoItem.note}</p>
                )}
              </div>

              <div className="flex gap-2">
                <a
                  href={videoItem.src}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl px-4 py-2 text-sm text-white/85 ring-1 ring-white/10 hover:bg-white/5"
                >
                  فتح الفيديو
                </a>
                <Link
                  href="/contact"
                  className="rounded-2xl px-4 py-2 text-sm font-semibold text-black gold-gradient hover:opacity-90"
                >
                  احجز معاينة
                </Link>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-white/10 bg-black/30">
              <video
                className="h-[220px] w-full object-cover sm:h-[300px] md:h-[600px]"
                controls
                playsInline
                preload="metadata"
                poster={videoItem.poster}
                onError={(e) => {
                  // لو البوستر مش موجود، بعض المتصفحات لا تهم — الفيديو يشتغل عادي
                }}
              >
                <source src={videoItem.src} type="video/mp4" />
                المتصفح لا يدعم تشغيل الفيديو.
              </video>

              {/* Poster fallback visual (لو poster مش موجود، ده بيظهر قبل التشغيل في الحالة العادية poster بس) */}
              {/* مفيش حاجة إضافية هنا عشان لا نعقد الأمور */}
            </div>

          </section>
        )}

        {/* Images Grid */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-white/70">صور</p>
              <h2 className="mt-1 text-lg font-semibold">تصوّرات وتصميمات البرج</h2>
            </div>

            <span className="hidden sm:inline-flex rounded-full bg-white/5 px-3 py-1 text-xs text-white/70 ring-1 ring-white/10">
              اضغط على أي صورة للتكبير
            </span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => (
              <button
                key={img.src}
                type="button"
                onClick={() => setLightbox({ src: img.src, alt: img.alt })}
                className="group overflow-hidden rounded-3xl ring-1 ring-white/10 bg-white/5 hover:bg-white/7 transition text-left"
              >
                <div className="relative h-[280px] w-full">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-white/90 line-clamp-1">
                    {img.alt}
                  </p>
                  <p className="mt-1 text-xs text-white/55">اضغط للتكبير</p>
                </div>
              </button>
            ))}
          </div>

        </section>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="mx-auto flex h-full max-w-5xl items-center justify-center p-4">
            <div
              className="relative w-full overflow-hidden rounded-3xl ring-1 ring-white/15 bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={lightbox.src}
                  alt={lightbox.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              <div className="flex items-center justify-between gap-3 p-4">
                <p className="text-sm text-white/80">{lightbox.alt}</p>
                <button
                  type="button"
                  onClick={() => setLightbox(null)}
                  className="rounded-2xl px-4 py-2 text-sm text-white/85 ring-1 ring-white/10 hover:bg-white/5"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
