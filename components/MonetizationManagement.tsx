import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, X, Save, Calendar, Target, Bell, Tag, Percent, DollarSign, Gift, Clock, Upload, GripVertical, Eye, EyeOff, MoveUp, MoveDown, Info } from 'lucide-react';

interface Popup {
  _id: string;
  title: string;
  description: string;
  image?: string;
  ctaText: string;
  ctaAction: string;
  ctaUrl?: string;
  popupType: string;
  targetUsers: string;
  frequency: string;
  frequencyHours?: number;
  priority: number;
  startTime: string;
  endTime: string;
  isEnabled: boolean;
  impressions: number;
  clicks: number;
  closes: number;
  templateId?: string;
  promoCode?: string; // Promo code to auto-apply when user clicks CTA
  templateData?: {
    leftImageUrl?: string;
    leftOverlayText?: string;
    leftBrandText?: string;
    leftMainText?: string;
    leftDescription?: string;
    leftPromoCode?: string;
    leftUrgencyText?: string;
    leftCtaText?: string;
    leftBackgroundColor?: string;
    tags?: any[];
    mainHeading?: string;
    subHeading?: string;
    description?: string;
    validityText?: string;
    autoGenerateValidity?: boolean;
    features?: any[];
    ctaText?: string;
    ctaAction?: string;
    ctaUrl?: string;
  };
  textContent?: any;
}

interface Offer {
  _id: string;
  name: string;
  offerType: string;
  discountType: string;
  discountValue: number;
  applicablePacks: string[];
  autoApply: boolean;
  usageLimit?: number;
  perUserLimit: number;
  dailyLimit?: number;
  countdownTimer: boolean;
  startTime: string;
  endTime: string;
  targetUsers: string;
  isEnabled: boolean;
  totalUses: number;
  totalRevenue: number;
}

interface PromoCode {
  _id: string;
  code: string;
  discountType: string;
  discountValue: number;
  applicablePacks: string[];
  minPurchaseAmount: number;
  usageLimit?: number;
  perUserLimit: number;
  dailyLimit?: number;
  startTime: string;
  endTime: string;
  isEnabled: boolean;
  totalUses: number;
  totalRevenue: number;
}

interface TopBanner {
  _id: string;
  titleText: string;
  highlightTags?: string[];
  backgroundStyle?: 'solid' | 'gradient' | 'pattern';
  backgroundColor?: string;
  gradientColors?: { from: string; to: string };
  textColor?: string;
  iconLeft?: string;
  iconRight?: string;
  ctaText: string;
  ctaAction: string;
  ctaUrl?: string;
  countdownEnabled?: boolean;
  countdownEndDate?: string;
  startAt: string;
  endAt: string;
  priority: number;
  allowedUserSegments?: string[];
  allowDismiss?: boolean;
  deviceTargeting?: string[];
  status: string;
  views: number;
  clicks: number;
  dismissals: number;
}

export function MonetizationManagement() {
  const [activeSection, setActiveSection] = useState<'popups' | 'offers' | 'promo-codes' | 'top-banners'>('popups');
  const [popups, setPopups] = useState<Popup[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [topBanners, setTopBanners] = useState<TopBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [activeSection]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeSection === 'popups') {
        const data = await api.getPopups();
        setPopups(data.popups || []);
      } else if (activeSection === 'offers') {
        const data = await api.getOffers();
        setOffers(data.offers || []);
      } else if (activeSection === 'promo-codes') {
        const data = await api.getPromoCodes();
        setPromoCodes(data.promoCodes || []);
      } else if (activeSection === 'top-banners') {
        const data = await api.getTopBanners();
        setTopBanners(data.banners || []);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: 'popup' | 'offer' | 'promo-code' | 'top-banner') => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      if (type === 'popup') {
        await api.deletePopup(id);
      } else if (type === 'offer') {
        await api.deleteOffer(id);
      } else if (type === 'promo-code') {
        await api.deletePromoCode(id);
      } else if (type === 'top-banner') {
        await api.deleteTopBanner(id);
      }
      loadData();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 border-b border-gray-800">
        <button
          onClick={() => setActiveSection('popups')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === 'popups'
              ? 'text-indigo-400 border-b-2 border-indigo-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Bell className="inline mr-2" size={16} />
          Popups
        </button>
        <button
          onClick={() => setActiveSection('offers')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === 'offers'
              ? 'text-indigo-400 border-b-2 border-indigo-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Gift className="inline mr-2" size={16} />
          Offers
        </button>
        <button
          onClick={() => setActiveSection('promo-codes')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeSection === 'promo-codes'
              ? 'text-indigo-400 border-b-2 border-indigo-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Tag className="inline mr-2" size={16} />
          Promo Codes
        </button>
      </div>

      {/* Popups Section */}
      {activeSection === 'popups' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Popup Notifications</h3>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowPopupModal(true);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2"
            >
              <Plus size={16} /> Create Popup
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : popups.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No popups created yet</div>
          ) : (
            <div className="grid gap-4">
              {popups.map((popup) => (
                <div key={popup._id} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-white">{popup.title}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded ${popup.isEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                          {popup.isEnabled ? 'Active' : 'Disabled'}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                          {popup.popupType.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{popup.description}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Impressions: {popup.impressions}</span>
                        <span>Clicks: {popup.clicks}</span>
                        <span>Closes: {popup.closes}</span>
                        <span>Priority: {popup.priority}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(popup);
                          setShowPopupModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-indigo-400"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(popup._id, 'popup')}
                        className="p-2 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Offers Section */}
      {activeSection === 'offers' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Offers & Discounts</h3>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowOfferModal(true);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2"
            >
              <Plus size={16} /> Create Offer
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : offers.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No offers created yet</div>
          ) : (
            <div className="grid gap-4">
              {offers.map((offer) => (
                <div key={offer._id} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-white">{offer.name}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded ${offer.isEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                          {offer.isEnabled ? 'Active' : 'Disabled'}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                          {offer.offerType.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-300 mb-2">
                        <span>
                          {offer.discountType === 'percentage' && `${offer.discountValue}% OFF`}
                          {offer.discountType === 'flat' && `₹${offer.discountValue} OFF`}
                          {offer.discountType === 'bonus_points' && `+${offer.discountValue} Bonus Points`}
                        </span>
                        {offer.autoApply && <span className="text-green-400">Auto-Apply</span>}
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Uses: {offer.totalUses} / {offer.usageLimit || '∞'}</span>
                        <span>Revenue: ₹{offer.totalRevenue}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(offer);
                          setShowOfferModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-indigo-400"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(offer._id, 'offer')}
                        className="p-2 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Promo Codes Section */}
      {activeSection === 'promo-codes' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Promo Codes</h3>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowPromoModal(true);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2"
            >
              <Plus size={16} /> Create Promo Code
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : promoCodes.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No promo codes created yet</div>
          ) : (
            <div className="grid gap-4">
              {promoCodes.map((promo) => (
                <div key={promo._id} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-white font-mono">{promo.code}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded ${promo.isEnabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                          {promo.isEnabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-300 mb-2">
                        <span>
                          {promo.discountType === 'percentage' && `${promo.discountValue}% OFF`}
                          {promo.discountType === 'flat' && `₹${promo.discountValue} OFF`}
                          {promo.discountType === 'bonus_points' && `+${promo.discountValue} Bonus Points`}
                        </span>
                        {promo.minPurchaseAmount > 0 && (
                          <span className="text-gray-500">Min: ₹{promo.minPurchaseAmount}</span>
                        )}
                      </div>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Uses: {promo.totalUses} / {promo.usageLimit || '∞'}</span>
                        <span>Revenue: ₹{promo.totalRevenue}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(promo);
                          setShowPromoModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-indigo-400"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(promo._id, 'promo-code')}
                        className="p-2 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Top Banners Section */}
      {activeSection === 'top-banners' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Top Promotional Banners</h3>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowBannerModal(true);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2"
            >
              <Plus size={16} /> Create Banner
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : topBanners.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No banners created yet</div>
          ) : (
            <div className="grid gap-4">
              {topBanners.map((banner) => (
                <div key={banner._id} className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-white">{banner.titleText}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded ${banner.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                          {banner.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                          Priority: {banner.priority}
                        </span>
                      </div>
                      {banner.highlightTags && banner.highlightTags.length > 0 && (
                        <div className="flex gap-1 mb-2">
                          {banner.highlightTags.map((tag, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Views: {banner.views}</span>
                        <span>Clicks: {banner.clicks}</span>
                        <span>Dismissals: {banner.dismissals}</span>
                        <span>CTR: {banner.views > 0 ? ((banner.clicks / banner.views) * 100).toFixed(1) : 0}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(banner);
                          setShowBannerModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-indigo-400"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id, 'top-banner')}
                        className="p-2 text-gray-400 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Popup Modal */}
      {showPopupModal && (
        <PopupModal
          popup={editingItem}
          onClose={() => {
            setShowPopupModal(false);
            setEditingItem(null);
          }}
          onSave={async (popupData) => {
            try {
              if (editingItem?._id) {
                await api.updatePopup(editingItem._id, popupData);
                alert('✅ Popup updated successfully!');
              } else {
                await api.createPopup(popupData);
                alert('✅ Popup created successfully!');
              }
              setShowPopupModal(false);
              setEditingItem(null);
              loadData();
            } catch (error: any) {
              // Error is handled in modal, but re-throw to prevent modal close
              throw error;
            }
          }}
        />
      )}

      {/* Offer Modal */}
      {showOfferModal && (
        <OfferModal
          offer={editingItem}
          onClose={() => {
            setShowOfferModal(false);
            setEditingItem(null);
          }}
          onSave={async (offerData) => {
            try {
              if (editingItem?._id) {
                await api.updateOffer(editingItem._id, offerData);
              } else {
                await api.createOffer(offerData);
              }
              setShowOfferModal(false);
              setEditingItem(null);
              loadData();
            } catch (error: any) {
              alert(`Error: ${error.message}`);
            }
          }}
        />
      )}

      {/* Promo Code Modal */}
      {showPromoModal && (
        <PromoCodeModal
          promoCode={editingItem}
          onClose={() => {
            setShowPromoModal(false);
            setEditingItem(null);
          }}
          onSave={async (promoData) => {
            try {
              if (editingItem?._id) {
                await api.updatePromoCode(editingItem._id, promoData);
              } else {
                await api.createPromoCode(promoData);
              }
              setShowPromoModal(false);
              setEditingItem(null);
              loadData();
            } catch (error: any) {
              alert(`Error: ${error.message}`);
            }
          }}
        />
      )}
    </div>
  );
}

// Popup Modal Component
function PopupModal({ popup, onClose, onSave }: { popup: Popup | null; onClose: () => void; onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: popup?.title || '',
    description: popup?.description || '',
    image: popup?.image || '',
    ctaText: popup?.ctaText || 'Get Started',
    ctaAction: popup?.ctaAction || 'apply_offer',
    ctaUrl: popup?.ctaUrl || '',
    popupType: popup?.popupType || 'center_modal',
    targetUsers: popup?.targetUsers || 'all',
    frequency: popup?.frequency || 'once_per_day',
    frequencyHours: popup?.frequencyHours || 24,
    priority: popup?.priority || 0,
    startTime: popup?.startTime ? new Date(popup.startTime).toISOString().slice(0, 16) : '',
    endTime: popup?.endTime ? new Date(popup.endTime).toISOString().slice(0, 16) : '',
    isEnabled: popup?.isEnabled !== false,
    promoCode: popup?.promoCode || '', // Promo code to auto-apply
    // Template-Based System
    templateId: popup?.templateId || 'CENTER_MODAL',
    templateData: popup?.templateData || {
      leftImageUrl: popup?.image || '',
      leftOverlayText: '',
      leftBrandText: '',
      leftMainText: '',
      leftDescription: '',
      leftPromoCode: '',
      leftUrgencyText: '',
      leftCtaText: '',
      leftBackgroundColor: '#FFA500',
      tags: [],
      mainHeading: '',
      subHeading: '',
      description: '',
      validityText: '',
      autoGenerateValidity: false,
      features: [],
      ctaText: popup?.ctaText || 'Get Discount Now',
      ctaAction: 'apply_offer',
      ctaUrl: ''
    },
    // Text Content Management (for legacy templates)
    textContent: popup?.textContent || {
      brandText: '',
      showBrandText: false,
      tags: [],
      mainTitle: popup?.title || '',
      subTitle: '',
      autoUppercase: true,
      description: popup?.description || '',
      maxDescriptionLength: 200,
      validityText: '',
      autoGenerateValidity: false,
      features: [],
      ctaText: popup?.ctaText || 'Get Started',
      ctaSubText: '',
      couponText: '',
      showCoupon: false
    }
  });
  // Unified image state - SINGLE SOURCE OF TRUTH
  const [imageSource, setImageSource] = useState<{
    mode: 'template' | 'generic';
    url: string | null;
    file: File | null;
  }>(() => {
    // Initialize based on template and existing data
    const initialMode = popup?.templateId === 'OFFER_SPLIT_IMAGE_RIGHT_CONTENT' ? 'template' : 'generic';
    const initialUrl = initialMode === 'template' 
      ? (popup?.templateData?.leftImageUrl || popup?.image || null)
      : (popup?.image || null);
    return {
      mode: initialMode,
      url: initialUrl,
      file: null
    };
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!popup?._id;

  // Computed preview URL
  const imagePreview = imageSource.file 
    ? URL.createObjectURL(imageSource.file) 
    : imageSource.url;

  // Fetch popup data when in edit mode
  useEffect(() => {
    const fetchPopupData = async () => {
      if (isEditMode && popup?._id) {
        try {
          const response = await api.getPopup(popup._id);
          if (response.success && response.popup) {
            const popupData = response.popup;
            const fetchedTemplateId = popupData.templateId || 'CENTER_MODAL';
            setFormData({
              title: popupData.title || '',
              description: popupData.description || '',
              image: popupData.image || '',
              ctaText: popupData.ctaText || 'Get Started',
              ctaAction: popupData.ctaAction || 'buy_pack',
              ctaUrl: popupData.ctaUrl || '',
              popupType: popupData.popupType || 'center_modal',
              targetUsers: popupData.targetUsers || 'all',
              frequency: popupData.frequency || 'once_per_day',
              frequencyHours: popupData.frequencyHours || 24,
              priority: popupData.priority || 0,
              startTime: popupData.startTime ? new Date(popupData.startTime).toISOString().slice(0, 16) : '',
              endTime: popupData.endTime ? new Date(popupData.endTime).toISOString().slice(0, 16) : '',
              isEnabled: popupData.isEnabled !== false,
              promoCode: popupData.promoCode || '', // Initialize promo code from fetched data
              templateId: fetchedTemplateId,
              templateData: popupData.templateData || {
                leftImageUrl: popupData.templateData?.leftImageUrl || popupData.image || '',
                leftOverlayText: popupData.templateData?.leftOverlayText || '',
                leftBrandText: popupData.templateData?.leftBrandText || '',
                leftMainText: popupData.templateData?.leftMainText || '',
                leftDescription: popupData.templateData?.leftDescription || '',
                leftPromoCode: popupData.templateData?.leftPromoCode || '',
                leftUrgencyText: popupData.templateData?.leftUrgencyText || '',
                leftCtaText: popupData.templateData?.leftCtaText || '',
                leftBackgroundColor: popupData.templateData?.leftBackgroundColor || '#FFA500',
                tags: popupData.templateData?.tags || [],
                mainHeading: popupData.templateData?.mainHeading || '',
                subHeading: popupData.templateData?.subHeading || '',
                description: popupData.templateData?.description || '',
                validityText: popupData.templateData?.validityText || '',
                autoGenerateValidity: popupData.templateData?.autoGenerateValidity || false,
                features: popupData.templateData?.features || [],
                ctaText: popupData.templateData?.ctaText || popupData.ctaText || 'Get Discount Now',
                ctaAction: popupData.templateData?.ctaAction || 'apply_offer',
                ctaUrl: popupData.templateData?.ctaUrl || ''
              },
              textContent: popupData.textContent || {
                brandText: '',
                showBrandText: false,
                tags: [],
                mainTitle: popupData.title || '',
                subTitle: '',
                autoUppercase: true,
                description: popupData.description || '',
                maxDescriptionLength: 200,
                validityText: '',
                autoGenerateValidity: false,
                features: [],
                ctaText: popupData.ctaText || 'Get Started',
                ctaSubText: '',
                couponText: '',
                showCoupon: false
              }
            });
            
            // Set unified image source based on template mode
            const isTemplateMode = fetchedTemplateId === 'OFFER_SPLIT_IMAGE_RIGHT_CONTENT';
            // For template mode, prioritize templateData.leftImageUrl, fallback to image
            // For legacy mode, use image field
            const imageUrl = isTemplateMode 
              ? (popupData.templateData?.leftImageUrl || popupData.image || null)
              : (popupData.image || null);
            
            console.log('Setting imageSource in edit mode:', {
              isTemplateMode,
              templateDataLeftImageUrl: popupData.templateData?.leftImageUrl,
              popupImage: popupData.image,
              finalImageUrl: imageUrl
            });
            
            setImageSource({
              mode: isTemplateMode ? 'template' : 'generic',
              url: imageUrl,
              file: null
            });
          }
        } catch (err: any) {
          console.error('Error fetching popup:', err);
          setError(err.message || 'Failed to load popup data');
        }
      }
    };
    fetchPopupData();
  }, [isEditMode, popup?._id]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">{popup ? 'Edit Popup' : 'Create Popup'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          {/* Template Selector */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Popup Template *</label>
            <select
              value={formData.templateId || 'CENTER_MODAL'}
              onChange={(e) => {
                const newTemplateId = e.target.value;
                const isTemplateMode = newTemplateId === 'OFFER_SPLIT_IMAGE_RIGHT_CONTENT';
                
                // DESTROY previous image state when template changes
                setImageSource({
                  mode: isTemplateMode ? 'template' : 'generic',
                  url: null, // Clear image on template change
                  file: null
                });
                
                setFormData({
                  ...formData,
                  templateId: newTemplateId
                });
              }}
              className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
            >
              <option value="OFFER_SPLIT_IMAGE_RIGHT_CONTENT">Offer Split (Image Left, Content Right)</option>
              <option value="CENTER_MODAL">Center Modal (Legacy)</option>
              <option value="FULL_SCREEN">Full Screen (Legacy)</option>
              <option value="BOTTOM_SHEET">Bottom Sheet (Legacy)</option>
              <option value="TOAST">Toast (Legacy)</option>
              <option value="EXIT_INTENT">Exit Intent (Legacy)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.templateId === 'OFFER_SPLIT_IMAGE_RIGHT_CONTENT' 
                ? 'Premium offer popup with fixed layout - image on left, structured content on right'
                : 'Legacy template - uses old textContent system'}
            </p>
          </div>

          {/* OFFER_SPLIT_IMAGE_RIGHT_CONTENT Template Fields */}
          {formData.templateId === 'OFFER_SPLIT_IMAGE_RIGHT_CONTENT' ? (
            <div className="space-y-4 bg-gray-950/50 p-4 rounded-lg border border-gray-700">
              <h5 className="text-sm font-semibold text-white mb-3">Template: Offer Split Layout</h5>
              
              {/* Left Side Content Section */}
              <div className="mb-4 space-y-4 bg-orange-950/30 p-4 rounded-lg border border-orange-800/30">
                <h5 className="text-sm font-semibold text-orange-300 mb-3">Left Side Content (Image + Text)</h5>
                
                {/* Background Color */}
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Background Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.templateData?.leftBackgroundColor || '#FFA500'}
                      onChange={(e) => setFormData({
                        ...formData,
                        templateData: {
                          ...formData.templateData,
                          leftBackgroundColor: e.target.value
                        }
                      })}
                      className="w-16 h-10 rounded border border-gray-700"
                    />
                    <input
                      type="text"
                      value={formData.templateData?.leftBackgroundColor || '#FFA500'}
                      onChange={(e) => setFormData({
                        ...formData,
                        templateData: {
                          ...formData.templateData,
                          leftBackgroundColor: e.target.value
                        }
                      })}
                      className="flex-1 bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      placeholder="#FFA500"
                    />
                  </div>
                </div>

                {/* Template Banner Image Section - ONLY for template-based popups */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Background Image (Optional)</label>
                {imagePreview && (
                  <div className="mb-3 relative">
                    <img
                      src={imagePreview}
                      alt="Banner Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        // REAL REMOVE - set to null
                        setImageSource({
                          mode: 'template',
                          url: null,
                          file: null
                        });
                      }}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">
                      {imageSource.file ? imageSource.file.name : 'Click to upload banner image'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (Max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert('File size must be less than 5MB');
                          return;
                        }
                        // Set file, clear URL
                        setImageSource({
                          mode: 'template',
                          url: null,
                          file: file
                        });
                      }
                    }}
                  />
                </label>
                <div className="mt-3">
                  <input
                    type="text"
                    value={imageSource.url || ''}
                    onChange={(e) => {
                      const url = e.target.value;
                      // Set URL, clear file
                      setImageSource({
                        mode: 'template',
                        url: url || null,
                        file: null
                      });
                    }}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    placeholder="Or enter Cloudinary URL..."
                    disabled={!!imageSource.file}
                  />
                </div>
                  <div className="mt-2">
                    <label className="block text-xs text-gray-400 mb-1">Overlay Text (Optional)</label>
                    <input
                      type="text"
                      value={formData.templateData?.leftOverlayText || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        templateData: {
                          ...formData.templateData,
                          leftOverlayText: e.target.value
                        }
                      })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      placeholder="e.g. 81% OFF"
                      maxLength={20}
                    />
                  </div>
                </div>

                {/* Left Side Text Content */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Brand Text (e.g., BORCELLE STORE)</label>
                    <input
                      type="text"
                      value={formData.templateData?.leftBrandText || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        templateData: {
                          ...formData.templateData,
                          leftBrandText: e.target.value.toUpperCase()
                        }
                      })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      placeholder="BORCELLE STORE"
                      maxLength={30}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Main Text (e.g., SPECIAL OFFER)</label>
                    <input
                      type="text"
                      value={formData.templateData?.leftMainText || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        templateData: {
                          ...formData.templateData,
                          leftMainText: e.target.value.toUpperCase()
                        }
                      })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm font-bold"
                      placeholder="SPECIAL OFFER"
                      maxLength={30}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Description</label>
                    <textarea
                      value={formData.templateData?.leftDescription || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        templateData: {
                          ...formData.templateData,
                          leftDescription: e.target.value
                        }
                      })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      rows={2}
                      placeholder="Enjoy up to 30% OFF everything in-store!"
                      maxLength={100}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Promo Code Text</label>
                    <input
                      type="text"
                      value={formData.templateData?.leftPromoCode || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        templateData: {
                          ...formData.templateData,
                          leftPromoCode: e.target.value
                        }
                      })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      placeholder="Code : SALE30"
                      maxLength={30}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Urgency Text</label>
                    <input
                      type="text"
                      value={formData.templateData?.leftUrgencyText || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        templateData: {
                          ...formData.templateData,
                          leftUrgencyText: e.target.value
                        }
                      })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm italic"
                      placeholder="Hurry, this deal won't last long!"
                      maxLength={50}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Left CTA Button Text</label>
                    <input
                      type="text"
                      value={formData.templateData?.leftCtaText || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        templateData: {
                          ...formData.templateData,
                          leftCtaText: e.target.value.toUpperCase()
                        }
                      })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm font-semibold"
                      placeholder="SHOP NOW"
                      maxLength={20}
                    />
                  </div>
                </div>
              </div>

              {/* Main Heading */}
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-1">Main Heading *</label>
                <input
                  type="text"
                  value={formData.templateData?.mainHeading || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    templateData: {
                      ...formData.templateData,
                      mainHeading: e.target.value.toUpperCase()
                    }
                  })}
                  className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm font-bold"
                  placeholder="CHRISTMAS SEASON"
                  maxLength={40}
                  required
                />
              </div>

              {/* Sub Heading */}
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-1">Sub Heading *</label>
                <input
                  type="text"
                  value={formData.templateData?.subHeading || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    templateData: {
                      ...formData.templateData,
                      subHeading: e.target.value.toUpperCase()
                    }
                  })}
                  className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm font-bold"
                  placeholder="UP TO 81% OFF"
                  maxLength={40}
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-1">Description (1-2 lines) *</label>
                <textarea
                  value={formData.templateData?.description || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    templateData: {
                      ...formData.templateData,
                      description: e.target.value
                    }
                  })}
                  className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                  rows={2}
                  placeholder="Save up to 81% + Free Unlimited Bundle Generations on Ultimate & Creator Plans"
                  maxLength={150}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {(formData.templateData?.description || '').length} / 150 characters
                </p>
              </div>

              {/* Validity Text (Limited-time offer) */}
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-1">Validity Text (Optional)</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.templateData?.validityText || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      templateData: {
                        ...formData.templateData,
                        validityText: e.target.value
                      }
                    })}
                    className="flex-1 bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    placeholder="Limited-time offer — ends 28th Dec"
                  />
                  <label className="flex items-center gap-2 text-xs text-gray-400 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={formData.templateData?.autoGenerateValidity || false}
                      onChange={(e) => setFormData({
                        ...formData,
                        templateData: {
                          ...formData.templateData,
                          autoGenerateValidity: e.target.checked
                        }
                      })}
                      className="rounded"
                    />
                    Auto-generate from End Time
                  </label>
                </div>
                <p className="text-xs text-gray-500">This will appear as the first item in the features list</p>
              </div>

              {/* Tags Section (Top Badges like "Limited offer", "Holiday sale") */}
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-2">Top Tags/Badges</label>
                <div className="space-y-2">
                  {(formData.templateData?.tags || []).map((tag: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-900 p-2 rounded">
                      <input
                        type="text"
                        value={tag.text || ''}
                        onChange={(e) => {
                          const newTags = [...(formData.templateData?.tags || [])];
                          newTags[idx] = { ...tag, text: e.target.value };
                          setFormData({
                            ...formData,
                            templateData: {
                              ...formData.templateData,
                              tags: newTags
                            }
                          });
                        }}
                        className="flex-1 bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                        placeholder="e.g., Limited offer"
                      />
                      <select
                        value={tag.color || 'red'}
                        onChange={(e) => {
                          const newTags = [...(formData.templateData?.tags || [])];
                          newTags[idx] = { ...tag, color: e.target.value };
                          setFormData({
                            ...formData,
                            templateData: {
                              ...formData.templateData,
                              tags: newTags
                            }
                          });
                        }}
                        className="bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                      >
                        <option value="red">Red</option>
                        <option value="orange">Orange</option>
                        <option value="green">Green</option>
                        <option value="blue">Blue</option>
                        <option value="yellow">Yellow</option>
                        <option value="purple">Purple</option>
                      </select>
                      <label className="flex items-center gap-1 text-xs text-gray-400">
                        <input
                          type="checkbox"
                          checked={tag.isEnabled !== false}
                          onChange={(e) => {
                            const newTags = [...(formData.templateData?.tags || [])];
                            newTags[idx] = { ...tag, isEnabled: e.target.checked };
                            setFormData({
                              ...formData,
                              templateData: {
                                ...formData.templateData,
                                tags: newTags
                              }
                            });
                          }}
                          className="rounded"
                        />
                        Show
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newTags = (formData.templateData?.tags || []).filter((_: any, i: number) => i !== idx);
                          setFormData({
                            ...formData,
                            templateData: {
                              ...formData.templateData,
                              tags: newTags
                            }
                          });
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = [...(formData.templateData?.tags || []), {
                        text: '',
                        color: 'red',
                        isEnabled: true,
                        order: (formData.templateData?.tags || []).length
                      }];
                      setFormData({
                        ...formData,
                        templateData: {
                          ...formData.templateData,
                          tags: newTags
                        }
                      });
                    }}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded text-sm flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add Tag
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Tags appear at the top of the popup (e.g., "Limited offer", "Holiday sale")</p>
              </div>

              {/* Features List Section */}
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-2">Features List (with Badges)</label>
                <div className="space-y-2">
                  {(formData.templateData?.features || []).map((feature: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-900 p-2 rounded">
                      <input
                        type="text"
                        value={feature.text || ''}
                        onChange={(e) => {
                          const newFeatures = [...(formData.templateData?.features || [])];
                          newFeatures[idx] = { ...feature, text: e.target.value };
                          setFormData({
                            ...formData,
                            templateData: {
                              ...formData.templateData,
                              features: newFeatures
                            }
                          });
                        }}
                        className="flex-1 bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                        placeholder="e.g., Seedance Pro Fast"
                      />
                      <select
                        value={feature.badgeType || 'unlimited'}
                        onChange={(e) => {
                          const newFeatures = [...(formData.templateData?.features || [])];
                          newFeatures[idx] = { ...feature, badgeType: e.target.value || 'unlimited' };
                          setFormData({
                            ...formData,
                            templateData: {
                              ...formData.templateData,
                              features: newFeatures
                            }
                          });
                        }}
                        className="bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                      >
                        <option value="unlimited">Unlimited (Green)</option>
                        <option value="pro">Pro (Dark Green)</option>
                        <option value="included">Included (Golden Yellow)</option>
                      </select>
                      <label className="flex items-center gap-1 text-xs text-gray-400">
                        <input
                          type="checkbox"
                          checked={feature.isEnabled !== false}
                          onChange={(e) => {
                            const newFeatures = [...(formData.templateData?.features || [])];
                            newFeatures[idx] = { ...feature, isEnabled: e.target.checked };
                            setFormData({
                              ...formData,
                              templateData: {
                                ...formData.templateData,
                                features: newFeatures
                              }
                            });
                          }}
                          className="rounded"
                        />
                        Show
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newFeatures = (formData.templateData?.features || []).filter((_: any, i: number) => i !== idx);
                          setFormData({
                            ...formData,
                            templateData: {
                              ...formData.templateData,
                              features: newFeatures
                            }
                          });
                        }}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newFeatures = [...(formData.templateData?.features || []), {
                        text: '',
                        badgeType: 'unlimited', // Default to unlimited badge
                        isEnabled: true,
                        order: (formData.templateData?.features || []).length
                      }];
                      setFormData({
                        ...formData,
                        templateData: {
                          ...formData.templateData,
                          features: newFeatures
                        }
                      });
                    }}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded text-sm flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add Feature
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Features appear as a list with checkmarks and badges (e.g., "Unlimited" badge)</p>
              </div>

              {/* CTA */}
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-1">CTA Button Text *</label>
                <input
                  type="text"
                  value={formData.templateData?.ctaText || 'Get Discount Now'}
                  onChange={(e) => setFormData({
                    ...formData,
                    templateData: {
                      ...formData.templateData,
                      ctaText: e.target.value
                    }
                  })}
                  className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                  placeholder="Get Discount Now"
                  required
                />
                <div className="mt-2">
                  <label className="block text-xs text-gray-400 mb-1">CTA Action</label>
                  <select
                    value={formData.templateData?.ctaAction || 'apply_offer'}
                    onChange={(e) => setFormData({
                      ...formData,
                      templateData: {
                        ...formData.templateData,
                        ctaAction: e.target.value
                      }
                    })}
                    className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="apply_offer">Apply Offer</option>
                    <option value="buy_plan">Buy Plan</option>
                    <option value="open_payment">Open Payment</option>
                    <option value="redirect">Redirect URL</option>
                  </select>
                </div>
                {formData.templateData?.ctaAction === 'redirect' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={formData.templateData?.ctaUrl || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        templateData: {
                          ...formData.templateData,
                          ctaUrl: e.target.value
                        }
                      })}
                      className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      placeholder="https://..."
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Legacy Fields - ONLY for legacy templates */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                  rows={3}
                  required
                />
              </div>
            </>
          )}

          {/* Generic Popup Image Section - ONLY for legacy templates */}
          {formData.templateId !== 'OFFER_SPLIT_IMAGE_RIGHT_CONTENT' && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Popup Image</label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-3 relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // REAL REMOVE - set to null
                      setImageSource({
                        mode: 'generic',
                        url: null,
                        file: null
                      });
                    }}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {/* File Upload */}
              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-gray-950 hover:bg-gray-900 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400">
                      {imageSource.file ? imageSource.file.name : 'Click to upload image'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (Max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert('File size must be less than 5MB');
                          return;
                        }
                        // Set file, clear URL
                        setImageSource({
                          mode: 'generic',
                          url: null,
                          file: file
                        });
                      }
                    }}
                  />
                </label>
              </div>

              {/* Or URL Input */}
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1 text-center">OR</p>
                <input
                  type="text"
                  value={imageSource.url || ''}
                  onChange={(e) => {
                    const url = e.target.value;
                    // Set URL, clear file
                    setImageSource({
                      mode: 'generic',
                      url: url || null,
                      file: null
                    });
                  }}
                  className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                  placeholder="Enter Cloudinary URL..."
                  disabled={!!imageSource.file}
                />
              </div>
            </div>
          )}

          {/* Common Fields (for all templates) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Target Users</label>
              <select
                value={formData.targetUsers}
                onChange={(e) => setFormData({ ...formData, targetUsers: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
              >
                <option value="all">All Users</option>
                <option value="new">New Users</option>
                <option value="low_balance">Low Balance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
              >
                <option value="once_per_session">Once Per Session</option>
                <option value="once_per_day">Once Per Day</option>
                <option value="once_per_hour">Once Per Hour</option>
                <option value="once_per_X_hours">Once Per X Hours</option>
              </select>
            </div>
          </div>

          {formData.frequency === 'once_per_X_hours' && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">Hours</label>
              <input
                type="number"
                value={formData.frequencyHours}
                onChange={(e) => setFormData({ ...formData, frequencyHours: parseInt(e.target.value) || 24 })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-300 mb-1">Priority (Lower = Higher Priority)</label>
            <input
              type="number"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
              className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Start Time *</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">End Time *</label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                required
              />
            </div>
          </div>

          {/* Promo Code Field (for apply_offer action) */}
          {(formData.ctaAction === 'apply_offer' || formData.templateData?.ctaAction === 'apply_offer') && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Promo Code <span className="text-gray-500">(Optional - Auto-apply when user clicks CTA)</span>
              </label>
              <input
                type="text"
                value={formData.promoCode}
                onChange={(e) => setFormData({ ...formData, promoCode: e.target.value.toUpperCase().trim() })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                placeholder="e.g., SALE30, NEWUSER10"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the promo code that will be automatically applied when user clicks "Get Discount Now" button
              </p>
            </div>
          )}

          {/* Legacy CTA Fields - ONLY for legacy templates */}
          {formData.templateId !== 'OFFER_SPLIT_IMAGE_RIGHT_CONTENT' && (
            <>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Popup Type (Legacy)</label>
                <select
                  value={formData.popupType}
                  onChange={(e) => setFormData({ ...formData, popupType: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="full_screen">Full Screen</option>
                  <option value="center_modal">Center Modal</option>
                  <option value="bottom_sheet">Bottom Sheet</option>
                  <option value="toast">Toast</option>
                  <option value="exit_intent">Exit Intent</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Used for legacy templates only</p>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">CTA Action</label>
                <select
                  value={formData.ctaAction}
                  onChange={(e) => setFormData({ ...formData, ctaAction: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="apply_offer">Apply Offer</option>
                  <option value="buy_plan">Buy Plan</option>
                  <option value="open_payment">Open Payment</option>
                  <option value="redirect">Redirect URL</option>
                </select>
              </div>

              {formData.ctaAction === 'redirect' && (
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Custom URL</label>
                  <input
                    type="text"
                    value={formData.ctaUrl}
                    onChange={(e) => setFormData({ ...formData, ctaUrl: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    placeholder="https://..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-300 mb-1">CTA Text</label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                />
              </div>
            </>
          )}

          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={formData.isEnabled}
              onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
              className="rounded bg-gray-800 border-gray-700"
            />
            Enabled
          </label>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <button
              onClick={async () => {
                try {
                  setError(null);
                  setIsSaving(true);

                  // Validate required fields based on template
                  if (formData.templateId === 'OFFER_SPLIT_IMAGE_RIGHT_CONTENT') {
                    // Template-based validation
                    if (!formData.templateData?.mainHeading || !formData.templateData?.subHeading || !formData.templateData?.description) {
                      setError('Main heading, sub heading, and description are required for this template');
                      setIsSaving(false);
                      return;
                    }
                    // Check if image exists (file or URL)
                    if (!imageSource.file && !imageSource.url) {
                      setError('Banner image is required for this template');
                      setIsSaving(false);
                      return;
                    }
                  } else {
                    // Legacy validation
                    if (!formData.title || !formData.description) {
                      setError('Title and description are required');
                      setIsSaving(false);
                      return;
                    }
                  }

                  if (!formData.startTime || !formData.endTime) {
                    setError('Start time and end time are required');
                    setIsSaving(false);
                    return;
                  }

                  // Validate date range
                  const startDate = new Date(formData.startTime);
                  const endDate = new Date(formData.endTime);
                  if (startDate >= endDate) {
                    setError('Start time must be before end time');
                    setIsSaving(false);
                    return;
                  }

                  // Handle image upload if new file selected
                  let finalImageUrl: string | null = null;
                  
                  if (imageSource.file) {
                    setIsUploading(true);
                    try {
                      console.log('📤 Uploading image file:', imageSource.file.name, imageSource.file.size);
                      const uploadRes = await api.uploadImage(imageSource.file);
                      // API returns the URL string directly, not an object
                      finalImageUrl = typeof uploadRes === 'string' ? uploadRes : (uploadRes?.url || uploadRes);
                      console.log('✅ Image uploaded successfully:', finalImageUrl);
                      if (!finalImageUrl) {
                        throw new Error('Upload succeeded but no URL returned');
                      }
                    } catch (uploadError: any) {
                      console.error('❌ Image upload failed:', uploadError);
                      setError(`Image upload failed: ${uploadError.message || 'Unknown error'}`);
                      setIsUploading(false);
                      setIsSaving(false);
                      return;
                    }
                    setIsUploading(false);
                  } else {
                    // Use existing URL from imageSource
                    finalImageUrl = imageSource.url;
                    console.log('📋 Using existing image URL:', finalImageUrl);
                  }

                  // Auto-generate validity text if enabled
                  let validityText = formData.textContent.validityText;
                  if (formData.textContent.autoGenerateValidity && formData.endTime) {
                    const endDate = new Date(formData.endTime);
                    const day = endDate.getDate();
                    const month = endDate.toLocaleString('en-US', { month: 'short' });
                    validityText = `Limited-time offer — ends ${day}${getOrdinalSuffix(day)} ${month}`;
                  }

                  // Build payload - only include fields that are defined
                  const payload: any = {
                    templateId: formData.templateId,
                    targetUsers: formData.targetUsers,
                    frequency: formData.frequency,
                    priority: Number(formData.priority) || 0,
                    isEnabled: formData.isEnabled,
                    startTime: new Date(formData.startTime).toISOString(),
                    endTime: new Date(formData.endTime).toISOString()
                  };

                  // Add promo code if provided
                  if (formData.promoCode && formData.promoCode.trim()) {
                    payload.promoCode = formData.promoCode.toUpperCase().trim();
                  }

                  // Auto-generate validity text if enabled
                  let templateValidityText = formData.templateData?.validityText || '';
                  if (formData.templateData?.autoGenerateValidity && formData.endTime) {
                    const endDate = new Date(formData.endTime);
                    const day = endDate.getDate();
                    const month = endDate.toLocaleString('en-US', { month: 'short' });
                    templateValidityText = `Limited-time offer — ends ${day}${getOrdinalSuffix(day)} ${month}`;
                  }

                  // Build features list - add validity text as first item if provided
                  let featuresList = (formData.templateData?.features || []).filter((f: any) => f.text && f.isEnabled);
                  if (templateValidityText) {
                    featuresList = [
                      { text: templateValidityText, badgeType: 'unlimited', isEnabled: true, order: -1 },
                      ...featuresList.map((f: any, idx: number) => ({ 
                        ...f, 
                        order: idx,
                        badgeType: f.badgeType || 'unlimited' // Ensure badgeType is always set
                      }))
                    ];
                  } else {
                    // Ensure all features have badgeType
                    featuresList = featuresList.map((f: any, idx: number) => ({ 
                      ...f, 
                      order: idx,
                      badgeType: f.badgeType || 'unlimited' // Default to unlimited if not set
                    }));
                  }

                  // For OFFER_SPLIT_IMAGE_RIGHT_CONTENT template
                  if (formData.templateId === 'OFFER_SPLIT_IMAGE_RIGHT_CONTENT') {
                    payload.templateData = {
                      leftImageUrl: finalImageUrl,
                      leftOverlayText: formData.templateData?.leftOverlayText || '',
                      leftBrandText: formData.templateData?.leftBrandText || '',
                      leftMainText: formData.templateData?.leftMainText || '',
                      leftDescription: formData.templateData?.leftDescription || '',
                      leftPromoCode: formData.templateData?.leftPromoCode || '',
                      leftUrgencyText: formData.templateData?.leftUrgencyText || '',
                      leftCtaText: formData.templateData?.leftCtaText || '',
                      leftBackgroundColor: formData.templateData?.leftBackgroundColor || '#FFA500',
                      tags: (formData.templateData?.tags || []).filter((t: any) => t.text && t.isEnabled),
                      mainHeading: formData.templateData.mainHeading,
                      subHeading: formData.templateData.subHeading,
                      description: formData.templateData.description,
                      features: featuresList.map((f: any) => ({
                        text: f.text,
                        badgeType: f.badgeType || 'unlimited', // Ensure badgeType is always present
                        isEnabled: f.isEnabled !== false,
                        order: f.order || 0
                      })),
                      ctaText: formData.templateData.ctaText || 'Get Discount Now',
                      ctaAction: formData.templateData.ctaAction || 'apply_offer',
                      ctaUrl: formData.templateData?.ctaUrl || ''
                    };
                    // Also set legacy fields for backward compatibility (but NOT image fields)
                    payload.title = formData.templateData.mainHeading;
                    payload.description = formData.templateData.description;
                    payload.ctaText = formData.templateData.ctaText;
                    // DO NOT send templateImage - only templateData.leftImageUrl should be sent
                    // Backend will handle templateData.leftImageUrl correctly
                    payload.ctaAction = formData.templateData.ctaAction;
                    payload.ctaUrl = formData.templateData?.ctaUrl;
                    // DO NOT include popupType for template popups
                    console.log('📤 Payload for OFFER_SPLIT template:', {
                      templateDataLeftImageUrl: payload.templateData.leftImageUrl,
                      hasTemplateImage: 'templateImage' in payload,
                      hasImage: 'image' in payload,
                      hasImageInTemplateData: !!payload.templateData.leftImageUrl
                    });
                  } else {
                    // Legacy template - use textContent and legacy fields
                    payload.popupType = formData.popupType;
                    payload.title = formData.textContent.mainTitle || formData.title;
                    payload.description = formData.textContent.description || formData.description;
                    payload.ctaText = formData.textContent.ctaText || formData.ctaText;
                    payload.ctaAction = formData.ctaAction;
                    payload.ctaUrl = formData.ctaUrl;
                    // ONLY image field - NEVER send both image and templateImage
                    payload.image = finalImageUrl; // Can be null
                    payload.textContent = {
                      ...formData.textContent,
                      validityText: validityText
                    };
                  }

                  // DEBUG: Log final payload to confirm only one image field
                  console.log('FINAL IMAGE PAYLOAD', {
                    hasImage: 'image' in payload,
                    hasTemplateImage: 'templateImage' in payload,
                    imageValue: payload.image,
                    templateImageValue: payload.templateImage,
                    templateDataLeftImageUrl: payload.templateData?.leftImageUrl
                  });

                  // Include optional fields only if they have values
                  if (formData.ctaUrl) {
                    payload.ctaUrl = formData.ctaUrl;
                  }

                  if (formData.frequency === 'once_per_X_hours') {
                    payload.frequencyHours = Number(formData.frequencyHours) || 24;
                  }

                  // Call onSave with payload
                  await onSave(payload);
                  
                  // Success - modal will close from parent
                } catch (err: any) {
                  console.error('Error saving popup:', err);
                  setError(err.message || 'Failed to save popup');
                } finally {
                  setIsSaving(false);
                  setIsUploading(false);
                }
              }}
              disabled={isSaving || isUploading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving || isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isUploading ? 'Uploading...' : 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="inline" size={16} />
                  {isEditMode ? 'Update Popup' : 'Create Popup'}
                </>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isSaving || isUploading}
              className="px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for ordinal suffix
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

// Popup Preview Component
function PopupPreview({ textContent, popupType }: { textContent: any; popupType: string }) {
  const getTagColorClass = (color: string) => {
    const colors: Record<string, string> = {
      red: 'bg-red-100 text-red-700',
      orange: 'bg-orange-100 text-orange-700',
      green: 'bg-green-100 text-green-700',
      blue: 'bg-blue-100 text-blue-700',
      yellow: 'bg-yellow-100 text-yellow-700',
      purple: 'bg-purple-100 text-purple-700'
    };
    return colors[color] || colors.red;
  };

  const getBadgeClass = (badge: string) => {
    const badges: Record<string, string> = {
      unlimited: 'bg-green-100 text-green-700',
      pro: 'bg-blue-100 text-blue-700',
      premium: 'bg-purple-100 text-purple-700'
    };
    return badges[badge] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Brand Text */}
      {textContent.showBrandText && textContent.brandText && (
        <div className="text-xs font-semibold text-gray-500 mb-2">{textContent.brandText}</div>
      )}

      {/* Tags */}
      {textContent.tags && textContent.tags.filter((t: any) => t.isEnabled && t.text).length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {textContent.tags
            .filter((t: any) => t.isEnabled && t.text)
            .map((tag: any, idx: number) => (
              <span
                key={idx}
                className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-full ${getTagColorClass(tag.color)}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                {tag.text}
              </span>
            ))}
        </div>
      )}

      {/* Main Title */}
      {textContent.mainTitle && (
        <h2 className="text-3xl font-bold mb-2 text-gray-900">
          {textContent.mainTitle}
        </h2>
      )}

      {/* Sub Title */}
      {textContent.subTitle && (
        <p className="text-xl font-bold mb-2 text-gray-800">{textContent.subTitle}</p>
      )}

      {/* Description */}
      {textContent.description && (
        <p className="text-gray-600 mb-4 leading-relaxed">{textContent.description}</p>
      )}

      {/* Validity Text */}
      {textContent.validityText && (
        <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{textContent.validityText}</span>
        </div>
      )}

      {/* Features List */}
      {textContent.features && textContent.features.filter((f: any) => f.isEnabled && f.text).length > 0 && (
        <div className="space-y-2 mb-4">
          {textContent.features
            .filter((f: any) => f.isEnabled && f.text)
            .map((feature: any, idx: number) => (
              <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="flex-1">{feature.text}</span>
                {feature.badge && (
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getBadgeClass(feature.badge)}`}>
                    {feature.badge === 'custom' ? feature.badgeText : feature.badge}
                  </span>
                )}
                {feature.tooltip && (
                  <button className="w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 text-xs" title={feature.tooltip}>
                    <Info size={12} />
                  </button>
                )}
              </div>
            ))}
        </div>
      )}

      {/* CTA Button */}
      {textContent.ctaText && (
        <div>
          <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-bold">
            {textContent.ctaText}
          </button>
          {textContent.ctaSubText && (
            <p className="text-xs text-gray-500 text-center mt-2">{textContent.ctaSubText}</p>
          )}
        </div>
      )}

      {/* Coupon Text */}
      {textContent.showCoupon && textContent.couponText && (
        <p className="text-sm text-gray-600 text-center mt-3">{textContent.couponText}</p>
      )}
    </div>
  );
}

// Offer Modal Component
function OfferModal({ offer, onClose, onSave }: { offer: Offer | null; onClose: () => void; onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    name: offer?.name || '',
    offerType: offer?.offerType || 'festival',
    discountType: offer?.discountType || 'percentage',
    discountValue: offer?.discountValue || 0,
    applicablePacks: offer?.applicablePacks || [],
    autoApply: offer?.autoApply || false,
    usageLimit: offer?.usageLimit || '',
    perUserLimit: offer?.perUserLimit || 1,
    dailyLimit: offer?.dailyLimit || '',
    countdownTimer: offer?.countdownTimer !== false,
    startTime: offer?.startTime ? new Date(offer.startTime).toISOString().slice(0, 16) : '',
    endTime: offer?.endTime ? new Date(offer.endTime).toISOString().slice(0, 16) : '',
    targetUsers: offer?.targetUsers || 'all',
    isEnabled: offer?.isEnabled !== false
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">{offer ? 'Edit Offer' : 'Create Offer'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Offer Type *</label>
              <select
                value={formData.offerType}
                onChange={(e) => setFormData({ ...formData, offerType: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
              >
                <option value="festival">Festival</option>
                <option value="first_time_user">First Time User</option>
                <option value="flash_sale">Flash Sale</option>
                <option value="low_balance">Low Balance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Discount Type *</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
                <option value="bonus_points">Bonus Points</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Discount Value * ({formData.discountType === 'percentage' ? '%' : formData.discountType === 'flat' ? '₹' : 'Points'})
            </label>
            <input
              type="number"
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
              className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Usage Limit (Leave empty for unlimited)</label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : '' })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                placeholder="Unlimited"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Per User Limit</label>
              <input
                type="number"
                value={formData.perUserLimit}
                onChange={(e) => setFormData({ ...formData, perUserLimit: parseInt(e.target.value) || 1 })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Daily Limit (Leave empty for unlimited)</label>
            <input
              type="number"
              value={formData.dailyLimit}
              onChange={(e) => setFormData({ ...formData, dailyLimit: e.target.value ? parseInt(e.target.value) : '' })}
              className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
              placeholder="Unlimited"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Start Time *</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">End Time *</label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Target Users</label>
            <select
              value={formData.targetUsers}
              onChange={(e) => setFormData({ ...formData, targetUsers: e.target.value })}
              className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
            >
              <option value="all">All Users</option>
              <option value="new">New Users</option>
              <option value="low_balance">Low Balance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={formData.autoApply}
                onChange={(e) => setFormData({ ...formData, autoApply: e.target.checked })}
                className="rounded bg-gray-800 border-gray-700"
              />
              Auto-Apply
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={formData.countdownTimer}
                onChange={(e) => setFormData({ ...formData, countdownTimer: e.target.checked })}
                className="rounded bg-gray-800 border-gray-700"
              />
              Show Countdown Timer
            </label>

            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={formData.isEnabled}
                onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                className="rounded bg-gray-800 border-gray-700"
              />
              Enabled
            </label>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => onSave({
                ...formData,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit.toString()) : undefined,
                dailyLimit: formData.dailyLimit ? parseInt(formData.dailyLimit.toString()) : undefined,
                startTime: new Date(formData.startTime),
                endTime: new Date(formData.endTime)
              })}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-medium"
            >
              <Save className="inline mr-2" size={16} />
              Save
            </button>
            <button
              onClick={onClose}
              className="px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Promo Code Modal Component
function PromoCodeModal({ promoCode, onClose, onSave }: { promoCode: PromoCode | null; onClose: () => void; onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    code: promoCode?.code || '',
    discountType: promoCode?.discountType || 'percentage',
    discountValue: promoCode?.discountValue || 0,
    applicablePacks: promoCode?.applicablePacks || [],
    minPurchaseAmount: promoCode?.minPurchaseAmount || 0,
    usageLimit: promoCode?.usageLimit || '',
    perUserLimit: promoCode?.perUserLimit || 1,
    dailyLimit: promoCode?.dailyLimit || '',
    startTime: promoCode?.startTime ? new Date(promoCode.startTime).toISOString().slice(0, 16) : '',
    endTime: promoCode?.endTime ? new Date(promoCode.endTime).toISOString().slice(0, 16) : '',
    isEnabled: promoCode?.isEnabled !== false
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">{promoCode ? 'Edit Promo Code' : 'Create Promo Code'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Code * (Uppercase)</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm font-mono"
              placeholder="DIWALI50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Discount Type *</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat Amount</option>
                <option value="bonus_points">Bonus Points</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Discount Value * ({formData.discountType === 'percentage' ? '%' : formData.discountType === 'flat' ? '₹' : 'Points'})
              </label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Minimum Purchase Amount (₹)</label>
            <input
              type="number"
              value={formData.minPurchaseAmount}
              onChange={(e) => setFormData({ ...formData, minPurchaseAmount: parseFloat(e.target.value) || 0 })}
              className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Usage Limit</label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? parseInt(e.target.value) : '' })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                placeholder="Unlimited"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Per User Limit</label>
              <input
                type="number"
                value={formData.perUserLimit}
                onChange={(e) => setFormData({ ...formData, perUserLimit: parseInt(e.target.value) || 1 })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Daily Limit</label>
              <input
                type="number"
                value={formData.dailyLimit}
                onChange={(e) => setFormData({ ...formData, dailyLimit: e.target.value ? parseInt(e.target.value) : '' })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                placeholder="Unlimited"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Start Time *</label>
              <input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">End Time *</label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                required
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={formData.isEnabled}
              onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
              className="rounded bg-gray-800 border-gray-700"
            />
            Enabled
          </label>

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => onSave({
                ...formData,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit.toString()) : undefined,
                dailyLimit: formData.dailyLimit ? parseInt(formData.dailyLimit.toString()) : undefined,
                startTime: new Date(formData.startTime),
                endTime: new Date(formData.endTime)
              })}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-medium"
            >
              <Save className="inline mr-2" size={16} />
              Save
            </button>
            <button
              onClick={onClose}
              className="px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

