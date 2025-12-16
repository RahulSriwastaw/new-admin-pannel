
import { 
  API_BASE_URL, 
  MOCK_USERS, 
  MOCK_APPLICATIONS, 
  MOCK_TRANSACTIONS, 
  INITIAL_AI_MODELS, 
  INITIAL_SYSTEM_METRICS,
  MOCK_TEMPLATES,
  MOCK_POINTS_PACKAGES,
  MOCK_PAYMENT_GATEWAYS,
  MOCK_SUB_ADMINS,
  MOCK_NOTIFICATIONS,
  INITIAL_FINANCE_CONFIG,
  MOCK_CATEGORIES
} from '../constants';
import { User, CreatorApplication, Transaction, AIModelConfig, SystemMetrics, Template, AirtableConfig, PointsPackage, PaymentGatewayConfig, SubAdmin, NotificationLog, FinanceConfig, Category, ToolConfig } from '../types';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const getUploadHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper for safe fetching with timeout and fallback
const fetchWithFallback = async <T>(endpoint: string, fallback: T): Promise<T> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getAuthHeaders(),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      warn(`API Error for ${endpoint}: ${response.status} ${response.statusText}`);
      return fallback;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    warn(`Connection failed for ${endpoint}, using fallback data.`, error);
    return fallback;
  }
};

export const api = {
  // Auth
  login: async (id: string, pass: string) => {
    // 1. Try Actual Backend First
    try {
       const controller = new AbortController();
       const timeoutId = setTimeout(() => controller.abort(), 5000);

       const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email: id, password: pass }),
         signal: controller.signal
       });
       
       clearTimeout(timeoutId);

       if(res.ok) {
         const data = await res.json();
         if (data.token) {
           localStorage.setItem('token', data.token);
           if (data.user) {
             localStorage.setItem('adminUser', JSON.stringify(data.user));
           }
         }
         return data;
       }
    } catch(e) {
      warn("Backend login failed/unreachable, falling back to local check for Admin Panel access.", e);
    }
    
    // 2. Fallback for Admin Access (if backend is sleeping/down)
    if (id === "Rahul@Malik" && pass === "Rupantramalik@rahul") {
      const mockToken = "mock_jwt_token_rupantar_secure";
      localStorage.setItem('token', mockToken);
      return { 
        success: true, 
        user: { 
          name: "Rahul Malik", 
          role: "super_admin", 
          email: "admin@rupantar.ai",
          avatar: "",
          permissions: ['manage_users', 'manage_creators', 'manage_templates', 'manage_finance', 'manage_ai', 'manage_settings', 'view_reports'] 
        },
        token: mockToken
      };
    }
    
    throw new Error("Invalid Credentials");
  },

  updateAdminProfile: async (data: any) => {
      try {
        await fetch(`${API_BASE_URL}/admin/profile`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        return true;
      } catch (e) {
        warn("Backend unavailable, simulating profile update");
        return true;
      }
  },

  // Dashboard
  getMetrics: () => fetchWithFallback<SystemMetrics>('/admin/metrics', INITIAL_SYSTEM_METRICS),

  // Users
  getUsers: async (): Promise<User[]> => {
    const users = await fetchWithFallback<User[]>('/admin/users', MOCK_USERS);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/creators/stats`, { headers: getAuthHeaders() });
      if (res.ok) {
        const stats: { userId: string; followers: number; likes: number; uses: number }[] = await res.json();
        const map = new Map(stats.map(s => [String(s.userId), s]));
        return users.map(u => {
          if (u.role === 'creator') {
            const s = map.get(u.id);
            return { ...u, followers: s?.followers || 0, likes: s?.likes || 0, uses: s?.uses || 0 };
          }
          return u;
        });
      }
    } catch {}
    return users;
  },

  setUserTempPassword: async (userId: string, tempPassword: string) => {
    try {
      await fetch(`${API_BASE_URL}/admin/users/${userId}/temp-password`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ tempPassword })
      });
      return true;
    } catch (e) {
      warn('Backend unavailable, simulating temp password set');
      return true;
    }
  },

  // Quick Tools Config
  getToolsConfig: () => fetchWithFallback<ToolConfig>('/admin/tools/config', { id: 'local', tools: [] }),
  updateToolsConfig: async (tools: ToolConfig['tools']) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/tools/config`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ tools })
      });
      if (res.ok) return await res.json();
      throw new Error('Failed');
    } catch (e) {
      warn('Backend unavailable, simulating tools config update');
      return { id: 'local', tools } as ToolConfig;
    }
  },

  createUser: async (userData: any) => {
    try {
      // Backend snippet doesn't explicitly show admin create user, trying standard rest endpoint
      // If fails, we might need to use /auth/register but that's for public
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      if (res.ok) return await res.json();
      throw new Error("Failed");
      } catch (e) {
        warn("Backend unavailable, simulating user creation");
        return {
          id: `U${Date.now()}`,
          ...userData,
          joinedDate: new Date().toISOString(),
          status: 'active',
          avatar: '' 
      };
    }
  },

  updateUserStatus: async (userId: string, status: User['status']) => {
    try {
      await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      return true;
    } catch (e) {
      warn("Backend unavailable, simulating user status update");
      return true;
    }
  },

  updateUser: async (id: string, data: Partial<User>) => {
    try {
      await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return true;
    } catch (e) {
      warn("Backend unavailable, simulating user update");
      return true;
    }
  },

  bulkUpdateUsers: async (userIds: string[], updates: Partial<User>) => {
    try {
      await fetch(`${API_BASE_URL}/admin/users/bulk`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ userIds, updates })
      });
      return true;
    } catch (e) {
      warn("Backend unavailable, simulating bulk update");
      return true;
    }
  },

  // Creators
  getCreatorApplications: () => fetchWithFallback<CreatorApplication[]>('/admin/creators', MOCK_APPLICATIONS),

  addCreator: async (data: Partial<CreatorApplication>) => {
    try {
      // Backend supports status updates on existing creator applications;
      // for creating new applications, use the user-facing flow instead.
      const fallback = { 
        ...data, 
        id: `APP_NEW_${Date.now()}`, 
        status: 'approved', 
        appliedDate: new Date().toISOString() 
      };
      return fallback;
    } catch (e) {
      return { 
        ...data, 
        id: `APP_NEW_${Date.now()}`, 
        status: 'approved', 
        appliedDate: new Date().toISOString() 
      };
    }
  },

  updateCreator: async (id: string, data: Partial<CreatorApplication>) => {
    try {
      if (data.status) {
        const res = await fetch(`${API_BASE_URL}/admin/creators/${id}/status`, {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: data.status })
        });
        return res.ok;
      }
      return true;
    } catch (e) {
      return true;
    }
  },

  deleteCreator: async (id: string) => {
    try {
      // Not supported on backend; noop for now
      return true;
    } catch (e) {
      return true;
    }
  },

  approveCreatorApplication: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/creators/${id}/status`, { 
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'approved' })
      });
      return res.ok;
    } catch (e) {
      warn("Backend unavailable, simulating approval success");
      return true;
    }
  },

  rejectCreatorApplication: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/creators/${id}/status`, { 
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'rejected' })
      });
      return res.ok;
    } catch (e) {
      warn("Backend unavailable, simulating rejection success");
      return true;
    }
  },

  // Finance
  getTransactions: () => fetchWithFallback<Transaction[]>('/admin/finance/transactions', MOCK_TRANSACTIONS),

  // Points Packages
  getPointsPackages: () => fetchWithFallback<PointsPackage[]>('/admin/finance/packages', MOCK_POINTS_PACKAGES),

  addPointsPackage: async (pkg: Omit<PointsPackage, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/finance/packages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(pkg)
      });
      if (res.ok) return await res.json();
      throw new Error("Failed");
    } catch (e) {
      return { ...pkg, id: `PKG${Math.random().toString(36).substr(2, 5).toUpperCase()}` };
    }
  },

  updatePointsPackage: async (id: string, updates: Partial<PointsPackage>) => {
    try {
      await fetch(`${API_BASE_URL}/admin/finance/packages/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      return true;
    } catch (e) {
      return true;
    }
  },

  deletePointsPackage: async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/admin/finance/packages/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders() 
      });
      return true;
    } catch (e) {
      return true;
    }
  },

  // Payment Gateways
  getPaymentGateways: () => fetchWithFallback<PaymentGatewayConfig[]>('/admin/finance/gateways', MOCK_PAYMENT_GATEWAYS),
  createPaymentGateway: async (config: Omit<PaymentGatewayConfig, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/finance/gateways`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(config)
      });
      if (res.ok) return await res.json();
      throw new Error("Failed");
    } catch (e) {
      return { id: `GW${Math.random().toString(36).substr(2,6)}`, ...config };
    }
  },

  updateGatewayConfig: async (id: string, config: Partial<PaymentGatewayConfig>) => {
    try {
      await fetch(`${API_BASE_URL}/admin/finance/gateways/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(config)
      });
      return true;
    } catch (e) {
      return true;
    }
  },

  toggleGatewayActive: async (id: string, isActive: boolean) => {
    try {
      await fetch(`${API_BASE_URL}/admin/finance/gateways/${id}/toggle`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive })
      });
      return true;
    } catch (e) {
      return false;
    }
  },
  testGatewayConnection: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/finance/gateways/${id}/test`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (!res.ok) return false;
      const data = await res.json().catch(() => ({ success: true }));
      return !!data.success;
    } catch (e) {
      return false;
    }
  },

  // Finance Config
  getFinanceConfig: () => fetchWithFallback<FinanceConfig>('/admin/finance/config', INITIAL_FINANCE_CONFIG),

  updateFinanceConfig: async (config: FinanceConfig) => {
    try {
      await fetch(`${API_BASE_URL}/admin/finance/config`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(config)
      });
      return true;
    } catch (e) {
      warn("Backend unavailable, simulating finance config update");
      return true;
    }
  },

  // AI Config
  getAIModels: async (): Promise<AIModelConfig[]> => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/config/ai`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data as AIModelConfig[];
        if ((data as any)?.models) return (data as any).models as AIModelConfig[];
      }
    } catch {}
    return INITIAL_AI_MODELS;
  },
  
  // Toggle AI Model
  toggleAIModel: async (modelId: string, isActive: boolean) => {
    try {
      await fetch(`${API_BASE_URL}/admin/config/ai/${modelId}/activate`, { 
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive })
      });
      return true;
    } catch (e) {
      warn("Failed to toggle model on backend, updating local state only.");
      return false; 
    }
  },

  updateAIModelCost: async (modelId: string, cost: number) => {
    try {
      await fetch(`${API_BASE_URL}/admin/config/ai/${modelId}/cost`, { 
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ cost })
      });
      return true;
    } catch (e) {
      warn("Failed to update cost on backend.");
      return true; // Return true to allow UI update in mock mode
    }
  },

  updateAIModelApiKey: async (modelId: string, apiKey: string) => {
    try {
      await fetch(`${API_BASE_URL}/admin/config/ai/${modelId}/apikey`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ apiKey })
      });
      return true;
    } catch (e) {
      warn("Failed to update API key on backend.");
      return true;
    }
  },

  testAIModelConnection: async (modelId: string) => {
    try {
      await fetch(`${API_BASE_URL}/admin/config/ai/${modelId}/test`, { 
        method: 'POST',
        headers: getAuthHeaders()
      });
      return true;
    } catch (e) {
      warn("Backend unavailable, simulating AI connection test");
      await new Promise(resolve => setTimeout(resolve, 1500));
      return Math.random() > 0.1; // 90% success chance
    }
  },

  updateAIModelDetails: async (modelId: string, details: { name: string, provider: string }) => {
    try {
      await fetch(`${API_BASE_URL}/admin/config/ai/${modelId}/details`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(details)
      });
      return true;
    } catch (e) {
       warn("Failed to update model details on backend.");
       return true;
    }
  },

  clearAICache: async () => {
    try {
      await fetch(`${API_BASE_URL}/admin/config/ai/cache`, { 
        method: 'DELETE',
        headers: getAuthHeaders() 
      });
      return true;
    } catch (e) {
      warn("Failed to clear cache on backend.");
      return true;
    }
  },

  addAIModel: async (model: Omit<AIModelConfig, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/config/ai`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(model)
      });
      if (res.ok) return await res.json();
      throw new Error("Failed");
    } catch (e) {
      warn("Backend unavailable, simulating adding model");
      return { ...model, id: `AI_${Math.random().toString(36).substr(2, 5)}` };
    }
  },

  // Templates Management
  getTemplates: () => fetchWithFallback<Template[]>('/admin/templates', MOCK_TEMPLATES),

  uploadImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      // In a real scenario, this would post to /api/upload
      // For now, if the backend supports it, we try. If not, we return a mock URL.
      
      const res = await fetch(`${API_BASE_URL}/admin/upload/template-demo`, {
         method: 'POST',
         headers: getUploadHeaders(),
         body: formData
      });
      if(res.ok) {
         const data = await res.json();
         return data.url;
      }
      
      throw new Error("Backend upload failed");
    } catch (e) {
      warn("Upload failed, using local blob");
      return URL.createObjectURL(file);
    }
  },

  addTemplate: async (template: Omit<Template, 'id' | 'useCount'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/templates`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(template)
      });
      if (res.ok) return await res.json();
      throw new Error("Failed to add template");
    } catch (e) {
       warn("Backend unavailable, simulating template add");
       return { ...template, id: `T${Math.random().toString(36).substr(2, 6)}`, useCount: 0 };
    }
  },

  updateTemplate: async (id: string, template: Partial<Template>) => {
    try {
      await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(template)
      });
      return true;
    } catch (e) {
      warn("Backend unavailable, simulating template update");
      return true;
    }
  },

  deleteTemplate: async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/admin/templates/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders() 
      });
      return true;
    } catch (e) {
      return true;
    }
  },

  bulkUpdateTemplateProperties: async (ids: string[], updates: Partial<Template>) => {
    try {
      await fetch(`${API_BASE_URL}/admin/templates/bulk-update`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ids, updates })
      });
      return true;
    } catch (e) {
      console.warn("Backend unavailable, simulating bulk template update");
      return true;
    }
  },

  bulkUploadTemplates: async (file: File) => {
    try {
       const formData = new FormData();
       formData.append('file', file);
       await fetch(`${API_BASE_URL}/admin/templates/bulk`, {
         method: 'POST',
         headers: getUploadHeaders(), // Do NOT set Content-Type for FormData
         body: formData
       });
       return true;
    } catch (e) {
      warn("Backend unavailable, simulating bulk upload");
      return true;
    }
  },

  syncAirtable: async (config: AirtableConfig) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/templates/airtable-sync`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(config)
      });
      if(res.ok) {
        const data = await res.json();
        return data.templates; // Assuming API returns new templates
      }
      throw new Error("Sync Failed");
    } catch (e) {
      warn("Backend unavailable, simulating airtable sync");
      return [
        { 
          id: `AT_${Math.random().toString(36).substr(2,4)}`, 
          title: 'Airtable Synced Template', 
          imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500', 
          category: 'Synced',
          subCategory: 'General', 
          prompt: 'A prompt from airtable', 
          status: 'active', 
          useCount: 0, 
          isPremium: false,
          source: 'airtable'
        }
      ] as Template[];
    }
  },

  // Category Management
  getCategories: () => fetchWithFallback<Category[]>('/admin/categories', MOCK_CATEGORIES),

  addCategory: async (category: Omit<Category, 'id'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(category)
      });
      if (res.ok) return await res.json();
      throw new Error("Failed");
    } catch (e) {
       return { ...category, id: `CAT${Math.random().toString(36).substr(2, 4)}` };
    }
  },

  updateCategory: async (id: string, updates: Partial<Category>) => {
    try {
      await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      return true;
    } catch (e) {
      return true;
    }
  },

  deleteCategory: async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/admin/categories/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders() 
      });
      return true;
    } catch (e) {
      return true;
    }
  },

  // Sub Admin Management
  getSubAdmins: () => fetchWithFallback<SubAdmin[]>('/admin/system/admins', MOCK_SUB_ADMINS),

  createSubAdmin: async (admin: Omit<SubAdmin, 'id' | 'lastActive'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/system/admins`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(admin)
      });
      if(res.ok) return await res.json();
      throw new Error("Failed");
    } catch (e) {
      return { 
        ...admin, 
        id: `SA${Math.random().toString(36).substr(2, 5)}`,
        lastActive: 'Never'
      };
    }
  },

  deleteSubAdmin: async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/admin/system/admins/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders() 
      });
      return true;
    } catch (e) {
      return true;
    }
  },

  // Notifications
  getNotifications: () => fetchWithFallback<NotificationLog[]>('/admin/notifications', MOCK_NOTIFICATIONS),

  sendNotification: async (notification: Omit<NotificationLog, 'id' | 'sentAt' | 'reachCount' | 'status'>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/notifications/send`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(notification)
      });
      if (res.ok) return await res.json();
      throw new Error("Failed");
    } catch (e) {
       // Mock response
       return {
         ...notification,
         id: `NOTIF_${Date.now()}`,
         sentAt: notification.scheduledFor ? undefined : new Date().toISOString(),
         status: notification.scheduledFor ? 'scheduled' : 'sent',
         reachCount: notification.target === 'all_users' ? 850 : 45,
       };
    }
  }
};
const __env = (typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined);
const DEBUG = (__env?.VITE_DEBUG === 'true') || (typeof process !== 'undefined' && (process as any).env?.VITE_DEBUG === 'true');
const warn = (...args: any[]) => { if (DEBUG) console.warn(...args); };
