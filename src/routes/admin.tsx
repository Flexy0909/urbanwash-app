import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import logo from "@/assets/urban-logo.png.asset.json";
import { loadStudents, exportCSV, downloadFile, type Student } from "@/lib/storage";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

function Admin() {
  const [students, setStudents] = useState<Student[]>([]);
  const [q, setQ] = useState("");
  const [hostelFilter, setHostelFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [referralFilter, setReferralFilter] = useState("");

  useEffect(() => { setStudents(loadStudents()); }, []);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      total: students.length,
      today: students.filter((s) => new Date(s.createdAt).toDateString() === today).length,
      h1: students.filter((s) => s.hostel === "Hostel 1").length,
      h2: students.filter((s) => s.hostel === "Hostel 2").length,
      h3: students.filter((s) => s.hostel === "Hostel 3").length,
      h4: students.filter((s) => s.hostel === "Hostel 4").length,
      washing: students.filter((s) => s.services.includes("Washing")).length,
      ironing: students.filter((s) => s.services.includes("Ironing")).length,
      dry: students.filter((s) => s.services.includes("Dry Cleaning")).length,
      referrals: students.filter((s) => s.referralStatus === "Yes").length,
    };
  }, [students]);

  const filtered = useMemo(() => students.filter((s) => {
    if (q && !`${s.fullName} ${s.phone} ${s.customerId}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (hostelFilter && s.hostel !== hostelFilter) return false;
    if (serviceFilter && !s.services.includes(serviceFilter)) return false;
    if (referralFilter && s.referralStatus !== referralFilter) return false;
    return true;
  }), [students, q, hostelFilter, serviceFilter, referralFilter]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link to="/"><img src={logo.url} alt="Urban Wash" className="h-10 w-auto" /></Link>
          <div className="flex gap-2">
            <button onClick={() => downloadFile(`urbanwash-${Date.now()}.csv`, exportCSV(filtered), "text/csv")}
              className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Export CSV</button>
            <button onClick={() => downloadFile(`urbanwash-${Date.now()}.xls`, exportCSV(filtered), "application/vnd.ms-excel")}
              className="px-3 py-2 rounded-lg bg-primary-deep text-white text-sm font-semibold">Export Excel</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="text-2xl font-bold text-primary-deep">Admin Dashboard</h1>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-5 gap-3">
          <Stat label="Total Registrations" value={stats.total} primary />
          <Stat label="Today" value={stats.today} />
          <Stat label="Referral Members" value={stats.referrals} />
          <Stat label="Washing" value={stats.washing} />
          <Stat label="Ironing" value={stats.ironing} />
          <Stat label="Dry Cleaning" value={stats.dry} />
          <Stat label="Hostel 1" value={stats.h1} />
          <Stat label="Hostel 2" value={stats.h2} />
          <Stat label="Hostel 3" value={stats.h3} />
          <Stat label="Hostel 4" value={stats.h4} />
        </div>

        <div className="mt-6 bg-card border border-border rounded-2xl p-4 shadow-card">
          <div className="grid md:grid-cols-4 gap-3">
            <input placeholder="Search name, phone, ID…" value={q} onChange={(e) => setQ(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-card" />
            <select value={hostelFilter} onChange={(e) => setHostelFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-card">
              <option value="">All Hostels</option>{["Hostel 1","Hostel 2","Hostel 3","Hostel 4"].map(h => <option key={h}>{h}</option>)}
            </select>
            <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-card">
              <option value="">All Services</option>{["Washing","Ironing","Dry Cleaning"].map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={referralFilter} onChange={(e) => setReferralFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-card">
              <option value="">All Referral Status</option><option>Yes</option><option>No</option>
            </select>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground border-b border-border">
                <tr>
                  {["ID","Name","Phone","WhatsApp","Hostel","Room","Services","Offer","Referral","Status","Date"].map(h => (
                    <th key={h} className="py-2 pr-3 font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={11} className="py-10 text-center text-muted-foreground">No registrations yet.</td></tr>
                )}
                {filtered.map((s) => (
                  <tr key={s.customerId} className="border-b border-border/60 hover:bg-accent/40">
                    <td className="py-2 pr-3 font-mono text-xs whitespace-nowrap">{s.customerId}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{s.fullName}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{s.phone}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{s.whatsapp}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{s.hostel}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{s.room}</td>
                    <td className="py-2 pr-3">{s.services.join(", ")}</td>
                    <td className="py-2 pr-3 whitespace-nowrap">{s.offer}</td>
                    <td className="py-2 pr-3">{s.referralStatus}</td>
                    <td className="py-2 pr-3"><span className="px-2 py-0.5 rounded-full bg-accent text-primary-deep text-xs font-semibold">{s.status}</span></td>
                    <td className="py-2 pr-3 whitespace-nowrap text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, primary }: { label: string; value: number; primary?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 border shadow-card ${primary ? "bg-gradient-hero text-white border-transparent" : "bg-card border-border"}`}>
      <div className={`text-xs ${primary ? "text-white/80" : "text-muted-foreground"}`}>{label}</div>
      <div className="mt-1 text-2xl font-extrabold">{value}</div>
    </div>
  );
}
