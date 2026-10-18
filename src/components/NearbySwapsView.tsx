import React, { useState } from 'react';
import { ClothingListing } from '../types.ts';
import { MapPin, Sparkles, Leaf, ArrowRightLeft, Shirt } from 'lucide-react';
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
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#214232] to-[#162D22] text-[#FAF7F2] p-8 sm:p-10 rounded-3xl shadow-lg border border-[#355B46] relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#355F46] text-[#A6E5BE] text-xs font-semibold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5 text-[#85D49E]" /> Zero Courier Emissions
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
            Local Wardrobe Exchange Circles
          </h2>
          <p className="text-xs sm:text-sm text-[#CFE4D7] leading-relaxed">
            Eliminate postal packaging and transport carbon. Meet fellow swappers at a convenient public landmark
            in any of the 28 Indian state capitals to inspect clothing fabrics and exchange in person.
          </p>
        </div>

        <div className="absolute right-4 bottom-4 sm:right-8 sm:bottom-8 opacity-10 pointer-events-none">
          <MapPin className="w-48 h-48 text-white" />
        </div>
      </div>

      {/* All 28 Capital Cities Dropdown Selector */}
      <div className="bg-[#FAF7F0] p-4 rounded-2xl border border-[#E5DFD4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#234C3A]" />
          <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
            Select Any of 28 Indian State Capitals:
          </span>
        </div>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold text-stone-800 bg-[#FAF8F4] focus:ring-2 focus:ring-[#234C3A] cursor-pointer"
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
                  ? 'bg-[#234533] text-white border-[#234533] shadow-md scale-[1.02]'
                  : 'bg-[#FAF7F0] hover:bg-[#F5F2EB] text-stone-800 border-[#E5DFD4]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold opacity-80">{c.tag}</span>
                <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#8CE2A8]' : 'text-[#2C573F]'}`} />
              </div>
              <div className="text-base font-serif font-bold mt-1">{c.name}</div>
              <div className={`text-[11px] mt-0.5 font-medium ${isSelected ? 'text-[#C7EADB]' : 'text-stone-500'}`}>
                {c.count} clothes available
              </div>
            </button>
          );
        })}
      </div>

      {/* Listing Feed for Selected City */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-serif font-bold text-[#1C3326] flex items-center gap-2">
            <span>Clothes available in {selectedCity}</span>
            <span className="text-xs font-normal text-stone-500">
              ({cityListings.length} garments)
            </span>
          </h3>

          <span className="text-xs text-stone-500 bg-[#F4EFE6] px-3 py-1 rounded-xl font-medium">
            Local Meetup & Handover Verified
          </span>
        </div>

        {cityListings.length === 0 ? (
          <div className="bg-[#FAF7F0] rounded-3xl p-12 text-center border border-[#E5DFD4] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F1] flex items-center justify-center mx-auto text-stone-400">
              <Shirt className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-stone-800 text-lg">
              No garments listed in {selectedCity} yet
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Be the first sustainable swapper to list a garment in this city, or explore other state capitals from the selector above!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cityListings.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="bg-[#FAF7F0] rounded-2xl border border-[#E5DFD4] overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div className="relative aspect-[4/3] bg-[#F1EDE4] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                    {item.category}
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-[#234C3A] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
                    ₹{item.estimatedValue}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-bold text-[#234C3A]">{item.brand}</span>
                    <span>Size: {item.size} • {item.condition}</span>
                  </div>

                  <h4 className="font-serif font-bold text-stone-900 text-sm line-clamp-1 group-hover:text-[#234C3A] transition">
                    {item.title}
                  </h4>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-500 text-[11px]">Owner: {item.userName}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onProposeSwap(item);
                      }}
                      className="px-2.5 py-1 bg-[#234C3A] hover:bg-[#1A382B] text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
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
