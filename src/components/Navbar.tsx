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
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#E8E2D5] shadow-xs">
      {/* Top Banner: Sustainability & Quick Demo Persona Switcher */}
      <div className="bg-[#1C3527] text-[#F3EFE6] px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-[#2D4D3B]">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-block w-2 h-2 rounded-full bg-[#85D49E] animate-pulse"></span>
          <span className="font-medium text-[#FAF8F3]">ReWear • 100% Cashless Clothing Exchange</span>
          <span className="hidden md:inline text-[#B7D5C4]">
            • {activeModule === 'buyer' && 'Buyer Section (Discovery & Barter)'}
            {activeModule === 'seller' && 'Seller Section (Wardrobe & Requests)'}
            {activeModule === 'admin' && 'Admin Portal (Governance)'}
          </span>
        </div>

        {/* Demo switcher badge for evaluation */}
        <div className="relative mx-auto sm:mx-0 flex items-center gap-2">
          <span className="text-[#C1DEC9] text-[11px] font-medium hidden sm:inline">Active Demo Persona:</span>
          <button
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            className="flex items-center gap-1.5 bg-[#12251B] hover:bg-[#0E1E15] px-2.5 py-0.5 rounded text-[11px] font-medium text-white transition border border-[#39634B]"
            title="Switch demo account"
          >
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>{user ? `${user.name} (${user.city})` : 'Guest'}</span>
            <ChevronDown className="w-3 h-3 text-[#B7D5C4]" />
          </button>

          {showDemoMenu && (
            <div className="absolute right-0 top-7 w-64 bg-white text-gray-800 rounded-lg shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-100">
                Switch Test Account (1-Click)
              </div>
              {demoAccounts.map(demo => (
                <button
                  key={demo.email}
                  onClick={() => {
                    switchDemoUser(demo.email);
                    setShowDemoMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F3EFE6] transition ${
                    user?.email === demo.email ? 'bg-[#EBF3ED] font-semibold text-[#234533]' : 'text-stone-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span>{demo.name}</span>
                      {demo.role === 'admin' && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 rounded font-bold">Admin</span>
                      )}
                    </div>
                    <div className="text-[10px] text-stone-400">{demo.city} • {demo.email}</div>
                  </div>
                  {user?.email === demo.email && (
                    <span className="w-2 h-2 rounded-full bg-[#234533]"></span>
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
            <div className="w-10 h-10 rounded-xl bg-[#1C3527] flex items-center justify-center text-[#FBF9F5] shadow-md group-hover:scale-105 transition-transform duration-200 border border-[#2F4D3B]">
              <Shirt className="w-5 h-5 text-[#85D49E]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#162B1F] font-serif">
                  ReWear
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#E5EFE8] text-[#245037] border border-[#C6DFC9]">
                  {activeModule === 'buyer' && 'BUY'}
                  {activeModule === 'seller' && 'SELL'}
                  {activeModule === 'admin' && 'ADMIN'}
                </span>
              </div>
              <p className="text-[11px] text-[#55695D] font-medium hidden sm:block">
                Clothing Exchange Marketplace
              </p>
            </div>
          </div>

          {/* DEDICATED NAV LINKS BASED ON ACTIVE MODULE */}

          {/* 1. BUYER MODULE NAVIGATION */}
          {/* Prompt: "here in this section when buyer enters he should only get home,browse clothes,my swaps, nearby swaps,fliter option, last how it works thats it" */}
          {activeModule === 'buyer' && (
            <nav className="hidden lg:flex items-center gap-1.5">
              <button
                onClick={() => setCurrentTab('home')}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab === 'home'
                    ? 'bg-[#EBF3ED] text-[#234533] font-semibold'
                    : 'text-[#3E4F44] hover:text-[#1E3326] hover:bg-[#F4EFE6]'
                }`}
              >
                <Home className="w-4 h-4 text-[#234C3A]" />
                <span>Home</span>
              </button>

              <button
                onClick={() => setCurrentTab('marketplace')}
                className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentTab === 'marketplace'
                    ? 'bg-[#234533] text-white shadow-xs'
                    : 'text-[#234533] hover:bg-[#EBF3ED]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
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
                    ? 'bg-[#EBF3ED] text-[#234533] font-semibold'
                    : 'text-[#3E4F44] hover:text-[#1E3326] hover:bg-[#F4EFE6]'
                }`}
              >
                <Repeat className="w-4 h-4 text-[#2B6043]" />
                <span>My Swaps</span>
                {incomingRequestsCount > 0 && (
                  <span className="w-4 h-4 bg-[#C2410C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {incomingRequestsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCurrentTab('nearby')}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab === 'nearby'
                    ? 'bg-[#EBF3ED] text-[#234533] font-semibold'
                    : 'text-[#3E4F44] hover:text-[#1E3326] hover:bg-[#F4EFE6]'
                }`}
              >
                <MapPin className="w-4 h-4 text-[#234C3A]" />
                <span>Nearby Swaps</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('marketplace');
                  if (onToggleFilter) {
                    onToggleFilter();
                  }
                }}
                className="px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 text-[#3E4F44] hover:text-[#1E3326] hover:bg-[#F4EFE6]"
                title="Filter by City, Category, Size, Condition"
              >
                <Filter className="w-4 h-4 text-[#2B6043]" />
                <span>Filter Option</span>
              </button>

              <button
                onClick={() => setCurrentTab('how-it-works')}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab === 'how-it-works'
                    ? 'bg-[#EBF3ED] text-[#234533] font-semibold'
                    : 'text-[#3E4F44] hover:text-[#1E3326] hover:bg-[#F4EFE6]'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-[#234C3A]" />
                <span>How It Works</span>
              </button>
            </nav>
          )}

          {/* 2. SELLER MODULE NAVIGATION */}
          {/* Prompt: "and next when seller enters his module in this section he should only get list item,requestes received,my swaps,how it works dats it" */}
          {activeModule === 'seller' && (
            <nav className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => setCurrentTab('home')}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab === 'home'
                    ? 'bg-[#EBF3ED] text-[#234533] font-semibold'
                    : 'text-[#3E4F44] hover:text-[#1E3326] hover:bg-[#F4EFE6]'
                }`}
              >
                <Home className="w-4 h-4 text-[#234C3A]" />
                <span>Home</span>
              </button>

              {/* LIST ITEM BUTTON */}
              <button
                onClick={user ? onOpenCreateListing : onOpenAuth}
                className="flex items-center gap-1.5 bg-[#1C3527] hover:bg-[#12251B] text-[#FAF7F2] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition transform hover:-translate-y-0.5 border border-[#2F4D3B]"
              >
                <PlusCircle className="w-4 h-4 text-[#85D49E]" />
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
                    ? 'bg-[#C5A059] text-stone-900 shadow-xs'
                    : 'text-[#A67E2E] hover:bg-[#FAF4E6]'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span>Requests Received</span>
                {incomingRequestsCount > 0 && (
                  <span className="w-4 h-4 bg-[#C2410C] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
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
                    ? 'bg-[#EBF3ED] text-[#234533] font-semibold'
                    : 'text-[#3E4F44] hover:text-[#1E3326] hover:bg-[#F4EFE6]'
                }`}
              >
                <Repeat className="w-4 h-4 text-[#2B6043]" />
                <span>My Swaps</span>
              </button>

              {/* HOW IT WORKS */}
              <button
                onClick={() => setCurrentTab('how-it-works')}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 ${
                  currentTab === 'how-it-works'
                    ? 'bg-[#EBF3ED] text-[#234533] font-semibold'
                    : 'text-[#3E4F44] hover:text-[#1E3326] hover:bg-[#F4EFE6]'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-[#234C3A]" />
                <span>How It Works</span>
              </button>
            </nav>
          )}

          {/* 3. ADMIN MODULE NAVIGATION */}
          {/* Prompt: "next in admin module all the home ,listed items , who sent to whom swaps requests, accepted swap requests, successfull swap request." */}
          {activeModule === 'admin' && (
            <nav className="hidden lg:flex items-center gap-1.5">
              <button
                onClick={() => setCurrentTab('home')}
                className="px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition flex items-center gap-1.5 text-stone-700 hover:bg-stone-100"
              >
                <Home className="w-4 h-4 text-[#234C3A]" />
                <span>Home</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('admin');
                  if (setAdminSubTab) setAdminSubTab('listed-items');
                }}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentTab === 'admin' && adminSubTab === 'listed-items'
                    ? 'bg-[#234C3A] text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Shirt className="w-4 h-4" />
                <span>Listed Items</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('admin');
                  if (setAdminSubTab) setAdminSubTab('who-sent-to-whom');
                }}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentTab === 'admin' && adminSubTab === 'who-sent-to-whom'
                    ? 'bg-[#234C3A] text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Repeat className="w-4 h-4" />
                <span>Who Sent to Whom Swaps</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('admin');
                  if (setAdminSubTab) setAdminSubTab('accepted-swaps');
                }}
                className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
                  currentTab === 'admin' && adminSubTab === 'accepted-swaps'
                    ? 'bg-[#C5A059] text-stone-900 shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100'
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
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100'
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
                className="lg:hidden flex items-center gap-1 bg-[#1C3527] text-white px-3 py-1.5 rounded-lg text-xs font-bold"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#85D49E]" />
                <span>List</span>
              </button>
            )}

            {activeModule === 'buyer' && (
              <button
                onClick={() => {
                  setCurrentTab('marketplace');
                  if (onToggleFilter) onToggleFilter();
                }}
                className="lg:hidden flex items-center gap-1 bg-stone-100 text-stone-800 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
              >
                <Filter className="w-3.5 h-3.5 text-[#234C3A]" />
                <span>Filter</span>
              </button>
            )}

            {/* User Profile / Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-[#DED7C8] hover:bg-[#F2ECE0] transition"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover border border-[#C5BDAE]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                    }}
                  />
                  <div className="text-left hidden md:block">
                    <div className="text-xs font-semibold text-[#1E3326] leading-tight line-clamp-1">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-[#55695D] flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5 text-[#85D49E]" />
                      <span>{user.city}</span>
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                    <div className="px-3.5 py-2 border-b border-stone-100">
                      <p className="font-semibold text-stone-900">{user.name}</p>
                      <p className="text-[11px] text-stone-500">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {user.role === 'admin' ? 'Administrator' : 'Verified Swapper'}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setCurrentTab('home');
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-[#F8F6F0] flex items-center gap-2 text-stone-700"
                      >
                        <Home className="w-4 h-4 text-[#234C3A]" />
                        <span>ReWear Home</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveModule('buyer');
                          setCurrentTab('marketplace');
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-[#F8F6F0] flex items-center gap-2 text-stone-700"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#234C3A]" />
                        <span>Go to Buyer Module</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setActiveModule('seller');
                          setCurrentTab('sell');
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-[#F8F6F0] flex items-center gap-2 text-stone-700"
                      >
                        <Tag className="w-4 h-4 text-[#C5A059]" />
                        <span>Go to Seller Module</span>
                      </button>

                      {user.role === 'admin' && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            setActiveModule('admin');
                            setCurrentTab('admin');
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-amber-50 text-amber-900 flex items-center gap-2 font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Admin Control Center</span>
                        </button>
                      )}
                    </div>

                    <div className="border-t border-stone-100 pt-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                          setCurrentTab('home');
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-rose-50 text-rose-700 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 bg-[#234C3A] hover:bg-[#1A382B] text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center justify-between border-t border-stone-200/80 py-2 text-xs overflow-x-auto scrollbar-none gap-2">
          {activeModule === 'buyer' && (
            <>
              <button
                onClick={() => setCurrentTab('home')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'home' ? 'bg-[#234C3A] text-white font-bold' : 'text-stone-600'}`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentTab('marketplace')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'marketplace' ? 'bg-[#234C3A] text-white font-bold' : 'text-stone-600'}`}
              >
                Browse Clothes
              </button>
              <button
                onClick={() => {
                  if (!user) onOpenAuth();
                  else setCurrentTab('swaps');
                }}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'swaps' ? 'bg-[#234C3A] text-white font-bold' : 'text-stone-600'}`}
              >
                My Swaps
              </button>
              <button
                onClick={() => setCurrentTab('nearby')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'nearby' ? 'bg-[#234C3A] text-white font-bold' : 'text-stone-600'}`}
              >
                Nearby Swaps
              </button>
              <button
                onClick={() => setCurrentTab('how-it-works')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'how-it-works' ? 'bg-[#234C3A] text-white font-bold' : 'text-stone-600'}`}
              >
                How It Works
              </button>
            </>
          )}

          {activeModule === 'seller' && (
            <>
              <button
                onClick={() => setCurrentTab('home')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'home' ? 'bg-[#234C3A] text-white font-bold' : 'text-stone-600'}`}
              >
                Home
              </button>
              <button
                onClick={user ? onOpenCreateListing : onOpenAuth}
                className="px-2.5 py-1 rounded-md whitespace-nowrap bg-[#1C3527] text-white font-bold flex items-center gap-1"
              >
                <PlusCircle className="w-3 h-3 text-[#85D49E]" />
                List Item
              </button>
              <button
                onClick={() => {
                  setCurrentTab('sell');
                  if (setSellerSubTab) setSellerSubTab('requests');
                }}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'sell' && sellerSubTab === 'requests' ? 'bg-[#C5A059] text-stone-900 font-bold' : 'text-stone-600'}`}
              >
                Requests Received
              </button>
              <button
                onClick={() => {
                  setCurrentTab('sell');
                  if (setSellerSubTab) setSellerSubTab('inventory');
                }}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'sell' && sellerSubTab === 'inventory' ? 'bg-[#234C3A] text-white font-bold' : 'text-stone-600'}`}
              >
                My Swaps
              </button>
              <button
                onClick={() => setCurrentTab('how-it-works')}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap ${currentTab === 'how-it-works' ? 'bg-[#234C3A] text-white font-bold' : 'text-stone-600'}`}
              >
                How It Works
              </button>
            </>
          )}

          {activeModule === 'admin' && (
            <>
              <button
                onClick={() => setCurrentTab('home')}
                className="px-2 py-1 rounded-md whitespace-nowrap text-stone-600"
              >
                Home
              </button>
              <button
                onClick={() => {
                  setCurrentTab('admin');
                  if (setAdminSubTab) setAdminSubTab('listed-items');
                }}
                className={`px-2 py-1 rounded-md whitespace-nowrap ${adminSubTab === 'listed-items' ? 'bg-[#234C3A] text-white font-bold' : 'text-stone-600'}`}
              >
                Listed Items
              </button>
              <button
                onClick={() => {
                  setCurrentTab('admin');
                  if (setAdminSubTab) setAdminSubTab('who-sent-to-whom');
                }}
                className={`px-2 py-1 rounded-md whitespace-nowrap ${adminSubTab === 'who-sent-to-whom' ? 'bg-[#234C3A] text-white font-bold' : 'text-stone-600'}`}
              >
                Who Sent to Whom
              </button>
              <button
                onClick={() => {
                  setCurrentTab('admin');
                  if (setAdminSubTab) setAdminSubTab('accepted-swaps');
                }}
                className={`px-2 py-1 rounded-md whitespace-nowrap ${adminSubTab === 'accepted-swaps' ? 'bg-[#C5A059] text-stone-900 font-bold' : 'text-stone-600'}`}
              >
                Accepted
              </button>
              <button
                onClick={() => {
                  setCurrentTab('admin');
                  if (setAdminSubTab) setAdminSubTab('successful-swaps');
                }}
                className={`px-2 py-1 rounded-md whitespace-nowrap ${adminSubTab === 'successful-swaps' ? 'bg-emerald-800 text-white font-bold' : 'text-stone-600'}`}
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
