import React from 'react';
import {
  MapPin,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

interface ExchangeInstructionsViewProps {
  onGoToSwaps: () => void;
}

export const ExchangeInstructionsView: React.FC<ExchangeInstructionsViewProps> = ({ onGoToSwaps }) => {
  const localHubs = [
    {
      city: 'Hubballi',
      landmarks: ['Central Bus Terminus (CBT)', 'BVB Engineering College Gate', 'Urban Oasis Mall Entrance'],
      circle: 'North Karnataka Student Circle'
    },
    {
      city: 'Bengaluru',
      landmarks: ['Church Street / MG Road Metro', 'Indiranagar 100ft Road Cafe area', 'Koramangala Sony Signal Plaza'],
      circle: 'Metro Sustainable Fashion Circle'
    },
    {
      city: 'Mysuru',
      landmarks: ['Devaraja Market Arch', 'Mysore Palace North Gate', 'Jayalakshmipuram Coffee Day'],
      circle: 'Heritage Handloom & Silk Circle'
    },
    {
      city: 'Pune',
      landmarks: ['FC Road Starbucks Corner', 'Viman Nagar Symbiosis Entrance', 'Kothrud Vanaz Metro'],
      circle: 'College & Streetwear Exchange Hub'
    }
  ];

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
          <Truck className="w-3.5 h-3.5 text-emerald-700" />
          Handoff & Delivery Guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C3326]">
          Exchange & Delivery Procedure
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed">
          ReWear is exclusively a clothing barter platform. No payments are made through the app.
          Swappers coordinate garment handovers either in-person locally or via independent delivery.
        </p>
      </div>

      {/* Two Delivery Methods Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option 1: In-Person Meetup */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFD4] shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900">
            Option A: In-Person Local Meetup (Recommended)
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Meet your swap partner at a safe, public landmark in your city. You can touch and inspect the fabric,
            verify fit, and exchange garments face-to-face with zero carbon footprint.
          </p>

          <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-700">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Zero courier fees, zero packaging plastic, zero transit delays.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Inspect stitching, zippers, buttons and fabric condition immediately.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Always choose well-lit daylight hours in public places.</span>
            </div>
          </div>
        </div>

        {/* Option 2: Independent Courier */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFD4] shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-900">
            Option B: Independent Courier or Post
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            For exchanges between different cities (e.g. Hubballi to Bengaluru), swappers arrange parcel delivery
            directly using India Post Speed Post, Dunzo, Porter, or BlueDart.
          </p>

          <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-700">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Courier charges, if any, are paid by each sender directly to their chosen courier.</span>
            </div>
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>No courier booking fees or payments pass through ReWear.</span>
            </div>
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Share tracking reference numbers in the private negotiation chat.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Public Meetup Landmarks per City */}
      <div className="bg-[#FAF8F4] rounded-3xl p-6 sm:p-8 border border-[#E7DFD1] space-y-5">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#2C573F]" />
          <h3 className="text-lg font-serif font-bold text-stone-900">
            Recommended Safe Meeting Points by City
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {localHubs.map((hub) => (
            <div key={hub.city} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2">
              <div className="font-bold font-serif text-base text-[#1C3326] flex items-center justify-between">
                <span>{hub.city}</span>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-sans font-semibold">
                  Safe Hub
                </span>
              </div>
              <div className="text-[11px] text-stone-500 font-medium">{hub.circle}</div>
              <ul className="text-xs text-stone-600 space-y-1 pt-1 border-t border-stone-100">
                {hub.landmarks.map((lm, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2C573F]"></span>
                    <span>{lm}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Protocol */}
      <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200 text-xs text-amber-900 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-700" />
          Safety & Hygiene Protocol
        </div>
        <p className="leading-relaxed">
          1. <strong>Cleanliness:</strong> Launder or dry clean all clothes prior to handoff.<br />
          2. <strong>Public Places Only:</strong> Never meet in secluded locations or private residences. Meet in open public transit hubs or cafes.<br />
          3. <strong>Mutual Confirmation:</strong> Both users must click "Confirm Receipt" in the app after physical handover is complete.
        </p>
      </div>

      <div className="text-center pt-2">
        <button
          onClick={onGoToSwaps}
          className="px-6 py-3 bg-[#234533] hover:bg-[#1A3426] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition"
        >
          View My Active Swaps & Handover Status
        </button>
      </div>
    </div>
  );
};
