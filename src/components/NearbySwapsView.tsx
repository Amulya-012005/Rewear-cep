import React, { useState } from 'react';
import { ClothingListing } from '../types.ts';
import { MapPin, Leaf, ArrowRightLeft, Shirt } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { INDIAN_STATE_CAPITALS } from '../data/indiaLocations.ts';

interface NearbySwapsViewProps {
  listings: ClothingListing[];
  onSelectItem: (item: ClothingListing) => void;
  onProposeSwap: (item: ClothingListing) => void;
}

export const NearbySwapsView: React.FC<NearbySwapsViewProps> = ({
  listings,
  onSelectItem,
  onProposeSwap
}) => {
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string>(user?.city || 'Bengaluru');

  const featuredCircles = [
    { name: 'Bengaluru', tag: 'Karnataka Capital', count: listings.filter(l => l.city.toLowerCase() === 'bengaluru').length },
    { name: 'Mumbai', tag: 'Maharashtra Capital', count: listings.filter(l => l.city.toLowerCase() === 'mumbai').length },
    { name: 'Jaipur', tag: 'Rajasthan Capital', count: listings.filter(l => l.city.toLowerCase() === 'jaipur').length },
    { name: 'Hubballi', tag: 'North Karnataka Circle', count: listings.filter(l => l.city.toLowerCase() === 'hubballi').length },
    { name: 'Chennai', tag: 'Tamil Nadu Capital', count: listings.filter(l => l.city.toLowerCase() === 'chennai').length },
    { name: 'Kolkata', tag: 'West Bengal Capital', count: listings.filter(l => l.city.toLowerCase() === 'kolkata').length },
    { name: 'Lucknow', tag: 'Uttar Pradesh Capital', count: listings.filter(l => l.city.toLowerCase() === 'lucknow').length },
    { name: 'Hyderabad', tag: 'Telangana Capital', count: listings.filter(l => l.city.toLowerCase() === 'hyderabad').length },
  ];

  const cityListings = listings.filter(
    (l) => l.city.toLowerCase() === selectedCity.toLowerCase()
  );

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto text-[#FDF0CD]">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#142A1D] via-[#1E3F2E] to-[#122A1E] text-[#FDF0CD] p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#D4AF37]/40 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#183E2A] text-[#FDE68A] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/40 shadow-xs">
            <Leaf className="w-3.5 h-3.5 text-[#FDE68A]" /> Zero Courier Emissions
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#FDE68A] leading-tight">
            Local Wardrobe Exchange Circles
          </h2>
          <p className="text-xs sm:text-sm text-[#E5D7B3] leading-relaxed">
            Eliminate postal packaging and transport carbon. Meet fellow swappers at a convenient public landmark
            in any of the 28 Indian state capitals to inspect clothing fabrics and exchange in person.
          </p>
        </div>

        <div className="absolute right-4 bottom-4 sm:right-8 sm:bottom-8 opacity-10 pointer-events-none">
          <MapPin className="w-48 h-48 text-[#D4AF37]" />
        </div>
      </div>

      {/* All 28 Capital Cities Dropdown Selector */}
      <div className="bg-[#FFF9E6] p-4 rounded-2xl border border-[#EED895] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_8px_25px_rgba(0,0,0,0.25)] text-[#1A2E22]">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#8A6A1C]" />
          <span className="text-xs font-bold text-[#6B5B30] uppercase tracking-wider">
            Select Any of 28 Indian State Capitals:
          </span>
        </div>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-[#EED895] text-xs sm:text-sm font-semibold text-[#1A2E22] bg-[#FFFDF5] focus:outline-none focus:border-[#B89635] cursor-pointer"
        >
          <optgroup label="28 Capital Cities of Indian States">
            {INDIAN_STATE_CAPITALS.map((sc) => (
              <option key={sc.no} value={sc.capital}>
                {sc.no}. {sc.capital} ({sc.state})
              </option>
            ))}
          </optgroup>
          <optgroup label="Other Local Hubs">
            <option value="Hubballi">Hubballi (Karnataka)</option>
            <option value="Mysuru">Mysuru (Karnataka)</option>
            <option value="Pune">Pune (Maharashtra)</option>
          </optgroup>
        </select>
      </div>

      {/* Featured Capital Cities Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {featuredCircles.map((c) => {
          const isSelected = selectedCity.toLowerCase() === c.name.toLowerCase();
          return (
            <button
              key={c.name}
              onClick={() => setSelectedCity(c.name)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#183E2A] text-[#FDE68A] border-[#D4AF37]/50 shadow-md scale-[1.02]'
                  : 'bg-[#FFF9E6] hover:bg-[#FCEFC7] text-[#1A2E22] border-[#EED895] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold opacity-80">{c.tag}</span>
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FDE68A]' : 'text-[#8A6A1C]'}`} />
              </div>
              <div className="text-base font-serif font-bold mt-1">{c.name}</div>
              <div className={`text-[11px] mt-0.5 font-semibold ${isSelected ? 'text-[#E5D7B3]' : 'text-[#6B5B30]'}`}>
                {c.count} clothes available
              </div>
            </button>
          );
        })}
      </div>

      {/* Listing Feed for Selected City */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif font-bold text-[#FDE68A] flex items-center gap-2">
            <span>Clothes available in {selectedCity}</span>
            <span className="text-xs font-semibold text-[#E5D7B3]">
              ({cityListings.length} garments)
            </span>
          </h3>

          <span className="text-xs text-[#FDE68A] bg-[#183E2A] px-3.5 py-1 rounded-xl font-bold border border-[#D4AF37]/30">
            Local Meetup & Handover Verified
          </span>
        </div>

        {cityListings.length === 0 ? (
          <div className="bg-[#FFF9E6] rounded-3xl p-12 text-center border border-[#EED895] space-y-3 shadow-lg text-[#1A2E22]">
            <div className="w-12 h-12 rounded-full bg-[#FEF4D5] flex items-center justify-center mx-auto text-[#8A6A1C] border border-[#E8D494]">
              <Shirt className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-[#1A2E22] text-lg">
              No garments listed in {selectedCity} yet
            </h4>
            <p className="text-xs text-[#6B5B30] max-w-sm mx-auto">
              Be the first sustainable swapper to list a garment in this city, or explore other state capitals from the selector above!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityListings.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="bg-[#FFF9E6] rounded-2xl border border-[#EED895] overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] hover:shadow-2xl transition cursor-pointer flex flex-col justify-between group text-[#1A2E22]"
              >
                <div className="relative aspect-[4/3] bg-[#FEF4D5] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-sm text-[#FDE68A] text-[10px] font-bold px-2 py-0.5 rounded">
                    {item.category}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-[#183E2A] text-[#FDE68A] text-[11px] font-bold px-2.5 py-0.5 rounded shadow border border-[#D4AF37]/30">
                    ≈ ₹{item.estimatedValue}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#6B5B30]">
                    <span className="font-bold text-[#8A6A1C] uppercase">{item.brand}</span>
                    <span>Size: {item.size} • {item.condition}</span>
                  </div>

                  <h4 className="font-serif font-bold text-[#1A2E22] text-sm line-clamp-1 group-hover:text-[#8A6A1C] transition">
                    {item.title}
                  </h4>

                  <div className="pt-2 border-t border-[#EED895]/60 flex items-center justify-between text-xs">
                    <span className="text-[#6B5B30] text-[11px]">Owner: {item.userName}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onProposeSwap(item);
                      }}
                      className="px-3 py-1 bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] rounded-lg text-xs font-bold flex items-center gap-1 transition border border-[#D4AF37]/30 shadow-xs"
                    >
                      <ArrowRightLeft className="w-3 h-3 text-[#FDE68A]" />
                      <span>Swap</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
