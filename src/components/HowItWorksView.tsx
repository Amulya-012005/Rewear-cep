import React from 'react';
import {
  Shirt,
  ArrowRightLeft,
  MessageSquare,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Scale,
  MapPin,
  Sparkles,
  HelpCircle,
  Truck
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
      color: 'bg-emerald-100 text-emerald-800'
    },
    {
      step: '02',
      title: 'Explore & Propose Barter',
      desc: 'Browse items across Hubballi, Bengaluru, Mysuru, and Pune. Select one of your available items to offer in exchange with our fair-value parity calculator.',
      icon: ArrowRightLeft,
      color: 'bg-amber-100 text-amber-800'
    },
    {
      step: '03',
      title: 'Private Negotiation Chat',
      desc: 'Discuss fit, fabric, and handoff details in a private chat thread. Agree on a safe local public meetup spot or arrange an independent courier.',
      icon: MessageSquare,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      step: '04',
      title: 'Mutual Handover Confirmation',
      desc: 'Once garments are exchanged and inspected, both participants click "Confirm Receipt". The swap is marked Complete with zero money charged.',
      icon: CheckCircle2,
      color: 'bg-[#234533] text-[#A2E2B8]'
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
    <div className="space-y-12 pb-16 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EBF3ED] text-[#245037] text-xs font-bold uppercase tracking-wider border border-[#C6DFC9]">
          <Leaf className="w-3.5 h-3.5 text-[#2C573F]" />
          Sustainable Fashion Barter Guide
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C3326] leading-tight">
          How Clothing Swapping Works on ReWear
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Renew your wardrobe, eliminate textile waste, and connect with fellow students and fashion enthusiasts
          without spending money.
        </p>
      </div>

      {/* 4 Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="bg-white rounded-3xl p-6 border border-[#E5DFD4] shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif font-bold text-2xl text-stone-300">
                    {s.step}
                  </span>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${s.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ecological Impact Comparison */}
      <div className="bg-[#234533] text-white rounded-3xl p-8 sm:p-10 shadow-lg border border-[#3A6349] relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#93D7AC]">
            The Environmental Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Why Swapping Beats Buying Fast Fashion
          </h2>
          <p className="text-xs sm:text-sm text-[#C8E4D3] leading-relaxed">
            The fashion industry accounts for 10% of global carbon emissions and generates 92 million tons of textile waste annually.
            By wearing pre-loved garments and extending their lifecycle by just 9 months, carbon and water footprints are reduced by over 25%.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#376148] text-center sm:text-left">
            <div>
              <div className="text-2xl font-serif font-bold text-white">~15 kg</div>
              <div className="text-[11px] text-[#A8D8BC]">CO2 Saved Per Garment</div>
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-white">2,700 L</div>
              <div className="text-[11px] text-[#A8D8BC]">Water Conserved</div>
            </div>
            <div>
              <div className="text-2xl font-serif font-bold text-white">100%</div>
              <div className="text-[11px] text-[#A8D8BC]">Landfill Diverted</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFD4] space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#2C573F]" />
          <h3 className="text-xl font-serif font-bold text-stone-900">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((f, i) => (
            <div key={i} className="p-4 bg-[#FAF8F4] rounded-2xl border border-[#ECE5D8] space-y-1.5">
              <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                {f.q}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
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
          className="px-6 py-3 bg-[#234533] hover:bg-[#1A3426] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition"
        >
          Browse Available Clothes
        </button>
        <button
          onClick={onOpenCalculator}
          className="px-6 py-3 border border-[#234533] text-[#234533] hover:bg-[#EBF3ED] rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2"
        >
          <Scale className="w-4 h-4" />
          Test Swap Value Calculator
        </button>
      </div>
    </div>
  );
};
