import { NextResponse } from "next/server";
import { turso } from "../../../lib/turso";

function normalizePhone(phone: string) {
  return phone.replace(/\s+/g, "").replace(/^\+?2?/, ""); // يشيل +20 أو 2 لو موجود
}

function safeText(v: unknown) {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
    }

    const name = String(body.name ?? "").trim();
    const phoneRaw = String(body.phone ?? "").trim();

    const unitType = String(body.unit_type ?? "").trim();
    const message = String(body.message ?? "").trim();
    const source = String(body.source ?? "website").trim();

    // ✅ جديد: بيانات الموعد وطريقة التواصل (اختيارية)
    const preferredDate = safeText(body.preferred_date);
    const preferredTime = safeText(body.preferred_time);
    const preferredContact = safeText(body.preferred_contact); // "whatsapp" | "call" | أي نص

    // Honeypot anti-spam
    const hp = String(body.website ?? "").trim(); // hidden input name="website"
    if (hp.length) return NextResponse.json({ ok: true });

    if (name.length < 2) {
      return NextResponse.json({ ok: false, error: "Name too short" }, { status: 400 });
    }
    if (phoneRaw.length < 8) {
      return NextResponse.json({ ok: false, error: "Phone invalid" }, { status: 400 });
    }

    const phone = normalizePhone(phoneRaw);

    await turso.execute({
      sql: `
        INSERT INTO leads
          (name, phone, unit_type, message, source, preferred_date, preferred_time, preferred_contact)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        name,
        phone,
        unitType || null,
        message || null,
        source || "website",
        preferredDate,
        preferredTime,
        preferredContact,
      ],
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
