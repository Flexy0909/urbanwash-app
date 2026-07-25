import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/urban-logo.png.asset.json";
import { loadStudents, saveStudent, syncWithCloud, getReferralCount, getReferralRewardStatus, type Student } from "@/lib/storage";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import {
  CalendarCheck,
  MapPin,
  Shirt,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Share2,
  Phone,
  LogOut,
  RefreshCw,
  Gift,
  Truck,
  ShoppingBag,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: StudentDashboardPage,
});

const WHATSAPP_CONTACT = "255687771750";

function StudentDashboardPage() {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    let activeId = "";
    if (typeof window !== "undefined") {
      activeId = localStorage.getItem("urbanwash_active_student") || "";
    }

    const localList = loadStudents();
    setAllStudents(localList);

    if (activeId) {
      const found = localList.find((s) => s.customerId === activeId);
      if (found) {
        setStudent(found);
      } else if (localList.length > 0) {
        // Fallback to most recent student
        setStudent(localList[localList.length - 1]);
      }
    } else if (localList.length > 0) {
      setStudent(localList[localList.length - 1]);
    }

    // Run background cloud sync
    setSyncing(true);
    syncWithCloud((merged) => {
      setAllStudents(merged);
      if (activeId) {
        const foundRemote = merged.find((s) => s.customerId === activeId);
        if (foundRemote) setStudent(foundRemote);
      }
      setSyncing(false);
    }).catch(() => setSyncing(false));
  }, []);

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("urbanwash_active_student");
    }
    navigate({ to: "/login" });
  }

  const refLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${student?.customerId ?? ""}`
      : `https://urbanwash.app/register?ref=${student?.customerId ?? ""}`;

  const shareText = `Hujambo! Jiunge na URBAN WASH 🧺 — washing, ironing & wash-iron services kwa wanafunzi wa ATC. FREE pickup & delivery! Jisajili hapa: ${refLink}`;
  const waShareLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  const waTrackUs = `https://wa.me/${WHATSAPP_CONTACT}?text=${encodeURIComponent(
    `Habari URBAN WASH! Nataka kufuatilia order yangu. Jina langu ni ${student?.fullName ?? ""}, Customer ID: ${student?.customerId ?? ""}, Chumba: ${student?.hostel ?? ""} ${student?.room ?? ""}.`,
  )}`;

  function copyRefLink() {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const [paymentFeedback, setPaymentFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<"M-Pesa" | "Airtel Money" | "Cash" | null>(null);
  const [ratingFeedback, setRatingFeedback] = useState<string | null>(null);

  // Calculate order progress step (1 to 4)
  const getStepIndex = (status?: string) => {
    switch (status) {
      case "Lead Registered":
        return 1;
      case "Contacted":
        return 2;
      case "First Order Completed":
      case "Repeat Customer":
      case "VIP Customer":
        return 4;
      default:
        return 2;
    }
  };

  const stepIndex = getStepIndex(student?.status);

  const refCount = student ? getReferralCount(student.customerId, allStudents) : 0;
  const refReward = student ? getReferralRewardStatus(student.customerId, allStudents) : "Pending";

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 text-center">
        <div className="bg-white rounded-3xl p-8 max-w-sm border border-slate-100 shadow-xl space-y-4">
          <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-black text-slate-900">No Account Logged In</h2>
          <p className="text-xs text-slate-500">
            Please log in with your phone number or schedule your first pickup to view your dashboard.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition"
            >
              Log In to My Order
            </Link>
            <Link
              to="/register"
              className="border border-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition hover:bg-slate-50"
            >
              Schedule Pickup
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      {/* Navigation Header */}
      <Navbar syncing={syncing} />

      {/* Dashboard Main Content */}
      <main className="flex-1 mx-auto max-w-4xl px-4 mt-6 space-y-6 w-full">

        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-blue-800/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider border border-blue-500/30">
                🎓 ATC Student Account
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
                Hi, {student.fullName.split(" ")[0]} 👋
              </h1>
              <p className="text-xs sm:text-sm text-blue-200 mt-1 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-teal-300" />
                {student.hostel} • Room {student.room}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2.5 shrink-0">
              <div className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 text-center sm:text-right w-full">
                <span className="text-[10px] text-blue-200 block font-semibold uppercase tracking-wider">Customer ID</span>
                <span className="font-mono text-base font-black text-white tracking-wider">
                  {student.customerId}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 hover:text-white border border-rose-500/40 text-xs font-extrabold px-3.5 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Order Urgency Banner if Leaving Campus Today */}
        {student.leavingCampus === "Today" && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-3xl text-xs font-semibold leading-relaxed flex items-start gap-3 shadow-sm animate-pulse">
            <span className="text-xl">🚨</span>
            <div>
              <p className="font-extrabold text-rose-900 text-sm">Priority Dispatch Flagged!</p>
              <p className="text-xs text-rose-700 mt-0.5">
                You indicated leaving campus today. Our dispatcher will prioritize your pickup & delivery.
              </p>
            </div>
          </div>
        )}

        {/* ─── REAL-TIME ORDER TRACKING STEPPER ─── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                  Live Order Tracking
                </h2>
                <span className="font-mono text-xs font-black bg-slate-900 text-amber-300 px-3 py-1 rounded-xl shadow-xs">
                  Order ID: {student.orderId || `ORD-2026-${student.customerId.slice(-4)}`}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Track your laundry pickup & delivery status in real time</p>
            </div>

            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 self-start sm:self-auto">
              Status: {student.status}
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="relative py-4">
            {/* Progress line */}
            <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-slate-100 -translate-y-1/2 rounded-full z-0" />
            <div
              className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-blue-600 to-emerald-500 -translate-y-1/2 rounded-full z-0 transition-all duration-700"
              style={{ width: `${((stepIndex - 1) / 3) * 100}%` }}
            />

            {/* Stepper Nodes */}
            <div className="relative z-10 flex justify-between">
              {[
                { title: "Booked", desc: "Order Received", step: 1, icon: "📥" },
                { title: "Pickup", desc: "En Route", step: 2, icon: "🚚" },
                { title: "Processing", desc: "Wash & Iron", step: 3, icon: "🧼" },
                { title: "Delivered", desc: "Back to Room", step: 4, icon: "✅" },
              ].map((s) => {
                const isCompleted = stepIndex >= s.step;
                const isCurrent = stepIndex === s.step;
                return (
                  <div key={s.step} className="flex flex-col items-center text-center max-w-[80px] sm:max-w-[100px]">
                    <div
                      className={`h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        isCompleted
                          ? "bg-emerald-500 text-white shadow-md ring-4 ring-emerald-100"
                          : isCurrent
                            ? "bg-blue-600 text-white ring-4 ring-blue-100 animate-bounce"
                            : "bg-white text-slate-400 border-2 border-slate-200"
                      }`}
                    >
                      {s.icon}
                    </div>
                    <span className={`text-xs font-bold mt-2 ${isCompleted ? "text-slate-900" : "text-slate-400"}`}>
                      {s.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium hidden sm:block">
                      {s.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action to contact dispatcher */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-600">
              Need to change pickup date or ask a question?
            </p>
            <a
              href={waTrackUs}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-3 px-5 rounded-2xl shadow-sm transition"
            >
              <Phone className="h-4 w-4" />
              Chat with WhatsApp Dispatcher
            </a>
          </div>
        </div>

        {/* ─── ITEMIZED CLOTHES & ADMIN VERIFICATION STATUS ─── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                📋 Scheduled Order Breakdown
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
                <Shirt className="h-5 w-5 text-indigo-600" />
                Itemized Clothes & Pricing
              </h3>
            </div>

            {/* Admin Verification Badge */}
            <span
              className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 border self-start sm:self-auto ${
                student.adminVerified
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm"
                  : "bg-amber-50 text-amber-800 border-amber-300 animate-pulse"
              }`}
            >
              {student.adminVerified ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Verified at Pickup by Admin
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 text-amber-600" />
                  Pending Admin Pickup Check
                </>
              )}
            </span>
          </div>

          {/* Admin Verification Note Alert */}
          {student.adminVerified && student.adminVerificationNotes && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-semibold flex items-start gap-2.5">
              <div>
                <p className="font-extrabold">Admin Verification Note:</p>
                <p className="text-emerald-800 text-[11px] mt-0.5">{student.adminVerificationNotes}</p>
              </div>
            </div>
          )}

          {/* Items Table */}
          {student.orderItems && student.orderItems.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3 text-center">Service</th>
                    <th className="p-3 text-center">Quantity</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {student.orderItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-800 flex items-center gap-2">
                        <span>{item.itemName}</span>
                        {item.isCustom && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200">
                            Custom Item
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center text-slate-600 font-semibold">{item.serviceType}</td>
                      <td className="p-3 text-center font-mono font-extrabold text-slate-900">{item.quantity}</td>
                      <td className="p-3 text-right font-mono text-slate-600">
                        {item.unitPrice ? `TShs ${item.unitPrice.toLocaleString()}/=` : "Pending"}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-blue-700">
                        {item.totalPrice ? `TShs ${item.totalPrice.toLocaleString()}/=` : "Pending Pricing"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs text-slate-500 italic">
              Standard Laundry Pickup — Item counts will be verified by the admin upon collection.
            </div>
          )}

          {/* Pricing Summary */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div>
              <p className="text-xs text-slate-300 font-bold">
                {student.adminVerified ? "Final Confirmed Amount:" : "Estimated Order Total:"}
              </p>
              <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono tracking-tight">
                TShs {(student.adminConfirmedTotal || student.estimatedTotal || 0).toLocaleString()}/=
              </p>
              {!student.adminVerified && (
                <p className="text-[10px] text-amber-300 font-medium mt-0.5">
                  * Final count & pricing will be confirmed by admin on receiving your clothes.
                </p>
              )}
            </div>

            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition shadow-md"
            >
              + Schedule Another Pickup Order
            </Link>
          </div>
        </div>

        {/* ─── ORDER DETAILS GRID ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col items-center text-center gap-1.5">
            <CalendarCheck className="h-6 w-6 text-blue-600" />
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Scheduled Date</p>
            <p className="text-sm font-black text-slate-900">
              {student.pickupDate
                ? new Date(student.pickupDate + "T00:00:00").toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })
                : "Standard"}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col items-center text-center gap-1.5">
            <Clock className="h-6 w-6 text-teal-600" />
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Time Window</p>
            <p className="text-xs font-black text-slate-900 leading-tight">
              {student.pickupTimeSlot ? student.pickupTimeSlot.split(" ")[0] + " Slot" : "Morning"}
            </p>
            <p className="text-[10px] text-slate-500">
              {student.pickupTimeSlot ? student.pickupTimeSlot.match(/\((.*?)\)/)?.[1] : "8AM - 11AM"}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col items-center text-center gap-1.5">
            <Shirt className="h-6 w-6 text-indigo-600" />
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Services</p>
            <p className="text-xs font-black text-slate-900 line-clamp-1">
              {student.services?.join(", ") || "Washing & Ironing"}
            </p>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col items-center text-center gap-1.5">
            <Zap className="h-6 w-6 text-amber-500" />
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Service Speed</p>
            <p className="text-sm font-black text-slate-900">
              {student.serviceSpeed}
            </p>
          </div>
        </div>

        {/* ─── MOBILE MONEY PAYMENT CARD ─── */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                💳 Payment & Till Information
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Mobile Money Payment</h3>
            </div>

            {/* Payment Status Badge */}
            <span
              className={`text-xs font-extrabold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 self-start sm:self-auto border ${
                student.paymentStatus === "Paid"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : student.paymentStatus === "Verification Submitted"
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  student.paymentStatus === "Paid"
                    ? "bg-emerald-500"
                    : student.paymentStatus === "Verification Submitted"
                      ? "bg-amber-500 animate-pulse"
                      : "bg-slate-400"
                }`}
              />
              {student.paymentStatus === "Paid"
                ? "Paid & Confirmed"
                : student.paymentStatus === "Verification Submitted"
                  ? "Verification Submitted"
                  : "Payment Pending"}
            </span>
          </div>

          {/* Clickable Payment Method Cards */}
          <div className="pt-1">
            <p className="text-xs font-bold text-slate-700 mb-3">👇 Click your payment method to see payment details:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              {/* M-Pesa Card */}
              <button
                type="button"
                onClick={() => setSelectedPayment(selectedPayment === "M-Pesa" ? null : "M-Pesa")}
                className={`text-left rounded-2xl p-4 border-2 transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] ${
                  selectedPayment === "M-Pesa"
                    ? "border-rose-500 bg-rose-50 ring-2 ring-rose-300"
                    : "border-rose-200 bg-rose-50/50 hover:border-rose-400"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-rose-900 uppercase tracking-wide">🔴 M-Pesa</span>
                  {selectedPayment === "M-Pesa" && <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full">Selected ✓</span>}
                </div>
                <p className="text-[10px] text-rose-700 font-semibold">Tap to pay via Vodacom</p>
              </button>

              {/* Airtel Money Card */}
              <button
                type="button"
                onClick={() => setSelectedPayment(selectedPayment === "Airtel Money" ? null : "Airtel Money")}
                className={`text-left rounded-2xl p-4 border-2 transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] ${
                  selectedPayment === "Airtel Money"
                    ? "border-red-500 bg-red-50 ring-2 ring-red-300"
                    : "border-red-200 bg-red-50/50 hover:border-red-400"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-red-900 uppercase tracking-wide">🔴 Airtel Money</span>
                  {selectedPayment === "Airtel Money" && <span className="text-[10px] bg-red-500 text-white font-bold px-2 py-0.5 rounded-full">Selected ✓</span>}
                </div>
                <p className="text-[10px] text-red-700 font-semibold">Tap to pay via Airtel</p>
              </button>

              {/* Cash Card */}
              <button
                type="button"
                onClick={() => setSelectedPayment(selectedPayment === "Cash" ? null : "Cash")}
                className={`text-left rounded-2xl p-4 border-2 transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] ${
                  selectedPayment === "Cash"
                    ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-300"
                    : "border-emerald-200 bg-emerald-50/50 hover:border-emerald-400"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-emerald-900 uppercase tracking-wide">💵 Cash</span>
                  {selectedPayment === "Cash" && <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">Selected ✓</span>}
                </div>
                <p className="text-[10px] text-emerald-700 font-semibold">Pay on Delivery</p>
              </button>
            </div>

            {/* M-Pesa Details — shows when clicked */}
            {selectedPayment === "M-Pesa" && (
              <div className="mt-4 bg-rose-50 border-2 border-rose-400 rounded-2xl p-5 space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-black text-rose-900">🔴 M-Pesa Payment Details</span>
                  <span className="text-[10px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded-full">Vodacom</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-3 border border-rose-200">
                    <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wide mb-1">Till Number</p>
                    <p className="text-2xl font-black font-mono tracking-wider text-rose-950">351752257</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-rose-200">
                    <p className="text-[10px] text-rose-600 font-bold uppercase tracking-wide mb-1">Account Name</p>
                    <p className="text-sm font-black text-rose-950 leading-tight">CALSON VICENT MSANGI</p>
                  </div>
                </div>
                <div className="bg-rose-100 rounded-xl p-3 border border-rose-200">
                  <p className="text-[10px] text-rose-700 font-bold uppercase tracking-wide mb-1">📱 How to Pay (M-Pesa)</p>
                  <ol className="text-xs text-rose-900 font-medium space-y-0.5 list-decimal list-inside">
                    <li>Dial <span className="font-mono font-black">*150*00#</span> on Vodacom</li>
                    <li>Select <strong>Lipa kwa Till</strong></li>
                    <li>Enter Till: <span className="font-mono font-black">351752257</span></li>
                    <li>Confirm name: <strong>CALSON VICENT MSANGI</strong></li>
                    <li>Enter amount & your PIN</li>
                    <li>Copy the SMS transaction code below ↓</li>
                  </ol>
                </div>
                <p className="text-[11px] text-rose-700 font-semibold">
                  Sample code: <span className="font-mono font-bold text-rose-950">DG4681NW4K</span>
                </p>
              </div>
            )}

            {/* Airtel Money Details — shows when clicked */}
            {selectedPayment === "Airtel Money" && (
              <div className="mt-4 bg-red-50 border-2 border-red-400 rounded-2xl p-5 space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-black text-red-900">🔴 Airtel Money Payment Details</span>
                  <span className="text-[10px] bg-red-200 text-red-900 font-bold px-2 py-0.5 rounded-full">Airtel</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-xl p-3 border border-red-200">
                    <p className="text-[10px] text-red-600 font-bold uppercase tracking-wide mb-1">Till Number</p>
                    <p className="text-2xl font-black font-mono tracking-wider text-red-950">655451652</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-red-200">
                    <p className="text-[10px] text-red-600 font-bold uppercase tracking-wide mb-1">Account Name</p>
                    <p className="text-sm font-black text-red-950 leading-tight">URBANWASH</p>
                  </div>
                </div>
                <div className="bg-red-100 rounded-xl p-3 border border-red-200">
                  <p className="text-[10px] text-red-700 font-bold uppercase tracking-wide mb-1">📱 How to Pay (Airtel Money)</p>
                  <ol className="text-xs text-red-900 font-medium space-y-0.5 list-decimal list-inside">
                    <li>Dial <span className="font-mono font-black">*150*60#</span> on Airtel</li>
                    <li>Select <strong>Lipa kwa Biashara</strong></li>
                    <li>Enter Till: <span className="font-mono font-black">655451652</span></li>
                    <li>Confirm name: <strong>URBANWASH</strong></li>
                    <li>Enter amount & your PIN</li>
                    <li>Copy the SMS transaction code below ↓</li>
                  </ol>
                </div>
                <p className="text-[11px] text-red-700 font-semibold">
                  Sample code: <span className="font-mono font-bold text-red-950">TID:MP260728.2242.Z52912</span>
                </p>
              </div>
            )}

            {/* Cash Details — shows when clicked */}
            {selectedPayment === "Cash" && (
              <div className="mt-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-5 space-y-2 animate-fade-in">
                <span className="text-sm font-black text-emerald-900">💵 Cash on Delivery</span>
                <p className="text-xs text-emerald-800 font-medium">
                  Pay our agent directly in cash when they deliver your clean laundry. No transaction code needed — select <strong>Cash</strong> below and click <strong>Submit</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Payment Verification Submission Form */}
          {student.paymentStatus !== "Paid" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPaymentFeedback(null);
                const form = e.currentTarget;
                const method = (selectedPayment || (form.elements.namedItem("method") as HTMLSelectElement)?.value || "M-Pesa") as "M-Pesa" | "Airtel Money" | "Cash";
                const code = (form.elements.namedItem("code") as HTMLInputElement).value.trim();

                if (!code && method !== "Cash") {
                  setPaymentFeedback({
                    type: "error",
                    message: "Please enter your M-Pesa or Airtel Money transaction code.",
                  });
                  return;
                }

                const updated = {
                  ...student,
                  paymentMethod: method,
                  transactionCode: code || "CASH",
                  paymentStatus: "Verification Submitted" as const,
                  paymentDenialReason: undefined,
                };
                saveStudent(updated);
                setStudent(updated);
                setPaymentFeedback({
                  type: "success",
                  message: "Payment transaction code submitted! Our admin team will verify your payment shortly.",
                });
              }}
              className="mt-4 pt-4 border-t border-slate-100 space-y-3"
            >
              <p className="text-xs font-bold text-slate-800">Submit Payment Transaction Code for Admin Verification</p>

              {student.paymentStatus === "Denied" && (
                <div className="p-3.5 bg-rose-50 border-2 border-rose-300 text-rose-900 rounded-2xl text-xs font-semibold space-y-1 animate-fade-in">
                  <div className="flex items-center gap-2 text-rose-800 font-extrabold text-xs">
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                    <span>❌ Payment Transaction Code Denied by Admin</span>
                  </div>
                  <p className="text-rose-950 font-bold pl-6">
                    Reason: <span className="underline decoration-rose-300">{student.paymentDenialReason || "Invalid transaction code."}</span>
                  </p>
                  <p className="text-[11px] text-rose-700 pl-6">
                    Please check your SMS receipt and re-enter the correct M-Pesa or Airtel Money code below for re-verification.
                  </p>
                </div>
              )}

              {paymentFeedback && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in ${
                    paymentFeedback.type === "success"
                      ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                      : "bg-rose-50 text-rose-900 border border-rose-200"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{paymentFeedback.message}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2.5">
                {/* Hidden select synced to selectedPayment */}
                <select
                  name="method"
                  value={selectedPayment || student.paymentMethod || "M-Pesa"}
                  onChange={(e) => setSelectedPayment(e.target.value as "M-Pesa" | "Airtel Money" | "Cash")}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="M-Pesa">M-Pesa (Till 351752257 — CALSON VICENT MSANGI)</option>
                  <option value="Airtel Money">Airtel Money (Till 655451652 — URBANWASH)</option>
                  <option value="Cash">Cash on Delivery</option>
                </select>

                {(selectedPayment !== "Cash") && (
                  <input
                    type="text"
                    name="code"
                    defaultValue={student.transactionCode || ""}
                    placeholder="Enter Transaction Code e.g. DG4681NW4K"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm cursor-pointer shrink-0"
                >
                  Submit Payment Code →
                </button>
              </div>

              {student.transactionCode && (
                <p className="text-[11px] text-amber-700 font-semibold bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  Submitted Transaction Code: <span className="font-mono font-bold text-slate-900">{student.transactionCode}</span> ({student.paymentMethod || "M-Pesa"}) — Pending admin verification.
                </p>
              )}
            </form>
          )}

          {student.paymentStatus === "Paid" && (
            <div className="mt-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Payment confirmed by admin via {student.paymentMethod || "Mobile Money"}. Thank you!</span>
            </div>
          )}
        </div>

        {/* ─── 5-STAR STUDENT SERVICE RATING CARD ─── */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                ⭐ Student Feedback & Review
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">Rate Your URBAN WASH Experience</h3>
            </div>
            {student.rating && (
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                {student.rating} / 5 Stars Rated
              </span>
            )}
          </div>

          {ratingFeedback && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{ratingFeedback}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setRatingFeedback(null);
              const form = e.currentTarget;
              const selectedStars = parseInt((form.elements.namedItem("starRating") as HTMLInputElement).value || "5", 10);
              const comment = (form.elements.namedItem("comment") as HTMLTextAreaElement).value.trim();

              const updated = {
                ...student,
                rating: selectedStars,
                ratingComment: comment,
              };
              saveStudent(updated);
              setStudent(updated);
              setRatingFeedback("Thank you for your rating! Your feedback helps us serve ATC students better.");
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Your Rating:</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <label key={star} className="cursor-pointer group">
                    <input
                      type="radio"
                      name="starRating"
                      value={star}
                      defaultChecked={(student.rating || 5) === star}
                      className="sr-only peer"
                    />
                    <span className="text-2xl text-slate-300 peer-checked:text-amber-400 group-hover:text-amber-300 transition">
                      ★
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Optional Feedback Comment:</label>
              <textarea
                name="comment"
                rows={2}
                defaultValue={student.ratingComment || ""}
                placeholder="Tell us about the wash quality, speed, or ironing..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
            >
              Submit Star Rating ⭐
            </button>
          </form>
        </div>

        {/* ─── REFERRAL PROGRAM DASHBOARD CARD ─── */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-indigo-800/40">
          <div className="flex items-center justify-between">
            <span className="bg-blue-500/20 text-blue-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-500/30">
              🎁 Referral Rewards Program
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${refReward === "Unlocked" ? "bg-emerald-500/30 text-emerald-300 border border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border border-amber-500/30"}`}>
              {refReward === "Unlocked" ? "🎉 FREE WASH UNLOCKED!" : `${refCount}/3 Friends Referred`}
            </span>
          </div>

          <h3 className="text-xl font-black mt-3">Invite Friends & Earn Free Washes</h3>
          <p className="text-xs text-blue-100 mt-1 leading-relaxed">
            Share your personal referral link with hostel mates. When 3 friends register, you unlock a <strong>FREE wash for up to 5 clothes</strong> (worth TZS 2,500)!
          </p>

          {/* Referral Link Box */}
          <div className="mt-5 bg-black/30 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3">
            <span className="font-mono text-xs text-blue-200 truncate select-all">{refLink}</span>
            <button
              onClick={copyRefLink}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <a
              href={waShareLink}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition text-center flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Share2 className="h-4 w-4" />
              Share on WhatsApp Status
            </a>
            <Link
              to="/register"
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-3 px-5 rounded-xl transition text-center"
            >
              Schedule New Pickup 🧺
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
