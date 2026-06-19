import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/urban-logo.png.asset.json";
import { loadStudents, type Student } from "@/lib/storage";

export const Route = createFileRoute("/success")({
  validateSearch: (s: Record<string, unknown>) => ({ id: typeof s.id === "string" ? s.id : "" }),
  component: Success,
});

const WHATSAPP = "255686771750";

function Success() {
  const { id } = useSearch({ from: "/success" });
  const [student, setStudent] = useState<Student | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const found = loadStudents().find((s) => s.customerId === id) || null;
    setStudent(found);
  }, [id]);

  const refLink = typeof window !== "undefined" ? `${window.location.origin}/register?ref=${id}` : "";
  const shareText = `Hujambo! Jiunge na URBAN WASH 🧺 — washing, ironing & dry cleaning kwa wanafunzi. FREE pickup & delivery + 10% OFF order ya kwanza! ${refLink}`;
  const waLink = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const smsLink = `sms:?&body=${encodeURIComponent(shareText)}`;
  const waUs = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Habari URBAN WASH, jina langu ni ${student?.fullName ?? ""} (ID ${id}).`)}`;

  function copy() {
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <Link to="/"><img src={logo.url} alt="Urban Wash" className="h-10 w-auto" /></Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="bg-gradient-hero text-white rounded-3xl p-8 text-center shadow-card">
          <div className="text-5xl">🎉</div>
          <h1 className="mt-3 text-2xl md:text-3xl font-extrabold">Registration Successful!</h1>
          <p className="mt-2 text-white/90">Thank you for registering with URBAN WASH.</p>
          <div className="mt-5 inline-block bg-white text-primary-deep px-5 py-3 rounded-xl font-bold tracking-wider">
            {id || "—"}
          </div>
          <p className="mt-3 text-sm text-white/90">Your Customer ID</p>
        </div>

        <div className="mt-6 bg-card border border-border rounded-2xl p-6 shadow-card">
          <h2 className="font-bold text-lg text-primary-deep">You have unlocked</h2>
          <p className="mt-2 flex items-center gap-2 text-foreground"><span className="text-success font-bold">✓</span> {student?.offer ?? "10% OFF First Order"}</p>
          <p className="mt-1 flex items-center gap-2 text-foreground"><span className="text-success font-bold">✓</span> FREE Pickup & Delivery always</p>
          <p className="mt-4 text-sm text-muted-foreground">Our team will contact you shortly via WhatsApp.</p>
        </div>

        <div className="mt-6 bg-gradient-deep text-white rounded-2xl p-6 shadow-card">
          <h2 className="font-bold text-lg">Share with Friends & Earn Rewards</h2>
          <p className="mt-1 text-sm text-white/90">Refer 3 students and get a <strong>FREE wash for up to 5 clothes</strong>.</p>
          <div className="mt-4 bg-white/10 rounded-lg px-3 py-2 text-xs break-all">{refLink}</div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <a href={waLink} target="_blank" rel="noreferrer" className="bg-white text-primary-deep py-2 rounded-lg font-semibold text-sm text-center">WhatsApp</a>
            <a href={smsLink} className="bg-white text-primary-deep py-2 rounded-lg font-semibold text-sm text-center">SMS</a>
            <button onClick={copy} className="bg-white text-primary-deep py-2 rounded-lg font-semibold text-sm">{copied ? "Copied!" : "Copy"}</button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link to="/register" className="bg-card border border-border text-foreground py-3 rounded-xl font-semibold text-center">Register Another</Link>
          <a href={waUs} target="_blank" rel="noreferrer" className="bg-success text-success-foreground py-3 rounded-xl font-semibold text-center">Open WhatsApp</a>
        </div>
      </main>
    </div>
  );
}
