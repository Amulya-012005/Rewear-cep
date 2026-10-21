import React, { useState, useEffect } from 'react';
import { ClothingListing } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import {
  X,
  ArrowRightLeft,
  AlertCircle,
  CheckCircle2,
  Tag,
  Sparkles,
  Calendar,
  Truck,
  Users,
  Info
} from 'lucide-react';

interface SwapProposalModalProps {
  targetItem: ClothingListing | null;
  onClose: () => void;
  onSuccess: () => void;
  onOpenCreateListing: () => void;
}

export const SwapProposalModal: React.FC<SwapProposalModalProps> = ({
  targetItem,
  onClose,
  onSuccess,
  onOpenCreateListing
}) => {
  const { user } = useAuth();
  const [userItems, setUserItems] = useState<ClothingListing[]>([]);
  const [selectedOfferedItemId, setSelectedOfferedItemId] = useState<string>('');
  const [message, setMessage] = useState('');
  const [handoverMethod, setHandoverMethod] = useState<'local_meetup' | 'courier'>('local_meetup');
  
  // Approximate Swap Delivery / Meetup Date
  const defaultDate = new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
  const [approxDeliveryDate, setApproxDeliveryDate] = useState<string>(defaultDate);
  const [pickupLocation, setPickupLocation] = useState<string>('');

  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAvailableItems = async () => {
      if (!user) return;
      setIsLoadingItems(true);
      try {
        const res = await api.getListings({ userId: user.id });
        const available = res.listings.filter(i => i.status === 'available');
        setUserItems(available);
        if (available.length > 0) {
          setSelectedOfferedItemId(available[0].id);
        }
      } catch {
        setError('Failed to fetch your wardrobe items.');
      } finally {
        setIsLoadingItems(false);
      }
    };

    fetchUserAvailableItems();
  }, [user]);

  if (!targetItem) return null;

  const offeredItem = userItems.find(i => i.id === selectedOfferedItemId);

  // Value difference & parity
  const valueDifference = offeredItem ? Math.abs(targetItem.estimatedValue - offeredItem.estimatedValue) : 0;
  const parityRatio = offeredItem && targetItem.estimatedValue > 0
    ? (offeredItem.estimatedValue / targetItem.estimatedValue)
    : 1;

  const setPresetDate = (daysFromNow: number) => {
    const d = new Date(Date.now() + daysFromNow * 86400000);
    setApproxDeliveryDate(d.toISOString().split('T')[0]);
  };

  const minDate = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfferedItemId) {
      setError('Please select an item from your wardrobe to offer in exchange.');
      return;
    }

    if (!approxDeliveryDate) {
      setError('Please specify an approximate swap exchange or delivery date.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await api.proposeSwap({
        requestedItemId: targetItem.id,
        offeredItemId: selectedOfferedItemId,
        message,
        approxDeliveryDate,
        handoverMethod,
        pickupLocation
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit proposal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#FFF9E6] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#EED895] text-[#1A2E22] p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EED895]/60 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#183E2A] text-[#FDE68A] flex items-center justify-center shadow-sm border border-[#D4AF37]/40">
              <ArrowRightLeft className="w-5 h-5 text-[#FDE68A]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-[#1A2E22]">
                Propose Item-for-Item Swap
              </h3>
              <p className="text-xs text-[#6B5B30]">
                Direct cashless barter exchange with {targetItem.userName} ({targetItem.city})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FEF4D5] hover:bg-[#FCEFC7] flex items-center justify-center transition border border-[#E8D494] text-[#8A6A1C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-100 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Requested Item Banner (Light Golden Yellow Box) */}
          <div className="p-4 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={targetItem.imageUrl}
                alt={targetItem.title}
                className="w-16 h-18 rounded-xl object-cover border border-[#E8D494] shadow-xs shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FDE68A] bg-[#183E2A] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                  You are requesting
                </span>
                <h4 className="font-serif font-bold text-sm text-[#1A2E22] truncate mt-1">
                  {targetItem.title}
                </h4>
                <div className="text-xs text-[#6B5B30] flex items-center gap-2 mt-0.5 font-medium">
                  <span>{targetItem.brand}</span>
                  <span>•</span>
                  <span>Size {targetItem.size}</span>
                  <span>•</span>
                  <span className="font-bold text-[#8A6A1C]">≈ ₹{targetItem.estimatedValue}</span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0 hidden sm:block">
              <span className="text-[11px] text-[#7A6430] block">Owner</span>
              <span className="text-xs font-bold text-[#1A2E22]">{targetItem.userName}</span>
              <span className="text-[10px] text-[#6B5B30] block">{targetItem.city}</span>
            </div>
          </div>

          {/* User's Offered Item Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#6B5B30] uppercase tracking-wider">
                Select an item from your wardrobe to offer:
              </label>
            </div>

            {isLoadingItems ? (
              <div className="p-8 text-center text-xs text-[#7A6430] animate-pulse bg-[#FEF4D5] rounded-2xl border border-[#E8D494]">
                Loading your wardrobe items...
              </div>
            ) : userItems.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#FEF6DB] border border-[#E8D494] text-center space-y-3">
                <Info className="w-8 h-8 text-[#8A6A1C] mx-auto" />
                <h4 className="font-serif font-bold text-sm text-[#1A2E22]">
                  No Available Wardrobe Items Found
                </h4>
                <p className="text-xs text-[#6B5B30] max-w-md mx-auto leading-relaxed">
                  ReWear is a 100% cashless clothing exchange platform where you trade clothes for clothes.
                  To propose a swap, please visit the <strong>Sell Clothes</strong> module to list an item from your closet!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCreateListing();
                  }}
                  className="px-5 py-2.5 bg-[#183E2A] text-[#FDE68A] rounded-xl text-xs font-bold shadow-md hover:bg-[#122A1E] transition inline-flex items-center gap-1.5 border border-[#D4AF37]/40"
                >
                  <Tag className="w-3.5 h-3.5 text-[#FDE68A]" />
                  <span>Go to Sell Clothes Module to List Garment</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                {userItems.map((item) => {
                  const isSelected = selectedOfferedItemId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedOfferedItemId(item.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                        isSelected
                          ? 'border-[#8A6A1C] bg-[#FEF4D5] shadow-md ring-2 ring-[#D4AF37]/40'
                          : 'border-[#EED895] hover:border-[#8A6A1C] bg-[#FFFDF5]'
                      }`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-12 h-14 rounded-lg object-cover shrink-0 border border-[#E8D494]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#1A2E22] truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[#6B5B30]">
                          {item.size} • ≈ ₹{item.estimatedValue}
                        </div>
                        <div className="text-[10px] text-[#8A6A1C] font-semibold">
                          {item.condition}
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#8A6A1C] shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* APPROXIMATE SWAP DELIVERY / EXCHANGE DATE */}
          <div className="p-4 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1A2E22] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#8A6A1C]" />
                Approximate Swap / Delivery Date *
              </label>
              <span className="text-[11px] text-[#7A6430]">Proposed Target Date</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-auto flex-1">
                <input
                  type="date"
                  required
                  min={minDate}
                  value={approxDeliveryDate}
                  onChange={(e) => setApproxDeliveryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#B89635]"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setPresetDate(1)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#FFF9E6] hover:bg-[#FCEFC7] text-[#1A2E22] text-xs font-bold border border-[#EED895]"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDate(3)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#FFF9E6] hover:bg-[#FCEFC7] text-[#1A2E22] text-xs font-bold border border-[#EED895]"
                >
                  In 3 Days
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDate(7)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#FFF9E6] hover:bg-[#FCEFC7] text-[#1A2E22] text-xs font-bold border border-[#EED895]"
                >
                  In 1 Week
                </button>
              </div>
            </div>

            <p className="text-[11px] text-[#6B5B30]">
              The owner will review this target date when accepting your proposal. You can coordinate final handoff timing in the encrypted chat thread.
            </p>
          </div>

          {/* Handover Preference (Local vs Courier) */}
          <div className="p-4 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] space-y-3">
            <label className="text-xs font-bold text-[#1A2E22] uppercase tracking-wider block">
              Handover / Delivery Preference
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setHandoverMethod('local_meetup')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  handoverMethod === 'local_meetup'
                    ? 'border-[#8A6A1C] bg-[#FFF9E6] font-bold text-[#1A2E22] shadow-sm'
                    : 'border-[#E8D494] bg-[#FFFDF5] text-[#243427] hover:bg-[#FFF9E6]'
                }`}
              >
                <Users className="w-4 h-4 text-[#8A6A1C]" />
                <div>
                  <div className="text-xs">Local Public Meetup</div>
                  <div className="text-[10px] font-normal text-[#6B5B30]">Meet at landmark or metro</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setHandoverMethod('courier')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  handoverMethod === 'courier'
                    ? 'border-[#8A6A1C] bg-[#FFF9E6] font-bold text-[#1A2E22] shadow-sm'
                    : 'border-[#E8D494] bg-[#FFFDF5] text-[#243427] hover:bg-[#FFF9E6]'
                }`}
              >
                <Truck className="w-4 h-4 text-[#8A6A1C]" />
                <div>
                  <div className="text-xs">Doorstep / Courier</div>
                  <div className="text-[10px] font-normal text-[#6B5B30]">Speed Post or Porter</div>
                </div>
              </button>
            </div>

            <input
              type="text"
              placeholder={handoverMethod === 'local_meetup' ? 'Preferred public spot (e.g. Metro Station Gate 2, Central Mall)' : 'Your city / delivery address pin code'}
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-xs text-[#1A2E22] focus:outline-none focus:border-[#B89635]"
            />
          </div>

          {/* Parity Comparison Meter */}
          {offeredItem && (
            <div className="p-4 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#1A2E22]">
                <span className="flex items-center gap-1 text-[#8A6A1C]">
                  <Sparkles className="w-3.5 h-3.5 text-[#8A6A1C]" />
                  Exchange Parity Analysis
                </span>
                <span className="text-[11px] font-semibold text-[#6B5B30]">
                  Value Gap: ₹{valueDifference}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#6B5B30]">
                <span>Your offer: ₹{offeredItem.estimatedValue}</span>
                <span>Their item: ₹{targetItem.estimatedValue}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E8D494] overflow-hidden flex">
                <div
                  className="bg-[#183E2A] h-full"
                  style={{ width: `${Math.min(100, Math.max(20, parityRatio * 50))}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-[#543D10] italic">
                {parityRatio >= 0.8 && parityRatio <= 1.2
                  ? '✓ Balanced exchange parity! Both garments are in a fair valuation tier.'
                  : parityRatio > 1.2
                  ? 'Your offered item has higher estimated reference value. Very attractive proposal!'
                  : 'Your offered item has lower estimated reference value. The owner may accept based on styling appeal!'}
              </p>
            </div>
          )}

          {/* Personalized Proposal Message */}
          <div>
            <label className="block text-xs font-bold text-[#6B5B30] uppercase tracking-wider mb-1">
              Personalized Note to {targetItem.userName}
            </label>
            <textarea
              rows={2}
              placeholder={`Hi ${targetItem.userName}! Would love to swap with your ${targetItem.title}. Looking forward to connecting!`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] focus:outline-none focus:border-[#B89635] text-xs sm:text-sm text-[#1A2E22]"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#EED895] text-[#6B5B30] hover:bg-[#FEF4D5] text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || userItems.length === 0 || !selectedOfferedItemId}
              className="px-6 py-2.5 rounded-xl bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] text-xs font-bold shadow-xl transition disabled:opacity-40 flex items-center gap-2 border border-[#D4AF37]/40"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#FDE68A]" />
              {isSubmitting ? 'Sending Proposal...' : 'Send Swap Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
