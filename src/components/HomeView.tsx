import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Shirt,
  Tag,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  Leaf,
  ChevronDown,
  LogIn,
  LogOut,
  Quote,
  CheckCircle2,
  Users,
  Compass,
  Repeat,
  HeartHandshake,
  MapPin,
  Sparkles
} from 'lucide-react';
import { INDIAN_STATE_CAPITALS } from '../data/indiaLocations.ts';

interface HomeViewProps {
  onNavigateToBuy: () => void;
  onNavigateToSell: () => void;
  onNavigateToAdmin: () => void;
  onSelectCityForBuy?: (city: string) => void;
  onOpenAuth: () => void;
  totalListingsCount: number;
  completedSwapsCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateToBuy,
  onNavigateToSell,
  onNavigateToAdmin,
  onSelectCityForBuy,
  onOpenAuth,
  totalListingsCount,
  completedSwapsCount
}) => {
  const { user, logout, switchDemoUser } = useAuth();
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const demoAccounts = [
    { name: 'Priya Sharma', city: 'Bengaluru', email: 'priya@example.com', role: 'user' },
    { name: 'Rahul Patil', city: 'Hubballi', email: 'rahul@example.com', role: 'user' },
    { name: 'Ananya Hegde', city: 'Mysuru', email: 'ananya@example.com', role: 'user' },
    { name: 'Karan Joshi', city: 'Pune', email: 'karan@example.com', role: 'user' },
    { name: 'ReWear Admin', city: 'Bengaluru', email: 'admin@rewear.org', role: 'admin' },
  ];

  const quotes = [
    {
      quote: "The most sustainable garment is the one already in your wardrobe.",
      author: "Orsola de Castro, Fashion Revolution"
    },
    {
      quote: "Give clothes a second life and the planet a little more time.",
      author: "Sustainable Textile Foundation"
    },
    {
      quote: "Swap your style, not your savings.",
      author: "ReWear Circular Fashion Community"
    }
  ];

  const [activeQuoteIdx, setActiveQuoteIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuoteIdx((prev) => (prev + 1) % quotes.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#F3EFE6] font-sans relative z-10">
      {/* 1. PROFESSIONAL LANDING HEADER (Dark Translucent Glass) */}
      <header className="sticky top-0 z-40 bg-[#060E0A]/90 backdrop-blur-md border-b border-[#1A3828] text-[#F3EFE6]">
        {/* Top bar: Demo Switcher for Evaluation */}
        <div className="bg-[#0C1E15] text-[#DCEAE1] px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-[#1A3828]">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse"></span>
            <span className="font-medium text-[#FAF8F3]">ReWear • 100% Cashless Clothing Exchange</span>
            <span className="hidden md:inline text-[#8CE2A8]">• 28 Indian State Capitals Supported</span>
          </div>

          <div className="relative mx-auto sm:mx-0 flex items-center gap-2">
            <span className="text-[#8CE2A8] text-[11px] font-medium hidden sm:inline">Active Persona:</span>
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="flex items-center gap-1.5 bg-[#173B2B] hover:bg-[#204E3A] px-2.5 py-0.5 rounded text-[11px] font-medium text-white transition border border-[#2D6348]"
              title="Switch demo account to test Sell, Buy, or Admin"
            >
              <Sparkles className="w-3 h-3 text-[#E5C175]" />
              <span>{user ? `${user.name} (${user.city})` : 'Guest Visitor (Not Logged In)'}</span>
              <ChevronDown className="w-3 h-3 text-[#8CE2A8]" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 top-7 w-64 bg-[#FAF7F0] text-gray-800 rounded-xl shadow-2xl border border-[#E5DFD4] py-2 z-50 animate-in fade-in">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-stone-500 uppercase tracking-wider border-b border-[#E8E2D5]">
                  Select Test Account
                </div>
                {demoAccounts.map(demo => (
                  <button
                    key={demo.email}
                    onClick={() => {
                      switchDemoUser(demo.email);
                      setShowDemoMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#EFE9DC] transition ${
                      user?.email === demo.email ? 'bg-[#E5EFE7] font-semibold text-[#1A3D2C]' : 'text-stone-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{demo.name}</span>
                        {demo.role === 'admin' && (
                          <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 rounded font-bold">Admin</span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-500">{demo.city} • {demo.email}</div>
                    </div>
                    {user?.email === demo.email && (
                      <span className="w-2 h-2 rounded-full bg-[#1A3D2C]"></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo, Brand & Tagline */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E523A] to-[#143B28] flex items-center justify-center text-white shadow-md border border-[#2D6348]">
                <Shirt className="w-5 h-5 text-[#8CE2A8]" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-serif block leading-none">
                  ReWear
                </span>
                <span className="text-[11px] font-medium text-[#A6C4B4] block mt-0.5">
                  Wear More. Waste Less.
                </span>
              </div>
            </div>

            {/* Public Links: About, How It Works, Sustainability (NO individual browsing here) */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#C1D7CA]">
              <button
                onClick={() => scrollToSection('about')}
                className="hover:text-white transition py-1"
              >
                About ReWear
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="hover:text-white transition py-1"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection('capitals')}
                className="hover:text-white transition py-1 flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5 text-[#34D399]" />
                <span>28 State Capitals</span>
              </button>
              <button
                onClick={() => scrollToSection('sustainability')}
                className="hover:text-white transition py-1"
              >
                Sustainability
              </button>
            </nav>

            {/* User Profile or Login */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-[#2D6348] hover:bg-[#153424] transition bg-[#0F261B]/80 text-white"
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover border border-[#34D399]/40"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                    <div className="text-left hidden sm:block">
                      <div className="text-xs font-semibold text-white line-clamp-1">{user.name}</div>
                      <div className="text-[10px] text-[#8CE2A8]">{user.city}</div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#8CE2A8]" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-12 w-52 bg-[#FAF7F0] rounded-xl shadow-2xl border border-[#E5DFD4] py-1.5 z-50 text-xs text-stone-800 animate-in fade-in">
                      <div className="px-3 py-2 border-b border-[#E8E2D5]">
                        <p className="font-semibold text-stone-900">{user.name}</p>
                        <p className="text-[11px] text-stone-500">{user.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigateToSell();
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-[#EFE9DC] text-stone-700 flex items-center gap-2"
                      >
                        <Tag className="w-4 h-4 text-[#1A3D2C]" />
                        <span>Sell Clothes Dashboard</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigateToBuy();
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-[#EFE9DC] text-stone-700 flex items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4 text-[#1A3D2C]" />
                        <span>Buy Clothes Dashboard</span>
                      </button>

                      {user.role === 'admin' && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onNavigateToAdmin();
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-amber-50 text-amber-900 flex items-center gap-2 font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-700" />
                          <span>Admin Control Center</span>
                        </button>
                      )}

                      <div className="border-t border-[#E8E2D5] my-1"></div>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-rose-50 text-rose-700 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 bg-[#1B5239] hover:bg-[#256B4B] text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition shadow-md border border-[#34D399]/40"
                >
                  <LogIn className="w-4 h-4 text-[#8CE2A8]" />
                  <span>Sign In / Register</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-12 sm:pt-14 sm:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#123624] via-[#0E281B] to-[#0A1A12] text-white p-8 sm:p-14 lg:p-16 shadow-2xl overflow-hidden border border-[#2D6348]">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#184630]/80 text-[#8CE2A8] text-xs font-semibold uppercase tracking-wider border border-[#2D6348]">
              <Leaf className="w-3.5 h-3.5 text-[#34D399]" />
              <span>Sustainable Circular Wardrobe</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#FAF8F4] leading-[1.12]">
              Your Wardrobe <br />
              <span className="italic font-normal text-[#E5C175]">Deserves a Second Life.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#D4E3D8] leading-relaxed max-w-2xl font-normal">
              Give unused clothes a new home and discover fresh styles through direct 1-to-1 clothing exchange.
              Connect with fellow swappers across all 28 Indian state capitals—without spending a single rupee.
            </p>

            {/* Clean Module Entry Triggers with Compulsory Authentication */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onNavigateToSell}
                className="bg-[#E5C175] hover:bg-[#D4AF57] text-[#0A1B13] font-bold px-7 py-3.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center gap-2"
              >
                <Tag className="w-4 h-4 text-[#0A1B13]" />
                <span>Sell Clothes</span>
              </button>

              <button
                onClick={onNavigateToBuy}
                className="bg-[#1E523A] hover:bg-[#286B4C] text-white font-semibold px-7 py-3.5 rounded-xl border border-[#34D399]/40 transition transform hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center gap-2 shadow-md"
              >
                <ShoppingBag className="w-4 h-4 text-[#8CE2A8]" />
                <span>Buy Clothes</span>
              </button>
            </div>

            <div className="pt-6 border-t border-[#23583F] grid grid-cols-3 gap-4 text-xs text-[#A7C8B6]">
              <div>
                <span className="block text-xl sm:text-2xl font-bold font-serif text-white">{totalListingsCount}+</span>
                <span>Active Garments</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold font-serif text-white">28 States</span>
                <span>All Capitals Covered</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-bold font-serif text-white">{completedSwapsCount}+</span>
                <span>Swaps Completed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE MAIN MODULE ENTRY CARDS (Cream / Off-White Boxes with Cursor Hover Popup Effect) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#34D399]">
            Select Your Workspace
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            Choose Your ReWear Experience
          </h2>
          <p className="text-xs sm:text-sm text-[#A7C8B6]">
            Select one of the three dedicated modules below to list your clothes, explore garments for barter, or access administrative management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* CARD 1: SELL CLOTHES (Cream Box with Highlighted Popup on Cursor Hover) */}
          <div
            onClick={onNavigateToSell}
            className="group relative bg-[#FAF7F0] rounded-3xl p-7 border border-[#E5DFD4] shadow-2xl hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(52,211,153,0.25)] hover:border-[#34D399] hover:ring-2 hover:ring-[#34D399]/70 transition-all duration-300 cursor-pointer flex flex-col justify-between text-[#1E2922]"
          >
            {/* Highlighted Popup Badge on Hover */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-[#102B1D] text-[#8CE2A8] text-[11px] font-bold rounded-full shadow-xl border border-[#34D399] opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none flex items-center gap-1.5 whitespace-nowrap z-20">
              <Sparkles className="w-3 h-3 text-[#E5C175]" />
              <span>Click to Enter Sell Clothes →</span>
            </div>

            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#E7F0E9] text-[#1E523A] flex items-center justify-center group-hover:bg-[#1E523A] group-hover:text-white transition-colors duration-300 shadow-inner">
                <Tag className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-[#14261B] group-hover:text-[#1E523A] transition">
                  Sell Clothes
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                List your pre-loved clothing, connect with interested users, and manage your swap requests.
                Upload garment photos, set recommended swap values, and accept barter proposals.
              </p>

              <div className="space-y-2 pt-2 border-t border-[#E8E2D5] text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1E523A]" />
                  <span>Dedicated Seller Wardrobe Studio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1E523A]" />
                  <span>Incoming Swap Requests Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1E523A]" />
                  <span>Approximate Delivery Date Scheduling</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToSell();
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#1E523A] group-hover:bg-[#143B28] text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md"
              >
                <span>Enter Sell Module</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* CARD 2: BUY CLOTHES (Cream Box with Highlighted Popup on Cursor Hover) */}
          <div
            onClick={onNavigateToBuy}
            className="group relative bg-[#FAF7F0] rounded-3xl p-7 border border-[#E5DFD4] shadow-2xl hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(52,211,153,0.25)] hover:border-[#34D399] hover:ring-2 hover:ring-[#34D399]/70 transition-all duration-300 cursor-pointer flex flex-col justify-between text-[#1E2922]"
          >
            {/* Highlighted Popup Badge on Hover */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-[#102B1D] text-[#8CE2A8] text-[11px] font-bold rounded-full shadow-xl border border-[#34D399] opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none flex items-center gap-1.5 whitespace-nowrap z-20">
              <Sparkles className="w-3 h-3 text-[#E5C175]" />
              <span>Click to Enter Buy Clothes →</span>
            </div>

            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#EBF3ED] text-[#286B4C] flex items-center justify-center group-hover:bg-[#286B4C] group-hover:text-white transition-colors duration-300 shadow-inner">
                <ShoppingBag className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-[#14261B] group-hover:text-[#286B4C] transition">
                  Buy Clothes
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Discover clothing available for exchange, find suitable matches, and request swaps with other users.
                Filter by category, size, condition, and all 28 Indian state capitals without cash checkout.
              </p>

              <div className="space-y-2 pt-2 border-t border-[#E8E2D5] text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#286B4C]" />
                  <span>Exchange-Only Discovery Marketplace</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#286B4C]" />
                  <span>Fair-Trade Value Parity Matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#286B4C]" />
                  <span>Approximate Swap Delivery Date Target</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToBuy();
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#286B4C] group-hover:bg-[#1E523A] text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md"
              >
                <span>Explore Clothes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* CARD 3: ADMIN (Cream Box with Highlighted Popup on Cursor Hover) */}
          <div
            onClick={onNavigateToAdmin}
            className="group relative bg-[#FAF7F0] rounded-3xl p-7 border border-[#E5DFD4] shadow-2xl hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(245,158,11,0.25)] hover:border-amber-500 hover:ring-2 hover:ring-amber-500/70 transition-all duration-300 cursor-pointer flex flex-col justify-between text-[#1E2922]"
          >
            {/* Highlighted Popup Badge on Hover */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-[#2C1F0E] text-amber-300 text-[11px] font-bold rounded-full shadow-xl border border-amber-500 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none flex items-center gap-1.5 whitespace-nowrap z-20">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Click to Enter Admin Control →</span>
            </div>

            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#F4EFE6] text-stone-800 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-colors duration-300 shadow-inner">
                <ShieldCheck className="w-7 h-7 text-amber-700 group-hover:text-amber-400" />
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-[#14261B] group-hover:text-stone-900 transition">
                  Admin
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Manage platform users, listings, swap requests, reports, and community safety.
                Oversee platform health, inspect swap audit trails, and moderate garment content.
              </p>

              <div className="space-y-2 pt-2 border-t border-[#E8E2D5] text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-stone-700" />
                  <span>Restricted Administrator Controls</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-stone-700" />
                  <span>Who Sent to Whom Audit Real-Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-stone-700" />
                  <span>Accepted & Successful Swap Audits</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToAdmin();
                }}
                className="w-full py-3 px-4 rounded-xl bg-stone-900 group-hover:bg-black text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md"
              >
                <span>Open Admin Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ALL 28 INDIAN STATE CAPITALS COVERAGE (Informational, No Direct Clothes Browsing on Home Page) */}
      <section id="capitals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-[#0B1E14]/90 rounded-3xl p-6 sm:p-10 border border-[#23583F] shadow-2xl backdrop-blur-md">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#34D399] uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#34D399]" />
              <span>Pan-India Sustainable Exchange Network</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
              Supported Across All 28 Indian States & Capital Cities
            </h3>
            <p className="text-xs text-[#A7C8B6] mt-1 max-w-2xl">
              From local landmark handoffs to inter-state parcel exchanges, ReWear connects conscious fashion lovers in all official Indian state capitals.
            </p>
          </div>

          {/* Grid of all 28 Capital Cities */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {INDIAN_STATE_CAPITALS.map((sc) => (
              <div
                key={sc.no}
                className="p-2.5 rounded-xl bg-[#143323]/80 border border-[#23583F] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#8CE2A8]">#{sc.no}</span>
                  <MapPin className="w-3 h-3 text-[#34D399] opacity-75" />
                </div>
                <div className="mt-1">
                  <span className="block text-xs font-bold text-white line-clamp-1">
                    {sc.capital}
                  </span>
                  <span className="block text-[10px] text-[#8CA58A] line-clamp-1">
                    {sc.state}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SUSTAINABILITY QUOTES SECTION (Cream Box) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-[#FAF7F0] rounded-3xl p-8 sm:p-10 border border-[#E5DFD4] text-center shadow-2xl text-[#1E2922] relative">
          <Quote className="w-8 h-8 text-[#1E523A] mx-auto mb-3 opacity-70" />
          <div className="min-h-[70px] flex flex-col justify-center">
            <p className="text-lg sm:text-2xl font-serif italic text-stone-900 transition-all duration-300 leading-snug">
              "{quotes[activeQuoteIdx].quote}"
            </p>
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500 mt-3">
              — {quotes[activeQuoteIdx].author}
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 mt-5">
            {quotes.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveQuoteIdx(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === activeQuoteIdx ? 'w-6 bg-[#1E523A]' : 'w-2 bg-stone-300'
                }`}
                aria-label={`Go to quote ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW REWEAR WORKS (6-Step Visual Process - Cream Cards) */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#1C3A2A]">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[#34D399]">
            Simple Circular Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            How ReWear Works
          </h2>
          <p className="text-xs sm:text-sm text-[#A7C8B6]">
            Six effortless steps to refresh your closet with zero cash and zero textile waste.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {[
            {
              step: '01',
              title: 'Choose Your Module',
              desc: 'Select Sell Clothes to list items from your wardrobe, or Buy Clothes to discover pieces available for trade.',
              icon: Compass
            },
            {
              step: '02',
              title: 'List or Discover',
              desc: 'Upload clear photos and descriptions of your garments, or explore authenticated pre-loved pieces.',
              icon: Shirt
            },
            {
              step: '03',
              title: 'Send / Receive Request',
              desc: 'Propose an item-for-item barter match with target delivery/meetup date and fair value parity analysis.',
              icon: Repeat
            },
            {
              step: '04',
              title: 'Negotiate & Agree',
              desc: 'Coordinate fitting nuances, delivery dates, and handoff preferences in a private swap chat thread.',
              icon: HeartHandshake
            },
            {
              step: '05',
              title: 'Exchange Items',
              desc: 'Meet safely at a public landmark or arrange doorstep courier delivery on the scheduled date.',
              icon: Users
            },
            {
              step: '06',
              title: 'Give Clothes New Life',
              desc: 'Both participants confirm mutual receipt. Your closet is renewed with zero money spent!',
              icon: Sparkles
            }
          ].map((item) => (
            <div
              key={item.step}
              className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#E5DFD4] shadow-xl hover:border-[#1E523A] transition relative text-stone-900"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-[#1E523A] bg-[#E7F0E9] px-2.5 py-1 rounded-md">
                  Step {item.step}
                </span>
                <item.icon className="w-5 h-5 text-[#1E523A]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-stone-900 mb-1.5">{item.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. SUSTAINABILITY IMPACT SECTION */}
      <section id="sustainability" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#1C3A2A]">
        <div id="about" className="bg-gradient-to-br from-[#123624] via-[#0E281B] to-[#0A1A12] text-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-[#2D6348]">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-[#34D399]">
              Environmental Responsibility
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#FAF8F4]">
              Clothing Exchange Reduces Textile Waste
            </h2>
            <p className="text-xs sm:text-sm text-[#D4E3D8] leading-relaxed">
              Every year, millions of wearable garments end up in landfills while fast fashion consumes thousands of liters of clean water. ReWear champions circular fashion where existing garments circulate continuously from closet to closet across all Indian state capitals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-[#0B1E14]/80 p-6 rounded-2xl border border-[#23583F]">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1">
                {totalListingsCount} Garments
              </div>
              <p className="text-xs text-[#A7C8B6]">
                Active pre-loved clothes circulating in the peer-to-peer exchange loop nationwide.
              </p>
            </div>

            <div className="bg-[#0B1E14]/80 p-6 rounded-2xl border border-[#23583F]">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1">
                100% Cashless
              </div>
              <p className="text-xs text-[#A7C8B6]">
                Pure item-for-item barter. Zero online payment barriers or mandatory transaction commissions.
              </p>
            </div>

            <div className="bg-[#0B1E14]/80 p-6 rounded-2xl border border-[#23583F]">
              <div className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1">
                28 Capitals
              </div>
              <p className="text-xs text-[#A7C8B6]">
                Active swapping circles across all 28 official Indian state capitals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-[#050C08] text-[#D4E3D8] border-t border-[#1C3A2A] mt-16 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#1E523A] flex items-center justify-center text-white">
                  <Shirt className="w-4 h-4 text-[#8CE2A8]" />
                </div>
                <span className="text-xl font-serif font-bold text-white">ReWear</span>
              </div>
              <p className="text-xs text-[#A7C8B6] max-w-md leading-relaxed">
                A sustainable, 100% cashless clothing exchange marketplace. Swap styles, renew wardrobes,
                and eliminate textile waste through direct peer-to-peer clothing bartering across India.
              </p>
              <p className="text-[11px] text-[#7A9E8A] pt-2">
                © {new Date().getFullYear()} ReWear. Sustainable Fashion Initiative.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h4>
              <ul className="space-y-1.5 text-xs text-[#A7C8B6]">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition">About ReWear</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition">How It Works</button></li>
                <li><button onClick={() => scrollToSection('capitals')} className="hover:text-white transition">28 State Capitals</button></li>
                <li><button onClick={() => scrollToSection('sustainability')} className="hover:text-white transition">Sustainability</button></li>
                <li><button onClick={onNavigateToSell} className="hover:text-white transition">Sell Clothes</button></li>
                <li><button onClick={onNavigateToBuy} className="hover:text-white transition">Buy Clothes</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Guidelines & Safety</h4>
              <ul className="space-y-1.5 text-xs text-[#A7C8B6]">
                <li><span>Local Meetup Safety in Capital Hubs</span></li>
                <li><span>Fair Trade Parity Standard</span></li>
                <li><span>Community Guidelines</span></li>
                <li><span>Terms of Service & Privacy</span></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
