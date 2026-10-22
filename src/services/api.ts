import {
  User,
  ClothingListing,
  SwapRequest,
  ChatMessage,
  Dispute,
  AdminStats
} from '../types.ts';
import { SEED_LISTINGS } from '../data/seedListings.ts';
import { localStore } from './localStore.ts';

const TOKEN_KEY = 'rewear_auth_token';

let isLocalModeActive = false;

// If we previously marked fallback mode in this session, retain it
try {
  if (typeof window !== 'undefined' && sessionStorage.getItem('rewear_mode_fallback') === 'true') {
    isLocalModeActive = true;
  }
} catch {
  // ignore
}

function enableLocalMode() {
  isLocalModeActive = true;
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('rewear_mode_fallback', 'true');
    }
  } catch {
    // ignore
  }
}

function isStaticHostError(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || String(err)).toLowerCase();
  return (
    msg.includes('405') ||
    msg.includes('404') ||
    msg.includes('method not allowed') ||
    msg.includes('not found') ||
    msg.includes('failed to fetch') ||
    msg.includes('networkerror') ||
    msg.includes('load failed') ||
    msg.includes('json') ||
    msg.includes('syntaxerror') ||
    msg.includes('unexpected token') ||
    msg.includes('502') ||
    msg.includes('503') ||
    msg.includes('504')
  );
}

// Proactive static host probe on initialization:
// Probe /api/health - if it's 405, 404, or returns static HTML (Vercel SPA rewrite), activate local mode
if (typeof window !== 'undefined') {
  fetch('/api/health')
    .then(async res => {
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || res.status === 405 || res.status === 404 || contentType.includes('text/html')) {
        enableLocalMode();
      }
    })
    .catch(() => {
      enableLocalMode();
    });
}

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

    const contentType = res.headers.get('content-type') || '';
    if (res.status === 405 || res.status === 404 || contentType.includes('text/html')) {
      enableLocalMode();
      throw new Error(`HTTP error ${res.status}: Method Not Allowed`);
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.error || `HTTP error ${res.status}: ${res.statusText}`;
      throw new Error(errorMsg);
    }

    return data as T;
  },

  // Auth
  async register(payload: { email: string; password: string; name: string; city: string; bio?: string }) {
    if (isLocalModeActive) {
      const res = localStore.register(payload);
      this.setToken(res.token);
      return res;
    }
    try {
      const res = await this.request<{ user: User; token: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      this.setToken(res.token);
      localStore.setCurrentUser(res.user);
      return res;
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        const res = localStore.register(payload);
        this.setToken(res.token);
        return res;
      }
      throw err;
    }
  },

  async login(payload: { email: string; password: string }) {
    if (isLocalModeActive) {
      const res = localStore.login(payload.email, payload.password);
      this.setToken(res.token);
      return res;
    }
    try {
      const res = await this.request<{ user: User; token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      this.setToken(res.token);
      localStore.setCurrentUser(res.user);
      return res;
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        const res = localStore.login(payload.email, payload.password);
        this.setToken(res.token);
        return res;
      }
      throw err;
    }
  },

  async switchDemoUser(email: string) {
    if (isLocalModeActive) {
      const res = localStore.switchDemoUser(email);
      this.setToken(res.token);
      return res;
    }
    try {
      const res = await this.request<{ user: User; token: string }>('/api/auth/switch-demo', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      this.setToken(res.token);
      localStore.setCurrentUser(res.user);
      return res;
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        const res = localStore.switchDemoUser(email);
        this.setToken(res.token);
        return res;
      }
      throw err;
    }
  },

  async getMe() {
    if (isLocalModeActive) {
      const user = localStore.getCurrentUser();
      if (!user) throw new Error('No user currently authenticated');
      return { user };
    }
    try {
      const res = await this.request<{ user: User }>('/api/auth/me');
      localStore.setCurrentUser(res.user);
      return res;
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        const user = localStore.getCurrentUser();
        if (!user) throw new Error('No user currently authenticated');
        return { user };
      }
      throw err;
    }
  },

  async logout() {
    try {
      if (!isLocalModeActive) {
        await this.request<{ message: string }>('/api/auth/logout', { method: 'POST' }).catch(() => {});
      }
    } finally {
      this.clearToken();
      localStore.logout();
    }
  },

  async updateProfile(payload: { name?: string; city?: string; bio?: string; avatarUrl?: string }) {
    if (isLocalModeActive) {
      const user = localStore.updateProfile(payload);
      return { user };
    }
    try {
      const res = await this.request<{ user: User }>('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      localStore.updateProfile(payload);
      return res;
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        const user = localStore.updateProfile(payload);
        return { user };
      }
      throw err;
    }
  },

  async getDemoUsers() {
    if (isLocalModeActive) {
      return { users: localStore.getUsers() };
    }
    try {
      return await this.request<{ users: User[] }>('/api/auth/demo-users');
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        return { users: localStore.getUsers() };
      }
      throw err;
    }
  },

  // Listings
  async getListings(params: Record<string, string> = {}) {
    if (isLocalModeActive) {
      return { listings: localStore.getListings(params) };
    }
    const query = new URLSearchParams(params).toString();
    const url = `/api/listings${query ? `?${query}` : ''}`;
    try {
      const res = await this.request<{ listings: ClothingListing[] }>(url);
      if (res && res.listings && res.listings.length > 0) {
        return res;
      }
      return { listings: localStore.getListings(params) };
    } catch {
      enableLocalMode();
      return { listings: localStore.getListings(params) };
    }
  },

  async getListingById(id: string) {
    if (isLocalModeActive) {
      const listing = localStore.getListingById(id);
      if (listing) return { listing };
      const fallback = SEED_LISTINGS.find(l => l.id === id);
      if (fallback) return { listing: fallback };
      throw new Error('Listing not found');
    }
    try {
      return await this.request<{ listing: ClothingListing }>(`/api/listings/${id}`);
    } catch {
      enableLocalMode();
      const listing = localStore.getListingById(id) || SEED_LISTINGS.find(l => l.id === id);
      if (listing) return { listing };
      throw new Error('Listing not found');
    }
  },

  async createListing(listing: Partial<ClothingListing>) {
    if (isLocalModeActive) {
      const created = localStore.createListing(listing);
      return { listing: created };
    }
    try {
      return await this.request<{ listing: ClothingListing }>('/api/listings', {
        method: 'POST',
        body: JSON.stringify(listing)
      });
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        const created = localStore.createListing(listing);
        return { listing: created };
      }
      throw err;
    }
  },

  async updateListing(id: string, listing: Partial<ClothingListing>) {
    if (isLocalModeActive) {
      const updated = localStore.updateListing(id, listing);
      return { listing: updated };
    }
    try {
      return await this.request<{ listing: ClothingListing }>(`/api/listings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(listing)
      });
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        const updated = localStore.updateListing(id, listing);
        return { listing: updated };
      }
      throw err;
    }
  },

  async deleteListing(id: string) {
    if (isLocalModeActive) {
      localStore.deleteListing(id);
      return { message: 'Listing deleted successfully' };
    }
    try {
      return await this.request<{ message: string }>(`/api/listings/${id}`, {
        method: 'DELETE'
      });
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        localStore.deleteListing(id);
        return { message: 'Listing deleted successfully' };
      }
      throw err;
    }
  },

  // Swaps
  async getSwaps() {
    if (isLocalModeActive) {
      const user = localStore.getCurrentUser();
      if (!user) return { incoming: [], outgoing: [], swaps: [] };
      if (user.role === 'admin') {
        const all = localStore.getSwaps();
        return {
          swaps: all,
          incoming: all.filter(s => s.ownerId === user.id),
          outgoing: all.filter(s => s.requesterId === user.id)
        };
      }
      const userSwaps = localStore.getUserSwaps(user.id);
      return {
        incoming: userSwaps.incoming,
        outgoing: userSwaps.outgoing,
        swaps: [...userSwaps.incoming, ...userSwaps.outgoing]
      };
    }
    try {
      return await this.request<{ incoming?: SwapRequest[]; outgoing?: SwapRequest[]; swaps?: SwapRequest[] }>('/api/swaps');
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        const user = localStore.getCurrentUser();
        if (!user) return { incoming: [], outgoing: [], swaps: [] };
        if (user.role === 'admin') {
          const all = localStore.getSwaps();
          return {
            swaps: all,
            incoming: all.filter(s => s.ownerId === user.id),
            outgoing: all.filter(s => s.requesterId === user.id)
          };
        }
        const userSwaps = localStore.getUserSwaps(user.id);
        return {
          incoming: userSwaps.incoming,
          outgoing: userSwaps.outgoing,
          swaps: [...userSwaps.incoming, ...userSwaps.outgoing]
        };
      }
      throw err;
    }
  },

  async getSwapById(id: string) {
    if (isLocalModeActive) {
      const swap = localStore.getSwapById(id);
      if (!swap) throw new Error('Swap request not found');
      return { swap };
    }
    try {
      return await this.request<{ swap: SwapRequest }>(`/api/swaps/${id}`);
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        const swap = localStore.getSwapById(id);
        if (!swap) throw new Error('Swap request not found');
        return { swap };
      }
      throw err;
    }
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
    if (isLocalModeActive) {
      const swap = localStore.proposeSwap(payload);
      return { swap };
    }
    const bodyPayload = {
      ...payload,
      message: payload.message || payload.proposalMessage
    };
    try {
      return await this.request<{ swap: SwapRequest }>('/api/swaps', {
        method: 'POST',
        body: JSON.stringify(bodyPayload)
      });
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        const swap = localStore.proposeSwap(payload);
        return { swap };
      }
      throw err;
    }
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
    if (isLocalModeActive) {
      const swap = localStore.performSwapAction(swapId, action, details);
      return { swap };
    }
    try {
      return await this.request<{ swap: SwapRequest }>(`/api/swaps/${swapId}/action`, {
        method: 'POST',
        body: JSON.stringify({ action, ...(details || {}) })
      });
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        const swap = localStore.performSwapAction(swapId, action, details);
        return { swap };
      }
      throw err;
    }
  },

  // Chat
  async getMessages(swapId: string) {
    if (isLocalModeActive) {
      return { messages: localStore.getMessages(swapId) };
    }
    try {
      return await this.request<{ messages: ChatMessage[] }>(`/api/swaps/${swapId}/messages`);
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        return { messages: localStore.getMessages(swapId) };
      }
      throw err;
    }
  },

  async sendMessage(swapId: string, content: string) {
    if (isLocalModeActive) {
      return { message: localStore.sendMessage(swapId, content) };
    }
    try {
      return await this.request<{ message: ChatMessage }>(`/api/swaps/${swapId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content })
      });
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        return { message: localStore.sendMessage(swapId, content) };
      }
      throw err;
    }
  },

  // Disputes & Admin
  async submitDispute(payload: { swapId: string; reason: string }) {
    if (isLocalModeActive) {
      const dispute = localStore.submitDispute(payload.swapId, payload.reason);
      return { dispute };
    }
    try {
      return await this.request<{ dispute: Dispute }>('/api/disputes', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        const dispute = localStore.submitDispute(payload.swapId, payload.reason);
        return { dispute };
      }
      throw err;
    }
  },

  async getAdminStats() {
    if (isLocalModeActive) {
      return localStore.getAdminStats();
    }
    try {
      return await this.request<AdminStats>('/api/admin/stats');
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        return localStore.getAdminStats();
      }
      throw err;
    }
  },

  async getAdminDisputes() {
    if (isLocalModeActive) {
      return { disputes: localStore.getDisputes() };
    }
    try {
      return await this.request<{ disputes: Dispute[] }>('/api/admin/disputes');
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        return { disputes: localStore.getDisputes() };
      }
      throw err;
    }
  },

  async getAdminSwaps() {
    if (isLocalModeActive) {
      return { swaps: localStore.getSwaps() };
    }
    try {
      return await this.request<{ swaps: any[] }>('/api/admin/swaps');
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        return { swaps: localStore.getSwaps() };
      }
      throw err;
    }
  },

  async resolveDispute(id: string, status: string, resolutionNote: string) {
    if (isLocalModeActive) {
      const dispute = localStore.resolveDispute(id, status, resolutionNote);
      return { dispute };
    }
    try {
      return await this.request<{ dispute: Dispute }>(`/api/admin/disputes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status, resolutionNote })
      });
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        const dispute = localStore.resolveDispute(id, status, resolutionNote);
        return { dispute };
      }
      throw err;
    }
  },

  async adminDeleteListing(id: string) {
    if (isLocalModeActive) {
      localStore.deleteListing(id);
      return { message: 'Listing permanently removed by administrator.' };
    }
    try {
      return await this.request<{ message: string }>(`/api/admin/listings/${id}`, {
        method: 'DELETE'
      });
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        localStore.deleteListing(id);
        return { message: 'Listing permanently removed by administrator.' };
      }
      throw err;
    }
  },

  async adminResetDemo() {
    if (isLocalModeActive) {
      localStore.resetDemo();
      return { message: 'Database reset to initial sample state.' };
    }
    try {
      return await this.request<{ message: string }>('/api/admin/reset-demo', {
        method: 'POST'
      });
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        localStore.resetDemo();
        return { message: 'Database reset to initial sample state.' };
      }
      throw err;
    }
  },

  // Calculator
  async estimateSwapValue(payload: { category: string; brandTier?: string; brand?: string; condition: string; originalPrice?: number; ageInMonths?: number }) {
    if (isLocalModeActive) {
      return localStore.estimateSwapValue(payload);
    }
    try {
      return await this.request<{ estimatedValue: number; explanation: string }>('/api/calculator/estimate', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (err: any) {
      if (isStaticHostError(err)) {
        enableLocalMode();
        return localStore.estimateSwapValue(payload);
      }
      throw err;
    }
  },

  async calculateSwapValue(payload: { category: string; brandTier?: string; brand?: string; condition: string; originalPrice?: number; ageInMonths?: number }) {
    return this.estimateSwapValue(payload);
  }
};
