import React from 'react';
import { Heart, RefreshCw, ShieldCheck, Leaf, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#08150E]/95 text-[#FDF0CD] border-t border-[#D4AF37]/30 mt-20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-lg border border-[#D4AF37]/50 shrink-0 bg-[#060E0A]">
                <img
                  src="/src/assets/images/rewear_brand_logo_1792598309821.jpg"
                  alt="ReWear Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight font-serif text-[#FDE68A]">
                  ReWear
                </span>
                <span className="block text-[11px] text-[#EED895] font-medium">Clothing Exchange Marketplace</span>
              </div>
            </div>
            <p className="text-base font-serif italic text-[#FDE68A]">
              "Swap styles. Renew wardrobes. Reduce waste."
            </p>
            <p className="text-xs text-[#E5D7B3] leading-relaxed max-w-md">
              A peer-to-peer sustainable fashion platform enabling direct clothing swaps without monetary transactions.
              Extending the lifecycle of quality garments across Hubballi, Bengaluru, Mysuru, and Pune.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#FDF0CD]">
              <span className="flex items-center gap-1.5 bg-[#FFF9E6]/10 px-3 py-1.5 rounded-xl border border-[#D4AF37]/40 text-[#FDE68A]">
                <Leaf className="w-3.5 h-3.5 text-[#86D49F]" /> Zero Cash Platform
              </span>
              <span className="flex items-center gap-1.5 bg-[#FFF9E6]/10 px-3 py-1.5 rounded-xl border border-[#D4AF37]/40 text-[#FDE68A]">
                <RefreshCw className="w-3.5 h-3.5 text-[#FDE68A]" /> 1-to-1 Fair Exchange
              </span>
              <span className="flex items-center gap-1.5 bg-[#FFF9E6]/10 px-3 py-1.5 rounded-xl border border-[#D4AF37]/40 text-[#FDE68A]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#86D49F]" /> Mutual Completion
              </span>
            </div>
          </div>

          {/* Sustainable Exchange Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FDE68A]">Active Exchange Cities</h4>
            <ul className="space-y-2 text-xs text-[#E5D7B3]">
              <li className="flex items-center gap-1.5 hover:text-[#FDE68A] transition">
                <MapPin className="w-3.5 h-3.5 text-[#EED895]" /> Hubballi (North Karnataka Hub)
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#FDE68A] transition">
                <MapPin className="w-3.5 h-3.5 text-[#EED895]" /> Bengaluru (Tech & Fashion Circle)
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#FDE68A] transition">
                <MapPin className="w-3.5 h-3.5 text-[#EED895]" /> Mysuru (Heritage Handloom Hub)
              </li>
              <li className="flex items-center gap-1.5 hover:text-[#FDE68A] transition">
                <MapPin className="w-3.5 h-3.5 text-[#EED895]" /> Pune (College & Streetwear Hub)
              </li>
            </ul>
          </div>

          {/* Ethics & Project Note */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#FDE68A]">Swap Principles</h4>
            <ul className="space-y-1.5 text-xs text-[#E5D7B3]">
              <li>• Clean and wash clothes prior to handover</li>
              <li>• Honest reporting of condition & fabric</li>
              <li>• Public meetup locations for hand-to-hand swaps</li>
              <li>• Fair value parity without cash pressure</li>
            </ul>
            <div className="pt-2 text-[11px] text-[#C2B280]">
              Built with care as a Sustainable Computing & Web Systems academic capstone project.
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#E5D7B3] gap-3">
          <p>© {new Date().getFullYear()} ReWear — Clothing Exchange Marketplace. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made for a greener planet <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> & circular wardrobes
          </p>
        </div>
      </div>
    </footer>
  );
};
