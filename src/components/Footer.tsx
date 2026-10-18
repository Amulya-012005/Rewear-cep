import React from 'react';
import { Shirt, Heart, RefreshCw, ShieldCheck, Leaf, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C3527] text-[#EDE7DB] border-t border-[#2F4D3B] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#2D5A43] flex items-center justify-center text-[#FBF9F5] shadow">
                <Shirt className="w-5 h-5 text-[#8FD5A8]" />
              </div>
              <span className="text-2xl font-bold tracking-tight font-serif text-[#F8F5EE]">
                ReWear
              </span>
            </div>
            <p className="text-sm font-serif italic text-[#C9DFC3] text-lg">
              "Swap styles. Renew wardrobes. Reduce waste."
            </p>
            <p className="text-xs text-[#AFC4B7] leading-relaxed max-w-md">
              A peer-to-peer sustainable fashion platform enabling direct clothing swaps without monetary transactions.
              Extending the lifecycle of quality garments across Hubballi, Bengaluru, Mysuru, and Pune.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#C5D8CD]">
              <span className="flex items-center gap-1 bg-[#14291E] px-2.5 py-1 rounded-md border border-[#2E523D]">
                <Leaf className="w-3.5 h-3.5 text-[#86D49F]" /> Zero Cash Platform
              </span>
              <span className="flex items-center gap-1 bg-[#14291E] px-2.5 py-1 rounded-md border border-[#2E523D]">
                <RefreshCw className="w-3.5 h-3.5 text-[#86D49F]" /> 1-to-1 Fair Exchange
              </span>
              <span className="flex items-center gap-1 bg-[#14291E] px-2.5 py-1 rounded-md border border-[#2E523D]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#86D49F]" /> Mutual Completion
              </span>
            </div>
          </div>

          {/* Sustainable Exchange Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A5C6B1]">Active Exchange Cities</h4>
            <ul className="space-y-2 text-xs text-[#D8E6DE]">
              <li className="flex items-center gap-1.5 hover:text-white transition">
                <MapPin className="w-3.5 h-3.5 text-[#86D49F]" /> Hubballi (North Karnataka Hub)
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition">
                <MapPin className="w-3.5 h-3.5 text-[#86D49F]" /> Bengaluru (Tech & Fashion Circle)
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition">
                <MapPin className="w-3.5 h-3.5 text-[#86D49F]" /> Mysuru (Heritage Handloom Hub)
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition">
                <MapPin className="w-3.5 h-3.5 text-[#86D49F]" /> Pune (College & Streetwear Hub)
              </li>
            </ul>
          </div>

          {/* Ethics & Project Note */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A5C6B1]">Swap Principles</h4>
            <ul className="space-y-1.5 text-xs text-[#C2D8CB]">
              <li>• Clean and wash clothes prior to handover</li>
              <li>• Honest reporting of condition & fabric</li>
              <li>• Public meetup locations for hand-to-hand swaps</li>
              <li>• Fair value parity without cash pressure</li>
            </ul>
            <div className="pt-2 text-[11px] text-[#9AB7A5]">
              Built with care as a Sustainable Computing & Web Systems academic capstone project.
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#294B37] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9BB7A6] gap-3">
          <p>© {new Date().getFullYear()} ReWear — Clothing Exchange Marketplace. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made for a greener planet <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> & circular wardrobes
          </p>
        </div>
      </div>
    </footer>
  );
};
