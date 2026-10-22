import React, { useState } from 'react';
import { ClothingListing } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { getSafeImageUrl, handleImageError } from '../utils/imageFallback.ts';
import {
  X,
  MapPin,
  Tag,
  ArrowRightLeft,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  Leaf,
  Info,
  Trash2,
  Edit,
  Sparkles
} from 'lucide-react';

interface ItemDetailsModalProps {
  item: ClothingListing | null;
  allListings?: ClothingListing[];
  onClose: () => void;
  onProposeSwap: (item: ClothingListing) => void;
  onEditItem: (item: ClothingListing) => void;
  onDeleteItem: (itemId: string) => void;
  onReportDispute: (itemId: string, itemTitle: string) => void;
  onSelectSimilarItem?: (item: ClothingListing) => void;
}

export const ItemDetailsModal: React.FC<ItemDetailsModalProps> = ({
  item,
  allListings = [],
  onClose,
  onProposeSwap,
  onEditItem,
  onDeleteItem,
  onReportDispute,
  onSelectSimilarItem
}) => {
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!item) return null;

  const isOwner = user?.id === item.userId;
  const isAdmin = user?.role === 'admin';
  const isAvailable = item.status === 'available';

  // Find similar items (same category or city, excluding current item)
  const similarItems = allListings
    .filter(l => l.id !== item.id && (l.category === item.category || l.city === item.city))
    .slice(0, 3);

  const fallbackImage = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#FFF9E6] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#EED895] text-[#1A2E22]">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-[#FDE68A] flex items-center justify-center backdrop-blur-md transition border border-[#D4AF37]/30 shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="relative aspect-[3/4] md:aspect-auto md:h-full bg-[#FEF4D5] overflow-hidden">
            <img
              src={getSafeImageUrl(item.imageUrl, item.category)}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => handleImageError(e, item.category)}
            />

            {/* Status Overlay */}
            <div className="absolute top-4 left-4">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-md shadow-md ${
                  item.status === 'available'
                    ? 'bg-[#183E2A] text-[#FDE68A] border border-[#D4AF37]/50'
                    : item.status === 'pending'
                    ? 'bg-amber-800/90 text-white'
                    : 'bg-stone-800/90 text-white'
                }`}
              >
                {item.status === 'available' && '● Available for Swap'}
                {item.status === 'pending' && '● Swap In Progress'}
                {item.status === 'swapped' && '● Swapped'}
              </span>
            </div>

            {/* Ecological Impact Badge */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md text-[#FDF0CD] text-xs p-3 rounded-2xl flex items-center gap-2 border border-[#D4AF37]/30 shadow-md">
              <Leaf className="w-4 h-4 text-[#86D49F] shrink-0" />
              <span>By swapping this garment, you prevent approx <strong>15 kg of CO2</strong> and conserve <strong>2,700L</strong> of water!</span>
            </div>
          </div>

          {/* Right: Garment Specifications & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Brand & Category */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#8A6A1C] bg-[#FEF4D5] px-3 py-1 rounded-xl border border-[#E8D494]">
                  {item.brand}
                </span>
                <span className="text-xs text-[#6B5B30] font-bold">
                  {item.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2E22] leading-snug">
                {item.title}
              </h2>

              {/* Key Specifications Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] text-xs">
                <div>
                  <span className="text-[#7A6430] block text-[11px] font-medium">Size</span>
                  <span className="font-bold text-[#1A2E22] text-sm">{item.size}</span>
                </div>
                <div>
                  <span className="text-[#7A6430] block text-[11px] font-medium">Condition</span>
                  <span className="font-bold text-[#8A6A1C] text-sm">{item.condition}</span>
                </div>
                <div>
                  <span className="text-[#7A6430] block text-[11px] font-medium">Location</span>
                  <span className="font-bold text-[#1A2E22] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#8A6A1C]" />
                    {item.city}
                  </span>
                </div>
                <div>
                  <span className="text-[#7A6430] block text-[11px] font-medium">Estimated Parity</span>
                  <span className="font-bold text-[#1A2E22] text-sm">≈ ₹{item.estimatedValue.toLocaleString()}</span>
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B5B30] mb-1.5">
                  About this garment
                </h4>
                <p className="text-xs sm:text-sm text-[#203628] leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              {/* Owner Info Card */}
              <div className="p-3.5 bg-[#FEF4D5] rounded-2xl flex items-center justify-between border border-[#E8D494]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#183E2A] text-[#FDE68A] flex items-center justify-center font-serif font-bold text-base shadow-sm border border-[#D4AF37]/40">
                    {item.userName[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1A2E22]">{item.userName}</div>
                    <div className="text-[11px] text-[#6B5B30] flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      {item.userCity} • Verified Swap Member
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#FDE68A] bg-[#183E2A] px-2.5 py-0.5 rounded-lg border border-[#D4AF37]/30">
                    <ShieldCheck className="w-3 h-3 text-[#FDE68A]" />
                    Trusted
                  </span>
                </div>
              </div>

              {/* Parity Explainer */}
              <div className="text-[11px] text-[#543D10] bg-[#FEF4D5] p-3 rounded-2xl border border-[#E8D494] flex items-start gap-2">
                <Info className="w-4 h-4 text-[#8A6A1C] shrink-0 mt-0.5" />
                <span>
                  <strong>Barter Reference:</strong> The estimated value in INR is an approximate parity guideline to ensure fair exchanges. No online cash is charged or transferred.
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#EED895]/70 space-y-3">
              {(isOwner || isAdmin) ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditItem(item)}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-[#8A6A1C] text-[#8A6A1C] hover:bg-[#FEF4D5] text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit Listing Details
                    </button>

                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="py-2.5 px-4 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onDeleteItem(item.id);
                            onClose();
                          }}
                          className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="py-2.5 px-3 rounded-xl border border-[#EED895] bg-[#FEF4D5] text-xs font-bold text-[#1A2E22]"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  {isAdmin && !isOwner && (
                    <p className="text-[11px] text-[#8A6A1C] italic">
                      Administrator moderation mode: you can remove or modify this item.
                    </p>
                  )}
                </div>
              ) : (
                /* Swapper Action Buttons */
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onProposeSwap(item)}
                      disabled={!isAvailable}
                      className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition ${
                        isAvailable
                          ? 'bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] transform hover:-translate-y-0.5 active:translate-y-0 border border-[#D4AF37]/40'
                          : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      <ArrowRightLeft className="w-4 h-4 text-[#FDE68A]" />
                      {isAvailable ? 'Request a Swap' : 'Item In Active Swap'}
                    </button>

                    <button
                      onClick={() => onProposeSwap(item)}
                      disabled={!isAvailable}
                      className="px-4 py-3 rounded-xl border border-[#8A6A1C] text-[#8A6A1C] hover:bg-[#FEF4D5] font-bold text-xs flex items-center justify-center gap-1.5 transition"
                      title="Send proposal and message owner"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#6B5B30] pt-1">
                    <span>Safe local meetup in {item.city} recommended</span>
                    <button
                      onClick={() => onReportDispute(item.id, item.title)}
                      className="text-[#6B5B30] hover:text-rose-700 underline flex items-center gap-1 font-medium"
                    >
                      <AlertTriangle className="w-3 h-3 text-amber-700" />
                      Report listing
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Clothing Suggestions Section */}
        {similarItems.length > 0 && (
          <div className="p-6 sm:p-8 bg-[#FEF6DB] border-t border-[#E8D494] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-[#1A2E22] text-sm sm:text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8A6A1C]" />
                Similar Clothing Suggestions
              </h3>
              <span className="text-xs text-[#6B5B30]">More in {item.category} or {item.city}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {similarItems.map((similar) => (
                <div
                  key={similar.id}
                  onClick={() => {
                    if (onSelectSimilarItem) {
                      onSelectSimilarItem(similar);
                    }
                  }}
                  className="bg-[#FFF9E6] p-2.5 rounded-2xl border border-[#EED895] hover:border-[#D4AF37] transition cursor-pointer flex items-center gap-3 group shadow-xs"
                >
                  <img
                    src={getSafeImageUrl(similar.imageUrl, similar.category)}
                    alt={similar.title}
                    className="w-12 h-14 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                    onError={(e) => handleImageError(e, similar.category)}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A6A1C] truncate">
                      {similar.brand}
                    </div>
                    <div className="text-xs font-bold text-[#1A2E22] truncate">
                      {similar.title}
                    </div>
                    <div className="text-[11px] text-[#6B5B30]">
                      ≈ ₹{similar.estimatedValue} • {similar.city}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
