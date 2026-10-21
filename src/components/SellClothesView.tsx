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
  Repeat,
  Leaf,
  Droplets,
  Calculator,
  MessageSquare,
  HelpCircle,
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
  onRefresh
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
    <div className="space-y-10 pb-16 text-[#FDF0CD]">
      {/* 1. SELLER STUDIO HERO HEADER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#142A1D] via-[#1E3F2E] to-[#122A1E] text-[#FDF0CD] p-7 sm:p-10 shadow-2xl border border-[#D4AF37]/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#183E2A] text-[#FDE68A] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/40 shadow-xs">
              <Tag className="w-3.5 h-3.5 text-[#FDE68A]" />
              Sell & Barter Studio
            </div>

            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#FDE68A]">
              Sell Clothes & Manage Your Wardrobe
            </h1>

            <p className="text-xs sm:text-sm text-[#E5D7B3] leading-relaxed">
              List shirts, sarees, denim, or jackets you no longer wear. Set fair-trade swap valuations,
              receive incoming barter offers from other fashion enthusiasts, and track your ecological footprint.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onOpenCalculator}
              className="bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] px-4 py-3 rounded-xl border border-[#D4AF37]/40 text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 shadow-md"
            >
              <Calculator className="w-4 h-4 text-[#FDE68A]" />
              <span>Valuation Helper</span>
            </button>

            <button
              onClick={onOpenCreateListing}
              className="bg-[#FFF9E6] hover:bg-[#FCEFC7] text-[#1A2E22] px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-xl transition-transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 border border-[#EED895]"
            >
              <PlusCircle className="w-5 h-5 text-[#8A6A1C]" />
              <span>+ List New Garment</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. SELLER STATS & IMPACT ROW IN LIGHT GOLDEN YELLOW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#FFF9E6] p-5 rounded-2xl border border-[#EED895] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] text-[#1A2E22]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5B30] uppercase tracking-wider">
              My Garments
            </span>
            <Shirt className="w-4 h-4 text-[#8A6A1C]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-[#1A2E22] mt-2">
            {totalGarments}
          </div>
          <div className="text-[11px] text-[#7A6430] mt-1">Listed in your closet</div>
        </div>

        <div className="bg-[#FFF9E6] p-5 rounded-2xl border border-[#EED895] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] text-[#1A2E22]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5B30] uppercase tracking-wider">
              Pending Offers
            </span>
            <Repeat className="w-4 h-4 text-[#8A6A1C]" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-[#8A6A1C] mt-2">
            {incomingSwapOffers.filter((s) => s.status === 'pending').length}
          </div>
          <div className="text-[11px] text-[#7A6430] mt-1">Awaiting your response</div>
        </div>

        <div className="bg-[#FFF9E6] p-5 rounded-2xl border border-[#EED895] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] text-[#1A2E22]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5B30] uppercase tracking-wider">
              Water Saved
            </span>
            <Droplets className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-blue-900 mt-2">
            {estimatedWaterSaved.toLocaleString()} L
          </div>
          <div className="text-[11px] text-[#7A6430] mt-1">~2,700L per garment saved</div>
        </div>

        <div className="bg-[#FFF9E6] p-5 rounded-2xl border border-[#EED895] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] text-[#1A2E22]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6B5B30] uppercase tracking-wider">
              CO2 Offset
            </span>
            <Leaf className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-serif text-emerald-800 mt-2">
            {estimatedCO2Saved} kg
          </div>
          <div className="text-[11px] text-[#7A6430] mt-1">Textile emissions prevented</div>
        </div>
      </div>

      {/* 3. INCOMING BARTER PROPOSALS ON USER'S CLOTHES */}
      {incomingSwapOffers.filter((s) => s.status === 'pending').length > 0 && (
        <section className="bg-[#FFF9E6] border border-[#EED895] rounded-3xl p-6 sm:p-7 shadow-[0_12px_35px_rgba(0,0,0,0.3)] space-y-4 text-[#1A2E22]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#1A2E22]">
              <Sparkles className="w-5 h-5 text-[#8A6A1C]" />
              <h2 className="font-serif font-bold text-lg text-[#1A2E22]">
                Pending Barter Offers for Your Clothes ({incomingSwapOffers.filter((s) => s.status === 'pending').length})
              </h2>
            </div>
            <span className="text-xs text-[#8A6A1C] font-bold">Review proposals & accept trade</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {incomingSwapOffers
              .filter((s) => s.status === 'pending')
              .map((swap) => (
                <div
                  key={swap.id}
                  className="bg-[#FEF6DB] p-5 rounded-2xl border border-[#E8D494] shadow-md flex flex-col justify-between space-y-3 text-[#1A2E22]"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#6B5B30]">
                      <span>Requester: <strong className="text-[#1A2E22]">{swap.requesterName}</strong> ({swap.requesterCity})</span>
                      <span className="text-[11px] bg-[#FDF3D6] text-[#8A6A1C] px-2.5 py-0.5 rounded-full font-bold border border-[#EED895]">Offer Pending</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2.5 bg-[#FFF9E6] rounded-xl border border-[#EED895]">
                        <span className="text-[10px] text-[#7A6430] block uppercase font-bold">They Want Your:</span>
                        <p className="font-bold text-[#1A2E22] truncate">{swap.targetItemTitle}</p>
                      </div>
                      <div className="p-2.5 bg-[#FFF9E6] rounded-xl border border-[#EED895]">
                        <span className="text-[10px] text-[#8A6A1C] block uppercase font-bold">They Offer You:</span>
                        <p className="font-bold text-[#1A2E22] truncate">{swap.offeredItemTitle}</p>
                      </div>
                    </div>

                    {/* Delivery / Exchange Date & Method */}
                    <div className="p-2.5 bg-[#FFF9E6] rounded-xl border border-[#EED895] flex flex-wrap items-center justify-between gap-2 text-xs text-[#1A2E22]">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-[#8A6A1C]" />
                        <span>Approx. Delivery: <strong>{swap.approxDeliveryDate ? new Date(swap.approxDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '3–5 days'}</strong></span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#8A6A1C] bg-[#FEF4D5] px-2 py-0.5 rounded border border-[#E8D494] font-semibold">
                        <Truck className="w-3 h-3 text-[#8A6A1C]" />
                        <span>{swap.handoverMethod === 'courier' ? 'Courier Dispatch' : 'Local Meetup'}</span>
                      </div>
                    </div>

                    {swap.proposalMessage && (
                      <p className="text-xs text-[#543D10] italic bg-[#FFF9E6] p-2.5 rounded-xl border border-[#EED895]">
                        "{swap.proposalMessage}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#E8D494]">
                    <button
                      onClick={() => handleSwapAction(swap.id, 'accept')}
                      disabled={actionLoadingId === swap.id}
                      className="flex-1 py-2 bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] text-xs font-bold rounded-xl transition disabled:opacity-50 border border-[#D4AF37]/40 shadow-xs"
                    >
                      Accept Barter
                    </button>
                    <button
                      onClick={() => handleSwapAction(swap.id, 'reject')}
                      disabled={actionLoadingId === swap.id}
                      className="py-2 px-3 border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-semibold rounded-xl transition disabled:opacity-50"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => onOpenChat(swap)}
                      className="py-2 px-3 bg-[#FFF9E6] hover:bg-[#FCEFC7] text-[#1A2E22] text-xs font-semibold rounded-xl transition flex items-center gap-1 border border-[#EED895]"
                      title="Open private chat thread"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#8A6A1C]" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* 4. SELLER WARDROBE INVENTORY */}
      <section className="bg-[#FFF9E6] rounded-3xl p-6 sm:p-8 border border-[#EED895] shadow-[0_12px_35px_rgba(0,0,0,0.3)] space-y-6 text-[#1A2E22]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2E22]">
              Your Listed Wardrobe Inventory ({myListings.length})
            </h2>
            <p className="text-xs text-[#6B5B30] mt-1">
              Manage your garments, edit pricing estimates, and update status.
            </p>
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1 bg-[#FEF4D5] p-1 rounded-xl text-xs font-semibold border border-[#E8D494]">
            {(['all', 'available', 'pending', 'swapped'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-lg capitalize transition ${
                  activeFilter === tab
                    ? 'bg-[#183E2A] text-[#FDE68A] font-bold shadow-xs'
                    : 'text-[#6B5B30] hover:text-[#1A2E22]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl bg-[#FEF4D5] border border-dashed border-[#E8D494] space-y-3">
            <Shirt className="w-12 h-12 text-[#8A6A1C] opacity-60 mx-auto" />
            <h3 className="font-serif font-bold text-[#1A2E22] text-base">
              No garments found in this view
            </h3>
            <p className="text-xs text-[#6B5B30] max-w-sm mx-auto">
              {myListings.length === 0
                ? "You haven't listed any clothes from your wardrobe yet. Add your first piece to start receiving exchange proposals!"
                : `You don't have any items marked as "${activeFilter}".`}
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenCreateListing}
                className="bg-[#183E2A] text-[#FDE68A] px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md border border-[#D4AF37]/50"
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
                className="group bg-[#FEF6DB] rounded-2xl border border-[#E8D494] overflow-hidden shadow-md hover:shadow-xl transition flex flex-col justify-between"
              >
                <div
                  onClick={() => onSelectItem(item)}
                  className="relative aspect-[4/3] bg-[#FEF4D5] overflow-hidden cursor-pointer"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm ${
                        item.status === 'available'
                          ? 'bg-[#183E2A] text-[#FDE68A] border border-[#D4AF37]/40'
                          : item.status === 'pending'
                          ? 'bg-amber-800/90 text-white'
                          : 'bg-stone-800/90 text-white'
                      }`}
                    >
                      {item.status === 'available'
                        ? 'Available for Barter'
                        : item.status === 'pending'
                        ? 'In Negotiation'
                        : 'Swapped / Archived'}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/70 text-[#FDE68A] text-[11px] px-2 py-0.5 rounded backdrop-blur-sm font-semibold">
                    Size: {item.size}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold uppercase tracking-wider text-[#8A6A1C]">
                        {item.brand}
                      </span>
                      <span className="text-[#6B5B30] flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-[#8A6A1C]" /> {item.city}
                      </span>
                    </div>
                    <h3
                      onClick={() => onSelectItem(item)}
                      className="font-serif font-bold text-[#1A2E22] text-sm truncate mt-0.5 cursor-pointer hover:text-[#8A6A1C] transition"
                    >
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#6B5B30] pt-1 border-t border-[#E8D494]">
                    <span className="font-bold text-[#1A2E22]">≈ ₹{item.estimatedValue} Parity</span>
                    <span className="text-[#8C7A58] text-[11px]">{item.condition}</span>
                  </div>

                  {/* Actions: Edit, Delete */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#E8D494]">
                    <button
                      onClick={() => onEditItem(item)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-[#FFF9E6] hover:bg-[#FCEFC7] text-[#1A2E22] text-xs font-semibold transition flex items-center justify-center gap-1.5 border border-[#EED895]"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#8A6A1C]" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete listing "${item.title}"?`)) {
                          onDeleteItem(item.id);
                        }
                      }}
                      className="py-1.5 px-3 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold transition flex items-center justify-center gap-1.5"
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
      <section className="bg-[#FFF9E6] rounded-3xl p-6 sm:p-8 border border-[#EED895] shadow-[0_12px_35px_rgba(0,0,0,0.3)] space-y-4 text-[#1A2E22]">
        <div className="flex items-center gap-2 text-[#8A6A1C]">
          <HelpCircle className="w-5 h-5 text-[#8A6A1C]" />
          <h3 className="font-serif font-bold text-base sm:text-lg text-[#1A2E22]">
            Tips for Successful Indian Clothing Swaps
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#6B5B30]">
          <div className="bg-[#FEF4D5] p-4 rounded-xl border border-[#E8D494] space-y-1">
            <strong className="text-[#1A2E22] block font-semibold">1. Capture the Zari / Border</strong>
            <p>
              For traditional sarees and kurtas, include close-up shots of embroidery, weave, or borders to reassure prospective swappers.
            </p>
          </div>
          <div className="bg-[#FEF4D5] p-4 rounded-xl border border-[#E8D494] space-y-1">
            <strong className="text-[#1A2E22] block font-semibold">2. State True Sizing</strong>
            <p>
              Mention both the collar/bust size and approximate length, especially for denim trousers, kurtis, and oversized jackets.
            </p>
          </div>
          <div className="bg-[#FEF4D5] p-4 rounded-xl border border-[#E8D494] space-y-1">
            <strong className="text-[#1A2E22] block font-semibold">3. Transparent Parity Value</strong>
            <p>
              Set estimated barter value in INR accurately using our smart calculator to match equivalent quality garments effortlessly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
