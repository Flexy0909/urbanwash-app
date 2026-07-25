import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import logo from "@/assets/urban-logo.png.asset.json";
import {
  loadStudents,
  saveStudent,
  deleteStudent,
  exportCSV,
  exportExcel,
  downloadFile,
  updateStudentStatus,
  updateStudentOrderItems,
  loadFormResponses,
  syncWithCloud,
  getReferralCount,
  getReferralRewardStatus,
  ITEM_PRICING,
  type Student,
  type OrderItem,
  type FormResponse,
} from "@/lib/storage";
import {
  TrendingUp,
  Users,
  Search,
  Download,
  CheckCircle,
  Truck,
  RotateCw,
  Award,
  Filter,
  MessageSquare,
  Copy,
  Clock,
  ClipboardList,
  Lock,
  ShieldAlert,
  Printer,
  FileText,
  X,
  Trash2,
  Edit3,
} from "lucide-react";
import { verifyAdminPasscodeFn } from "@/lib/db-server";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

const HOSTELS = ["Hostel 1", "Hostel 2", "Hostel 3", "Hostel 4"];
const SERVICES = ["Washing", "Ironing", "Wash & Iron"];

function Admin() {
  const [students, setStudents] = useState<Student[]>([]);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [q, setQ] = useState("");
  const [hostelFilter, setHostelFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [referralFilter, setReferralFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [speedFilter, setSpeedFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");

  // Admin authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [unlocking, setUnlocking] = useState(false);

  // WhatsApp export state
  const [waGroupFilter, setWaGroupFilter] = useState("All");
  const [waCopied, setWaCopied] = useState(false);

  // Tabs & Form Responses state
  const [activeTab, setActiveTab] = useState<"orders" | "formResponses">("orders");
  const [formResponses, setFormResponses] = useState<FormResponse[]>([]);

  // Order Verification Modal States
  const [selectedStudentForVerification, setSelectedStudentForVerification] = useState<Student | null>(null);
  const [editingOrderItems, setEditingOrderItems] = useState<OrderItem[]>([]);
  const [adminNotes, setAdminNotes] = useState("");
  const [customAddName, setCustomAddName] = useState("");
  const [customAddQty, setCustomAddQty] = useState(1);
  const [customAddService, setCustomAddService] = useState<OrderItem["serviceType"]>("Wash & Iron");
  const [customAddPrice, setCustomAddPrice] = useState(1000);

  // Payment Denial Modal States
  const [denyModalStudent, setDenyModalStudent] = useState<Student | null>(null);
  const [denialReasonInput, setDenialReasonInput] = useState("");

  // Edit Student Profile Modal States
  const [editStudentModal, setEditStudentModal] = useState<Student | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editHostel, setEditHostel] = useState("");
  const [editRoom, setEditRoom] = useState("");

  // Delete Confirmation Modal States
  const [deleteConfirmStudent, setDeleteConfirmStudent] = useState<Student | null>(null);

  const openEditStudentModal = (student: Student) => {
    setEditStudentModal(student);
    setEditFullName(student.fullName);
    setEditPhone(student.phone);
    setEditHostel(student.hostel);
    setEditRoom(student.room);
  };

  const handleSaveStudentProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudentModal) return;
    const updated: Student = {
      ...editStudentModal,
      fullName: editFullName.trim(),
      phone: editPhone.trim(),
      hostel: editHostel.trim(),
      room: editRoom.trim(),
    };
    saveStudent(updated);
    setStudents((prev) => prev.map((x) => (x.customerId === updated.customerId ? updated : x)));
    setEditStudentModal(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmStudent) return;
    const cid = deleteConfirmStudent.customerId;
    deleteStudent(cid, passcode);
    setStudents((prev) => prev.filter((x) => x.customerId !== cid));
    setDeleteConfirmStudent(null);
  };

  const openVerificationModal = (student: Student) => {
    setSelectedStudentForVerification(student);
    setEditingOrderItems(student.orderItems ? JSON.parse(JSON.stringify(student.orderItems)) : []);
    setAdminNotes(student.adminVerificationNotes || "");
  };

  const updateModalItemQty = (idx: number, qty: number) => {
    setEditingOrderItems((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (qty <= 0) {
        return copy.filter((_: unknown, i: number) => i !== idx);
      }
      copy[idx].quantity = qty;
      copy[idx].totalPrice = (copy[idx].unitPrice || 0) * qty;
      return copy;
    });
  };

  const updateModalItemPrice = (idx: number, unitPrice: number) => {
    setEditingOrderItems((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[idx].unitPrice = unitPrice;
      copy[idx].totalPrice = unitPrice * copy[idx].quantity;
      copy[idx].pricingStatus = "Admin Confirmed";
      return copy;
    });
  };

  const handleAddExtraItemToModal = () => {
    if (!customAddName.trim()) return;
    const newItem: OrderItem = {
      itemName: customAddName.trim(),
      quantity: Math.max(1, customAddQty),
      serviceType: customAddService,
      unitPrice: customAddPrice,
      totalPrice: customAddPrice * Math.max(1, customAddQty),
      isCustom: true,
      pricingStatus: "Admin Confirmed",
    };
    setEditingOrderItems((prev) => [...prev, newItem]);
    setCustomAddName("");
    setCustomAddQty(1);
  };

  const saveAdminVerificationModal = () => {
    if (!selectedStudentForVerification) return;
    const confirmedTotal = editingOrderItems.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
    updateStudentOrderItems(
      selectedStudentForVerification.customerId,
      editingOrderItems,
      confirmedTotal,
      adminNotes,
      "Picked Up & Verified",
    );
    setSelectedStudentForVerification(null);
    setStudents(loadStudents());
  };

  // Sync data on load and provide a manual trigger
  const runSync = () => {
    setSyncStatus("syncing");
    syncWithCloud((merged) => {
      setStudents(merged);
      setSyncStatus("success");
      setTimeout(() => setSyncStatus("idle"), 2000);
    }).catch((err) => {
      console.error(err);
      setSyncStatus("error");
      setStudents(loadStudents()); // Fallback to local
      setTimeout(() => setSyncStatus("idle"), 3000);
    });
  };

  useEffect(() => {
    const auth = sessionStorage.getItem("urbanwash_admin_auth") === "true";
    setIsAuthenticated(auth);
    setStudents(loadStudents()); // Fast initial load
    if (auth) {
      runSync();
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    setUnlocking(true);
    setPasscodeError("");
    try {
      const res = await verifyAdminPasscodeFn({ data: passcode });
      if (res.success) {
        sessionStorage.setItem("urbanwash_admin_auth", "true");
        sessionStorage.setItem("urbanwash_admin_passcode", passcode);
        setIsAuthenticated(true);
        // Load sync immediately after unlock
        runSync();
      } else {
        setPasscodeError("Invalid passcode. Access Denied.");
        setPasscode("");
      }
    } catch (err) {
      console.error("Passcode check failed:", err);
      setPasscodeError("Server error. Please try again.");
    } finally {
      setUnlocking(false);
    }
  };

  // Handle Journey Status Inline updates
  const handleStatusChange = (customerId: string, newStatus: Student["status"]) => {
    updateStudentStatus(customerId, newStatus);
    // Reload local state
    setStudents(loadStudents());
  };

  // 1. Calculate Statistics & Funnels
  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const total = students.length;

    // Funnel Conversions
    const activeCustomers = students.filter(
      (s) =>
        s.status === "First Order Completed" ||
        s.status === "Repeat Customer" ||
        s.status === "VIP Customer",
    ).length;

    const conversionRate = total > 0 ? ((activeCustomers / total) * 100).toFixed(1) : "0.0";

    // Hostel calculations
    const h1 = students.filter((s) => s.hostel === "Hostel 1").length;
    const h2 = students.filter((s) => s.hostel === "Hostel 2").length;
    const h3 = students.filter((s) => s.hostel === "Hostel 3").length;
    const h4 = students.filter((s) => s.hostel === "Hostel 4").length;

    const hostelCounts = [
      { name: "Hostel 1", count: h1 },
      { name: "Hostel 2", count: h2 },
      { name: "Hostel 3", count: h3 },
      { name: "Hostel 4", count: h4 },
    ];
    const mostPopularHostel = hostelCounts.sort((a, b) => b.count - a.count)[0];

    // Service calculations
    const washing = students.filter((s) => s.services.includes("Washing")).length;
    const ironing = students.filter((s) => s.services.includes("Ironing")).length;
    const washIron = students.filter((s) => s.services.includes("Wash & Iron")).length;

    const serviceCounts = [
      { name: "Washing", count: washing },
      { name: "Ironing", count: ironing },
      { name: "Wash & Iron", count: washIron },
    ];
    const mostPopularService = serviceCounts.sort((a, b) => b.count - a.count)[0];

    // Referral Metrics
    const referralsJoined = students.filter((s) => s.referralStatus === "Yes").length;
    const totalReferralLeads = students.filter((s) => s.referredBy).length; // has referrer

    // Rewards Earned (Students with >= 3 successful referrals)
    const rewardsEarnedCount = students.filter(
      (s) => getReferralCount(s.customerId, students) >= 3,
    ).length;

    // Express Turnaround Calculations
    const expressCount = students.filter((s) => s.serviceSpeed === "Express").length;

    return {
      total,
      today: students.filter((s) => new Date(s.createdAt).toDateString() === today).length,
      referralMembers: referralsJoined,
      totalReferralLeads,
      rewardsEarned: rewardsEarnedCount,
      conversionRate,
      mostPopularHostel: total > 0 ? mostPopularHostel.name : "None",
      mostPopularService: total > 0 ? mostPopularService.name : "None",
      firstOrders: students.filter((s) => s.status === "First Order Completed").length,
      repeatCustomers: students.filter((s) => s.status === "Repeat Customer").length,
      washing,
      ironing,
      washIron,
      expressCount,
      h1,
      h2,
      h3,
      h4,
    };
  }, [students]);

  // 2. Leaderboards & Thresholds
  const leaderboard = useMemo(() => {
    return students
      .filter((s) => s.referralStatus === "Yes")
      .map((s) => ({
        student: s,
        count: getReferralCount(s.customerId, students),
        rewardStatus: getReferralRewardStatus(s.customerId, students),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [students]);

  const nearThreshold = useMemo(() => {
    return students
      .filter((s) => s.referralStatus === "Yes")
      .map((s) => ({
        student: s,
        count: getReferralCount(s.customerId, students),
      }))
      .filter((item) => item.count === 1 || item.count === 2)
      .sort((a, b) => b.count - a.count);
  }, [students]);

  // 3. Filter Table data
  const filtered = useMemo(() => {
    return students.filter((s) => {
      // Search Box (Name, Phone, ID)
      if (q) {
        const query = q.toLowerCase();
        const matches =
          s.fullName.toLowerCase().includes(query) ||
          s.phone.includes(query) ||
          s.customerId.toLowerCase().includes(query);
        if (!matches) return false;
      }

      // Select Filters
      if (hostelFilter && s.hostel !== hostelFilter) return false;
      if (serviceFilter && !s.services.includes(serviceFilter)) return false;
      if (referralFilter && s.referralStatus !== referralFilter) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      if (speedFilter && s.serviceSpeed !== speedFilter) return false;
      if (paymentFilter && (s.paymentStatus || "Pending") !== paymentFilter) return false;

      // Date Filter
      if (dateFilter) {
        const rowDate = new Date(s.createdAt).toISOString().split("T")[0];
        if (rowDate !== dateFilter) return false;
      }

      return true;
    });
  }, [students, q, hostelFilter, serviceFilter, referralFilter, statusFilter, dateFilter, speedFilter, paymentFilter]);

  // 4. WhatsApp Broadcast numbers gatherer
  const whatsappBroadcastData = useMemo(() => {
    let list = students;
    if (waGroupFilter === "Hostel 1") list = students.filter((s) => s.hostel === "Hostel 1");
    else if (waGroupFilter === "Hostel 2") list = students.filter((s) => s.hostel === "Hostel 2");
    else if (waGroupFilter === "Hostel 3") list = students.filter((s) => s.hostel === "Hostel 3");
    else if (waGroupFilter === "Hostel 4") list = students.filter((s) => s.hostel === "Hostel 4");
    else if (waGroupFilter === "Washing")
      list = students.filter((s) => s.services.includes("Washing"));
    else if (waGroupFilter === "Ironing")
      list = students.filter((s) => s.services.includes("Ironing"));
    else if (waGroupFilter === "Wash & Iron")
      list = students.filter((s) => s.services.includes("Wash & Iron"));
    else if (waGroupFilter === "Referral Members")
      list = students.filter((s) => s.referralStatus === "Yes");

    const phones = list.map((s) => s.whatsapp || s.phone);
    return phones.join(", ");
  }, [students, waGroupFilter]);

  const copyBroadcastPhones = () => {
    if (!whatsappBroadcastData) return;
    navigator.clipboard.writeText(whatsappBroadcastData);
    setWaCopied(true);
    setTimeout(() => setWaCopied(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 select-none relative overflow-hidden font-sans">
        {/* Background bubbles */}
        <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />

        <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl relative z-10 text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner">
              <Lock className="h-8 w-8" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-white tracking-tight">Admin Portal</h2>
            <p className="text-xs text-slate-400">
              Only authorized URBAN WASH administrators are permitted access.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <div>
              <label htmlFor="passcode" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Passcode / Password
              </label>
              <input
                id="passcode"
                type="password"
                placeholder="••••••••"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (passcodeError) setPasscodeError("");
                }}
                className={`w-full text-sm bg-slate-950 text-white px-4 py-3.5 rounded-2xl border ${
                  passcodeError ? "border-rose-500 focus:ring-rose-500/20" : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/20"
                } focus:outline-none focus:ring-4 transition`}
                autoFocus
              />
              {passcodeError && (
                <p className="text-rose-400 text-xs mt-1.5 font-medium flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {passcodeError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={unlocking || !passcode}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl shadow-lg transition duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {unlocking ? "Verifying..." : "Unlock Dashboard"}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-700/50 flex items-center justify-center gap-1 text-[10px] text-slate-500 font-medium">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Unauthorized access is strictly prohibited and logged.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12 selection:bg-blue-500 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-blue-800/40 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white sticky top-0 z-20 shadow-md">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/urban-logo-v2.jpg" alt="Urban Wash Connect" className="h-14 sm:h-16 w-auto drop-shadow-md rounded-lg group-hover:scale-105 transition duration-300 bg-white/10 p-1" />
            <span className="text-xs text-blue-200 font-bold">| Management & Analytics</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sessionStorage.removeItem("urbanwash_admin_auth");
                sessionStorage.removeItem("urbanwash_admin_passcode");
                setIsAuthenticated(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 hover:border-rose-300 text-xs font-semibold text-rose-600 bg-rose-50/50 hover:bg-rose-50 cursor-pointer active:scale-95 transition"
            >
              Log Out
            </button>
            <button
              onClick={runSync}
              disabled={syncStatus === "syncing"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-600 bg-white cursor-pointer active:scale-95 transition disabled:opacity-60"
            >
              <RotateCw
                className={`h-3.5 w-3.5 ${syncStatus === "syncing" ? "animate-spin text-blue-600" : ""}`}
              />
              {syncStatus === "syncing" ? "Syncing Cloud..." : "Sync Database"}
            </button>
            <a
              href="/print-qr.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 bg-white cursor-pointer active:scale-95 transition"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              Print Poster
            </a>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition"
            >
              + Register Lead
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 mt-6 space-y-6">
        {/* Sync notification banner */}
        {syncStatus === "success" && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span>
              Success: Cloud database synced. Merged local records with remote campaign
              registrations!
            </span>
          </div>
        )}

        {/* Dashboard Title */}
        <div className="md:flex md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Campaign Analytics
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time student registration metrics, viral growth leaderboards, and WhatsApp
              marketing filters.
            </p>
          </div>

          {/* Global Exports */}
          <div className="mt-4 md:mt-0 flex gap-2">
            <button
              onClick={() =>
                downloadFile(
                  `urbanwash-export-${Date.now()}.csv`,
                  exportCSV(filtered, students),
                  "text/csv",
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 shadow-sm transition cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={() =>
                downloadFile(
                  `urbanwash-export-${Date.now()}.xls`,
                  exportExcel(filtered, students),
                  "application/vnd.ms-excel",
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              <Download className="h-4 w-4" />
              Export Excel (xls)
            </button>
          </div>
        </div>

        {/* 1. Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <StatCard label="Total Registrations" value={stats.total} highlight />
          <StatCard
            label="Today's Leads"
            value={stats.today}
            icon={<Clock className="h-4 w-4 text-amber-500" />}
          />
          <StatCard
            label="Referral Members"
            value={stats.referralMembers}
            icon={<Users className="h-4 w-4 text-blue-500" />}
          />
          <StatCard
            label="Successful Referrals"
            value={stats.totalReferralLeads}
            icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
          />
          <StatCard
            label="Rewards Earned"
            value={stats.rewardsEarned}
            icon={<Award className="h-4 w-4 text-indigo-500" />}
          />
          <StatCard
            label="Conversion Funnel"
            value={`${stats.conversionRate}%`}
            icon={<CheckCircle className="h-4 w-4 text-teal-500" />}
          />
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <StatCard label="Most Popular Hostel" value={stats.mostPopularHostel} textOnly />
          <StatCard label="Most Popular Service" value={stats.mostPopularService} textOnly />
          <StatCard label="First Orders" value={stats.firstOrders} />
          <StatCard label="Repeat Customers" value={stats.repeatCustomers} />
          <StatCard label="Washing Leads" value={stats.washing} />
          <StatCard label="Wash & Iron Leads" value={stats.washIron} />
          <StatCard label="Express Speed Leads" value={stats.expressCount} />
        </div>

        {/* Leaderboards & Broadcast Tools row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Top Referrers Leaderboard */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                <Award className="h-4.5 w-4.5 text-blue-500" />
                Referral Leaderboard
              </h3>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                Top
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {leaderboard.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No referrers active yet.</p>
              ) : (
                leaderboard.map((item, idx) => (
                  <div
                    key={item.student.customerId}
                    className="py-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-400">#{idx + 1}</span>
                      <div>
                        <p className="font-bold text-slate-700">{item.student.fullName}</p>
                        <p className="text-[10px] font-mono text-slate-400">
                          {item.student.customerId} • {item.student.hostel}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-blue-600 block">
                        {item.count} Referrals
                      </span>
                      <span
                        className={`text-[9px] font-bold ${item.rewardStatus === "Unlocked" ? "text-emerald-500" : "text-amber-500"}`}
                      >
                        Reward: {item.rewardStatus}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Near Reward Threshold */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                <Award className="h-4.5 w-4.5 text-amber-500" />
                Near Reward (1-2 Referrals)
              </h3>
              <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full">
                Target
              </span>
            </div>

            <div className="divide-y divide-slate-100 overflow-y-auto max-h-[220px]">
              {nearThreshold.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No students close to thresholds.
                </p>
              ) : (
                nearThreshold.map((item) => (
                  <div
                    key={item.student.customerId}
                    className="py-2.5 flex items-center justify-between text-xs animate-fade-in"
                  >
                    <div>
                      <p className="font-bold text-slate-700">{item.student.fullName}</p>
                      <p className="text-[10px] font-mono text-slate-400">
                        {item.student.customerId} • {item.student.hostel}
                      </p>
                    </div>
                    <div className="text-right font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      {item.count} / 3 Ref
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* WhatsApp Marketing Broadcast Module */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-50">
              <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
                <MessageSquare className="h-4.5 w-4.5 text-emerald-500" />
                WhatsApp Broadcast Hub
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                Labels
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Filter phone numbers by hostel or service label to create a comma-separated list for
                WhatsApp Broadcast lists.
              </p>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Select Contact Label
                </label>
                <select
                  value={waGroupFilter}
                  onChange={(e) => setWaGroupFilter(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="All">All Contacts</option>
                  <option value="Hostel 1">Hostel 1 Students</option>
                  <option value="Hostel 2">Hostel 2 Students</option>
                  <option value="Hostel 3">Hostel 3 Students</option>
                  <option value="Hostel 4">Hostel 4 Students</option>
                  <option value="Washing">Washing Customers</option>
                  <option value="Ironing">Ironing Customers</option>
                  <option value="Wash & Iron">Wash & Iron Customers</option>
                  <option value="Referral Members">Referral Program Members</option>
                </select>
              </div>

              {/* Display list */}
              {whatsappBroadcastData ? (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 max-h-[80px] overflow-y-auto font-mono text-[10px] break-all select-all shadow-inner text-slate-500">
                  {whatsappBroadcastData}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic text-center py-2">
                  No phone numbers in this group.
                </p>
              )}

              <button
                onClick={copyBroadcastPhones}
                disabled={!whatsappBroadcastData}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Copy className="h-3.5 w-3.5" />
                {waCopied ? "Phone Numbers Copied!" : `Copy Group (${waGroupFilter})`}
              </button>
            </div>
          </div>
        </div>

        {/* 2. Customer Leads Table Section */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="md:flex md:items-center md:justify-between pb-3 border-b border-slate-100 gap-4">
            <h3 className="font-black text-slate-900 text-base flex items-center gap-1.5">
              <ClipboardList className="h-5 w-5 text-blue-500" />
              Customer Leads Table
            </h3>

            {/* Table Search Input */}
            <div className="mt-2 md:mt-0 relative max-w-xs w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, phone, or ID..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 transition"
              />
            </div>
          </div>

          {/* Extended Filters bar */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/50 flex flex-wrap gap-2 items-center text-xs">
            <span className="font-bold text-slate-500 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              Filters:
            </span>
            <select
              value={hostelFilter}
              onChange={(e) => setHostelFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
            >
              <option value="">All Hostels</option>
              {HOSTELS.map((h) => (
                <option key={h}>{h}</option>
              ))}
            </select>

            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
            >
              <option value="">All Service Interests</option>
              {SERVICES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <select
              value={referralFilter}
              onChange={(e) => setReferralFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
            >
              <option value="">All Referral Programs</option>
              <option value="Yes">Yes (Member)</option>
              <option value="No">No (Non-Member)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
            >
              <option value="">All Journey Status</option>
              <option value="Lead Registered">Lead Registered</option>
              <option value="Contacted">Contacted</option>
              <option value="First Order Completed">First Order Completed</option>
              <option value="Repeat Customer">Repeat Customer</option>
              <option value="Referral Customer">Referral Customer</option>
              <option value="VIP Customer">VIP Customer</option>
            </select>

            <select
              value={speedFilter}
              onChange={(e) => setSpeedFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600"
            >
              <option value="">All Speeds</option>
              <option value="Standard">Standard (48-72h)</option>
              <option value="Express">Express (up to 4h)</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700"
            >
              <option value="">All Payment Statuses</option>
              <option value="Pending">Pending Payment</option>
              <option value="Verification Submitted">Verification Submitted</option>
              <option value="Paid">Paid & Confirmed</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600"
            />

            {(hostelFilter ||
              serviceFilter ||
              referralFilter ||
              statusFilter ||
              dateFilter ||
              speedFilter ||
              paymentFilter ||
              q) && (
              <button
                onClick={() => {
                  setHostelFilter("");
                  setServiceFilter("");
                  setReferralFilter("");
                  setStatusFilter("");
                  setDateFilter("");
                  setSpeedFilter("");
                  setPaymentFilter("");
                  setQ("");
                }}
                className="text-blue-600 hover:underline font-bold py-1 px-2.5 cursor-pointer ml-auto"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
            <table className="w-full text-xs text-left border-collapse bg-white">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="p-3.5">Customer & Order ID</th>
                  <th className="p-3.5">Full Name</th>
                  <th className="p-3.5">Phone Details</th>
                  <th className="p-3.5">Hostel & Room</th>
                  <th className="p-3.5">Order Clothes & Pricing</th>
                  <th className="p-3.5">Payment Status</th>
                  <th className="p-3.5">Journey Status (Edit)</th>
                  <th className="p-3.5">Speed</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-12 text-center text-slate-400 italic">
                      No matching registered student records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => {
                    return (
                      <tr key={s.customerId} className="hover:bg-slate-50/50 transition">
                        {/* ID */}
                        <td className="p-3.5 font-mono text-slate-900 whitespace-nowrap">
                          <div className="font-extrabold text-blue-900">{s.customerId}</div>
                          <div className="text-[10px] text-amber-700 font-black mt-0.5">
                            {s.orderId || `ORD-2026-${s.customerId.slice(-4)}`}
                          </div>
                          {s.synced === false && (
                            <span
                              className="ml-1 inline-block h-2 w-2 rounded-full bg-amber-500"
                              title="Unsynced changes"
                            />
                          )}
                        </td>

                        {/* Name */}
                        <td className="p-3.5 font-semibold text-slate-800 whitespace-nowrap">
                          {s.fullName}
                        </td>

                        {/* Contacts */}
                        <td className="p-3.5 text-slate-500 whitespace-nowrap space-y-0.5">
                          <p>📱 {s.phone}</p>
                          {s.whatsapp && s.whatsapp !== s.phone && (
                            <p className="text-emerald-600 font-medium">💬 {s.whatsapp}</p>
                          )}
                        </td>

                        {/* Hostel / Room */}
                        <td className="p-3.5 text-slate-700 whitespace-nowrap font-medium">
                          <span className="block">{s.hostel}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Room: {s.room}
                          </span>
                        </td>

                        {/* Order Clothes & Verification Column */}
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="space-y-1">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border inline-block ${s.adminVerified ? "bg-emerald-50 text-emerald-800 border-emerald-300" : "bg-amber-50 text-amber-800 border-amber-300"}`}>
                              {s.adminVerified ? "✅ Verified at Pickup" : "⏳ Pending Verification"}
                            </span>
                            <p className="text-[11px] font-bold text-slate-800">
                              Total: <span className="font-mono text-blue-700 font-black">TShs {(s.adminConfirmedTotal || s.estimatedTotal || 0).toLocaleString()}/=</span>
                            </p>
                            <button
                              onClick={() => openVerificationModal(s)}
                              className="text-[10px] bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold px-2.5 py-1 rounded-lg shadow transition cursor-pointer flex items-center gap-1"
                            >
                              <ClipboardList className="h-3 w-3" />
                              Verify Clothes & Prices
                            </button>
                          </div>
                        </td>

                        {/* Payment Status & Code */}
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="space-y-1">
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border block w-max ${
                                s.paymentStatus === "Paid"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : s.paymentStatus === "Denied"
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : s.paymentStatus === "Verification Submitted"
                                      ? "bg-amber-50 text-amber-800 border-amber-200"
                                      : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {s.paymentStatus || "Pending"}
                            </span>
                            {s.transactionCode && (
                              <p className="text-[10px] font-mono font-bold text-slate-800">
                                {s.transactionCode} ({s.paymentMethod || "Mobile Money"})
                              </p>
                            )}
                            {s.paymentStatus === "Denied" && s.paymentDenialReason && (
                              <p className="text-[9px] text-rose-600 font-semibold max-w-[150px] truncate" title={s.paymentDenialReason}>
                                Reason: {s.paymentDenialReason}
                              </p>
                            )}
                            {s.paymentStatus !== "Paid" && (
                              <div className="flex items-center gap-1 pt-1">
                                <button
                                  onClick={() => {
                                    const updated = { ...s, paymentStatus: "Paid" as const, paymentDenialReason: undefined };
                                    saveStudent(updated);
                                    setStudents((prev) => prev.map((x) => (x.customerId === s.customerId ? updated : x)));
                                  }}
                                  className="text-[9px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-0.5 rounded shadow-xs cursor-pointer transition"
                                >
                                  ✓ Verify
                                </button>
                                <button
                                  onClick={() => {
                                    setDenyModalStudent(s);
                                    setDenialReasonInput(s.paymentDenialReason || "Invalid or unverified transaction code. Please check your M-Pesa SMS.");
                                  }}
                                  className="text-[9px] bg-rose-600 hover:bg-rose-700 text-white font-bold px-2 py-0.5 rounded shadow-xs cursor-pointer transition"
                                >
                                  ✖ Deny
                                </button>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Journey Status Dropdown */}
                        <td className="p-3.5 whitespace-nowrap">
                          <select
                            value={s.status}
                            onChange={(e) =>
                              handleStatusChange(s.customerId, e.target.value as Student["status"])
                            }
                            className={`px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition ${
                              s.status === "VIP Customer"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : s.status === "Picked Up & Verified"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : s.status === "Washing & Drying"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : s.status === "Ready for Delivery"
                                      ? "bg-teal-50 text-teal-700 border-teal-200"
                                      : "bg-slate-100 text-slate-700 border-slate-200"
                            }`}
                          >
                            <option value="Lead Registered">Lead Registered</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Picked Up & Verified">Picked Up & Verified</option>
                            <option value="Washing & Drying">Washing & Drying</option>
                            <option value="Ready for Delivery">Ready for Delivery</option>
                            <option value="First Order Completed">First Order Completed</option>
                            <option value="Repeat Customer">Repeat Customer</option>
                            <option value="VIP Customer">VIP Customer</option>
                          </select>
                        </td>

                        {/* Speed */}
                        <td className="p-3.5 whitespace-nowrap">
                          {s.serviceSpeed === "Express" ? (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                              ⚡ Express
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              ⏱️ Standard
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="p-3.5 text-slate-400 whitespace-nowrap">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </td>

                        {/* Full Control Actions */}
                        <td className="p-3.5 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditStudentModal(s)}
                              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition cursor-pointer shadow-2xs"
                              title="Edit Student Info"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmStudent(s)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 transition cursor-pointer shadow-2xs"
                              title="Delete Student Record"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between">
            <span>
              Showing {filtered.length} of {students.length} campaign registration leads.
            </span>
            <span>
              💡 Orange dot next to Customer ID indicates local modifications pending cloud sync.
            </span>
          </div>
        </div>

        {/* Payment Denial Reason Modal */}
        {denyModalStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-100 shadow-2xl space-y-4 animate-scale-up">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-rose-700">
                  <ShieldAlert className="h-5 w-5" />
                  <h3 className="font-black text-base">Deny Payment Verification</h3>
                </div>
                <button
                  onClick={() => setDenyModalStudent(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-600">
                  Denying payment verification for <strong>{denyModalStudent.fullName}</strong> ({denyModalStudent.customerId}).
                </p>
                <p className="text-[11px] text-slate-400">
                  Please specify the exact reason so the student can re-enter a valid M-Pesa / Airtel Money transaction code.
                </p>

                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Denial:</label>
                  <textarea
                    rows={3}
                    value={denialReasonInput}
                    onChange={(e) => setDenialReasonInput(e.target.value)}
                    placeholder="e.g. Transaction code not found or amount does not match."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setDenyModalStudent(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!denialReasonInput.trim()) return;
                    const updated = {
                      ...denyModalStudent,
                      paymentStatus: "Denied" as const,
                      paymentDenialReason: denialReasonInput.trim(),
                    };
                    saveStudent(updated);
                    setStudents((prev) => prev.map((x) => (x.customerId === denyModalStudent.customerId ? updated : x)));
                    setDenyModalStudent(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition"
                >
                  Confirm Denial
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EDIT STUDENT PROFILE MODAL */}
        {editStudentModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-blue-600" />
                  <h3 className="font-extrabold text-base text-slate-900">Edit Student Info</h3>
                </div>
                <button
                  onClick={() => setEditStudentModal(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveStudentProfile} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Hostel</label>
                    <select
                      value={editHostel}
                      onChange={(e) => setEditHostel(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                    >
                      {HOSTELS.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Room Number</label>
                    <input
                      type="text"
                      value={editRoom}
                      onChange={(e) => setEditRoom(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditStudentModal(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION MODAL */}
        {deleteConfirmStudent && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="h-10 w-10 rounded-2xl bg-rose-100 flex items-center justify-center font-bold">
                  <Trash2 className="h-5 w-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Delete Student Record?</h3>
                  <p className="text-xs text-slate-500">This action cannot be undone.</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-rose-50 border border-rose-100 p-3 rounded-2xl">
                Are you sure you want to permanently delete <strong>{deleteConfirmStudent.fullName}</strong> ({deleteConfirmStudent.customerId})? This will remove their record from both local database and cloud storage.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setDeleteConfirmStudent(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Permanently Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Stats Card Helper
function StatCard({
  label,
  value,
  highlight,
  textOnly,
  icon,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
  textOnly?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl p-4 border shadow-sm ${
        highlight
          ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-transparent"
          : "bg-white border-slate-100"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-[10px] uppercase font-bold tracking-wider ${highlight ? "text-blue-100" : "text-slate-400"}`}
        >
          {label}
        </span>
        {icon && !highlight && <span>{icon}</span>}
      </div>
      <div
        className={`mt-2 font-black tracking-tight ${
          textOnly
            ? "text-sm sm:text-base truncate text-slate-800"
            : highlight
              ? "text-2xl sm:text-3xl text-white"
              : "text-2xl sm:text-3xl text-slate-800"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
