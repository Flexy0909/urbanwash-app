import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/urban-logo.png.asset.json";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <img src={logo.url} alt="Urban Wash" className="h-10 w-auto" />
          <Link to="/admin" className="text-xs text-muted-foreground hover:text-primary">Admin</Link>
        </div>
      </header>

      <section className="bg-gradient-hero text-white">
        <div className="mx-auto max-w-5xl px-4 py-10 md:py-16 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-wide uppercase">Student Registration Campaign</span>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">
            Laundry Made Easy<br/>for Students
          </h1>
          <p className="mt-3 text-white/90 max-w-xl mx-auto">
            Professional Laundry, Delivered to Your Door. Wash, Ironing & Dry Cleaning with student-friendly prices.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white text-primary-deep px-4 py-2 rounded-full font-bold shadow-soft">
            🚚 FREE PICKUP & DELIVERY ALWAYS
          </div>
          <div className="mt-8">
            <Link
              to="/register"
              className="inline-block bg-white text-primary-deep px-8 py-4 rounded-xl font-bold text-lg shadow-card hover:scale-[1.02] transition"
            >
              Register Student →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { t: "Washing", d: "Fresh, hygienic cleaning for all your everyday clothes." },
            { t: "Ironing", d: "Crisp, sharp finish — look confident every day." },
            { t: "Dry Cleaning", d: "Expert care for delicate, formal & special items." },
          ].map((s) => (
            <div key={s.t} className="bg-card rounded-2xl p-6 shadow-card border border-border">
              <div className="w-10 h-10 rounded-lg bg-gradient-hero" />
              <h3 className="mt-4 font-bold text-lg">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-card rounded-2xl p-6 md:p-8 shadow-card border border-border">
          <h2 className="text-2xl font-bold text-primary-deep">Register today and receive</h2>
          <ul className="mt-4 grid sm:grid-cols-3 gap-3 text-sm">
            <li className="flex items-start gap-2"><span className="text-success font-bold">✓</span> 10% OFF your first order</li>
            <li className="flex items-start gap-2"><span className="text-success font-bold">✓</span> Exclusive offers & reminders</li>
            <li className="flex items-start gap-2"><span className="text-success font-bold">✓</span> Special student promotions</li>
          </ul>
        </div>

        <div className="mt-10 bg-gradient-deep text-white rounded-2xl p-6 md:p-8 shadow-card">
          <h3 className="font-bold text-lg">📣 Agent Script</h3>
          <p className="mt-3 text-sm text-white/90 leading-relaxed">
            Hello! We are URBAN WASH Laundry Services. We now offer professional washing, ironing and dry cleaning with updated student-friendly prices.
            We are registering students for exclusive discounts, laundry reminders and special offers. Registration is free and takes less than a minute.
            Register today and receive 10% OFF your first order. May I have your name and phone number?
          </p>
        </div>
      </section>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-muted-foreground">
          URBAN WASH • Wash • Ironing • Dry Cleaning • WhatsApp +255 686 771 750
        </div>
      </footer>
    </div>
  );
}
