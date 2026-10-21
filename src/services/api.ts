import {
  User,
  ClothingListing,
  SwapRequest,
  ChatMessage,
  Dispute,
  AdminStats
} from '../types.ts';
import { SEED_LISTINGS } from '../data/seedListings.ts';

const TOKEN_KEY = 'rewear_auth_token';

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(endpoint, {
      ...options,
      headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.error || `HTTP error ${res.status}: ${res.statusText}`;
      throw new Error(errorMsg);
    }

    return data as T;
  },

  // Auth
  async register(payload: { email: string; password: string; name: string; city: string; bio?: string }) {
    const res = await this.request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    this.setToken(res.token);
    return res;
  },

  async login(payload: { email: string; password: string }) {
    const res = await this.request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    this.setToken(res.token);
    return res;
  },

  async switchDemoUser(email: string) {
    const res = await this.request<{ user: User; token: string }>('/api/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    this.setToken(res.token);
    return res;
  },

  async getMe() {
    return this.request<{ user: User }>('/api/auth/me');
  },

  async logout() {
    try {
      await this.request<{ message: string }>('/api/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  },

  async updateProfile(payload: { name?: string; city?: string; bio?: string; avatarUrl?: string }) {
    return this.request<{ user: User }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },

  async getDemoUsers() {
    return this.request<{ users: User[] }>('/api/auth/demo-users');
  },

  // Listings
  async getListings(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    const url = `/api/listings${query ? `?${query}` : ''}`;
    try {
      const res = await this.request<{ listings: ClothingListing[] }>(url);
      if (res && res.listings && res.listings.length > 0) {
        return res;
      }
      return { listings: SEED_LISTINGS };
    } catch (e) {
      console.warn('Backend API unreachable, using realistic seed listings fallback:', e);
      return { listings: SEED_LISTINGS };
    }
  },

  async getListingById(id: string) {
    try {
      return await this.request<{ listing: ClothingListing }>(`/api/listings/${id}`);
    } catch (e) {
      const fallback = SEED_LISTINGS.find(l => l.id === id);
      if (fallback) {
        return { listing: fallback };
      }
      throw e;
    }
  },

  async createListing(listing: Partial<ClothingListing>) {
    return this.request<{ listing: ClothingListing }>('/api/listings', {
      method: 'POST',
      body: JSON.stringify(listing)
    });
  },

  async updateListing(id: string, listing: Partial<ClothingListing>) {
    return this.request<{ listing: ClothingListing }>(`/api/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listing)
    });
  },

  async deleteListing(id: string) {
    return this.request<{ message: string }>(`/api/listings/${id}`, {
      method: 'DELETE'
    });
  },

  // Swaps
  async getSwaps() {
    return this.request<{ incoming?: SwapRequest[]; outgoing?: SwapRequest[]; swaps?: SwapRequest[] }>('/api/swaps');
  },

  async getSwapById(id: string) {
    return this.request<{ swap: SwapRequest }>(`/api/swaps/${id}`);
  },

  async proposeSwap(payload: {
    requestedItemId: string;
    offeredItemId: string;
    message?: string;
    proposalMessage?: string;
    handoverMethod?: string;
    pickupLocation?: string;
    approxDeliveryDate?: string;
  }) {
    const bodyPayload = {
      ...payload,
      message: payload.message || payload.proposalMessage
    };
    return this.request<{ swap: SwapRequest }>('/api/swaps', {
      method: 'POST',
      body: JSON.stringify(bodyPayload)
    });
  },

  async performSwapAction(
    swapId: string,
    action: 'accept' | 'reject' | 'cancel' | 'confirm_completed' | 'ready_for_exchange' | 'update_delivery',
    details?: {
      handoverMethod?: string;
      pickupLocation?: string;
      courierTrackingRef?: string;
      approxDeliveryDate?: string;
    }
  ) {
    return this.request<{ swap: SwapRequest }>(`/api/swaps/${swapId}/action`, {
      method: 'POST',
      body: JSON.stringify({ action, ...(details || {}) })
    });
  },

  // Chat
  async getMessages(swapId: string) {
    return this.request<{ messages: ChatMessage[] }>(`/api/swaps/${swapId}/messages`);
  },

  async sendMessage(swapId: string, content: string) {
    return this.request<{ message: ChatMessage }>(`/api/swaps/${swapId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  },

  // Disputes & Admin
  async submitDispute(payload: { swapId: string; reason: string }) {
    return this.request<{ dispute: Dispute }>('/api/disputes', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getAdminStats() {
    return this.request<AdminStats>('/api/admin/stats');
  },

  async getAdminDisputes() {
    return this.request<{ disputes: Dispute[] }>('/api/admin/disputes');
  },

  async getAdminSwaps() {
    return this.request<{ swaps: any[] }>('/api/admin/swaps');
  },

  async resolveDispute(id: string, status: string, resolutionNote: string) {
    return this.request<{ dispute: Dispute }>(`/api/admin/disputes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, resolutionNote })
    });
  },

  async adminDeleteListing(id: string) {
    return this.request<{ message: string }>(`/api/admin/listings/${id}`, {
      method: 'DELETE'
    });
  },

  async adminResetDemo() {
    return this.request<{ message: string }>('/api/admin/reset-demo', {
      method: 'POST'
    });
  },

  // Calculator
  async estimateSwapValue(payload: { category: string; brandTier?: string; brand?: string; condition: string; originalPrice?: number; ageInMonths?: number }) {
    return this.request<{ estimatedValue: number; explanation: string }>('/api/calculator/estimate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async calculateSwapValue(payload: { category: string; brandTier?: string; brand?: string; condition: string; originalPrice?: number; ageInMonths?: number }) {
    return this.estimateSwapValue(payload);
  }
};
