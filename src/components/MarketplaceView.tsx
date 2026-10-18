import React, { useState, useMemo, useRef } from 'react';
import { ClothingListing, ClothingCategory, ClothingCondition, ClothingSize } from '../types.ts';
import {
  Search,
  Filter,
  MapPin,
  Tag,
  ArrowRightLeft,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Clock,
  Shirt,
  Leaf,
  Layers,
  Info,
  ChevronRight,
  TrendingUp,
  Award,
  RefreshCw,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { INDIAN_STATE_CAPITALS, ALL_28_CAPITAL_CITIES } from '../data/indiaLocations.ts';

interface MarketplaceViewProps {
  listings: ClothingListing[];
  isLoading: boolean;
  onSelectItem: (item: ClothingListing) => void;
  onProposeSwap: (item: ClothingListing) => void;
  onOpenCreateListing?: () => void;
  selectedCityFilter?: string;
  onCityFilterChange?: (city: string) => void;
  onGoToHowItWorks?: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  listings,
  isLoading,
  onSelectItem,
  onProposeSwap,
  selectedCityFilter,
  onCityFilterChange,
  onGoToHowItWorks
}) => {
  const { user } = useAuth();
  const listingsGridRef = useRef<HTMLDivElement>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [cityFilter, setCityFilter] = useState<string>(selectedCityFilter || 'All');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'value_asc' | 'value_desc'>('newest');

  const categories = [
    'Shirts & Tops',
    'Dresses & Tops',
    'Jeans & Trousers',
    'Jackets & Hoodies',
    'Traditional & Ethnic Wear',
    'Knitwear & Sweaters'
  ];

  const conditions = [
    'Brand New with Tags',
    'Like New',
    'Gently Used',
    'Well Loved'
  ];

  const sizes = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'Free Size'
  ];

  const cities = ['All', 'Hubballi', 'Bengaluru', 'Mysuru', 'Pune'];

  const fallbackImage = 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80';

  const handleCityChange = (city: string) => {
    setCityFilter(city);
    if (onCityFilterChange) {
      onCityFilterChange(city);
    }
  };

  const scrollToGrid = () => {
    listingsGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesBrand = item.brand.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesCity = item.city.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBrand && !matchesDesc && !matchesCategory && !matchesCity) {
          return false;
        }
      }

      // Category matching
      if (selectedCategory !== 'All') {
        const catA = item.category.toLowerCase();
        const catB = selectedCategory.toLowerCase();
        if (catA !== catB && !catA.includes(catB.split(' ')[0])) {
          return false;
        }
      }

      // Condition
      if (selectedCondition !== 'All' && item.condition !== selectedCondition) {
        return false;
      }

      // Size
      if (selectedSize !== 'All' && item.size !== selectedSize) {
        return false;
      }

      // City
      if (cityFilter !== 'All' && item.city.toLowerCase() !== cityFilter.toLowerCase()) {
        return false;
      }

      // Availability
      if (availabilityFilter === 'available_only' && item.status !== 'available') {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'value_asc') return a.estimatedValue - b.estimatedValue;
      if (sortBy === 'value_desc') return b.estimatedValue - a.estimatedValue;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [listings, searchTerm, selectedCategory, selectedCondition, selectedSize, cityFilter, availabilityFilter, sortBy]);

  // Featured 4 items
  const featuredListings = useMemo(() => {
    return listings.slice(0, 4);
  }, [listings]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedCondition('All');
    setSelectedSize('All');
    handleCityChange('All');
    setAvailabilityFilter('all');
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'All' ||
    selectedCondition !== 'All' ||
    selectedSize !== 'All' ||
    cityFilter !== 'All' ||
    availabilityFilter !== 'all';

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E3B2C] via-[#244A37] to-[#162C20] text-[#FAF7F2] p-8 sm:p-12 lg:p-16 shadow-xl border border-[#345944]">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#3F7556]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 -top-24 w-80 h-80 bg-[#E8C288]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#355B45]/80 text-[#B8E7C8] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#48755B]">
            <ShoppingBag className="w-3.5 h-3.5 text-[#85D49E]" />
            BUY CLOTHES MODULE • 100% Cashless Clothing Barter
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-tight leading-[1.15] text-[#FAF8F3]">
            Explore Clothes. <br />
            <span className="italic font-normal text-[#CDE6D5]">Renew wardrobes.</span> <br />
            Zero cash paid.
          </h1>

          <p className="mt-5 text-xs sm:text-base text-[#D0E2D6] leading-relaxed max-w-2xl">
            Give cherished clothes a second life without spending a single rupee. Exchange authentic shirts,
            dresses, denim, jackets, kurtas, and sarees directly with fashion lovers across Hubballi, Bengaluru, Mysuru, and Pune.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={scrollToGrid}
              className="bg-[#FAF7F0] hover:bg-white text-[#1E3B2C] font-bold px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 text-xs sm:text-sm border border-[#E5DFD4]"
            >
              <Shirt className="w-4 h-4 text-[#2A5C41]" />
              Explore Clothes ({listings.length} Available)
            </button>

            <div className="flex items-center gap-4 sm:gap-6 text-xs text-[#BED8C8] pl-1 sm:pl-2 pt-2 sm:pt-0">
              <div>
                <span className="block text-lg font-bold text-white font-serif">100%</span>
                <span>Zero Cash</span>
              </div>
              <div className="w-px h-8 bg-[#3E654E]"></div>
              <div>
                <span className="block text-lg font-bold text-white font-serif">{listings.length}+</span>
                <span>Garments</span>
              </div>
              <div className="w-px h-8 bg-[#3E654E]"></div>
              <div>
                <span className="block text-lg font-bold text-white font-serif">4 Hubs</span>
                <span>KA & MH</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Clothing Products Row */}
      {featuredListings.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#2C573F]" />
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C3326]">
                Featured Clothing Pieces
              </h2>
            </div>
            <button
              onClick={scrollToGrid}
              className="text-xs font-semibold text-[#2C573F] hover:underline flex items-center gap-1"
            >
              <span>View all {listings.length} garments</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredListings.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group bg-[#FAF7F0] rounded-2xl border border-[#E5DFD4] overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-[#F1EDE4] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackImage;
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-700/90 text-white backdrop-blur-sm">
                      Featured Barter
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded backdrop-blur-sm font-semibold">
                    Size: {item.size}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold uppercase tracking-wider text-[#2B5E43] truncate max-w-[120px]">
                      {item.brand}
                    </span>
                    <span className="text-stone-500 flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-[#2B5E43]" /> {item.city}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-sm truncate group-hover:text-[#2C573F] transition">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-stone-600 pt-1 border-t border-[#F0EBE0]">
                    <span className="font-bold text-[#1C3326]">≈ ₹{item.estimatedValue} Parity</span>
                    <span className="text-stone-400 text-[11px]">{item.condition}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Search and Filters Hub */}
      <section ref={listingsGridRef} className="bg-[#FAF7F0] rounded-3xl p-5 sm:p-7 shadow-sm border border-[#E5DFD4] space-y-5">
        {/* Top Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by title, brand (Levi's, FabIndia, Zara...), city or fabric..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-[#DDD6C7] bg-[#FAF9F6] text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#2C573F] text-xs sm:text-sm transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs px-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick City Dropdown with 28 State Capitals */}
          <div className="relative min-w-[210px]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2B5E43]" />
            <select
              value={cityFilter}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#DDD6C7] bg-[#FAF9F6] text-stone-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2C573F] cursor-pointer"
            >
              <option value="All">All Cities across India</option>
              <optgroup label="28 Capital Cities of Indian States">
                {INDIAN_STATE_CAPITALS.map((sc) => (
                  <option key={sc.no} value={sc.capital}>
                    {sc.capital} ({sc.state})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Other Fashion Circles">
                <option value="Hubballi">Hubballi (Karnataka)</option>
                <option value="Mysuru">Mysuru (Karnataka)</option>
                <option value="Pune">Pune (Maharashtra)</option>
              </optgroup>
            </select>
          </div>

          {/* Sort By */}
          <div className="min-w-[170px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#DDD6C7] bg-[#FAF9F6] text-stone-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2C573F] cursor-pointer"
            >
              <option value="newest">Recently Added</option>
              <option value="value_desc">Estimated Value: High to Low</option>
              <option value="value_asc">Estimated Value: Low to High</option>
            </select>
          </div>
        </div>

        {/* 28 Indian State Capitals Quick Filter Strip */}
        <div className="space-y-1.5 pt-1 border-t border-[#F0EBE0]">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2B5E43]" />
              28 Indian State Capitals
            </span>
            {cityFilter !== 'All' && (
              <button
                onClick={() => handleCityChange('All')}
                className="text-[#2C573F] font-medium lowercase text-[11px]"
              >
                Clear city filter ({cityFilter})
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-xs">
            <button
              onClick={() => handleCityChange('All')}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                cityFilter === 'All'
                  ? 'bg-[#1C3527] text-white font-semibold'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              All India
            </button>
            {INDIAN_STATE_CAPITALS.map((sc) => (
              <button
                key={sc.no}
                onClick={() => handleCityChange(sc.capital)}
                className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition flex items-center gap-1 ${
                  cityFilter.toLowerCase() === sc.capital.toLowerCase()
                    ? 'bg-[#234C3A] text-white font-semibold shadow-xs'
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

        {/* Category Pills Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider">
            <span>Garment Category</span>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-[#2C573F] font-medium lowercase"
              >
                Reset category
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === 'All'
                  ? 'bg-[#234533] text-white shadow-sm font-semibold'
                  : 'bg-[#F2ECE1] text-stone-700 hover:bg-[#EAE2D4]'
              }`}
            >
              All Items ({listings.length})
            </button>
            {categories.map((cat) => {
              const count = listings.filter(l => l.category.toLowerCase().includes(cat.toLowerCase().split(' ')[0])).length;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-[#234533] text-white shadow-sm font-semibold'
                      : 'bg-[#F2ECE1] text-stone-700 hover:bg-[#EAE2D4]'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-Filters: Size, Condition, Availability */}
        <div className="pt-2 border-t border-[#EFE9DD] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-semibold text-stone-600 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              Refine:
            </span>

            {/* Condition Filter */}
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#DDD6C7] bg-[#FAF9F6] text-stone-700 cursor-pointer"
            >
              <option value="All">Any Condition</option>
              {conditions.map(cond => (
                <option key={cond} value={cond}>{cond}</option>
              ))}
            </select>

            {/* Size Filter */}
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#DDD6C7] bg-[#FAF9F6] text-stone-700 cursor-pointer"
            >
              <option value="All">Any Size</option>
              {sizes.map(sz => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>

            {/* Availability Toggle */}
            <button
              onClick={() => setAvailabilityFilter(availabilityFilter === 'available_only' ? 'all' : 'available_only')}
              className={`px-3 py-1.5 rounded-lg border transition font-medium flex items-center gap-1 ${
                availabilityFilter === 'available_only'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-[#FAF9F6] text-stone-600 border-[#DDD6C7]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Available Only
            </button>
          </div>

          {/* Reset Filters CTA if any active */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-stone-500 hover:text-rose-600 flex items-center gap-1 font-medium transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear all filters
            </button>
          )}
        </div>
      </section>

      {/* 4. Results Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C3326]">
            {selectedCategory === 'All' ? 'Complete Clothing Marketplace' : selectedCategory}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Displaying {filteredListings.length} {filteredListings.length === 1 ? 'garment' : 'garments'} available for barter swap
            {cityFilter !== 'All' ? ` in ${cityFilter}` : ''}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero Commission Barter</span>
        </div>
      </div>

      {/* 5. Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3 animate-pulse">
              <div className="aspect-[3/4] bg-stone-200 rounded-xl"></div>
              <div className="h-4 bg-stone-200 rounded w-2/3"></div>
              <div className="h-3 bg-stone-200 rounded w-1/2"></div>
              <div className="h-8 bg-stone-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Empty State */}
      {!isLoading && filteredListings.length === 0 && (
        <div className="bg-[#FAF7F0] rounded-3xl border border-dashed border-[#D5CDC0] p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#F3EFE6] text-[#2C573F] flex items-center justify-center mx-auto shadow-inner">
            <Shirt className="w-8 h-8 opacity-60" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif text-[#1E3326]">No clothing items match your criteria</h3>
            <p className="text-xs text-stone-500 mt-1">
              Try adjusting your city filter, category, or search keywords to discover more wardrobe pieces.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 bg-[#234533] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#1B3527] transition shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        </div>
      )}

      {/* 7. Product Grid (3–4 cards per row desktop, 1–2 on mobile) */}
      {!isLoading && filteredListings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredListings.map((item) => {
            const isOwner = user?.id === item.userId;
            const isAvailable = item.status === 'available';

            return (
              <div
                key={item.id}
                className="group bg-[#FAF7F0] rounded-2xl border border-[#E5DFD4] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Photo & Badges */}
                <div
                  className="relative aspect-[3/4] bg-[#F1EDE4] overflow-hidden cursor-pointer"
                  onClick={() => onSelectItem(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackImage;
                    }}
                  />

                  {/* Top Status & Condition */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md shadow-sm ${
                        item.status === 'available'
                          ? 'bg-emerald-600/90 text-white'
                          : item.status === 'pending'
                          ? 'bg-amber-600/90 text-white'
                          : 'bg-stone-700/90 text-white'
                      }`}
                    >
                      {item.status === 'available' && 'Available'}
                      {item.status === 'pending' && 'Pending Swap'}
                      {item.status === 'swapped' && 'Swapped'}
                    </span>

                    <span className="text-[10px] font-semibold bg-white/90 text-stone-800 px-2 py-0.5 rounded-md backdrop-blur-md shadow-sm">
                      {item.condition}
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-white">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                      Size: {item.size}
                    </span>
                    <span className="text-xs font-semibold flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      <MapPin className="w-3 h-3 text-[#A4E3B8]" />
                      {item.city}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Brand & Category */}
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                      <span className="font-semibold text-[#2C573F] uppercase tracking-wider text-[11px]">
                        {item.brand}
                      </span>
                      <span className="text-[11px] text-stone-400">{item.category}</span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => onSelectItem(item)}
                      className="font-serif font-bold text-[#1B3124] text-base leading-snug line-clamp-1 hover:text-[#2E6647] cursor-pointer transition"
                      title={item.title}
                    >
                      {item.title}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Parity & Owner row */}
                  <div className="pt-2 border-t border-[#F0EBE0] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] text-stone-500 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#2C573F]" />
                        <span>Swap Reference:</span>
                      </div>
                      <span className="text-xs font-bold text-[#1C3326] bg-[#EBF3ED] px-2 py-0.5 rounded border border-[#CDE1D2]">
                        ≈ ₹{item.estimatedValue.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-600">
                      <div className="flex items-center gap-1.5 truncate">
                        <div className="w-5 h-5 rounded-full bg-[#2C573F] text-white text-[10px] flex items-center justify-center font-bold">
                          {item.userName[0]}
                        </div>
                        <span className="truncate text-[11px]">{item.userName}</span>
                      </div>
                      {isOwner && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Your Closet
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => onSelectItem(item)}
                      className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl border border-[#D5CDC0] text-stone-700 hover:bg-[#FAF8F5] transition text-center"
                    >
                      Details
                    </button>

                    {!isOwner ? (
                      <button
                        onClick={() => onProposeSwap(item)}
                        disabled={!isAvailable}
                        className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition ${
                          isAvailable
                            ? 'bg-[#234533] hover:bg-[#183124] text-white shadow-sm'
                            : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>Swap</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectItem(item)}
                        className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-center"
                      >
                        Manage
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 8. How Swapping Works Section Directly on Home */}
      <section className="bg-[#FAF7F0] rounded-3xl p-8 sm:p-10 border border-[#E5DFD4] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#245037]">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              How Swapping Works
            </h2>
          </div>
          {onGoToHowItWorks && (
            <button
              onClick={onGoToHowItWorks}
              className="text-xs font-bold text-[#234533] hover:underline flex items-center gap-1"
            >
              <span>Read Full Guide</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <div className="p-4 bg-[#F5F2EB] rounded-2xl border border-[#ECE5D8] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
              01
            </div>
            <h4 className="font-serif font-bold text-sm text-stone-900">Explore & Discover</h4>
            <p className="text-xs text-stone-600">
              Browse pre-loved shirts, jackets, kurtas, or sarees available for exchange across all 28 state capitals.
            </p>
          </div>

          <div className="p-4 bg-[#F5F2EB] rounded-2xl border border-[#ECE5D8] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
              02
            </div>
            <h4 className="font-serif font-bold text-sm text-stone-900">Propose a Trade</h4>
            <p className="text-xs text-stone-600">
              Pick an item you like and offer one from your closet. Specify your target approximate delivery date.
            </p>
          </div>

          <div className="p-4 bg-[#F5F2EB] rounded-2xl border border-[#ECE5D8] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
              03
            </div>
            <h4 className="font-serif font-bold text-sm text-stone-900">Chat & Coordinate</h4>
            <p className="text-xs text-stone-600">
              Negotiate in private chat. Agree on a public landmark meetup or arrange reliable courier delivery.
            </p>
          </div>

          <div className="p-4 bg-[#F5F2EB] rounded-2xl border border-[#ECE5D8] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#234533] text-white font-bold flex items-center justify-center text-xs">
              04
            </div>
            <h4 className="font-serif font-bold text-sm text-stone-900">Confirm Receipt</h4>
            <p className="text-xs text-stone-600">
              Inspect your item and confirm completion in the app. Both wardrobes get renewed with zero cash!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
