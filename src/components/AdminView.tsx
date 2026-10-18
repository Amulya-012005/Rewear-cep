import React, { useState, useEffect } from 'react';
import { ClothingListing, Dispute, AdminStats, User, SwapRequest } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import {
  ShieldCheck,
  Trash2,
  AlertTriangle,
  Users,
  Shirt,
  Repeat,
  Leaf,
  CheckCircle2,
  RotateCcw,
  Clock,
  Layers,
  Sparkles,
  AlertCircle,
  Home,
  ArrowRight,
  MapPin,
  CheckCheck,
  Send,
  Inbox,
  Calendar,
  Truck
} from 'lucide-react';

interface AdminViewProps {
  onRefreshAll: () => void;
  onGoHome: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onRefreshAll, onGoHome }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [listings, setListings] = useState<ClothingListing[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [swaps, setSwaps] = useState<SwapRequest[]>([]);
  const [activeTab, setActiveTab] = useState<
    'listed-items' | 'who-sent-to-whom' | 'accepted-swaps' | 'successful-swaps' | 'disputes' | 'users'
  >('listed-items');
  const [isLoading, setIsLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, dispRes, listRes, usersRes, swapsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminDisputes(),
        api.getListings(),
        api.getDemoUsers(),
        api.getAdminSwaps()
      ]);
      setStats(statsRes);
      setDisputes(dispRes.disputes);
      setListings(listRes.listings);
      setUsers(usersRes.users);
      setSwaps(swapsRes.swaps || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load administrator data. Admin rights required.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    const interval = setInterval(() => {
      Promise.all([
        api.getAdminStats(),
        api.getListings(),
        api.getAdminSwaps()
      ]).then(([statsRes, listRes, swapsRes]) => {
        setStats(statsRes);
        setListings(listRes.listings);
        setSwaps(swapsRes.swaps || []);
      }).catch(() => {});
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAdminDeleteListing = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to remove listing "${title}" from the marketplace?`)) {
      return;
    }
    try {
      await api.adminDeleteListing(id);
      setActionMsg(`Listing "${title}" removed by administrator.`);
      fetchAdminData();
      onRefreshAll();
    } catch (err: any) {
      setError(err.message || 'Failed to delete listing.');
    }
  };

  const handleResolveDispute = async (id: string, status: string) => {
    try {
      await api.resolveDispute(id, status, 'Reviewed and resolved by platform administrator.');
      setActionMsg(`Dispute updated to ${status}.`);
      fetchAdminData();
    } catch (err: any) {
      setError(err.message || 'Failed to update dispute.');
    }
  };

  const handleResetDemoData = async () => {
    if (!window.confirm('Reset database to default seed listings and demo accounts?')) {
      return;
    }
    try {
      await api.adminResetDemo();
      setActionMsg('Database successfully reset to initial demo state!');
      fetchAdminData();
      onRefreshAll();
    } catch (err: any) {
      setError(err.message || 'Failed to reset demo data.');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 border border-rose-200 mt-8 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-stone-900">Administrator Access Restricted</h3>
        <p className="text-xs text-stone-600">
          Your current profile does not hold administrator permissions. To access this dashboard, switch to the
          <strong> ReWear Admin</strong> test profile from the active persona switcher.
        </p>
        <button
          onClick={onGoHome}
          className="px-4 py-2 bg-[#234C3A] text-white rounded-xl text-xs font-semibold hover:bg-[#1A382B] transition inline-flex items-center gap-1.5"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return to Home Dashboard</span>
        </button>
      </div>
    );
  }

  // Filtered swap lists
  const acceptedSwaps = swaps.filter((s) => s.status === 'accepted' || s.status === 'ready_for_exchange');
  const successfulSwaps = swaps.filter((s) => s.status === 'completed');

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* 1. Header with Home Navigation & Reset */}
      <div className="bg-[#1C3527] text-white p-6 sm:p-7 rounded-3xl shadow-lg border border-[#2D5A43] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={onGoHome}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#2A4E3B] hover:bg-[#346049] text-[#E7DEC8] text-xs font-semibold transition border border-[#44785E]"
            >
              <Home className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>← Back to Home</span>
            </button>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Admin Portal
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF8F4]">
            Admin Control Center & Moderation
          </h2>
          <p className="text-xs text-[#C5D9C4] mt-1">
            Manage listed items, monitor who sent swap requests to whom, verify accepted requests, and review completed swaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDemoData}
            className="px-3.5 py-2 bg-[#2A4E3B] hover:bg-[#346049] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-[#44785E] shadow-sm transition"
            title="Reset database to default seed listings and test accounts"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#E7DEC8]" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {actionMsg}
          </span>
          <button onClick={() => setActionMsg(null)} className="font-bold text-stone-500 hover:text-stone-800">×</button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            {error}
          </span>
          <button onClick={() => setError(null)} className="font-bold text-stone-500 hover:text-stone-800">×</button>
        </div>
      )}

      {/* 2. KPI Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E5DFD4] shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Cataloged Items</span>
            <div className="text-2xl font-serif font-bold text-stone-900 mt-1">{stats.totalListings}</div>
            <span className="text-[10px] text-emerald-700 font-medium">Garments across 28 states</span>
          </div>

          <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E5DFD4] shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">All Swap Requests</span>
            <div className="text-2xl font-serif font-bold text-stone-900 mt-1">{swaps.length}</div>
            <span className="text-[10px] text-stone-500">{swaps.filter(s => s.status === 'pending').length} pending approval</span>
          </div>

          <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E5DFD4] shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Accepted Swaps</span>
            <div className="text-2xl font-serif font-bold text-[#C5A059] mt-1">{acceptedSwaps.length}</div>
            <span className="text-[10px] text-stone-500">In handover / meetup</span>
          </div>

          <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E5DFD4] shadow-xs">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Successful Swaps</span>
            <div className="text-2xl font-serif font-bold text-emerald-800 mt-1">{successfulSwaps.length}</div>
            <span className="text-[10px] text-emerald-600 font-medium">Completed & verified</span>
          </div>
        </div>
      )}

      {/* 3. ADMIN NAVIGATION TABS */}
      {/* Required Tabs: Home, Listed Items, Who Sent to Whom Swaps Requests, Accepted Swap Requests, Successful Swap Request */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3 text-xs font-semibold">
        <button
          onClick={onGoHome}
          className="px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 text-stone-600 hover:text-[#234C3A] hover:bg-stone-100"
          title="Return to Main Landing Dashboard"
        >
          <Home className="w-4 h-4 text-[#234C3A]" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('listed-items')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'listed-items'
              ? 'bg-[#234C3A] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Shirt className="w-4 h-4" />
          <span>Listed Items ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('who-sent-to-whom')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'who-sent-to-whom'
              ? 'bg-[#234C3A] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span>Who Sent to Whom Swaps ({swaps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('accepted-swaps')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'accepted-swaps'
              ? 'bg-[#C5A059] text-stone-900 font-bold shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Accepted Swap Requests ({acceptedSwaps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('successful-swaps')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'successful-swaps'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <CheckCheck className="w-4 h-4" />
          <span>Successful Swap Requests ({successfulSwaps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'disputes'
              ? 'bg-stone-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Disputes ({disputes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-stone-800 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users ({users.length})</span>
        </button>
      </div>

      {/* 4. TAB CONTENTS */}

      {/* TAB A: LISTED ITEMS */}
      {activeTab === 'listed-items' && (
        <div className="bg-[#FAF7F0] rounded-3xl border border-[#E5DFD4] shadow-sm overflow-hidden">
          <div className="p-4 bg-[#F5F2EB] border-b border-[#ECE5D8] flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-stone-900">All Listed Clothes Across India</h3>
              <p className="text-[11px] text-stone-500">
                Audit clothes for quality, category compliance (garments only), and community safety.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-stone-200 text-stone-700 rounded-lg">
              {listings.length} Active Garments
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F4] text-stone-600 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Garment</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Owner & City</th>
                  <th className="py-3 px-4">Size & Cond.</th>
                  <th className="py-3 px-4">Est. Parity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {listings.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-10 h-12 rounded-lg object-cover shrink-0 border border-stone-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80';
                        }}
                      />
                      <div>
                        <div className="font-semibold text-stone-900 line-clamp-1">{item.title}</div>
                        <div className="text-[10px] text-stone-400">ID: {item.id}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-stone-800">{item.userName}</div>
                      <div className="text-[10px] text-stone-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {item.city}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{item.size}</div>
                      <div className="text-[10px] text-stone-400 capitalize">{item.condition}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900">
                      ₹{item.estimatedValue}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'available'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleAdminDeleteListing(item.id, item.title)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Remove listing permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB B: WHO SENT TO WHOM SWAPS REQUESTS */}
      {activeTab === 'who-sent-to-whom' && (
        <div className="space-y-4">
          <div className="bg-[#FAF8F4] p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-stone-900">All Swap Requests: Who Sent to Whom</h3>
              <p className="text-[11px] text-stone-500">
                Track full two-party swap history showing sender (requester) and recipient (owner), offered item, and requested garment.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#234C3A] text-white rounded-lg">
              {swaps.length} Total Requests
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {swaps.map((swap) => {
              const reqItem = listings.find((l) => l.id === swap.requestedItemId);
              const offItem = listings.find((l) => l.id === swap.offeredItemId);

              return (
                <div
                  key={swap.id}
                  className="bg-[#FAF7F0] rounded-2xl border border-[#E5DFD4] p-5 shadow-xs hover:border-[#234C3A] transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ECE5D8] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-stone-500">Swap ID: {swap.id}</span>
                      <span className="text-stone-300">•</span>
                      <span className="text-[11px] text-stone-500">
                        Date: {new Date(swap.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        swap.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : swap.status === 'accepted' || swap.status === 'ready_for_exchange'
                          ? 'bg-amber-100 text-amber-800'
                          : swap.status === 'pending'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      Status: {swap.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Flow: Sender -> Receiver */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* SENDER (WHO SENT) */}
                    <div className="bg-[#F5F2EB] p-4 rounded-xl border border-[#ECE5D8]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                          <Send className="w-3 h-3 text-[#234C3A]" />
                          Sender (Requester)
                        </span>
                        <span className="text-xs font-bold text-[#234C3A]">{swap.requesterName}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 mb-3 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {swap.requesterCity || 'Registered City'}
                      </div>

                      {/* Offered Garment */}
                      <div className="flex items-center gap-3 bg-[#FAF7F0] p-2.5 rounded-lg border border-[#E5DFD4]">
                        {offItem?.imageUrl ? (
                          <img
                            src={offItem.imageUrl}
                            alt={offItem.title}
                            className="w-12 h-14 rounded object-cover border border-stone-200"
                          />
                        ) : (
                          <div className="w-12 h-14 rounded bg-stone-100 flex items-center justify-center">
                            <Shirt className="w-6 h-6 text-stone-400" />
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase font-semibold">Offered Garment</span>
                          <div className="text-xs font-bold text-stone-900 line-clamp-1">{offItem?.title || `Item #${swap.offeredItemId}`}</div>
                          <div className="text-[11px] text-[#234C3A] font-semibold">
                            Est. Parity: ₹{offItem?.estimatedValue || '—'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RECEIVER (TO WHOM) */}
                    <div className="bg-[#F5F2EB] p-4 rounded-xl border border-[#ECE5D8]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                          <Inbox className="w-3 h-3 text-[#C5A059]" />
                          Recipient (Owner)
                        </span>
                        <span className="text-xs font-bold text-[#1C3527]">{swap.ownerName}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 mb-3 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {swap.ownerCity || 'Owner City'}
                      </div>

                      {/* Requested Garment */}
                      <div className="flex items-center gap-3 bg-[#FAF7F0] p-2.5 rounded-lg border border-[#E5DFD4]">
                        {reqItem?.imageUrl ? (
                          <img
                            src={reqItem.imageUrl}
                            alt={reqItem.title}
                            className="w-12 h-14 rounded object-cover border border-stone-200"
                          />
                        ) : (
                          <div className="w-12 h-14 rounded bg-stone-100 flex items-center justify-center">
                            <Shirt className="w-6 h-6 text-stone-400" />
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] text-stone-400 uppercase font-semibold">Requested Garment</span>
                          <div className="text-xs font-bold text-stone-900 line-clamp-1">{reqItem?.title || `Item #${swap.requestedItemId}`}</div>
                          <div className="text-[11px] text-[#234C3A] font-semibold">
                            Est. Parity: ₹{reqItem?.estimatedValue || '—'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Approx Delivery / Exchange Date Row */}
                  {swap.approxDeliveryDate && (
                    <div className="mt-3 flex items-center justify-between gap-2 text-xs bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 text-amber-900 font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>Approx. Delivery / Exchange Date: <strong>{new Date(swap.approxDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></span>
                      </div>
                      <span className="text-[11px] text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300">
                        {swap.handoverMethod === 'courier' ? 'Courier Delivery' : 'Public Landmark Meetup'}
                      </span>
                    </div>
                  )}

                  {/* Handover & Delivery Details */}
                  {swap.pickupLocation && (
                    <div className="mt-2 text-xs bg-[#F5F2EB] p-2.5 rounded-xl border border-[#ECE5D8] text-stone-700 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#234C3A] shrink-0" />
                      <span>Meetup Landmark / Delivery Note: <strong>{swap.pickupLocation}</strong></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB C: ACCEPTED SWAP REQUESTS */}
      {activeTab === 'accepted-swaps' && (
        <div className="space-y-4">
          <div className="bg-[#FAF8F4] p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Accepted Swap Requests</h3>
              <p className="text-[11px] text-stone-500">
                Swaps where the garment owner has agreed to exchange. Participants are currently coordinating pickup or courier shipment.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#C5A059] text-stone-900 rounded-lg">
              {acceptedSwaps.length} In Progress
            </span>
          </div>

          {acceptedSwaps.length === 0 ? (
            <div className="bg-[#FAF7F0] rounded-2xl p-8 text-center text-xs text-stone-500 border border-[#E5DFD4]">
              No accepted swaps in progress at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {acceptedSwaps.map((swap) => {
                const reqItem = listings.find((l) => l.id === swap.requestedItemId);
                const offItem = listings.find((l) => l.id === swap.offeredItemId);

                return (
                  <div key={swap.id} className="bg-[#FAF7F0] rounded-2xl border border-amber-200 p-5 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECE5D8] pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                          Agreement Accepted
                        </span>
                        <span className="text-xs font-medium text-stone-700">
                          {swap.requesterName} ↔ {swap.ownerName}
                        </span>
                      </div>
                      <span className="text-xs text-stone-500">
                        {new Date(swap.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={offItem?.imageUrl || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80'}
                          alt={offItem?.title}
                          className="w-12 h-14 rounded-lg object-cover border border-stone-200"
                        />
                        <div>
                          <div className="text-[10px] text-stone-400 uppercase">Offered by {swap.requesterName}</div>
                          <div className="text-xs font-bold text-stone-900">{offItem?.title || 'Garment'}</div>
                          <div className="text-[11px] text-stone-500">{swap.requesterCity}</div>
                        </div>
                      </div>

                      <ArrowRight className="w-5 h-5 text-amber-600 shrink-0 hidden sm:block" />

                      <div className="flex items-center gap-3">
                        <img
                          src={reqItem?.imageUrl || 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=300&q=80'}
                          alt={reqItem?.title}
                          className="w-12 h-14 rounded-lg object-cover border border-stone-200"
                        />
                        <div>
                          <div className="text-[10px] text-stone-400 uppercase">Requested from {swap.ownerName}</div>
                          <div className="text-xs font-bold text-stone-900">{reqItem?.title || 'Garment'}</div>
                          <div className="text-[11px] text-stone-500">{swap.ownerCity}</div>
                        </div>
                      </div>
                    </div>

                    {swap.approxDeliveryDate && (
                      <div className="mt-3 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                          <span>Approx. Delivery / Exchange Date: <strong>{new Date(swap.approxDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></span>
                        </div>
                        <span className="text-[10px] bg-amber-100 px-2 py-0.5 rounded text-amber-800">
                          {swap.handoverMethod === 'courier' ? 'Courier Dispatch' : 'Local Meetup'}
                        </span>
                      </div>
                    )}

                    {swap.pickupLocation && (
                      <div className="mt-2 p-2 bg-[#F5F2EB] border border-[#ECE5D8] rounded-lg text-xs text-stone-800 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>Agreed Exchange Location: <strong>{swap.pickupLocation}</strong></span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB D: SUCCESSFUL SWAP REQUESTS */}
      {activeTab === 'successful-swaps' && (
        <div className="space-y-4">
          <div className="bg-[#F5F2EB] p-4 rounded-2xl border border-[#ECE5D8] flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Successful & Completed Swap Requests</h3>
              <p className="text-[11px] text-stone-500">
                Exchanges verified and completed by both swappers. Zero cash spent, textile diverted from landfill!
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-800 text-white rounded-lg">
              {successfulSwaps.length} Verified Complete
            </span>
          </div>

          {successfulSwaps.length === 0 ? (
            <div className="bg-[#FAF7F0] rounded-2xl p-8 text-center text-xs text-stone-500 border border-[#E5DFD4]">
              No completed swaps recorded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {successfulSwaps.map((swap) => {
                const reqItem = listings.find((l) => l.id === swap.requestedItemId);
                const offItem = listings.find((l) => l.id === swap.offeredItemId);

                return (
                  <div key={swap.id} className="bg-[#FAF7F0] rounded-2xl border border-emerald-200 p-5 shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECE5D8] pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase flex items-center gap-1">
                          <CheckCheck className="w-3 h-3 text-emerald-700" />
                          Successful Exchange
                        </span>
                        <span className="text-xs font-semibold text-stone-800">
                          {swap.requesterName} ({swap.requesterCity}) ↔ {swap.ownerName} ({swap.ownerCity})
                        </span>
                      </div>
                      <span className="text-xs text-stone-500 font-mono">
                        {new Date(swap.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                        <img
                          src={offItem?.imageUrl || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80'}
                          alt={offItem?.title}
                          className="w-12 h-14 rounded-lg object-cover border border-emerald-200"
                        />
                        <div>
                          <div className="text-[10px] text-emerald-800 font-medium">From {swap.requesterName}</div>
                          <div className="text-xs font-bold text-stone-900">{offItem?.title || 'Garment'}</div>
                          <div className="text-[11px] text-emerald-700 font-semibold">Parity: ₹{offItem?.estimatedValue || '—'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                        <img
                          src={reqItem?.imageUrl || 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=300&q=80'}
                          alt={reqItem?.title}
                          className="w-12 h-14 rounded-lg object-cover border border-emerald-200"
                        />
                        <div>
                          <div className="text-[10px] text-emerald-800 font-medium">From {swap.ownerName}</div>
                          <div className="text-xs font-bold text-stone-900">{reqItem?.title || 'Garment'}</div>
                          <div className="text-[11px] text-emerald-700 font-semibold">Parity: ₹{reqItem?.estimatedValue || '—'}</div>
                        </div>
                      </div>
                    </div>

                    {swap.approxDeliveryDate && (
                      <div className="mt-3 p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>Delivered / Exchanged Date: <strong>{new Date(swap.approxDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></span>
                        </div>
                        <span className="text-[10px] bg-emerald-100 px-2 py-0.5 rounded text-emerald-800">
                          {swap.handoverMethod === 'courier' ? 'Courier Dispatch' : 'Local Meetup'}
                        </span>
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                      <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                        <Leaf className="w-3.5 h-3.5" />
                        Approx. 15 kg CO2 diverted and 2,700L water saved
                      </span>
                      <span>100% Cashless Barter Verified</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB E: DISPUTES */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          <div className="bg-[#F5F2EB] p-4 rounded-2xl border border-[#ECE5D8]">
            <h3 className="text-sm font-bold text-stone-900">Reported Disputes & Safety Flags</h3>
            <p className="text-[11px] text-stone-500">
              Arbitrate concerns regarding garment quality mismatch, unresponsive swappers, or missed meetups.
            </p>
          </div>

          {disputes.length === 0 ? (
            <div className="bg-[#FAF7F0] rounded-2xl p-8 text-center text-xs text-stone-500 border border-[#E5DFD4]">
              No open disputes reported! The community is running smoothly.
            </div>
          ) : (
            <div className="space-y-3">
              {disputes.map((d) => (
                <div key={d.id} className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E5DFD4] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {d.status}
                      </span>
                      <span className="text-xs font-semibold text-stone-800">Report by {d.reportedByName}</span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 font-medium">"{d.reason}"</p>
                    <span className="text-[10px] text-stone-400">Swap ID: {d.swapId}</span>
                  </div>

                  {d.status === 'open' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleResolveDispute(d.id, 'resolved')}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition"
                      >
                        Mark Resolved
                      </button>
                      <button
                        onClick={() => handleResolveDispute(d.id, 'dismissed')}
                        className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs font-semibold transition"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB F: USERS */}
      {activeTab === 'users' && (
        <div className="bg-[#FAF7F0] rounded-3xl border border-[#E5DFD4] shadow-sm overflow-hidden">
          <div className="p-4 bg-[#F5F2EB] border-b border-[#ECE5D8]">
            <h3 className="text-sm font-bold text-stone-900">Registered Swappers</h3>
            <p className="text-[11px] text-stone-500">Member profiles across Indian cities.</p>
          </div>
          <div className="divide-y divide-stone-100 text-xs">
            {users.map((u) => (
              <div key={u.id} className="p-4 flex items-center justify-between hover:bg-stone-50">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatarUrl}
                    alt={u.name}
                    className="w-10 h-10 rounded-xl object-cover border border-stone-200"
                  />
                  <div>
                    <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                      <span>{u.name}</span>
                      {u.role === 'admin' && (
                        <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded font-bold">Admin</span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-400">{u.city} • {u.email}</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-stone-400">ID: {u.id}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
