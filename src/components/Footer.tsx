import { Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1A1A4E] text-white/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-white">Kotak</span>
            <span className="text-xl font-bold text-[#E8192C]">Insurance Careers</span>
          </div>
          <p className="text-sm text-white/70 max-w-md">
            Join India's most trusted life insurance brand. Build a rewarding career
            as an IRDA-certified Advisory Agent with unlimited earning potential.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
            Explore
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/careers" className="hover:text-white">Open Positions</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
            Contact
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-[#E8192C]" />
              careers@kotakinsurance.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-[#E8192C]" />
              1800-209-8800
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs text-white/60 space-y-2">
          <p>
            Kotak Mahindra Life Insurance Company Ltd. Registered with IRDAI. Regn. No. 107.
          </p>
          <p>© {new Date().getFullYear()} Kotak Mahindra Life Insurance Company Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
