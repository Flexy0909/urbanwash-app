import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import logo from "@/assets/urban-logo.png.asset.json";
import { saveStudent, generateCustomerId, type Student } from "@/lib/storage";

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>) => ({ ref: typeof s.ref === "string" ? s.ref : undefined }),
  component: Register,
});

const phoneRe = /^(\+2557\d{8}|\+2556\d{8}|07\d{8}|06\d{8})$/;

const HOSTELS = ["Hostel 1", "Hostel 2", "Hostel 3", "Hostel 4"];
const SERVICES = ["Washing", "Ironing", "Dry Cleaning"];
const OFFERS = ["10% OFF First Order", "Free Ironing of 1 Shirt", "Free Pickup for First Order", "Monthly Lucky Draw Entry"];

function Register() {
  const navigate = useNavigate();
  const { ref } = useSearch({ from: "/register" });

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [sameWhats, setSameWhats] = useState(true);
  const [whatsapp, setWhatsapp] = useState("");
  const [hostel, setHostel] = useState("");
  const [room, setRoom] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [offer, setOffer] = useState(OFFERS[0]);
  const [referral, setReferral] = useState<"Yes" | "No">("No");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isNumericRoom = hostel === "Hostel 1" || hostel === "Hostel 2";

  const schema = useMemo(() => z.object({
    fullName: z.string().trim().min(2, "Enter your full name").max(100),
    phone: z.string().regex(phoneRe, "Use 07XXXXXXXX, 06XXXXXXXX or +2557/6XXXXXXXX"),
    whatsapp: z.string().regex(phoneRe, "Invalid WhatsApp number"),
    hostel: z.string().min(1, "Select a hostel"),
    room: isNumericRoom
      ? z.string().regex(/^\d+$/, "Numbers only (e.g. 101)")
      : z.string().regex(/^[A-Za-z0-9]+$/, "Letters & numbers (e.g. H06B)"),
    services: z.array(z.string()).min(1, "Pick at least one service"),
    consent: z.literal(true, { message: "Consent required" }),
  }), [isNumericRoom]);

  function toggleService(s: string) {
    setServices((cur) => cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const wa = sameWhats ? phone : whatsapp;
    const data = { fullName: fullName.trim(), phone, whatsapp: wa, hostel, room: room.toUpperCase(), services, consent };
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      setSubmitting(false);
      return;
    }
    setErrors({});
    const student: Student = {
      customerId: generateCustomerId(),
      ...data,
      offer,
      referralStatus: referral,
      referredBy: ref,
      status: "Lead Registered",
      createdAt: new Date().toISOString(),
    };
    saveStudent(student);
    navigate({ to: "/success", search: { id: student.customerId } });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-20">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <Link to="/"><img src={logo.url} alt="Urban Wash" className="h-10 w-auto" /></Link>
          <Link to="/" className="text-sm text-muted-foreground">← Back</Link>
        </div>
      </header>

      <div className="bg-gradient-hero text-white text-center text-sm font-semibold py-2">
        🚚 FREE PICKUP & DELIVERY ALWAYS
      </div>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="text-2xl font-bold text-primary-deep">Student Registration</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Takes less than a minute. {ref && <span className="text-primary font-semibold">Referred by {ref}</span>}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-5 bg-card rounded-2xl p-5 md:p-7 shadow-card border border-border">
          <Field label="Full Name" error={errors.fullName}>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} placeholder="e.g. Amina Hassan" />
          </Field>

          <Field label="Phone Number" error={errors.phone} hint="07XXXXXXXX, 06XXXXXXXX or +2557XXXXXXXX">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="0712345678" inputMode="tel" />
          </Field>

          <div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={sameWhats} onChange={(e) => setSameWhats(e.target.checked)} className="accent-primary w-4 h-4" />
              WhatsApp number same as phone
            </label>
            {!sameWhats && (
              <div className="mt-3">
                <Field label="WhatsApp Number" error={errors.whatsapp}>
                  <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputCls} placeholder="0712345678" inputMode="tel" />
                </Field>
              </div>
            )}
          </div>

          <Field label="Hostel" error={errors.hostel}>
            <select value={hostel} onChange={(e) => { setHostel(e.target.value); setRoom(""); }} className={inputCls}>
              <option value="">Select hostel</option>
              {HOSTELS.map((h) => <option key={h}>{h}</option>)}
            </select>
          </Field>

          {hostel && (
            <Field
              label={isNumericRoom ? "Room Number" : "Room Code"}
              error={errors.room}
              hint={isNumericRoom ? "Numbers only (e.g. 101, 205, 312)" : "Letters & numbers (e.g. H06B, G12A, K03C)"}
            >
              <input
                value={room}
                onChange={(e) => setRoom(isNumericRoom ? e.target.value.replace(/\D/g, "") : e.target.value.replace(/[^A-Za-z0-9]/g, ""))}
                className={inputCls}
                placeholder={isNumericRoom ? "101" : "H06B"}
                inputMode={isNumericRoom ? "numeric" : "text"}
              />
            </Field>
          )}

          <div>
            <Label>Service Interest</Label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SERVICES.map((s) => {
                const active = services.includes(s);
                return (
                  <button type="button" key={s} onClick={() => toggleService(s)}
                    className={`px-3 py-3 rounded-xl border text-sm font-semibold transition ${active ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"}`}>
                    {active ? "✓ " : ""}{s}
                  </button>
                );
              })}
            </div>
            {errors.services && <p className="text-destructive text-xs mt-1">{errors.services}</p>}
          </div>

          <div>
            <Label>Choose Your Offer</Label>
            <div className="mt-2 space-y-2">
              {OFFERS.map((o) => (
                <label key={o} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${offer === o ? "border-primary bg-accent" : "border-border"}`}>
                  <input type="radio" name="offer" checked={offer === o} onChange={() => setOffer(o)} className="accent-primary" />
                  <span className="text-sm font-medium">{o}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label>Join our Referral Program?</Label>
            <div className="mt-2 flex gap-2">
              {(["Yes", "No"] as const).map((v) => (
                <button type="button" key={v} onClick={() => setReferral(v)}
                  className={`flex-1 px-4 py-2 rounded-xl border text-sm font-semibold ${referral === v ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}>{v}</button>
              ))}
            </div>
            {referral === "Yes" && (
              <p className="mt-2 text-xs text-primary-deep bg-accent p-3 rounded-lg">
                🎁 Refer 3 students and receive a <strong>FREE wash worth TZS 5,000</strong> (up to 5 clothes).
              </p>
            )}
          </div>

          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="accent-primary w-4 h-4 mt-0.5" />
            <span>I agree to receive laundry reminders, service updates and promotional offers from URBAN WASH via WhatsApp or SMS.</span>
          </label>
          {errors.consent && <p className="text-destructive text-xs">{errors.consent}</p>}

          <button type="submit" disabled={submitting}
            className="w-full bg-gradient-hero text-white py-4 rounded-xl font-bold text-lg shadow-soft hover:scale-[1.01] transition disabled:opacity-60">
            {submitting ? "Registering…" : "Complete Registration"}
          </button>
        </form>
      </main>
    </div>
  );
}

const inputCls = "w-full px-4 py-3 rounded-xl border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-semibold text-foreground">{children}</span>;
}
function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1.5">{children}</div>
      {hint && !error && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
