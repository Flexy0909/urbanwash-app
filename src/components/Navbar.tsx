import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import logo from "@/assets/urban-logo.png.asset.json";
import {
  Home,
  ShoppingBag,
  DollarSign,
  User,
  ShieldAlert,
  Phone,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { syncWithCloud, loadStudents } from "@/lib/storage";

type NavbarProps = {
  syncing?: boolean;
};

export function Navbar({ syncing = false }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [activeStudentName, setActiveStudentName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const activeId = localStorage.getItem("urbanwash_active_student");
    if (activeId) {
      const students = loadStudents();
      const found = students.find((s) => s.customerId === activeId);
      if (found) {
        setActiveStudentName(found.fullName.split(" ")[0]);
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("urbanwash_active_student");
    }
    setActiveStudentName(null);
    navigate({ to: "/login" });
  };

  const navLinks = [
    { label: "Home", href: "/", icon: Home },
    { label: "Book Pickup", href: "/register", icon: ShoppingBag, badge: "Popular" },
    { label: "Pricing", href: "/pricing", icon: DollarSign },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-blue-500/20 shadow-2xl shadow-slate-950/50 text-white transition-all">
      <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tagline */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img
            src={logo.url}
            alt="Urban Wash"
            className="h-10 sm:h-12 w-auto drop-shadow-md group-hover:scale-105 transition duration-300"
          />

          <div className="hidden sm:block">
            <span className="text-[9px] font-black text-teal-400 uppercase tracking-widest block leading-tight">
              ATC Campus Official
            </span>
            <span className="text-sm font-black text-white tracking-tight group-hover:text-blue-300 transition">
              UrbanWash Connect
            </span>
          </div>
        </Link>

        {/* Center Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = path === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 relative ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/50"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
                {item.badge && !isActive && (
                  <span className="text-[9px] font-black bg-teal-400/20 text-teal-300 px-1.5 py-0.2 rounded-full border border-teal-400/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions Toolbar */}
        <div className="flex items-center gap-2.5 shrink-0">
          {syncing && (
            <span className="text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded-full flex items-center gap-1 font-bold">
              <RefreshCw className="h-3 w-3 animate-spin text-teal-300" />
              Syncing
            </span>
          )}

          {/* Student Account / Login */}
          {activeStudentName ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Dashboard ({activeStudentName})</span>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                title="Log Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer border border-blue-400/30"
            >
              <User className="h-3.5 w-3.5" />
              <span>Track / Login</span>
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
