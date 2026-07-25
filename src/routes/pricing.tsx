import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/urban-logo.png.asset.json";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowLeft,
  Clock,
  ShoppingBag,
  Heart,
  ShieldCheck,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

function PricingPage() {
  const priceList = [
    {
      item: "Shirt / T-Shirt",
      washFold: 500,
      ironOnly: 500,
      washIron: 1000,
    },
    {
      item: "Suruali (Trousers/Jeans)",
      washFold: 500,
      ironOnly: 500,
      washIron: 1000,
    },
    {
      item: "Shuka (Bed Sheet)",
      washFold: 1000,
      ironOnly: 500,
      washIron: 1500,
    },
    {
      item: "Kanzu",
      washFold: 1000,
      ironOnly: 500,
      washIron: 1500,
    },
    {
      item: "Taulo (Towel)",
      washFold: 1000,
      ironOnly: 500,
      washIron: 1500,
    },
    {
      item: "Sweta / Hoodie",
      washFold: 1000,
      ironOnly: 500,
      washIron: 1500,
    },
    {
      item: "Lab Coat (Labcoat)",
      washFold: 1000,
      ironOnly: 500,
      washIron: 1500,
    },
    {
      item: "Blanket / Duvet",
      washFold: 5000,
      ironOnly: 500,
      washIron: 5500,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
      <div>
        {/* Navigation Header */}
        <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white py-12 px-4 text-center">
        <div className="mx-auto max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold uppercase tracking-wider">
            Student-Friendly Rates
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Our Pricing Guide
          </h1>
          <p className="text-sm sm:text-base text-blue-200/90 leading-relaxed">
            Simple, transparent, per-item pricing. Free pickup & delivery directly to your hostel room or residence is always included!
          </p>
        </div>
      </section>

      {/* Main Pricing Tables Container */}
      <main className="mx-auto max-w-4xl px-4 mt-8">
        
        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivery</h4>
              <p className="text-sm font-extrabold text-slate-800">100% Free Pickup & Return</p>
            </div>
          </div>
          <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Turnaround</h4>
              <p className="text-sm font-extrabold text-slate-800">48 - 72 Hours (Standard)</p>
            </div>
          </div>
          <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rewards</h4>
              <p className="text-sm font-extrabold text-slate-800">10% OFF First Order</p>
            </div>
          </div>
        </div>

        {/* Pricing Table Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-150 overflow-hidden">
          <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-150 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-900">Official Price List</h3>
              <p className="text-xs text-slate-500 mt-0.5">Flat rates per item. No hidden fees or baseline minimum weights.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Currency: Tanzanian Shillings (TZS)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-150 text-[11px] font-black uppercase tracking-wider text-slate-500 bg-slate-50/50">
                  <th className="py-4 px-6">Clothing Item</th>
                  <th className="py-4 px-4 text-center">Washing & Fold</th>
                  <th className="py-4 px-4 text-center">Ironing Only</th>
                  <th className="py-4 px-4 text-center text-blue-800 bg-blue-50/20">Wash & Iron</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {priceList.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-800">{row.item}</td>
                    <td className="py-4 px-4 text-center font-bold text-slate-600">
                      {row.washFold.toLocaleString()} <span className="text-[10px] text-slate-400 font-semibold">TZS</span>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-600">
                      {row.ironOnly.toLocaleString()} <span className="text-[10px] text-slate-400 font-semibold">TZS</span>
                    </td>
                    <td className="py-4 px-4 text-center font-extrabold text-blue-700 bg-blue-50/10">
                      {row.washIron.toLocaleString()} <span className="text-[10px] text-blue-500/80 font-bold">TZS</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-[11px] text-slate-500 text-center">
            ✦ Other custom items or special fabrics can be cleaned upon request. Speak with your pickup agent!
          </div>
        </div>

        {/* Turnaround / Express Info Callout */}
        <div className="mt-8 grid sm:grid-cols-2 gap-6">
          <div className="bg-blue-50/60 border border-blue-150 rounded-2xl p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-blue-900 font-black text-sm uppercase tracking-wider">
              <CheckCircle className="h-4.5 w-4.5 text-blue-600 shrink-0" />
              Standard Student Wash (48 - 72 Hours)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Included free pickup & hostel room delivery. Perfect for regular weekly laundry schedule at flat student rates.
            </p>
          </div>

          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-950 font-black text-sm uppercase tracking-wider">
              ⚡ Express Priority Service (Same-Day / Up to 4h)
            </div>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              Need your clothes back urgently? Fast-track same-day processing rates:
            </p>
            <ul className="text-[11px] text-amber-950 space-y-1 font-bold pt-1">
              <li>• Standard 500 TZS items ➔ <span className="text-amber-700">3,000 TZS Express</span></li>
              <li>• Standard 1,000 / 1,500 TZS items ➔ <span className="text-amber-700">5,000 TZS Express</span></li>
              <li>• Blanket / Duvet ➔ <span className="text-amber-700">10,000 TZS Express</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom CTA Block */}
        <div className="mt-12 text-center bg-white border border-slate-150 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-extrabold text-slate-900">Ready to Get Fresh Clothes?</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Book your pickup in under a minute. Claim your 10% discount on your first registration.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/register"
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-md hover:scale-[1.01] active:scale-[0.99] text-sm"
            >
              Start Order Pickup
            </Link>
            <Link
              to="/"
              className="px-8 py-4 rounded-xl border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-bold transition text-sm"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </main>
      </div>

      <Footer />
    </div>
  );
}
