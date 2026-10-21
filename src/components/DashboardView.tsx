import React, { useState } from 'react';
import { ClothingListing, SwapRequest } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  User,
  MapPin,
  Shirt,
  Repeat,
  Sparkles,
  Edit,
  Trash2,
  PlusCircle,
  Leaf,
  CheckCircle2,
  Clock,
  Layers,
  Settings,
  AlertCircle
} from 'lucide-react';

interface DashboardViewProps {
  myListings: ClothingListing[];
  swaps: { incoming: SwapRequest[]; outgoing: SwapRequest[] };
  onSelectItem: (item: ClothingListing) => void;
  onEditItem: (item: ClothingListing) => void;
  onDeleteItem: (itemId: string) => void;
  onOpenCreateListing: () => void;
  onOpenChat: (swap: SwapRequest) => void;
  onGoToSwaps: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  myListings,
  swaps,
  onSelectItem,
  onEditItem,
  onDeleteItem,
  onOpenCreateListing,
  onOpenChat,
  onGoToSwaps
}) => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'profile'>('listings');

  // Edit profile state
  const [name, setName] = useState(user?.name || '');
  const [city, setCity] = useState(user?.city || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  if (!user) return null;

  // Compute metrics
  const availableCount = myListings.filter(l => l.status === 'available').length;
  const inSwapCount = myListings.filter(l => l.status === 'pending').length;
  const swappedCount = myListings.filter(l => l.status === 'swapped').length;

  const allSwaps = [...swaps.incoming, ...swaps.outgoing];
  const completedSwapsCount = allSwaps.filter(s => s.status === 'completed').length;

  // Environmental impact estimate
  const co2PreventedKg = (swappedCount * 15) + (myListings.length * 3);
  const waterSavedLiters = (swappedCount * 2700) + (myListings.length * 500);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccess(false);
    setProfileError(null);
    try {
      await updateProfile({ name, city, bio });
      setProfileSuccess(true);
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto text-[#FDF0CD]">
      {/* Profile Header Banner */}
      <div className="bg-[#FFF9E6] rounded-3xl p-6 sm:p-8 border border-[#EED895] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-[#1A2E22]">
        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#8A6A1C] shadow-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2E22]">
                {user.name}
              </h2>
              {user.role === 'admin' && (
                <span className="bg-[#183E2A] text-[#FDE68A] text-xs px-2.5 py-0.5 rounded-full font-bold border border-[#D4AF37]/40 shadow-xs">
                  Administrator
                </span>
              )}
            </div>
            <div className="text-xs text-[#6B5B30] flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#8A6A1C]" />
              <span>{user.city} Wardrobe Circle</span>
              <span>•</span>
              <span>{user.email}</span>
            </div>
            {user.bio && (
              <p className="text-xs text-[#6B5B30] mt-2 max-w-xl italic">
                "{user.bio}"
              </p>
            )}
          </div>
        </div>

        {/* Quick CTA */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenCreateListing}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] text-xs font-bold shadow-md flex items-center justify-center gap-2 transition border border-[#D4AF37]/40"
          >
            <PlusCircle className="w-4 h-4 text-[#FDE68A]" />
            List Clothing Item
          </button>
          <button
            onClick={onGoToSwaps}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl border border-[#EED895] bg-[#FEF4D5] text-[#1A2E22] text-xs font-semibold hover:bg-[#FCEFC7] flex items-center justify-center gap-2 transition shadow-xs"
          >
            <Repeat className="w-4 h-4 text-[#8A6A1C]" />
            View Swap Requests
          </button>
        </div>
      </div>

      {/* Sustainability & Closet Impact Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-[#FFF9E6] rounded-2xl border border-[#EED895] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] text-[#1A2E22]">
          <span className="text-[11px] font-bold text-[#7A6430] uppercase">My Closet Items</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2E22] mt-1">
            {myListings.length}
          </div>
          <span className="text-[11px] text-emerald-800 font-medium">
            {availableCount} Available for Barter
          </span>
        </div>

        <div className="p-4 bg-[#FFF9E6] rounded-2xl border border-[#EED895] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] text-[#1A2E22]">
          <span className="text-[11px] font-bold text-[#7A6430] uppercase">Active Swaps</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2E22] mt-1">
            {inSwapCount}
          </div>
          <span className="text-[11px] text-[#8A6A1C] font-medium">
            In Negotiation / Handover
          </span>
        </div>

        <div className="p-4 bg-[#FFF9E6] rounded-2xl border border-[#EED895] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] text-[#1A2E22]">
          <span className="text-[11px] font-bold text-[#7A6430] uppercase">CO2 Prevented</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2E22] mt-1 flex items-baseline gap-1">
            <span>{co2PreventedKg}</span>
            <span className="text-sm font-sans font-normal text-[#6B5B30]">kg</span>
          </div>
          <span className="text-[11px] text-[#6B5B30]">
            vs purchasing brand-new
          </span>
        </div>

        <div className="p-4 bg-[#FFF9E6] rounded-2xl border border-[#EED895] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] text-[#1A2E22]">
          <span className="text-[11px] font-bold text-[#7A6430] uppercase">Water Conserved</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2E22] mt-1 flex items-baseline gap-1">
            <span>{waterSavedLiters.toLocaleString()}</span>
            <span className="text-sm font-sans font-normal text-[#6B5B30]">L</span>
          </div>
          <span className="text-[11px] text-[#6B5B30]">
            Textile manufacturing saved
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#D4AF37]/20 pb-2 text-xs font-semibold gap-3">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'bg-[#FFF9E6] text-[#1A2E22] font-bold shadow-md border border-[#EED895]'
              : 'text-[#E5D7B3] hover:text-[#FDE68A] hover:bg-[#FFF9E6]/10'
          }`}
        >
          <Shirt className="w-4 h-4" />
          My Listed Clothes ({myListings.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-[#FFF9E6] text-[#1A2E22] font-bold shadow-md border border-[#EED895]'
              : 'text-[#E5D7B3] hover:text-[#FDE68A] hover:bg-[#FFF9E6]/10'
          }`}
        >
          <Settings className="w-4 h-4" />
          Profile Settings
        </button>
      </div>

      {/* My Listings Tab */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {myListings.length === 0 ? (
            <div className="bg-[#FFF9E6] rounded-3xl border border-[#EED895] p-12 text-center max-w-md mx-auto space-y-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] text-[#1A2E22]">
              <div className="w-16 h-16 rounded-full bg-[#FEF4D5] text-[#8A6A1C] flex items-center justify-center mx-auto border border-[#E8D494]">
                <Shirt className="w-8 h-8 opacity-70" />
              </div>
              <h4 className="text-base font-bold font-serif text-[#1A2E22]">
                Your closet is currently empty
              </h4>
              <p className="text-xs text-[#6B5B30]">
                Add shirts, jackets, ethnic wear, or shoes to begin swapping with other students and fashion lovers!
              </p>
              <button
                onClick={onOpenCreateListing}
                className="px-5 py-2.5 bg-[#183E2A] text-[#FDE68A] rounded-xl text-xs font-bold shadow-md hover:bg-[#122A1E] transition border border-[#D4AF37]/40"
              >
                List Your First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {myListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#FFF9E6] rounded-2xl border border-[#EED895] overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] flex flex-col justify-between text-[#1A2E22]"
                >
                  <div className="relative aspect-[3/4] bg-[#FEF4D5] cursor-pointer" onClick={() => onSelectItem(item)}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-md shadow-sm ${
                          item.status === 'available'
                            ? 'bg-emerald-800/90 text-white'
                            : item.status === 'pending'
                            ? 'bg-amber-700/90 text-white'
                            : 'bg-stone-800/90 text-white'
                        }`}
                      >
                        {item.status === 'available' && 'Available'}
                        {item.status === 'pending' && 'Swap In Progress'}
                        {item.status === 'swapped' && 'Swapped'}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 bg-[#1A2E22]/85 text-[#FDE68A] text-[10px] px-2 py-0.5 rounded backdrop-blur-sm border border-[#D4AF37]/30">
                      {item.size} • {item.condition}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A6A1C]">
                        {item.brand}
                      </span>
                      <h4
                        onClick={() => onSelectItem(item)}
                        className="font-serif font-bold text-[#1A2E22] text-sm truncate hover:text-[#8A6A1C] cursor-pointer"
                      >
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#6B5B30] line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#6B5B30] pt-2 border-t border-[#EED895]/60">
                      <span className="font-bold text-[#8A6A1C]">≈ ₹{item.estimatedValue} Parity</span>
                      <span>{item.city}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onEditItem(item)}
                        className="flex-1 py-1.5 px-3 rounded-xl border border-[#EED895] bg-[#FEF4D5] text-[#1A2E22] hover:bg-[#FCEFC7] text-xs font-semibold flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Edit className="w-3 h-3 text-[#8A6A1C]" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="py-1.5 px-3 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
                        title="Delete listing"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Settings Tab */}
      {activeTab === 'profile' && (
        <div className="bg-[#FFF9E6] rounded-3xl border border-[#EED895] p-6 sm:p-8 max-w-xl mx-auto shadow-[0_10px_25px_-5px_rgba(0,0,0,0.35)] text-[#1A2E22]">
          <h3 className="text-lg font-serif font-bold text-[#1A2E22] mb-1">
            Personal Profile & City Location
          </h3>
          <p className="text-xs text-[#6B5B30] mb-6">
            Keep your exchange city updated so nearby swappers can connect with you easily.
          </p>

          {profileSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {profileError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#6B5B30] uppercase mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] text-sm focus:outline-none focus:border-[#B89635]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#6B5B30] uppercase mb-1">Primary Exchange City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] text-sm focus:outline-none focus:border-[#B89635]"
              >
                <option value="Hubballi">Hubballi</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mysuru">Mysuru</option>
                <option value="Pune">Pune</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#6B5B30] uppercase mb-1">Bio / Fashion Style</label>
              <textarea
                rows={3}
                placeholder="Share your favorite style, what kinds of clothes you like to swap, etc."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] text-sm focus:outline-none focus:border-[#B89635]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full py-3 bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] font-bold rounded-xl shadow-md transition disabled:opacity-50 text-xs border border-[#D4AF37]/40"
              >
                {isSavingProfile ? 'Saving...' : 'Update Profile Settings'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
