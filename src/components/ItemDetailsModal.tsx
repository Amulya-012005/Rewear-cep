import React, { useState } from 'react';
import { ClothingListing } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
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
  CheckCircle2,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#FAF7F0] rounded-3xl shadow-2xl border border-[#E5DFD4] text-stone-800">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="relative aspect-[3/4] md:aspect-auto md:h-full bg-stone-100 overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
            />

            {/* Status Overlay */}
            <div className="absolute top-4 left-4">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-lg backdrop-blur-md shadow ${
                  item.status === 'available'
                    ? 'bg-emerald-700/90 text-white'
                    : item.status === 'pending'
                    ? 'bg-amber-600/90 text-white'
                    : 'bg-stone-800/90 text-white'
                }`}
              >
                {item.status === 'available' && '● Available for Swap'}
                {item.status === 'pending' && '● Swap In Progress'}
                {item.status === 'swapped' && '● Swapped'}
              </span>
            </div>

            {/* Ecological Impact Badge */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs p-3 rounded-xl flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#8CE2A8] shrink-0" />
              <span>By swapping this garment, you prevent approx <strong>15 kg of CO2</strong> and conserve <strong>2,700L</strong> of water!</span>
            </div>
          </div>

          {/* Right: Garment Specifications & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Brand & Category */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#245037] bg-[#EBF3ED] px-2.5 py-1 rounded border border-[#C8DFCF]">
                  {item.brand}
                </span>
                <span className="text-xs text-stone-500 font-medium">
                  {item.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#193023] leading-snug">
                {item.title}
              </h2>

              {/* Key Specifications Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FAF8F4] rounded-2xl border border-[#E9E3D5] text-xs">
                <div>
                  <span className="text-stone-400 block text-[11px]">Size</span>
                  <span className="font-bold text-stone-800 text-sm">{item.size}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Condition</span>
                  <span className="font-bold text-emerald-800 text-sm">{item.condition}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Location</span>
                  <span className="font-bold text-stone-800 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#2B5E43]" />
                    {item.city}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Estimated Parity</span>
                  <span className="font-bold text-[#1F402E] text-sm">≈ ₹{item.estimatedValue.toLocaleString()}</span>
                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                  About this garment
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              {/* Owner Info Card */}
              <div className="p-3.5 bg-[#F2EDE2] rounded-2xl flex items-center justify-between border border-[#E2D9C8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#234533] text-white flex items-center justify-center font-serif font-bold text-base shadow-sm">
                    {item.userName[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">{item.userName}</div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      {item.userCity} • Verified Swap Member
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Trusted
                  </span>
                </div>
              </div>

              {/* Parity Explainer */}
              <div className="text-[11px] text-stone-500 bg-amber-50/70 p-3 rounded-xl border border-amber-200/60 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Barter Reference:</strong> The estimated value in INR is an approximate parity guideline to ensure fair exchanges. No online cash is charged or transferred.
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-200 space-y-3">
              {(isOwner || isAdmin) ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditItem(item)}
                      className="flex-1 py-2.5 px-4 rounded-xl border border-[#2B5E43] text-[#2B5E43] hover:bg-emerald-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit Listing Details
                    </button>

                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="py-2.5 px-4 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
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
                          className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                        >
                          Confirm Delete
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="py-2.5 px-3 rounded-xl border border-stone-300 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  {isAdmin && !isOwner && (
                    <p className="text-[11px] text-amber-700 italic">
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
                      className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition ${
                        isAvailable
                          ? 'bg-[#234533] hover:bg-[#1A3527] text-white transform hover:-translate-y-0.5 active:translate-y-0'
                          : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      <ArrowRightLeft className="w-4 h-4 text-[#8CE2A8]" />
                      {isAvailable ? 'Request a Swap' : 'Item In Active Swap'}
                    </button>

                    <button
                      onClick={() => onProposeSwap(item)}
                      disabled={!isAvailable}
                      className="px-4 py-3 rounded-xl border border-[#234533] text-[#234533] hover:bg-[#EBF3ED] font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                      title="Send proposal and message owner"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                    <span>Safe local meetup in {item.city} recommended</span>
                    <button
                      onClick={() => onReportDispute(item.id, item.title)}
                      className="text-stone-400 hover:text-rose-600 underline flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3" />
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
          <div className="p-6 sm:p-8 bg-[#FAF8F4] border-t border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2C573F]" />
                Similar Clothing Suggestions
              </h3>
              <span className="text-xs text-stone-500">More in {item.category} or {item.city}</span>
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
                  className="bg-white p-2.5 rounded-2xl border border-stone-200 hover:border-[#2C573F] transition cursor-pointer flex items-center gap-3 group"
                >
                  <img
                    src={similar.imageUrl}
                    alt={similar.title}
                    className="w-12 h-14 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackImage;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#2B5E43] truncate">
                      {similar.brand}
                    </div>
                    <div className="text-xs font-bold text-stone-800 truncate">
                      {similar.title}
                    </div>
                    <div className="text-[11px] text-stone-500">
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
