export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  name: string;
  city: string;
  role: UserRole;
  avatarUrl: string;
  bio?: string;
  createdAt: string;
}

export type ClothingCategory =
  | 'Shirts & Tops'
  | 'Dresses & Tops'
  | 'Jeans & Trousers'
  | 'Jackets & Hoodies'
  | 'Traditional & Ethnic Wear'
  | 'Shoes & Footwear'
  | 'Accessories & Bags'
  | 'Dresses & Jumpsuits'
  | 'Jackets & Outerwear'
  | 'Ethnic & Festive Wear'
  | string;

export type ClothingCondition =
  | 'Brand New with Tags'
  | 'Like New'
  | 'Gently Used'
  | 'Well Loved'
  | string;

export type ClothingSize =
  | 'XS'
  | 'S'
  | 'M'
  | 'L'
  | 'XL'
  | 'XXL'
  | '28'
  | '30'
  | '32'
  | '34'
  | 'Free Size'
  | 'UK 6'
  | 'UK 7'
  | 'UK 8'
  | 'UK 9'
  | 'UK 10'
  | string;

export type ListingStatus = 'available' | 'pending' | 'swapped' | string;

export interface ClothingListing {
  id: string;
  userId: string;
  userName: string;
  userCity: string;
  title: string;
  description: string;
  category: ClothingCategory;
  brand: string;
  size: ClothingSize | string;
  condition: ClothingCondition;
  city: string;
  estimatedValue: number;
  imageUrl: string;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export type SwapStatus =
  | 'pending'
  | 'accepted'
  | 'ready_for_exchange'
  | 'completed'
  | 'rejected'
  | 'cancelled'
  | string;

export interface SwapRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterCity: string;
  ownerId: string;
  ownerName: string;
  ownerCity: string;
  requestedItemId: string;
  requestedItemTitle: string;
  requestedItemImage: string;
  requestedItemValue: number;
  offeredItemId: string;
  offeredItemTitle: string;
  offeredItemImage: string;
  offeredItemValue: number;
  status: SwapStatus;
  message: string;
  handoverMethod?: 'local_meetup' | 'courier';
  pickupLocation?: string;
  approxDeliveryDate?: string;
  courierTrackingRef?: string;
  requesterConfirmedCompleted: boolean;
  ownerConfirmedCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  swapId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface Dispute {
  id: string;
  swapId: string;
  reportedByUserId: string;
  reportedByName: string;
  reason: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
  resolutionNote?: string;
}

export interface Session {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}
