import React from 'react';
import {
  Shirt,
  ArrowRightLeft,
  MessageSquare,
  CheckCircle2,
  Leaf,
  Scale,
  HelpCircle
} from 'lucide-react';

interface HowItWorksViewProps {
  onBrowseClothes: () => void;
  onOpenCalculator: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({
  onBrowseClothes,
  onOpenCalculator
}) => {
  const steps = [
    {
      step: '01',
      title: 'List Items From Your Closet',
      desc: 'Snap a clear photo of shirts, dresses, denim, jackets, or ethnic wear you no longer wear. State the brand, size, true condition, and exchange city.',
      icon: Shirt,
      color: 'bg-[#183E2A] text-[#FDE68A] border border-[#D4AF37]/40'
    },
    {
      step: '02',
      title: 'Explore & Propose Barter',
      desc: 'Browse items across Hubballi, Bengaluru, Mysuru, and Pune. Select one of your available items to offer in exchange with our fair-value parity calculator.',
      icon: ArrowRightLeft,
      color: 'bg-[#8A6A1C] text-[#FFF9E6]'
    },
    {
      step: '03',
      title: 'Private Negotiation Chat',
      desc: 'Discuss fit, fabric, and handoff details in a private chat thread. Agree on a safe local public meetup spot or arrange an independent courier.',
      icon: MessageSquare,
      color: 'bg-[#183E2A] text-[#FDE68A] border border-[#D4AF37]/40'
    },
    {
      step: '04',
      title: 'Mutual Handover Confirmation',
      desc: 'Once garments are exchanged and inspected, both participants click "Confirm Receipt". The swap is marked Complete with zero money charged.',
      icon: CheckCircle2,
      color: 'bg-emerald-800 text-[#FFF9E6]'
    }
  ];

  const faqs = [
    {
      q: 'Is there any online payment or hidden subscription fee?',
      a: 'No. ReWear is completely cashless. You exchange garments directly 1-for-1. No wallet, no credit cards, and no transaction commissions exist on this platform.'
    },
    {
      q: 'How do we know if a swap is fair?',
      a: 'Our built-in Swap Value Calculator estimates a reference value in INR based on fabric category, brand tier (fast fashion vs premium vs artisanal), and condition wear. Swappers use this for parity guidance.'
    },
    {
      q: 'How does clothing delivery work?',
      a: 'Swappers living in the same city (e.g. Hubballi or Bengaluru) typically meet at a college gate, metro station, or cafe. For inter-city swaps, swappers coordinate independent parcel delivery (Speed Post, Porter, etc.).'
    },
    {
      q: 'What clothing condition is accepted?',
      a: 'Clothes must be clean, freshly washed, and honestly described. We welcome Brand New with Tags, Like New, and Gently Used pieces. Torn or stained clothes are not allowed.'
    }
  ];

  return (
    <div className="space-y-12 pb-16 max-w-5xl mx-auto text-[#FDF0CD]">
      {/* Hero */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#183E2A] text-[#FDE68A] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/40 shadow-xs">
          <Leaf className="w-3.5 h-3.5 text-[#FDE68A]" />
          Sustainable Fashion Barter Guide
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#FDE68A] leading-tight">
          How Clothing Swapping Works on ReWear
        </h1>
        <p className="text-[#E5D7B3] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Renew your wardrobe, eliminate textile waste, and connect with fellow students and fashion enthusiasts
          without spending money.
        </p>
      </div>

      {/* 4 Steps in Light Golden Yellow */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="bg-[#FFF9E6] rounded-3xl p-6 border border-[#EED895] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] flex flex-col justify-between space-y-4 hover:shadow-2xl transition text-[#1A2E22]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif font-bold text-2xl text-[#8A6A1C]">
                    {s.step}
                  </span>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${s.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-serif font-bold text-base text-[#1A2E22] mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-[#6B5B30] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ecological Impact Comparison */}
      <div className="bg-gradient-to-r from-[#142A1D] via-[#1E3F2E] to-[#122A1E] text-[#FDF0CD] rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#D4AF37]/40 relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FDE68A]">
            The Environmental Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FDE68A]">
            Why Swapping Beats Buying Fast Fashion
          </h2>
          <p className="text-xs sm:text-sm text-[#E5D7B3] leading-relaxed">
            The fashion industry accounts for 10% of global carbon emissions and generates 92 million tons of textile waste annually.
            By wearing pre-loved garments and extending their lifecycle by just 9 months, carbon and water footprints are reduced by over 25%.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#D4AF37]/20 text-center sm:text-left">
            <div>
              <div className="text-2xl font-serif font-bold text-[#FDE68A]">~15 kg</div>
              <div className="text-[11px] text-[#EED895]">CO2 Saved Per Garment</div>
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-[#FDE68A]">2,700 L</div>
              <div className="text-[11px] text-[#EED895]">Water Conserved</div>
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-[#FDE68A]">100%</div>
              <div className="text-[11px] text-[#EED895]">Landfill Diverted</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section in Light Golden Yellow */}
      <div className="bg-[#FFF9E6] rounded-3xl p-6 sm:p-8 border border-[#EED895] shadow-[0_12px_35px_rgba(0,0,0,0.3)] space-y-6 text-[#1A2E22]">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#8A6A1C]" />
          <h3 className="text-xl font-serif font-bold text-[#1A2E22]">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((f, i) => (
            <div key={i} className="p-4 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] space-y-1.5">
              <h4 className="font-bold text-[#1A2E22] text-xs sm:text-sm">
                {f.q}
              </h4>
              <p className="text-xs text-[#6B5B30] leading-relaxed">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="text-center pt-4 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={onBrowseClothes}
          className="px-6 py-3 bg-[#FFF9E6] hover:bg-[#FCEFC7] text-[#1A2E22] rounded-xl text-xs sm:text-sm font-bold shadow-xl transition border border-[#EED895]"
        >
          Browse Available Clothes
        </button>
        <button
          onClick={onOpenCalculator}
          className="px-6 py-3 bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 border border-[#D4AF37]/40 shadow-md"
        >
          <Scale className="w-4 h-4 text-[#FDE68A]" />
          Test Swap Value Calculator
        </button>
      </div>
    </div>
  );
};
