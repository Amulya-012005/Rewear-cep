import React, { useState } from 'react';
import {
  X,
  Calculator,
  Sparkles,
  ArrowRightLeft,
  Info,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { api } from '../services/api.ts';

interface ValueCalculatorModalProps {
  onClose: () => void;
}

export const ValueCalculatorModal: React.FC<ValueCalculatorModalProps> = ({ onClose }) => {
  // Item 1 Calculator State
  const [cat1, setCat1] = useState('Jackets & Outerwear');
  const [tier1, setTier1] = useState('premium');
  const [cond1, setCond1] = useState('Like New');
  const [origPrice1, setOrigPrice1] = useState<number | ''>(2500);

  // Item 2 Simulator State (for comparing trades)
  const [cat2, setCat2] = useState('Ethnic & Festive Wear');
  const [tier2, setTier2] = useState('handcrafted');
  const [cond2, setCond2] = useState('Like New');
  const [origPrice2, setOrigPrice2] = useState<number | ''>(2800);

  const [activeTab, setActiveTab] = useState<'single' | 'compare'>('compare');

  const categories = [
    'Shirts & Tops',
    'Dresses & Jumpsuits',
    'Jeans & Trousers',
    'Jackets & Outerwear',
    'Ethnic & Festive Wear',
    'Knitwear & Sweaters'
  ];

  const brandTiers = [
    { id: 'budget', label: 'Local / Everyday / Unbranded' },
    { id: 'fast_fashion', label: 'High Street (Zara, H&M, Forever 21)' },
    { id: 'premium', label: "Premium Heritage (Levi's, FabIndia, Mango)" },
    { id: 'luxury', label: 'Designer / Luxury (Tommy, Calvin Klein, Ralph Lauren)' },
    { id: 'handcrafted', label: 'Authentic Handloom / Artisanal' }
  ];

  const conditions = [
    'Brand New with Tags',
    'Like New',
    'Gently Used',
    'Well Loved'
  ];

  // Helper local formula matching server logic
  const calculateEstimate = (cat: string, tier: string, cond: string, price: number | '') => {
    const baseMap: Record<string, number> = {
      'Shirts & Tops': 800,
      'Dresses & Jumpsuits': 1400,
      'Jeans & Trousers': 1200,
      'Jackets & Outerwear': 2000,
      'Ethnic & Festive Wear': 2200,
      'Traditional & Ethnic Wear': 2200,
      'Knitwear & Sweaters': 1500
    };
    const tierMap: Record<string, number> = {
      budget: 0.8,
      fast_fashion: 1.0,
      premium: 1.4,
      luxury: 2.2,
      handcrafted: 1.6
    };
    const condMap: Record<string, number> = {
      'Brand New with Tags': 1.0,
      'Like New': 0.85,
      'Gently Used': 0.70,
      'Well Loved': 0.50
    };

    const b = baseMap[cat] || 1000;
    const t = tierMap[tier] || 1.0;
    const c = condMap[cond] || 0.75;
    let val = Math.round(b * t * c);

    if (price && Number(price) > 0) {
      val = Math.round((val + (Number(price) * 0.45 * c)) / 2);
    }
    return Math.max(200, Math.round(val / 50) * 50);
  };

  const val1 = calculateEstimate(cat1, tier1, cond1, origPrice1);
  const val2 = calculateEstimate(cat2, tier2, cond2, origPrice2);
  const difference = Math.abs(val1 - val2);
  const ratio = Math.min(val1, val2) / Math.max(val1, val2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-stone-200 text-stone-800 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#234533] text-white flex items-center justify-center">
              <Calculator className="w-5 h-5 text-[#8CE2A8]" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1E3627]">
                Swap Value Parity Calculator
              </h3>
              <p className="text-xs text-stone-500">
                Transparent reference values based on fabric grade, brand tier & condition. Zero cash involved.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-stone-600" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-xl bg-[#F4EFE6] p-1 text-xs font-semibold mb-6">
          <button
            onClick={() => setActiveTab('compare')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'compare' ? 'bg-[#234533] text-white shadow' : 'text-stone-600'
            }`}
          >
            Compare 2 Items for Fair Barter
          </button>
          <button
            onClick={() => setActiveTab('single')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'single' ? 'bg-[#234533] text-white shadow' : 'text-stone-600'
            }`}
          >
            Estimate Single Garment Value
          </button>
        </div>

        {/* Comparison Mode */}
        {activeTab === 'compare' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item A */}
              <div className="p-4 bg-[#FAF8F4] rounded-2xl border border-[#E9E3D5] space-y-3">
                <span className="text-[11px] font-bold text-[#234533] uppercase tracking-wider block">
                  Garment A (e.g. Your Item)
                </span>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Category</label>
                  <select
                    value={cat1}
                    onChange={(e) => setCat1(e.target.value)}
                    className="w-full mt-0.5 p-2 rounded-lg border border-stone-300 text-xs bg-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Brand Tier</label>
                  <select
                    value={tier1}
                    onChange={(e) => setTier1(e.target.value)}
                    className="w-full mt-0.5 p-2 rounded-lg border border-stone-300 text-xs bg-white"
                  >
                    {brandTiers.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Condition</label>
                  <select
                    value={cond1}
                    onChange={(e) => setCond1(e.target.value)}
                    className="w-full mt-0.5 p-2 rounded-lg border border-stone-300 text-xs bg-white"
                  >
                    {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-600">Calculated Parity:</span>
                  <span className="text-sm font-bold text-[#234533] bg-[#EBF3ED] px-2.5 py-0.5 rounded border border-[#C6DFC9]">
                    ≈ ₹{val1}
                  </span>
                </div>
              </div>

              {/* Item B */}
              <div className="p-4 bg-[#FAF8F4] rounded-2xl border border-[#E9E3D5] space-y-3">
                <span className="text-[11px] font-bold text-[#234533] uppercase tracking-wider block">
                  Garment B (e.g. Other Person's Item)
                </span>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Category</label>
                  <select
                    value={cat2}
                    onChange={(e) => setCat2(e.target.value)}
                    className="w-full mt-0.5 p-2 rounded-lg border border-stone-300 text-xs bg-white"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Brand Tier</label>
                  <select
                    value={tier2}
                    onChange={(e) => setTier2(e.target.value)}
                    className="w-full mt-0.5 p-2 rounded-lg border border-stone-300 text-xs bg-white"
                  >
                    {brandTiers.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase">Condition</label>
                  <select
                    value={cond2}
                    onChange={(e) => setCond2(e.target.value)}
                    className="w-full mt-0.5 p-2 rounded-lg border border-stone-300 text-xs bg-white"
                  >
                    {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-600">Calculated Parity:</span>
                  <span className="text-sm font-bold text-[#234533] bg-[#EBF3ED] px-2.5 py-0.5 rounded border border-[#C6DFC9]">
                    ≈ ₹{val2}
                  </span>
                </div>
              </div>
            </div>

            {/* Parity Evaluation Outcome */}
            <div className="p-4 bg-[#F2EDE2] rounded-2xl border border-[#DED4C1] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#2C573F]" />
                  Barter Parity Assessment
                </span>
                <span>Difference: ₹{difference}</span>
              </div>

              <div className="text-xs text-stone-700 leading-relaxed">
                {ratio >= 0.85 ? (
                  <p className="text-emerald-800 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Optimal 1-to-1 Match! Both garments share high parity and represent an equitable direct trade.
                  </p>
                ) : (
                  <p className="text-amber-800 font-medium flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    Moderate Parity Gap (≈ ₹{difference}). While values differ, swappers often agree if styles align well.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Single Item Mode */}
        {activeTab === 'single' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-stone-700 uppercase">Clothing Category</label>
                <select
                  value={cat1}
                  onChange={(e) => setCat1(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 uppercase">Brand Tier</label>
                <select
                  value={tier1}
                  onChange={(e) => setTier1(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                >
                  {brandTiers.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 uppercase">Condition</label>
                <select
                  value={cond1}
                  onChange={(e) => setCond1(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                >
                  {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 uppercase">Approx. Original Price (Optional ₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 2500"
                  value={origPrice1}
                  onChange={(e) => setOrigPrice1(e.target.value ? Number(e.target.value) : '')}
                  className="w-full mt-1 p-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                />
              </div>
            </div>

            <div className="p-6 bg-[#FAF8F4] rounded-2xl border border-[#E7DFD1] text-center space-y-2 mt-4">
              <span className="text-xs text-stone-500 uppercase font-semibold">Recommended Swap Reference</span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-[#1E3B2C]">
                ≈ ₹{val1.toLocaleString()}
              </div>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Use this estimated value when listing your garment on ReWear. It helps potential swappers identify fair barter exchange opportunities.
              </p>
            </div>
          </div>
        )}

        {/* Disclaimer Note */}
        <div className="mt-6 pt-4 border-t border-stone-200 text-[11px] text-stone-500 flex items-start gap-2">
          <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <span>
            <strong>Note for Swappers:</strong> ReWear is completely cashless. All reference values are calculated strictly for qualitative barter alignment and zero currency will be requested or accepted on this platform.
          </span>
        </div>
      </div>
    </div>
  );
};
