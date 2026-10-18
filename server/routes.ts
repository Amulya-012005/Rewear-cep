import { Router, Request, Response, NextFunction } from 'express';
import { db, hashPassword, verifyPassword } from './db.ts';
import {
  User,
  ClothingListing,
  SwapRequest,
  ChatMessage,
  Dispute,
  ClothingCategory,
  ClothingCondition,
  ClothingSize
} from './types.ts';

export const apiRouter = Router();

// Extend Express Request to hold authenticated user
export interface AuthenticatedRequest extends Request {
  user?: User;
  sessionToken?: string;
}

// Authentication Middleware
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const session = db.getSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }

  const user = db.findUserById(session.userId);
  if (!user) {
    return res.status(401).json({ error: 'User account not found.' });
  }

  req.user = user;
  req.sessionToken = token;
  next();
}

// Optional Auth Middleware (attaches user if present, but doesn't block)
export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

  if (token) {
    const session = db.getSession(token);
    if (session) {
      const user = db.findUserById(session.userId);
      if (user) {
        req.user = user;
        req.sessionToken = token;
      }
    }
  }
  next();
}

// Admin only guard middleware
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }
  next();
}

// Helper to sanitize user object
function sanitizeUser(user: User) {
  const { passwordHash, salt, ...safeUser } = user;
  return safeUser;
}

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

// Register
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { email, password, name, city, bio, avatarUrl } = req.body;

  if (!email || !password || !name || !city) {
    return res.status(400).json({ error: 'Name, email, password, and city are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  // Security: users cannot register as admin
  const { hash, salt } = hashPassword(password);
  const newUser: User = {
    id: 'usr_' + Math.random().toString(36).substring(2, 9),
    email: email.trim().toLowerCase(),
    passwordHash: hash,
    salt,
    name: name.trim(),
    city: city.trim(),
    role: 'user', // NEVER allow self-assigning admin
    avatarUrl: avatarUrl || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 50)}?auto=format&fit=crop&w=300&q=80`,
    bio: bio || 'Sustainable fashion lover eager to exchange clothes and reduce textile waste.',
    createdAt: new Date().toISOString()
  };

  db.createUser(newUser);
  const session = db.createSession(newUser.id);

  res.status(201).json({
    user: sanitizeUser(newUser),
    token: session.token
  });
});

// Login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isValid = verifyPassword(password, user.passwordHash, user.salt);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const session = db.createSession(user.id);
  res.json({
    user: sanitizeUser(user),
    token: session.token
  });
});

// Switch Demo User (For testing the multi-account journeys easily!)
apiRouter.post('/auth/switch-demo', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Demo user email is required.' });
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'Demo user not found.' });
  }

  const session = db.createSession(user.id);
  res.json({
    user: sanitizeUser(user),
    token: session.token
  });
});

// Get current authenticated user
apiRouter.get('/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: sanitizeUser(req.user!) });
});

// Logout
apiRouter.post('/auth/logout', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (req.sessionToken) {
    db.deleteSession(req.sessionToken);
  }
  res.json({ message: 'Successfully logged out.' });
});

// Update Profile
apiRouter.put('/auth/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { name, city, bio, avatarUrl } = req.body;
  const updates: Partial<User> = {};

  if (name) updates.name = name.trim();
  if (city) updates.city = city.trim();
  if (bio !== undefined) updates.bio = bio.trim();
  if (avatarUrl) updates.avatarUrl = avatarUrl;

  const updatedUser = db.updateUser(req.user!.id, updates);
  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found.' });
  }

  res.json({ user: sanitizeUser(updatedUser) });
});

// List demo users for quick testing
apiRouter.get('/auth/demo-users', (_req: Request, res: Response) => {
  const users = db.getAllUsers();
  res.json({ users });
});

// ==========================================
// 2. CLOTHING LISTINGS ROUTES
// ==========================================

// Get listings with search and filters
apiRouter.get('/listings', (req: Request, res: Response) => {
  const { search, category, condition, size, city, status, userId } = req.query;
  let listings = db.getListings();

  if (userId) {
    listings = listings.filter(l => l.userId === userId);
  }

  if (status) {
    listings = listings.filter(l => l.status === status);
  }

  if (category && category !== 'All') {
    listings = listings.filter(l => l.category === category);
  }

  if (condition && condition !== 'All') {
    listings = listings.filter(l => l.condition === condition);
  }

  if (size && size !== 'All') {
    listings = listings.filter(l => l.size === size);
  }

  if (city && city !== 'All') {
    listings = listings.filter(l => l.city.toLowerCase() === (city as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase().trim();
    listings = listings.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.brand.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q)
    );
  }

  res.json({ listings });
});

// Get single listing details
apiRouter.get('/listings/:id', (req: Request, res: Response) => {
  const listing = db.getListingById(req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found.' });
  }
  res.json({ listing });
});

// Create listing
apiRouter.post('/listings', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const {
    title,
    description,
    category,
    brand,
    size,
    condition,
    city,
    estimatedValue,
    imageUrl
  } = req.body;

  if (!title || !description || !category || !brand || !size || !condition || !imageUrl) {
    return res.status(400).json({ error: 'Please provide all required fields including an image.' });
  }

  const user = req.user!;
  const newListing: ClothingListing = {
    id: 'lst_' + Math.random().toString(36).substring(2, 9),
    userId: user.id,
    userName: user.name,
    userCity: user.city,
    title: title.trim(),
    description: description.trim(),
    category: category as ClothingCategory,
    brand: brand.trim(),
    size: size as ClothingSize,
    condition: condition as ClothingCondition,
    city: city ? city.trim() : user.city,
    estimatedValue: Number(estimatedValue) || 1500,
    imageUrl: imageUrl.trim(),
    status: 'available',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isDemo: false
  };

  db.createListing(newListing);
  res.status(201).json({ listing: newListing });
});

// Update listing (only owner or admin)
apiRouter.put('/listings/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const listing = db.getListingById(req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found.' });
  }

  if (listing.userId !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'You do not have permission to edit this listing.' });
  }

  const {
    title,
    description,
    category,
    brand,
    size,
    condition,
    city,
    estimatedValue,
    imageUrl,
    status
  } = req.body;

  const updates: Partial<ClothingListing> = {};
  if (title) updates.title = title.trim();
  if (description) updates.description = description.trim();
  if (category) updates.category = category;
  if (brand) updates.brand = brand.trim();
  if (size) updates.size = size;
  if (condition) updates.condition = condition;
  if (city) updates.city = city.trim();
  if (estimatedValue !== undefined) updates.estimatedValue = Number(estimatedValue);
  if (imageUrl) updates.imageUrl = imageUrl.trim();
  if (status) updates.status = status;

  const updated = db.updateListing(listing.id, updates);
  res.json({ listing: updated });
});

// Delete listing (only owner or admin)
apiRouter.delete('/listings/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const listing = db.getListingById(req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found.' });
  }

  if (listing.userId !== req.user!.id && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'You do not have permission to delete this listing.' });
  }

  db.deleteListing(listing.id);
  res.json({ message: 'Listing successfully deleted.' });
});

// ==========================================
// 3. SWAP REQUESTS ROUTES
// ==========================================

// Get user swap requests
apiRouter.get('/swaps', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (req.user!.role === 'admin') {
    // Admin can see all swaps
    return res.json({ swaps: db.getSwapRequests() });
  }

  const { incoming, outgoing } = db.getUserSwapRequests(req.user!.id);
  res.json({ incoming, outgoing });
});

// Get single swap request
apiRouter.get('/swaps/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const swap = db.getSwapRequestById(req.params.id);
  if (!swap) {
    return res.status(404).json({ error: 'Swap request not found.' });
  }

  const isParticipant = swap.requesterId === req.user!.id || swap.ownerId === req.user!.id;
  const isAdmin = req.user!.role === 'admin';

  if (!isParticipant && !isAdmin) {
    return res.status(403).json({ error: 'You do not have access to this swap request.' });
  }

  res.json({ swap });
});

// Propose a swap
apiRouter.post('/swaps', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { requestedItemId, offeredItemId, message, handoverMethod, pickupLocation, approxDeliveryDate } = req.body;

  if (!requestedItemId || !offeredItemId) {
    return res.status(400).json({ error: 'Both a requested item and an offered item are required.' });
  }

  const requestedItem = db.getListingById(requestedItemId);
  if (!requestedItem) {
    return res.status(404).json({ error: 'The item you wish to swap for was not found.' });
  }

  if (requestedItem.userId === req.user!.id) {
    return res.status(400).json({ error: 'You cannot propose a swap for your own clothing item.' });
  }

  if (requestedItem.status !== 'available') {
    return res.status(400).json({ error: 'The requested item is currently unavailable or in another swap.' });
  }

  const offeredItem = db.getListingById(offeredItemId);
  if (!offeredItem) {
    return res.status(404).json({ error: 'The item you offered was not found.' });
  }

  if (offeredItem.userId !== req.user!.id) {
    return res.status(403).json({ error: 'You can only offer items from your own closet.' });
  }

  if (offeredItem.status !== 'available') {
    return res.status(400).json({ error: 'Your offered item is already engaged in another swap or pending.' });
  }

  // Check for duplicate pending request
  const existingSwaps = db.getSwapRequests();
  const duplicate = existingSwaps.find(
    s =>
      s.requesterId === req.user!.id &&
      s.requestedItemId === requestedItemId &&
      s.status === 'pending'
  );

  if (duplicate) {
    return res.status(400).json({ error: 'You already have an active pending swap request for this item.' });
  }

  const owner = db.findUserById(requestedItem.userId);

  const swapRequest: SwapRequest = {
    id: 'swp_' + Math.random().toString(36).substring(2, 9),
    requesterId: req.user!.id,
    requesterName: req.user!.name,
    requesterCity: req.user!.city,
    ownerId: requestedItem.userId,
    ownerName: owner ? owner.name : requestedItem.userName,
    ownerCity: owner ? owner.city : requestedItem.userCity,
    requestedItemId: requestedItem.id,
    requestedItemTitle: requestedItem.title,
    requestedItemImage: requestedItem.imageUrl,
    requestedItemValue: requestedItem.estimatedValue,
    offeredItemId: offeredItem.id,
    offeredItemTitle: offeredItem.title,
    offeredItemImage: offeredItem.imageUrl,
    offeredItemValue: offeredItem.estimatedValue,
    status: 'pending',
    message: message?.trim() || `Hi! I would love to swap my ${offeredItem.title} for your ${requestedItem.title}.`,
    handoverMethod: handoverMethod || 'local_meetup',
    pickupLocation: pickupLocation || `${req.user!.city} Central Landmark or Courier Delivery`,
    approxDeliveryDate: approxDeliveryDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    requesterConfirmedCompleted: false,
    ownerConfirmedCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Temporarily update offered item to pending so user doesn't offer it twice simultaneously
  db.updateListing(offeredItem.id, { status: 'pending' });

  db.createSwapRequest(swapRequest);

  // Auto-post opening note to chat
  db.createMessage({
    id: 'msg_' + Math.random().toString(36).substring(2, 9),
    swapId: swapRequest.id,
    senderId: req.user!.id,
    senderName: req.user!.name,
    content: swapRequest.message,
    createdAt: new Date().toISOString()
  });

  res.status(201).json({ swap: swapRequest });
});

// Update Swap Status (accept, reject, cancel, confirm_completed)
apiRouter.post('/swaps/:id/action', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { action } = req.body;
  const swap = db.getSwapRequestById(req.params.id);

  if (!swap) {
    return res.status(404).json({ error: 'Swap request not found.' });
  }

  const userId = req.user!.id;
  const isOwner = swap.ownerId === userId;
  const isRequester = swap.requesterId === userId;
  const isAdmin = req.user!.role === 'admin';

  if (!isOwner && !isRequester && !isAdmin) {
    return res.status(403).json({ error: 'You are not authorized to update this swap.' });
  }

  // Handle Action
  if (action === 'accept') {
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Only the item owner can accept this swap request.' });
    }
    if (swap.status !== 'pending') {
      return res.status(400).json({ error: `Cannot accept a swap that is in '${swap.status}' status.` });
    }

    // Concurrency check: Ensure neither item is already swapped or in another active swap
    const requestedItem = db.getListingById(swap.requestedItemId);
    const offeredItem = db.getListingById(swap.offeredItemId);
    if (!requestedItem || requestedItem.status === 'swapped') {
      return res.status(400).json({ error: 'The requested garment has already been swapped.' });
    }
    if (!offeredItem || offeredItem.status === 'swapped') {
      return res.status(400).json({ error: 'The offered garment has already been swapped.' });
    }

    const allSwaps = db.getSwapRequests();
    const conflict = allSwaps.find(s =>
      s.id !== swap.id &&
      (s.status === 'accepted' || s.status === 'ready_for_exchange') &&
      (s.requestedItemId === swap.requestedItemId || s.offeredItemId === swap.requestedItemId ||
       s.requestedItemId === swap.offeredItemId || s.offeredItemId === swap.offeredItemId)
    );
    if (conflict) {
      return res.status(400).json({ error: 'One of these clothing items is already committed to an ongoing active exchange.' });
    }

    const finalApproxDate = req.body.approxDeliveryDate || swap.approxDeliveryDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0];
    db.updateSwapRequest(swap.id, {
      status: 'accepted',
      approxDeliveryDate: finalApproxDate,
      handoverMethod: req.body.handoverMethod || swap.handoverMethod
    });
    db.updateListing(swap.requestedItemId, { status: 'pending' });
    db.updateListing(swap.offeredItemId, { status: 'pending' });

    db.createMessage({
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      swapId: swap.id,
      senderId: userId,
      senderName: req.user!.name,
      content: `🎉 Swap proposal accepted! Approximate Delivery / Exchange Date: ${finalApproxDate}. Let's coordinate handoff details here.`,
      createdAt: new Date().toISOString()
    });

    return res.json({ swap: db.getSwapRequestById(swap.id) });
  }

  if (action === 'reject') {
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: 'Only the item owner can reject this swap request.' });
    }
    if (swap.status !== 'pending') {
      return res.status(400).json({ error: `Cannot reject a swap that is '${swap.status}'.` });
    }

    db.updateSwapRequest(swap.id, { status: 'rejected' });
    // Free up items
    db.updateListing(swap.offeredItemId, { status: 'available' });
    db.updateListing(swap.requestedItemId, { status: 'available' });

    db.createMessage({
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      swapId: swap.id,
      senderId: userId,
      senderName: req.user!.name,
      content: `Swap request declined. Thank you for your interest!`,
      createdAt: new Date().toISOString()
    });

    return res.json({ swap: db.getSwapRequestById(swap.id) });
  }

  if (action === 'cancel') {
    if (swap.status === 'completed') {
      return res.status(400).json({ error: 'Completed swaps cannot be cancelled.' });
    }

    db.updateSwapRequest(swap.id, { status: 'cancelled' });
    // Free up items
    db.updateListing(swap.offeredItemId, { status: 'available' });
    db.updateListing(swap.requestedItemId, { status: 'available' });

    db.createMessage({
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      swapId: swap.id,
      senderId: userId,
      senderName: req.user!.name,
      content: `Swap was cancelled.`,
      createdAt: new Date().toISOString()
    });

    return res.json({ swap: db.getSwapRequestById(swap.id) });
  }

  if (action === 'ready_for_exchange') {
    const { handoverMethod, pickupLocation, courierTrackingRef } = req.body;
    db.updateSwapRequest(swap.id, {
      status: 'ready_for_exchange',
      handoverMethod: handoverMethod || swap.handoverMethod || 'local_meetup',
      pickupLocation: pickupLocation !== undefined ? pickupLocation : swap.pickupLocation,
      courierTrackingRef: courierTrackingRef !== undefined ? courierTrackingRef : swap.courierTrackingRef
    });

    db.createMessage({
      id: 'msg_' + Math.random().toString(36).substring(2, 9),
      swapId: swap.id,
      senderId: userId,
      senderName: req.user!.name,
      content: `📦 Items marked ready for exchange! Method: ${handoverMethod || swap.handoverMethod || 'Local meetup'}${pickupLocation ? ` at ${pickupLocation}` : ''}${courierTrackingRef ? ` (Tracking Ref: ${courierTrackingRef})` : ''}`,
      createdAt: new Date().toISOString()
    });

    return res.json({ swap: db.getSwapRequestById(swap.id) });
  }

  if (action === 'update_delivery') {
    const { handoverMethod, pickupLocation, courierTrackingRef } = req.body;
    const updates: Partial<SwapRequest> = {};
    if (handoverMethod) updates.handoverMethod = handoverMethod;
    if (pickupLocation !== undefined) updates.pickupLocation = pickupLocation;
    if (courierTrackingRef !== undefined) updates.courierTrackingRef = courierTrackingRef;

    db.updateSwapRequest(swap.id, updates);
    return res.json({ swap: db.getSwapRequestById(swap.id) });
  }

  if (action === 'confirm_completed') {
    if (swap.status !== 'accepted' && swap.status !== 'ready_for_exchange') {
      return res.status(400).json({ error: 'Swap must be accepted or ready for exchange before confirming completion.' });
    }

    let reqConfirmed = swap.requesterConfirmedCompleted;
    let ownConfirmed = swap.ownerConfirmedCompleted;

    if (isRequester) reqConfirmed = true;
    if (isOwner) ownConfirmed = true;
    if (isAdmin) {
      reqConfirmed = true;
      ownConfirmed = true;
    }

    const isBothConfirmed = reqConfirmed && ownConfirmed;
    const newStatus = isBothConfirmed ? 'completed' : (swap.status === 'ready_for_exchange' ? 'ready_for_exchange' : 'accepted');

    db.updateSwapRequest(swap.id, {
      requesterConfirmedCompleted: reqConfirmed,
      ownerConfirmedCompleted: ownConfirmed,
      status: newStatus
    });

    if (isBothConfirmed) {
      // Mark items as swapped
      db.updateListing(swap.offeredItemId, { status: 'swapped' });
      db.updateListing(swap.requestedItemId, { status: 'swapped' });

      db.createMessage({
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
        swapId: swap.id,
        senderId: 'system',
        senderName: 'ReWear System',
        content: `🌿 Swap successfully completed by both participants! Garments exchanged, waste reduced, closets refreshed.`,
        createdAt: new Date().toISOString()
      });
    } else {
      db.createMessage({
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
        swapId: swap.id,
        senderId: userId,
        senderName: req.user!.name,
        content: `I have confirmed receipt of the item. Waiting for other party confirmation.`,
        createdAt: new Date().toISOString()
      });
    }

    return res.json({ swap: db.getSwapRequestById(swap.id) });
  }

  return res.status(400).json({ error: 'Invalid swap action.' });
});

// ==========================================
// 4. PRIVATE NEGOTIATION CHAT
// ==========================================

// Get chat messages for a swap
apiRouter.get('/swaps/:id/messages', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const swap = db.getSwapRequestById(req.params.id);
  if (!swap) {
    return res.status(404).json({ error: 'Swap request not found.' });
  }

  const isParticipant = swap.requesterId === req.user!.id || swap.ownerId === req.user!.id;
  const isAdmin = req.user!.role === 'admin';

  if (!isParticipant && !isAdmin) {
    return res.status(403).json({ error: 'You are not a participant in this conversation.' });
  }

  const messages = db.getMessagesForSwap(swap.id);
  res.json({ messages });
});

// Post a chat message
apiRouter.post('/swaps/:id/messages', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const swap = db.getSwapRequestById(req.params.id);
  if (!swap) {
    return res.status(404).json({ error: 'Swap request not found.' });
  }

  const isParticipant = swap.requesterId === req.user!.id || swap.ownerId === req.user!.id;
  const isAdmin = req.user!.role === 'admin';

  if (!isParticipant && !isAdmin) {
    return res.status(403).json({ error: 'You are not a participant in this conversation.' });
  }

  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Message content cannot be empty.' });
  }

  const newMessage: ChatMessage = {
    id: 'msg_' + Math.random().toString(36).substring(2, 9),
    swapId: swap.id,
    senderId: req.user!.id,
    senderName: req.user!.name,
    content: content.trim(),
    createdAt: new Date().toISOString()
  };

  db.createMessage(newMessage);
  res.status(201).json({ message: newMessage });
});

// ==========================================
// 5. DISPUTES & ADMIN MODERATION
// ==========================================

// Submit dispute
apiRouter.post('/disputes', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { swapId, reason } = req.body;
  if (!swapId || !reason) {
    return res.status(400).json({ error: 'Swap ID and dispute reason are required.' });
  }

  const swap = db.getSwapRequestById(swapId);
  if (!swap) {
    return res.status(404).json({ error: 'Associated swap not found.' });
  }

  const dispute: Dispute = {
    id: 'dsp_' + Math.random().toString(36).substring(2, 9),
    swapId,
    reportedByUserId: req.user!.id,
    reportedByName: req.user!.name,
    reason: reason.trim(),
    status: 'open',
    createdAt: new Date().toISOString()
  };

  db.createDispute(dispute);
  res.status(201).json({ dispute });
});

// Admin stats
apiRouter.get('/admin/stats', authenticateToken, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const users = db.getAllUsers();
  const listings = db.getListings();
  const swaps = db.getSwapRequests();
  const disputes = db.getDisputes();

  const activeSwaps = swaps.filter(s => s.status === 'accepted' || s.status === 'pending').length;
  const completedSwaps = swaps.filter(s => s.status === 'completed').length;

  // Sustainable metrics calculation
  // Each completed swap avoids approx 15kg CO2 and 2,500 liters of water vs buying new clothes
  const co2SavedKg = (completedSwaps * 15) + (listings.length * 2);
  const waterSavedLiters = (completedSwaps * 2700) + (listings.length * 300);

  res.json({
    totalUsers: users.length,
    totalListings: listings.length,
    activeSwaps,
    completedSwaps,
    openDisputes: disputes.filter(d => d.status === 'open').length,
    co2SavedKg,
    waterSavedLiters
  });
});

// Admin list disputes
apiRouter.get('/admin/disputes', authenticateToken, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  res.json({ disputes: db.getDisputes() });
});

// Admin list all swap requests with full party details
apiRouter.get('/admin/swaps', authenticateToken, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const swaps = db.getSwapRequests();
  res.json({ swaps });
});

// Admin resolve dispute
apiRouter.put('/admin/disputes/:id', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { status, resolutionNote } = req.body;
  const updated = db.updateDispute(req.params.id, {
    status,
    resolutionNote
  });

  if (!updated) {
    return res.status(404).json({ error: 'Dispute not found.' });
  }

  res.json({ dispute: updated });
});

// Admin remove listing
apiRouter.delete('/admin/listings/:id', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const deleted = db.deleteListing(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Listing not found.' });
  }
  res.json({ message: 'Listing permanently removed by administrator.' });
});

// Reset demo data
apiRouter.post('/admin/reset-demo', authenticateToken, requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  db.resetDatabase();
  res.json({ message: 'Database reset to initial sample state.' });
});

// ==========================================
// 6. SWAP VALUE CALCULATOR
// ==========================================
apiRouter.post('/calculator/estimate', (req: Request, res: Response) => {
  const { category, brandTier, condition, originalPrice } = req.body;

  // Base values for categories (exclusively clothes)
  const categoryBase: Record<string, number> = {
    'Shirts & Tops': 800,
    'Dresses & Jumpsuits': 1400,
    'Jeans & Trousers': 1200,
    'Jackets & Outerwear': 2000,
    'Ethnic & Festive Wear': 2200,
    'Traditional & Ethnic Wear': 2200,
    'Jackets & Hoodies': 1800,
    'Knitwear & Sweaters': 1500
  };

  // Brand tier multipliers
  const brandMultipliers: Record<string, number> = {
    'budget': 0.8, // Local / basic
    'fast_fashion': 1.0, // H&M, Zara, Forever21
    'premium': 1.4, // Levi's, FabIndia, Mango, Marks & Spencer
    'luxury': 2.2, // Designer, Ralph Lauren, Tommy
    'handcrafted': 1.6 // Authentic handloom, artisanal
  };

  // Condition multipliers
  const conditionMultipliers: Record<string, number> = {
    'Brand New with Tags': 1.0,
    'Like New': 0.85,
    'Gently Used': 0.70,
    'Well Loved': 0.50
  };

  const base = categoryBase[category] || 1000;
  const brandMult = brandMultipliers[brandTier] || 1.0;
  const condMult = conditionMultipliers[condition] || 0.75;

  let calculated = Math.round(base * brandMult * condMult);

  if (originalPrice && Number(originalPrice) > 0) {
    // If original price provided, blend it
    calculated = Math.round((calculated + (Number(originalPrice) * 0.45 * condMult)) / 2);
  }

  // Round to nearest 50
  calculated = Math.max(200, Math.round(calculated / 50) * 50);

  res.json({
    estimatedValue: calculated,
    explanation: 'Estimated swap parity reference based on fabric category standard, brand tier, and garment condition. This serves as a fair trade reference point without financial exchange.'
  });
});
