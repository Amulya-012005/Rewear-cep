/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ClothingListing, SwapRequest } from './types.ts';
import { SEED_LISTINGS } from './data/seedListings.ts';
import { api } from './services/api.ts';
import { Navbar, ActiveModule } from './components/Navbar.tsx';
import { AnimatedBackground } from './components/AnimatedBackground.tsx';
import { Footer } from './components/Footer.tsx';
import { MarketplaceView } from './components/MarketplaceView.tsx';
import { ItemDetailsModal } from './components/ItemDetailsModal.tsx';
import { CreateEditListingModal } from './components/CreateEditListingModal.tsx';
import { SwapProposalModal } from './components/SwapProposalModal.tsx';
import { SwapRequestsView } from './components/SwapRequestsView.tsx';
import { ChatModal } from './components/ChatModal.tsx';
import { NearbySwapsView } from './components/NearbySwapsView.tsx';
import { ValueCalculatorModal } from './components/ValueCalculatorModal.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { AdminView } from './components/AdminView.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { HowItWorksView } from './components/HowItWorksView.tsx';
import { ExchangeInstructionsView } from './components/ExchangeInstructionsView.tsx';
import { HomeView } from './components/HomeView.tsx';
import { SellClothesView } from './components/SellClothesView.tsx';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

function ReWearApp() {
  const { user } = useAuth();

  // Navigation: Defaults to Common Home Dashboard
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeModule, setActiveModule] = useState<ActiveModule>('buyer');
  const [sellerSubTab, setSellerSubTab] = useState<'inventory' | 'requests'>('inventory');
  const [adminSubTab, setAdminSubTab] = useState<
    'listed-items' | 'who-sent-to-whom' | 'accepted-swaps' | 'successful-swaps'
  >('listed-items');

  // Listings State initialized with the 28+ seed items so it is NEVER empty
  const [listings, setListings] = useState<ClothingListing[]>(SEED_LISTINGS);
  const [isLoadingListings, setIsLoadingListings] = useState(false);

  // Swaps State
  const [swaps, setSwaps] = useState<{ incoming: SwapRequest[]; outgoing: SwapRequest[] }>({
    incoming: [],
    outgoing: []
  });

  // Modals & Drawers
  const [selectedItem, setSelectedItem] = useState<ClothingListing | null>(null);
  const [targetSwapItem, setTargetSwapItem] = useState<ClothingListing | null>(null);
  const [itemToEdit, setItemToEdit] = useState<ClothingListing | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeChatSwap, setActiveChatSwap] = useState<SwapRequest | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingModule, setPendingModule] = useState<'sell' | 'buyer' | 'admin' | null>(null);

  // City Filter sync between Nearby and Marketplace
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('All');

  // Toast / notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Fetch Listings with safe error handling
  const loadListings = useCallback(async () => {
    try {
      const res = await api.getListings();
      if (res && res.listings && res.listings.length > 0) {
        setListings(res.listings);
      }
    } catch (err: any) {
      console.warn('Backend API notice, retaining local seed items:', err);
    } finally {
      setIsLoadingListings(false);
    }
  }, []);

  // Fetch Swaps
  const loadSwaps = useCallback(async () => {
    if (!user) {
      setSwaps({ incoming: [], outgoing: [] });
      return;
    }
    try {
      const res = await api.getSwaps();
      if (res.swaps) {
        // Admin view returns all swaps
        setSwaps({
          incoming: res.swaps.filter(s => s.ownerId === user.id),
          outgoing: res.swaps.filter(s => s.requesterId === user.id)
        });
      } else {
        setSwaps({
          incoming: res.incoming || [],
          outgoing: res.outgoing || []
        });
      }
    } catch (err) {
      console.error('Failed to load swap requests:', err);
    }
  }, [user]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  useEffect(() => {
    loadSwaps();
  }, [loadSwaps]);

  // Handle Proposing Swap
  const handleInitiateSwap = (item: ClothingListing) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (user.id === item.userId) {
      showToast('You cannot propose a swap for your own clothing item.', 'error');
      return;
    }
    setSelectedItem(null);
    setTargetSwapItem(item);
  };

  // Handle Listing Deletion
  const handleDeleteListing = async (itemId: string) => {
    try {
      await api.deleteListing(itemId);
      showToast('Garment listing successfully deleted.');
      loadListings();
      setSelectedItem(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete listing.', 'error');
    }
  };

  // Handle Reporting a Dispute
  const handleReportDispute = async (swapOrItemId: string, title: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const reason = window.prompt(
      `Please state the reason for filing a dispute / report for "${title}":\n(e.g. Inaccurate fabric condition, unresponsive meetup)`
    );
    if (!reason || !reason.trim()) return;

    try {
      await api.submitDispute({
        swapId: swapOrItemId,
        reason: reason.trim()
      });
      showToast('Dispute report submitted for administrator review.');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit report.', 'error');
    }
  };

  // My listings
  const myListings = listings.filter(l => l.userId === user?.id);

  // Incoming pending count for navbar alert
  const incomingPendingCount = swaps.incoming.filter(s => s.status === 'pending').length;

  // Navigation handlers enforcing COMPULSORY AUTHENTICATION upon selecting specific modules
  const handleNavigateModule = (module: 'sell' | 'buyer' | 'admin', cityPrefill?: string) => {
    if (cityPrefill) {
      setSelectedCityFilter(cityPrefill);
    }

    if (module === 'admin') {
      if (!user || user.role !== 'admin') {
        setPendingModule('admin');
        setShowAuthModal(true);
        return;
      }
      setActiveModule('admin');
      setCurrentTab('admin');
      return;
    }

    // Sell or Buyer module: COMPULSORY AUTHENTICATION
    if (!user) {
      setPendingModule(module);
      setShowAuthModal(true);
      return;
    }

    if (module === 'sell') {
      setActiveModule('seller');
      setCurrentTab('sell');
    } else if (module === 'buyer') {
      setActiveModule('buyer');
      setCurrentTab('marketplace');
    }
  };

  const handleAuthSuccess = (targetMod?: 'sell' | 'buyer' | 'admin') => {
    const mod = targetMod || pendingModule;
    setPendingModule(null);
    setShowAuthModal(false);
    if (mod === 'sell') {
      setActiveModule('seller');
      setCurrentTab('sell');
      showToast('Signed in successfully! Welcome to Sell Clothes Module.', 'success');
    } else if (mod === 'buyer') {
      setActiveModule('buyer');
      setCurrentTab('marketplace');
      showToast('Signed in successfully! Welcome to Buy Clothes Module.', 'success');
    } else if (mod === 'admin') {
      setActiveModule('admin');
      setCurrentTab('admin');
      showToast('Administrator authenticated! Welcome to Admin Dashboard.', 'success');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09140E] text-[#F3EFE6] relative overflow-x-hidden">
      {/* Moving Animated Motional Background across the entire platform */}
      <AnimatedBackground />

      {/* Top Notification Toast */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-3 border ${
            toastMessage.type === 'success'
              ? 'bg-[#153424] text-white border-[#2E6B4B]'
              : 'bg-rose-700 text-white border-rose-500'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#8CE2A8]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-200" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Module Navbar (shown only in Sell, Buy, Admin, Swaps modules - NOT on landing page) */}
      {currentTab !== 'home' && (
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          onOpenCreateListing={() => {
            setItemToEdit(null);
            setShowCreateModal(true);
          }}
          onOpenAuth={() => {
            setPendingModule(null);
            setShowAuthModal(true);
          }}
          incomingRequestsCount={incomingPendingCount}
          sellerSubTab={sellerSubTab}
          setSellerSubTab={setSellerSubTab}
          adminSubTab={adminSubTab}
          setAdminSubTab={setAdminSubTab}
          onToggleFilter={() => {
            setCurrentTab('marketplace');
            const el = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (el) el.focus();
          }}
        />
      )}

      {/* Primary Page Content */}
      <main className={currentTab === 'home' ? 'flex-1 w-full relative z-10' : 'flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 relative z-10'}>
        {currentTab === 'home' && (
          <HomeView
            onNavigateToBuy={() => handleNavigateModule('buyer')}
            onNavigateToSell={() => handleNavigateModule('sell')}
            onNavigateToAdmin={() => handleNavigateModule('admin')}
            onSelectCityForBuy={(city: string) => handleNavigateModule('buyer', city)}
            onOpenAuth={() => {
              setPendingModule(null);
              setShowAuthModal(true);
            }}
            totalListingsCount={listings.length}
            completedSwapsCount={
              swaps.incoming.filter((s) => s.status === 'completed').length +
              swaps.outgoing.filter((s) => s.status === 'completed').length
            }
          />
        )}

        {currentTab === 'marketplace' && (
          <MarketplaceView
            listings={listings}
            isLoading={isLoadingListings}
            onSelectItem={(item) => setSelectedItem(item)}
            onProposeSwap={handleInitiateSwap}
            selectedCityFilter={selectedCityFilter}
            onCityFilterChange={setSelectedCityFilter}
            onGoToHowItWorks={() => setCurrentTab('how-it-works')}
          />
        )}

        {currentTab === 'sell' && (
          <SellClothesView
            myListings={myListings}
            incomingSwapOffers={swaps.incoming}
            activeSection={sellerSubTab}
            onSectionChange={setSellerSubTab}
            onOpenCreateListing={() => {
              if (!user) {
                setShowAuthModal(true);
                return;
              }
              setItemToEdit(null);
              setShowCreateModal(true);
            }}
            onEditItem={(item) => {
              setSelectedItem(null);
              setItemToEdit(item);
              setShowCreateModal(true);
            }}
            onDeleteItem={handleDeleteListing}
            onSelectItem={(item) => setSelectedItem(item)}
            onOpenChat={(swap) => setActiveChatSwap(swap)}
            onOpenCalculator={() => setShowCalculator(true)}
            onRefresh={() => {
              loadListings();
              loadSwaps();
            }}
          />
        )}

        {currentTab === 'nearby' && (
          <NearbySwapsView
            listings={listings}
            onSelectItem={(item) => setSelectedItem(item)}
            onProposeSwap={handleInitiateSwap}
          />
        )}

        {currentTab === 'swaps' && (
          <SwapRequestsView
            incomingRequests={swaps.incoming}
            outgoingRequests={swaps.outgoing}
            onOpenChat={(swap) => setActiveChatSwap(swap)}
            onRefresh={loadSwaps}
            onReportDispute={handleReportDispute}
          />
        )}

        {currentTab === 'how-it-works' && (
          <HowItWorksView
            onBrowseClothes={() => setCurrentTab('marketplace')}
            onOpenCalculator={() => setShowCalculator(true)}
          />
        )}

        {currentTab === 'exchange-instructions' && (
          <ExchangeInstructionsView
            onGoToSwaps={() => setCurrentTab('swaps')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            myListings={myListings}
            swaps={swaps}
            onSelectItem={(item) => setSelectedItem(item)}
            onEditItem={(item) => {
              setSelectedItem(null);
              setItemToEdit(item);
              setShowCreateModal(true);
            }}
            onDeleteItem={handleDeleteListing}
            onOpenCreateListing={() => {
              setItemToEdit(null);
              setShowCreateModal(true);
            }}
            onOpenChat={(swap) => setActiveChatSwap(swap)}
            onGoToSwaps={() => setCurrentTab('swaps')}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView
            onRefreshAll={() => {
              loadListings();
              loadSwaps();
            }}
            onGoHome={() => setCurrentTab('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Dialogs */}
      {selectedItem && (
        <ItemDetailsModal
          item={selectedItem}
          allListings={listings}
          onClose={() => setSelectedItem(null)}
          onProposeSwap={handleInitiateSwap}
          onEditItem={(item) => {
            setSelectedItem(null);
            setItemToEdit(item);
            setShowCreateModal(true);
          }}
          onDeleteItem={handleDeleteListing}
          onReportDispute={(id, title) => handleReportDispute(id, title)}
          onSelectSimilarItem={(similar) => setSelectedItem(similar)}
        />
      )}

      {showCreateModal && (
        <CreateEditListingModal
          itemToEdit={itemToEdit}
          onClose={() => {
            setShowCreateModal(false);
            setItemToEdit(null);
          }}
          onSuccess={() => {
            loadListings();
            showToast(itemToEdit ? 'Garment details updated!' : 'Garment published for barter swap!');
          }}
        />
      )}

      {targetSwapItem && (
        <SwapProposalModal
          targetItem={targetSwapItem}
          onClose={() => setTargetSwapItem(null)}
          onSuccess={() => {
            loadSwaps();
            loadListings();
            showToast('Swap proposal sent! You can coordinate details in the Negotiation Chat.');
            setCurrentTab('swaps');
          }}
          onOpenCreateListing={() => {
            setItemToEdit(null);
            setShowCreateModal(true);
          }}
        />
      )}

      {activeChatSwap && (
        <ChatModal
          swap={activeChatSwap}
          onClose={() => setActiveChatSwap(null)}
        />
      )}

      {showCalculator && (
        <ValueCalculatorModal
          onClose={() => setShowCalculator(false)}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => {
            setShowAuthModal(false);
            setPendingModule(null);
          }}
          targetModule={pendingModule}
          isCompulsory={Boolean(pendingModule)}
          onSuccessNavigate={handleAuthSuccess}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ReWearApp />
    </AuthProvider>
  );
}
