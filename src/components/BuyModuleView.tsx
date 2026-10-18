import React, { useState, useMemo } from 'react';
import { ClothingListing, SwapRequest } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { INDIAN_STATE_CAPITALS } from '../data/indiaLocations.ts';
import {
  ShoppingBag,
  Search,
  Filter,
  MapPin,
  Tag,
  ArrowRightLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  Shirt,
  Leaf,
  ChevronDown,
  ChevronRight,
  Home,
  LogOut,
  X,
  RotateCcw,
  MessageSquare,
  Compass,
  Check,
  Ban,
  SlidersHorizontal,
  Info
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
  const [historySearch, setHistorySearch] = useState('');

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
    <div className="min-h-screen bg-[#F8F8F4] text-[#1F2421] font-sans">
      {/* 1. DEDICATED BUY MODULE HEADER */}
      <header className="sticky top-0 z-40 bg-[#F8F8F4]/95 backdrop-blur-md border-b border-[#E6E6DC]">
        {/* Module Indicator Banner */}
        <div className="bg-[#1A382B] text-white px-4 py-1.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-3.5 h-3.5 text-[#8CA58A]" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">Buy Clothes Module</span>
            <span className="hidden sm:inline text-[#C5D9C4]">· Direct clothing exchange & discovery with zero cash fees</span>
          </div>

          <div className="relative flex items-center gap-2">
            <span className="text-[#C1DEC9] text-[11px] hidden sm:inline">Active Persona:</span>
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="bg-[#12271E] hover:bg-[#0E1E17] px-2 py-0.5 rounded text-[11px] text-white flex items-center gap-1 border border-[#2D503C]"
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

        {/* Buy Module Navigation Bar in exact order: 1. Dashboard, 2. Browse Clothes, 3. Requests Sent, 4. Successful Swaps, 5. Swap History, 6. How It Works, 7. Back to Home, 8. User Profile */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <div onClick={onBackToHome} className="flex items-center gap-2.5 cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-[#234C3A] flex items-center justify-center text-white">
                <Shirt className="w-4 h-4 text-[#8CA58A]" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-[#1F2421] block leading-none">ReWear</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#42614B]">Discovery Lounge</span>
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
                onClick={() => setTab('browse')}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'browse'
                    ? 'bg-[#234C3A] text-white font-semibold shadow-xs'
                    : 'text-[#5E6B63] hover:text-[#1F2421] hover:bg-[#EAEAE0]'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Browse Clothes</span>
              </button>

              <button
                onClick={() => setTab('requests')}
                className={`px-3 py-2 rounded-xl transition relative flex items-center gap-1.5 ${
                  activeTab === 'requests'
                    ? 'bg-[#234C3A] text-white font-semibold shadow-xs'
                    : 'text-[#5E6B63] hover:text-[#1F2421] hover:bg-[#EAEAE0]'
                }`}
              >
                <span>Requests Sent</span>
                {pendingRequestsSent.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 rounded-full bg-amber-500 text-white">
                    {pendingRequestsSent.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setTab('successful-swaps')}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'successful-swaps'
                    ? 'bg-[#234C3A] text-white font-semibold shadow-xs'
                    : 'text-[#5E6B63] hover:text-[#1F2421] hover:bg-[#EAEAE0]'
                }`}
              >
                <span>Successful Swaps</span>
                {successfulSwaps.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 rounded-full bg-emerald-600 text-white">
                    {successfulSwaps.length}
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
                onClick={() => setTab('browse')}
                className="hidden sm:flex items-center gap-1.5 bg-[#234C3A] hover:bg-[#1A382B] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition"
              >
                <Search className="w-3.5 h-3.5 text-[#8CA58A]" />
                <span>Explore Clothes</span>
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
              onClick={() => setTab('browse')}
              className={`px-2 py-1 rounded-lg ${activeTab === 'browse' ? 'bg-[#234C3A] text-white font-bold' : ''}`}
            >
              Browse
            </button>
            <button
              onClick={() => setTab('requests')}
              className={`px-2 py-1 rounded-lg ${activeTab === 'requests' ? 'bg-[#234C3A] text-white font-bold' : ''}`}
            >
              Sent ({outgoingRequests.length})
            </button>
            <button
              onClick={() => setTab('successful-swaps')}
              className={`px-2 py-1 rounded-lg ${activeTab === 'successful-swaps' ? 'bg-[#234C3A] text-white font-bold' : ''}`}
            >
              Swaps ({successfulSwaps.length})
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
        {/* SUB-PAGE 1: BUY DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#234C3A] via-[#2D5A45] to-[#1E3F30] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#C1DEC9]">
                  Buyer Barter Lounge
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF8F4]">
                  Discover Clothes Ready for Exchange
                </h1>
                <p className="text-xs sm:text-sm text-[#D4E3D8] max-w-xl">
                  Browse authentic sarees, kurtas, denim, and jackets from members across Hubballi, Bengaluru, Mysuru, and Pune. Propose a direct barter without cash.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTab('browse')}
                  className="bg-[#E7DEC8] hover:bg-[#DCD1B8] text-[#1A382B] font-bold px-5 py-3 rounded-xl text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 text-[#1A382B]" />
                  <span>Browse All Clothes</span>
                </button>
              </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div
                onClick={() => setTab('browse')}
                className="bg-white p-5 rounded-2xl border border-[#E6E6DC] shadow-xs cursor-pointer hover:border-[#234C3A] transition"
              >
                <div className="flex items-center justify-between text-xs text-[#5E6B63] font-medium">
                  <span>Available Clothes</span>
                  <Shirt className="w-4 h-4 text-[#234C3A]" />
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1F2421] mt-2">
                  {availableItemsCount}
                </div>
                <div className="text-[11px] text-[#5E6B63] mt-1">Ready for 1:1 barter trade</div>
              </div>

              <div
                onClick={() => setTab('requests')}
                className="bg-white p-5 rounded-2xl border border-[#E6E6DC] shadow-xs cursor-pointer hover:border-amber-600 transition"
              >
                <div className="flex items-center justify-between text-xs text-[#5E6B63] font-medium">
                  <span>Swap Requests Sent</span>
                  <ArrowRightLeft className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-700 mt-2">
                  {outgoingRequests.length}
                </div>
                <div className="text-[11px] text-[#5E6B63] mt-1">{pendingRequestsSent.length} pending response</div>
              </div>

              <div
                onClick={() => setTab('requests')}
                className="bg-white p-5 rounded-2xl border border-[#E6E6DC] shadow-xs cursor-pointer hover:border-[#42614B] transition"
              >
                <div className="flex items-center justify-between text-xs text-[#5E6B63] font-medium">
                  <span>Pending Responses</span>
                  <Clock className="w-4 h-4 text-[#42614B]" />
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#42614B] mt-2">
                  {pendingRequestsSent.length}
                </div>
                <div className="text-[11px] text-[#5E6B63] mt-1">Awaiting owner review</div>
              </div>

              <div
                onClick={() => setTab('successful-swaps')}
                className="bg-white p-5 rounded-2xl border border-[#E6E6DC] shadow-xs cursor-pointer hover:border-emerald-600 transition"
              >
                <div className="flex items-center justify-between text-xs text-[#5E6B63] font-medium">
                  <span>Successful Swaps</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-800 mt-2">
                  {successfulSwaps.length}
                </div>
                <div className="text-[11px] text-[#5E6B63] mt-1">Confirmed exchanges</div>
              </div>
            </div>

            {/* Recommended Nearby Listings */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6E6DC] shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#234C3A]" />
                    <h2 className="font-serif font-bold text-lg text-[#1F2421]">
                      Recommended Clothes in {user?.city || 'Your Area'}
                    </h2>
                  </div>
                  <p className="text-xs text-[#5E6B63]">Local garments to minimize transit emissions and enable easy meetups</p>
                </div>

                <button
                  onClick={() => setTab('browse')}
                  className="text-xs font-semibold text-[#234C3A] hover:underline flex items-center gap-1"
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
                    className="group bg-[#F8F8F4] rounded-2xl border border-[#E6E6DC] overflow-hidden hover:shadow-md transition cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold backdrop-blur-xs">
                        Size: {item.size}
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 bg-[#234C3A] text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-xs">
                        {item.city}
                      </div>
                    </div>

                    <div className="p-3.5 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-[#234C3A] block truncate">{item.brand}</span>
                      <h4 className="font-serif font-bold text-xs text-stone-900 truncate group-hover:text-[#234C3A] transition">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-[#5E6B63] pt-1 border-t border-stone-200">
                        <span className="font-bold text-[#1F2421]">≈ ₹{item.estimatedValue}</span>
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
                <h1 className="text-2xl font-serif font-bold text-[#1F2421]">Browse Clothes for Exchange</h1>
                <p className="text-xs text-[#5E6B63]">Discover pre-loved shirts, kurtas, denim, and dresses available for 1:1 barter</p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setShowMobileFilterDrawer(!showMobileFilterDrawer)}
                  className="lg:hidden px-3 py-2 bg-white border border-[#E6E6DC] rounded-xl text-xs font-semibold text-[#1F2421] flex items-center gap-1.5 shadow-xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs text-[#5E6B63] bg-white px-3 py-2 rounded-xl border border-[#E6E6DC]">
                  <span>Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="font-bold text-[#234C3A] bg-transparent focus:outline-none"
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
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search by garment title, brand (Levi's, FabIndia, Zara, Biba), or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#E6E6DC] bg-white text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-[#234C3A] shadow-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-3.5 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Active Filter Chips */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-stone-400 font-medium">Active filters:</span>
                {selectedCategory !== 'All' && (
                  <span className="bg-white border border-[#E6E6DC] px-2.5 py-1 rounded-lg text-[#234C3A] font-medium flex items-center gap-1">
                    {selectedCategory}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
                  </span>
                )}
                {cityFilter !== 'All' && (
                  <span className="bg-white border border-[#E6E6DC] px-2.5 py-1 rounded-lg text-[#234C3A] font-medium flex items-center gap-1">
                    City: {cityFilter}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setCityFilter('All')} />
                  </span>
                )}
                {selectedSize !== 'All' && (
                  <span className="bg-white border border-[#E6E6DC] px-2.5 py-1 rounded-lg text-[#234C3A] font-medium flex items-center gap-1">
                    Size: {selectedSize}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSize('All')} />
                  </span>
                )}
                {selectedCondition !== 'All' && (
                  <span className="bg-white border border-[#E6E6DC] px-2.5 py-1 rounded-lg text-[#234C3A] font-medium flex items-center gap-1">
                    {selectedCondition}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCondition('All')} />
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-rose-700 hover:underline ml-2"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* 28 Indian State Capitals Quick Filter Strip */}
            <div className="space-y-1.5 pt-1 border border-[#E6E6DC] bg-white p-3 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-[#234C3A]">
                  <MapPin className="w-3.5 h-3.5 text-[#234C3A]" />
                  28 Indian State Capitals
                </span>
                {cityFilter !== 'All' && (
                  <button
                    onClick={() => setCityFilter('All')}
                    className="text-[#234C3A] font-bold text-[11px] hover:underline"
                  >
                    Clear City Filter ({cityFilter})
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                <button
                  onClick={() => setCityFilter('All')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    cityFilter === 'All'
                      ? 'bg-[#234C3A] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
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
                        ? 'bg-[#234C3A] text-white font-bold shadow-xs'
                        : 'bg-[#F2ECE1] text-stone-700 hover:bg-[#E7DFD0]'
                    }`}
                    title={`${sc.capital}, ${sc.state}`}
                  >
                    <span>{sc.capital}</span>
                    <span className="text-[10px] opacity-60">({sc.state.split(' ')[0]})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Browse Layout: Sidebar + Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
              {/* Desktop Filter Sidebar */}
              <div className="hidden lg:block bg-white p-6 rounded-3xl border border-[#E6E6DC] shadow-xs space-y-6 sticky top-28">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <span className="font-serif font-bold text-sm text-[#1F2421]">Filter Clothes</span>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-[11px] text-[#234C3A] font-semibold hover:underline">
                      Reset
                    </button>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">Category</span>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                          selectedCategory === cat
                            ? 'bg-[#EBF3ED] font-bold text-[#234C3A]'
                            : 'text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City Location */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                      Indian Capital City
                    </span>
                    {cityFilter !== 'All' && (
                      <button
                        onClick={() => setCityFilter('All')}
                        className="text-[10px] text-[#234C3A] font-bold hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:ring-2 focus:ring-[#234C3A] bg-white text-stone-800 cursor-pointer"
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
                            ? 'bg-[#234C3A] text-white font-bold'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {cap}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">Size</span>
                  <div className="flex flex-wrap gap-1.5">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`py-1 px-2.5 rounded-lg text-xs transition ${
                          selectedSize === s
                            ? 'bg-[#234C3A] text-white font-bold'
                            : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">Condition</span>
                  <div className="space-y-1">
                    {conditions.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedCondition(c)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                          selectedCondition === c
                            ? 'bg-[#EBF3ED] font-bold text-[#234C3A]'
                            : 'text-stone-600 hover:bg-stone-50'
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
                <div className="flex items-center justify-between text-xs text-[#5E6B63]">
                  <span>Showing <strong>{filteredListings.length}</strong> clothing items</span>
                  <span className="text-[11px] bg-[#EAF2EC] text-[#234C3A] px-2.5 py-0.5 rounded-full font-semibold">
                    100% Cashless Barter
                  </span>
                </div>

                {filteredListings.length === 0 ? (
                  <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-[#DCDCD0] space-y-3">
                    <Shirt className="w-12 h-12 text-stone-300 mx-auto" />
                    <h3 className="font-serif font-bold text-stone-800 text-base">No clothes match your filters</h3>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      Try adjusting your search keywords, clearing size restrictions, or switching cities.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={clearFilters}
                        className="bg-[#234C3A] text-white px-4 py-2 rounded-xl text-xs font-bold"
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
                        className="group bg-white rounded-2xl border border-[#E6E6DC] overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
                      >
                        <div
                          onClick={() => onSelectItem(item)}
                          className="relative aspect-[3/4] bg-stone-100 overflow-hidden cursor-pointer"
                        >
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2.5 left-2.5 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold backdrop-blur-xs">
                            Size: {item.size}
                          </div>
                          <div className="absolute bottom-2.5 right-2.5 bg-[#234C3A] text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-xs flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            {item.city}
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          <div>
                            <div className="flex items-center justify-between text-[11px] text-[#5E6B63]">
                              <span className="font-bold text-[#234C3A] uppercase">{item.brand}</span>
                              <span>{item.condition}</span>
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
                            <span className="text-[11px] text-stone-400">By {item.userName}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                            <button
                              onClick={() => onSelectItem(item)}
                              className="flex-1 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => onProposeSwap(item)}
                              className="flex-1 py-1.5 rounded-lg bg-[#234C3A] hover:bg-[#1A382B] text-white text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs"
                            >
                              <ArrowRightLeft className="w-3 h-3 text-[#8CA58A]" />
                              <span>Request Swap</span>
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
              <h1 className="text-2xl font-serif font-bold text-[#1F2421]">Swap Requests Sent</h1>
              <p className="text-xs text-[#5E6B63]">Track the barter requests you have submitted to other garment owners</p>
            </div>

            {outgoingRequests.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-[#DCDCD0] space-y-3">
                <ArrowRightLeft className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-serif font-bold text-stone-800 text-base">No swap requests sent yet</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Browse clothes, pick an item you love, and propose an exchange offering one of your own garments.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setTab('browse')}
                    className="bg-[#234C3A] text-white px-4 py-2 rounded-xl text-xs font-bold"
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
                    className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E6E6DC] shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
                      <div>
                        <span className="font-bold text-stone-900 text-xs sm:text-sm">Owner: {s.ownerName}</span>
                        <span className="text-[11px] text-stone-400 block">{s.ownerCity} · Sent on {new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${
                            s.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : s.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800'
                              : s.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          Status: {s.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* You Requested */}
                      <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-white overflow-hidden shrink-0 border border-stone-200">
                          <img
                            src={s.requestedItemImage || s.targetItemImage}
                            alt="Requested"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">You Requested:</span>
                          <h4 className="font-bold text-stone-900">{s.requestedItemTitle || s.targetItemTitle}</h4>
                          <span className="text-stone-500">Value ≈ ₹{s.requestedItemValue || s.requestedItemPrice || s.targetItemValue || 1000}</span>
                        </div>
                      </div>

                      {/* You Offered */}
                      <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-white overflow-hidden shrink-0 border border-emerald-200">
                          <img
                            src={s.offeredItemImage}
                            alt="Offered"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs space-y-0.5">
                          <span className="text-[10px] uppercase font-bold text-emerald-800 block">You Offered:</span>
                          <h4 className="font-bold text-emerald-950">{s.offeredItemTitle}</h4>
                          <span className="text-emerald-700">Value ≈ ₹{s.offeredItemValue || s.offeredItemPrice || 1000}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <button
                        onClick={() => onOpenChat(s)}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat with {s.ownerName}</span>
                      </button>

                      {s.status === 'pending' && (
                        <button
                          onClick={() => handleCancelRequest(s.id)}
                          className="px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition"
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
              <h1 className="text-2xl font-serif font-bold text-[#1F2421]">Successful Completed Swaps</h1>
              <p className="text-xs text-[#5E6B63]">Completed exchanges where both parties mutually confirmed receipt with zero cash paid</p>
            </div>

            {successfulSwaps.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-[#DCDCD0] space-y-3">
                <CheckCircle2 className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-serif font-bold text-stone-800 text-base">No completed swaps recorded yet</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Once an accepted swap is carried out and both members click "Confirm Receipt", it will be archived here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {successfulSwaps.map((s) => (
                  <div
                    key={s.id}
                    className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                        <span className="font-serif font-bold text-sm text-emerald-950">
                          Barter Exchange Completed on {new Date(s.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                        100% Cashless
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-stone-50 rounded-2xl flex items-center gap-3">
                        <img src={s.requestedItemImage || s.targetItemImage} alt="Received" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <span className="text-[10px] text-stone-400 block uppercase font-bold">You Received:</span>
                          <h4 className="font-bold text-stone-900 text-xs">{s.requestedItemTitle || s.targetItemTitle}</h4>
                          <span className="text-[11px] text-stone-500">From {s.ownerName} ({s.ownerCity})</span>
                        </div>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-2xl flex items-center gap-3">
                        <img src={s.offeredItemImage} alt="Given" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <span className="text-[10px] text-stone-400 block uppercase font-bold">You Traded Away:</span>
                          <h4 className="font-bold text-stone-900 text-xs">{s.offeredItemTitle}</h4>
                          <span className="text-[11px] text-stone-500">Given in exchange</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                      <span>Environmental Savings: ~2,700 Liters Water & 3.6kg CO2 Saved</span>
                      <button
                        onClick={() => onOpenChat(s)}
                        className="text-[#234C3A] font-semibold hover:underline flex items-center gap-1"
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
                <h1 className="text-2xl font-serif font-bold text-[#1F2421]">Buyer Swap History</h1>
                <p className="text-xs text-[#5E6B63]">Complete log of all requests sent, active barters, and completed exchanges</p>
              </div>

              <select
                value={requestStatusFilter}
                onChange={(e) => setRequestStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-[#E6E6DC] bg-white text-xs text-stone-800"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted / Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="bg-white rounded-3xl border border-[#E6E6DC] overflow-hidden shadow-xs divide-y divide-stone-100">
              {outgoingRequests
                .filter(s => requestStatusFilter === 'all' || s.status === requestStatusFilter)
                .map((s) => (
                  <div key={s.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        <img
                          src={s.requestedItemImage || s.targetItemImage}
                          alt="Garment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900">{s.requestedItemTitle || s.targetItemTitle}</h4>
                        <p className="text-stone-500 text-[11px]">Owner: {s.ownerName} ({s.ownerCity}) · Offered: {s.offeredItemTitle}</p>
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
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E6E6DC] shadow-xs space-y-8">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#234C3A]">
                Buyer Barter Handbook
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F2421]">
                How Buying & Discovering Works on ReWear
              </h1>
              <p className="text-xs sm:text-sm text-[#5E6B63] max-w-2xl">
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
                <div key={s.step} className="p-4 bg-[#F8F8F4] rounded-2xl border border-[#E6E6DC] space-y-1.5">
                  <span className="w-6 h-6 rounded-full bg-[#234C3A] text-white flex items-center justify-center text-xs font-bold">
                    {s.step}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-[#1F2421] pt-1">{s.title}</h4>
                  <p className="text-xs text-[#5E6B63] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
