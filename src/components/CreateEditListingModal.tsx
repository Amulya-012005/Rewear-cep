import React, { useState, useEffect } from 'react';
import { ClothingListing, ClothingCategory, ClothingCondition, ClothingSize } from '../types.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator
} from 'lucide-react';
import { api } from '../services/api.ts';
import { INDIAN_STATE_CAPITALS } from '../data/indiaLocations.ts';

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

  const cities = ['Hubballi', 'Bengaluru', 'Mysuru', 'Pune'];

  // Smart Value Estimator Helper
  const handleAutoEstimate = async () => {
    try {
      const res = await api.estimateSwapValue({
        category,
        brandTier: 'fast_fashion',
        condition
      });
      setEstimatedValue(res.estimatedValue);
    } catch {
      // Fallback local calc
      setEstimatedValue(1500);
    }
  };

  // Handle local file upload via FileReader (converts to data URL persistently stored in backend db)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Image file is larger than 8MB. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setError(null);
      }
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#FAF7F0] rounded-3xl shadow-2xl border border-[#E5DFD4] text-stone-800 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1E3627]">
              {itemToEdit ? 'Edit Clothing Listing' : 'List an Item for Barter Swap'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Upload clothes you no longer wear to swap with someone nearby. No cash payments.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition"
          >
            <X className="w-4 h-4 text-stone-600" />
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Garment Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pure Linen Relaxed Summer Shirt"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#2C573F] text-sm"
            />
          </div>

          {/* Category & Brand row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ClothingCategory)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#2C573F] text-sm bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Brand / Label *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. FabIndia, Zara, Levi's, Thrifted"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#2C573F] text-sm"
              />
            </div>
          </div>

          {/* Size, Condition, City row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Size *
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as ClothingSize)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#2C573F] text-sm bg-white"
              >
                {sizes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ClothingCondition)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#2C573F] text-sm bg-white"
              >
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Exchange City *
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#2C573F] text-sm bg-white"
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
          <div className="p-4 bg-[#FAF8F4] rounded-2xl border border-[#E9E3D5] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-[#2C573F]" />
                Estimated Swap Parity Value (₹) *
              </label>
              <button
                type="button"
                onClick={handleAutoEstimate}
                className="text-xs text-[#234533] hover:text-[#183526] font-semibold flex items-center gap-1 underline"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Auto-Suggest Value
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-stone-400">₹</span>
              <input
                type="number"
                min="100"
                step="50"
                required
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#2C573F] text-sm bg-white font-bold text-stone-800"
              />
            </div>
            <p className="text-[11px] text-stone-500">
              Reference guide to match similar grade garments. No cash exchange will occur.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Garment Details & Fabric Story *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the fabric, fit, how often it was worn, care instructions, and any unique features."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#2C573F] text-sm"
            />
          </div>

          {/* Image Upload / Presets */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              Garment Photo *
            </label>

            {/* Live Preview */}
            {imageUrl ? (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-300">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full backdrop-blur-sm"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 bg-emerald-700/80 text-white text-[11px] px-2 py-0.5 rounded backdrop-blur-sm font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Image Loaded
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-stone-300 hover:border-[#2C573F] rounded-2xl p-6 text-center space-y-3 transition bg-[#FAF9F6]">
                <div className="w-12 h-12 rounded-full bg-[#EAE3D5] text-[#2C573F] flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <label className="cursor-pointer text-xs font-bold text-[#234533] hover:underline bg-[#EAE2D4] px-3 py-1.5 rounded-lg inline-block">
                    Choose Local Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Upload PNG, JPG, or WEBP from your phone or laptop
                  </p>
                </div>
              </div>
            )}

            {/* Or pick from curated demo presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-stone-500">
                Or pick a curated fashion preset:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {curatedPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className="text-[10px] bg-stone-100 hover:bg-[#EAE2D4] text-stone-700 px-2.5 py-1 rounded-md border border-stone-200 transition"
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
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs focus:ring-1 focus:ring-[#2C573F]"
              />
            </div>
          </div>

          {/* Status (if editing) */}
          {itemToEdit && (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Listing Availability Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#2C573F] text-sm bg-white"
              >
                <option value="available">Available for Swap</option>
                <option value="pending">Swap In Progress</option>
                <option value="swapped">Swapped</option>
              </select>
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#234533] hover:bg-[#1A3426] text-white text-xs font-bold shadow-md transition disabled:opacity-50"
            >
              {isSubmitting ? 'Saving to Database...' : itemToEdit ? 'Save Changes' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
