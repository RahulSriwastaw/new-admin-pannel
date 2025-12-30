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

      {/* Plan Modal - Simplified for now */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingPlan ? 'Edit Plan' : 'Add Plan'}
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
            <p className="text-gray-400 mb-4">
              Plan creation/editing form would go here. This is a placeholder for the full form implementation.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowPlanModal(false);
                  setEditingPlan(null);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Save logic would go here
                  setShowPlanModal(false);
                  setEditingPlan(null);
                  loadData();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

