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
  Home,
  ChevronDown,
  LogOut,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';

interface SellModuleViewProps {
  myListings: ClothingListing[];
  allSwaps: { incoming: SwapRequest[]; outgoing: SwapRequest[] };
  onOpenCreateListing: () => void;
  onEditItem: (item: ClothingListing) => void;
  onDeleteItem: (itemId: string) => void;
  onSelectItem: (item: ClothingListing) => void;
  onOpenChat: (swap: SwapRequest) => void;
  onBackToHome: () => void;
  onRefresh: () => void;
  initialSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

export const SellModuleView: React.FC<SellModuleViewProps> = ({
  myListings,
  allSwaps,
  onOpenCreateListing,
  onEditItem,
  onDeleteItem,
  onSelectItem,
  onOpenChat,
  onBackToHome,
  onRefresh,
  initialSubTab = 'dashboard',
  onSubTabChange
}) => {
  const { user, logout, switchDemoUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(initialSubTab);
  const [listingFilter, setListingFilter] = useState<'all' | 'available' | 'pending' | 'swapped'>('all');
  const [historyFilter, setHistoryFilter] = useState<string>('all');
  const [historySearch, setHistorySearch] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const setTab = (tab: string) => {
    setActiveTab(tab);
    if (onSubTabChange) onSubTabChange(tab);
  };

  const demoAccounts = [
    { name: 'Priya Sharma', city: 'Bengaluru', email: 'priya@example.com', role: 'user' },
    { name: 'Rahul Patil', city: 'Hubballi', email: 'rahul@example.com', role: 'user' },
    { name: 'Ananya Hegde', city: 'Mysuru', email: 'ananya@example.com', role: 'user' },
    { name: 'Karan Joshi', city: 'Pune', email: 'karan@example.com', role: 'user' },
    { name: 'ReWear Admin', city: 'Bengaluru', email: 'admin@rewear.org', role: 'admin' },
  ];

  // Incoming swap requests received for user's clothing
  const incomingRequests = allSwaps.incoming || [];
  const pendingIncomingCount = incomingRequests.filter((s) => s.status === 'pending').length;
  const activeSwapsCount = incomingRequests.filter((s) => s.status === 'accepted' || s.status === 'ready_for_exchange').length;
  const completedSwapsCount = incomingRequests.filter((s) => s.status === 'completed').length;
  const activeListingsCount = myListings.filter((i) => i.status === 'available').length;

  // Filtered listings
  const filteredListings = myListings.filter((item) => {
    if (listingFilter === 'all') return true;
    return item.status === listingFilter;
  });

  // Seller's all swaps for history
  const sellerSwapHistory = incomingRequests.filter((s) => {
    if (historyFilter !== 'all' && s.status !== historyFilter) return false;
    if (historySearch.trim()) {
      const q = historySearch.toLowerCase();
      const matchRequester = s.requesterName.toLowerCase().includes(q);
      const matchOffered = (s.offeredItemTitle || '').toLowerCase().includes(q);
      const matchTarget = (s.targetItemTitle || s.requestedItemTitle || '').toLowerCase().includes(q);
      return matchRequester || matchOffered || matchTarget;
    }
    return true;
  });

  // Handle Accept with verification
  const handleAcceptRequest = async (swap: SwapRequest) => {
    // Check if the target item is already swapped or in an active swap
    const targetItem = myListings.find(l => l.id === (swap.targetItemId || swap.requestedItemId));
    if (targetItem && targetItem.status === 'swapped') {
      alert('This garment has already been swapped.');
      return;
    }

    if (!window.confirm(`Accept barter proposal from ${swap.requesterName} for "${swap.targetItemTitle || swap.requestedItemTitle}"? This will reserve both garments for exchange.`)) {
      return;
    }

    setActionLoadingId(swap.id);
    try {
      await api.performSwapAction(swap.id, 'accept');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to accept swap proposal.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Reject
  const handleRejectRequest = async (swap: SwapRequest) => {
    if (!window.confirm(`Decline barter proposal from ${swap.requesterName}?`)) {
      return;
    }
    setActionLoadingId(swap.id);
    try {
      await api.performSwapAction(swap.id, 'reject');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to decline proposal.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F4] text-[#1F2421] font-sans">
      {/* 1. DEDICATED SELL MODULE HEADER */}
      <header className="sticky top-0 z-40 bg-[#F8F8F4]/95 backdrop-blur-md border-b border-[#E6E6DC]">
        {/* Module Indicator Banner */}
        <div className="bg-[#234C3A] text-white px-4 py-1.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-[#8CA58A]" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Sell Clothes Module</span>
            <span className="hidden sm:inline text-[#C5D9C4]">· Manage your wardrobe listings & incoming barter offers</span>
          </div>

          <div className="relative flex items-center gap-2">
            <span className="text-[#C1DEC9] text-[11px] hidden sm:inline">Active Persona:</span>
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="bg-[#173327] hover:bg-[#12271E] px-2 py-0.5 rounded text-[11px] text-white flex items-center gap-1 border border-[#3A5F4B]"
            >
              <span>{user?.name || 'Guest'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 top-7 w-60 bg-white text-gray-800 rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 text-xs">
                {demoAccounts.map((d) => (
                  <button
                    key={d.email}
                    onClick={() => {
                      switchDemoUser(d.email);
                      setShowDemoMenu(false);
                      onRefresh();
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#F8F8F4] flex items-center justify-between ${
                      user?.email === d.email ? 'font-bold text-[#234C3A] bg-[#EBF3ED]' : ''
                    }`}
                  >
                    <span>{d.name} ({d.city})</span>
                    {d.role === 'admin' && <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded">Admin</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sell Module Navigation Bar - Exactly: 1. Dashboard, 2. My Listings, 3. Requests Received, 4. Swap History, 5. How It Works, 6. Back to Home, 7. User Profile */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <div onClick={onBackToHome} className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-[#234C3A] flex items-center justify-center text-white">
                <Shirt className="w-4 h-4 text-[#8CA58A]" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-[#1F2421] block leading-none">ReWear</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#234C3A]">Seller Studio</span>
              </div>
            </div>

            {/* Desktop Navigation Links in exact order */}
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
              <button
                onClick={() => setTab('dashboard')}
                className={`px-3 py-2 rounded-xl transition ${
                  activeTab === 'dashboard'
                    ? 'bg-[#234C3A] text-white font-semibold shadow-xs'
                    : 'text-[#5E6B63] hover:text-[#1F2421] hover:bg-[#EAEAE0]'
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => setTab('listings')}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'listings'
                    ? 'bg-[#234C3A] text-white font-semibold shadow-xs'
                    : 'text-[#5E6B63] hover:text-[#1F2421] hover:bg-[#EAEAE0]'
                }`}
              >
                <span>My Listings</span>
                <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700">
                  {myListings.length}
                </span>
              </button>

              <button
                onClick={() => setTab('requests')}
                className={`px-3 py-2 rounded-xl transition relative flex items-center gap-1.5 ${
                  activeTab === 'requests'
                    ? 'bg-[#234C3A] text-white font-semibold shadow-xs'
                    : 'text-[#5E6B63] hover:text-[#1F2421] hover:bg-[#EAEAE0]'
                }`}
              >
                <span>Requests Received</span>
                {pendingIncomingCount > 0 && (
                  <span className="w-5 h-5 bg-[#C2410C] text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {pendingIncomingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setTab('history')}
                className={`px-3 py-2 rounded-xl transition ${
                  activeTab === 'history'
                    ? 'bg-[#234C3A] text-white font-semibold shadow-xs'
                    : 'text-[#5E6B63] hover:text-[#1F2421] hover:bg-[#EAEAE0]'
                }`}
              >
                Swap History
              </button>

              <button
                onClick={() => setTab('how-it-works')}
                className={`px-3 py-2 rounded-xl transition ${
                  activeTab === 'how-it-works'
                    ? 'bg-[#234C3A] text-white font-semibold shadow-xs'
                    : 'text-[#5E6B63] hover:text-[#1F2421] hover:bg-[#EAEAE0]'
                }`}
              >
                How It Works
              </button>

              <button
                onClick={onBackToHome}
                className="px-3 py-2 rounded-xl text-[#5E6B63] hover:text-[#1F2421] hover:bg-[#EAEAE0] transition flex items-center gap-1"
                title="Return to main ReWear landing page"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </nav>

            {/* Profile Menu */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenCreateListing}
                className="hidden sm:flex items-center gap-1.5 bg-[#234C3A] hover:bg-[#1A382B] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition"
              >
                <PlusCircle className="w-4 h-4 text-[#8CA58A]" />
                <span>+ List New Item</span>
              </button>

              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-1 rounded-xl border border-[#DCDCD0] hover:bg-white transition flex items-center gap-1.5"
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-7 h-7 rounded-lg object-cover"
                    />
                    <ChevronDown className="w-3 h-3 text-[#5E6B63]" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 text-xs">
                      <div className="px-3 py-1.5 border-b border-stone-100">
                        <p className="font-semibold text-stone-900">{user.name}</p>
                        <p className="text-[10px] text-stone-500">{user.city}</p>
                      </div>
                      <button
                        onClick={onBackToHome}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#F8F8F4] flex items-center gap-2 text-stone-700"
                      >
                        <Home className="w-3.5 h-3.5" />
                        <span>Back to Home</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                          onBackToHome();
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-rose-50 flex items-center gap-2 text-rose-700"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile sub navigation */}
          <div className="lg:hidden flex items-center justify-around py-2 border-t border-[#E6E6DC] text-xs font-medium text-[#5E6B63] overflow-x-auto">
            <button
              onClick={() => setTab('dashboard')}
              className={`px-2 py-1 rounded-lg ${activeTab === 'dashboard' ? 'bg-[#234C3A] text-white font-bold' : ''}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setTab('listings')}
              className={`px-2 py-1 rounded-lg ${activeTab === 'listings' ? 'bg-[#234C3A] text-white font-bold' : ''}`}
            >
              Listings ({myListings.length})
            </button>
            <button
              onClick={() => setTab('requests')}
              className={`px-2 py-1 rounded-lg relative ${activeTab === 'requests' ? 'bg-[#234C3A] text-white font-bold' : ''}`}
            >
              Requests
              {pendingIncomingCount > 0 && (
                <span className="ml-1 px-1 bg-[#C2410C] text-white text-[9px] rounded-full">
                  {pendingIncomingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab('history')}
              className={`px-2 py-1 rounded-lg ${activeTab === 'history' ? 'bg-[#234C3A] text-white font-bold' : ''}`}
            >
              History
            </button>
            <button
              onClick={() => setTab('how-it-works')}
              className={`px-2 py-1 rounded-lg ${activeTab === 'how-it-works' ? 'bg-[#234C3A] text-white font-bold' : ''}`}
            >
              Guide
            </button>
            <button
              onClick={onBackToHome}
              className="px-2 py-1 rounded-lg text-stone-600 hover:text-stone-900"
            >
              Home
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* SUB-PAGE 1: SELL DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#234C3A] to-[#1E3F30] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#C1DEC9]">
                  Seller Control Center
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF8F4]">
                  Welcome back, {user?.name || 'Seller'}!
                </h1>
                <p className="text-xs sm:text-sm text-[#D4E3D8] max-w-xl">
                  Manage your wardrobe listings, track incoming barter exchange proposals, and give your clothes a second life.
                </p>
              </div>

              <button
                onClick={onOpenCreateListing}
                className="bg-[#E7DEC8] hover:bg-[#DCD1B8] text-[#1A382B] font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 self-start md:self-auto"
              >
                <PlusCircle className="w-4 h-4 text-[#1A382B]" />
                <span>+ List a New Item</span>
              </button>
            </div>

            {/* Key Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div
                onClick={() => setTab('listings')}
                className="bg-white p-5 rounded-2xl border border-[#E6E6DC] shadow-xs cursor-pointer hover:border-[#234C3A] transition"
              >
                <div className="flex items-center justify-between text-xs text-[#5E6B63] font-medium">
                  <span>Active Listings</span>
                  <Shirt className="w-4 h-4 text-[#234C3A]" />
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1F2421] mt-2">
                  {activeListingsCount}
                </div>
                <div className="text-[11px] text-[#5E6B63] mt-1">{myListings.length} total garments in closet</div>
              </div>

              <div
                onClick={() => setTab('requests')}
                className="bg-white p-5 rounded-2xl border border-[#E6E6DC] shadow-xs cursor-pointer hover:border-amber-600 transition"
              >
                <div className="flex items-center justify-between text-xs text-[#5E6B63] font-medium">
                  <span>Pending Requests</span>
                  <Repeat className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-700 mt-2">
                  {pendingIncomingCount}
                </div>
                <div className="text-[11px] text-[#5E6B63] mt-1">Awaiting your decision</div>
              </div>

              <div
                onClick={() => setTab('history')}
                className="bg-white p-5 rounded-2xl border border-[#E6E6DC] shadow-xs cursor-pointer hover:border-[#42614B] transition"
              >
                <div className="flex items-center justify-between text-xs text-[#5E6B63] font-medium">
                  <span>Ongoing Swaps</span>
                  <Clock className="w-4 h-4 text-[#42614B]" />
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#42614B] mt-2">
                  {activeSwapsCount}
                </div>
                <div className="text-[11px] text-[#5E6B63] mt-1">In negotiation or delivery</div>
              </div>

              <div
                onClick={() => setTab('history')}
                className="bg-white p-5 rounded-2xl border border-[#E6E6DC] shadow-xs cursor-pointer hover:border-emerald-600 transition"
              >
                <div className="flex items-center justify-between text-xs text-[#5E6B63] font-medium">
                  <span>Completed Swaps</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 mt-2">
                  {completedSwapsCount}
                </div>
                <div className="text-[11px] text-[#5E6B63] mt-1">Successfully exchanged</div>
              </div>
            </div>

            {/* Recent Incoming Requests Preview */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E6E6DC] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#1F2421]">Recent Swap Requests Received</h2>
                  <p className="text-xs text-[#5E6B63]">Recent barter offers submitted by other members for your clothes</p>
                </div>
                <button
                  onClick={() => setTab('requests')}
                  className="text-xs font-semibold text-[#234C3A] hover:underline"
                >
                  View All ({incomingRequests.length})
                </button>
              </div>

              {incomingRequests.length === 0 ? (
                <div className="text-center py-8 text-xs text-[#5E6B63] bg-[#F8F8F4] rounded-2xl border border-dashed border-[#DCDCD0]">
                  No barter requests received yet. As soon as a user proposes a swap for your clothing, it will appear here.
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {incomingRequests.slice(0, 3).map((swap) => (
                    <div key={swap.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                          <img
                            src={swap.offeredItemImage}
                            alt={swap.offeredItemTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs space-y-0.5">
                          <p className="font-semibold text-stone-900">
                            <strong>{swap.requesterName}</strong> wants your <span className="text-[#234C3A]">"{swap.targetItemTitle || swap.requestedItemTitle}"</span>
                          </p>
                          <p className="text-stone-500 text-[11px]">
                            Offered: {swap.offeredItemTitle} (₹{swap.offeredItemValue || swap.offeredItemPrice || 1000}) · {new Date(swap.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            swap.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : swap.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {swap.status}
                        </span>

                        <button
                          onClick={() => setTab('requests')}
                          className="px-2.5 py-1 text-xs font-semibold bg-[#234C3A] text-white rounded-lg hover:bg-[#1A382B] transition"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Helpful Tips for Good Listings */}
            <div className="bg-[#FAF7F0] rounded-3xl p-6 sm:p-7 border border-[#E7DEC8] space-y-3">
              <div className="flex items-center gap-2 text-[#234C3A]">
                <HelpCircle className="w-5 h-5 text-[#234C3A]" />
                <h3 className="font-serif font-bold text-base text-[#1F2421]">Tips for High-Demand Clothing Listings</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#5E6B63]">
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block font-semibold">1. Natural Daytime Lighting</strong>
                  <p>Photograph garments hung against a clean, neutral background without harsh flash shadows.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block font-semibold">2. Accurate Fabric & Size</strong>
                  <p>Include chest, waist, and length measurements to eliminate guesswork for prospective swappers.</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1">
                  <strong className="text-stone-900 block font-semibold">3. Transparent Condition</strong>
                  <p>Clearly state whether an item is Brand New with tags, Gently Used, or has minor vintage wear.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB-PAGE 2: MY LISTINGS */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-serif font-bold text-[#1F2421]">My Clothing Listings</h1>
                <p className="text-xs text-[#5E6B63]">Manage your active garments, edit details, or publish new clothing for exchange</p>
              </div>

              <button
                onClick={onOpenCreateListing}
                className="bg-[#234C3A] hover:bg-[#1A382B] text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition flex items-center gap-2 self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4 text-[#8CA58A]" />
                <span>+ Add Clothing Item</span>
              </button>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#E6E6DC] w-fit text-xs font-medium">
              {(['all', 'available', 'pending', 'swapped'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setListingFilter(status)}
                  className={`px-3 py-1.5 rounded-xl capitalize transition ${
                    listingFilter === status
                      ? 'bg-[#234C3A] text-white font-bold shadow-xs'
                      : 'text-[#5E6B63] hover:text-[#1F2421]'
                  }`}
                >
                  {status} ({status === 'all' ? myListings.length : myListings.filter(l => l.status === status).length})
                </button>
              ))}
            </div>

            {/* Listings Grid */}
            {filteredListings.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-[#DCDCD0] space-y-3">
                <Shirt className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-serif font-bold text-stone-800 text-base">No clothing listings found</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {myListings.length === 0
                    ? "You haven't listed any garments from your wardrobe yet. Add your first item to start receiving barter proposals!"
                    : `No clothing items currently marked as "${listingFilter}".`}
                </p>
                <div className="pt-2">
                  <button
                    onClick={onOpenCreateListing}
                    className="bg-[#234C3A] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs"
                  >
                    + Add Your First Item
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((item) => {
                  const requestsCount = incomingRequests.filter(s => (s.targetItemId || s.requestedItemId) === item.id).length;
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-[#E6E6DC] overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div
                        onClick={() => onSelectItem(item)}
                        className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer group"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md text-white ${
                              item.status === 'available'
                                ? 'bg-emerald-700/90'
                                : item.status === 'pending'
                                ? 'bg-amber-600/90'
                                : 'bg-stone-700/90'
                            }`}
                          >
                            {item.status === 'available'
                              ? 'Available'
                              : item.status === 'pending'
                              ? 'Swap Pending'
                              : 'Swapped'}
                          </span>
                        </div>
                        <div className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                          Size: {item.size}
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-[#5E6B63]">
                            <span className="font-bold text-[#234C3A] uppercase">{item.brand}</span>
                            <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-[#234C3A]" /> {item.city}</span>
                          </div>
                          <h3
                            onClick={() => onSelectItem(item)}
                            className="font-serif font-bold text-sm text-[#1F2421] truncate mt-0.5 cursor-pointer hover:text-[#234C3A] transition"
                          >
                            {item.title}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between text-xs text-[#5E6B63] pt-1 border-t border-stone-100">
                          <span className="font-bold text-[#1F2421]">≈ ₹{item.estimatedValue} Swap Value</span>
                          <span className="text-[11px]">{item.condition}</span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-stone-500 bg-[#F8F8F4] p-2 rounded-xl">
                          <span>Swap Requests:</span>
                          <strong className="text-[#234C3A]">{requestsCount} received</strong>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                          <button
                            onClick={() => onEditItem(item)}
                            className="flex-1 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1 transition"
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
                            className="py-1.5 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1 transition"
                            title="Delete listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SUB-PAGE 3: REQUESTS RECEIVED */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#1F2421]">Incoming Swap Requests Received</h1>
              <p className="text-xs text-[#5E6B63]">Review clothing barter offers proposed by other members for your listed garments</p>
            </div>

            {incomingRequests.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-[#DCDCD0] space-y-3">
                <Repeat className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-serif font-bold text-stone-800 text-base">No barter requests received yet</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  When other users find your clothes and propose an item from their wardrobe in exchange, their requests will appear here for your review.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {incomingRequests.map((swap) => {
                  const targetItem = myListings.find(l => l.id === (swap.targetItemId || swap.requestedItemId));
                  return (
                    <div
                      key={swap.id}
                      className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E6E6DC] shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#EAF2EC] flex items-center justify-center text-[#234C3A] font-bold text-xs">
                            {swap.requesterName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 text-xs sm:text-sm">{swap.requesterName}</span>
                            <span className="text-[11px] text-stone-400 block">{swap.requesterCity} · Sent on {new Date(swap.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                              swap.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : swap.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : swap.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            Status: {swap.status}
                          </span>
                        </div>
                      </div>

                      {/* Barter Item Comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* What They Want */}
                        <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-white overflow-hidden shrink-0 border border-stone-200">
                            <img
                              src={swap.targetItemImage || swap.requestedItemImage}
                              alt={swap.targetItemTitle || swap.requestedItemTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-xs space-y-0.5">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block">They Want Your Garment:</span>
                            <h4 className="font-bold text-stone-900">{swap.targetItemTitle || swap.requestedItemTitle}</h4>
                            <span className="text-stone-500">Value ≈ ₹{swap.targetItemValue || swap.requestedItemValue || swap.requestedItemPrice || 1000}</span>
                          </div>
                        </div>

                        {/* What They Offer */}
                        <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-white overflow-hidden shrink-0 border border-emerald-200">
                            <img
                              src={swap.offeredItemImage}
                              alt={swap.offeredItemTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-xs space-y-0.5">
                            <span className="text-[10px] uppercase font-bold text-emerald-800 block">They Offer In Exchange:</span>
                            <h4 className="font-bold text-emerald-950">{swap.offeredItemTitle}</h4>
                            <span className="text-emerald-700">Value ≈ ₹{swap.offeredItemValue || swap.offeredItemPrice || 1000}</span>
                          </div>
                        </div>
                      </div>

                      {swap.proposalMessage && (
                        <p className="text-xs text-stone-600 italic bg-[#FAF7F0] p-3 rounded-xl border border-stone-200">
                          "{swap.proposalMessage}"
                        </p>
                      )}

                      {/* Functional Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenChat(swap)}
                            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Open Chat</span>
                          </button>
                        </div>

                        {swap.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRejectRequest(swap)}
                              disabled={actionLoadingId === swap.id}
                              className="px-3 py-1.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold flex items-center gap-1 transition"
                            >
                              <X className="w-3.5 h-3.5 text-rose-600" />
                              <span>Decline</span>
                            </button>

                            <button
                              onClick={() => handleAcceptRequest(swap)}
                              disabled={actionLoadingId === swap.id}
                              className="px-4 py-1.5 rounded-xl bg-[#234C3A] hover:bg-[#1A382B] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept Barter Swap</span>
                            </button>
                          </div>
                        )}

                        {swap.status === 'accepted' && (
                          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            Swap Accepted! Coordinate delivery via Chat.
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SUB-PAGE 4: SWAP HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-serif font-bold text-[#1F2421]">Seller Swap History</h1>
                <p className="text-xs text-[#5E6B63]">Complete audit log of pending, accepted, ongoing, and completed barter exchanges</p>
              </div>

              {/* Filters & Search */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by user or item..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-[#E6E6DC] bg-white text-xs text-stone-800 focus:outline-none focus:border-[#234C3A]"
                  />
                </div>

                <select
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-[#E6E6DC] bg-white text-xs text-stone-800 focus:outline-none focus:border-[#234C3A]"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted / Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected / Cancelled</option>
                </select>
              </div>
            </div>

            {sellerSwapHistory.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-[#DCDCD0] text-xs text-[#5E6B63]">
                No swap records match your current filters.
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#E6E6DC] overflow-hidden shadow-xs divide-y divide-stone-100">
                {sellerSwapHistory.map((s) => (
                  <div key={s.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        <img
                          src={s.targetItemImage || s.requestedItemImage}
                          alt="Garment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900">{s.targetItemTitle || s.requestedItemTitle}</h4>
                        <p className="text-stone-500 text-[11px]">
                          Partner: {s.requesterName} ({s.requesterCity}) · Offered: {s.offeredItemTitle}
                        </p>
                        <span className="text-[10px] text-stone-400">Date: {new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                          s.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : s.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {s.status}
                      </span>

                      <button
                        onClick={() => onOpenChat(s)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                        title="Chat history"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUB-PAGE 5: HOW IT WORKS (Seller Guide) */}
        {activeTab === 'how-it-works' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6E6DC] shadow-xs space-y-8">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#234C3A]">
                Seller Handbook
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F2421]">
                How Selling & Listing Works on ReWear
              </h1>
              <p className="text-xs sm:text-sm text-[#5E6B63] max-w-2xl">
                ReWear operates on a 100% cashless barter model. "Selling" your clothes means offering them into the circular pool to receive another garment in fair return.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Upload Clothes', desc: 'Snap photos of items you no longer wear. Input brand, size, and condition.' },
                { step: '2', title: 'Publish Listing', desc: 'Publish with our parity valuation helper to set fair barter expectations.' },
                { step: '3', title: 'Receive Offers', desc: 'Interested members propose an item from their wardrobe in exchange.' },
                { step: '4', title: 'Compare Garments', desc: 'Review the offered garment to ensure fair valuation parity.' },
                { step: '5', title: 'Negotiate in Chat', desc: 'Discuss fabric, fit, and local meetup or courier delivery in private chat.' },
                { step: '6', title: 'Accept Agreed Swap', desc: 'Confirm the trade to mark both items as pending and reserve them.' },
                { step: '7', title: 'Complete Exchange', desc: 'Hand over the garment in person or ship via courier.' },
                { step: '8', title: 'Confirm Receipt', desc: 'Both members click confirm. Swap is recorded as complete with zero cash!' },
              ].map((s) => (
                <div key={s.step} className="p-4 bg-[#F8F8F4] rounded-2xl border border-[#E6E6DC] space-y-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#234C3A] text-white flex items-center justify-center text-xs font-bold">
                    {s.step}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#1F2421] pt-1">{s.title}</h4>
                  <p className="text-xs text-[#5E6B63] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E7DEC8] text-xs text-[#5E6B63] space-y-1">
              <strong className="text-stone-900 block font-semibold">Important Barter Principle:</strong>
              <p>
                No financial transactions or online payments are ever accepted or charged on ReWear. Every swap is an equitable exchange of clothing value.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
