import React, { useState } from 'react';
import { SwapRequest } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import {
  ArrowRightLeft,
  MessageSquare,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Check,
  Truck,
  PackageCheck,
  Calendar
} from 'lucide-react';

interface SwapRequestsViewProps {
  incomingRequests: SwapRequest[];
  outgoingRequests: SwapRequest[];
  onOpenChat: (swap: SwapRequest) => void;
  onRefresh: () => void;
  onReportDispute: (swapId: string, title: string) => void;
}

export const SwapRequestsView: React.FC<SwapRequestsViewProps> = ({
  incomingRequests,
  outgoingRequests,
  onOpenChat,
  onRefresh,
  onReportDispute
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing' | 'completed'>('incoming');
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Delivery coordination modal state
  const [deliveryCoordSwap, setDeliveryCoordSwap] = useState<SwapRequest | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'local_meetup' | 'courier'>('local_meetup');
  const [pickupLoc, setPickupLoc] = useState('');
  const [courierRef, setCourierRef] = useState('');

  // Group completed swaps
  const allSwaps = [...incomingRequests, ...outgoingRequests];
  const uniqueSwapsMap = new Map<string, SwapRequest>();
  allSwaps.forEach(s => uniqueSwapsMap.set(s.id, s));
  const uniqueSwaps = Array.from(uniqueSwapsMap.values());

  const completedSwaps = uniqueSwaps.filter(s => s.status === 'completed');
  const activeIncoming = incomingRequests.filter(s => s.status !== 'completed');
  const activeOutgoing = outgoingRequests.filter(s => s.status !== 'completed');

  const handleAction = async (
    swapId: string,
    action: 'accept' | 'reject' | 'cancel' | 'confirm_completed' | 'ready_for_exchange' | 'update_delivery',
    details?: { handoverMethod?: string; pickupLocation?: string; courierTrackingRef?: string }
  ) => {
    setActionInProgressId(swapId);
    setError(null);
    try {
      await api.performSwapAction(swapId, action, details);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Action failed.');
    } finally {
      setActionInProgressId(null);
    }
  };

  const handleSaveDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryCoordSwap) return;
    await handleAction(deliveryCoordSwap.id, 'ready_for_exchange', {
      handoverMethod: deliveryMethod,
      pickupLocation: pickupLoc.trim() || undefined,
      courierTrackingRef: courierRef.trim() || undefined
    });
    setDeliveryCoordSwap(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FEF4D5] text-[#8A6A1C] border border-[#E8D494]">
            <Clock className="w-3 h-3" /> Pending Proposal
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#183E2A] text-[#FDE68A] border border-[#D4AF37]/40">
            <CheckCircle2 className="w-3 h-3 text-[#FDE68A]" /> Accepted • Coordinate Handover
          </span>
        );
      case 'ready_for_exchange':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#183E2A] text-[#FDE68A] border border-[#D4AF37]/40">
            <Truck className="w-3 h-3 text-[#FDE68A]" /> Delivery In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#183E2A] text-[#FDE68A] border border-[#D4AF37]/50">
            <Sparkles className="w-3 h-3 text-[#FDE68A]" /> Swap Completed
          </span>
        );
      default:
        return null;
    }
  };

  const currentList =
    activeTab === 'incoming'
      ? activeIncoming
      : activeTab === 'outgoing'
      ? activeOutgoing
      : completedSwaps;

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto text-[#FDF0CD]">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FDE68A]">
            Swap Requests & Negotiations
          </h2>
          <p className="text-xs text-[#E5D7B3] mt-1">
            Coordinate direct barter swaps, exchange garment photos, chat, and mutually verify handovers.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="self-start sm:self-auto text-xs font-bold text-[#1A2E22] bg-[#FFF9E6] hover:bg-[#FCEFC7] flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#EED895] transition shadow-md"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#8A6A1C]" />
          Refresh Requests
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-100 border border-rose-300 text-rose-800 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold">×</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D4AF37]/20 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'incoming'
              ? 'bg-[#FFF9E6] text-[#1A2E22] font-bold shadow-md border border-[#EED895]'
              : 'text-[#E5D7B3] hover:text-[#FDE68A] hover:bg-[#FFF9E6]/10'
          }`}
        >
          <span>Incoming Requests</span>
          <span className="w-5 h-5 rounded-full bg-[#183E2A] text-[#FDE68A] text-center leading-5 text-[10px] border border-[#D4AF37]/30">
            {activeIncoming.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'outgoing'
              ? 'bg-[#FFF9E6] text-[#1A2E22] font-bold shadow-md border border-[#EED895]'
              : 'text-[#E5D7B3] hover:text-[#FDE68A] hover:bg-[#FFF9E6]/10'
          }`}
        >
          <span>Outgoing Proposals</span>
          <span className="w-5 h-5 rounded-full bg-[#183E2A] text-[#FDE68A] text-center leading-5 text-[10px] border border-[#D4AF37]/30">
            {activeOutgoing.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'completed'
              ? 'bg-[#FFF9E6] text-[#1A2E22] font-bold shadow-md border border-[#EED895]'
              : 'text-[#E5D7B3] hover:text-[#FDE68A] hover:bg-[#FFF9E6]/10'
          }`}
        >
          <span>Completed Swaps</span>
          <span className="w-5 h-5 rounded-full bg-[#183E2A] text-[#FDE68A] text-center leading-5 text-[10px] border border-[#D4AF37]/30">
            {completedSwaps.length}
          </span>
        </button>
      </div>

      {/* Requests List */}
      {currentList.length === 0 ? (
        <div className="bg-[#FFF9E6] rounded-3xl border border-[#EED895] p-12 text-center max-w-md mx-auto space-y-3 shadow-lg text-[#1A2E22]">
          <div className="w-14 h-14 rounded-full bg-[#FEF4D5] text-[#8A6A1C] flex items-center justify-center mx-auto border border-[#E8D494]">
            <ArrowRightLeft className="w-6 h-6 opacity-70" />
          </div>
          <h4 className="text-base font-bold font-serif text-[#1A2E22]">
            No {activeTab} swap requests right now
          </h4>
          <p className="text-xs text-[#6B5B30]">
            {activeTab === 'incoming'
              ? 'When another member wants an item from your closet, their proposal will appear here.'
              : activeTab === 'outgoing'
              ? 'Browse the marketplace and propose an exchange for clothes you love!'
              : 'Once both parties confirm receipt of swapped garments, completed trades appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {currentList.map((swap) => {
            const isOwner = user?.id === swap.ownerId;
            const isRequester = user?.id === swap.requesterId;
            const isBusy = actionInProgressId === swap.id;

            const myConfirmed = isRequester
              ? swap.requesterConfirmedCompleted
              : swap.ownerConfirmedCompleted;

            const isExchangePhase = swap.status === 'accepted' || swap.status === 'ready_for_exchange';

            return (
              <div
                key={swap.id}
                className="bg-[#FFF9E6] rounded-3xl border border-[#EED895] p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] hover:shadow-2xl transition space-y-4 text-[#1A2E22]"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EED895]/60 text-xs">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(swap.status)}
                    <span className="text-[#8C7A58]">•</span>
                    <span className="text-[#6B5B30] font-medium">
                      {new Date(swap.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenChat(swap)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] font-bold text-xs flex items-center gap-1.5 transition border border-[#D4AF37]/30 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#FDE68A]" />
                      <span>Negotiation Chat</span>
                    </button>

                    <button
                      onClick={() => onReportDispute(swap.id, `Swap between ${swap.requestedItemTitle} & ${swap.offeredItemTitle}`)}
                      className="text-[#8C7A58] hover:text-rose-600 p-1"
                      title="Report issue with this swap"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Items Comparison Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Item 1: Requested Item */}
                  <div className="p-3.5 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] flex items-center gap-3">
                    <img
                      src={swap.requestedItemImage}
                      alt={swap.requestedItemTitle}
                      className="w-16 h-20 rounded-xl object-cover shrink-0 border border-[#E8D494]"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-[#7A6430] uppercase tracking-wider block">
                        {isOwner ? 'Your Item (Requested by swapper)' : 'Item You Want'}
                      </span>
                      <h4 className="font-serif font-bold text-[#1A2E22] text-sm truncate">
                        {swap.requestedItemTitle}
                      </h4>
                      <div className="text-xs text-[#8A6A1C] font-bold mt-0.5">
                        ≈ ₹{swap.requestedItemValue} Reference Value
                      </div>
                      <div className="text-[11px] text-[#6B5B30] flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-[#8A6A1C]" />
                        Owner: {swap.ownerName} ({swap.ownerCity})
                      </div>
                    </div>
                  </div>

                  {/* Item 2: Offered Item */}
                  <div className="p-3.5 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] flex items-center gap-3">
                    <img
                      src={swap.offeredItemImage}
                      alt={swap.offeredItemTitle}
                      className="w-16 h-20 rounded-xl object-cover shrink-0 border border-[#E8D494]"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-[#7A6430] uppercase tracking-wider block">
                        {isRequester ? 'Your Offered Item' : 'Item Offered in Return'}
                      </span>
                      <h4 className="font-serif font-bold text-[#1A2E22] text-sm truncate">
                        {swap.offeredItemTitle}
                      </h4>
                      <div className="text-xs text-[#8A6A1C] font-bold mt-0.5">
                        ≈ ₹{swap.offeredItemValue} Reference Value
                      </div>
                      <div className="text-[11px] text-[#6B5B30] flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-[#8A6A1C]" />
                        Offered by: {swap.requesterName} ({swap.requesterCity})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Approx Delivery / Exchange Date Row */}
                {swap.approxDeliveryDate && (
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#FEF4D5] border border-[#E8D494] text-xs text-[#1A2E22] font-semibold">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#8A6A1C] shrink-0" />
                      <span>
                        Approx. Swap Delivery / Exchange Date:{' '}
                        <strong className="text-[#1A2E22] underline font-bold">
                          {new Date(swap.approxDeliveryDate).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </strong>
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8A6A1C] bg-[#FFF9E6] px-2.5 py-0.5 rounded-lg border border-[#EED895] font-bold">
                      {swap.handoverMethod === 'courier' ? 'Courier Dispatch Target' : 'Local Meetup Target'}
                    </span>
                  </div>
                )}

                {/* Proposal Message Note */}
                {swap.message && (
                  <div className="bg-[#FEF4D5] p-3 rounded-2xl text-xs text-[#543D10] italic border border-[#E8D494]">
                    "{swap.message}"
                  </div>
                )}

                {/* Handover & Delivery Coordination Details */}
                {isExchangePhase && (
                  <div className="p-4 bg-[#FEF6DB] rounded-2xl border border-[#E8D494] text-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-[#8A6A1C]" />
                        <span className="font-bold text-[#1A2E22]">
                          Delivery Coordination: {swap.handoverMethod === 'courier' ? 'Independent Courier' : 'In-Person Local Meetup'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setDeliveryCoordSwap(swap);
                          setDeliveryMethod(swap.handoverMethod === 'courier' ? 'courier' : 'local_meetup');
                          setPickupLoc(swap.pickupLocation || '');
                          setCourierRef(swap.courierTrackingRef || '');
                        }}
                        className="text-xs font-bold text-[#8A6A1C] underline hover:text-[#543D10] self-start sm:self-auto"
                      >
                        {swap.pickupLocation || swap.courierTrackingRef ? 'Update Handoff Details' : '+ Set Handoff Location / Tracking'}
                      </button>
                    </div>

                    {swap.pickupLocation && (
                      <div className="flex items-center gap-1.5 text-[#1A2E22] bg-[#FFF9E6] p-2.5 rounded-xl border border-[#EED895]">
                        <MapPin className="w-3.5 h-3.5 text-[#8A6A1C] shrink-0" />
                        <span><strong>Agreed Location:</strong> {swap.pickupLocation}</span>
                      </div>
                    )}

                    {swap.courierTrackingRef && (
                      <div className="flex items-center gap-1.5 text-[#1A2E22] bg-[#FFF9E6] p-2.5 rounded-xl border border-[#EED895]">
                        <Truck className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                        <span><strong>Courier Tracking Ref:</strong> {swap.courierTrackingRef}</span>
                      </div>
                    )}

                    <div className="pt-1 border-t border-[#E8D494] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-[11px] text-[#6B5B30]">
                        Both swappers must click "Confirm Garment Received" after inspecting the item.
                      </span>

                      <div className="flex items-center gap-3">
                        <span className={`text-[11px] font-bold flex items-center gap-1 ${
                          swap.ownerConfirmedCompleted ? 'text-emerald-700' : 'text-[#8C7A58]'
                        }`}>
                          {swap.ownerConfirmedCompleted ? '✓' : '•'} {swap.ownerName}
                        </span>
                        <span className={`text-[11px] font-bold flex items-center gap-1 ${
                          swap.requesterConfirmedCompleted ? 'text-emerald-700' : 'text-[#8C7A58]'
                        }`}>
                          {swap.requesterConfirmedCompleted ? '✓' : '•'} {swap.requesterName}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-end gap-2 text-xs">
                  {/* Incoming Pending Actions */}
                  {isOwner && swap.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(swap.id, 'reject')}
                        disabled={isBusy}
                        className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold transition"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAction(swap.id, 'accept')}
                        disabled={isBusy}
                        className="px-5 py-2 rounded-xl bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] font-bold shadow-md transition flex items-center gap-1.5 border border-[#D4AF37]/40"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Accept Swap
                      </button>
                    </>
                  )}

                  {/* Outgoing Pending Actions */}
                  {isRequester && swap.status === 'pending' && (
                    <button
                      onClick={() => handleAction(swap.id, 'cancel')}
                      disabled={isBusy}
                      className="px-4 py-2 rounded-xl border border-[#EED895] bg-[#FEF4D5] text-[#1A2E22] hover:bg-[#FCEFC7] font-bold transition"
                    >
                      Withdraw Request
                    </button>
                  )}

                  {/* Accepted / Ready Phase */}
                  {isExchangePhase && (
                    <>
                      {!myConfirmed ? (
                        <button
                          onClick={() => handleAction(swap.id, 'confirm_completed')}
                          disabled={isBusy}
                          className="px-5 py-2.5 rounded-xl bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] font-bold shadow-md transition flex items-center gap-2 border border-[#D4AF37]/40"
                        >
                          <PackageCheck className="w-4 h-4 text-[#FDE68A]" />
                          Confirm I Received My Garment
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold bg-[#FEF4D5] px-3 py-1.5 rounded-xl border border-emerald-300">
                          <Check className="w-4 h-4 text-emerald-700" />
                          <span>You confirmed receipt. Awaiting {isRequester ? swap.ownerName : swap.requesterName}</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleAction(swap.id, 'cancel')}
                        disabled={isBusy}
                        className="px-3 py-2 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
                      >
                        Cancel Swap
                      </button>
                    </>
                  )}

                  {/* Completed Badge */}
                  {swap.status === 'completed' && (
                    <div className="flex items-center gap-1.5 text-xs text-[#FDE68A] font-bold bg-[#183E2A] px-3.5 py-1.5 rounded-xl border border-[#D4AF37]/40">
                      <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
                      <span>Successfully Exchanged & Completed!</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for setting Delivery / Meetup coordinates */}
      {deliveryCoordSwap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#FFF9E6] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#EED895] text-[#1A2E22] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EED895]/60">
              <h3 className="font-serif font-bold text-lg text-[#1A2E22]">
                Coordinate Garment Handover
              </h3>
              <button
                onClick={() => setDeliveryCoordSwap(null)}
                className="w-8 h-8 rounded-full bg-[#FEF4D5] hover:bg-[#FCEFC7] flex items-center justify-center font-bold text-[#8A6A1C] border border-[#E8D494]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDelivery} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#6B5B30] uppercase mb-1">
                  Handover Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('local_meetup')}
                    className={`p-2.5 rounded-xl border text-left font-bold ${
                      deliveryMethod === 'local_meetup'
                        ? 'border-[#8A6A1C] bg-[#FEF4D5] text-[#1A2E22]'
                        : 'border-[#EED895] bg-[#FFFDF5] text-[#6B5B30]'
                    }`}
                  >
                    <MapPin className="w-4 h-4 mb-1 text-[#8A6A1C]" />
                    In-Person Meetup
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('courier')}
                    className={`p-2.5 rounded-xl border text-left font-bold ${
                      deliveryMethod === 'courier'
                        ? 'border-[#8A6A1C] bg-[#FEF4D5] text-[#1A2E22]'
                        : 'border-[#EED895] bg-[#FFFDF5] text-[#6B5B30]'
                    }`}
                  >
                    <Truck className="w-4 h-4 mb-1 text-[#8A6A1C]" />
                    Independent Courier
                  </button>
                </div>
              </div>

              {deliveryMethod === 'local_meetup' ? (
                <div>
                  <label className="block font-bold text-[#6B5B30] uppercase mb-1">
                    Public Landmark Meeting Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Central Bus Stand Gate 2, Hubballi or Metro Station"
                    value={pickupLoc}
                    onChange={(e) => setPickupLoc(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-sm text-[#1A2E22] focus:outline-none focus:border-[#B89635]"
                  />
                  <p className="text-[10px] text-[#7A6430] mt-1">
                    For privacy, never provide home addresses. Meet in open daylight areas.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-[#6B5B30] uppercase mb-1">
                    Courier Reference / Tracking Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Speed Post #SP829103847IN or Porter Task"
                    value={courierRef}
                    onChange={(e) => setCourierRef(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-sm text-[#1A2E22] focus:outline-none focus:border-[#B89635]"
                  />
                  <p className="text-[10px] text-[#7A6430] mt-1">
                    Courier arrangements are handled directly by swappers without fees to ReWear.
                  </p>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryCoordSwap(null)}
                  className="px-4 py-2 rounded-xl border border-[#EED895] text-[#6B5B30] hover:bg-[#FEF4D5] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] font-bold border border-[#D4AF37]/40 shadow-md"
                >
                  Save & Notify Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
