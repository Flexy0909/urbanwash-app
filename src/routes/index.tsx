import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/urban-logo.png.asset.json";
import {
  CheckCircle2,
  Truck,
  ClipboardList,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  QrCode,
  X,
  CalendarCheck,
  MapPin,
  ShoppingBag,
  ChevronRight,
  Shirt,
  Waves,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { syncWithCloud, loadStudents } from "@/lib/storage";
import QRCode from "qrcode";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/")({
  component: Landing,
});

// Animated counter hook
function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return count;
}

function StatCard({
  emoji,
  value,
  isDecimal = false,
  suffix = "",
  label,
  accent,
}: {
  emoji: string;
  value: number;
  isDecimal?: boolean;
  suffix?: string;
  label: string;
  accent: string;
}) {
  const count = useCounter(value);
  const displayVal = isDecimal ? (count / 10).toFixed(1) : count.toLocaleString();
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border ${accent} flex flex-col items-center text-center gap-1 hover:shadow-md transition duration-300`}>
      <span className="text-3xl">{emoji}</span>
      <span className="text-2xl sm:text-3xl font-black text-slate-900 tabular-nums">
        {displayVal}{suffix}
      </span>
      <span className="text-xs text-slate-500 font-medium leading-tight">{label}</span>
    </div>
  );
}

function Landing() {
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [totalRecords, setTotalRecords] = useState(0);
  const [showFloating, setShowFloating] = useState(false);

  // QR Modal States
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrUrl, setQrUrl] = useState("https://urbanwash.app/register");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setQrUrl(`${window.location.origin}/register`);
    }
  }, []);

  const [qrSvgUrl, setQrSvgUrl] = useState("");

  useEffect(() => {
    QRCode.toDataURL(qrUrl, {
      color: { dark: "#1e3a8a", light: "#ffffff" },
      margin: 1,
    })
      .then((url) => setQrSvgUrl(url))
      .catch((err) => console.error(err));
  }, [qrUrl]);

  useEffect(() => {
    const local = loadStudents();
    setTotalRecords(local.length);

    setSyncStatus("syncing");
    syncWithCloud((merged) => {
      setTotalRecords(merged.length);
      setSyncStatus("success");
      setTimeout(() => setSyncStatus("idle"), 2000);
    }).catch(() => {
      setSyncStatus("error");
      setTimeout(() => setSyncStatus("idle"), 3000);
    });
  }, []);

  // Show floating button after scrolling past hero
  useEffect(() => {
    const onScroll = () => {
      setShowFloating(window.scrollY > 340);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Realistic stats seeded from actual count
  const baseOrders = Math.max(1284, totalRecords * 4);
  const clothesToday = 132 + (totalRecords % 20);
  const pickupsToday = 18 + (totalRecords % 7);
  const waTrackLink = `https://wa.me/255687771750?text=${encodeURIComponent("Habari! Nataka kufuatilia order yangu ya URBAN WASH. Customer ID yangu ni: ")}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-500 selection:text-white flex flex-col justify-between">

      {/* Urgency Top Banner */}
      <div className="bg-rose-600 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 text-center sticky top-0 z-30 shadow-sm flex items-center justify-center gap-2 flex-wrap">
        <span className="animate-pulse">🚨</span>
        <span>Leaving campus soon? Book your laundry today and avoid last-minute delays.</span>
        <Link
          to="/register"
          className="underline underline-offset-2 font-bold hover:text-rose-200 transition whitespace-nowrap"
        >
          Book Now →
        </Link>
      </div>

      {/* Navigation Header */}
      <Navbar syncing={syncStatus === "syncing"} />

      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-14 md:py-22 px-4">
        {/* Abstract blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-4xl text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm border border-white/10">
            <MapPin className="h-3 w-3 text-blue-300" />
            Arusha Technical College
          </span>

          <h1 className="mt-5 text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Professional Laundry
            <br />
            <span className="bg-gradient-to-r from-blue-200 to-teal-100 bg-clip-text text-transparent">
              for ATC Students
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto font-normal leading-relaxed">
            Fresh, crisp clothes delivered straight to your hostel room — no walking, no waiting in lines.
            Free pickup & delivery on every order.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 px-4 py-2 rounded-full font-semibold text-xs tracking-wide border border-white/10 backdrop-blur-sm">
              <Truck className="h-4 w-4 text-teal-300 animate-bounce" />
              🚚 FREE PICKUP & DELIVERY — ALWAYS
            </div>
          </div>

          {/* PRIMARY ACTIONS */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            {/* SCHEDULE PICKUP — primary green */}
            <Link
              to="/register"
              id="cta-schedule-pickup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-[1.03] active:scale-[0.97] transition duration-200 border border-emerald-400/30"
            >
              <CalendarCheck className="h-5 w-5" />
              Schedule Pickup
            </Link>

            {/* TRACK MY ORDER — secondary */}
            <Link
              to="/login"
              id="cta-track-order"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/10 text-white hover:bg-white/20 border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition duration-200 shadow-md"
            >
              <ShoppingBag className="h-5 w-5 text-blue-200" />
              Track My Order
            </Link>
          </div>

          {/* Sub-action: scan QR */}
          <div className="mt-5 flex justify-center">
            <button
              onClick={() => setShowQRModal(true)}
              className="inline-flex items-center gap-1.5 text-xs text-blue-200 hover:text-white transition cursor-pointer underline underline-offset-4"
            >
              <QrCode className="h-3.5 w-3.5" />
              Or scan QR code to register instantly
            </button>
          </div>
        </div>
      </section>

      {/* ─── LIVE STATISTICS ─── */}
      <section className="mx-auto max-w-5xl px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 md:p-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Today's Statistics
            </h2>
            <span className="text-[10px] text-slate-400 font-medium">Updated in real time</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard emoji="👕" value={clothesToday} label="Clothes Washed Today" accent="border-blue-100" />
            <StatCard emoji="🚚" value={pickupsToday} label="Pickups Scheduled" accent="border-teal-100" />
            <StatCard emoji="⭐" value={49} isDecimal suffix="/5" label="Student Rating" accent="border-amber-100" />
            <StatCard emoji="⚡" value={24} suffix=" hrs" label="Average Delivery" accent="border-indigo-100" />
          </div>
        </div>
      </section>

      {/* ─── TRUST INDICATORS ─── */}
      <section className="mx-auto max-w-5xl px-4 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: `${baseOrders.toLocaleString()}+`, label: "Orders Completed", icon: "📦" },
            { value: "98%", label: "On-Time Delivery", icon: "⏱️" },
            { value: `${Math.max(350, totalRecords)}+`, label: "Registered Students", icon: "🎓" },
            { value: "★★★★★", label: "Student Reviews", icon: "💬" },
          ].map((t) => (
            <div
              key={t.label}
              className="bg-gradient-to-br from-blue-700 to-indigo-800 text-white rounded-2xl p-4 text-center shadow-md flex flex-col items-center gap-1"
            >
              <span className="text-2xl">{t.icon}</span>
              <span className="text-xl sm:text-2xl font-black tracking-tight">{t.value}</span>
              <span className="text-[10px] text-blue-200 font-medium leading-tight">{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-5xl px-4 py-12">

        {/* Pricing Section Header */}
        <div id="pricing" className="text-center max-w-2xl mx-auto scroll-mt-28 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            💰 Subsidized Student Rates
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transparent Pricing
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Commercial-grade laundry & steam ironing at affordable flat student rates. Always includes <strong>100% FREE pickup & delivery</strong> straight to your hostel room.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-10 grid sm:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: Washing & Fold */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition duration-300 flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                  <Waves className="h-3.5 w-3.5" />
                  Washing & Fold
                </span>
              </div>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">TZS 500</span>
                <span className="text-xs text-slate-500 font-medium">/ item</span>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Fresh machine wash, tumble dry, and neat hand folding.
              </p>

              {/* Feature List */}
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
                {[
                  "Machine tumble dry & neat fold",
                  "Eco-safe anti-bacterial detergent",
                  "Individual load (Zero clothing mix-ups)",
                  "FREE pickup & delivery to room",
                ].map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100/80">
              <Link
                to="/register"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition duration-200"
              >
                Schedule Wash & Fold
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: Ironing Only */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 hover:border-teal-300 hover:shadow-md transition duration-300 flex flex-col justify-between relative">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-100">
                  <Shirt className="h-3.5 w-3.5" />
                  Ironing Only
                </span>
              </div>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-slate-900">TZS 500</span>
                <span className="text-xs text-slate-500 font-medium">/ item</span>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Crisp, wrinkle-free steam ironing to look sharp & confident.
              </p>

              {/* Feature List */}
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
                {[
                  "High-temperature steam press",
                  "Crisp crease & hanger ready",
                  "Flat student rate for all items",
                  "FREE pickup & delivery to room",
                ].map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100/80">
              <Link
                to="/register"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl transition duration-200"
              >
                Schedule Ironing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Card 3: Wash & Iron (HIGHLIGHTED POPULAR CHOICE) */}
          <div className="bg-gradient-to-b from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-blue-500/80 flex flex-col justify-between relative transform sm:-translate-y-2">
            {/* Top Popular Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md flex items-center gap-1 whitespace-nowrap">
              🔥 MOST POPULAR • BEST VALUE
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-400/30">
                  Wash & Iron
                </span>
              </div>
              <div className="mt-5 flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-black text-white">TZS 1,000</span>
                <span className="text-xs text-blue-200 font-medium">/ item</span>
              </div>
              <p className="mt-3 text-xs sm:text-sm text-blue-100 leading-relaxed">
                Complete care package (Full Wash + Tumble Dry + Steam Iron).
              </p>

              {/* Feature List */}
              <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5">
                {[
                  "Full wash, tumble dry & steam iron",
                  "Fabric softener & fresh fragrance",
                  "FREE pickup & delivery to room",
                  "Priority hostel dispatcher handling",
                ].map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs font-medium text-blue-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10">
              <Link
                to="/register"
                className="w-full inline-flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-lg transition duration-200 border border-emerald-400/40"
              >
                Book Complete Package
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* View Full Pricing CTA */}
        <div className="text-center mt-10">
          <Link
            to="/pricing"
            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-2xl shadow-md hover:scale-[1.02] active:scale-[0.98] transition duration-200"
          >
            View Full Student Price List 💰
          </Link>
        </div>

        {/* Express Turnaround Callout */}
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚡</span>
            <div>
              <h4 className="font-extrabold text-amber-900 text-sm sm:text-base">Express Service Available!</h4>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                In a rush? Get your laundry returned{" "}
                <strong>within a few hours (up to 4 hours max)</strong> at an additional express rate. Perfect if you're leaving campus today!
              </p>
            </div>
          </div>
          <Link
            to="/register"
            search={{ speed: "Express" }}
            className="w-full sm:w-auto shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm text-center transition"
          >
            Order Express ⚡
          </Link>
        </div>

        {/* Commercial Quality & Hygiene Standard Section */}
        <div className="mt-12 bg-slate-900 text-white rounded-3xl p-6 md:p-10 shadow-lg border border-slate-800 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-500/30">
                🛡️ Commercial Laundry Standard
              </div>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                Professional Fabric Care. Exclusive Student Subsidized Rates.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                URBAN WASH operates commercial-grade laundry equipment with eco-safe detergent, anti-bacterial steam sanitization, and individual garment separation. We provide ATC students with subsidized flat rates without compromising professional quality.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Individual Load Washing (Zero Clothing Mix-ups)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Steam Ironed & Wrinkle-Free Folding</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Special Subsidized ATC Student Prices</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>100% Guaranteed Hygiene & Fabric Protection</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Schedule Pickup & Unlock Exclusive Perks
              </h2>
              <p className="mt-3 text-slate-500 text-sm leading-relaxed">
                Booking is free, takes less than a minute, and comes with immediate rewards.
              </p>

              <div className="mt-6 space-y-3.5">
                {[
                  "10% OFF your first order or free promotional wash rewards",
                  "FREE pickup and delivery straight to your hostel room",
                  "Exclusive WhatsApp promotions, reminders, and order tracking",
                  "Join our student referral program and earn cash rewards or free washes",
                ].map((b, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm font-medium">{b}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition duration-200 text-sm"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Schedule My Pickup
                </Link>
                <button
                  onClick={() => setShowQRModal(true)}
                  className="inline-flex items-center justify-center gap-2 border border-blue-200 text-blue-700 hover:bg-blue-50 font-bold px-6 py-3.5 rounded-xl transition duration-200 text-sm cursor-pointer"
                >
                  <QrCode className="h-4 w-4" />
                  Scan QR Code
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-3xl p-6 sm:p-7 border border-blue-100/80 relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-3">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  Student Quality Promise
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Guaranteed Care & Cleanliness
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  We built URBAN WASH specifically around student needs. Every bag of laundry receives individual load handling and steam sanitization.
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>100% Free Hostel Room Pickup & Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Zero Garment Mix-ups (Isolated Washing)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Express 4-Hour Turnaround Available</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-100 text-[11px] text-blue-600 font-semibold flex items-center justify-between">
                <span>📍 Arusha Technical College</span>
                <span>⭐ Rated 4.9 / 5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Viral Referrals Block */}
        <div className="mt-12 bg-gradient-to-br from-indigo-900 to-blue-800 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <MessageSquare className="h-48 w-48" />
          </div>
          <div className="relative z-10 max-w-xl">
            <span className="bg-blue-500/20 text-blue-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-500/30">
              Viral Growth System
            </span>
            <h3 className="mt-3 text-2xl font-black">Share with Friends & Earn Rewards</h3>
            <p className="mt-2 text-blue-100 text-sm leading-relaxed">
              Every registered student gets a unique referral code. When 3 friends register using
              your link, you unlock a <strong>FREE wash for up to 5 clothes</strong> (worth TZS
              2,500)!
            </p>
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <Link
                to="/register"
                className="bg-white text-indigo-900 font-bold px-5 py-2.5 rounded-lg text-xs hover:bg-slate-100 transition shadow-sm inline-flex items-center gap-1.5"
              >
                <CalendarCheck className="h-3.5 w-3.5" />
                Schedule & Get Referral Link
              </Link>
              <span className="text-xs text-blue-200 font-mono">
                {totalRecords > 0 ? `🔥 Join ${totalRecords} registered students` : ""}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Ultra-Premium Glassmorphic Footer */}
      <Footer />

      {/* ─── FLOATING BOOK PICKUP BUTTON ─── */}
      <div
        className={`fixed bottom-6 right-5 z-40 transition-all duration-500 ${
          showFloating ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <Link
          to="/register"
          id="floating-book-pickup"
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-5 py-3.5 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition duration-200 text-sm border border-emerald-400/30"
        >
          🧺 Book Pickup
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* QR Code Scan Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full border border-slate-100 shadow-2xl relative text-center space-y-5 animate-scale-up">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex justify-center">
              <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                <QrCode className="h-7 w-7" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Scan to Schedule Pickup</h3>
              <p className="text-xs text-slate-500">
                Point your phone camera here to open the booking form instantly.
              </p>
            </div>

            {qrSvgUrl ? (
              <div className="flex justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                <img src={qrSvgUrl} alt="Scan to Register QR Code" className="h-48 w-48 shadow-md rounded-xl" />
              </div>
            ) : (
              <p className="text-xs text-rose-500 italic">Failed to generate QR Code</p>
            )}

            <div className="text-[10px] text-slate-400 font-mono break-all font-semibold">
              {qrUrl}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
