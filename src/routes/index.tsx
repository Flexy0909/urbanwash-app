import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/urban-logo.png.asset.json";
import {
  Sparkles,
  CheckCircle2,
  Truck,
  ClipboardList,
  RefreshCw,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  QrCode,
  X,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { syncWithCloud, loadStudents, type Student } from "@/lib/storage";
import QRCode from "qrcode";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [totalRecords, setTotalRecords] = useState(0);

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
      color: {
        dark: "#1e3a8a",
        light: "#ffffff",
      },
      margin: 1,
    })
      .then((url) => {
        setQrSvgUrl(url);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [qrUrl]);

  useEffect(() => {
    // Initial load
    const local = loadStudents();
    setTotalRecords(local.length);

    // Run background cloud database synchronization
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Banner */}
      <div className="bg-blue-600 text-white text-xs sm:text-sm font-semibold py-2.5 px-4 text-center sticky top-0 z-30 shadow-sm flex items-center justify-center gap-2 flex-wrap">
        <span className="animate-pulse">⚡</span>
        <span>SPECIAL OFFERS: Register today and receive 10% OFF your first order!</span>
      </div>

      {/* Navigation Header */}
      <header className="border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-9 z-20 transition-all">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logo.url}
              alt="Urban Wash"
              className="h-10 w-auto group-hover:scale-105 transition duration-300"
            />
          </Link>
          <div className="flex items-center gap-4">
            {syncStatus !== "idle" && (
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                <RefreshCw
                  className={`h-3 w-3 ${syncStatus === "syncing" ? "animate-spin text-blue-600" : ""}`}
                />
                {syncStatus === "syncing" ? "Syncing..." : "Database Synced"}
              </span>
            )}
            <Link
              to="/admin"
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-14 md:py-20 px-4">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="mx-auto max-w-4xl text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm border border-white/5">
            <Sparkles className="h-3 w-3 text-blue-300" />
            Student Laundry Campaign
          </span>

          <h1 className="mt-6 text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Laundry Made Easy <br />
            <span className="bg-gradient-to-r from-blue-200 to-teal-100 bg-clip-text text-transparent">
              for Students
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto font-normal leading-relaxed">
            Professional Laundry, Delivered to Your Door. Enjoy fresh, crisp clothes without leaving
            your hostel room.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide shadow-md border border-blue-400/20">
              <Truck className="h-4 w-4 animate-bounce" />
              🚚 FREE PICKUP & DELIVERY ALWAYS
            </div>
            <p className="text-xs text-blue-200">Enjoy FREE Pickup & Delivery on Every Order</p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition duration-200"
            >
              Register Student
              <ArrowRight className="h-5 w-5" />
            </Link>
            <button
              onClick={() => setShowQRModal(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 text-white hover:bg-white/20 border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition duration-200 cursor-pointer shadow-md"
            >
              <QrCode className="h-5 w-5" />
              Scan to Register
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-12">
        {/* We Now Offer Section */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            We Now Offer
          </h2>
          <p className="mt-2 text-slate-500 text-sm sm:text-base">
            Professional washing, ironing & wash-iron services with updated student-friendly prices.
          </p>
        </div>

        {/* Pricing & Service Grid */}
        <div className="mt-10 grid sm:grid-cols-3 gap-6">
          {[
            {
              title: "Washing & Fold",
              price: "TZS 3,500",
              unit: "up to 5kg bundle",
              desc: "Fresh, hygienic wash and machine tumble dry. Sorted by colors.",
              bg: "bg-blue-50/50 border-blue-100 hover:bg-blue-50",
              accent: "text-blue-600 bg-blue-100",
            },
            {
              title: "Ironing Only",
              price: "TZS 500",
              unit: "per clothing item",
              desc: "Crisp, wrinkle-free steam ironing to look sharp and confident.",
              bg: "bg-teal-50/50 border-teal-100 hover:bg-teal-50",
              accent: "text-teal-600 bg-teal-100",
            },
            {
              title: "Wash & Iron",
              price: "TZS 5,000",
              unit: "up to 5kg bundle",
              desc: "Complete care package: fresh wash, machine tumble dry, and professional pressing.",
              bg: "bg-indigo-50/50 border-indigo-100 hover:bg-indigo-50",
              accent: "text-indigo-600 bg-indigo-100",
            },
          ].map((s) => (
            <div
              key={s.title}
              className={`bg-white rounded-2xl p-6 shadow-sm border ${s.bg} hover:shadow-md transition duration-300 flex flex-col justify-between`}
            >
              <div>
                <span className={`inline-flex p-2.5 rounded-xl font-bold text-xs ${s.accent}`}>
                  {s.title}
                </span>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900">{s.price}</span>
                  <span className="text-xs text-slate-500">/ {s.unit}</span>
                </div>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100/80 flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>🚚 Free Pickup</span>
                <span>⏱️ 48 - 72 hrs Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Express Turnaround Callout Banner */}
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚡</span>
            <div>
              <h4 className="font-extrabold text-amber-900 text-sm sm:text-base">Express Service Available!</h4>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                In a rush? Get your laundry washed, ironed, or dry cleaned and delivered back to your room <strong>within a few hours (up to 4 hours max)</strong> at an additional express rate. Select this option on the signup form!
              </p>
            </div>
          </div>
          <Link
            to="/register"
            className="w-full sm:w-auto shrink-0 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm text-center transition"
          >
            Order Express
          </Link>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Register Today & Unlock Exclusive Perks
              </h2>
              <p className="mt-3 text-slate-500 text-sm leading-relaxed">
                Joining the URBAN WASH student campaign is free, takes less than a minute, and comes
                with immediate rewards.
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

              <div className="mt-8">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl shadow-md transition duration-200 text-sm"
                >
                  Start Registration
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-2 right-2 text-slate-200">
                <ClipboardList className="h-24 w-24 opacity-20" />
              </div>

              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
                Agent Pitch Script
              </h3>

              <p className="mt-4 text-xs font-mono text-slate-600 bg-white p-4 rounded-xl border border-slate-100 leading-relaxed shadow-inner select-all">
                "Hello! We are <strong>URBAN WASH Laundry Services</strong>.
                <br />
                <br />
                We now offer professional washing, ironing, and wash & iron services with updated
                student-friendly prices.
                <br />
                <br />
                We are registering students for exclusive discounts, laundry reminders, and special
                offers. Registration is free and takes less than a minute.
                <br />
                <br />
                Register today and receive <strong>10% OFF your first order</strong>. May I have
                your name and phone number?"
              </p>

              <div className="mt-4 text-[10px] text-slate-400 text-center">
                💡 Tap to select and copy script text for pitches.
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
              5,000)!
            </p>
            <div className="mt-6 flex flex-wrap gap-4 items-center">
              <Link
                to="/register"
                className="bg-white text-indigo-900 font-bold px-5 py-2.5 rounded-lg text-xs hover:bg-slate-100 transition shadow-sm"
              >
                Get Referral Link
              </Link>
              <span className="text-xs text-blue-200 font-mono">
                {totalRecords > 0 ? `🔥 Join ${totalRecords} registered students` : ""}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white mt-16">
        <div className="mx-auto max-w-5xl px-4 py-8 text-center sm:flex sm:items-center sm:justify-between">
          <div className="flex justify-center items-center gap-2">
            <img src={logo.url} alt="Urban Wash" className="h-8 w-auto opacity-75" />
            <span className="text-xs text-slate-400 font-medium">| Laundry Made Easy</span>
          </div>
          <div className="mt-4 sm:mt-0 text-xs text-slate-500 space-y-1">
            <p>Slogan: Professional Laundry, Delivered to Your Door</p>
            <p>
              WhatsApp Campaign Support:{" "}
              <a
                href="https://wa.me/255686771750"
                className="text-blue-600 hover:underline font-bold"
              >
                +255 686 771 750
              </a>
            </p>
            <p>© {new Date().getFullYear()} URBAN WASH. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* QR Code Scan Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity">
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
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Scan to Register</h3>
              <p className="text-xs text-slate-500">
                Point your phone camera here to load the registration form instantly on your phone.
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
