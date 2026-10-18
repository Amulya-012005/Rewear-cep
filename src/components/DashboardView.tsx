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
import { api } from '../services/api.ts';

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
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFD4] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#234533] shadow"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C3326]">
                {user.name}
              </h2>
              {user.role === 'admin' && (
                <span className="bg-amber-100 text-amber-900 text-xs px-2 py-0.5 rounded-full font-bold border border-amber-300">
                  Administrator
                </span>
              )}
            </div>
            <div className="text-xs text-stone-500 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#2B5E43]" />
              <span>{user.city} Wardrobe Circle</span>
              <span>•</span>
              <span>{user.email}</span>
            </div>
            {user.bio && (
              <p className="text-xs text-stone-600 mt-2 max-w-xl italic">
                "{user.bio}"
              </p>
            )}
          </div>
        </div>

        {/* Quick CTA */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenCreateListing}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-[#234533] hover:bg-[#1A3426] text-white text-xs font-bold shadow flex items-center justify-center gap-2 transition"
          >
            <PlusCircle className="w-4 h-4 text-[#8CE2A8]" />
            List Clothing Item
          </button>
          <button
            onClick={onGoToSwaps}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl border border-[#C9DFC3] bg-[#EBF3ED] text-[#234533] text-xs font-semibold hover:bg-[#DCECE0] flex items-center justify-center gap-2 transition"
          >
            <Repeat className="w-4 h-4" />
            View Swap Requests
          </button>
        </div>
      </div>

      {/* Sustainability & Closet Impact Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD4] shadow-sm">
          <span className="text-[11px] font-bold text-stone-500 uppercase">My Closet Items</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1C3326] mt-1">
            {myListings.length}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">
            {availableCount} Available for Barter
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD4] shadow-sm">
          <span className="text-[11px] font-bold text-stone-500 uppercase">Active Swaps</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#1C3326] mt-1">
            {inSwapCount}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">
            In Negotiation / Handover
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD4] shadow-sm">
          <span className="text-[11px] font-bold text-stone-500 uppercase">CO2 Prevented</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#245037] mt-1 flex items-baseline gap-1">
            <span>{co2PreventedKg}</span>
            <span className="text-sm font-sans font-normal text-stone-500">kg</span>
          </div>
          <span className="text-[11px] text-stone-500">
            vs purchasing brand-new
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-[#E5DFD4] shadow-sm">
          <span className="text-[11px] font-bold text-stone-500 uppercase">Water Conserved</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#245037] mt-1 flex items-baseline gap-1">
            <span>{waterSavedLiters.toLocaleString()}</span>
            <span className="text-sm font-sans font-normal text-stone-500">L</span>
          </div>
          <span className="text-[11px] text-stone-500">
            Textile manufacturing saved
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5DFD4] pb-2 text-xs font-semibold gap-3">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'listings' ? 'bg-[#234533] text-white shadow-sm' : 'text-stone-600 hover:bg-[#F2ECE1]'
          }`}
        >
          <Shirt className="w-4 h-4" />
          My Listed Clothes ({myListings.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'profile' ? 'bg-[#234533] text-white shadow-sm' : 'text-stone-600 hover:bg-[#F2ECE1]'
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
            <div className="bg-white rounded-3xl border border-dashed border-[#D5CDC0] p-12 text-center max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#2C573F] flex items-center justify-center mx-auto">
                <Shirt className="w-8 h-8 opacity-60" />
              </div>
              <h4 className="text-base font-bold font-serif text-[#1C3326]">
                Your closet is currently empty
              </h4>
              <p className="text-xs text-stone-500">
                Add shirts, jackets, ethnic wear, or shoes to begin swapping with other students and fashion lovers!
              </p>
              <button
                onClick={onOpenCreateListing}
                className="px-5 py-2.5 bg-[#234533] text-white rounded-xl text-xs font-bold shadow hover:bg-[#1A3426] transition"
              >
                List Your First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {myListings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#E5DFD4] overflow-hidden shadow-sm flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] bg-stone-100 cursor-pointer" onClick={() => onSelectItem(item)}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md shadow-sm ${
                          item.status === 'available'
                            ? 'bg-emerald-600/90 text-white'
                            : item.status === 'pending'
                            ? 'bg-amber-600/90 text-white'
                            : 'bg-stone-700/90 text-white'
                        }`}
                      >
                        {item.status === 'available' && 'Available'}
                        {item.status === 'pending' && 'Swap In Progress'}
                        {item.status === 'swapped' && 'Swapped'}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-sm">
                      {item.size} • {item.condition}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#2B5E43]">
                        {item.brand}
                      </span>
                      <h4
                        onClick={() => onSelectItem(item)}
                        className="font-serif font-bold text-stone-900 text-sm truncate hover:text-[#2B5E43] cursor-pointer"
                      >
                        {item.title}
                      </h4>
                      <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-100">
                      <span>≈ ₹{item.estimatedValue} Parity</span>
                      <span>{item.city}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onEditItem(item)}
                        className="flex-1 py-1.5 px-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="py-1.5 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold"
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
        <div className="bg-white rounded-3xl border border-[#E5DFD4] p-6 sm:p-8 max-w-xl mx-auto shadow-sm">
          <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">
            Personal Profile & City Location
          </h3>
          <p className="text-xs text-stone-500 mb-6">
            Keep your exchange city updated so nearby swappers can connect with you easily.
          </p>

          {profileSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {profileError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#2C573F]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Primary Exchange City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#2C573F] bg-white"
              >
                <option value="Hubballi">Hubballi</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mysuru">Mysuru</option>
                <option value="Pune">Pune</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase mb-1">Bio / Fashion Style</label>
              <textarea
                rows={3}
                placeholder="Share your favorite style, what kinds of clothes you like to swap, etc."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-[#2C573F]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="w-full py-3 bg-[#234533] hover:bg-[#1A3426] text-white font-bold rounded-xl shadow transition disabled:opacity-50 text-xs"
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
