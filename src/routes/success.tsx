import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import logo from "@/assets/urban-logo.png.asset.json";
import { loadStudents, type Student } from "@/lib/storage";
import { QRCode } from "@/lib/qr";
import {
  CheckCircle2,
  Copy,
  Share2,
  MessageSquare,
  Mail,
  RefreshCw,
  Download,
  ArrowRight,
  Phone,
} from "lucide-react";

export const Route = createFileRoute("/success")({
  validateSearch: (s: Record<string, unknown>) => ({
    id: typeof s.id === "string" ? s.id : "",
  }),
  component: Success,
});

const WHATSAPP_CONTACT = "255686771750";
const SLOGAN = "Laundry Made Easy for Students";
const SUB_SLOGAN = "Professional Laundry, Delivered to Your Door";

function Success() {
  const { id } = useSearch({ from: "/success" });
  const [student, setStudent] = useState<Student | null>(null);
  const [copied, setCopied] = useState(false);
  const [flyerDownloading, setFlyerDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const found = loadStudents().find((s) => s.customerId === id) || null;
    setStudent(found);
  }, [id]);

  const refLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${id}`
      : `https://urbanwash.app/register?ref=${id}`;

  const shareText = `Hujambo! Jiunge na URBAN WASH 🧺 — washing, ironing & wash-iron services kwa wanafunzi. FREE pickup & delivery + 10% OFF order ya kwanza! Jisajili hapa: ${refLink}`;
  const waLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const smsLink = `sms:?&body=${encodeURIComponent(shareText)}`;
  const waUs = `https://wa.me/${WHATSAPP_CONTACT}?text=${encodeURIComponent(
    `Habari URBAN WASH, nimejisajili kwenye campaign! Jina langu ni ${student?.fullName ?? ""} (ID: ${id}). Nimechagua offer ya: ${student?.offer ?? "10% OFF First Order"}.`,
  )}`;

  // Generate QR Code data URL for rendering in the browser
  const qrSvgUrl = (() => {
    try {
      const qr = new QRCode(4, 1);
      qr.addData(refLink);
      return qr.toSvgDataUrl("#1e3a8a", "#ffffff");
    } catch (e) {
      console.error(e);
      return "";
    }
  })();

  function copy() {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Draw the high-quality share card on a canvas and download it
  const downloadFlyer = () => {
    setFlyerDownloading(true);
    const canvas = canvasRef.current;
    if (!canvas) {
      setFlyerDownloading(false);
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setFlyerDownloading(false);
      return;
    }

    const drawAll = (img?: HTMLImageElement) => {
      // Set canvas dimensions (800 x 1200 for a crisp flyer ratio)
      canvas.width = 800;
      canvas.height = 1200;

      // Draw background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 1200);
      grad.addColorStop(0, "#1e40af"); // Deep Blue
      grad.addColorStop(0.5, "#1d4ed8"); // Royal Blue
      grad.addColorStop(1, "#1e1b4b"); // Indigo/Dark Navy
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 1200);

      // Decorative water/bubble shapes
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.beginPath();
      ctx.arc(700, 200, 250, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(100, 950, 200, 0, Math.PI * 2);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 15;
      ctx.strokeRect(30, 30, 740, 1140);

      let textY = 190;
      if (img) {
        // Draw image logo
        const logoWidth = 320;
        const logoHeight = img.height * (logoWidth / img.width);
        ctx.drawImage(img, 400 - logoWidth / 2, 60, logoWidth, logoHeight);
        textY = 60 + logoHeight + 30;
      } else {
        // Fallback: Header Branding Text
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.font = "bold 56px Arial, Helvetica, sans-serif";
        ctx.fillText("URBAN WASH", 400, 140);
        
        ctx.fillStyle = "#60a5fa"; // Light blue
        ctx.font = "bold 24px Arial, sans-serif";
        ctx.fillText("WASH • IRONING • WASH & IRON", 400, 190);
        textY = 230;
      }

      // Separator line
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.fillRect(200, textY, 400, 3);

      // Banner background: Free pickup
      ctx.fillStyle = "#22c55e"; // Green banner
      ctx.beginPath();
      ctx.roundRect(100, textY + 30, 600, 80, 16);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.font = "bold 30px Arial, sans-serif";
      ctx.fillText("🚚 FREE PICKUP & DELIVERY ALWAYS", 400, textY + 80);

      // Sub slogan
      ctx.fillStyle = "#93c5fd";
      ctx.font = "italic 22px Georgia, serif";
      ctx.fillText("Professional Laundry, Delivered to Your Door", 400, textY + 150);

      // Central Promo Callout Card
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      ctx.roundRect(80, textY + 190, 640, 260, 24);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 2;
      ctx.strokeRect(80, textY + 190, 640, 260);

      ctx.fillStyle = "#fbbf24"; // Gold
      ctx.font = "black 76px Arial, sans-serif";
      ctx.fillText("10% OFF", 400, textY + 290);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px Arial, sans-serif";
      ctx.fillText("ON YOUR FIRST ORDER", 400, textY + 340);

      ctx.fillStyle = "#93c5fd";
      ctx.font = "normal 20px Arial, sans-serif";
      ctx.fillText("Or choose iron/wash rewards upon registration!", 400, textY + 390);

      // Referral Program Details
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 26px Arial, sans-serif";
      ctx.fillText("REFER 3 FRIENDS & GET A FREE WASH", 400, textY + 500);

      ctx.fillStyle = "#93c5fd";
      ctx.font = "normal 18px Arial, sans-serif";
      ctx.fillText("(Get a free professional wash worth TZS 5,000)", 400, textY + 535);

      // QR Code Container Box
      const qrY = textY + 575;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(290, qrY, 220, 220, 16);
      ctx.fill();

      // Draw QR code module by module
      try {
        const qr = new QRCode(4, 1);
        qr.addData(refLink);
        qr.make();
        const count = qr.getModuleCount();
        const qrBoxSize = 180; // Size of QR inside white square
        const cellSize = qrBoxSize / count;
        const startX = 290 + 20; // 20px padding inside 220px box
        const startY = qrY + 20;

        for (let r = 0; r < count; r++) {
          for (let c = 0; c < count; c++) {
            if (qr.isDark(r, c)) {
              ctx.fillStyle = "#1e3a8a"; // Deep blue QR
              ctx.fillRect(
                Math.floor(startX + c * cellSize),
                Math.floor(startY + r * cellSize),
                Math.ceil(cellSize),
                Math.ceil(cellSize),
              );
            }
          }
        }
      } catch (err) {
        console.error("Canvas QR render error:", err);
        // Fallback text if QR fails
        ctx.fillStyle = "#dc2626";
        ctx.font = "bold 20px Arial, sans-serif";
        ctx.fillText("Scan Link", 400, qrY + 110);
      }

      // Call to Action
      ctx.fillStyle = "#60a5fa";
      ctx.font = "bold 20px monospace";
      ctx.fillText("Scan QR to Register Instantly", 400, qrY + 250);

      ctx.fillStyle = "#ffffff";
      ctx.font = "normal 16px Arial, sans-serif";
      ctx.fillText("WhatsApp Campaign Support: +255 686 771 750", 400, qrY + 300);

      // Trigger download
      try {
        const url = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = url;
        a.download = `urbanwash-share-${id}.png`;
        a.click();
      } catch (err) {
        console.error("Canvas export failed:", err);
      } finally {
        setFlyerDownloading(false);
      }
    };

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = logo.url;
    img.onload = () => {
      drawAll(img);
    };
    img.onerror = () => {
      console.warn("Logo image failed to load for canvas flyer, falling back to text.");
      drawAll();
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Navigation Header */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-20 shadow-sm">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5">
            <img src={logo.url} alt="Urban Wash" className="h-9 w-auto" />
          </Link>
          <span className="text-xs text-slate-400 font-bold">Campaign Portal</span>
        </div>
      </header>

      {/* Main Success Content */}
      <main className="mx-auto max-w-2xl px-4 mt-6">
        {/* Banner Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl p-8 text-center shadow-md relative overflow-hidden">
          <div className="text-5xl animate-bounce">🎉</div>
          <h1 className="mt-4 text-2xl sm:text-3xl font-black tracking-tight">
            Registration Successful!
          </h1>
          <p className="mt-2 text-sm text-blue-100 max-w-sm mx-auto leading-relaxed">
            Congratulations! You are now registered with URBAN WASH.
          </p>

          <div className="mt-6 inline-flex flex-col items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-inner">
            <span className="font-mono text-xl sm:text-2xl font-black tracking-wider text-white">
              {id || "UW-2026-0000"}
            </span>
            <span className="text-[10px] text-blue-200 mt-1 font-bold uppercase tracking-wider">
              Your Customer ID
            </span>
          </div>

          <div className="mt-6 text-xs text-blue-200 font-medium">
            🚚 FREE PICKUP & DELIVERY ALWAYS ON EVERY ORDER
          </div>
        </div>

        {/* Unlocked reward display */}
        <div className="mt-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
          {student?.serviceSpeed === "Express" && (
            <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-[11px] font-semibold leading-relaxed animate-pulse">
              ⚡ <strong>Express Order Alert:</strong> Priority processing requested (delivery within 4 hours). Our dispatcher will coordinate pickup immediately! (Express rates apply)
            </div>
          )}

          <h2 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Benefits Unlocked
          </h2>

          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  🎁 Offer: {student?.offer ?? "10% OFF First Order"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Applied automatically to your first laundry order.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  🚚 Free Pickup & Delivery Always
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Professional Laundry, Delivered to Your Door. No walking required.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  ⏱️ Turnaround Speed: {student?.serviceSpeed ?? "Standard"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {student?.serviceSpeed === "Express"
                    ? "Express turnaround requested. Priority processing within 4 hours."
                    : "Standard service (48 - 72 hours turnaround speed)."}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-xs text-slate-500 leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-100">
            💬 <strong>What's next?</strong> Our service team will reach out to you shortly via
            WhatsApp or SMS to coordinate your first pickup bundle!
          </p>
        </div>

        {/* Viral Share System */}
        <div className="mt-6 bg-gradient-to-br from-indigo-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-md">
          <span className="text-[10px] bg-indigo-500/30 text-indigo-200 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-indigo-500/20">
            Share & Earn Free Washing
          </span>

          <h2 className="font-black text-xl sm:text-2xl mt-3">Share with Friends & Earn Rewards</h2>
          <p className="mt-2 text-indigo-100 text-xs sm:text-sm leading-relaxed">
            Refer 3 students and receive a <strong>FREE wash for up to 5 clothes</strong> (worth TZS
            5,000). Every referral counts immediately after successful sign-up.
          </p>

          {/* Referral link box */}
          <div className="mt-5 bg-black/25 rounded-2xl p-4 border border-white/5 flex items-center justify-between gap-3">
            <span className="text-xs font-mono break-all text-indigo-200 select-all tracking-tight">
              {refLink}
            </span>
            <button
              onClick={copy}
              className="bg-white/10 hover:bg-white/20 active:scale-95 text-white p-2 rounded-xl transition shrink-0 border border-white/10"
              title="Copy Referral Link"
            >
              {copied ? (
                <span className="text-[10px] font-bold text-emerald-400">Copied!</span>
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Deep link buttons */}
          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold text-xs sm:text-sm text-center shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Share2 className="h-3.5 w-3.5" />
              WhatsApp
            </a>
            <a
              href={smsLink}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold text-xs sm:text-sm text-center shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Mail className="h-3.5 w-3.5" />
              SMS Share
            </a>
            <button
              onClick={copy}
              className="bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-2xl font-bold text-xs sm:text-sm text-center shadow-sm transition"
            >
              {copied ? "Link Copied!" : "Copy Link"}
            </button>
          </div>
        </div>

        {/* Promotional Share Flyer Image Card */}
        <div className="mt-6 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-sm">
          <h3 className="font-black text-slate-900 text-base sm:text-lg">Promotional Share Card</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Save this image to share on your WhatsApp status, Instagram stories, or Telegram
            channels to collect referrals!
          </p>

          {/* Card Preview Graphic */}
          <div className="mt-4 border border-slate-200 rounded-2xl overflow-hidden bg-gradient-to-b from-blue-700 to-indigo-900 text-white p-6 relative max-w-sm mx-auto shadow-inner text-center">
            {/* Visual Header */}
            <h4 className="font-extrabold text-2xl tracking-tight">URBAN WASH</h4>
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mt-0.5">
              Wash • Ironing • Wash & Iron
            </p>

            {/* Delivery Highlight */}
            <div className="mt-4 bg-emerald-600 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] tracking-wide inline-block shadow-sm">
              🚚 FREE PICKUP & DELIVERY ALWAYS
            </div>

            {/* Offer details */}
            <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-3.5">
              <span className="block text-amber-400 text-3xl font-black leading-none">10% OFF</span>
              <span className="text-[9px] uppercase tracking-wider font-bold block mt-1">
                FIRST ORDER FOR STUDENTS
              </span>
            </div>

            <p className="mt-4 text-[10px] text-blue-200">
              Refer 3 Friends and Get a FREE Wash for Up to 5 Clothes
            </p>

            {/* QR Code SVG Image */}
            <div className="mt-4 bg-white p-2 rounded-xl inline-block shadow-md">
              {qrSvgUrl ? (
                <img src={qrSvgUrl} alt="Referral QR Code" className="h-32 w-32" />
              ) : (
                <div className="h-32 w-32 bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                  QR Loading...
                </div>
              )}
            </div>

            <p className="text-[9px] text-slate-300 font-bold tracking-wider mt-2.5">
              REGISTER NOW via QR Code
            </p>
            <p className="text-[8px] text-slate-400 mt-2">WhatsApp Contact: +255 686 771 750</p>
          </div>

          {/* Canvas for rendering and downloading flyer */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Download flyer action */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={downloadFlyer}
              disabled={flyerDownloading}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-60"
            >
              {flyerDownloading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating PNG...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Share Image (PNG)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Link
            to="/register"
            className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 py-3.5 rounded-2xl font-bold text-center text-sm shadow-sm transition block"
          >
            Register Another Student
          </Link>
          <a
            href={waUs}
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-bold text-center text-sm shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <Phone className="h-4 w-4" />
            Open WhatsApp Chat
          </a>
        </div>
      </main>
    </div>
  );
}
