import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import logo from "@/assets/urban-logo.png.asset.json";
import { saveStudent, generateCustomerId, syncWithCloud, type Student } from "@/lib/storage";
import {
  CheckCircle2,
  User,
  Phone,
  Home,
  Gift,
  CheckSquare,
  MessageSquare,
  AlertCircle,
  Clock,
  Zap,
  RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>): { ref?: string } => ({
    ref: typeof s.ref === "string" ? s.ref : undefined,
  }),
  component: Register,
});

// Regex for Tanzania phone numbers: 07XXXXXXXX, 06XXXXXXXX, +2557XXXXXXXX, +2556XXXXXXXX
const phoneRe = /^(\+255[67]\d{8}|0[67]\d{8})$/;

const HOSTELS = ["Hostel 1", "Hostel 2", "Hostel 3", "Hostel 4"];
const SERVICES = ["Washing", "Ironing", "Wash & Iron"];
const OFFERS = [
  "10% OFF First Order",
  "Free Ironing of 1 Shirt",
];

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
  const serviceSpeed = "Standard";

  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [isAgentMode, setIsAgentMode] = useState(!ref); // Default to Agent Mode if no ref link, else Student Mode
  const [showPitchCard, setShowPitchCard] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
       setIsOnline(true);
       // Auto-trigger sync when back online
       syncWithCloud().catch((err) => {
         console.error("Online transition sync failed:", err);
       });
     };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const isNumericRoom = hostel === "Hostel 1" || hostel === "Hostel 2";

  // Validate the phone format with local display helpers
  const cleanPhone = (val: string) => {
    return val.replace(/\s+/g, ""); // strip spaces
  };

  const schema = useMemo(() => {
    return z.object({
      fullName: z
        .string()
        .trim()
        .min(2, "Please enter your full name (minimum 2 characters)")
        .max(100, "Name is too long"),
      phone: z
        .string()
        .transform(cleanPhone)
        .refine((val) => phoneRe.test(val), {
          message: "Enter a valid TZ number (e.g. 07XXXXXXXX, 06XXXXXXXX, or +2557XXXXXXXX)",
        }),
      whatsapp: sameWhats
        ? z.string()
        : z
            .string()
            .transform(cleanPhone)
            .refine((val) => phoneRe.test(val), {
              message: "Enter a valid TZ WhatsApp number",
            }),
      hostel: z.string().min(1, "Please select your hostel"),
      room: isNumericRoom
        ? z.string().regex(/^\d+$/, "Room number must be numeric digits only")
        : z
            .string()
            .regex(/^[A-Za-z0-9]+$/, "Room code must be alphanumeric (letters and numbers)"),
      services: z
        .array(z.string())
        .min(1, "Please select at least one laundry service of interest"),
      serviceSpeed: z.enum(["Standard", "Express"]),
      consent: z.literal(true, {
        errorMap: () => ({
          message: "You must agree to receive marketing notifications to register",
        }),
      }),
    });
  }, [isNumericRoom, sameWhats]);

  function toggleService(s: string) {
    setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const rawPhone = cleanPhone(phone);
    const rawWhatsapp = sameWhats ? rawPhone : cleanPhone(whatsapp);

    const validationData = {
      fullName,
      phone: rawPhone,
      whatsapp: rawWhatsapp,
      hostel,
      room: room.trim().toUpperCase(),
      services,
      serviceSpeed,
      consent,
    };

    const result = schema.safeParse(validationData);
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        errs[issue.path[0] as string] = issue.message;
      }
      setErrors(errs);
      setSubmitting(false);

      // Scroll to the first error
      const firstErrorKey = Object.keys(errs)[0];
      const element = document.getElementById(`field-${firstErrorKey}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setErrors({});
    const studentId = generateCustomerId();

    const student: Student = {
      customerId: studentId,
      fullName: fullName.trim(),
      phone: rawPhone,
      whatsapp: rawWhatsapp,
      hostel,
      room: room.trim().toUpperCase(),
      services,
      offer,
      referralStatus: referral,
      referredBy: ref,
      consent,
      status: "Lead Registered",
      createdAt: new Date().toISOString(),
      serviceSpeed,
    };

    try {
      // Save locally (triggers Supabase async background sync)
      saveStudent(student);

      // Redirect immediately to prevent double submissions
      navigate({
        to: "/success",
        search: { id: studentId },
      });
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Failed to save registration. Please try again." });
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Navigation Header */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-20 shadow-sm">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5">
            <img src={logo.url} alt="Urban Wash" className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/pricing"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition"
            >
              View Pricing 💰
            </Link>
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
            >
              ← Back Home
            </Link>
          </div>
        </div>
      </header>

      {/* Free Delivery Promo Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold py-2.5 px-4 text-center shadow-sm">
        🚚 FREE PICKUP & DELIVERY ALWAYS ON EVERY ORDER
      </div>

      <main className="mx-auto max-w-2xl px-4 mt-6">
        {/* Welcome message / Referral hook */}
        <div className="text-center md:text-left mb-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                {isAgentMode ? "Agent Campaign Portal" : "Student Registration"}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {isAgentMode
                  ? "Enter the student's details below to register their account."
                  : "Claim your 10% OFF discount and join the URBAN WASH campaign!"}
              </p>
            </div>

            {/* Online/Offline Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0 border ${
                isOnline
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-amber-500"}`}
              ></span>
              {isOnline ? "Connected" : "Offline"}
            </span>
          </div>

          {/* Mode Selector Toggle */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setIsAgentMode(true)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                isAgentMode
                  ? "bg-white text-blue-700 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              📋 Field Agent Mode
            </button>
            <button
              type="button"
              onClick={() => setIsAgentMode(false)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                !isAgentMode
                  ? "bg-white text-blue-700 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              📱 Student Mode
            </button>
          </div>

          {/* Offline warning banner */}
          {!isOnline && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-[11px] leading-relaxed">
              ⚠️ <strong>Offline Mode:</strong> Registrations will cache locally and sync
              automatically when internet access is restored.
            </div>
          )}

          {/* Agent Pitch Card (Only in Agent Mode) */}
          {isAgentMode && showPitchCard && (
            <div className="bg-gradient-to-r from-blue-700 to-indigo-850 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden animate-fade-in border border-blue-600/10 text-left">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                  📣 Pitch Script Helper
                </span>
                <button
                  type="button"
                  onClick={() => setShowPitchCard(false)}
                  className="text-[10px] text-blue-200 hover:text-white"
                >
                  Hide
                </button>
              </div>
              <p className="mt-2.5 text-xs text-blue-50 leading-relaxed font-mono select-all">
                "Hello! We are URBAN WASH. We offer washing, ironing & wash-iron services with
                student-friendly prices. Register today and receive 10% OFF your first order. May I
                have your name and phone number?"
              </p>
            </div>
          )}

          {isAgentMode && !showPitchCard && (
            <div className="text-left">
              <button
                type="button"
                onClick={() => setShowPitchCard(true)}
                className="text-xs text-blue-600 hover:underline font-bold"
              >
                Show pitch script helper
              </button>
            </div>
          )}

          {ref && !isAgentMode && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                🎁 Referred by student <strong>{ref}</strong>. Complete registration to unlock your
                promo offer!
              </span>
            </div>
          )}
        </div>

        {/* Validation summary error */}
        {errors.submit && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{errors.submit}</span>
          </div>
        )}

        {/* Main form */}
        <form
          onSubmit={onSubmit}
          className="space-y-6 bg-white rounded-3xl p-5 sm:p-8 shadow-sm border border-slate-100"
        >
          {/* Full Name */}
          <div id="field-fullName">
            <FieldLabel
              icon={<User className="h-4 w-4 text-blue-500" />}
              label="Full Name"
              required
            />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={`${inputCls} ${errors.fullName ? "border-rose-400 focus:ring-rose-200" : ""}`}
              placeholder="e.g. Juma Kassim"
              disabled={submitting}
              autoComplete="name"
            />
            {errors.fullName && (
              <p className="text-rose-500 text-xs mt-1 font-medium">{errors.fullName}</p>
            )}
          </div>

          {/* Phone Number */}
          <div id="field-phone">
            <FieldLabel
              icon={<Phone className="h-4 w-4 text-blue-500" />}
              label="Phone Number"
              required
            />
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`${inputCls} ${errors.phone ? "border-rose-400 focus:ring-rose-200" : ""}`}
              placeholder="e.g. 0712345678 or 06XXXXXXXX"
              disabled={submitting}
              inputMode="tel"
              autoComplete="tel"
            />
            {errors.phone && (
              <p className="text-rose-500 text-xs mt-1 font-medium">{errors.phone}</p>
            )}
          </div>

          {/* Separate WhatsApp Field Checkbox */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sameWhats}
                onChange={(e) => {
                  setSameWhats(e.target.checked);
                  if (e.target.checked) setWhatsapp("");
                }}
                className="w-4.5 h-4.5 accent-blue-600 rounded cursor-pointer"
                disabled={submitting}
              />
              <span className="text-xs font-semibold text-slate-700">
                WhatsApp number same as Phone Number
              </span>
            </label>

            {/* Separate WhatsApp Input */}
            {!sameWhats && (
              <div id="field-whatsapp" className="mt-4 pt-3 border-t border-slate-200/50">
                <FieldLabel
                  icon={<MessageSquare className="h-4 w-4 text-emerald-500" />}
                  label="WhatsApp Number"
                  required
                />
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className={`${inputCls} ${errors.whatsapp ? "border-rose-400 focus:ring-rose-200" : ""}`}
                  placeholder="e.g. 0687771750"
                  disabled={submitting}
                  inputMode="tel"
                />
                {errors.whatsapp && (
                  <p className="text-rose-500 text-xs mt-1 font-medium">{errors.whatsapp}</p>
                )}
              </div>
            )}
          </div>

          {/* Hostel Selection */}
          <div id="field-hostel">
            <FieldLabel icon={<Home className="h-4 w-4 text-blue-500" />} label="Hostel" required />
            <select
              value={hostel}
              onChange={(e) => {
                setHostel(e.target.value);
                setRoom(""); // Reset room when hostel changes
              }}
              className={`${inputCls} ${errors.hostel ? "border-rose-400 focus:ring-rose-200" : ""}`}
              disabled={submitting}
            >
              <option value="">-- Choose Hostel --</option>
              {HOSTELS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            {errors.hostel && (
              <p className="text-rose-500 text-xs mt-1 font-medium">{errors.hostel}</p>
            )}
          </div>

          {/* Dynamic Room Field */}
          {hostel && (
            <div id="field-room" className="animate-fade-in">
              <FieldLabel
                icon={<Home className="h-4 w-4 text-blue-500" />}
                label={isNumericRoom ? "Room Number" : "Room Code"}
                required
              />
              <input
                type="text"
                value={room}
                onChange={(e) => {
                  const val = e.target.value;
                  // Dynamic sanitization based on hostel rules
                  if (isNumericRoom) {
                    setRoom(val.replace(/\D/g, "")); // Digits only
                  } else {
                    setRoom(val.replace(/[^A-Za-z0-9]/g, "")); // Alphanumeric only
                  }
                }}
                className={`${inputCls} ${errors.room ? "border-rose-400 focus:ring-rose-200" : ""}`}
                placeholder={isNumericRoom ? "e.g. 205" : "e.g. H06B"}
                disabled={submitting}
                inputMode={isNumericRoom ? "numeric" : "text"}
              />
              <p className="text-[10px] text-slate-400 mt-1">
                {isNumericRoom
                  ? "Validation: Numbers only (Examples: 101, 205, 312)"
                  : "Validation: Letters & numbers (Examples: H06B, G12A, K03C)"}
              </p>
              {errors.room && (
                <p className="text-rose-500 text-xs mt-1 font-medium">{errors.room}</p>
              )}
            </div>
          )}

          {/* Laundry Services of Interest */}
          <div id="field-services">
            <div className="flex items-center justify-between gap-4">
              <FieldLabel
                icon={<CheckSquare className="h-4 w-4 text-blue-500" />}
                label="Service Interest"
                required
              />
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100/85 text-xs font-bold transition duration-200 mb-2 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98]"
              >
                View Detailed Prices 💰
              </Link>
            </div>
            <p className="text-xs text-slate-400 mb-2">
              Select all services you might be interested in:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SERVICES.map((s) => {
                const active = services.includes(s);
                return (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleService(s)}
                    disabled={submitting}
                    className={`px-4 py-3 rounded-xl border text-sm font-semibold transition flex items-center justify-between cursor-pointer ${
                      active
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"
                    }`}
                  >
                    <span>{s}</span>
                    {active && <CheckCircle2 className="h-4 w-4 text-white" />}
                  </button>
                );
              })}
            </div>
            {errors.services && (
              <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.services}</p>
            )}
          </div>

          {/* Service Turnaround Speed Info */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4.5 space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <Clock className="h-4.5 w-4.5 text-blue-600 shrink-0" />
              <span>Standard Turnaround: 48 - 72 Hours</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our standard turnaround time is 48 to 72 hours at regular student-friendly pricing.
            </p>
            <div className="pt-2 border-t border-blue-100/50 flex items-start gap-2 text-[11px] text-amber-800 font-medium">
              <span className="text-xs leading-none">⚡</span>
              <p>
                <strong>Express Service Available:</strong> Need it sooner? We offer priority processing within a few hours (up to 4 hours) at a higher cost. Let your agent know during pickup!
              </p>
            </div>
          </div>

          {/* Promo Offer Selector */}
          <div>
            <FieldLabel
              icon={<Gift className="h-4 w-4 text-blue-500" />}
              label="Choose Your Promotional Offer"
              required
            />
            <p className="text-xs text-slate-400 mb-2">
              Choose one exclusive offer to unlock upon registration:
            </p>
            <div className="space-y-2.5">
              {OFFERS.map((o) => {
                const active = offer === o;
                return (
                  <label
                    key={o}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition select-none ${
                      active
                        ? "border-blue-600 bg-blue-50/50 text-blue-900"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="offer"
                      checked={active}
                      onChange={() => setOffer(o)}
                      className="w-4 h-4 mt-0.5 accent-blue-600"
                      disabled={submitting}
                    />
                    <div className="text-xs sm:text-sm font-medium">
                      {o}
                      {o === "10% OFF First Order" && (
                        <span className="ml-1.5 text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                          Popular
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Referral Option */}
          <div>
            <FieldLabel
              icon={<Gift className="h-4 w-4 text-blue-500" />}
              label="Join Our Referral Program?"
              required
            />
            <p className="text-xs text-slate-400 mb-2.5">
              Would you like to earn rewards by inviting friends?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(["Yes", "No"] as const).map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setReferral(opt)}
                  disabled={submitting}
                  className={`py-2.5 rounded-xl border text-sm font-bold transition cursor-pointer ${
                    referral === opt
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {opt === "Yes" ? "Yes, Join & Earn" : "No, Skip"}
                </button>
              ))}
            </div>
            {referral === "Yes" && (
              <div className="mt-3 p-4 bg-blue-50 border border-blue-100 text-blue-950 rounded-2xl text-xs leading-relaxed animate-fade-in">
                <span className="font-bold text-blue-700 block mb-1">
                  🎁 Referral Program Reward:
                </span>
                Refer 3 students to sign up, and receive a{" "}
                <strong>FREE wash worth TZS 2,500</strong> (valid for up to 5 clothes)!
              </div>
            )}
          </div>

          {/* Consent Checkbox */}
          <div id="field-consent" className="pt-2 border-t border-slate-100">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="w-5.5 h-5.5 mt-0.5 accent-blue-600 rounded cursor-pointer"
                disabled={submitting}
              />
              <span className="text-xs font-medium text-slate-600 leading-relaxed">
                <span className="text-slate-800 font-semibold">☑ I agree to receive</span> laundry
                reminders, service updates, and special promotional offers from{" "}
                <strong>URBAN WASH</strong> via WhatsApp or SMS.
              </span>
            </label>
            {errors.consent && (
              <p className="text-rose-500 text-xs mt-1.5 font-medium">{errors.consent}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold text-lg shadow-md hover:scale-[1.01] active:scale-[0.99] transition duration-200 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Saving & Syncing to Cloud...
                </>
              ) : (
                "Complete Registration"
              )}
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-3">
              By submitting this form, your customer profile will be created. Always 100% secure.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}

const inputCls =
  "w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition text-sm sm:text-base shadow-inner";

function FieldLabel({
  icon,
  label,
  required,
}: {
  icon: React.ReactNode;
  label: string;
  required?: boolean;
}) {
  return (
    <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 mb-2">
      {icon}
      <span>
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </span>
    </label>
  );
}
