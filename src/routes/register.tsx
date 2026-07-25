import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import logo from "@/assets/urban-logo.png.asset.json";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { saveStudent, loadStudents, generateCustomerId, generateOrderId, syncWithCloud, ITEM_PRICING, getItemUnitPrice, type Student, type OrderItem } from "@/lib/storage";
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
  RefreshCw,
  CalendarCheck,
  Plane,
  Calendar,
  Lock,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>): { ref?: string; speed?: string } => ({
    ref: typeof s.ref === "string" ? s.ref : undefined,
    speed: typeof s.speed === "string" ? s.speed : undefined,
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
  const search = useSearch({ from: "/register" });
  const refFromUrl = search.ref || "";
  const initialSpeed = search.speed === "Express" ? "Express" : "Standard";
  const ref = refFromUrl;

  // Form states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [sameWhats, setSameWhats] = useState(true);
  const [whatsapp, setWhatsapp] = useState("");
  const [hostel, setHostel] = useState("");
  const [room, setRoom] = useState("");
  const [services, setServices] = useState<string[]>(["Wash & Iron"]);
  const [offer, setOffer] = useState("Standard Student Wash");
  const [referral, setReferral] = useState<"Yes" | "No">("Yes");
  const [referredByInput, setReferredByInput] = useState(refFromUrl);
  const [consent, setConsent] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [serviceSpeed, setServiceSpeed] = useState<"Standard" | "Express">(initialSpeed);
  const [leavingCampus, setLeavingCampus] = useState<Student["leavingCampus"] | "">("");

  // Pickup date — min is today
  const todayStr = new Date().toISOString().split("T")[0];
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTimeSlot, setPickupTimeSlot] = useState<Student["pickupTimeSlot"] | "">("");
  const [pinCode, setPinCode] = useState("");

  const [activeStudent, setActiveStudent] = useState<Student | null>(null);

  // Itemized Order State & Custom Items
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [itemServices, setItemServices] = useState<Record<string, OrderItem["serviceType"]>>({});
  const [customItemName, setCustomItemName] = useState("");
  const [customItemQty, setCustomItemQty] = useState<number>(1);
  const [customItemService, setCustomItemService] = useState<OrderItem["serviceType"]>("Wash & Iron");

  // Calculate live total price
  const estimatedTotal = useMemo(() => {
    return orderItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
  }, [orderItems]);

  const hasPendingCustomItems = useMemo(() => {
    return orderItems.some((item) => item.isCustom);
  }, [orderItems]);

  const updateItemQty = (itemName: string, serviceType: OrderItem["serviceType"], qty: number, isExpressOverride?: boolean) => {
    const isExp = isExpressOverride !== undefined ? isExpressOverride : serviceSpeed === "Express";
    setOrderItems((prev) => {
      const idx = prev.findIndex((x) => x.itemName === itemName && !x.isCustom);
      if (qty <= 0) {
        if (idx < 0) return prev;
        return prev.filter((_, i) => i !== idx);
      }
      const unitPrice = getItemUnitPrice(itemName, serviceType, isExp);
      const totalPrice = unitPrice * qty;
      const updated: OrderItem = {
        itemName,
        quantity: qty,
        serviceType,
        unitPrice,
        totalPrice,
        isCustom: false,
        pricingStatus: "Calculated",
      };
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      } else {
        return [...prev, updated];
      }
    });
  };

  const handleSpeedChange = (newSpeed: "Standard" | "Express") => {
    setServiceSpeed(newSpeed);
    const isExp = newSpeed === "Express";
    setOrderItems((prev) =>
      prev.map((item) => {
        if (item.isCustom) return item;
        const unitPrice = getItemUnitPrice(item.itemName, item.serviceType, isExp);
        return {
          ...item,
          unitPrice,
          totalPrice: unitPrice * item.quantity,
        };
      }),
    );
  };

  const addCustomItem = () => {
    if (!customItemName.trim()) return;
    const newItem: OrderItem = {
      itemName: customItemName.trim(),
      quantity: Math.max(1, customItemQty),
      serviceType: customItemService,
      unitPrice: 0,
      totalPrice: 0,
      isCustom: true,
      pricingStatus: "Pending Admin Pricing",
    };
    setOrderItems((prev) => [...prev, newItem]);
    setCustomItemName("");
    setCustomItemQty(1);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if a student is logged in and prefill their schedule form
    const activeId = localStorage.getItem("urbanwash_active_student");
    if (activeId) {
      const all = loadStudents();
      const found = all.find((s) => s.customerId === activeId);
      if (found) {
        setActiveStudent(found);
        setFullName(found.fullName);
        setPhone(found.phone);
        setWhatsapp(found.whatsapp);
        setHostel(found.hostel);
        setRoom(found.room);
        if (found.pinCode) setPinCode(found.pinCode);
      }
    }

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
    if (activeStudent) {
      return z.object({
        services: z
          .array(z.string())
          .min(1, "Please select at least one laundry service of interest"),
        serviceSpeed: z.enum(["Standard", "Express"]),
        consent: z.literal(true, {
          errorMap: () => ({
            message: "You must agree to terms to schedule",
          }),
        }),
      });
    }

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
      pinCode: z.string().regex(/^\d{4}$/, "Create a 4-digit PIN for secure login (e.g. 1234)"),
      consent: z.literal(true, {
        errorMap: () => ({
          message: "You must agree to receive marketing notifications to register",
        }),
      }),
    });
  }, [activeStudent, isNumericRoom, sameWhats]);

  function toggleService(s: string) {
    setServices((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const rawPhone = cleanPhone(phone);
    const rawWhatsapp = sameWhats ? rawPhone : cleanPhone(whatsapp);

    const validationData = activeStudent
      ? {
          services,
          serviceSpeed,
          consent,
          pickupDate,
          pickupTimeSlot,
        }
      : {
          fullName,
          phone: rawPhone,
          whatsapp: rawWhatsapp,
          hostel,
          room: room.trim().toUpperCase(),
          services,
          serviceSpeed,
          consent,
          pickupDate,
          pickupTimeSlot,
          pinCode,
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
    const studentId = activeStudent ? activeStudent.customerId : generateCustomerId();
    const finalName = activeStudent ? activeStudent.fullName : fullName.trim();
    const finalPhone = activeStudent ? activeStudent.phone : rawPhone;
    const finalWhatsapp = activeStudent ? activeStudent.whatsapp : rawWhatsapp;
    const finalHostel = activeStudent ? activeStudent.hostel : hostel;
    const finalRoom = activeStudent ? activeStudent.room : room.trim().toUpperCase();
    const finalPin = activeStudent ? activeStudent.pinCode : pinCode;

    const student: Student = {
      customerId: studentId,
      orderId: generateOrderId(),
      fullName: finalName,
      phone: finalPhone,
      whatsapp: finalWhatsapp,
      hostel: finalHostel,
      room: finalRoom,
      services: services.length > 0 ? services : ["Washing", "Ironing"],
      offer: activeStudent ? activeStudent.offer : offer,
      referralStatus: referral,
      referredBy: ref,
      consent,
      status: "Lead Registered",
      createdAt: new Date().toISOString(),
      serviceSpeed,
      leavingCampus: leavingCampus || undefined,
      pickupDate: pickupDate || undefined,
      pickupTimeSlot: pickupTimeSlot || undefined,
      pinCode: finalPin || undefined,
      orderItems: orderItems.length > 0 ? orderItems : undefined,
      estimatedTotal: estimatedTotal > 0 ? estimatedTotal : undefined,
    };

    try {
      // Save locally (triggers Supabase async background sync)
      saveStudent(student);

      if (typeof window !== "undefined") {
        localStorage.setItem("urbanwash_active_student", studentId);
      }

      // Redirect directly to personalized Student Dashboard
      navigate({
        to: "/dashboard",
      });
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Failed to save registration. Please try again." });
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <Navbar />

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
                Student Account Registration & Pickup
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Enter your student profile information to create your account and schedule your laundry pickup.
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

          {/* Account Status / Login Required Banner */}
          {activeStudent ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-extrabold text-sm text-emerald-950">Logged in as {activeStudent.fullName}</p>
                  <p className="text-emerald-800 text-[11px]">
                    Customer ID: <span className="font-mono font-bold">{activeStudent.customerId}</span> • Phone: {activeStudent.phone}
                  </p>
                </div>
              </div>
              <Link
                to="/dashboard"
                className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl transition shrink-0"
              >
                My Dashboard →
              </Link>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 text-amber-950 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <Lock className="h-5 w-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-extrabold text-sm text-amber-950">Already registered with UrbanWash?</p>
                  <p className="text-amber-800 text-[11px]">
                    Please log in first to quickly schedule your pickup with your saved details.
                  </p>
                </div>
              </div>
              <Link
                to="/login"
                search={{ redirect: "/register", intent: "schedule" }}
                className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-3 py-1.5 rounded-xl transition shrink-0 shadow-sm"
              >
                Log In First →
              </Link>
            </div>
          )}

          {/* Offline warning banner */}
          {!isOnline && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-[11px] leading-relaxed">
              ⚠️ <strong>Offline Mode:</strong> Registrations will cache locally and sync
              automatically when internet access is restored.
            </div>
          )}

          {ref && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                🎁 Referred by student <strong>{ref}</strong>. Complete registration to claim free delivery & rewards!
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
          {/* Account Registration Credentials — Only required for NEW students */}
          {!activeStudent && (
            <div className="space-y-6 pb-6 border-b border-slate-100">
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                1. Account & Contact Information
              </h2>

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
                      placeholder="e.g. 0712345678"
                      disabled={submitting}
                    />
                    {errors.whatsapp && (
                      <p className="text-rose-500 text-xs mt-1 font-medium">{errors.whatsapp}</p>
                    )}
                  </div>
                )}
              </div>

              {/* ─── SECURITY PIN CODE FIELD ─── */}
              <div id="field-pinCode">
                <FieldLabel
                  icon={<Lock className="h-4 w-4 text-indigo-500" />}
                  label="Create Account 4-Digit Security PIN"
                  required
                />
                <p className="text-xs text-slate-400 mb-2">
                  Set a 4-digit PIN so you can securely log in to track your order anytime.
                </p>
                <input
                  type="password"
                  maxLength={4}
                  inputMode="numeric"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  className={`${inputCls} font-mono tracking-widest text-center text-lg ${
                    errors.pinCode ? "border-rose-400 focus:ring-rose-200" : ""
                  }`}
                  placeholder="••••"
                  disabled={submitting}
                />
                {errors.pinCode && (
                  <p className="text-rose-500 text-xs mt-1 font-medium">{errors.pinCode}</p>
                )}
              </div>

              {/* Hostel Selection */}
              <div id="field-hostel">
                <FieldLabel icon={<Home className="h-4 w-4 text-blue-500" />} label="Hostel" required />
                <select
                  value={hostel}
                  onChange={(e) => {
                    setHostel(e.target.value);
                    setRoom("");
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
                      if (isNumericRoom) {
                        setRoom(val.replace(/\D/g, ""));
                      } else {
                        setRoom(val.replace(/[^A-Za-z0-9]/g, ""));
                      }
                    }}
                    className={`${inputCls} ${errors.room ? "border-rose-400 focus:ring-rose-200" : ""}`}
                    placeholder={isNumericRoom ? "e.g. 205" : "e.g. H06B"}
                    disabled={submitting}
                    inputMode={isNumericRoom ? "numeric" : "text"}
                  />
                  {errors.room && (
                    <p className="text-rose-500 text-xs mt-1 font-medium">{errors.room}</p>
                  )}
                </div>
              )}
            </div>
          )}



          {/* ─── PICKUP DATE PICKER ─── */}
          <div id="field-pickupDate">
            <FieldLabel
              icon={<Calendar className="h-4 w-4 text-blue-500" />}
              label="Preferred Pickup Date"
              required
            />
            <p className="text-xs text-slate-400 mb-3">
              Choose the date you'd like us to collect your laundry.
            </p>
            <div className="relative">
              <input
                type="date"
                value={pickupDate}
                min={todayStr}
                onChange={(e) => setPickupDate(e.target.value)}
                disabled={submitting}
                className={`w-full px-4 py-3.5 rounded-2xl border bg-white text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition text-sm shadow-inner cursor-pointer ${
                  errors.pickupDate
                    ? "border-rose-400 focus:ring-rose-200"
                    : "border-slate-200"
                }`}
              />
            </div>
            {pickupDate && (
              <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                <CalendarCheck className="h-4 w-4 shrink-0" />
                Pickup scheduled for:{" "}
                <span className="font-black">
                  {new Date(pickupDate + "T00:00:00").toLocaleDateString("en-GB", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
            {errors.pickupDate && (
              <p className="text-rose-500 text-xs mt-1 font-medium">{errors.pickupDate}</p>
            )}
          </div>

          {/* ─── PICKUP TIME SLOT ─── */}
          <div id="field-pickupTimeSlot">
            <FieldLabel
              icon={<Clock className="h-4 w-4 text-blue-500" />}
              label="Preferred Pickup Time Slot"
            />
            <p className="text-xs text-slate-400 mb-3">
              Select the time window that works best for your schedule.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { slot: "Morning (8AM - 11AM)", emoji: "🌅", time: "8:00 AM - 11:00 AM" },
                { slot: "Afternoon (1PM - 4PM)", emoji: "☀️", time: "1:00 PM - 4:00 PM" },
                { slot: "Evening (7PM - 10PM)", emoji: "🌙", time: "7:00 PM - 10:00 PM" },
              ].map(({ slot, emoji, time }) => {
                const active = pickupTimeSlot === slot;
                return (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => setPickupTimeSlot(active ? "" : (slot as Student["pickupTimeSlot"]))}
                    disabled={submitting}
                    className={`px-3.5 py-3 rounded-2xl border text-xs font-bold transition cursor-pointer flex flex-col items-center gap-1 ${
                      active
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white border-slate-200 text-slate-700 hover:border-blue-300"
                    }`}
                  >
                    <span className="text-lg">{emoji}</span>
                    <span className="font-extrabold">{slot.split(" ")[0]}</span>
                    <span className={`text-[10px] ${active ? "text-blue-100" : "text-slate-400"}`}>{time}</span>
                  </button>
                );
              })}
            </div>
          </div>

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

          {/* ─── ITEMIZED CLOTHES & LIVE AUTO-PRICING CALCULATOR ─── */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm border border-slate-200/90">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  ⚡ Live Auto-Pricing Calculator
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">Select Clothes & Quantities</h3>
                <p className="text-xs text-slate-500">Enter item counts — prices calculate automatically in real time!</p>
              </div>
              <Sparkles className="h-6 w-6 text-amber-500 shrink-0" />
            </div>

            {/* Standard Items Selector Grid */}
            <div className="space-y-3 pt-1">
              {[
                { name: "Shirt / T-Shirt", emoji: "👕" },
                { name: "Suruali (Trousers/Jeans)", emoji: "👖" },
                { name: "Shuka (Bed Sheet)", emoji: "🛌" },
                { name: "Kanzu", emoji: "👘" },
                { name: "Taulo (Towel)", emoji: "🧴" },
                { name: "Sweta / Hoodie", emoji: "🧥" },
                { name: "Lab Coat", emoji: "🥼" },
                { name: "Blanket / Duvet", emoji: "🛌" },
              ].map((item) => {
                const itemEntry = orderItems.find((x) => x.itemName === item.name && !x.isCustom);
                const qty = itemEntry?.quantity || 0;
                const currentService = itemServices[item.name] || itemEntry?.serviceType || "Wash & Iron";
                const unitPrice = getItemUnitPrice(item.name, currentService, serviceSpeed === "Express");

                return (
                  <div key={item.name} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">{item.emoji}</span>
                      <div>
                        <p className="font-extrabold text-xs text-slate-900">{item.name}</p>
                        <p className="text-[11px] text-slate-500">
                          Unit Price: <span className="text-blue-700 font-mono font-bold">TShs {unitPrice.toLocaleString()}/=</span>
                          {serviceSpeed === "Express" && (
                            <span className="ml-1.5 text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded-full uppercase">Express</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 justify-between sm:justify-end">
                      {/* Service Type Selection */}
                      <select
                        value={currentService}
                        onChange={(e) => {
                          const newSvc = e.target.value as OrderItem["serviceType"];
                          setItemServices((prev) => ({ ...prev, [item.name]: newSvc }));
                          if (qty > 0) {
                            updateItemQty(item.name, newSvc, qty);
                          }
                        }}
                        className="bg-white border border-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
                      >
                        <option value="Wash & Iron">Wash & Iron</option>
                        <option value="Wash & Fold">Wash & Fold</option>
                        <option value="Iron Only">Iron Only</option>
                      </select>

                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateItemQty(item.name, currentService, Math.max(0, qty - 1))}
                          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base flex items-center justify-center transition cursor-pointer active:scale-95"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-mono font-black text-sm text-blue-700">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateItemQty(item.name, currentService, qty + 1)}
                          className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-base flex items-center justify-center transition cursor-pointer active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Item Entry Section */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <p className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                <span>Item Not on the List?</span>
              </p>
              <p className="text-[11px] text-slate-500 leading-snug">
                Type custom items below (e.g. Suit Jacket, Curtains, Shoes). Our admin will inspect & set the exact price at pickup!
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  placeholder="Custom Item Name (e.g. Suit, Carpet)"
                  className="sm:col-span-5 bg-white border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                />
                <input
                  type="number"
                  min={1}
                  value={customItemQty}
                  onChange={(e) => setCustomItemQty(parseInt(e.target.value) || 1)}
                  placeholder="Qty"
                  className="sm:col-span-2 bg-white border border-slate-200 text-slate-800 text-xs px-3 py-2.5 rounded-xl text-center outline-none focus:ring-2 focus:ring-blue-500 font-mono font-bold"
                />
                <select
                  value={customItemService}
                  onChange={(e) => setCustomItemService(e.target.value as OrderItem["serviceType"])}
                  className="sm:col-span-3 bg-white border border-slate-200 text-slate-800 text-xs px-2 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                >
                  <option value="Wash & Iron">Wash & Iron</option>
                  <option value="Wash & Fold">Wash & Fold</option>
                  <option value="Iron Only">Iron Only</option>
                </select>
                <button
                  type="button"
                  onClick={addCustomItem}
                  className="sm:col-span-2 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs px-3 py-2.5 rounded-xl transition shadow-sm cursor-pointer active:scale-95"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Custom Items List */}
            {orderItems.filter((x) => x.isCustom).length > 0 && (
              <div className="space-y-1.5 pt-2">
                <p className="text-[11px] font-bold text-slate-700">Added Custom Items:</p>
                {orderItems.map((item, idx) => {
                  if (!item.isCustom) return null;
                  return (
                    <div key={idx} className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-amber-900">{item.itemName}</span>{" "}
                        <span className="text-slate-600">({item.quantity}x • {item.serviceType})</span>
                        <p className="text-[10px] text-amber-700 font-semibold">⏳ Price to be set by Admin upon pickup</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOrderItem(idx)}
                        className="text-rose-600 hover:text-rose-700 text-xs font-bold px-2 py-1 cursor-pointer"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Live Auto Total Pricing Summary Bar */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-800 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div>
                <p className="text-xs text-blue-200 font-bold">Estimated Order Total:</p>
                <p className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight font-mono">
                  TShs {estimatedTotal.toLocaleString()}/=
                </p>
                {hasPendingCustomItems && (
                  <p className="text-[10px] text-amber-200 font-medium mt-0.5">
                    * Includes custom item(s) pending admin pricing confirmation.
                  </p>
                )}
              </div>
              <div className="text-right text-[11px] text-blue-200 bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
                <p className="font-extrabold text-white">📦 Total Clothes: {orderItems.reduce((a, b) => a + b.quantity, 0)}</p>
                <p className="text-[10px] text-emerald-300 font-semibold mt-0.5">Free Pick Up & Delivery Included</p>
              </div>
            </div>
          </div>

          {/* ─── SERVICE SPEED & PRIORITY SELECTOR ─── */}
          <div id="field-serviceSpeed">
            <FieldLabel
              icon={<Clock className="h-4 w-4 text-amber-500" />}
              label="Choose Service Speed & Turnaround"
              required
            />
            <p className="text-xs text-slate-400 mb-3">
              Select Standard for regular student pricing, or Express for same-day priority processing:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSpeedChange("Standard")}
                disabled={submitting}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3 ${
                  serviceSpeed === "Standard"
                    ? "bg-blue-50/80 border-blue-500 text-slate-900 ring-2 ring-blue-500/20 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                }`}
              >
                <div className={`p-2.5 rounded-xl text-lg shrink-0 ${serviceSpeed === "Standard" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  🐢
                </div>
                <div>
                  <p className="font-extrabold text-sm text-slate-900">Standard Service</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">48 - 72 Hours Turnaround</p>
                  <span className="inline-block mt-2 text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Regular Student Prices
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSpeedChange("Express")}
                disabled={submitting}
                className={`p-4 rounded-2xl border text-left transition cursor-pointer flex items-start gap-3 ${
                  serviceSpeed === "Express"
                    ? "bg-amber-50/90 border-amber-500 text-slate-900 ring-2 ring-amber-500/20 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-amber-300"
                }`}
              >
                <div className={`p-2.5 rounded-xl text-lg shrink-0 ${serviceSpeed === "Express" ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500"}`}>
                  ⚡
                </div>
                <div>
                  <p className="font-extrabold text-sm text-amber-950 flex items-center gap-1">
                    Express Fast-Track <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded-full">Priority</span>
                  </p>
                  <p className="text-[11px] text-amber-900 font-medium mt-0.5">Same-Day / Up to 4h Turnaround</p>
                  <span className="inline-block mt-2 text-[10px] font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full">
                    500s ➔ 3,000/= • 1000s ➔ 5,000/= • Blanket ➔ 10,000/=
                  </span>
                </div>
              </button>
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
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-2xl font-bold text-lg shadow-md hover:scale-[1.01] active:scale-[0.99] transition duration-200 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Saving & Syncing to Cloud...
                </>
              ) : activeStudent ? (
                <>
                  <CalendarCheck className="h-5 w-5" />
                  Schedule Pickup
                </>
              ) : (
                <>
                  <CalendarCheck className="h-5 w-5" />
                  Complete Registration & Schedule Pickup →
                </>
              )}
            </button>
            <p className="text-[10px] text-slate-400 text-center mt-3">
              By submitting this form, your pickup will be booked. Always 100% secure.
            </p>
          </div>
        </form>
      </main>
      </div>

      <Footer />
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
