import {
  User,
  ClothingListing,
  SwapRequest,
  ChatMessage,
  Dispute,
  AdminStats,
  ClothingCategory,
  ClothingCondition,
  ClothingSize
} from '../types.ts';
import { SEED_LISTINGS } from '../data/seedListings.ts';
import { getSafeImageUrl, DEFAULT_AVATAR } from '../utils/imageFallback.ts';

export const VERIFIED_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80',
];

export function createStarterWardrobeForUser(user: { id: string; name: string; city: string }): ClothingListing[] {
  const now = new Date().toISOString();
  return [
    {
      id: `lst_${user.id}_starter_1`,
      userId: user.id,
      userName: user.name,
      userCity: user.city,
      title: "Levi's Classic Blue Denim Trucker Jacket",
      description: "Timeless medium-wash indigo denim jacket with copper buttons and double chest pockets. Well-cared for, crisp fabric.",
      category: 'Jackets & Hoodies',
      brand: "Levi's",
      size: 'M',
      condition: 'Gently Used',
      city: user.city,
      estimatedValue: 1200,
      imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
      status: 'available',
      createdAt: now,
      updatedAt: now,
      isDemo: false
    },
    {
      id: `lst_${user.id}_starter_2`,
      userId: user.id,
      userName: user.name,
      userCity: user.city,
      title: 'FabIndia Pure Handspun Cotton Kurta - Maroon',
      description: 'Breathable handwoven organic cotton kurta with mandarin collar and wooden toggle buttons. Extremely comfortable and versatile.',
      category: 'Traditional & Ethnic Wear',
      brand: 'FabIndia',
      size: 'L',
      condition: 'Like New',
      city: user.city,
      estimatedValue: 950,
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      status: 'available',
      createdAt: now,
      updatedAt: now,
      isDemo: false
    },
    {
      id: `lst_${user.id}_starter_3`,
      userId: user.id,
      userName: user.name,
      userCity: user.city,
      title: 'Marks & Spencer Pure Linen Casual Shirt - Beige',
      description: 'Crisp sand beige French linen button-down shirt with chest pocket. Breathable, relaxed fit and pre-washed for softness.',
      category: 'Shirts & Tops',
      brand: 'Marks & Spencer',
      size: 'M',
      condition: 'Like New',
      city: user.city,
      estimatedValue: 1100,
      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      status: 'available',
      createdAt: now,
      updatedAt: now,
      isDemo: false
    }
  ];
}

const USERS_KEY = 'rewear_local_users';
const LISTINGS_KEY = 'rewear_local_listings';
const SWAPS_KEY = 'rewear_local_swaps';
const MESSAGES_KEY = 'rewear_local_messages';
const DISPUTES_KEY = 'rewear_local_disputes';
const CURRENT_USER_KEY = 'rewear_current_user';

export const SEED_USERS: (User & { password?: string })[] = [
  {
    id: 'usr_admin',
    email: 'admin@rewear.org',
    password: 'admin123',
    name: 'ReWear Admin',
    city: 'Bengaluru',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Platform moderator ensuring safe, eco-conscious clothing exchanges.',
    createdAt: '2026-10-01T00:00:00Z',
  },
  {
    id: 'usr_priya',
    email: 'priya@example.com',
    password: 'swap123',
    name: 'Priya Sharma',
    city: 'Bengaluru',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    bio: 'Lover of vintage sarees, oversized jackets, and circular slow fashion.',
    createdAt: '2026-10-02T00:00:00Z',
  },
  {
    id: 'usr_rahul',
    email: 'rahul@example.com',
    password: 'swap123',
    name: 'Rahul Patil',
    city: 'Hubballi',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'Minimalist college student trading jackets, streetwear, and sneakers.',
    createdAt: '2026-10-03T00:00:00Z',
  },
  {
    id: 'usr_ananya',
    email: 'ananya@example.com',
    password: 'swap123',
    name: 'Ananya Hegde',
    city: 'Mysuru',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    bio: 'Upcycling textile enthusiast. Seeking quality denim and linen shirts.',
    createdAt: '2026-10-04T00:00:00Z',
  },
  {
    id: 'usr_karan',
    email: 'karan@example.com',
    password: 'swap123',
    name: 'Karan Joshi',
    city: 'Pune',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    bio: 'Sustainable wardrobe builder. Exchanging formal shirts, kurtas, and jackets.',
    createdAt: '2026-10-05T00:00:00Z',
  },
];

export const INITIAL_SWAPS: SwapRequest[] = [
  {
    id: 'swp_demo_01',
    requesterId: 'usr_priya',
    requesterName: 'Priya Sharma',
    requesterCity: 'Bengaluru',
    ownerId: 'usr_rahul',
    ownerName: 'Rahul Patil',
    ownerCity: 'Hubballi',
    requestedItemId: 'lst_101',
    requestedItemTitle: "Levi's Classic Blue Denim Trucker Jacket",
    requestedItemImage: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    requestedItemValue: 1200,
    offeredItemId: 'lst_106',
    offeredItemTitle: 'Traditional Handwoven Kanjeevaram Silk Saree',
    offeredItemImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    offeredItemValue: 2000,
    status: 'accepted',
    message: 'Hi Rahul! Would love to trade my silk saree for your Levi denim trucker jacket. Can arrange delivery or courier!',
    handoverMethod: 'local_meetup',
    pickupLocation: 'Central Bus Station Plaza, Hubballi or Bengaluru Hub',
    approxDeliveryDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    requesterConfirmedCompleted: false,
    ownerConfirmedCompleted: false,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'swp_demo_02',
    requesterId: 'usr_ananya',
    requesterName: 'Ananya Hegde',
    requesterCity: 'Mysuru',
    ownerId: 'usr_karan',
    ownerName: 'Karan Joshi',
    ownerCity: 'Pune',
    requestedItemId: 'lst_102',
    requestedItemTitle: 'H&M Relaxed Fit Fleece Hoodie - Sage Green',
    requestedItemImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    requestedItemValue: 950,
    offeredItemId: 'lst_109',
    offeredItemTitle: 'Minimalist Black Casual Crewneck T-shirt',
    offeredItemImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    offeredItemValue: 350,
    status: 'completed',
    message: 'Hello Karan, I have shipped the tee via India Speed Post. Excited for the hoodie!',
    handoverMethod: 'courier',
    pickupLocation: 'India Post Courier Tracking #EM982736154IN',
    requesterConfirmedCompleted: true,
    ownerConfirmedCompleted: true,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'swp_demo_03',
    requesterId: 'usr_karan',
    requesterName: 'Karan Joshi',
    requesterCity: 'Pune',
    ownerId: 'usr_priya',
    ownerName: 'Priya Sharma',
    ownerCity: 'Bengaluru',
    requestedItemId: 'lst_104',
    requestedItemTitle: 'Roadster Vintage Biker Faux-Leather Jacket',
    requestedItemImage: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80',
    requestedItemValue: 1350,
    offeredItemId: 'lst_110',
    offeredItemTitle: 'Marks & Spencer Pure Linen Casual Shirt - Beige',
    offeredItemImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    offeredItemValue: 1100,
    status: 'pending',
    message: 'Hi Priya, really interested in your Roadster biker jacket. Offering my pristine M&S French linen shirt in exchange!',
    handoverMethod: 'local_meetup',
    pickupLocation: 'Forum South Mall, Konanakunte or Metro Station Gate 2',
    requesterConfirmedCompleted: false,
    ownerConfirmedCompleted: false,
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
  }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_001',
    swapId: 'swp_demo_01',
    senderId: 'usr_priya',
    senderName: 'Priya Sharma',
    content: 'Hey Rahul! Thanks for accepting the swap. Is the sleeve length standard on the Levi jacket?',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'msg_002',
    swapId: 'swp_demo_01',
    senderId: 'usr_rahul',
    senderName: 'Rahul Patil',
    content: 'Hey Priya! Yes, standard 25 inches from shoulder seam. Fits comfortably with a hoodie underneath!',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'msg_003',
    swapId: 'swp_demo_01',
    senderId: 'usr_priya',
    senderName: 'Priya Sharma',
    content: 'Awesome. I have packed the silk saree with its original cover. We can do handoff at the Central Bus Station landmark or speed post!',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  }
];

class LocalStore {
  // Safe helper to read from localStorage
  private getItem<T>(key: string, fallback: T): T {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return fallback;
      return JSON.parse(stored) as T;
    } catch {
      return fallback;
    }
  }

  // Safe helper to write to localStorage
  private setItem<T>(key: string, value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage write error:', e);
    }
  }

  // --- Users ---
  getUsers(): (User & { password?: string })[] {
    const users = this.getItem<(User & { password?: string })[]>(USERS_KEY, []);
    if (!users || users.length === 0) {
      this.setItem(USERS_KEY, SEED_USERS);
      return SEED_USERS;
    }
    // Ensure all seed users exist
    const existingIds = new Set(users.map(u => u.id));
    let updated = false;
    for (const seed of SEED_USERS) {
      if (!existingIds.has(seed.id)) {
        users.push(seed);
        updated = true;
      }
    }
    if (updated) {
      this.setItem(USERS_KEY, users);
    }
    return users.map(u => ({
      ...u,
      avatarUrl: getSafeImageUrl(u.avatarUrl)
    }));
  }

  findUserByEmail(email: string): (User & { password?: string }) | undefined {
    const cleanEmail = email.trim().toLowerCase();
    return this.getUsers().find(u => u.email.toLowerCase() === cleanEmail);
  }

  findUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  }

  getCurrentUser(): User | null {
    const user = this.getItem<User | null>(CURRENT_USER_KEY, null);
    if (!user) return null;
    // Refresh with current profile data
    const fresh = this.findUserById(user.id);
    return fresh || user;
  }

  setCurrentUser(user: User | null) {
    if (user) {
      this.setItem(CURRENT_USER_KEY, user);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  // Auth Operations
  login(email: string, _password?: string): { user: User; token: string } {
    const user = this.findUserByEmail(email);
    if (!user) {
      // If user typed something like admin or priya without domain
      const fuzzy = this.getUsers().find(u => u.name.toLowerCase().includes(email.toLowerCase()));
      if (fuzzy) {
        const token = `token_${fuzzy.id}_${Date.now()}`;
        this.setCurrentUser(fuzzy);
        return { user: fuzzy, token };
      }
      throw new Error('Account not found with this email. Please check your credentials or register a new account.');
    }

    const token = `token_${user.id}_${Date.now()}`;
    const { password: _pwd, ...safeUser } = user;
    this.setCurrentUser(safeUser);
    return { user: safeUser, token };
  }

  register(payload: { email: string; password?: string; name: string; city: string; bio?: string; avatarUrl?: string }): { user: User; token: string } {
    const cleanEmail = payload.email.trim().toLowerCase();
    const existing = this.findUserByEmail(cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please sign in instead.');
    }

    const randomAvatar = VERIFIED_AVATARS[Math.floor(Math.random() * VERIFIED_AVATARS.length)];
    const newUser: User & { password?: string } = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: cleanEmail,
      password: payload.password || 'password123',
      name: payload.name.trim(),
      city: payload.city.trim(),
      role: 'user',
      avatarUrl: payload.avatarUrl || randomAvatar,
      bio: payload.bio || 'Sustainable fashion enthusiast bartering clothes to reduce waste.',
      createdAt: new Date().toISOString()
    };

    const users = this.getUsers();
    users.push(newUser);
    this.setItem(USERS_KEY, users);

    // Auto-seed starter wardrobe items so new users can immediately swap without empty closet barrier
    const starterItems = createStarterWardrobeForUser(newUser);
    const existingListings = this.getItem<ClothingListing[]>(LISTINGS_KEY, [...SEED_LISTINGS]);
    this.setItem(LISTINGS_KEY, [...starterItems, ...existingListings]);

    const token = `token_${newUser.id}_${Date.now()}`;
    const { password: _pwd, ...safeUser } = newUser;
    this.setCurrentUser(safeUser);
    return { user: safeUser, token };
  }

  switchDemoUser(email: string): { user: User; token: string } {
    const user = this.findUserByEmail(email);
    if (!user) {
      throw new Error(`Demo user '${email}' not found.`);
    }
    const token = `token_${user.id}_${Date.now()}`;
    const { password: _pwd, ...safeUser } = user;
    this.setCurrentUser(safeUser);
    return { user: safeUser, token };
  }

  logout() {
    this.setCurrentUser(null);
  }

  updateProfile(updates: Partial<User>): User {
    const current = this.getCurrentUser();
    if (!current) throw new Error('Not authenticated.');

    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === current.id);
    if (idx === -1) throw new Error('User not found.');

    const updatedUser = { ...users[idx], ...updates };
    users[idx] = updatedUser;
    this.setItem(USERS_KEY, users);

    const { password: _pwd, ...safeUser } = updatedUser;
    this.setCurrentUser(safeUser);
    return safeUser;
  }

  // --- Listings ---
  getListings(params: Record<string, string> = {}): ClothingListing[] {
    let items = this.getItem<ClothingListing[]>(LISTINGS_KEY, []);
    if (!items || items.length === 0) {
      items = [...SEED_LISTINGS];
      this.setItem(LISTINGS_KEY, items);
    } else {
      // Ensure seed listings are present
      const existingIds = new Set(items.map(l => l.id));
      let added = false;
      for (const seed of SEED_LISTINGS) {
        if (!existingIds.has(seed.id)) {
          items.push(seed);
          added = true;
        }
      }
      if (added) {
        this.setItem(LISTINGS_KEY, items);
      }
    }

    // Always sanitize image URLs to eliminate broken / obsolete links in cache
    items = items.map(l => ({
      ...l,
      imageUrl: getSafeImageUrl(l.imageUrl, l.category)
    }));

    const { search, category, condition, size, city, status, userId } = params;

    if (userId) {
      let userListings = items.filter(l => l.userId === userId);
      // If user has 0 listings in wardrobe, automatically create starter wardrobe items for them
      if (userListings.length === 0) {
        const foundUser = this.findUserById(userId);
        if (foundUser) {
          const starterItems = createStarterWardrobeForUser(foundUser);
          items = [...starterItems, ...items];
          this.setItem(LISTINGS_KEY, items);
          userListings = starterItems;
        }
      }
      items = userListings;
    }
    if (status) {
      items = items.filter(l => l.status === status);
    }
    if (category && category !== 'All') {
      items = items.filter(l => l.category === category);
    }
    if (condition && condition !== 'All') {
      items = items.filter(l => l.condition === condition);
    }
    if (size && size !== 'All') {
      items = items.filter(l => l.size === size);
    }
    if (city && city !== 'All') {
      items = items.filter(l => l.city.toLowerCase() === city.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase().trim();
      items = items.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.brand.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
      );
    }

    return items;
  }

  getListingById(id: string): ClothingListing | undefined {
    return this.getListings().find(l => l.id === id);
  }

  createListing(listingData: Partial<ClothingListing>): ClothingListing {
    const user = this.getCurrentUser();
    if (!user) throw new Error('You must be signed in to list an item.');

    const newListing: ClothingListing = {
      id: 'lst_' + Math.random().toString(36).substring(2, 9),
      userId: user.id,
      userName: user.name,
      userCity: user.city,
      title: (listingData.title || 'Vintage Clothing Item').trim(),
      description: (listingData.description || 'Pre-loved fashion item in excellent condition.').trim(),
      category: (listingData.category as ClothingCategory) || 'Shirts & Tops',
      brand: (listingData.brand || 'Contemporary').trim(),
      size: (listingData.size as ClothingSize) || 'M',
      condition: (listingData.condition as ClothingCondition) || 'Gently Used',
      city: listingData.city ? listingData.city.trim() : user.city,
      estimatedValue: Number(listingData.estimatedValue) || 1200,
      imageUrl: listingData.imageUrl || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
      status: 'available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDemo: false
    };

    const items = this.getItem<ClothingListing[]>(LISTINGS_KEY, [...SEED_LISTINGS]);
    items.unshift(newListing);
    this.setItem(LISTINGS_KEY, items);
    return newListing;
  }

  updateListing(id: string, updates: Partial<ClothingListing>): ClothingListing {
    const items = this.getItem<ClothingListing[]>(LISTINGS_KEY, [...SEED_LISTINGS]);
    const idx = items.findIndex(l => l.id === id);
    if (idx === -1) throw new Error('Listing not found.');

    const updated = {
      ...items[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    items[idx] = updated;
    this.setItem(LISTINGS_KEY, items);
    return updated;
  }

  deleteListing(id: string): boolean {
    const items = this.getItem<ClothingListing[]>(LISTINGS_KEY, [...SEED_LISTINGS]);
    const filtered = items.filter(l => l.id !== id);
    this.setItem(LISTINGS_KEY, filtered);
    return true;
  }

  // --- Swaps ---
  getSwaps(): SwapRequest[] {
    const swaps = this.getItem<SwapRequest[]>(SWAPS_KEY, []);
    if (!swaps || swaps.length === 0) {
      this.setItem(SWAPS_KEY, INITIAL_SWAPS);
      return INITIAL_SWAPS;
    }
    return swaps;
  }

  getUserSwaps(userId: string): { incoming: SwapRequest[]; outgoing: SwapRequest[] } {
    const swaps = this.getSwaps();
    return {
      incoming: swaps.filter(s => s.ownerId === userId),
      outgoing: swaps.filter(s => s.requesterId === userId)
    };
  }

  getSwapById(id: string): SwapRequest | undefined {
    return this.getSwaps().find(s => s.id === id);
  }

  proposeSwap(payload: {
    requestedItemId: string;
    offeredItemId: string;
    message?: string;
    proposalMessage?: string;
    handoverMethod?: string;
    pickupLocation?: string;
    approxDeliveryDate?: string;
  }): SwapRequest {
    const user = this.getCurrentUser();
    if (!user) throw new Error('You must be signed in to propose a swap.');

    const requestedItem = this.getListingById(payload.requestedItemId);
    if (!requestedItem) throw new Error('The requested item was not found.');

    if (requestedItem.userId === user.id) {
      throw new Error('You cannot propose a swap for your own clothing item.');
    }

    const offeredItem = this.getListingById(payload.offeredItemId);
    if (!offeredItem) throw new Error('The offered item was not found.');

    const swapId = 'swp_' + Math.random().toString(36).substring(2, 9);
    const msg = payload.message || payload.proposalMessage || `Hi! I'd love to swap my ${offeredItem.title} for your ${requestedItem.title}.`;

    const newSwap: SwapRequest = {
      id: swapId,
      requesterId: user.id,
      requesterName: user.name,
      requesterCity: user.city,
      ownerId: requestedItem.userId,
      ownerName: requestedItem.userName,
      ownerCity: requestedItem.userCity,
      requestedItemId: requestedItem.id,
      requestedItemTitle: requestedItem.title,
      requestedItemImage: requestedItem.imageUrl,
      requestedItemValue: requestedItem.estimatedValue,
      offeredItemId: offeredItem.id,
      offeredItemTitle: offeredItem.title,
      offeredItemImage: offeredItem.imageUrl,
      offeredItemValue: offeredItem.estimatedValue,
      status: 'pending',
      message: msg,
      handoverMethod: payload.handoverMethod || 'local_meetup',
      pickupLocation: payload.pickupLocation || `${user.city} Central Landmark or Courier`,
      approxDeliveryDate: payload.approxDeliveryDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      requesterConfirmedCompleted: false,
      ownerConfirmedCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const swaps = this.getSwaps();
    swaps.unshift(newSwap);
    this.setItem(SWAPS_KEY, swaps);

    // Update offered item status to pending
    this.updateListing(offeredItem.id, { status: 'pending' });

    // Send initial chat message
    this.sendMessage(swapId, msg);

    return newSwap;
  }

  performSwapAction(
    swapId: string,
    action: string,
    details?: {
      handoverMethod?: string;
      pickupLocation?: string;
      courierTrackingRef?: string;
      approxDeliveryDate?: string;
    }
  ): SwapRequest {
    const user = this.getCurrentUser();
    const swaps = this.getSwaps();
    const idx = swaps.findIndex(s => s.id === swapId);
    if (idx === -1) throw new Error('Swap request not found.');

    const swap = swaps[idx];
    const isOwner = user ? swap.ownerId === user.id : true;
    const isRequester = user ? swap.requesterId === user.id : false;
    const isAdmin = user ? user.role === 'admin' : false;

    if (action === 'accept') {
      const finalApprox = details?.approxDeliveryDate || swap.approxDeliveryDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
      swap.status = 'accepted';
      swap.approxDeliveryDate = finalApprox;
      if (details?.handoverMethod) swap.handoverMethod = details.handoverMethod;
      this.updateListing(swap.requestedItemId, { status: 'pending' });
      this.updateListing(swap.offeredItemId, { status: 'pending' });
      this.sendMessage(swap.id, `🎉 Swap proposal accepted! Delivery / Handover Date: ${finalApprox}. Let's coordinate details.`);
    } else if (action === 'reject') {
      swap.status = 'rejected';
      this.updateListing(swap.requestedItemId, { status: 'available' });
      this.updateListing(swap.offeredItemId, { status: 'available' });
      this.sendMessage(swap.id, 'Swap request declined. Thank you for your interest!');
    } else if (action === 'cancel') {
      swap.status = 'cancelled';
      this.updateListing(swap.requestedItemId, { status: 'available' });
      this.updateListing(swap.offeredItemId, { status: 'available' });
      this.sendMessage(swap.id, 'Swap was cancelled.');
    } else if (action === 'ready_for_exchange') {
      swap.status = 'ready_for_exchange';
      if (details?.handoverMethod) swap.handoverMethod = details.handoverMethod;
      if (details?.pickupLocation) swap.pickupLocation = details.pickupLocation;
      if (details?.courierTrackingRef) swap.courierTrackingRef = details.courierTrackingRef;
      this.sendMessage(swap.id, `📦 Items ready for exchange! Method: ${swap.handoverMethod}. Location/Ref: ${swap.pickupLocation || swap.courierTrackingRef || 'Standard'}`);
    } else if (action === 'update_delivery') {
      if (details?.handoverMethod) swap.handoverMethod = details.handoverMethod;
      if (details?.pickupLocation) swap.pickupLocation = details.pickupLocation;
      if (details?.courierTrackingRef) swap.courierTrackingRef = details.courierTrackingRef;
      if (details?.approxDeliveryDate) swap.approxDeliveryDate = details.approxDeliveryDate;
    } else if (action === 'confirm_completed') {
      if (isRequester) swap.requesterConfirmedCompleted = true;
      if (isOwner) swap.ownerConfirmedCompleted = true;
      if (isAdmin) {
        swap.requesterConfirmedCompleted = true;
        swap.ownerConfirmedCompleted = true;
      }
      const bothDone = swap.requesterConfirmedCompleted && swap.ownerConfirmedCompleted;
      if (bothDone) {
        swap.status = 'completed';
        this.updateListing(swap.requestedItemId, { status: 'swapped' });
        this.updateListing(swap.offeredItemId, { status: 'swapped' });
        this.sendMessage(swap.id, '🌿 Both members confirmed exchange completion! Clothes swapped sustainably.');
      } else {
        this.sendMessage(swap.id, 'Receipt confirmed by one participant. Awaiting second party confirmation.');
      }
    }

    swap.updatedAt = new Date().toISOString();
    swaps[idx] = swap;
    this.setItem(SWAPS_KEY, swaps);
    return swap;
  }

  // --- Messages ---
  getMessages(swapId: string): ChatMessage[] {
    const all = this.getItem<ChatMessage[]>(MESSAGES_KEY, []);
    if (!all || all.length === 0) {
      this.setItem(MESSAGES_KEY, INITIAL_MESSAGES);
      return INITIAL_MESSAGES.filter(m => m.swapId === swapId);
    }
    return all.filter(m => m.swapId === swapId);
  }

  sendMessage(swapId: string, content: string): ChatMessage {
    const user = this.getCurrentUser();
    const newMsg: ChatMessage = {
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      swapId,
      senderId: user ? user.id : 'usr_system',
      senderName: user ? user.name : 'System Notification',
      content: content.trim(),
      createdAt: new Date().toISOString()
    };

    const all = this.getItem<ChatMessage[]>(MESSAGES_KEY, [...INITIAL_MESSAGES]);
    all.push(newMsg);
    this.setItem(MESSAGES_KEY, all);
    return newMsg;
  }

  // --- Disputes & Admin ---
  getDisputes(): Dispute[] {
    return this.getItem<Dispute[]>(DISPUTES_KEY, []);
  }

  submitDispute(swapId: string, reason: string): Dispute {
    const user = this.getCurrentUser();
    const dispute: Dispute = {
      id: 'dsp_' + Math.random().toString(36).substring(2, 9),
      swapId,
      reportedByUserId: user ? user.id : 'usr_anon',
      reportedByName: user ? user.name : 'Participant',
      reason: reason.trim(),
      status: 'open',
      createdAt: new Date().toISOString()
    };
    const disputes = this.getDisputes();
    disputes.unshift(dispute);
    this.setItem(DISPUTES_KEY, disputes);
    return dispute;
  }

  resolveDispute(id: string, status: string, resolutionNote: string): Dispute {
    const disputes = this.getDisputes();
    const idx = disputes.findIndex(d => d.id === id);
    if (idx === -1) throw new Error('Dispute not found.');
    disputes[idx] = { ...disputes[idx], status, resolutionNote };
    this.setItem(DISPUTES_KEY, disputes);
    return disputes[idx];
  }

  getAdminStats(): AdminStats {
    const users = this.getUsers();
    const listings = this.getListings();
    const swaps = this.getSwaps();
    const disputes = this.getDisputes();

    const completedSwaps = swaps.filter(s => s.status === 'completed').length;
    const activeSwaps = swaps.filter(s => s.status === 'accepted' || s.status === 'ready_for_exchange' || s.status === 'pending').length;

    return {
      totalUsers: users.length,
      totalListings: listings.length,
      activeSwaps,
      completedSwaps,
      openDisputes: disputes.filter(d => d.status === 'open').length,
      co2SavedKg: (completedSwaps * 15) + (listings.length * 2),
      waterSavedLiters: (completedSwaps * 2700) + (listings.length * 300)
    };
  }

  resetDemo() {
    this.setItem(USERS_KEY, SEED_USERS);
    this.setItem(LISTINGS_KEY, SEED_LISTINGS);
    this.setItem(SWAPS_KEY, INITIAL_SWAPS);
    this.setItem(MESSAGES_KEY, INITIAL_MESSAGES);
    this.setItem(DISPUTES_KEY, []);
  }

  estimateSwapValue(payload: { category: string; brandTier?: string; brand?: string; condition: string; originalPrice?: number }): { estimatedValue: number; explanation: string } {
    const categoryBase: Record<string, number> = {
      'Shirts & Tops': 800,
      'Dresses & Jumpsuits': 1400,
      'Jeans & Trousers': 1200,
      'Jackets & Outerwear': 2000,
      'Jackets & Hoodies': 1800,
      'Ethnic & Festive Wear': 2200,
      'Traditional & Ethnic Wear': 2200,
      'Knitwear & Sweaters': 1500
    };

    const brandMultipliers: Record<string, number> = {
      budget: 0.8,
      fast_fashion: 1.0,
      premium: 1.4,
      luxury: 2.2,
      handcrafted: 1.6
    };

    const conditionMultipliers: Record<string, number> = {
      'Brand New with Tags': 1.0,
      'Like New': 0.85,
      'Gently Used': 0.70,
      'Well Loved': 0.50
    };

    const base = categoryBase[payload.category] || 1000;
    const bMult = brandMultipliers[payload.brandTier || 'fast_fashion'] || 1.0;
    const cMult = conditionMultipliers[payload.condition] || 0.75;

    let calculated = Math.round(base * bMult * cMult);
    if (payload.originalPrice && Number(payload.originalPrice) > 0) {
      calculated = Math.round((calculated + (Number(payload.originalPrice) * 0.45 * cMult)) / 2);
    }
    calculated = Math.max(200, Math.round(calculated / 50) * 50);

    return {
      estimatedValue: calculated,
      explanation: 'Estimated fair swap parity value based on garment category, brand tier, and condition.'
    };
  }
}

export const localStore = new LocalStore();
