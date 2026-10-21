import React, { useState, useMemo } from 'react';
import { ClothingListing, SwapRequest } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { INDIAN_STATE_CAPITALS } from '../data/indiaLocations.ts';
import {
  ShoppingBag,
  Search,
  MapPin,
  ArrowRightLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  Home,
  LogOut,
  X,
  MessageSquare,
  Compass,
  SlidersHorizontal
} from 'lucide-react';

interface BuyModuleViewProps {
  listings: ClothingListing[];
  allSwaps: { incoming: SwapRequest[]; outgoing: SwapRequest[] };
  onSelectItem: (item: ClothingListing) => void;
  onProposeSwap: (item: ClothingListing) => void;
  onOpenChat: (swap: SwapRequest) => void;
  onBackToHome: () => void;
  onRefresh: () => void;
  initialSubTab?: string;
  onSubTabChange?: (tab: string) => void;
}

export const BuyModuleView: React.FC<BuyModuleViewProps> = ({
  listings,
  allSwaps,
  onSelectItem,
  onProposeSwap,
  onOpenChat,
  onBackToHome,
  onRefresh,
  initialSubTab = 'dashboard',
  onSubTabChange
}) => {
  const { user, logout, switchDemoUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(initialSubTab);

  // Search & Filter State for Browse Clothes
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<'available' | 'all'>('available');
  const [sortBy, setSortBy] = useState<'newest' | 'value_asc' | 'value_desc' | 'nearest'>('newest');
  const [showMobileFilterDrawer, setShowMobileFilterDrawer] = useState(false);

  // History / Requests search & filters
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('all');

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

  const categories = [
    'All',
    'Shirts & Tops',
    'Dresses & Tops',
    'Jeans & Trousers',
    'Jackets & Hoodies',
    'Traditional & Ethnic Wear',
    'Knitwear & Sweaters'
  ];

  const conditions = ['All', 'Brand New with Tags', 'Like New', 'Gently Used', 'Well Loved'];
  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'Free Size'];
  const popularCapitals = [
    'Bengaluru', 'Mumbai', 'Jaipur', 'Kolkata', 'Chennai', 'Lucknow',
    'Panaji', 'Shimla', 'Chandigarh', 'Hyderabad', 'Bhopal', 'Patna'
  ];

  // Outgoing swap requests sent by user
  const outgoingRequests = allSwaps.outgoing || [];
  const pendingRequestsSent = outgoingRequests.filter(s => s.status === 'pending');
  const successfulSwaps = outgoingRequests.filter(s => s.status === 'completed');
  const availableItemsCount = listings.filter(l => l.status === 'available').length;

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      if (availabilityFilter === 'available' && item.status !== 'available') {
        return false;
      }
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedCondition !== 'All' && item.condition !== selectedCondition) {
        return false;
      }
      if (selectedSize !== 'All' && item.size !== selectedSize) {
        return false;
      }
      if (cityFilter !== 'All' && item.city !== cityFilter) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchBrand = item.brand.toLowerCase().includes(q);
        const matchDesc = (item.description || '').toLowerCase().includes(q);
        return matchTitle || matchBrand || matchDesc;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'value_asc') return a.estimatedValue - b.estimatedValue;
      if (sortBy === 'value_desc') return b.estimatedValue - a.estimatedValue;
      if (sortBy === 'nearest' && user?.city) {
        if (a.city === user.city && b.city !== user.city) return -1;
        if (b.city === user.city && a.city !== user.city) return 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [listings, availabilityFilter, selectedCategory, selectedCondition, selectedSize, cityFilter, searchTerm, sortBy, user]);

  // Recommended nearby listings based on user city
  const recommendedNearby = useMemo(() => {
    const userCity = user?.city || 'Bengaluru';
    const cityItems = listings.filter(l => l.city === userCity && l.status === 'available' && l.userId !== user?.id);
    if (cityItems.length > 0) return cityItems.slice(0, 4);
    return listings.filter(l => l.status === 'available' && l.userId !== user?.id).slice(0, 4);
  }, [listings, user]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedCondition('All');
    setSelectedSize('All');
    setCityFilter('All');
    setAvailabilityFilter('available');
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'All' ||
    selectedCondition !== 'All' ||
    selectedSize !== 'All' ||
    cityFilter !== 'All' ||
    availabilityFilter !== 'available';

  // Cancel sent request
  const handleCancelRequest = async (swapId: string) => {
    if (!window.confirm('Cancel this swap request?')) return;
    try {
      await api.performSwapAction(swapId, 'cancel');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel swap request.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07130D]/90 text-[#FDF0CD] font-sans backdrop-blur-xs">
      {/* 1. DEDICATED BUY MODULE HEADER */}
      <header className="sticky top-0 z-40 bg-[#08150E]/95 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-lg">
        {/* Module Indicator Banner */}
        <div className="bg-[#060E0A] text-[#FDF0CD] px-4 py-1.5 text-xs flex items-center justify-between border-b border-[#D4AF37]/20">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-3.5 h-3.5 text-[#FDE68A]" />
            <span className="font-semibold uppercase tracking-wider text-[11px] text-[#FDE68A]">Buy Clothes Module</span>
            <span className="hidden sm:inline text-[#E5D7B3]">· Direct clothing exchange & discovery with zero cash fees</span>
          </div>

          <div className="relative flex items-center gap-2">
            <span className="text-[#EED895] text-[11px] hidden sm:inline">Active Persona:</span>
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="bg-[#122A1E] hover:bg-[#183827] px-2.5 py-0.5 rounded text-[11px] text-[#FDE68A] flex items-center gap-1 border border-[#D4AF37]/40 shadow-xs"
            >
              <span>{user?.name || 'Guest'}</span>
              <ChevronDown className="w-3 h-3 text-[#FDE68A]/70" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 top-7 w-60 bg-[#FFF9E6] text-[#203628] rounded-xl shadow-2xl border border-[#EED895] py-1.5 z-50 text-xs">
                {demoAccounts.map((d) => (
                  <button
                    key={d.email}
                    onClick={() => {
                      switchDemoUser(d.email);
                      setShowDemoMenu(false);
                      onRefresh();
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-[#FCEFC7] flex items-center justify-between ${
                      user?.email === d.email ? 'font-bold text-[#8A6A1C] bg-[#FDF3D6]' : ''
                    }`}
                  >
                    <span>{d.name} ({d.city})</span>
                    {d.role === 'admin' && <span className="text-[10px] bg-[#8A6A1C] text-[#FFF9E6] px-1 rounded font-bold">Admin</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Buy Module Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div onClick={onBackToHome} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-lg border border-[#D4AF37]/50 group-hover:scale-105 transition-transform duration-200 shrink-0 bg-[#060E0A]">
                <img
                  src="/src/assets/images/rewear_brand_logo_1792598309821.jpg"
                  alt="ReWear Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-[#FDE68A] block leading-none">ReWear</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#EED895]">Discovery Lounge</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
              <button
                onClick={() => setTab('dashboard')}
                className={`px-3.5 py-2 rounded-xl transition ${
                  activeTab === 'dashboard'
                    ? 'bg-[#FFF9E6] text-[#1A2E22] font-bold shadow-md border border-[#EED895]'
                    : 'text-[#E5D7B3] hover:text-[#FDE68A] hover:bg-[#FFF9E6]/10'
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => setTab('browse')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'browse'
                    ? 'bg-[#FFF9E6] text-[#1A2E22] font-bold shadow-md border border-[#EED895]'
                    : 'text-[#E5D7B3] hover:text-[#FDE68A] hover:bg-[#FFF9E6]/10'
                }`}
              >
                <Compass className="w-4 h-4 text-[#FDE68A]" />
                <span>Browse Clothes</span>
              </button>

              <button
                onClick={() => setTab('requests')}
                className={`px-3.5 py-2 rounded-xl transition relative flex items-center gap-1.5 ${
                  activeTab === 'requests'
                    ? 'bg-[#FFF9E6] text-[#1A2E22] font-bold shadow-md border border-[#EED895]'
                    : 'text-[#E5D7B3] hover:text-[#FDE68A] hover:bg-[#FFF9E6]/10'
                }`}
              >
                <span>Requests Sent</span>
                {pendingRequestsSent.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 rounded-full bg-[#D4AF37] text-[#102418]">
                    {pendingRequestsSent.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setTab('successful-swaps')}
                className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'successful-swaps'
                    ? 'bg-[#FFF9E6] text-[#1A2E22] font-bold shadow-md border border-[#EED895]'
                    : 'text-[#E5D7B3] hover:text-[#FDE68A] hover:bg-[#FFF9E6]/10'
                }`}
              >
                <span>Successful Swaps</span>
                {successfulSwaps.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 rounded-full bg-[#183E2A] text-[#FDE68A] border border-[#D4AF37]/50">
                    {successfulSwaps.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setTab('history')}
                className={`px-3.5 py-2 rounded-xl transition ${
                  activeTab === 'history'
                    ? 'bg-[#FFF9E6] text-[#1A2E22] font-bold shadow-md border border-[#EED895]'
                    : 'text-[#E5D7B3] hover:text-[#FDE68A] hover:bg-[#FFF9E6]/10'
                }`}
              >
                Swap History
              </button>

              <button
                onClick={() => setTab('how-it-works')}
                className={`px-3.5 py-2 rounded-xl transition ${
                  activeTab === 'how-it-works'
                    ? 'bg-[#FFF9E6] text-[#1A2E22] font-bold shadow-md border border-[#EED895]'
                    : 'text-[#E5D7B3] hover:text-[#FDE68A] hover:bg-[#FFF9E6]/10'
                }`}
              >
                How It Works
              </button>

              <button
                onClick={onBackToHome}
                className="px-3.5 py-2 rounded-xl text-[#E5D7B3] hover:text-[#FDE68A] hover:bg-[#FFF9E6]/10 transition flex items-center gap-1.5"
                title="Return to main ReWear landing page"
              >
                <Home className="w-4 h-4 text-[#FDE68A]" />
                <span>Back to Home</span>
              </button>
            </nav>

            {/* Profile Menu */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTab('browse')}
                className="hidden sm:flex items-center gap-1.5 bg-[#FFF9E6] hover:bg-[#FCEFC7] text-[#1A2E22] px-4 py-2 rounded-xl text-xs font-bold shadow-md border border-[#EED895] transition"
              >
                <Search className="w-3.5 h-3.5 text-[#8A6A1C]" />
                <span>Explore Clothes</span>
              </button>

              {user && (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-1 rounded-xl border border-[#D4AF37]/40 hover:bg-[#FFF9E6]/10 transition flex items-center gap-1.5"
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover border border-[#D4AF37]/30"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-[#FDE68A]" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-12 w-52 bg-[#FFF9E6] text-[#203628] rounded-2xl shadow-2xl border border-[#EED895] py-2 z-50 text-xs">
                      <div className="px-4 py-2 border-b border-[#EED895]/60">
                        <p className="font-bold text-[#1A2E22]">{user.name}</p>
                        <p className="text-[11px] text-[#7A6430]">{user.city}</p>
                      </div>
                      <button
                        onClick={onBackToHome}
                        className="w-full text-left px-4 py-2 hover:bg-[#FCEFC7] flex items-center gap-2 text-[#243427] font-medium"
                      >
                        <Home className="w-3.5 h-3.5 text-[#8A6A1C]" />
                        <span>Back to Home</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                          onBackToHome();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-100 flex items-center gap-2 text-rose-800 font-semibold"
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
          <div className="lg:hidden flex items-center justify-around py-2 border-t border-[#D4AF37]/20 text-xs font-medium text-[#E5D7B3] overflow-x-auto">
            <button
              onClick={() => setTab('dashboard')}
              className={`px-2.5 py-1 rounded-lg ${activeTab === 'dashboard' ? 'bg-[#FFF9E6] text-[#1A2E22] font-bold' : ''}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setTab('browse')}
              className={`px-2.5 py-1 rounded-lg ${activeTab === 'browse' ? 'bg-[#FFF9E6] text-[#1A2E22] font-bold' : ''}`}
            >
              Browse
            </button>
            <button
              onClick={() => setTab('requests')}
              className={`px-2.5 py-1 rounded-lg ${activeTab === 'requests' ? 'bg-[#FFF9E6] text-[#1A2E22] font-bold' : ''}`}
            >
              Sent ({outgoingRequests.length})
            </button>
            <button
              onClick={() => setTab('successful-swaps')}
              className={`px-2.5 py-1 rounded-lg ${activeTab === 'successful-swaps' ? 'bg-[#FFF9E6] text-[#1A2E22] font-bold' : ''}`}
            >
              Swaps ({successfulSwaps.length})
            </button>
            <button
              onClick={() => setTab('history')}
              className={`px-2.5 py-1 rounded-lg ${activeTab === 'history' ? 'bg-[#FFF9E6] text-[#1A2E22] font-bold' : ''}`}
            >
              History
            </button>
            <button
              onClick={() => setTab('how-it-works')}
              className={`px-2.5 py-1 rounded-lg ${activeTab === 'how-it-works' ? 'bg-[#FFF9E6] text-[#1A2E22] font-bold' : ''}`}
            >
              Guide
            </button>
            <button
              onClick={onBackToHome}
              className="px-2.5 py-1 rounded-lg text-[#FDE68A] hover:underline"
            >
              Home
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* SUB-PAGE 1: BUY DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#142A1D] via-[#1E3F2E] to-[#122A1E] text-[#FDF0CD] rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#FDE68A]">
                  Buyer Barter Lounge
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FDE68A]">
                  Discover Clothes Ready for Exchange
                </h1>
                <p className="text-xs sm:text-sm text-[#E5D7B3] max-w-xl">
                  Browse authentic sarees, kurtas, denim, and jackets from members across Hubballi, Bengaluru, Mysuru, and Pune. Propose a direct barter without cash.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTab('browse')}
                  className="bg-[#FFF9E6] hover:bg-[#FCEFC7] text-[#1A2E22] font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-xl transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 border border-[#EED895]"
                >
                  <Compass className="w-4 h-4 text-[#8A6A1C]" />
                  <span>Browse All Clothes</span>
                </button>
              </div>
            </div>

            {/* Key Metrics Cards in Light Golden Yellow */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div
                onClick={() => setTab('browse')}
                className="bg-[#FFF9E6] p-5 rounded-2xl border border-[#EED895] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] cursor-pointer hover:border-[#D4AF37] hover:scale-[1.02] transition text-[#1A2E22]"
              >
                <div className="flex items-center justify-between text-xs text-[#6B5B30] font-medium">
                  <span className="font-bold">Available Clothes</span>
                  <ShoppingBag className="w-4 h-4 text-[#8A6A1C]" />
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2E22] mt-2">
                  {availableItemsCount}
                </div>
                <div className="text-[11px] text-[#7A6430] mt-1">Ready for 1:1 barter trade</div>
              </div>

              <div
                onClick={() => setTab('requests')}
                className="bg-[#FFF9E6] p-5 rounded-2xl border border-[#EED895] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] cursor-pointer hover:border-[#D4AF37] hover:scale-[1.02] transition text-[#1A2E22]"
              >
                <div className="flex items-center justify-between text-xs text-[#6B5B30] font-medium">
                  <span className="font-bold">Swap Requests Sent</span>
                  <ArrowRightLeft className="w-4 h-4 text-[#8A6A1C]" />
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#8A6A1C] mt-2">
                  {outgoingRequests.length}
                </div>
                <div className="text-[11px] text-[#7A6430] mt-1">{pendingRequestsSent.length} pending response</div>
              </div>

              <div
                onClick={() => setTab('requests')}
                className="bg-[#FFF9E6] p-5 rounded-2xl border border-[#EED895] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] cursor-pointer hover:border-[#D4AF37] hover:scale-[1.02] transition text-[#1A2E22]"
              >
                <div className="flex items-center justify-between text-xs text-[#6B5B30] font-medium">
                  <span className="font-bold">Pending Responses</span>
                  <Clock className="w-4 h-4 text-[#8A6A1C]" />
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1E3F2E] mt-2">
                  {pendingRequestsSent.length}
                </div>
                <div className="text-[11px] text-[#7A6430] mt-1">Awaiting owner review</div>
              </div>

              <div
                onClick={() => setTab('successful-swaps')}
                className="bg-[#FFF9E6] p-5 rounded-2xl border border-[#EED895] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] cursor-pointer hover:border-[#D4AF37] hover:scale-[1.02] transition text-[#1A2E22]"
              >
                <div className="flex items-center justify-between text-xs text-[#6B5B30] font-medium">
                  <span className="font-bold">Successful Swaps</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 mt-2">
                  {successfulSwaps.length}
                </div>
                <div className="text-[11px] text-[#7A6430] mt-1">Confirmed exchanges</div>
              </div>
            </div>

            {/* Recommended Nearby Listings Box in Light Golden Yellow */}
            <div className="bg-[#FFF9E6] rounded-3xl p-6 sm:p-8 border border-[#EED895] shadow-[0_12px_35px_rgba(0,0,0,0.3)] space-y-5 text-[#1A2E22]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#8A6A1C]" />
                    <h2 className="font-serif font-bold text-lg text-[#1A2E22]">
                      Recommended Clothes in {user?.city || 'Your Area'}
                    </h2>
                  </div>
                  <p className="text-xs text-[#6B5B30]">Local garments to minimize transit emissions and enable easy meetups</p>
                </div>

                <button
                  onClick={() => setTab('browse')}
                  className="text-xs font-bold text-[#8A6A1C] hover:underline flex items-center gap-1"
                >
                  <span>Explore all</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {recommendedNearby.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="group bg-[#FEF6DB] rounded-2xl border border-[#E8D494] overflow-hidden hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative aspect-[3/4] bg-[#F9ECC4] overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-black/60 text-[#FDE68A] text-[10px] px-2 py-0.5 rounded font-bold backdrop-blur-xs">
                        Size: {item.size}
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 bg-[#183E2A] text-[#FDE68A] text-[10px] px-2 py-0.5 rounded font-bold shadow-xs border border-[#D4AF37]/40">
                        {item.city}
                      </div>
                    </div>

                    <div className="p-3.5 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-[#8A6A1C] block truncate">{item.brand}</span>
                      <h4 className="font-serif font-bold text-xs text-[#1A2E22] truncate group-hover:text-[#8A6A1C] transition">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-[#6B5B30] pt-1 border-t border-[#E8D494]">
                        <span className="font-bold text-[#1A2E22]">≈ ₹{item.estimatedValue}</span>
                        <span>{item.condition}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB-PAGE 2: BROWSE CLOTHES (Marketplace with Filter Sidebar) */}
        {activeTab === 'browse' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-serif font-bold text-[#FDE68A]">Browse Clothes for Exchange</h1>
                <p className="text-xs text-[#E5D7B3]">Discover pre-loved shirts, kurtas, denim, and dresses available for 1:1 barter</p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setShowMobileFilterDrawer(!showMobileFilterDrawer)}
                  className="lg:hidden px-3.5 py-2 bg-[#FFF9E6] border border-[#EED895] rounded-xl text-xs font-bold text-[#1A2E22] flex items-center gap-1.5 shadow-md"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#8A6A1C]" />
                  <span>Filters</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs text-[#543D10] bg-[#FFF9E6] px-3.5 py-2 rounded-xl border border-[#EED895] shadow-md">
                  <span className="font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="font-bold text-[#1A2E22] bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="nearest">Nearest City</option>
                    <option value="value_asc">Lowest Swap Value</option>
                    <option value="value_desc">Highest Swap Value</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Top Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#8A6A1C] absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search by garment title, brand (FabIndia, Levi's, Zara, Biba), or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#EED895] bg-[#FFFDF5] text-xs sm:text-sm text-[#1A2E22] placeholder:text-[#8C7A58] focus:outline-none focus:border-[#B89635] shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-3.5 text-[#8A6A1C] hover:text-[#543D10]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-[#EED895] font-medium">Active filters:</span>
                {selectedCategory !== 'All' && (
                  <span className="bg-[#FFF9E6] border border-[#EED895] px-2.5 py-1 rounded-lg text-[#1A2E22] font-semibold flex items-center gap-1 shadow-xs">
                    {selectedCategory}
                    <X className="w-3 h-3 cursor-pointer text-[#8A6A1C]" onClick={() => setSelectedCategory('All')} />
                  </span>
                )}
                {cityFilter !== 'All' && (
                  <span className="bg-[#FFF9E6] border border-[#EED895] px-2.5 py-1 rounded-lg text-[#1A2E22] font-semibold flex items-center gap-1 shadow-xs">
                    City: {cityFilter}
                    <X className="w-3 h-3 cursor-pointer text-[#8A6A1C]" onClick={() => setCityFilter('All')} />
                  </span>
                )}
                {selectedSize !== 'All' && (
                  <span className="bg-[#FFF9E6] border border-[#EED895] px-2.5 py-1 rounded-lg text-[#1A2E22] font-semibold flex items-center gap-1 shadow-xs">
                    Size: {selectedSize}
                    <X className="w-3 h-3 cursor-pointer text-[#8A6A1C]" onClick={() => setSelectedSize('All')} />
                  </span>
                )}
                {selectedCondition !== 'All' && (
                  <span className="bg-[#FFF9E6] border border-[#EED895] px-2.5 py-1 rounded-lg text-[#1A2E22] font-semibold flex items-center gap-1 shadow-xs">
                    {selectedCondition}
                    <X className="w-3 h-3 cursor-pointer text-[#8A6A1C]" onClick={() => setSelectedCondition('All')} />
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-[#FDE68A] underline ml-2 hover:text-[#FFF9E6]"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* 28 Indian State Capitals Quick Filter Strip */}
            <div className="space-y-1.5 pt-1 border border-[#EED895] bg-[#FFF9E6] p-3 rounded-2xl shadow-md text-[#1A2E22]">
              <div className="flex items-center justify-between text-xs font-bold text-[#6B5B30] uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-[#8A6A1C]">
                  <MapPin className="w-3.5 h-3.5 text-[#8A6A1C]" />
                  28 Indian State Capitals
                </span>
                {cityFilter !== 'All' && (
                  <button
                    onClick={() => setCityFilter('All')}
                    className="text-[#8A6A1C] font-bold text-[11px] hover:underline"
                  >
                    Clear City Filter ({cityFilter})
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                <button
                  onClick={() => setCityFilter('All')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                    cityFilter === 'All'
                      ? 'bg-[#183E2A] text-[#FDE68A] shadow-xs'
                      : 'bg-[#FEF4D5] text-[#1A2E22] hover:bg-[#FCEFC7]'
                  }`}
                >
                  All Capitals
                </button>
                {INDIAN_STATE_CAPITALS.map((sc) => (
                  <button
                    key={sc.no}
                    onClick={() => setCityFilter(sc.capital)}
                    className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition flex items-center gap-1 ${
                      cityFilter.toLowerCase() === sc.capital.toLowerCase()
                        ? 'bg-[#183E2A] text-[#FDE68A] font-bold shadow-xs'
                        : 'bg-[#FEF4D5] text-[#1A2E22] hover:bg-[#FCEFC7]'
                    }`}
                    title={`${sc.capital}, ${sc.state}`}
                  >
                    <span>{sc.capital}</span>
                    <span className="text-[10px] opacity-70">({sc.state.split(' ')[0]})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Browse Layout: Sidebar + Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
              {/* Desktop Filter Sidebar in Light Golden Yellow */}
              <div className="hidden lg:block bg-[#FFF9E6] p-6 rounded-3xl border border-[#EED895] shadow-[0_12px_35px_rgba(0,0,0,0.3)] space-y-6 sticky top-28 text-[#1A2E22]">
                <div className="flex items-center justify-between pb-3 border-b border-[#EED895]/60">
                  <span className="font-serif font-bold text-sm text-[#1A2E22]">Filter Clothes</span>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-[11px] text-[#8A6A1C] font-bold hover:underline">
                      Reset
                    </button>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B5B30] block">Category</span>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                          selectedCategory === cat
                            ? 'bg-[#183E2A] font-bold text-[#FDE68A]'
                            : 'text-[#203628] hover:bg-[#FEF4D5]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City Location */}
                <div className="space-y-2 pt-2 border-t border-[#EED895]/60">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B5B30] block">
                      Indian Capital City
                    </span>
                    {cityFilter !== 'All' && (
                      <button
                        onClick={() => setCityFilter('All')}
                        className="text-[10px] text-[#8A6A1C] font-bold hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-[#EED895] text-xs font-semibold bg-[#FFFDF5] text-[#1A2E22] cursor-pointer"
                  >
                    <option value="All">All 28 Capitals (Pan-India)</option>
                    <optgroup label="28 Capital Cities of Indian States">
                      {INDIAN_STATE_CAPITALS.map((sc) => (
                        <option key={sc.no} value={sc.capital}>
                          {sc.capital} ({sc.state})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Other Regional Circles">
                      <option value="Hubballi">Hubballi (Karnataka)</option>
                      <option value="Mysuru">Mysuru (Karnataka)</option>
                      <option value="Pune">Pune (Maharashtra)</option>
                    </optgroup>
                  </select>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {popularCapitals.slice(0, 6).map((cap) => (
                      <button
                        key={cap}
                        onClick={() => setCityFilter(cap)}
                        className={`text-[11px] px-2 py-0.5 rounded-md transition ${
                          cityFilter === cap
                            ? 'bg-[#183E2A] text-[#FDE68A] font-bold'
                            : 'bg-[#FEF4D5] text-[#1A2E22] hover:bg-[#FCEFC7]'
                        }`}
                      >
                        {cap}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="space-y-2 pt-2 border-t border-[#EED895]/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B5B30] block">Size</span>
                  <div className="flex flex-wrap gap-1.5">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`py-1 px-2.5 rounded-lg text-xs transition ${
                          selectedSize === s
                            ? 'bg-[#183E2A] text-[#FDE68A] font-bold'
                            : 'bg-[#FEF4D5] text-[#1A2E22] hover:bg-[#FCEFC7]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div className="space-y-2 pt-2 border-t border-[#EED895]/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B5B30] block">Condition</span>
                  <div className="space-y-1">
                    {conditions.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedCondition(c)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                          selectedCondition === c
                            ? 'bg-[#183E2A] font-bold text-[#FDE68A]'
                            : 'text-[#203628] hover:bg-[#FEF4D5]'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Product Grid Area */}
              <div className="lg:col-span-3 space-y-4">
                <div className="flex items-center justify-between text-xs text-[#E5D7B3]">
                  <span>Showing <strong className="text-[#FDE68A]">{filteredListings.length}</strong> clothing items</span>
                  <span className="text-[11px] bg-[#183E2A] text-[#FDE68A] px-2.5 py-0.5 rounded-full font-semibold border border-[#D4AF37]/30">
                    100% Cashless Barter
                  </span>
                </div>

                {filteredListings.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-[#FFF9E6] rounded-3xl border border-[#EED895] shadow-lg space-y-3 text-[#1A2E22]">
                    <ShoppingBag className="w-12 h-12 text-[#8A6A1C] mx-auto opacity-60" />
                    <h3 className="font-serif font-bold text-[#1A2E22] text-base">No clothes match your filters</h3>
                    <p className="text-xs text-[#6B5B30] max-w-sm mx-auto">
                      Try adjusting your search keywords, clearing size restrictions, or switching cities.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={clearFilters}
                        className="bg-[#183E2A] text-[#FDE68A] px-5 py-2.5 rounded-xl text-xs font-bold border border-[#D4AF37]/50"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredListings.map((item) => (
                      <div
                        key={item.id}
                        className="group bg-[#FFF9E6] rounded-2xl border border-[#EED895] overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] hover:shadow-2xl hover:border-[#D4AF37] transition flex flex-col justify-between text-[#1A2E22]"
                      >
                        <div
                          onClick={() => onSelectItem(item)}
                          className="relative aspect-[3/4] bg-[#FEF4D5] overflow-hidden cursor-pointer"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2.5 left-2.5 bg-black/60 text-[#FDE68A] text-[10px] px-2 py-0.5 rounded font-bold backdrop-blur-xs">
                            Size: {item.size}
                          </div>
                          <div className="absolute bottom-2.5 right-2.5 bg-[#183E2A] text-[#FDE68A] text-[10px] px-2 py-0.5 rounded font-bold shadow-xs flex items-center gap-0.5 border border-[#D4AF37]/30">
                            <MapPin className="w-2.5 h-2.5 text-[#FDE68A]" />
                            {item.city}
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-[#6B5B30]">
                              <span className="font-bold text-[#8A6A1C] uppercase">{item.brand}</span>
                              <span>{item.condition}</span>
                            </div>
                            <h3
                              onClick={() => onSelectItem(item)}
                              className="font-serif font-bold text-sm text-[#1A2E22] truncate mt-0.5 cursor-pointer hover:text-[#8A6A1C] transition"
                            >
                              {item.title}
                            </h3>
                          </div>

                          <div className="flex items-center justify-between text-xs text-[#6B5B30] pt-1 border-t border-[#EED895]/60">
                            <span className="font-bold text-[#1A2E22]">≈ ₹{item.estimatedValue} Swap Value</span>
                            <span className="text-[11px] text-[#8C7A58]">By {item.userName}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-1 border-t border-[#EED895]/60">
                            <button
                              onClick={() => onSelectItem(item)}
                              className="flex-1 py-2 rounded-xl bg-[#FEF4D5] hover:bg-[#FCEFC7] text-[#1A2E22] text-xs font-semibold transition border border-[#EED895]"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => onProposeSwap(item)}
                              className="flex-1 py-2 rounded-xl bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] text-xs font-bold transition flex items-center justify-center gap-1 shadow-md border border-[#D4AF37]/40"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5 text-[#FDE68A]" />
                              <span>Propose Swap</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUB-PAGE 3: REQUESTS SENT */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#FDE68A]">Swap Requests Sent</h1>
              <p className="text-xs text-[#E5D7B3]">Track status of clothing swap proposals you dispatched to other wardrobers</p>
            </div>

            {outgoingRequests.length === 0 ? (
              <div className="text-center py-16 px-4 bg-[#FFF9E6] rounded-3xl border border-[#EED895] shadow-lg space-y-3 text-[#1A2E22]">
                <ArrowRightLeft className="w-12 h-12 text-[#8A6A1C] mx-auto opacity-60" />
                <h3 className="font-serif font-bold text-[#1A2E22] text-base">You haven't sent any swap proposals yet</h3>
                <p className="text-xs text-[#6B5B30] max-w-sm mx-auto">
                  Browse clothes from other members and propose an item from your wardrobe to swap!
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setTab('browse')}
                    className="bg-[#183E2A] text-[#FDE68A] px-5 py-2.5 rounded-xl text-xs font-bold border border-[#D4AF37]/50"
                  >
                    Browse Clothes Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {outgoingRequests.map((s) => (
                  <div
                    key={s.id}
                    className="bg-[#FFF9E6] rounded-3xl p-6 border border-[#EED895] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] space-y-4 text-[#1A2E22]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EED895]/60 gap-2">
                      <div>
                        <span className="font-bold text-[#1A2E22] text-xs sm:text-sm">Owner: {s.ownerName}</span>
                        <span className="text-[11px] text-[#7A6430] block">{s.ownerCity} · Sent on {new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                            s.status === 'pending'
                              ? 'bg-[#FDF3D6] text-[#8A6A1C] border border-[#EED895]'
                              : s.status === 'accepted'
                              ? 'bg-[#183E2A] text-[#FDE68A] border border-[#D4AF37]/50'
                              : s.status === 'completed'
                              ? 'bg-blue-900/10 text-blue-900 border border-blue-200'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          Status: {s.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* You Requested */}
                      <div className="p-3.5 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-white overflow-hidden shrink-0 border border-[#E8D494]">
                          <img
                            src={s.requestedItemImage || s.targetItemImage}
                            alt="Requested"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-[#7A6430] block">You Requested:</span>
                          <h4 className="font-bold text-[#1A2E22]">{s.requestedItemTitle || s.targetItemTitle}</h4>
                          <span className="text-[#6B5B30]">Value ≈ ₹{s.requestedItemValue || s.requestedItemPrice || s.targetItemValue || 1000}</span>
                        </div>
                      </div>

                      {/* You Offered */}
                      <div className="p-3.5 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-white overflow-hidden shrink-0 border border-[#E8D494]">
                          <img
                            src={s.offeredItemImage}
                            alt="Offered"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-[#8A6A1C] block">You Offered:</span>
                          <h4 className="font-bold text-[#1A2E22]">{s.offeredItemTitle}</h4>
                          <span className="text-[#6B5B30]">Value ≈ ₹{s.offeredItemValue || s.offeredItemPrice || 1000}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#EED895]/60">
                      <button
                        onClick={() => onOpenChat(s)}
                        className="px-4 py-2 rounded-xl bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] text-xs font-bold flex items-center gap-1.5 transition border border-[#D4AF37]/30"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#FDE68A]" />
                        <span>Chat with {s.ownerName}</span>
                      </button>

                      {s.status === 'pending' && (
                        <button
                          onClick={() => handleCancelRequest(s.id)}
                          className="px-3.5 py-1.5 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition"
                        >
                          Cancel Request
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUB-PAGE 4: SUCCESSFUL SWAPS */}
        {activeTab === 'successful-swaps' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#FDE68A]">Successful Completed Swaps</h1>
              <p className="text-xs text-[#E5D7B3]">Completed exchanges where both parties mutually confirmed receipt with zero cash paid</p>
            </div>

            {successfulSwaps.length === 0 ? (
              <div className="text-center py-16 px-4 bg-[#FFF9E6] rounded-3xl border border-[#EED895] shadow-lg space-y-3 text-[#1A2E22]">
                <CheckCircle2 className="w-12 h-12 text-[#8A6A1C] mx-auto opacity-60" />
                <h3 className="font-serif font-bold text-[#1A2E22] text-base">No completed swaps recorded yet</h3>
                <p className="text-xs text-[#6B5B30] max-w-sm mx-auto">
                  Once an accepted swap is carried out and both members click "Confirm Receipt", it will be archived here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {successfulSwaps.map((s) => (
                  <div
                    key={s.id}
                    className="bg-[#FFF9E6] rounded-3xl p-6 border border-[#EED895] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] space-y-4 text-[#1A2E22]"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-[#EED895]/60">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                        <span className="font-serif font-bold text-sm text-[#1A2E22]">
                          Barter Exchange Completed on {new Date(s.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-xs bg-[#183E2A] text-[#FDE68A] px-3 py-1 rounded-full font-bold border border-[#D4AF37]/30">
                        100% Cashless
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] flex items-center gap-3">
                        <img src={s.requestedItemImage || s.targetItemImage} alt="Received" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <span className="text-[10px] text-[#7A6430] block uppercase font-bold">You Received:</span>
                          <h4 className="font-bold text-[#1A2E22] text-xs">{s.requestedItemTitle || s.targetItemTitle}</h4>
                          <span className="text-[11px] text-[#6B5B30]">From {s.ownerName} ({s.ownerCity})</span>
                        </div>
                      </div>

                      <div className="p-3 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] flex items-center gap-3">
                        <img src={s.offeredItemImage} alt="Given" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <span className="text-[10px] text-[#7A6430] block uppercase font-bold">You Traded Away:</span>
                          <h4 className="font-bold text-[#1A2E22] text-xs">{s.offeredItemTitle}</h4>
                          <span className="text-[11px] text-[#6B5B30]">Given in exchange</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#6B5B30] pt-1">
                      <span>Environmental Savings: ~2,700 Liters Water & 3.6kg CO2 Saved</span>
                      <button
                        onClick={() => onOpenChat(s)}
                        className="text-[#8A6A1C] font-bold hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>View Chat Transcript</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUB-PAGE 5: SWAP HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-serif font-bold text-[#FDE68A]">Buyer Swap History</h1>
                <p className="text-xs text-[#E5D7B3]">Complete log of all requests sent, active barters, and completed exchanges</p>
              </div>

              <select
                value={requestStatusFilter}
                onChange={(e) => setRequestStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#EED895] bg-[#FFF9E6] text-xs text-[#1A2E22] font-semibold"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted / Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="bg-[#FFF9E6] rounded-3xl border border-[#EED895] overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] divide-y divide-[#EED895]/60 text-[#1A2E22]">
              {outgoingRequests
                .filter(s => requestStatusFilter === 'all' || s.status === requestStatusFilter)
                .map((s) => (
                  <div key={s.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0 border border-[#E8D494]">
                        <img
                          src={s.requestedItemImage || s.targetItemImage}
                          alt="Garment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1A2E22]">{s.requestedItemTitle || s.targetItemTitle}</h4>
                        <p className="text-[#6B5B30] text-[11px]">Owner: {s.ownerName} ({s.ownerCity}) · Offered: {s.offeredItemTitle}</p>
                        <span className="text-[10px] text-[#8C7A58]">Date: {new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-bold px-3 py-1 rounded-full capitalize ${
                          s.status === 'completed'
                            ? 'bg-blue-900/10 text-blue-900 border border-blue-200'
                            : s.status === 'accepted'
                            ? 'bg-[#183E2A] text-[#FDE68A] border border-[#D4AF37]/50'
                            : s.status === 'pending'
                            ? 'bg-[#FDF3D6] text-[#8A6A1C] border border-[#EED895]'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {s.status}
                      </span>

                      <button
                        onClick={() => onOpenChat(s)}
                        className="p-2 rounded-xl bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] transition border border-[#D4AF37]/30"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* SUB-PAGE 6: HOW IT WORKS (Buyer Guide) */}
        {activeTab === 'how-it-works' && (
          <div className="bg-[#FFF9E6] rounded-3xl p-6 sm:p-10 border border-[#EED895] shadow-[0_12px_35px_rgba(0,0,0,0.3)] space-y-8 text-[#1A2E22]">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#8A6A1C]">
                Buyer Barter Handbook
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2E22]">
                How Buying & Discovering Works on ReWear
              </h1>
              <p className="text-xs sm:text-sm text-[#6B5B30] max-w-2xl">
                On ReWear, "buying" means exchanging one of your unused clothes for an item you want. No money changes hands.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: '1', title: 'Browse Clothes', desc: 'Explore items by category, size, condition, and city.' },
                { step: '2', title: 'Apply Multi-Filters', desc: 'Pinpoint exact sizes (XS to XXL) and nearest city hubs.' },
                { step: '3', title: 'Inspect Details', desc: 'Review high-res images, sizing specs, and parity valuation.' },
                { step: '4', title: 'Offer Your Garment', desc: 'Choose an eligible piece from your listed wardrobe to trade.' },
                { step: '5', title: 'Send Swap Proposal', desc: 'Submit with an optional friendly note about fit or meetup.' },
                { step: '6', title: 'Chat & Coordinate', desc: 'Once accepted, discuss handoff details in private chat.' },
                { step: '7', title: 'Agree on Exchange', desc: 'Meet in a safe public spot or book door-to-door courier.' },
                { step: '8', title: 'Receive & Inspect', desc: 'Verify the clothing item matches the photos and description.' },
                { step: '9', title: 'Confirm Swap', desc: 'Click confirm to complete the zero-cash circular trade!' },
              ].map((s) => (
                <div key={s.step} className="p-4 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] space-y-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#183E2A] text-[#FDE68A] flex items-center justify-center text-xs font-bold border border-[#D4AF37]/40">
                    {s.step}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#1A2E22] pt-1">{s.title}</h4>
                  <p className="text-xs text-[#6B5B30] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
