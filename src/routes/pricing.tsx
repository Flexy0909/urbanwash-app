import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/urban-logo.png.asset.json";
import {
  ArrowLeft,
  Clock,
  Sparkles,
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
      item: "Blanket / Duvet",
      washFold: 5000,
      ironOnly: 500,
      washIron: 5500,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* Navigation Header */}
      <header className="border-b border-slate-100 bg-white sticky top-0 z-20 shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5">
            <img src={logo.url} alt="Urban Wash" className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-sm transition hover:scale-[1.02] active:scale-[0.98]"
            >
              Register & Order
            </Link>
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back Home
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white py-12 px-4 text-center">
        <div className="mx-auto max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" /> Student-Friendly Rates
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
              <span>Standard Turnaround</span>
            </div>
            <p className="text-xs text-slate-650 leading-relaxed">
              Standard orders are delivered back to your room within **48 to 72 hours**. This service is highly recommended for standard weekly laundry needs at normal prices.
            </p>
          </div>

          <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-900 font-black text-sm uppercase tracking-wider">
              <TrendingUp className="h-4.5 w-4.5 text-amber-700 shrink-0" />
              <span>Express Services</span>
            </div>
            <p className="text-xs text-slate-650 leading-relaxed">
              Need your clothes returned immediately? We offer a priority **Express Service** return within **4 hours** at a slightly higher cost. Ask your field agent during pickup!
            </p>
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
  );
}
