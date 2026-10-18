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
  MapPin,
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
      } catch (e: any) {
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
        message: message.trim() || undefined,
        handoverMethod,
        pickupLocation: pickupLocation.trim() || `${user?.city || 'Local Hub'} Central Landmark / Courier`,
        approxDeliveryDate
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit swap proposal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#FAF7F0] rounded-3xl shadow-2xl border border-[#E5DFD4] text-[#1E2922] p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D5] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1C3D2D] text-white flex items-center justify-center shadow-sm">
              <ArrowRightLeft className="w-5 h-5 text-[#8CE2A8]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-[#162D20]">
                Propose Item-for-Item Swap
              </h3>
              <p className="text-xs text-stone-500">
                Direct cashless barter exchange with {targetItem.userName} ({targetItem.city})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EFE9DC] hover:bg-[#E5DFD1] flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-stone-600" />
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Requested Item Banner (Cream Card) */}
          <div className="p-4 bg-[#F2EDE2] rounded-2xl border border-[#E0D7C5] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <img
                src={targetItem.imageUrl}
                alt={targetItem.title}
                className="w-16 h-18 rounded-xl object-cover border border-[#D5CBBA] shadow-xs shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1C3D2D] bg-[#E1EADF] px-2 py-0.5 rounded">
                  You are requesting
                </span>
                <h4 className="font-serif font-bold text-sm text-[#14261B] truncate mt-1">
                  {targetItem.title}
                </h4>
                <div className="text-xs text-stone-600 flex items-center gap-2 mt-0.5">
                  <span>{targetItem.brand}</span>
                  <span>•</span>
                  <span>Size {targetItem.size}</span>
                  <span>•</span>
                  <span className="font-bold text-[#1C3D2D]">≈ ₹{targetItem.estimatedValue}</span>
                </div>
              </div>
            </div>
            <div className="text-right shrink-0 hidden sm:block">
              <span className="text-[11px] text-stone-500 block">Owner</span>
              <span className="text-xs font-bold text-stone-800">{targetItem.userName}</span>
              <span className="text-[10px] text-stone-500 block">{targetItem.city}</span>
            </div>
          </div>

          {/* User's Offered Item Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Select an item from your wardrobe to offer:
              </label>
            </div>

            {isLoadingItems ? (
              <div className="p-8 text-center text-xs text-stone-400 animate-pulse bg-[#F4EFE6] rounded-2xl">
                Loading your wardrobe items...
              </div>
            ) : userItems.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#FFF9ED] border border-[#F2DEB0] text-center space-y-3">
                <Info className="w-8 h-8 text-amber-700 mx-auto" />
                <h4 className="font-serif font-bold text-sm text-amber-950">
                  No Available Wardrobe Items Found
                </h4>
                <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
                  ReWear is a 100% cashless clothing exchange platform where you trade clothes for clothes.
                  To propose a swap, please visit the <strong>Sell Clothes</strong> module to list an item from your closet!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCreateListing();
                  }}
                  className="px-5 py-2.5 bg-[#1C3D2D] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#142B20] transition inline-flex items-center gap-1.5"
                >
                  <Tag className="w-3.5 h-3.5 text-[#8CE2A8]" />
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
                          ? 'border-[#1C3D2D] bg-[#E7F0E9] shadow-sm ring-2 ring-[#1C3D2D]/30'
                          : 'border-[#E5DFD4] hover:border-stone-400 bg-[#FBF9F4]'
                      }`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-12 h-14 rounded-lg object-cover shrink-0 border border-[#D5CBBA]"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-stone-900 truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {item.size} • ≈ ₹{item.estimatedValue}
                        </div>
                        <div className="text-[10px] text-emerald-800 font-medium">
                          {item.condition}
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#1C3D2D] shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* APPROXIMATE SWAP DELIVERY / EXCHANGE DATE (User Request Requirement) */}
          <div className="p-4 bg-[#F2EDE2] rounded-2xl border border-[#DFD6C4] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#162D20] uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#1C3D2D]" />
                Approximate Swap / Delivery Date *
              </label>
              <span className="text-[11px] text-stone-500">Proposed Target Date</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-auto flex-1">
                <input
                  type="date"
                  required
                  min={minDate}
                  value={approxDeliveryDate}
                  onChange={(e) => setApproxDeliveryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-[#1C3D2D]"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setPresetDate(1)}
                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDate(3)}
                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200"
                >
                  In 3 Days
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDate(7)}
                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200"
                >
                  In 1 Week
                </button>
              </div>
            </div>

            <p className="text-[11px] text-stone-600">
              The owner will review this target date when accepting your proposal. You can coordinate final handoff timing in the encrypted chat thread.
            </p>
          </div>

          {/* Handover Preference (Local vs Courier) */}
          <div className="p-4 bg-[#F2EDE2] rounded-2xl border border-[#DFD6C4] space-y-3">
            <label className="text-xs font-bold text-[#162D20] uppercase tracking-wider block">
              Handover / Delivery Preference
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setHandoverMethod('local_meetup')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  handoverMethod === 'local_meetup'
                    ? 'border-[#1C3D2D] bg-[#E7F0E9] font-bold text-[#162D20]'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Users className="w-4 h-4 text-[#1C3D2D]" />
                <div>
                  <div className="text-xs">Local Public Meetup</div>
                  <div className="text-[10px] font-normal text-stone-500">Meet at landmark or metro</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setHandoverMethod('courier')}
                className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                  handoverMethod === 'courier'
                    ? 'border-[#1C3D2D] bg-[#E7F0E9] font-bold text-[#162D20]'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Truck className="w-4 h-4 text-[#1C3D2D]" />
                <div>
                  <div className="text-xs">Doorstep / Courier</div>
                  <div className="text-[10px] font-normal text-stone-500">Speed Post or Porter</div>
                </div>
              </button>
            </div>

            <input
              type="text"
              placeholder={handoverMethod === 'local_meetup' ? 'Preferred public spot (e.g. Metro Station Gate 2, Central Mall)' : 'Your city / delivery address pin code'}
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-xs text-stone-800 focus:ring-2 focus:ring-[#1C3D2D]"
            />
          </div>

          {/* Parity Comparison Meter */}
          {offeredItem && (
            <div className="p-4 bg-[#F2EDE2] rounded-2xl border border-[#DFD6C4] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                <span className="flex items-center gap-1 text-[#1C3D2D]">
                  <Sparkles className="w-3.5 h-3.5 text-[#1C3D2D]" />
                  Exchange Parity Analysis
                </span>
                <span className="text-[11px] font-semibold text-stone-500">
                  Value Gap: ₹{valueDifference}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-600">
                <span>Your offer: ₹{offeredItem.estimatedValue}</span>
                <span>Their item: ₹{targetItem.estimatedValue}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden flex">
                <div
                  className="bg-[#1C3D2D] h-full"
                  style={{ width: `${Math.min(100, Math.max(20, parityRatio * 50))}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-stone-600 italic">
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
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Personalized Note to {targetItem.userName}
            </label>
            <textarea
              rows={2}
              placeholder={`Hi ${targetItem.userName}! Would love to swap with your ${targetItem.title}. Looking forward to connecting!`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3D2D] text-xs sm:text-sm text-stone-800"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || userItems.length === 0 || !selectedOfferedItemId}
              className="px-6 py-2.5 rounded-xl bg-[#1C3D2D] hover:bg-[#142B20] text-white text-xs font-bold shadow-md transition disabled:opacity-40 flex items-center gap-2"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#8CE2A8]" />
              {isSubmitting ? 'Sending Proposal...' : 'Send Swap Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
