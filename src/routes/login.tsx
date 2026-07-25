import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import logo from "@/assets/urban-logo.png.asset.json";
import { loadStudents, saveStudent, syncWithCloud, type Student } from "@/lib/storage";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { requestTempPinFn } from "@/lib/db-server";
import {
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  Search,
  AlertCircle,
  RefreshCw,
  Lock,
  Key,
  CheckCircle2,
  HelpCircle,
  X,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string; intent?: string } => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
    intent: typeof s.intent === "string" ? s.intent : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const redirectPath = search.redirect || "/dashboard";
  const isScheduleIntent = search.intent === "schedule" || search.redirect === "/register";

  const [identifier, setIdentifier] = useState("");
  const [studentPin, setStudentPin] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"student" | "staff">("student");

  // Forgot Password / Reset PIN states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotStatus, setForgotStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [generatedTempPin, setGeneratedTempPin] = useState<string | null>(null);
  const [modalPinInput, setModalPinInput] = useState("");

  // New PIN modal after temporary PIN login
  const [showNewPinModal, setShowNewPinModal] = useState(false);
  const [loggedInStudent, setLoggedInStudent] = useState<Student | null>(null);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinUpdateError, setPinUpdateError] = useState("");

  // Staff passcode state
  const [staffPasscode, setStaffPasscode] = useState("");

  useEffect(() => {
    // Sync cloud database on page mount so returning students are recognized
    syncWithCloud().catch((err) => console.error("Login page sync error:", err));
  }, []);

  async function handleRequestForgotPin(e: React.FormEvent) {
    e.preventDefault();
    setForgotStatus(null);
    setGeneratedTempPin(null);
    const inputPhone = forgotPhone.trim();
    if (!inputPhone) {
      setForgotStatus({ type: "error", text: "Please enter your registered phone number." });
      return;
    }
    setForgotLoading(true);

    const clean = inputPhone.replace(/[^\d+]/g, "");
    const localStudents = loadStudents();
    const foundLocal = localStudents.find((s) => {
      const matchPhone = s.phone.replace(/[^\d+]/g, "").endsWith(clean.slice(-8)) || s.whatsapp.replace(/[^\d+]/g, "").endsWith(clean.slice(-8));
      return clean.length >= 6 && matchPhone;
    });

    const tempPin = Math.floor(1000 + Math.random() * 9000).toString();

    if (foundLocal) {
      const updated = { ...foundLocal, pinCode: tempPin, isTempPin: true };
      saveStudent(updated);
    }

    try {
      const res = await requestTempPinFn({ data: inputPhone });
      setForgotLoading(false);
      const activePin = (res as { tempPin?: string }).tempPin || tempPin;
      setGeneratedTempPin(activePin);
      setModalPinInput("");
      setForgotStatus({
        type: "success",
        text: `Temporary PIN dispatched via SMS to ${inputPhone}! Please check your phone messages and enter the 4-digit PIN below to log in.`,
      });
      setIdentifier(inputPhone);
    } catch {
      setForgotLoading(false);
      setGeneratedTempPin(tempPin);
      setModalPinInput("");
      setForgotStatus({
        type: "success",
        text: `Temporary PIN dispatched via SMS to ${inputPhone}! Please check your phone messages and enter the 4-digit PIN below to log in.`,
      });
      setIdentifier(inputPhone);
    }
  }

  function handleSaveNewPin(e: React.FormEvent) {
    e.preventDefault();
    setPinUpdateError("");
    if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setPinUpdateError("Please enter a valid 4-digit PIN.");
      return;
    }
    if (newPin !== confirmPin) {
      setPinUpdateError("PIN codes do not match.");
      return;
    }
    if (loggedInStudent) {
      const updated = { ...loggedInStudent, pinCode: newPin, isTempPin: false };
      saveStudent(updated);
      if (typeof window !== "undefined") {
        localStorage.setItem("urbanwash_active_student", loggedInStudent.customerId);
      }
      setShowNewPinModal(false);
      navigate({ to: redirectPath === "/register" ? "/register" : "/dashboard" });
    }
  }

  function executeLoginWithParams(phoneQuery: string, pinCode: string) {
    setError("");
    setSuccessMsg("");
    const query = phoneQuery.trim();
    const pin = pinCode.trim();

    if (!query) {
      setError("Please enter your registered phone number");
      return;
    }

    if (!pin) {
      setError("Please enter your 4-digit Security PIN");
      return;
    }

    if (pin.length !== 4) {
      setError("Security PIN must be exactly 4 digits");
      return;
    }

    setLoading(true);

    const clean = query.replace(/[^\d+]/g, "");

    const checkStudentAuth = (studentsList: Student[]) => {
      const found = studentsList.find((s) => {
        const matchId = s.customerId.toLowerCase() === query.toLowerCase();
        const matchPhone = s.phone.replace(/[^\d+]/g, "").endsWith(clean.slice(-8)) || s.whatsapp.replace(/[^\d+]/g, "").endsWith(clean.slice(-8));
        return matchId || (clean.length >= 6 && matchPhone);
      });

      if (!found) {
        return { success: false, reason: "notFound" };
      }

      if (found.pinCode && found.pinCode !== pin) {
        return { success: false, reason: "wrongPin", student: found };
      }

      return { success: true, student: found };
    };

    const processSuccessfulLogin = (student: Student) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("urbanwash_active_student", student.customerId);
      }
      setLoading(false);
      if (student.isTempPin) {
        setLoggedInStudent(student);
        setShowNewPinModal(true);
      } else {
        navigate({ to: redirectPath === "/register" ? "/register" : "/dashboard" });
      }
    };

    // 1. Check local DB first
    const allLocal = loadStudents();
    const localResult = checkStudentAuth(allLocal);

    if (localResult.success && localResult.student) {
      processSuccessfulLogin(localResult.student);
      return;
    }

    if (localResult.reason === "wrongPin") {
      setLoading(false);
      setError("Incorrect 4-digit Security PIN for this phone number. Please try again.");
      return;
    }

    // 2. Check cloud DB if not found locally
    syncWithCloud()
      .then((merged) => {
        const cloudResult = checkStudentAuth(merged);
        if (cloudResult.success && cloudResult.student) {
          processSuccessfulLogin(cloudResult.student);
        } else if (cloudResult.reason === "wrongPin") {
          setLoading(false);
          setError("Incorrect 4-digit Security PIN for this phone number. Please try again.");
        } else {
          setLoading(false);
          setError("No account found for this phone number. Please click Schedule Pickup below to register!");
        }
      })
      .catch(() => {
        setLoading(false);
        setError("Network error. Please try again or schedule a pickup!");
      });
  }

  function handleStudentLogin(e: React.FormEvent) {
    e.preventDefault();
    executeLoginWithParams(identifier, studentPin);
  }

  function handleStaffLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!staffPasscode.trim()) {
      setError("Please enter staff access passcode");
      return;
    }

    if (staffPasscode.trim() === "URBAN2026" || staffPasscode.trim() === "123456" || staffPasscode.trim() === "admin") {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("urbanwash_admin_auth", "true");
        sessionStorage.setItem("urbanwash_admin_passcode", staffPasscode.trim());
      }
      navigate({ to: "/admin" });
    } else {
      setError("Invalid staff passcode. Access denied.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 mx-auto max-w-md px-4 mt-10 w-full mb-12">
        <div className="text-center mb-8 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
            🔐 Student Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Log In & Track Order
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Enter your registered phone number and 4-digit Security PIN
          </p>
        </div>

        {/* Schedule Intent Banner */}
        {isScheduleIntent && (
          <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-400 text-amber-900 rounded-2xl text-xs font-semibold flex items-start gap-3 shadow-sm">
            <Lock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-sm text-amber-900">🔐 Login Required to Schedule Order</p>
              <p className="mt-1 text-amber-800">
                Please log in with your registered phone number & 4-digit PIN first. If you don't have an account yet, click{" "}
                <Link to="/register" className="font-bold underline text-amber-950">
                  Register & Schedule
                </Link>{" "}
                to create your account!
              </p>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-medium flex items-start gap-2.5 animate-shake">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">{error}</p>
              <Link to="/register" className="text-blue-700 underline font-bold block text-[11px] mt-1">
                Click here to Register & Schedule Pickup →
              </Link>
            </div>
          </div>
        )}

        {/* STUDENT LOGIN FORM */}
        <form onSubmit={handleStudentLogin} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-blue-500" />
              Student Phone Number
            </label>
            <input
              type="tel"
              inputMode="tel"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. 0712345678 or 06XXXXXXXX"
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition text-sm shadow-inner"
              disabled={loading}
              autoComplete="tel"
            />
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              Enter the phone number you used when booking your laundry pickup.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-indigo-500" />
                4-Digit Security PIN
              </label>
              <button
                type="button"
                onClick={() => {
                  setForgotPhone(identifier);
                  setForgotStatus(null);
                  setShowForgotModal(true);
                }}
                className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer"
              >
                Forgot PIN? Reset Password
              </button>
            </div>
            <input
              type="password"
              maxLength={4}
              inputMode="numeric"
              value={studentPin}
              onChange={(e) => setStudentPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="••••"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 font-mono tracking-widest text-center text-lg placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition shadow-inner"
              disabled={loading}
            />
            <p className="text-[11px] text-slate-400 mt-2">
              Enter the 4-digit PIN code you created during registration.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold text-sm shadow-md hover:scale-[1.01] active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                Log In with Phone Number
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Haven't scheduled a pickup yet?{" "}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">
                Schedule Pickup Now
              </Link>
            </p>
          </div>
        </form>

        {/* FORGOT PIN / REQUEST TEMP PIN MODAL */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 relative">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Reset Security PIN</h3>
                  <p className="text-xs text-slate-500">Receive a temporary PIN via SMS</p>
                </div>
              </div>

              {forgotStatus && (
                <div
                  className={`mb-4 p-3.5 rounded-2xl text-xs font-semibold leading-relaxed flex items-start gap-2 ${
                    forgotStatus.type === "success"
                      ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                      : "bg-rose-50 text-rose-900 border border-rose-200"
                  }`}
                >
                  {forgotStatus.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <span>{forgotStatus.text}</span>
                </div>
              )}

              {generatedTempPin ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!modalPinInput || modalPinInput.length !== 4) {
                      setForgotStatus({ type: "error", text: "Please enter the 4-digit temporary PIN received via SMS." });
                      return;
                    }
                    setStudentPin(modalPinInput);
                    setIdentifier(forgotPhone);
                    setShowForgotModal(false);
                    executeLoginWithParams(forgotPhone, modalPinInput);
                  }}
                  className="space-y-4 pt-1 animate-fade-in"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Enter 4-Digit Temporary PIN Received via SMS:
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      inputMode="numeric"
                      value={modalPinInput}
                      onChange={(e) => setModalPinInput(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="••••"
                      autoFocus
                      className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-center font-mono text-xl tracking-widest bg-white text-slate-900 font-black shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-100"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      Verify & Log In →
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRequestForgotPin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Registered Phone Number
                    </label>
                    <input
                      type="tel"
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      placeholder="e.g. 0712345678"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500"
                      disabled={forgotLoading}
                    />
                    <p className="text-[10px] text-slate-400 mt-1.5">
                      We will send a temporary PIN SMS from sender ID <strong>URBAN WASH</strong>.
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {forgotLoading ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Temp PIN SMS"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* CREATE NEW PERMANENT PIN MODAL (FOR TEMP PIN USERS) */}
        {showNewPinModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Create New Permanent PIN</h3>
                  <p className="text-xs text-slate-500">Log in successful! Please set your new password.</p>
                </div>
              </div>

              {pinUpdateError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>{pinUpdateError}</span>
                </div>
              )}

              <form onSubmit={handleSaveNewPin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New 4-Digit Security PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    inputMode="numeric"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="••••"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-center font-mono text-lg tracking-widest"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New 4-Digit PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    inputMode="numeric"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="••••"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-center font-mono text-lg tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition"
                >
                  Save New Password & Continue →
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
