import React, { useState } from 'react';
import { ClothingListing, ClothingCategory, ClothingCondition, ClothingSize } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  X,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Calculator
} from 'lucide-react';
import { api } from '../services/api.ts';
import { INDIAN_STATE_CAPITALS } from '../data/indiaLocations.ts';
import { getSafeImageUrl, handleImageError } from '../utils/imageFallback.ts';

interface CreateEditListingModalProps {
  itemToEdit?: ClothingListing | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateEditListingModal: React.FC<CreateEditListingModalProps> = ({
  itemToEdit,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();

  const [title, setTitle] = useState(itemToEdit?.title || '');
  const [description, setDescription] = useState(itemToEdit?.description || '');
  const [category, setCategory] = useState<ClothingCategory>(itemToEdit?.category || 'Shirts & Tops');
  const [brand, setBrand] = useState(itemToEdit?.brand || '');
  const [size, setSize] = useState<ClothingSize>((itemToEdit?.size as ClothingSize) || 'M');
  const [condition, setCondition] = useState<ClothingCondition>(itemToEdit?.condition || 'Like New');
  const [city, setCity] = useState(itemToEdit?.city || user?.city || 'Bengaluru');
  const [estimatedValue, setEstimatedValue] = useState<number>(itemToEdit?.estimatedValue || 1500);
  const [imageUrl, setImageUrl] = useState(itemToEdit?.imageUrl || '');
  const [status, setStatus] = useState(itemToEdit?.status || 'available');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Curated sustainable fashion presets for 1-click photo selection
  const curatedPresets = [
    { label: 'Silk Kurta / Ethnic', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Denim Trucker Jacket', url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80' },
    { label: 'Linen Casual Shirt', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80' },
    { label: 'Midi Wrap Dress', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80' },
    { label: 'High-Rise Denim Jeans', url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80' },
    { label: 'Knitted Crewneck Sweater', url: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80' },
    { label: 'Utility Cargo Jacket', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80' },
    { label: 'Heavyweight Fleece Hoodie', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80' }
  ];

  const categories: ClothingCategory[] = [
    'Shirts & Tops',
    'Dresses & Jumpsuits',
    'Jeans & Trousers',
    'Jackets & Outerwear',
    'Ethnic & Festive Wear',
    'Knitwear & Sweaters'
  ];

  const conditions: ClothingCondition[] = [
    'Brand New with Tags',
    'Like New',
    'Gently Used',
    'Well Loved'
  ];

  const sizes: ClothingSize[] = [
    'XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', 'Free Size'
  ];

  // Smart Value Estimator Helper
  const handleAutoEstimate = async () => {
    try {
      const res = await api.calculateSwapValue({
        category,
        brand: brand || 'FabIndia',
        condition,
        originalPrice: 2500,
        ageInMonths: 6
      });
      if (res && res.estimatedValue) {
        setEstimatedValue(res.estimatedValue);
      }
    } catch {
      // Fallback estimate
      setEstimatedValue(1500);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !brand.trim() || !description.trim() || !imageUrl.trim()) {
      setError('Please fill in title, brand, description, and provide an image.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (itemToEdit) {
        await api.updateListing(itemToEdit.id, {
          title,
          description,
          category,
          brand,
          size,
          condition,
          city,
          estimatedValue: Number(estimatedValue),
          imageUrl,
          status: status as any
        });
      } else {
        await api.createListing({
          title,
          description,
          category,
          brand,
          size,
          condition,
          city,
          estimatedValue: Number(estimatedValue),
          imageUrl
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#FFF9E6] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#EED895] text-[#1A2E22] p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EED895]/60 mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2E22]">
              {itemToEdit ? 'Edit Clothing Listing' : 'List an Item for Barter Swap'}
            </h3>
            <p className="text-xs text-[#6B5B30] mt-0.5">
              Upload clothes you no longer wear to swap with someone nearby. No cash payments.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#FEF4D5] hover:bg-[#FCEFC7] flex items-center justify-center transition border border-[#E8D494] text-[#8A6A1C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#6B5B30] uppercase tracking-wider mb-1">
              Garment Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pure Linen Relaxed Summer Shirt"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] focus:outline-none focus:border-[#B89635] text-sm"
            />
          </div>

          {/* Category & Brand row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#6B5B30] uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ClothingCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] font-semibold focus:outline-none focus:border-[#B89635] text-sm cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6B5B30] uppercase tracking-wider mb-1">
                Brand / Label *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. FabIndia, Zara, Levi's, Thrifted"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] focus:outline-none focus:border-[#B89635] text-sm"
              />
            </div>
          </div>

          {/* Size, Condition, City row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#6B5B30] uppercase tracking-wider mb-1">
                Size *
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as ClothingSize)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] font-semibold focus:outline-none focus:border-[#B89635] text-sm cursor-pointer"
              >
                {sizes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6B5B30] uppercase tracking-wider mb-1">
                Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ClothingCondition)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] font-semibold focus:outline-none focus:border-[#B89635] text-sm cursor-pointer"
              >
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6B5B30] uppercase tracking-wider mb-1">
                Exchange City *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] font-semibold focus:outline-none focus:border-[#B89635] text-sm cursor-pointer"
              >
                <optgroup label="28 Capital Cities of Indian States">
                  {INDIAN_STATE_CAPITALS.map((sc) => (
                    <option key={sc.no} value={sc.capital}>
                      {sc.capital} ({sc.state})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Other Local Fashion Circles">
                  <option value="Hubballi">Hubballi (Karnataka)</option>
                  <option value="Mysuru">Mysuru (Karnataka)</option>
                  <option value="Pune">Pune (Maharashtra)</option>
                </optgroup>
              </select>
            </div>
          </div>

          {/* Estimated Swap Value & Auto-calculate */}
          <div className="p-4 bg-[#FEF4D5] rounded-2xl border border-[#E8D494] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#1A2E22] uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-[#8A6A1C]" />
                Estimated Swap Parity Value (₹) *
              </label>
              <button
                type="button"
                onClick={handleAutoEstimate}
                className="text-xs text-[#8A6A1C] hover:text-[#543D10] font-bold flex items-center gap-1 underline"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-Suggest Value
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[#7A6430]">₹</span>
              <input
                type="number"
                min="100"
                step="50"
                required
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] focus:outline-none focus:border-[#B89635] text-sm font-bold"
              />
            </div>
            <p className="text-[11px] text-[#6B5B30]">
              Reference guide to match similar grade garments. No cash exchange will occur.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#6B5B30] uppercase tracking-wider mb-1">
              Garment Details & Fabric Story *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the fabric, fit, how often it was worn, care instructions, and any unique features."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] focus:outline-none focus:border-[#B89635] text-sm"
            />
          </div>

          {/* Image Upload / Presets */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#6B5B30] uppercase tracking-wider">
              Garment Photo *
            </label>

            {/* Live Preview */}
            {imageUrl ? (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#FEF4D5] border border-[#E8D494]">
                <img
                  src={getSafeImageUrl(imageUrl, category)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, category)}
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full backdrop-blur-sm"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-[#183E2A] text-[#FDE68A] text-[11px] px-2.5 py-0.5 rounded-lg border border-[#D4AF37]/40 font-bold flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Image Loaded
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-[#EED895] hover:border-[#8A6A1C] rounded-2xl p-6 text-center space-y-3 transition bg-[#FEF6DB]">
                <div className="w-12 h-12 rounded-full bg-[#FEF4D5] text-[#8A6A1C] flex items-center justify-center mx-auto border border-[#E8D494]">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <label className="cursor-pointer text-xs font-bold text-[#1A2E22] hover:bg-[#FCEFC7] bg-[#FFF9E6] px-4 py-2 rounded-xl inline-block border border-[#EED895] shadow-xs transition">
                    Choose Local Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-[#6B5B30] mt-1">
                    Upload PNG, JPG, or WEBP from your phone or laptop
                  </p>
                </div>
              </div>
            )}

            {/* Or pick from curated demo presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#6B5B30]">
                Or pick a curated fashion preset:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {curatedPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className="text-[10px] font-semibold bg-[#FEF4D5] hover:bg-[#FCEFC7] text-[#1A2E22] px-2.5 py-1 rounded-lg border border-[#E8D494] transition"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL Option */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="url"
                placeholder="Or paste an image web URL..."
                value={imageUrl.startsWith('data:') ? '' : imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-xs text-[#1A2E22] focus:outline-none focus:border-[#B89635]"
              />
            </div>
          </div>

          {/* Status (if editing) */}
          {itemToEdit && (
            <div>
              <label className="block text-xs font-bold text-[#6B5B30] uppercase tracking-wider mb-1">
                Listing Availability Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#EED895] bg-[#FFFDF5] text-[#1A2E22] font-semibold focus:outline-none focus:border-[#B89635] text-sm"
              >
                <option value="available">Available for Swap</option>
                <option value="pending">Swap In Progress</option>
                <option value="swapped">Swapped</option>
              </select>
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-4 border-t border-[#EED895]/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#EED895] text-[#6B5B30] hover:bg-[#FEF4D5] text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#183E2A] hover:bg-[#122A1E] text-[#FDE68A] text-xs font-bold shadow-xl transition disabled:opacity-50 border border-[#D4AF37]/40"
            >
              {isSubmitting ? 'Saving to Database...' : itemToEdit ? 'Save Changes' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
