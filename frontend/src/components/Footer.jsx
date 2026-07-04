import { HeartPulse } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-teal-dark text-white/90 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-white mb-3">
            <HeartPulse className="w-5 h-5 text-coral" />
            DentalCare
          </div>
          <p className="text-sm text-white/60 max-w-xs">
            One shared calendar for every branch and every doctor — so no appointment ever gets lost
            between a receptionist's phone and the front desk.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm tracking-wide uppercase text-white/70">Branches</h4>
          <ul className="text-sm text-white/60 space-y-2">
            <li>Gulberg III, Lahore</li>
            <li>DHA Phase 5, Lahore</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm tracking-wide uppercase text-white/70">Reach us</h4>
          <ul className="text-sm text-white/60 space-y-2">
            <li>03091292626</li>
            <li>hello@dentalcare.pk</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} DentalCare. All appointments confirmed instantly via WhatsApp.
      </div>
    </footer>
  );
}
