import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, Edit2, Trash2, X, Save, DollarSign, Users, TrendingUp, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

interface SubscriptionPlan {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  tag?: string;
  tagColor?: string;
  pricing: {
    monthly: { price: number; originalPrice?: number; discount: number };
    quarterly: { price: number; originalPrice?: number; discount: number };
    yearly: { price: number; originalPrice?: number; discount: number };
  };
  features: {
    creditsPerMonth: number;
    imageGenerationsPerMonth: number;
    concurrentImageGenerations: number;
    concurrentVideoGenerations: number;
    allStylesAndModels: boolean;
    commercialTerms: string;
    imageVisibility: string;
    prioritySupport: boolean;
    queuePriority: string;
    unlimitedRealtimeGenerations?: boolean;
  };
  displayOrder: number;
  isActive: boolean;
}

interface UserSubscription {
  _id: string;
  userId: string;
  planId: string;
  planName: string;
  billingCycle: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  paymentGateway: string;
  startDate: string;
  endDate: string;
  nextBillingDate?: string;
  creditsAllocated: number;
  creditsUsed: number;
  autoRenew: boolean;
  user?: {
    name: string;
    email: string;
  };
}

export function SubscriptionManagement() {
  const [activeTab, setActiveTab] = useState<'plans' | 'subscriptions' | 'analytics'>('plans');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newPlan, setNewPlan] = useState<any>({
    name: '',
    slug: '',
    tagline: '',
    tag: '',
    tagColor: '#3B82F6',
    pricing: {
      monthly: { price: 0, originalPrice: 0, discount: 0 },
      quarterly: { price: 0, originalPrice: 0, discount: 0 },
      yearly: { price: 0, originalPrice: 0, discount: 0 }
    },
    features: {
      creditsPerMonth: 0,
      imageGenerationsPerMonth: 0,
      concurrentImageGenerations: 1,
      concurrentVideoGenerations: 0,
      allStylesAndModels: true,
      commercialTerms: 'General Commercial Terms',
      imageVisibility: 'Private',
      prioritySupport: false,
      queuePriority: 'Normal',
      unlimitedRealtimeGenerations: false
    },
    displayOrder: 0,
    isActive: true
  });

  useEffect(() => {
    loadData();
  }, [activeTab, filterStatus]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'plans') {
        const data = await api.getSubscriptionPlans();
        setPlans(data.plans || []);
      } else if (activeTab === 'subscriptions') {
        const data = await api.getSubscriptions(filterStatus !== 'all' ? filterStatus : undefined);
        setSubscriptions(data.subscriptions || []);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      await api.deleteSubscriptionPlan(id);
      loadData();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleSavePlan = async () => {
    try {
      if (editingPlan) {
        // Update existing plan
        await api.updateSubscriptionPlan(editingPlan._id, newPlan);
        alert('Plan updated successfully!');
      } else {
        // Create new plan
        if (!newPlan.name || !newPlan.slug) {
          alert('Please fill in name and slug');
          return;
        }
        await api.addSubscriptionPlan(newPlan);
        alert('Plan created successfully!');
      }
      setShowPlanModal(false);
      setEditingPlan(null);
      setNewPlan({
        name: '',
        slug: '',
        tagline: '',
        tag: '',
        tagColor: '#3B82F6',
        pricing: {
          monthly: { price: 0, originalPrice: 0, discount: 0 },
          quarterly: { price: 0, originalPrice: 0, discount: 0 },
          yearly: { price: 0, originalPrice: 0, discount: 0 }
        },
        features: {
          creditsPerMonth: 0,
          imageGenerationsPerMonth: 0,
          concurrentImageGenerations: 1,
          concurrentVideoGenerations: 0,
          allStylesAndModels: true,
          commercialTerms: 'General Commercial Terms',
          imageVisibility: 'Private',
          prioritySupport: false,
          queuePriority: 'Normal',
          unlimitedRealtimeGenerations: false
        },
        displayOrder: 0,
        isActive: true
      });
      loadData();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleTogglePlanStatus = async (plan: SubscriptionPlan) => {
    try {
      await api.updateSubscriptionPlan(plan._id, { isActive: !plan.isActive });
      loadData();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-500/10';
      case 'cancelled': return 'text-red-500 bg-red-500/10';
      case 'expired': return 'text-gray-500 bg-gray-500/10';
      case 'pending': return 'text-yellow-500 bg-yellow-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  // Analytics calculations
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  const totalRevenue = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => {
      const plan = plans.find(p => p._id === s.planId);
      if (plan) {
        return sum + (plan.pricing[s.billingCycle as keyof typeof plan.pricing]?.price || 0);
      }
      return sum;
    }, 0);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('plans')}
          className={`pb-4 px-4 font-medium transition-colors ${
            activeTab === 'plans'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Plans Management
        </button>
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`pb-4 px-4 font-medium transition-colors ${
            activeTab === 'subscriptions'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Subscriptions
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-4 px-4 font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Subscription Plans</h3>
            <button
              onClick={() => {
                setEditingPlan(null);
                setNewPlan({
                  name: '',
                  slug: '',
                  tagline: '',
                  tag: '',
                  tagColor: '#3B82F6',
                  pricing: {
                    monthly: { price: 0, originalPrice: 0, discount: 0 },
                    quarterly: { price: 0, originalPrice: 0, discount: 0 },
                    yearly: { price: 0, originalPrice: 0, discount: 0 }
                  },
                  features: {
                    creditsPerMonth: 0,
                    imageGenerationsPerMonth: 0,
                    concurrentImageGenerations: 1,
                    concurrentVideoGenerations: 0,
                    allStylesAndModels: true,
                    commercialTerms: 'General Commercial Terms',
                    imageVisibility: 'Private',
                    prioritySupport: false,
                    queuePriority: 'Normal',
                    unlimitedRealtimeGenerations: false
                  },
                  displayOrder: 0,
                  isActive: true
                });
                setShowPlanModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Plan
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-semibold">{plan.name}</h4>
                      <p className="text-sm text-gray-400">{plan.tagline}</p>
                    </div>
                    {plan.tag && (
                      <span className="px-2 py-1 text-xs rounded bg-blue-600 text-white">
                        {plan.tag}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-400">
                      Monthly: {formatPrice(plan.pricing.monthly.price)}
                    </div>
                    <div className="text-sm text-gray-400">
                      Quarterly: {formatPrice(plan.pricing.quarterly.price)}
                    </div>
                    <div className="text-sm text-gray-400">
                      Yearly: {formatPrice(plan.pricing.yearly.price)}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-sm">
                      <span className="text-gray-400">Credits:</span>{' '}
                      <span className="font-semibold">{plan.features.creditsPerMonth.toLocaleString()}/month</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-400">Concurrent:</span>{' '}
                      <span className="font-semibold">{plan.features.concurrentImageGenerations}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setEditingPlan(plan);
                        setNewPlan({
                          name: plan.name,
                          slug: plan.slug,
                          tagline: plan.tagline,
                          tag: plan.tag || '',
                          tagColor: plan.tagColor || '#3B82F6',
                          pricing: plan.pricing,
                          features: plan.features,
                          displayOrder: plan.displayOrder,
                          isActive: plan.isActive
                        });
                        setShowPlanModal(true);
                      }}
                      className="flex-1 px-3 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                    >
                      <Edit2 className="h-4 w-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => handleTogglePlanStatus(plan)}
                      className={`flex-1 px-3 py-2 rounded ${
                        plan.isActive
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {plan.isActive ? <CheckCircle className="h-4 w-4 mx-auto" /> : <XCircle className="h-4 w-4 mx-auto" />}
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan._id)}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">User Subscriptions</h3>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
              <option value="expired">Expired</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Plan</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Billing</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Credits</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Next Billing</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {subscriptions.map((sub) => (
                    <tr key={sub._id}>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">{sub.user?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-400">{sub.user?.email || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{sub.planName}</td>
                      <td className="px-4 py-3 capitalize">{sub.billingCycle}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(sub.status)}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <div>Allocated: {sub.creditsAllocated.toLocaleString()}</div>
                          <div className="text-gray-400">Used: {sub.creditsUsed.toLocaleString()}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {sub.nextBillingDate ? formatDate(sub.nextBillingDate) : 'N/A'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={async () => {
                            if (confirm('Cancel this subscription?')) {
                              try {
                                await api.cancelUserSubscription(sub._id);
                                loadData();
                              } catch (error: any) {
                                alert(`Error: ${error.message}`);
                              }
                            }
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                          disabled={sub.status !== 'active'}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-5 w-5 text-blue-500" />
                <h4 className="text-lg font-semibold">Active Subscriptions</h4>
              </div>
              <div className="text-3xl font-bold">{activeSubscriptions}</div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                <h4 className="text-lg font-semibold">Monthly Revenue</h4>
              </div>
              <div className="text-3xl font-bold">{formatPrice(totalRevenue)}</div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <h4 className="text-lg font-semibold">Total Subscriptions</h4>
              </div>
              <div className="text-3xl font-bold">{subscriptions.length}</div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h4 className="text-lg font-semibold mb-4">Revenue by Plan</h4>
            <div className="space-y-2">
              {plans.map((plan) => {
                const planSubs = subscriptions.filter(s => s.planId === plan._id && s.status === 'active');
                const revenue = planSubs.reduce((sum, s) => {
                  return sum + (plan.pricing[s.billingCycle as keyof typeof plan.pricing]?.price || 0);
                }, 0);
                return (
                  <div key={plan._id} className="flex justify-between items-center">
                    <span>{plan.name}</span>
                    <span className="font-semibold">{formatPrice(revenue)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Plan Modal */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingPlan ? 'Edit Subscription Plan' : 'Create New Subscription Plan'}
              </h3>
              <button
                onClick={() => {
                  setShowPlanModal(false);
                  setEditingPlan(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-4">Basic Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">Plan Name *</label>
                    <input
                      type="text"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="e.g., Standard"
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">Slug *</label>
                    <input
                      type="text"
                      value={newPlan.slug}
                      onChange={(e) => setNewPlan({ ...newPlan, slug: e.target.value })}
                      placeholder="e.g., standard"
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-gray-500 uppercase block mb-1">Tagline</label>
                    <input
                      type="text"
                      value={newPlan.tagline}
                      onChange={(e) => setNewPlan({ ...newPlan, tagline: e.target.value })}
                      placeholder="e.g., For rising creators to level up their game"
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">Tag (optional)</label>
                    <input
                      type="text"
                      value={newPlan.tag}
                      onChange={(e) => setNewPlan({ ...newPlan, tag: e.target.value })}
                      placeholder="e.g., MOST POPULAR"
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">Tag Color</label>
                    <input
                      type="color"
                      value={newPlan.tagColor}
                      onChange={(e) => setNewPlan({ ...newPlan, tagColor: e.target.value })}
                      className="w-full h-10 bg-gray-900 border border-gray-700 rounded"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">Display Order</label>
                    <input
                      type="number"
                      value={newPlan.displayOrder}
                      onChange={(e) => setNewPlan({ ...newPlan, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={newPlan.isActive}
                        onChange={(e) => setNewPlan({ ...newPlan, isActive: e.target.checked })}
                        className="rounded"
                      />
                      Active
                    </label>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-4">Pricing</h4>
                <div className="grid grid-cols-3 gap-4">
                  {['monthly', 'quarterly', 'yearly'].map((cycle) => (
                    <div key={cycle} className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase block">{cycle}</label>
                      <input
                        type="number"
                        placeholder="Price"
                        value={newPlan.pricing[cycle as keyof typeof newPlan.pricing].price || 0}
                        onChange={(e) => setNewPlan({
                          ...newPlan,
                          pricing: {
                            ...newPlan.pricing,
                            [cycle]: {
                              ...newPlan.pricing[cycle as keyof typeof newPlan.pricing],
                              price: parseFloat(e.target.value) || 0
                            }
                          }
                        })}
                        className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Original Price (optional)"
                        value={newPlan.pricing[cycle as keyof typeof newPlan.pricing].originalPrice || 0}
                        onChange={(e) => setNewPlan({
                          ...newPlan,
                          pricing: {
                            ...newPlan.pricing,
                            [cycle]: {
                              ...newPlan.pricing[cycle as keyof typeof newPlan.pricing],
                              originalPrice: parseFloat(e.target.value) || 0
                            }
                          }
                        })}
                        className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-4">Features</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">Credits Per Month *</label>
                    <input
                      type="number"
                      value={newPlan.features.creditsPerMonth}
                      onChange={(e) => setNewPlan({
                        ...newPlan,
                        features: { ...newPlan.features, creditsPerMonth: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">Image Generations/Month</label>
                    <input
                      type="number"
                      value={newPlan.features.imageGenerationsPerMonth}
                      onChange={(e) => setNewPlan({
                        ...newPlan,
                        features: { ...newPlan.features, imageGenerationsPerMonth: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">Concurrent Image Generations</label>
                    <input
                      type="number"
                      value={newPlan.features.concurrentImageGenerations}
                      onChange={(e) => setNewPlan({
                        ...newPlan,
                        features: { ...newPlan.features, concurrentImageGenerations: parseInt(e.target.value) || 1 }
                      })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">Concurrent Video Generations</label>
                    <input
                      type="number"
                      value={newPlan.features.concurrentVideoGenerations}
                      onChange={(e) => setNewPlan({
                        ...newPlan,
                        features: { ...newPlan.features, concurrentVideoGenerations: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">Commercial Terms</label>
                    <input
                      type="text"
                      value={newPlan.features.commercialTerms}
                      onChange={(e) => setNewPlan({
                        ...newPlan,
                        features: { ...newPlan.features, commercialTerms: e.target.value }
                      })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">Image Visibility</label>
                    <select
                      value={newPlan.features.imageVisibility}
                      onChange={(e) => setNewPlan({
                        ...newPlan,
                        features: { ...newPlan.features, imageVisibility: e.target.value }
                      })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    >
                      <option value="Private">Private</option>
                      <option value="Public">Public</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">Queue Priority</label>
                    <select
                      value={newPlan.features.queuePriority}
                      onChange={(e) => setNewPlan({
                        ...newPlan,
                        features: { ...newPlan.features, queuePriority: e.target.value }
                      })}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Highest">Highest</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={newPlan.features.allStylesAndModels}
                        onChange={(e) => setNewPlan({
                          ...newPlan,
                          features: { ...newPlan.features, allStylesAndModels: e.target.checked }
                        })}
                        className="rounded"
                      />
                      All Styles and Models
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={newPlan.features.prioritySupport}
                        onChange={(e) => setNewPlan({
                          ...newPlan,
                          features: { ...newPlan.features, prioritySupport: e.target.checked }
                        })}
                        className="rounded"
                      />
                      Priority Support
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={newPlan.features.unlimitedRealtimeGenerations}
                        onChange={(e) => setNewPlan({
                          ...newPlan,
                          features: { ...newPlan.features, unlimitedRealtimeGenerations: e.target.checked }
                        })}
                        className="rounded"
                      />
                      Unlimited Realtime Generations (Creator only)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSavePlan}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded text-sm font-medium"
              >
                <Save className="h-4 w-4 inline mr-2" />
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </button>
              {editingPlan && (
                <button
                  onClick={() => handleDeletePlan(editingPlan._id)}
                  className="px-4 bg-red-900/50 hover:bg-red-900 text-red-400 rounded text-sm"
                >
                  <Trash2 className="h-4 w-4 inline mr-1" />
                  Delete
                </button>
              )}
              <button
                onClick={() => {
                  setShowPlanModal(false);
                  setEditingPlan(null);
                }}
                className="px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

