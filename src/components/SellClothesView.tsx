import React, { useState } from 'react';
import { ClothingListing, SwapRequest } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import {
  Tag,
  PlusCircle,
  Shirt,
  MapPin,
  Sparkles,
  Edit,
  Trash2,
  CheckCircle2,
  Repeat,
  AlertCircle,
  Leaf,
  Droplets,
  Calculator,
  MessageSquare,
  HelpCircle,
  Clock,
  Calendar,
  Truck
} from 'lucide-react';

interface SellClothesViewProps {
  myListings: ClothingListing[];
  incomingSwapOffers: SwapRequest[];
  onOpenCreateListing: () => void;
  onEditItem: (item: ClothingListing) => void;
  onDeleteItem: (itemId: string) => void;
  onSelectItem: (item: ClothingListing) => void;
  onOpenChat: (swap: SwapRequest) => void;
  onOpenCalculator: () => void;
  onRefresh: () => void;
  activeSection?: 'inventory' | 'requests';
  onSectionChange?: (sec: 'inventory' | 'requests') => void;
}

export const SellClothesView: React.FC<SellClothesViewProps> = ({
  myListings,
  incomingSwapOffers,
  onOpenCreateListing,
  onEditItem,
  onDeleteItem,
  onSelectItem,
  onOpenChat,
  onOpenCalculator,
  onRefresh,
  activeSection = 'inventory',
  onSectionChange
}) => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | 'available' | 'pending' | 'swapped'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Status filtering
  const filteredListings = myListings.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  // Calculate environmental and seller impact
  const totalGarments = myListings.length;
  const completedSwapsCount = myListings.filter((i) => i.status === 'swapped').length;
  const estimatedWaterSaved = totalGarments * 2700; // liters
  const estimatedCO2Saved = (totalGarments * 3.6).toFixed(1); // kg

  // Handle direct swap action on seller's items
  const handleSwapAction = async (swapId: string, action: 'accept' | 'reject') => {
    setActionLoadingId(swapId);
    try {
      await api.performSwapAction(swapId, action);
      onRefresh();
    } catch (err: any) {
      alert(err.message || `Failed to ${action} swap proposal.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* 1. SELLER STUDIO HERO HEADER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1F3D2E] via-[#2A4D3B] to-[#1B3527] text-white p-7 sm:p-10 shadow-xl border border-[#3E654E]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#355B46] text-[#A4E3B8] text-xs font-semibold uppercase tracking-wider border border-[#4B795D]">
              <Tag className="w-3.5 h-3.5 text-[#85D49E]" />
              Sell & Barter Studio
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#FAF8F3]">
              Sell Clothes & Manage Your Wardrobe
            </h1>

            <p className="text-xs sm:text-sm text-[#D3E3D8] leading-relaxed">
              List shirts, sarees, denim, or jackets you no longer wear. Set fair-trade swap valuations,
              receive incoming barter offers from other fashion enthusiasts, and track your ecological footprint.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onOpenCalculator}
              className="bg-[#244434] hover:bg-[#2F5642] text-[#D4E8DC] px-4 py-3 rounded-xl border border-[#487358] text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4 text-[#85D49E]" />
              <span>Valuation Helper</span>
            </button>

            <button
              onClick={onOpenCreateListing}
              className="bg-[#D4AF37] hover:bg-[#C5A059] text-[#12241A] px-5 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5 text-[#12241A]" />
              <span>+ List New Garment</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. SELLER STATS & IMPACT ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#E5DFD4] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              My Garments
            </span>
            <Shirt className="w-4 h-4 text-[#2D563F]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-[#1C3326] mt-2">
            {totalGarments}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Listed in your closet</div>
        </div>

        <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#E5DFD4] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Pending Offers
            </span>
            <Repeat className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-amber-700 mt-2">
            {incomingSwapOffers.filter((s) => s.status === 'pending').length}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Awaiting your response</div>
        </div>

        <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#E5DFD4] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Water Saved
            </span>
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-blue-700 mt-2">
            {estimatedWaterSaved.toLocaleString()} L
          </div>
          <div className="text-[11px] text-stone-400 mt-1">~2,700L per garment saved</div>
        </div>

        <div className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#E5DFD4] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              CO2 Offset
            </span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-emerald-700 mt-2">
            {estimatedCO2Saved} kg
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Textile emissions prevented</div>
        </div>
      </div>

      {/* 3. INCOMING BARTER PROPOSALS ON USER'S CLOTHES */}
      {incomingSwapOffers.filter((s) => s.status === 'pending').length > 0 && (
        <section className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900">
              <Sparkles className="w-5 h-5 text-amber-700" />
              <h2 className="font-serif font-bold text-lg">
                Pending Barter Offers for Your Clothes ({incomingSwapOffers.filter((s) => s.status === 'pending').length})
              </h2>
            </div>
            <span className="text-xs text-amber-800 font-medium">Review proposals & accept trade</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incomingSwapOffers
              .filter((s) => s.status === 'pending')
              .map((swap) => (
                <div
                  key={swap.id}
                  className="bg-[#FAF7F0] p-5 rounded-2xl border border-[#E5DFD4] shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>Requester: <strong className="text-stone-800">{swap.requesterName}</strong> ({swap.requesterCity})</span>
                      <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">Offer Pending</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2.5 bg-[#F5F2EB] rounded-xl border border-[#ECE5D8]">
                        <span className="text-[10px] text-stone-500 block uppercase font-bold">They Want Your:</span>
                        <p className="font-bold text-stone-800 truncate">{swap.targetItemTitle}</p>
                      </div>
                      <div className="p-2.5 bg-[#EBF3ED] rounded-xl border border-emerald-200">
                        <span className="text-[10px] text-emerald-700 block uppercase font-bold">They Offer You:</span>
                        <p className="font-bold text-emerald-900 truncate">{swap.offeredItemTitle}</p>
                      </div>
                    </div>

                    {/* Delivery / Exchange Date & Method */}
                    <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-amber-700" />
                        <span>Approx. Delivery Date: <strong>{swap.approxDeliveryDate ? new Date(swap.approxDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '3–5 days'}</strong></span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-800 bg-white/70 px-2 py-0.5 rounded border border-amber-200">
                        <Truck className="w-3 h-3 text-amber-700" />
                        <span>{swap.handoverMethod === 'courier' ? 'Courier Dispatch' : 'Local Landmark Meetup'}</span>
                      </div>
                    </div>

                    {swap.proposalMessage && (
                      <p className="text-xs text-stone-600 italic bg-[#F5F2EB] p-2.5 rounded-xl border border-[#ECE5D8]">
                        "{swap.proposalMessage}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#ECE5D8]">
                    <button
                      onClick={() => handleSwapAction(swap.id, 'accept')}
                      disabled={actionLoadingId === swap.id}
                      className="flex-1 py-2 bg-[#234533] hover:bg-[#1A3527] text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
                    >
                      Accept Barter
                    </button>
                    <button
                      onClick={() => handleSwapAction(swap.id, 'reject')}
                      disabled={actionLoadingId === swap.id}
                      className="py-2 px-3 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-lg transition disabled:opacity-50"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => onOpenChat(swap)}
                      className="py-2 px-3 bg-[#EFE9DC] hover:bg-[#E5DFD1] text-stone-700 text-xs font-semibold rounded-lg transition flex items-center gap-1"
                      title="Open private chat thread"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-stone-600" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* 4. SELLER WARDROBE INVENTORY */}
      <section className="bg-[#FAF7F0] rounded-3xl p-6 sm:p-8 border border-[#E5DFD4] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C3326]">
              Your Listed Wardrobe Inventory ({myListings.length})
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Manage your garments, edit pricing estimates, and update status.
            </p>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1 bg-[#F4EFE6] p-1 rounded-xl text-xs font-medium border border-[#E0D9CB]">
            {(['all', 'available', 'pending', 'swapped'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition ${
                  activeFilter === tab
                    ? 'bg-white text-[#234533] font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-[#F5F2EB] border border-dashed border-[#DACFBD] space-y-3">
            <Shirt className="w-12 h-12 text-stone-400 mx-auto" />
            <h3 className="font-serif font-bold text-stone-800 text-base">
              No garments found in this view
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {myListings.length === 0
                ? "You haven't listed any clothes from your wardrobe yet. Add your first piece to start receiving exchange proposals!"
                : `You don't have any items marked as "${activeFilter}".`}
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenCreateListing}
                className="bg-[#234533] hover:bg-[#1A3527] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm"
              >
                + List a Garment Now
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                className="group bg-[#FAF7F0] rounded-2xl border border-[#E5DFD4] overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div
                  onClick={() => onSelectItem(item)}
                  className="relative aspect-[4/3] bg-[#F1EDE4] overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm ${
                        item.status === 'available'
                          ? 'bg-emerald-700/90 text-white'
                          : item.status === 'pending'
                          ? 'bg-amber-600/90 text-white'
                          : 'bg-stone-700/90 text-white'
                      }`}
                    >
                      {item.status === 'available'
                        ? 'Available for Barter'
                        : item.status === 'pending'
                        ? 'In Negotiation'
                        : 'Swapped / Archived'}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded backdrop-blur-sm font-semibold">
                    Size: {item.size}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold uppercase tracking-wider text-[#2B5E43]">
                        {item.brand}
                      </span>
                      <span className="text-stone-500 flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-[#2B5E43]" /> {item.city}
                      </span>
                    </div>
                    <h3
                      onClick={() => onSelectItem(item)}
                      className="font-serif font-bold text-stone-900 text-sm truncate mt-0.5 cursor-pointer hover:text-[#2C573F] transition"
                    >
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-[#F0EBE0]">
                    <span className="font-bold text-[#1C3326]">≈ ₹{item.estimatedValue} Parity</span>
                    <span className="text-stone-400 text-[11px]">{item.condition}</span>
                  </div>

                  {/* Actions: Edit, Delete */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#F0EBE0]">
                    <button
                      onClick={() => onEditItem(item)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete listing "${item.title}"?`)) {
                          onDeleteItem(item.id);
                        }
                      }}
                      className="py-1.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                      title="Delete garment listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. SELLER GUIDANCE & INDIAN CLOTHING TIPS */}
      <section className="bg-[#FAF7F0] rounded-3xl p-6 sm:p-8 border border-[#E5DFD4] space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#2C573F]" />
          <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C3326]">
            Tips for Successful Indian Clothing Swaps
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-600">
          <div className="bg-[#F5F2EB] p-4 rounded-xl border border-[#ECE5D8] space-y-1">
            <strong className="text-stone-900 block font-semibold">1. Capture the Zari / Border</strong>
            <p>
              For traditional sarees and kurtas, include close-up shots of embroidery, weave, or borders to reassure prospective swappers.
            </p>
          </div>
          <div className="bg-[#F5F2EB] p-4 rounded-xl border border-[#ECE5D8] space-y-1">
            <strong className="text-stone-900 block font-semibold">2. State True Sizing</strong>
            <p>
              Mention both the collar/bust size and approximate length, especially for denim trousers, kurtis, and oversized jackets.
            </p>
          </div>
          <div className="bg-[#F5F2EB] p-4 rounded-xl border border-[#ECE5D8] space-y-1">
            <strong className="text-stone-900 block font-semibold">3. Transparent Parity Value</strong>
            <p>
              Set estimated barter value in INR accurately using our smart calculator to match equivalent quality garments effortlessly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
