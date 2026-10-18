import React, { useState } from 'react';
import { SwapRequest } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import {
  ArrowRightLeft,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Check,
  Truck,
  PackageCheck,
  ChevronRight,
  Info,
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
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3 h-3" /> Pending Proposal
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Accepted • Coordinate Handover
          </span>
        );
      case 'ready_for_exchange':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            <Truck className="w-3 h-3 text-blue-600" /> Ready for Exchange
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3" /> Declined
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
            Cancelled
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#234533] text-white">
            <Sparkles className="w-3 h-3 text-[#A0E2B7]" /> Swap Completed
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
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C3326]">
            Swap Requests & Negotiations
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Coordinate direct barter swaps, exchange garment photos, chat, and mutually verify handovers.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="self-start sm:self-auto text-xs font-semibold text-[#234533] hover:text-[#183124] flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C9DFC3] bg-[#EBF3ED] transition"
        >
          <RotateCcw className="w-3 h-3" />
          Refresh Requests
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold">×</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5DFD4] pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'incoming'
              ? 'bg-[#234533] text-white shadow-sm'
              : 'text-stone-600 hover:bg-[#F2ECE1]'
          }`}
        >
          <span>Incoming Requests</span>
          <span className="w-5 h-5 rounded-full bg-white/20 text-center leading-5 text-[10px]">
            {activeIncoming.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'outgoing'
              ? 'bg-[#234533] text-white shadow-sm'
              : 'text-stone-600 hover:bg-[#F2ECE1]'
          }`}
        >
          <span>Outgoing Proposals</span>
          <span className="w-5 h-5 rounded-full bg-white/20 text-center leading-5 text-[10px]">
            {activeOutgoing.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'completed'
              ? 'bg-[#234533] text-white shadow-sm'
              : 'text-stone-600 hover:bg-[#F2ECE1]'
          }`}
        >
          <span>Completed Swaps</span>
          <span className="w-5 h-5 rounded-full bg-white/20 text-center leading-5 text-[10px]">
            {completedSwaps.length}
          </span>
        </button>
      </div>

      {/* Requests List */}
      {currentList.length === 0 ? (
        <div className="bg-[#FAF7F0] rounded-3xl border border-dashed border-[#D5CDC0] p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#F4EFE6] text-[#2C573F] flex items-center justify-center mx-auto">
            <ArrowRightLeft className="w-6 h-6 opacity-60" />
          </div>
          <h4 className="text-base font-bold font-serif text-[#1C3326]">
            No {activeTab} swap requests right now
          </h4>
          <p className="text-xs text-stone-500">
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
            const otherConfirmed = isRequester
              ? swap.ownerConfirmedCompleted
              : swap.requesterConfirmedCompleted;

            const isExchangePhase = swap.status === 'accepted' || swap.status === 'ready_for_exchange';

            return (
              <div
                key={swap.id}
                className="bg-[#FAF7F0] rounded-3xl border border-[#E5DFD4] p-5 sm:p-6 shadow-sm hover:shadow transition-shadow space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#F0EBE0] text-xs">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(swap.status)}
                    <span className="text-stone-400">•</span>
                    <span className="text-stone-500">
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
                      className="px-3 py-1.5 rounded-xl bg-[#EBF3ED] hover:bg-[#D9EADB] text-[#234533] font-semibold text-xs flex items-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#2C573F]" />
                      <span>Negotiation Chat</span>
                    </button>

                    <button
                      onClick={() => onReportDispute(swap.id, `Swap between ${swap.requestedItemTitle} & ${swap.offeredItemTitle}`)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="Report issue with this swap"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Items Comparison Display */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* Item 1: Requested Item */}
                  <div className="p-3.5 bg-[#F5F2EB] rounded-2xl border border-[#ECE5D8] flex items-center gap-3">
                    <img
                      src={swap.requestedItemImage}
                      alt={swap.requestedItemTitle}
                      className="w-16 h-20 rounded-xl object-cover shrink-0 border border-stone-200"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        {isOwner ? 'Your Item (Requested by swapper)' : 'Item You Want'}
                      </span>
                      <h4 className="font-serif font-bold text-stone-900 text-sm truncate">
                        {swap.requestedItemTitle}
                      </h4>
                      <div className="text-xs text-[#245037] font-semibold mt-0.5">
                        ≈ ₹{swap.requestedItemValue} Reference Value
                      </div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-[#2B5E43]" />
                        Owner: {swap.ownerName} ({swap.ownerCity})
                      </div>
                    </div>
                  </div>

                  {/* Item 2: Offered Item */}
                  <div className="p-3.5 bg-[#F5F2EB] rounded-2xl border border-[#ECE5D8] flex items-center gap-3">
                    <img
                      src={swap.offeredItemImage}
                      alt={swap.offeredItemTitle}
                      className="w-16 h-20 rounded-xl object-cover shrink-0 border border-stone-200"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                        {isRequester ? 'Your Offered Item' : 'Item Offered in Return'}
                      </span>
                      <h4 className="font-serif font-bold text-stone-900 text-sm truncate">
                        {swap.offeredItemTitle}
                      </h4>
                      <div className="text-xs text-[#245037] font-semibold mt-0.5">
                        ≈ ₹{swap.offeredItemValue} Reference Value
                      </div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-[#2B5E43]" />
                        Offered by: {swap.requesterName} ({swap.requesterCity})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Approx Delivery / Exchange Date Row */}
                {swap.approxDeliveryDate && (
                  <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>
                        Approx. Swap Delivery / Exchange Date:{' '}
                        <strong className="text-amber-900 underline font-bold">
                          {new Date(swap.approxDeliveryDate).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </strong>
                      </span>
                    </div>
                    <span className="text-[11px] text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300">
                      {swap.handoverMethod === 'courier' ? 'Courier Dispatch Target' : 'Local Meetup Target'}
                    </span>
                  </div>
                )}

                {/* Proposal Message Note */}
                {swap.message && (
                  <div className="bg-[#F5F2EB] p-3 rounded-2xl text-xs text-stone-700 italic border border-[#ECE5D8]">
                    "{swap.message}"
                  </div>
                )}

                {/* Handover & Delivery Coordination Details (for accepted & ready_for_exchange) */}
                {isExchangePhase && (
                  <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-emerald-700" />
                        <span className="font-bold text-emerald-950">
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
                        className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-950 self-start sm:self-auto"
                      >
                        {swap.pickupLocation || swap.courierTrackingRef ? 'Update Handoff Details' : '+ Set Handoff Location / Tracking'}
                      </button>
                    </div>

                    {swap.pickupLocation && (
                      <div className="flex items-center gap-1.5 text-stone-700 bg-[#FAF7F0] p-2.5 rounded-xl border border-emerald-200">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span><strong>Agreed Location:</strong> {swap.pickupLocation}</span>
                      </div>
                    )}

                    {swap.courierTrackingRef && (
                      <div className="flex items-center gap-1.5 text-stone-700 bg-[#FAF7F0] p-2.5 rounded-xl border border-emerald-200">
                        <Truck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span><strong>Courier Tracking Ref:</strong> {swap.courierTrackingRef}</span>
                      </div>
                    )}

                    <div className="pt-1 border-t border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-[11px] text-emerald-800">
                        Both swappers must click "Confirm Garment Received" after inspecting the item.
                      </span>

                      <div className="flex items-center gap-3">
                        <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                          swap.ownerConfirmedCompleted ? 'text-emerald-700' : 'text-stone-400'
                        }`}>
                          {swap.ownerConfirmedCompleted ? '✓' : '•'} {swap.ownerName}
                        </span>
                        <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                          swap.requesterConfirmedCompleted ? 'text-emerald-700' : 'text-stone-400'
                        }`}>
                          {swap.requesterConfirmedCompleted ? '✓' : '•'} {swap.requesterName}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons depending on user role and swap state */}
                <div className="pt-2 flex flex-wrap items-center justify-end gap-2 text-xs">
                  {/* Incoming Pending Actions (for owner) */}
                  {isOwner && swap.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(swap.id, 'reject')}
                        disabled={isBusy}
                        className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 font-semibold transition"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleAction(swap.id, 'accept')}
                        disabled={isBusy}
                        className="px-5 py-2 rounded-xl bg-[#234533] hover:bg-[#1A3426] text-white font-bold shadow transition flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Accept Swap
                      </button>
                    </>
                  )}

                  {/* Outgoing Pending Actions (for requester) */}
                  {isRequester && swap.status === 'pending' && (
                    <button
                      onClick={() => handleAction(swap.id, 'cancel')}
                      disabled={isBusy}
                      className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 font-semibold transition"
                    >
                      Withdraw Request
                    </button>
                  )}

                  {/* Accepted / Ready Phase: Handover & Completion */}
                  {isExchangePhase && (
                    <>
                      {!myConfirmed ? (
                        <button
                          onClick={() => handleAction(swap.id, 'confirm_completed')}
                          disabled={isBusy}
                          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow transition flex items-center gap-2"
                        >
                          <PackageCheck className="w-4 h-4 text-emerald-300" />
                          Confirm I Received My Garment
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-800 font-semibold bg-emerald-100 px-3 py-1.5 rounded-xl">
                          <Check className="w-4 h-4 text-emerald-700" />
                          <span>You confirmed receipt. Awaiting {isRequester ? swap.ownerName : swap.requesterName}</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleAction(swap.id, 'cancel')}
                        disabled={isBusy}
                        className="px-3 py-2 rounded-xl border border-stone-200 text-stone-400 hover:text-stone-600 text-xs"
                      >
                        Cancel Swap
                      </button>
                    </>
                  )}

                  {/* Completed Badge */}
                  {swap.status === 'completed' && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FAF7F0] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#E5DFD4] text-stone-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Coordinate Garment Handover
              </h3>
              <button
                onClick={() => setDeliveryCoordSwap(null)}
                className="text-stone-400 hover:text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDelivery} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Handover Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('local_meetup')}
                    className={`p-2.5 rounded-xl border text-left font-semibold ${
                      deliveryMethod === 'local_meetup'
                        ? 'border-[#234533] bg-[#EBF3ED] text-[#234533]'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    <MapPin className="w-4 h-4 mb-1" />
                    In-Person Meetup
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('courier')}
                    className={`p-2.5 rounded-xl border text-left font-semibold ${
                      deliveryMethod === 'courier'
                        ? 'border-[#234533] bg-[#EBF3ED] text-[#234533]'
                        : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    <Truck className="w-4 h-4 mb-1" />
                    Independent Courier
                  </button>
                </div>
              </div>

              {deliveryMethod === 'local_meetup' ? (
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Public Landmark Meeting Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Central Bus Stand Gate 2, Hubballi or Metro Station"
                    value={pickupLoc}
                    onChange={(e) => setPickupLoc(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#2C573F]"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    For privacy, never provide home addresses. Meet in open daylight areas.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block font-bold text-stone-700 uppercase mb-1">
                    Courier Reference / Tracking Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Speed Post #SP829103847IN or Porter Task"
                    value={courierRef}
                    onChange={(e) => setCourierRef(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#2C573F]"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Courier arrangements are handled directly by swappers without fees to ReWear.
                  </p>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryCoordSwap(null)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#234533] hover:bg-[#1A3426] text-white font-bold"
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
