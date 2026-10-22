import React, { useState, useMemo, useRef } from 'react';
import { ClothingListing } from '../types.ts';
import {
  Search,
  Filter,
  MapPin,
  Tag,
  ArrowRightLeft,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Shirt,
  ChevronRight,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { INDIAN_STATE_CAPITALS } from '../data/indiaLocations.ts';
import { getSafeImageUrl, handleImageError } from '../utils/imageFallback.ts';

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

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'Free Size'];

  // Keep internal city state synchronized with parent if updated from outside
  const handleCityChange = (city: string) => {
    setCityFilter(city);
    if (onCityFilterChange) {
      onCityFilterChange(city);
    }
  };

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // 1. Availability Filter
      if (availabilityFilter === 'available_only' && item.status !== 'available') {
        return false;
      }

      // 2. Category Filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Condition Filter
      if (selectedCondition !== 'All' && item.condition !== selectedCondition) {
        return false;
      }

      // 4. Size Filter
      if (selectedSize !== 'All' && item.size !== selectedSize) {
        return false;
      }

      // 5. City Filter
      if (cityFilter !== 'All' && item.city.toLowerCase() !== cityFilter.toLowerCase()) {
        return false;
      }

      // 6. Search Term (title, brand, category, description, city)
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesBrand = item.brand.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesDesc = (item.description || '').toLowerCase().includes(query);
        const matchesCity = item.city.toLowerCase().includes(query);
        const matchesMaterial = (item.material || '').toLowerCase().includes(query);

        if (!matchesTitle && !matchesBrand && !matchesCategory && !matchesDesc && !matchesCity && !matchesMaterial) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'value_asc') return a.estimatedValue - b.estimatedValue;
      if (sortBy === 'value_desc') return b.estimatedValue - a.estimatedValue;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [listings, availabilityFilter, selectedCategory, selectedCondition, selectedSize, cityFilter, searchTerm, sortBy]);

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

  const scrollToGrid = () => {
    if (listingsGridRef.current) {
      listingsGridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Top 4 Featured Listings for the hero highlight
  const featuredListings = useMemo(() => {
    return listings.filter(l => l.status === 'available').slice(0, 4);
  }, [listings]);

  return (
    <div className="space-y-10 pb-16 text-[#FDF0CD]">
      {/* 1. Hero Marketplace Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#142A1D] via-[#1E3F2E] to-[#122A1E] text-[#FDF0CD] p-6 sm:p-10 shadow-2xl border border-[#D4AF37]/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#183E2A] text-[#FDE68A] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/40 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
              Zero-Cash Clothing Barter Hub
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#FDE68A] tracking-tight">
              Exchange Clothes Locally. Renew Your Style Sustainably.
            </h1>
            <p className="text-xs sm:text-sm text-[#E5D7B3] leading-relaxed max-w-xl">
              Discover shirts, kurtas, jackets, and dresses shared by fashion lovers across India.
              Propose an item from your wardrobe to swap with zero money changing hands.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={scrollToGrid}
              className="bg-[#FFF9E6] hover:bg-[#FCEFC7] text-[#1A2E22] px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-xl transition-transform hover:-translate-y-0.5 active:translate-y-0 border border-[#EED895] text-center"
            >
              Explore Available Garments
            </button>

            <div className="flex items-center gap-4 sm:gap-6 text-xs text-[#EED895] pl-1 sm:pl-2 pt-2 sm:pt-0">
              <div>
                <span className="block text-lg font-bold text-[#FDE68A] font-serif">100%</span>
                <span>Zero Cash</span>
              </div>
              <div className="w-px h-8 bg-[#D4AF37]/30"></div>
              <div>
                <span className="block text-lg font-bold text-[#FDE68A] font-serif">{listings.length}+</span>
                <span>Garments</span>
              </div>
              <div className="w-px h-8 bg-[#D4AF37]/30"></div>
              <div>
                <span className="block text-lg font-bold text-[#FDE68A] font-serif">28+</span>
                <span>Capitals</span>
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
              <Award className="w-5 h-5 text-[#FDE68A]" />
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#FDE68A]">
                Featured Clothing Pieces
              </h2>
            </div>
            <button
              onClick={scrollToGrid}
              className="text-xs font-bold text-[#FDE68A] hover:underline flex items-center gap-1"
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
                className="group bg-[#FFF9E6] rounded-2xl border border-[#EED895] overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] hover:shadow-2xl transition cursor-pointer flex flex-col justify-between text-[#1A2E22]"
              >
                <div className="relative aspect-[3/4] bg-[#FEF4D5] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#183E2A] text-[#FDE68A] backdrop-blur-sm border border-[#D4AF37]/40">
                      Featured Barter
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/70 text-[#FDE68A] text-[11px] px-2 py-0.5 rounded backdrop-blur-sm font-semibold">
                    Size: {item.size}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold uppercase tracking-wider text-[#8A6A1C] truncate max-w-[120px]">
                      {item.brand}
                    </span>
                    <span className="text-[#6B5B30] flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-[#8A6A1C]" /> {item.city}
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-[#1A2E22] text-sm truncate group-hover:text-[#8A6A1C] transition">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-[#6B5B30] pt-1 border-t border-[#EED895]/60">
                    <span className="font-bold text-[#1A2E22]">≈ ₹{item.estimatedValue} Parity</span>
                    <span className="text-[#8C7A58] text-[11px]">{item.condition}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Search and Filters Hub in Light Golden Yellow */}
      <section ref={listingsGridRef} className="bg-[#FFF9E6] rounded-3xl p-5 sm:p-7 shadow-[0_12px_35px_rgba(0,0,0,0.3)] border border-[#EED895] space-y-5 text-[#1A2E22]">
        {/* Top Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A6A1C]" />
            <input
              type="text"
              placeholder="Search by title, brand (Levi's, FabIndia, Zara...), city or fabric..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] placeholder:text-[#8C7A58] focus:outline-none focus:border-[#B89635] text-xs sm:text-sm transition shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A6A1C] hover:text-[#543D10] text-xs px-1 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick City Dropdown with 28 State Capitals */}
          <div className="relative min-w-[210px]">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A6A1C]" />
            <select
              value={cityFilter}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] font-semibold text-xs sm:text-sm focus:outline-none focus:border-[#B89635] cursor-pointer shadow-xs"
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
              className="w-full px-3 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] font-semibold text-xs sm:text-sm focus:outline-none focus:border-[#B89635] cursor-pointer shadow-xs"
            >
              <option value="newest">Recently Added</option>
              <option value="value_desc">Estimated Value: High to Low</option>
              <option value="value_asc">Estimated Value: Low to High</option>
            </select>
          </div>
        </div>

        {/* 28 Indian State Capitals Quick Filter Strip */}
        <div className="space-y-1.5 pt-1 border-t border-[#EED895]/60">
          <div className="flex items-center justify-between text-xs font-bold text-[#6B5B30] uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-[#8A6A1C]">
              <MapPin className="w-3.5 h-3.5 text-[#8A6A1C]" />
              28 Indian State Capitals
            </span>
            {cityFilter !== 'All' && (
              <button
                onClick={() => handleCityChange('All')}
                className="text-[#8A6A1C] font-bold text-[11px] hover:underline"
              >
                Clear city filter ({cityFilter})
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-xs">
            <button
              onClick={() => handleCityChange('All')}
              className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                cityFilter === 'All'
                  ? 'bg-[#183E2A] text-[#FDE68A] shadow-xs'
                  : 'bg-[#FEF4D5] text-[#1A2E22] hover:bg-[#FCEFC7]'
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

        {/* Category Pills Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#6B5B30] uppercase tracking-wider">
            <span>Garment Category</span>
            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-[#8A6A1C] font-bold hover:underline"
              >
                Reset category
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === 'All'
                  ? 'bg-[#183E2A] text-[#FDE68A] shadow-sm'
                  : 'bg-[#FEF4D5] text-[#1A2E22] hover:bg-[#FCEFC7]'
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-[#183E2A] text-[#FDE68A] shadow-sm'
                      : 'bg-[#FEF4D5] text-[#1A2E22] hover:bg-[#FCEFC7]'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-Filters: Size, Condition, Availability */}
        <div className="pt-2 border-t border-[#EED895]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-bold text-[#6B5B30] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#8A6A1C]" />
              Refine:
            </span>

            {/* Condition Filter */}
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] font-semibold cursor-pointer"
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
              className="px-2.5 py-1.5 rounded-lg border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] font-semibold cursor-pointer"
            >
              <option value="All">Any Size</option>
              {sizes.map(sz => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>

            {/* Availability Toggle */}
            <button
              onClick={() => setAvailabilityFilter(availabilityFilter === 'available_only' ? 'all' : 'available_only')}
              className={`px-3 py-1.5 rounded-lg border transition font-bold flex items-center gap-1 ${
                availabilityFilter === 'available_only'
                  ? 'bg-[#183E2A] text-[#FDE68A] border-[#D4AF37]/40 shadow-xs'
                  : 'bg-[#FEF4D5] text-[#1A2E22] border-[#E8D494]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FDE68A]" />
              Available Only
            </button>
          </div>

          {/* Reset Filters CTA if any active */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[#8A6A1C] hover:text-[#543D10] flex items-center gap-1 font-bold transition"
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
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FDE68A]">
            {selectedCategory === 'All' ? 'Complete Clothing Marketplace' : selectedCategory}
          </h2>
          <p className="text-xs text-[#E5D7B3] mt-0.5">
            Displaying {filteredListings.length} {filteredListings.length === 1 ? 'garment' : 'garments'} available for barter swap
            {cityFilter !== 'All' ? ` in ${cityFilter}` : ''}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#FDE68A] bg-[#183E2A] px-3.5 py-1.5 rounded-xl border border-[#D4AF37]/30 shadow-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#FDE68A]" />
          <span>Zero Commission Barter</span>
        </div>
      </div>

      {/* 5. Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-[#FFF9E6] rounded-2xl border border-[#EED895] p-4 space-y-3 animate-pulse">
              <div className="aspect-[3/4] bg-[#FEF4D5] rounded-xl"></div>
              <div className="h-4 bg-[#FEF4D5] rounded w-2/3"></div>
              <div className="h-3 bg-[#FEF4D5] rounded w-1/2"></div>
              <div className="h-8 bg-[#FEF4D5] rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Empty State */}
      {!isLoading && filteredListings.length === 0 && (
        <div className="bg-[#FFF9E6] rounded-3xl border border-[#EED895] p-12 text-center max-w-lg mx-auto space-y-4 shadow-lg text-[#1A2E22]">
          <div className="w-16 h-16 rounded-full bg-[#FEF4D5] text-[#8A6A1C] flex items-center justify-center mx-auto border border-[#E8D494]">
            <Shirt className="w-8 h-8 opacity-70" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif text-[#1A2E22]">No clothing items match your criteria</h3>
            <p className="text-xs text-[#6B5B30] mt-1">
              Try adjusting your city filter, category, or search keywords to discover more wardrobe pieces.
            </p>
          </div>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 bg-[#183E2A] text-[#FDE68A] px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-md border border-[#D4AF37]/40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        </div>
      )}

      {/* 7. Product Grid */}
      {!isLoading && filteredListings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredListings.map((item) => {
            const isOwner = user?.id === item.userId;
            const isAvailable = item.status === 'available';

            return (
              <div
                key={item.id}
                className="group bg-[#FFF9E6] rounded-2xl border border-[#EED895] overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] hover:shadow-2xl hover:border-[#D4AF37] transition flex flex-col justify-between text-[#1A2E22]"
              >
                {/* Photo & Badges */}
                <div
                  className="relative aspect-[3/4] bg-[#FEF4D5] overflow-hidden cursor-pointer"
                  onClick={() => onSelectItem(item)}
                >
                  <img
                    src={getSafeImageUrl(item.imageUrl, item.category)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => handleImageError(e, item.category)}
                  />

                  {/* Top Status & Condition */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md shadow-sm ${
                        item.status === 'available'
                          ? 'bg-[#183E2A] text-[#FDE68A] border border-[#D4AF37]/40'
                          : item.status === 'pending'
                          ? 'bg-amber-800/90 text-white'
                          : 'bg-stone-800/90 text-white'
                      }`}
                    >
                      {item.status === 'available' && 'Available'}
                      {item.status === 'pending' && 'Pending Swap'}
                      {item.status === 'swapped' && 'Swapped'}
                    </span>

                    <span className="text-[10px] font-bold bg-[#FFF9E6]/95 text-[#1A2E22] px-2 py-0.5 rounded-md border border-[#EED895] shadow-xs">
                      {item.condition}
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between text-[#FDE68A]">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm">
                      Size: {item.size}
                    </span>
                    <span className="text-xs font-bold flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                      <MapPin className="w-3 h-3 text-[#FDE68A]" />
                      {item.city}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Brand & Category */}
                    <div className="flex items-center justify-between text-xs text-[#6B5B30] mb-1">
                      <span className="font-bold text-[#8A6A1C] uppercase tracking-wider text-[11px]">
                        {item.brand}
                      </span>
                      <span className="text-[11px] text-[#7A6430]">{item.category}</span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => onSelectItem(item)}
                      className="font-serif font-bold text-[#1A2E22] text-base leading-snug line-clamp-1 hover:text-[#8A6A1C] cursor-pointer transition"
                      title={item.title}
                    >
                      {item.title}
                    </h3>

                    {/* Description preview */}
                    <p className="text-xs text-[#6B5B30] line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Parity & Owner row */}
                  <div className="pt-2 border-t border-[#EED895]/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] text-[#6B5B30] flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#8A6A1C]" />
                        <span>Swap Reference:</span>
                      </div>
                      <span className="text-xs font-bold text-[#1A2E22] bg-[#FEF4D5] px-2.5 py-0.5 rounded-lg border border-[#E8D494]">
                        ≈ ₹{item.estimatedValue.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#6B5B30]">
                      <div className="flex items-center gap-1.5 truncate">
                        <div className="w-5 h-5 rounded-full bg-[#183E2A] text-[#FDE68A] text-[10px] flex items-center justify-center font-bold border border-[#D4AF37]/30">
                          {item.userName[0]}
                        </div>
                        <span className="truncate text-[11px] font-medium">{item.userName}</span>
                      </div>
                      {isOwner && (
                        <span className="text-[10px] font-bold text-[#FDE68A] bg-[#183E2A] px-2 py-0.5 rounded border border-[#D4AF37]/40">
                          Your Closet
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      onClick={() => onSelectItem(item)}
                      className="flex-1 py-2 px-3 text-xs font-semibold rounded-xl border border-[#EED895] bg-[#FEF4D5] text-[#1A2E22] hover:bg-[#FCEFC7] transition text-center"
                    >
                      Details
                    </button>

                    {!isOwner ? (
                      <button
                        onClick={() => onProposeSwap(item)}
                        disabled={!isAvailable}
                        className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
                          isAvailable
                            ? 'bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] shadow-md border border-[#D4AF37]/40'
                            : 'bg-stone-200 text-stone-500 cursor-not-allowed'
                        }`}
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>Swap</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectItem(item)}
                        className="flex-1 py-2 px-3 text-xs font-bold rounded-xl bg-[#183E2A] text-[#FDE68A] border border-[#D4AF37]/40 text-center"
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

      {/* 8. How Swapping Works Section in Light Golden Yellow */}
      <section className="bg-[#FFF9E6] rounded-3xl p-8 sm:p-10 border border-[#EED895] shadow-[0_12px_35px_rgba(0,0,0,0.3)] space-y-6 text-[#1A2E22]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8A6A1C]">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2E22] mt-1">
              How Swapping Works
            </h2>
          </div>
          {onGoToHowItWorks && (
            <button
              onClick={onGoToHowItWorks}
              className="text-xs font-bold text-[#8A6A1C] hover:underline flex items-center gap-1"
            >
              <span>Read Full Guide</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          <div className="p-4 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#183E2A] text-[#FDE68A] font-bold flex items-center justify-center text-xs border border-[#D4AF37]/40">
              01
            </div>
            <h4 className="font-serif font-bold text-sm text-[#1A2E22]">Explore & Discover</h4>
            <p className="text-xs text-[#6B5B30]">
              Browse pre-loved shirts, jackets, kurtas, or sarees available for exchange across all 28 state capitals.
            </p>
          </div>

          <div className="p-4 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#8A6A1C] text-[#FFF9E6] font-bold flex items-center justify-center text-xs">
              02
            </div>
            <h4 className="font-serif font-bold text-sm text-[#1A2E22]">Propose a Trade</h4>
            <p className="text-xs text-[#6B5B30]">
              Pick an item you like and offer one from your closet. Specify your target approximate delivery date.
            </p>
          </div>

          <div className="p-4 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#183E2A] text-[#FDE68A] font-bold flex items-center justify-center text-xs border border-[#D4AF37]/40">
              03
            </div>
            <h4 className="font-serif font-bold text-sm text-[#1A2E22]">Chat & Coordinate</h4>
            <p className="text-xs text-[#6B5B30]">
              Negotiate in private chat. Agree on a public landmark meetup or arrange reliable courier delivery.
            </p>
          </div>

          <div className="p-4 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-[#FFF9E6] font-bold flex items-center justify-center text-xs">
              04
            </div>
            <h4 className="font-serif font-bold text-sm text-[#1A2E22]">Confirm Receipt</h4>
            <p className="text-xs text-[#6B5B30]">
              Inspect your item and confirm completion in the app. Both wardrobes get renewed with zero cash!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
