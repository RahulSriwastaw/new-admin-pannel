import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, X, Save, Calendar, Target, Bell, Tag, Percent, DollarSign, Gift, Clock, Upload } from 'lucide-react';

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

export function MonetizationManagement() {
  const [activeSection, setActiveSection] = useState<'popups' | 'offers' | 'promo-codes'>('popups');
  const [popups, setPopups] = useState<Popup[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPopupModal, setShowPopupModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
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
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, type: 'popup' | 'offer' | 'promo-code') => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      if (type === 'popup') {
        await api.deletePopup(id);
      } else if (type === 'offer') {
        await api.deleteOffer(id);
      } else if (type === 'promo-code') {
        await api.deletePromoCode(id);
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
              } else {
                await api.createPopup(popupData);
              }
              setShowPopupModal(false);
              setEditingItem(null);
              loadData();
            } catch (error: any) {
              alert(`Error: ${error.message}`);
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
    ctaAction: popup?.ctaAction || 'buy_pack',
    ctaUrl: popup?.ctaUrl || '',
    popupType: popup?.popupType || 'center_modal',
    targetUsers: popup?.targetUsers || 'all',
    frequency: popup?.frequency || 'once_per_day',
    frequencyHours: popup?.frequencyHours || 24,
    priority: popup?.priority || 0,
    startTime: popup?.startTime ? new Date(popup.startTime).toISOString().slice(0, 16) : '',
    endTime: popup?.endTime ? new Date(popup.endTime).toISOString().slice(0, 16) : '',
    isEnabled: popup?.isEnabled !== false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(popup?.image || null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">{popup ? 'Edit Popup' : 'Create Popup'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>

        <div className="space-y-4">
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

          <div>
            <label className="block text-sm text-gray-300 mb-1">Image</label>
            
            {/* Image Preview */}
            {(imagePreview || imageFile) && (
              <div className="mb-3 relative">
                <img
                  src={imagePreview || (imageFile ? URL.createObjectURL(imageFile) : '')}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                    setFormData({ ...formData, image: '' });
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
                    {imageFile ? imageFile.name : 'Click to upload image'}
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
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                      setFormData({ ...formData, image: '' }); // Clear URL if file selected
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
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  if (e.target.value) {
                    setImageFile(null);
                    setImagePreview(e.target.value);
                  }
                }}
                className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                placeholder="Enter Cloudinary URL..."
                disabled={!!imageFile}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Popup Type</label>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm text-gray-300 mb-1">CTA Action</label>
            <select
              value={formData.ctaAction}
              onChange={(e) => setFormData({ ...formData, ctaAction: e.target.value })}
              className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
            >
              <option value="buy_pack">Buy Pack</option>
              <option value="watch_ad">Watch Ad</option>
              <option value="apply_offer">Apply Offer</option>
              <option value="custom_url">Custom URL</option>
            </select>
          </div>

          {formData.ctaAction === 'custom_url' && (
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
              onClick={async () => {
                try {
                  setIsUploading(true);
                  let finalImageUrl = formData.image;

                  // If a file is selected, upload it first
                  if (imageFile) {
                    finalImageUrl = await api.uploadImage(imageFile);
                  }

                  if (!finalImageUrl) {
                    alert('Please upload an image or provide a valid URL.');
                    setIsUploading(false);
                    return;
                  }

                  await onSave({
                    ...formData,
                    image: finalImageUrl,
                    startTime: formData.startTime ? new Date(formData.startTime).toISOString() : '',
                    endTime: formData.endTime ? new Date(formData.endTime).toISOString() : ''
                  });
                } catch (error: any) {
                  alert(`Upload failed: ${error.message}`);
                } finally {
                  setIsUploading(false);
                }
              }}
              disabled={isUploading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white py-2 rounded-lg font-medium"
            >
              <Save className="inline mr-2" size={16} />
              {isUploading ? 'Uploading...' : 'Save'}
            </button>
            <button
              onClick={onClose}
              disabled={isUploading}
              className="px-4 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 py-2 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
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

