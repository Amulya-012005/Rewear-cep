export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  city: string;
  state?: string;
  phone?: string;
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
  | 'T-shirts and shirts'
  | 'Kurtas and traditional Indian wear'
  | 'Sarees and ethnic sets'
  | 'Shoes and accessories'
  | string;

export type ClothingCondition =
  | 'Brand New with Tags'
  | 'Like New'
  | 'Gently Used'
  | 'Well Loved'
  | 'New with tags'
  | 'Very Good'
  | 'Good'
  | 'Fair'
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

export type ListingStatus =
  | 'available'
  | 'pending'
  | 'swapped'
  | 'Available'
  | 'Draft'
  | 'Pending Review'
  | 'Reserved'
  | 'Sold'
  | 'Removed'
  | string;

export interface ClothingListing {
  id: string;
  userId: string;
  userName: string;
  userCity: string;
  userState?: string;
  userPhone?: string;
  title: string;
  description: string;
  category: ClothingCategory;
  brand: string;
  size: ClothingSize | string;
  genderFit?: string;
  colour?: string;
  fabric?: string;
  condition: ClothingCondition;
  city: string;
  state?: string;
  estimatedValue: number; // in INR
  sellingPrice?: number;
  allowSwap?: boolean;
  imageUrl: string;
  images?: string[];
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
  | 'Request Sent'
  | 'Negotiation'
  | 'Accepted'
  | 'Exchange Arranged'
  | 'Awaiting Receipt Confirmation'
  | 'Completed'
  | 'Rejected'
  | 'Cancelled'
  | string;

export interface SwapRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterCity: string;
  requesterState?: string;
  ownerId: string;
  ownerName: string;
  ownerCity: string;
  ownerState?: string;
  targetItemId?: string;
  targetItemTitle?: string;
  targetItemImage?: string;
  targetItemValue?: number;
  requestedItemId: string;
  requestedItemTitle: string;
  requestedItemImage: string;
  requestedItemValue: number;
  requestedItemPrice?: number;
  offeredItemId: string;
  offeredItemTitle: string;
  offeredItemImage: string;
  offeredItemValue: number;
  offeredItemPrice?: number;
  status: SwapStatus;
  message?: string;
  proposalMessage?: string;
  handoverMethod?: 'local_meetup' | 'courier' | string;
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
  swapId?: string;
  contextId?: string;
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
  status: 'open' | 'investigating' | 'resolved' | 'dismissed' | string;
  createdAt: string;
  resolutionNote?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalListings?: number;
  totalSellers?: number;
  totalBuyers?: number;
  activeListings?: number;
  activeSwaps?: number;
  pendingSwaps?: number;
  completedSwaps?: number;
  totalDisputes?: number;
  openDisputes?: number;
  resolvedDisputes?: number;
  carbonOffsetKg?: number;
  co2SavedKg?: number;
  waterSavedLiters?: number;
  pendingSellerApprovals?: number;
  confirmedOrders?: number;
  completedSales?: number;
  platformFeesCollected?: number;
  platformFeesPending?: number;
  demoFees?: number;
}
