import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  User,
  ClothingListing,
  SwapRequest,
  ChatMessage,
  Dispute,
  Session
} from './types.ts';
import { SEED_LISTINGS } from '../src/data/seedListings.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'rewear_db.json');

export interface DatabaseSchema {
  users: User[];
  listings: ClothingListing[];
  swapRequests: SwapRequest[];
  messages: ChatMessage[];
  disputes: Dispute[];
  sessions: Session[];
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const userSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, userSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: userSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const calculated = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(calculated, 'hex'), Buffer.from(hash, 'hex'));
}

function getInitialSeedData(): DatabaseSchema {
  const now = new Date().toISOString();

  // Seed passwords
  const adminPwd = hashPassword('admin123');
  const userPwd = hashPassword('swap123');

  const users: User[] = [
    {
      id: 'usr_admin',
      email: 'admin@rewear.org',
      passwordHash: adminPwd.hash,
      salt: adminPwd.salt,
      name: 'ReWear Admin',
      city: 'Bengaluru',
      role: 'admin',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Platform moderator ensuring safe, eco-conscious clothing exchanges.',
      createdAt: now,
    },
    {
      id: 'usr_priya',
      email: 'priya@example.com',
      passwordHash: userPwd.hash,
      salt: userPwd.salt,
      name: 'Priya Sharma',
      city: 'Bengaluru',
      role: 'user',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      bio: 'Lover of vintage sarees, oversized jackets, and circular slow fashion.',
      createdAt: now,
    },
    {
      id: 'usr_rahul',
      email: 'rahul@example.com',
      passwordHash: userPwd.hash,
      salt: userPwd.salt,
      name: 'Rahul Patil',
      city: 'Hubballi',
      role: 'user',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Minimalist college student trading jackets, streetwear, and sneakers.',
      createdAt: now,
    },
    {
      id: 'usr_ananya',
      email: 'ananya@example.com',
      passwordHash: userPwd.hash,
      salt: userPwd.salt,
      name: 'Ananya Hegde',
      city: 'Mysuru',
      role: 'user',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      bio: 'Upcycling textile enthusiast. Seeking quality denim and linen shirts.',
      createdAt: now,
    },
    {
      id: 'usr_karan',
      email: 'karan@example.com',
      passwordHash: userPwd.hash,
      salt: userPwd.salt,
      name: 'Karan Joshi',
      city: 'Pune',
      role: 'user',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'Sustainable wardrobe builder. Exchanging formal shirts, kurtas, and jackets.',
      createdAt: now,
    },
  ];

  const listings: ClothingListing[] = [...SEED_LISTINGS];

  // Seed an active swap request between Priya (offering Kurta) and Rahul (owning Denim Jacket)
  const swapRequests: SwapRequest[] = [
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

  const messages: ChatMessage[] = [
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

  const disputes: Dispute[] = [];
  const sessions: Session[] = [];

  return { users, listings, swapRequests, messages, disputes, sessions };
}

class Database {
  private data: DatabaseSchema;
  private isLoaded = false;

  constructor() {
    this.data = getInitialSeedData();
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.users && parsed.listings) {
          this.data = parsed;

          // Merge any missing seed listings to guarantee at least 28 items
          const existingIds = new Set(this.data.listings.map((l: ClothingListing) => l.id));
          let added = false;
          for (const seed of SEED_LISTINGS) {
            if (!existingIds.has(seed.id)) {
              this.data.listings.push(seed);
              added = true;
            }
          }
          if (added) {
            this.save();
          }

          this.isLoaded = true;
          return;
        }
      }

      // If no file exists or invalid, write initial seed data
      this.save();
      this.isLoaded = true;
    } catch (e) {
      console.error('Failed to load DB file, using seed data in memory:', e);
      this.data = getInitialSeedData();
      this.isLoaded = true;
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist database to disk:', e);
    }
  }

  // --- Users ---
  findUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getAllUsers(): Omit<User, 'passwordHash' | 'salt'>[] {
    return this.data.users.map(({ passwordHash, salt, ...safeUser }) => safeUser);
  }

  createUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.save();
    return this.data.users[idx];
  }

  // --- Sessions ---
  createSession(userId: string): Session {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 days
    const session: Session = {
      token,
      userId,
      createdAt: new Date().toISOString(),
      expiresAt
    };
    this.data.sessions.push(session);
    this.save();
    return session;
  }

  getSession(token: string): Session | undefined {
    const session = this.data.sessions.find(s => s.token === token);
    if (!session) return undefined;
    if (new Date(session.expiresAt) < new Date()) {
      this.deleteSession(token);
      return undefined;
    }
    return session;
  }

  deleteSession(token: string) {
    this.data.sessions = this.data.sessions.filter(s => s.token !== token);
    this.save();
  }

  // --- Listings ---
  getListings(): ClothingListing[] {
    return this.data.listings;
  }

  getListingById(id: string): ClothingListing | undefined {
    return this.data.listings.find(l => l.id === id);
  }

  createListing(listing: ClothingListing): ClothingListing {
    this.data.listings.unshift(listing);
    this.save();
    return listing;
  }

  updateListing(id: string, updates: Partial<ClothingListing>): ClothingListing | undefined {
    const idx = this.data.listings.findIndex(l => l.id === id);
    if (idx === -1) return undefined;
    this.data.listings[idx] = {
      ...this.data.listings[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.listings[idx];
  }

  deleteListing(id: string): boolean {
    const initialLen = this.data.listings.length;
    this.data.listings = this.data.listings.filter(l => l.id !== id);
    if (this.data.listings.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Swap Requests ---
  getSwapRequests(): SwapRequest[] {
    return this.data.swapRequests;
  }

  getSwapRequestById(id: string): SwapRequest | undefined {
    return this.data.swapRequests.find(r => r.id === id);
  }

  getUserSwapRequests(userId: string): { incoming: SwapRequest[]; outgoing: SwapRequest[] } {
    const incoming = this.data.swapRequests.filter(r => r.ownerId === userId);
    const outgoing = this.data.swapRequests.filter(r => r.requesterId === userId);
    return { incoming, outgoing };
  }

  createSwapRequest(req: SwapRequest): SwapRequest {
    this.data.swapRequests.unshift(req);
    this.save();
    return req;
  }

  updateSwapRequest(id: string, updates: Partial<SwapRequest>): SwapRequest | undefined {
    const idx = this.data.swapRequests.findIndex(r => r.id === id);
    if (idx === -1) return undefined;
    this.data.swapRequests[idx] = {
      ...this.data.swapRequests[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.swapRequests[idx];
  }

  // --- Messages ---
  getMessagesForSwap(swapId: string): ChatMessage[] {
    return this.data.messages
      .filter(m => m.swapId === swapId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  createMessage(msg: ChatMessage): ChatMessage {
    this.data.messages.push(msg);
    this.save();
    return msg;
  }

  // --- Disputes ---
  getDisputes(): Dispute[] {
    return this.data.disputes;
  }

  createDispute(dispute: Dispute): Dispute {
    this.data.disputes.unshift(dispute);
    this.save();
    return dispute;
  }

  updateDispute(id: string, updates: Partial<Dispute>): Dispute | undefined {
    const idx = this.data.disputes.findIndex(d => d.id === id);
    if (idx === -1) return undefined;
    this.data.disputes[idx] = { ...this.data.disputes[idx], ...updates };
    this.save();
    return this.data.disputes[idx];
  }

  // Reset to seed data
  resetDatabase() {
    this.data = getInitialSeedData();
    this.save();
    return this.data;
  }
}

export const db = new Database();
