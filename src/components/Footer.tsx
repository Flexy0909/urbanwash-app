import { Link } from "@tanstack/react-router";
import logo from "@/assets/urban-logo.png.asset.json";
import { Phone, MapPin, ShieldCheck, Heart, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-blue-900/30 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">
      {/* Decorative Glow Orbs */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 pt-12 pb-8 relative z-10 space-y-10">
        
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & Bio */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo.url} alt="Urban Wash" className="h-10 w-auto drop-shadow-lg" />
              <div>
                <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-widest block">
                  Arusha Technical College
                </span>
                <span className="text-lg font-black text-white tracking-tight">
                  UrbanWash Connect
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              The official campus laundry platform for ATC students. Secure hostel pickup, express washing & machine drying with 100% anti-theft guarantee.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[10px] font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
                100% Anti-Theft Guaranteed
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[10px] font-bold">
                ⚡ Express Dispatch
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-teal-400">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              <li>
                <Link to="/" className="hover:text-white transition flex items-center gap-1.5">
                  <span>•</span> Home Page
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition flex items-center gap-1.5">
                  <span>•</span> Schedule Pickup Order
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition flex items-center gap-1.5">
                  <span>•</span> Pricing & Discounts
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition flex items-center gap-1.5">
                  <span>•</span> Track My Laundry Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Support Card */}
          <div className="md:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                💬 24/7 Hostel Support
              </span>
              <span className="text-[10px] text-slate-400 font-mono">ATC Station</span>
            </div>

            <div className="space-y-2">
              <a
                href="https://wa.me/255687771750"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl shadow-lg transition duration-200"
              >
                <Phone className="h-4 w-4" />
                WhatsApp: +255 687 771 750
              </a>
              
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-300 font-medium pt-1">
                <MapPin className="h-3.5 w-3.5 text-rose-400" />
                <span>Hostels 1 - 4 • ATC Campus Station</span>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

        {/* Bottom Bar: Developer Credits & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} UrbanWash Connect. All rights reserved.</p>

          {/* Sleek Developer Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-400/20 px-4 py-2 rounded-2xl backdrop-blur-md shadow-lg hover:border-blue-400/40 transition">
            <span className="text-slate-300 text-xs">
              Developed by{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-teal-300 bg-clip-text text-transparent font-black tracking-wider text-sm drop-shadow-sm">
                FlexyTech
              </span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
