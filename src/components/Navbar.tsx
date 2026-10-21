import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Shirt,
  ShoppingBag,
  Tag,
  MapPin,
  Repeat,
  PlusCircle,
  User as UserIcon,
  ShieldCheck,
  LogOut,
  LogIn,
  ChevronDown,
  Sparkles,
  Home,
  Filter,
  HelpCircle,
  Inbox,
  CheckCircle2,
  CheckCheck,
  ArrowRightLeft
} from 'lucide-react';

export type ActiveModule = 'buyer' | 'seller' | 'admin';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeModule: ActiveModule;
  setActiveModule: (mod: ActiveModule) => void;
  onOpenCreateListing: () => void;
  onOpenAuth: () => void;
  incomingRequestsCount: number;
  onToggleFilter?: () => void;
  sellerSubTab?: 'inventory' | 'requests';
  setSellerSubTab?: (tab: 'inventory' | 'requests') => void;
  adminSubTab?: 'listed-items' | 'who-sent-to-whom' | 'accepted-swaps' | 'successful-swaps';
  setAdminSubTab?: (tab: 'listed-items' | 'who-sent-to-whom' | 'accepted-swaps' | 'successful-swaps') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  activeModule,
  setActiveModule,
  onOpenCreateListing,
  onOpenAuth,
  incomingRequestsCount,
  onToggleFilter,
  sellerSubTab = 'inventory',
  setSellerSubTab,
  adminSubTab = 'listed-items',
  setAdminSubTab
}) => {
  const { user, logout, switchDemoUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const demoAccounts = [
    { name: 'Priya Sharma', city: 'Bengaluru', email: 'priya@example.com', role: 'user' },
    { name: 'Rahul Patil', city: 'Hubballi', email: 'rahul@example.com', role: 'user' },
    { name: 'Ananya Hegde', city: 'Mysuru', email: 'ananya@example.com', role: 'user' },
    { name: 'Karan Joshi', city: 'Pune', email: 'karan@example.com', role: 'user' },
    { name: 'ReWear Admin', city: 'Bengaluru', email: 'admin@rewear.org', role: 'admin' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#08150E]/95 backdrop-blur-md border-b border-[#D4AF37]/30 text-[#FDF0CD] shadow-lg">
      {/* Top Banner: Sustainability & Quick Demo Persona Switcher */}
      <div className="bg-[#060E0A] text-[#FDF0CD] px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-[#D4AF37]/20">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-block w-2 h-2 rounded-full bg-[#34D399] animate-pulse"></span>
          <span className="font-semibold text-[#FDE68A]">ReWear • 100% Cashless Clothing Exchange</span>
          <span className="hidden md:inline text-[#FDF0CD]/80">
            • {activeModule === 'buyer' && 'Buyer Section (Discovery & Barter)'}
            {activeModule === 'seller' && 'Seller Section (Wardrobe & Requests)'}
            {activeModule === 'admin' && 'Admin Portal (Governance)'}
          </span>
        </div>

        {/* Demo switcher badge for evaluation */}
        <div className="relative mx-auto sm:mx-0 flex items-center gap-2">
          <span className="text-[#FDE68A]/80 text-[11px] font-medium hidden sm:inline">Active Demo Persona:</span>
          <button
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            className="flex items-center gap-1.5 bg-[#122A1E] hover:bg-[#183827] px-2.5 py-0.5 rounded text-[11px] font-medium text-[#FDE68A] transition border border-[#D4AF37]/40 shadow-xs"
            title="Switch demo account"
          >
            <Sparkles className="w-3 h-3 text-[#FDE68A]" />
            <span>{user ? `${user.name} (${user.city})` : 'Guest'}</span>
            <ChevronDown className="w-3 h-3 text-[#FDE68A]/70" />
          </button>

          {showDemoMenu && (
            <div className="absolute right-0 top-7 w-64 bg-[#FFF9E6] text-stone-900 rounded-xl shadow-2xl border border-[#EED895] py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 text-[11px] font-bold text-[#8A6A1C] uppercase tracking-wider border-b border-[#EED895]/60">
                Switch Test Account (1-Click)
              </div>
              {demoAccounts.map(demo => (
                <button
                  key={demo.email}
                  onClick={() => {
                    switchDemoUser(demo.email);
                    setShowDemoMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#FCEFC7] transition ${
                    user?.email === demo.email ? 'bg-[#F9E6A8] font-bold text-[#453005]' : 'text-stone-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium">{demo.name}</span>
                      {demo.role === 'admin' && (
                        <span className="bg-[#D4AF37] text-stone-900 text-[10px] px-1.5 rounded font-bold">Admin</span>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-600">{demo.city} • {demo.email}</div>
                  </div>
                  {user?.email === demo.email && (
                    <span className="w-2 h-2 rounded-full bg-[#8A6A1C]"></span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand: ReWear */}
          <div
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shadow-lg border border-[#D4AF37]/50 group-hover:scale-105 transition-transform duration-200 shrink-0 bg-[#060E0A]">
              <img
                src="/src/assets/images/rewear_brand_logo_1792598309821.jpg"
                alt="ReWear Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#FDE68A] font-serif">
                  ReWear
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#183E2A] text-[#FDE68A] border border-[#D4AF37]/40 shadow-xs">
                  {activeModule === 'buyer' && 'BUY'}
                  {activeModule === 'seller' && 'SELL'}
                  {activeModule === 'admin' && 'ADMIN'}
                </span>
              </div>
              <p className="text-[11px] text-[#EED895] font-medium hidden sm:block">
                Clothing Exchange Marketplace
              </p>
            </div>
          </div>

          {/* DEDICATED NAV LINKS BASED ON ACTIVE MODULE */}

          {/* 1. BUYER MODULE NAVIGATION */}
          {activeModule === 'buyer' && (
            <nav className="hidden lg:flex items-center gap-1.5">
              <button
                onClick={() => setCurrentTab('home')}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab === 'home'
                    ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 font-bold'
                    : 'text-[#FDF0CD]/85 hover:text-[#FEF3C7] hover:bg-[#122A1E]'
                }`}
              >
                <Home className="w-4 h-4 text-[#FDE68A]" />
                <span>Home</span>
              </button>

              <button
                onClick={() => setCurrentTab('marketplace')}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentTab === 'marketplace'
                    ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 shadow-xs'
                    : 'text-[#FDE68A] hover:bg-[#122A1E]'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-[#FDE68A]" />
                <span>Browse Clothes</span>
              </button>

              <button
                onClick={() => {
                  if (!user) {
                    onOpenAuth();
                    return;
                  }
                  setCurrentTab('swaps');
                }}
                className={`relative px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab === 'swaps'
                    ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 font-bold'
                    : 'text-[#FDF0CD]/85 hover:text-[#FEF3C7] hover:bg-[#122A1E]'
                }`}
              >
                <Repeat className="w-4 h-4 text-[#FDE68A]" />
                <span>My Swaps</span>
                {incomingRequestsCount > 0 && (
                  <span className="w-4 h-4 bg-[#D97706] text-stone-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                    {incomingRequestsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentTab('nearby')}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab === 'nearby'
                    ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 font-bold'
                    : 'text-[#FDF0CD]/85 hover:text-[#FEF3C7] hover:bg-[#122A1E]'
                }`}
              >
                <MapPin className="w-4 h-4 text-[#FDE68A]" />
                <span>Nearby Swaps</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('marketplace');
                  if (onToggleFilter) {
                    onToggleFilter();
                  }
                }}
                className="px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 text-[#FDF0CD]/85 hover:text-[#FEF3C7] hover:bg-[#122A1E]"
                title="Filter by City, Category, Size, Condition"
              >
                <Filter className="w-4 h-4 text-[#FDE68A]" />
                <span>Filter Option</span>
              </button>

              <button
                onClick={() => setCurrentTab('how-it-works')}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab === 'how-it-works'
                    ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 font-bold'
                    : 'text-[#FDF0CD]/85 hover:text-[#FEF3C7] hover:bg-[#122A1E]'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-[#FDE68A]" />
                <span>How It Works</span>
              </button>
            </nav>
          )}

          {/* 2. SELLER MODULE NAVIGATION */}
          {activeModule === 'seller' && (
            <nav className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setCurrentTab('home')}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab === 'home'
                    ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 font-bold'
                    : 'text-[#FDF0CD]/85 hover:text-[#FEF3C7] hover:bg-[#122A1E]'
                }`}
              >
                <Home className="w-4 h-4 text-[#FDE68A]" />
                <span>Home</span>
              </button>

              {/* LIST ITEM BUTTON */}
              <button
                onClick={user ? onOpenCreateListing : onOpenAuth}
                className="flex items-center gap-1.5 bg-[#D4AF37] hover:bg-[#E5C175] text-[#0A1B13] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md transition transform hover:-translate-y-0.5"
              >
                <PlusCircle className="w-4 h-4 text-[#0A1B13]" />
                <span>List Item</span>
              </button>

              {/* REQUESTS RECEIVED */}
              <button
                onClick={() => {
                  setCurrentTab('sell');
                  if (setSellerSubTab) setSellerSubTab('requests');
                }}
                className={`relative px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentTab === 'sell' && sellerSubTab === 'requests'
                    ? 'bg-[#D4AF37] text-stone-900 shadow-xs font-bold'
                    : 'text-[#FDE68A] hover:bg-[#122A1E]'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Requests Received</span>
                {incomingRequestsCount > 0 && (
                  <span className="w-4 h-4 bg-[#D97706] text-stone-900 text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {incomingRequestsCount}
                  </span>
                )}
              </button>

              {/* MY SWAPS (WARDROBE & ACTIVE EXCHANGES) */}
              <button
                onClick={() => {
                  setCurrentTab('sell');
                  if (setSellerSubTab) setSellerSubTab('inventory');
                }}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab === 'sell' && sellerSubTab === 'inventory'
                    ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 font-bold'
                    : 'text-[#FDF0CD]/85 hover:text-[#FEF3C7] hover:bg-[#122A1E]'
                }`}
              >
                <Repeat className="w-4 h-4 text-[#FDE68A]" />
                <span>My Swaps</span>
              </button>

              {/* HOW IT WORKS */}
              <button
                onClick={() => setCurrentTab('how-it-works')}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab === 'how-it-works'
                    ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 font-bold'
                    : 'text-[#FDF0CD]/85 hover:text-[#FEF3C7] hover:bg-[#122A1E]'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-[#FDE68A]" />
                <span>How It Works</span>
              </button>
            </nav>
          )}

          {/* 3. ADMIN MODULE NAVIGATION */}
          {/* User Request: Reframe who-sent-to-whom into proper English */}
          {activeModule === 'admin' && (
            <nav className="hidden lg:flex items-center gap-1.5">
              <button
                onClick={() => setCurrentTab('home')}
                className="px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 text-[#FDF0CD]/80 hover:bg-[#122A1E] hover:text-[#FEF3C7]"
              >
                <Home className="w-4 h-4 text-[#FDE68A]" />
                <span>Home</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('admin');
                  if (setAdminSubTab) setAdminSubTab('listed-items');
                }}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentTab === 'admin' && adminSubTab === 'listed-items'
                    ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 shadow-xs'
                    : 'text-[#FDF0CD]/80 hover:bg-[#122A1E] hover:text-[#FEF3C7]'
                }`}
              >
                <Shirt className="w-4 h-4 text-[#FDE68A]" />
                <span>Listed Items</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('admin');
                  if (setAdminSubTab) setAdminSubTab('who-sent-to-whom');
                }}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentTab === 'admin' && adminSubTab === 'who-sent-to-whom'
                    ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 shadow-xs'
                    : 'text-[#FDF0CD]/80 hover:bg-[#122A1E] hover:text-[#FEF3C7]'
                }`}
              >
                <Repeat className="w-4 h-4 text-[#FDE68A]" />
                <span>Member Exchange Activity</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('admin');
                  if (setAdminSubTab) setAdminSubTab('accepted-swaps');
                }}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentTab === 'admin' && adminSubTab === 'accepted-swaps'
                    ? 'bg-[#D4AF37] text-stone-900 font-bold shadow-xs'
                    : 'text-[#FDF0CD]/80 hover:bg-[#122A1E] hover:text-[#FEF3C7]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accepted Swap Requests</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('admin');
                  if (setAdminSubTab) setAdminSubTab('successful-swaps');
                }}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentTab === 'admin' && adminSubTab === 'successful-swaps'
                    ? 'bg-emerald-700 text-[#FEF3C7] shadow-xs'
                    : 'text-[#FDF0CD]/80 hover:bg-[#122A1E] hover:text-[#FEF3C7]'
                }`}
              >
                <CheckCheck className="w-4 h-4" />
                <span>Successful Swap Requests</span>
              </button>
            </nav>
          )}

          {/* Right Action: Profile & Mobile Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Module Quick Action */}
            {activeModule === 'seller' && (
              <button
                onClick={user ? onOpenCreateListing : onOpenAuth}
                className="lg:hidden flex items-center gap-1 bg-[#D4AF37] text-stone-950 px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            )}

            {activeModule === 'buyer' && (
              <button
                onClick={() => {
                  setCurrentTab('marketplace');
                  if (onToggleFilter) onToggleFilter();
                }}
                className="lg:hidden flex items-center gap-1 bg-[#122A1E] text-[#FDE68A] border border-[#D4AF37]/30 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
              >
                <Filter className="w-3.5 h-3.5 text-[#FDE68A]" />
                <span>Filter</span>
              </button>
            )}

            {/* User Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-[#D4AF37]/40 hover:bg-[#122A1E] transition bg-[#0C1E14]"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover border border-[#D4AF37]/50"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-semibold text-[#FDE68A] leading-tight line-clamp-1">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-[#EED895] flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5 text-[#34D399]" />
                      <span>{user.city}</span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#FDE68A]/70" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-56 bg-[#FFF9E6] rounded-xl shadow-2xl border border-[#EED895] py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 text-stone-900">
                    <div className="px-3.5 py-2 border-b border-[#EED895]/60">
                      <p className="font-bold text-stone-900">{user.name}</p>
                      <p className="text-[11px] text-stone-600">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#F9E6A8] text-[#593F03] border border-[#E5CF88]">
                        {user.role === 'admin' ? 'Administrator' : 'Verified Swapper'}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setCurrentTab('home');
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFC7] flex items-center gap-2 text-stone-800"
                      >
                        <Home className="w-4 h-4 text-[#8A6A1C]" />
                        <span>ReWear Home</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveModule('buyer');
                          setCurrentTab('marketplace');
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFC7] flex items-center gap-2 text-stone-800"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#8A6A1C]" />
                        <span>Go to Buyer Module</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveModule('seller');
                          setCurrentTab('sell');
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-[#FCEFC7] flex items-center gap-2 text-stone-800"
                      >
                        <Tag className="w-4 h-4 text-[#8A6A1C]" />
                        <span>Go to Seller Module</span>
                      </button>

                      {user.role === 'admin' && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            setActiveModule('admin');
                            setCurrentTab('admin');
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-[#F9E6A8] text-[#593F03] flex items-center gap-2 font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                          <span>Admin Control Center</span>
                        </button>
                      )}
                    </div>

                    <div className="border-t border-[#EED895]/60 pt-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                          setCurrentTab('home');
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-rose-100 text-rose-800 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4 text-rose-600" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 bg-[#D4AF37] hover:bg-[#E5C175] text-[#0A1B13] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center justify-between border-t border-[#D4AF37]/20 py-2 text-xs overflow-x-auto scrollbar-none gap-2">
          {activeModule === 'buyer' && (
            <>
              <button
                onClick={() => setCurrentTab('home')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'home' ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 font-bold' : 'text-[#FDF0CD]/80'}`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentTab('marketplace')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'marketplace' ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 font-bold' : 'text-[#FDF0CD]/80'}`}
              >
                Browse Clothes
              </button>
              <button
                onClick={() => {
                  if (!user) onOpenAuth();
                  else setCurrentTab('swaps');
                }}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'swaps' ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 font-bold' : 'text-[#FDF0CD]/80'}`}
              >
                My Swaps
              </button>
              <button
                onClick={() => setCurrentTab('nearby')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'nearby' ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 font-bold' : 'text-[#FDF0CD]/80'}`}
              >
                Nearby Swaps
              </button>
              <button
                onClick={() => setCurrentTab('how-it-works')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'how-it-works' ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 font-bold' : 'text-[#FDF0CD]/80'}`}
              >
                How It Works
              </button>
            </>
          )}

          {activeModule === 'seller' && (
            <>
              <button
                onClick={() => setCurrentTab('home')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'home' ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 font-bold' : 'text-[#FDF0CD]/80'}`}
              >
                Home
              </button>
              <button
                onClick={user ? onOpenCreateListing : onOpenAuth}
                className="px-2.5 py-1 rounded-md whitespace-nowrap bg-[#D4AF37] text-stone-950 font-bold flex items-center gap-1 shadow-xs"
              >
                <PlusCircle className="w-3 h-3" />
                List Item
              </button>
              <button
                onClick={() => {
                  setCurrentTab('sell');
                  if (setSellerSubTab) setSellerSubTab('requests');
                }}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'sell' && sellerSubTab === 'requests' ? 'bg-[#D4AF37] text-stone-900 font-bold' : 'text-[#FDF0CD]/80'}`}
              >
                Requests Received
              </button>
              <button
                onClick={() => {
                  setCurrentTab('sell');
                  if (setSellerSubTab) setSellerSubTab('inventory');
                }}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'sell' && sellerSubTab === 'inventory' ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 font-bold' : 'text-[#FDF0CD]/80'}`}
              >
                My Swaps
              </button>
              <button
                onClick={() => setCurrentTab('how-it-works')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'how-it-works' ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 font-bold' : 'text-[#FDF0CD]/80'}`}
              >
                How It Works
              </button>
            </>
          )}

          {activeModule === 'admin' && (
            <>
              <button
                onClick={() => setCurrentTab('home')}
                className="px-2 py-1 rounded-md whitespace-nowrap text-[#FDF0CD]/80"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setCurrentTab('admin');
                  if (setAdminSubTab) setAdminSubTab('listed-items');
                }}
                className={`px-2 py-1 rounded-md whitespace-nowrap ${adminSubTab === 'listed-items' ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 font-bold' : 'text-[#FDF0CD]/80'}`}
              >
                Listed Items
              </button>
              <button
                onClick={() => {
                  setCurrentTab('admin');
                  if (setAdminSubTab) setAdminSubTab('who-sent-to-whom');
                }}
                className={`px-2 py-1 rounded-md whitespace-nowrap ${adminSubTab === 'who-sent-to-whom' ? 'bg-[#1E4D35] text-[#FEF3C7] border border-[#D4AF37]/50 font-bold' : 'text-[#FDF0CD]/80'}`}
              >
                Member Exchanges
              </button>
              <button
                onClick={() => {
                  setCurrentTab('admin');
                  if (setAdminSubTab) setAdminSubTab('accepted-swaps');
                }}
                className={`px-2 py-1 rounded-md whitespace-nowrap ${adminSubTab === 'accepted-swaps' ? 'bg-[#D4AF37] text-stone-900 font-bold' : 'text-[#FDF0CD]/80'}`}
              >
                Accepted
              </button>
              <button
                onClick={() => {
                  setCurrentTab('admin');
                  if (setAdminSubTab) setAdminSubTab('successful-swaps');
                }}
                className={`px-2 py-1 rounded-md whitespace-nowrap ${adminSubTab === 'successful-swaps' ? 'bg-emerald-700 text-[#FEF3C7] font-bold' : 'text-[#FDF0CD]/80'}`}
              >
                Successful
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
