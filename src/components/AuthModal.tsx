import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  X,
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User,
  MapPin,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Tag,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { INDIAN_STATE_CAPITALS } from '../data/indiaLocations.ts';

interface AuthModalProps {
  onClose: () => void;
  targetModule?: 'sell' | 'buyer' | 'admin' | null;
  onSuccessNavigate?: (module: 'sell' | 'buyer' | 'admin') => void;
  isCompulsory?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  targetModule,
  onSuccessNavigate,
  isCompulsory = false
}) => {
  const { login, register, switchDemoUser } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Form states
  const [email, setEmail] = useState(targetModule === 'admin' ? 'admin@rewear.org' : '');
  const [password, setPassword] = useState(targetModule === 'admin' ? 'admin123' : '');
  const [name, setName] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [bio, setBio] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (targetModule === 'admin') {
      setEmail('admin@rewear.org');
      setPassword('admin123');
    }
  }, [targetModule]);

  const handleAuthDone = (module?: 'sell' | 'buyer' | 'admin') => {
    const finalMod = module || targetModule;
    if (onSuccessNavigate && finalMod) {
      onSuccessNavigate(finalMod);
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await register({ email, password, name, city, bio });
      }
      handleAuthDone();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await switchDemoUser(demoEmail);
      handleAuthDone();
    } catch (err: any) {
      setError(err.message || 'Failed to switch demo user.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-[#FFF9E6] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#EED895] text-[#1A2E22] p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FEF4D5] hover:bg-[#FCEFC7] flex items-center justify-center transition border border-[#E8D494] text-[#8A6A1C]"
          title="Return to Home Landing"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Compulsory Module Requirement Banner */}
        {targetModule && (
          <div className="mb-5 p-4 rounded-2xl bg-[#183E2A] text-[#FDF0CD] border border-[#D4AF37]/40 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FDE68A]">
                Authentication Required
              </span>
            </div>
            <div className="flex items-start gap-2.5 mt-1">
              {targetModule === 'sell' && <Tag className="w-5 h-5 text-[#FDE68A] shrink-0 mt-0.5" />}
              {targetModule === 'buyer' && <ShoppingBag className="w-5 h-5 text-[#FDE68A] shrink-0 mt-0.5" />}
              {targetModule === 'admin' && <ShieldCheck className="w-5 h-5 text-[#FDE68A] shrink-0 mt-0.5" />}
              <p className="text-xs text-[#E5D7B3] leading-relaxed">
                {targetModule === 'sell' && (
                  <span>
                    You must sign in or register an account to enter the <strong>Sell Clothes Module</strong>. List your wardrobe, upload images, and manage barter proposals.
                  </span>
                )}
                {targetModule === 'buyer' && (
                  <span>
                    You must sign in or register an account to enter the <strong>Buy Clothes Module</strong>. Discover clothing for exchange across all 28 Indian state capitals and propose trades.
                  </span>
                )}
                {targetModule === 'admin' && (
                  <span>
                    Administrator authorization required to enter the <strong>Admin Control Center</strong>. Sign in with administrative credentials or select the Admin Profile below.
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Brand Icon & Heading */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#183E2A] text-[#FDE68A] flex items-center justify-center mx-auto shadow-md mb-3 border border-[#D4AF37]/40">
            {isLoginMode ? <LogIn className="w-6 h-6 text-[#FDE68A]" /> : <UserPlus className="w-6 h-6 text-[#FDE68A]" />}
          </div>
          <h3 className="text-2xl font-serif font-bold text-[#1A2E22]">
            {isLoginMode ? 'Welcome to ReWear' : 'Create Your ReWear Account'}
          </h3>
          <p className="text-xs text-[#6B5B30] mt-1">
            {isLoginMode
              ? 'Sign in to access your wardrobe, browse clothes, or manage swaps'
              : 'Register now to participate in 100% cashless peer-to-peer clothing bartering'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#FEF4D5] p-1 rounded-xl text-xs font-bold mb-6 border border-[#E8D494]">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(true);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition ${
              isLoginMode ? 'bg-[#183E2A] text-[#FDE68A] shadow-sm' : 'text-[#6B5B30] hover:text-[#1A2E22]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(false);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg transition ${
              !isLoginMode ? 'bg-[#183E2A] text-[#FDE68A] shadow-sm' : 'text-[#6B5B30] hover:text-[#1A2E22]'
            }`}
          >
            Register New Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isLoginMode && (
            <div>
              <label className="block font-bold text-[#6B5B30] uppercase mb-1">Your Full Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A6A1C]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Deshmukh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-sm text-[#1A2E22] focus:outline-none focus:border-[#B89635]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-[#6B5B30] uppercase mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A6A1C]" />
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-sm text-[#1A2E22] focus:outline-none focus:border-[#B89635]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#6B5B30] uppercase mb-1">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A6A1C]" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-sm text-[#1A2E22] focus:outline-none focus:border-[#B89635]"
              />
            </div>
          </div>

          {!isLoginMode && (
            <>
              <div>
                <label className="block font-bold text-[#6B5B30] uppercase mb-1">
                  Primary Exchange City *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A6A1C]" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-sm text-[#1A2E22] font-semibold focus:outline-none focus:border-[#B89635] cursor-pointer"
                  >
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
              </div>

              <div>
                <label className="block font-bold text-[#6B5B30] uppercase mb-1">Bio / Swap Style</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Sarees, oversized tees, denim jackets, kurtas..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-sm text-[#1A2E22] focus:outline-none focus:border-[#B89635]"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] font-bold rounded-xl shadow-md transition disabled:opacity-50 text-xs mt-2 flex items-center justify-center gap-2 border border-[#D4AF37]/40"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : isLoginMode ? (
              <>
                <span>Sign In & Enter Module</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Create Account & Start Swapping</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Profiles */}
        <div className="mt-6 pt-5 border-t border-[#EED895]/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#8A6A1C] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#8A6A1C]" />
              Quick 1-Click Evaluation Accounts
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickDemo('priya@example.com')}
              className="p-2.5 rounded-xl border border-[#E8D494] bg-[#FEF4D5] hover:bg-[#FCEFC7] text-left transition"
            >
              <div className="font-bold text-[#1A2E22]">Priya Sharma</div>
              <div className="text-[#6B5B30] text-[10px]">Bengaluru • Seller / Buyer</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('rahul@example.com')}
              className="p-2.5 rounded-xl border border-[#E8D494] bg-[#FEF4D5] hover:bg-[#FCEFC7] text-left transition"
            >
              <div className="font-bold text-[#1A2E22]">Rahul Patil</div>
              <div className="text-[#6B5B30] text-[10px]">Hubballi • Active Swapper</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('ananya@example.com')}
              className="p-2.5 rounded-xl border border-[#E8D494] bg-[#FEF4D5] hover:bg-[#FCEFC7] text-left transition"
            >
              <div className="font-bold text-[#1A2E22]">Ananya Hegde</div>
              <div className="text-[#6B5B30] text-[10px]">Mysuru • Designer Wardrobe</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin@rewear.org')}
              className={`p-2.5 rounded-xl border text-left transition ${
                targetModule === 'admin'
                  ? 'border-[#8A6A1C] bg-[#FDF3D6] ring-2 ring-[#D4AF37]/50 font-bold'
                  : 'border-[#E8D494] bg-[#FEF4D5] hover:bg-[#FCEFC7]'
              }`}
            >
              <div className="font-bold text-[#8A6A1C] flex items-center gap-1">
                Admin Profile
                <ShieldCheck className="w-3.5 h-3.5 text-[#8A6A1C]" />
              </div>
              <div className="text-[#6B5B30] text-[10px]">ReWear Administrator</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
