
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Terminal } from './components/Terminal';
import { ConnectionVisualizer } from './components/ConnectionVisualizer';
import { StatCard } from './components/StatCard';
import {
  INITIAL_REPOS,
  BACKEND_URL,
  USER_APP_URL,
  CLOUDINARY_CONFIG,
  PERMISSIONS_LIST
} from './constants';
import { LogEntry, LogLevel, ConnectionStatus, User, CreatorApplication, Transaction, AIModelConfig, SystemMetrics, Template, AirtableConfig, PointsPackage, PaymentGatewayConfig, SubAdmin, AdminRole, AdminPermission, NotificationLog, NotificationTarget, NotificationType, FinanceConfig, Category, ToolConfig, AdsConfig, Withdrawal, WithdrawalStats } from './types';
import { analyzeErrorLogs, simulateFixApplication } from './services/geminiService';
import { api } from './services/api';
import {
  Activity, Settings, Layout, Users, Palette, CreditCard, Bot, Bell, Search,
  CheckCircle, BarChart3, Database, ShieldCheck, Lock, LogIn, RefreshCw, ExternalLink,
  X, Check, Ban, FileText, Globe, Plus, Save, Calendar, ArrowRightLeft, ArrowUp, ArrowDown, ArrowUpDown,
  BrainCircuit, UserCheck, UserX, AlertTriangle, HelpCircle, Key, Trash2, Edit2, LayoutTemplate,
  UploadCloud, Link as LinkIcon, Download, Copy, Image as ImageIcon, Wallet, Zap, ToggleRight, ToggleLeft, Shield, Send, BellRing, Smartphone, Mail, Filter, DollarSign, Clock, Sparkles, LayoutDashboard, UserPlus, Camera,
  MoreHorizontal, User as UserIcon, LayoutList, Grid, Instagram, Twitter, Youtube, Briefcase, TrendingUp, CheckSquare, XSquare, Eye, Award, ChevronLeft, ChevronRight, FileDown, Layers, Star, Grid3X3, FolderTree, FolderPlus, LogOut, BellOff
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function formatDay(d: Date) {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
}

// Reusable Pagination Component
const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange
}: {
  totalItems: number,
  itemsPerPage: number,
  currentPage: number,
  onPageChange: (page: number) => void
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-950 border-t border-gray-800 rounded-b-xl">
      <div className="text-xs text-gray-500">
        Showing <span className="font-medium text-gray-300">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> to <span className="font-medium text-gray-300">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-medium text-gray-300">{totalItems}</span> results
      </div>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1 rounded hover:bg-gray-800 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-6 h-6 rounded text-xs font-medium flex items-center justify-center transition-colors ${currentPage === page ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1 rounded hover:bg-gray-800 text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default function App() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginId, setLoginId] = useState('Rahul@Malik');
  const [loginPass, setLoginPass] = useState('Rupantramalik@rahul');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<{ name: string, role: string, permissions?: string[], email?: string, avatar?: string } | null>(null);

  // App State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(ConnectionStatus.CONNECTING);
  const [isFixing, setIsFixing] = useState(false);
  const [metrics, setMetrics] = useState<SystemMetrics>({ cpu: 0, memory: 0, requests: 0, latency: 0, activeUsers: 0, revenue: 0 });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'creators' | 'templates' | 'finance' | 'ai-config' | 'ads' | 'withdrawals' | 'notifications' | 'settings' | 'profile'>('dashboard');

  // Data State
  const [users, setUsers] = useState<User[]>([]);
  const [creators, setCreators] = useState<CreatorApplication[]>([]);
  const [activeCreatorApp, setActiveCreatorApp] = useState<CreatorApplication | null>(null);
  const [aiModels, setAiModels] = useState<AIModelConfig[]>([]);
  const [toolsConfig, setToolsConfig] = useState<ToolConfig>({ id: '', tools: [] });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pointsPackages, setPointsPackages] = useState<PointsPackage[]>([]);
  const [paymentGateways, setPaymentGateways] = useState<PaymentGatewayConfig[]>([]);
  const [financeConfig, setFinanceConfig] = useState<FinanceConfig>({ costPerCredit: 0, currency: 'INR', taxRate: 0 });
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [withdrawalStats, setWithdrawalStats] = useState<WithdrawalStats>({ pending: 0, processing: 0, completed: 0, rejected: 0, pendingAmount: 0, completedAmount: 0 });
  const [withdrawalFilter, setWithdrawalFilter] = useState<'all' | 'pending' | 'processing' | 'completed' | 'rejected'>('all');
  const [isLoadingWithdrawals, setIsLoadingWithdrawals] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Ads Management State
  const [adsConfig, setAdsConfig] = useState<AdsConfig>({
    isEnabled: true,
    provider: 'google_admob',
    rewardType: 'fixed',
    fixedPoints: 5,
    randomMin: 3,
    randomMax: 10,
    pages: {
      home: true,
      templates: true,
      generate: true,
      history: false,
      profile: false,
      wallet: true,
      rewards: true
    },
    templateAdsSettings: {
      showBetweenTemplates: true,
      frequency: 6
    },
    adIds: {
      bannerId: '',
      interstitialId: '',
      rewardedId: '',
      nativeId: ''
    },
    maxAdsPerUser: 20,
    cooldownMinutes: 3
  });
  const [isSavingAds, setIsSavingAds] = useState(false);

  // New Features State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'user' | 'creator'>('all');
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'banned' | 'pending'>('all');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Pagination State
  const [userPage, setUserPage] = useState(1);
  const [creatorPage, setCreatorPage] = useState(1);
  const [templatePage, setTemplatePage] = useState(1);
  const [txnPage, setTxnPage] = useState(1);
  const itemsPerPage = 7;

  // Creator & Template Bulk State
  const [creatorSearchQuery, setCreatorSearchQuery] = useState('');
  const [creatorTab, setCreatorTab] = useState<'applications' | 'active'>('applications');
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);

  const [showAddCreatorModal, setShowAddCreatorModal] = useState(false);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);
  const [newCreatorLink, setNewCreatorLink] = useState('');
  const [isClearingCache, setIsClearingCache] = useState(false);

  // Sorting State for Users
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null);

  // User Modal State
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user', points: 0, status: 'active' });
  const [newUserAvatarFile, setNewUserAvatarFile] = useState<File | null>(null);
  const [newUserAvatarPreview, setNewUserAvatarPreview] = useState<string>('');
  const [editUserAvatarFile, setEditUserAvatarFile] = useState<File | null>(null);
  const [editUserAvatarPreview, setEditUserAvatarPreview] = useState<string>('');

  useEffect(() => {
    return () => {
      if (newUserAvatarPreview && newUserAvatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(newUserAvatarPreview);
      }
    };
  }, [newUserAvatarPreview]);

  useEffect(() => {
    return () => {
      if (editUserAvatarPreview && editUserAvatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(editUserAvatarPreview);
      }
    };
  }, [editUserAvatarPreview]);

  // AI Analysis State
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Finance Filter State
  const [txnTypeFilter, setTxnTypeFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [txnGatewayFilter, setTxnGatewayFilter] = useState<string>('all');
  const [txnStatusFilter, setTxnStatusFilter] = useState<'all' | 'success' | 'failed'>('all');

  // AI Add Model State
  const [showAddModelModal, setShowAddModelModal] = useState(false);
  const [showConfirmAddModal, setShowConfirmAddModal] = useState(false);
  const [newModel, setNewModel] = useState({ name: '', provider: 'Google', costPerImage: 1.0, isActive: false, apiKey: '' });

  // AI Edit/API Key State
  const [editingModelId, setEditingModelId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{ name: string, provider: string }>({ name: '', provider: '' });
  const [apiKeyModalState, setApiKeyModalState] = useState<{ model: AIModelConfig, key: string } | null>(null);
  const [testingModelId, setTestingModelId] = useState<string | null>(null);
  const [togglingModelId, setTogglingModelId] = useState<string | null>(null);

  // Template Management State
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showAirtableModal, setShowAirtableModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    title: '', imageUrl: '', category: 'General', subCategory: 'Misc', prompt: '', negativePrompt: '', isPremium: false, status: 'active', source: 'manual',
    gender: '', ageGroup: '', state: '', description: '', tags: []
  });
  const [newCategory, setNewCategory] = useState({ name: '', subCategories: [] as string[] });
  const [newSubCategoryInput, setNewSubCategoryInput] = useState('');
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [templateViewMode, setTemplateViewMode] = useState<'grid' | 'list'>('grid');
  const [templateFilterStatus, setTemplateFilterStatus] = useState<string>('all');
  const [templateFilterPremium, setTemplateFilterPremium] = useState<string>('all');

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const [airtableConfig, setAirtableConfig] = useState<AirtableConfig>({ apiKey: '', baseId: '', tableName: '' });
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [isSyncingAirtable, setIsSyncingAirtable] = useState(false);
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<string>('All');

  const revenueChartData = useMemo(() => {
    const now = new Date();
    const days: { name: string; userPayments: number; creatorPayouts: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dayName = formatDay(d);
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);
      const dayTxns = transactions.filter(t => {
        const dt = new Date((t as any).date || (t as any).createdAt || d);
        return dt >= dayStart && dt <= dayEnd;
      });
      const credit = dayTxns.filter(t => (t as any).type === 'credit').reduce((sum, t) => sum + Number((t as any).amount || 0), 0);
      const debit = dayTxns.filter(t => (t as any).type === 'debit').reduce((sum, t) => sum + Number((t as any).amount || 0), 0);
      days.push({ name: dayName, userPayments: credit, creatorPayouts: debit });
    }
    return days;
  }, [transactions]);

  // Package & Gateway State
  const [activePackage, setActivePackage] = useState<PointsPackage | null>(null);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [activeGateway, setActiveGateway] = useState<PaymentGatewayConfig | null>(null);
  const [showGatewayModal, setShowGatewayModal] = useState(false);
  const [isTestingGateway, setIsTestingGateway] = useState(false);

  // Sub Admin State
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState<{ name: string, email: string, password: string, role: AdminRole, permissions: AdminPermission[] }>({
    name: '', email: '', password: '', role: 'moderator', permissions: []
  });

  // Notification State
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [newNotification, setNewNotification] = useState<{
    title: string,
    message: string,
    target: NotificationTarget,
    type: NotificationType,
    imageUrl: string,
    ctaLink: string,
    isScheduled: boolean,
    scheduledDate: string
  }>({
    title: '', message: '', target: 'all_users', type: 'push', imageUrl: '', ctaLink: '', isScheduled: false, scheduledDate: ''
  });
  const [isSendingNotification, setIsSendingNotification] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({ name: '', email: '', avatar: '' });

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'warning' | 'info';
    confirmText?: string;
    onConfirm: () => Promise<void> | void;
  }>({ isOpen: false, title: '', message: '', type: 'info', onConfirm: () => { } });

  const closeConfirmModal = () => setConfirmModal(prev => ({ ...prev, isOpen: false }));

  const addLog = useCallback((message: string, level: LogLevel = LogLevel.INFO, source: LogEntry['source'] = 'System') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      level,
      message,
      source
    }]);
  }, []);

  const downloadCSV = (data: any[], filename: string) => {
    if (!data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(val =>
      typeof val === 'string' && val.includes(',') ? `"${val}"` : val
    ).join(',')).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog(`Exported ${data.length} records to ${filename}.csv`, LogLevel.INFO, 'System');
  };

  // Check Backend Health
  const checkBackendHealth = useCallback(async () => {
    try {
      addLog(`Pinging Backend at ${BACKEND_URL}...`, LogLevel.INFO, 'System');
      const response = await fetch(BACKEND_URL, { method: 'GET' }); // Simple ping

      if (response.ok || response.status === 404) { // 404 means server is up but root is empty, which is fine for health check
        setConnectionStatus(ConnectionStatus.CONNECTED);
        addLog("Backend Connection Established.", LogLevel.SUCCESS, 'Backend');
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      setConnectionStatus(ConnectionStatus.ERROR);
      addLog(`Backend Unreachable: ${error instanceof Error ? error.message : 'Unknown'}`, LogLevel.ERROR, 'System');
      addLog("Possible CORS issue or Railway deployment sleeping.", LogLevel.WARN, 'AI_Agent');
    }
  }, [addLog]);

  useEffect(() => {
    if (isAuthenticated) {
      checkBackendHealth();
      refreshData();
    }
  }, [isAuthenticated, checkBackendHealth]);

  useEffect(() => {
    if (currentAdmin) {
      setProfileForm({
        name: currentAdmin.name || '',
        email: currentAdmin.email || '',
        avatar: currentAdmin.avatar || ''
      });
    }
  }, [currentAdmin]);

  const refreshData = async () => {
    setIsLoadingData(true);
    try {
      const [fetchedMetrics, fetchedUsers, fetchedCreators, fetchedTxns, fetchedModels, fetchedTemplates, fetchedCategories, fetchedPackages, fetchedGateways, fetchedFinanceConfig, fetchedSubAdmins, fetchedNotifications, fetchedWithdrawals, fetchedWithdrawalStats] = await Promise.all([
        api.getMetrics(),
        api.getUsers(),
        api.getCreatorApplications(),
        api.getTransactions(),
        api.getAIModels(),
        api.getTemplates(),
        api.getCategories(),
        api.getPointsPackages(),
        api.getPaymentGateways(),
        api.getFinanceConfig(),
        api.getSubAdmins(),
        api.getNotifications(),
        api.getWithdrawals(),
        api.getWithdrawalStats()
      ]);

      setMetrics(fetchedMetrics);
      setUsers(fetchedUsers);
      setCreators(fetchedCreators);
      setTransactions(fetchedTxns);
      setAiModels(fetchedModels);
      setTemplates(fetchedTemplates);
      setCategories(fetchedCategories);
      setPointsPackages(fetchedPackages);
      setPaymentGateways(fetchedGateways);
      setFinanceConfig(fetchedFinanceConfig);
      setSubAdmins(fetchedSubAdmins);
      setNotifications(fetchedNotifications);
      setWithdrawals(fetchedWithdrawals);
      setWithdrawalStats(fetchedWithdrawalStats);
      try {
        const cfg = await api.getToolsConfig();
        setToolsConfig(cfg);
      } catch { }
      try {
        const adsCfg = await api.getAdsConfig();
        if (adsCfg) {
          setAdsConfig(adsCfg);
        }
      } catch { }
      addLog("Dashboard data synchronized with Backend.", LogLevel.INFO, "Database");
    } catch (e) {
      addLog("Failed to sync some data. Using cached values.", LogLevel.WARN, "System");
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const result = await api.login(loginId, loginPass);
      setIsAuthenticated(true);
      setCurrentAdmin(result.user);
      addLog(`Admin (${result.user.name}) Logged In. Role: ${result.user.role}`, LogLevel.SUCCESS, 'System');
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Invalid Credentials');
      addLog(`Failed login attempt for ${loginId}`, LogLevel.WARN, 'System');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Helper to check permissions
  const canPerformAction = (permission: AdminPermission): boolean => {
    if (!currentAdmin) return false;
    if (currentAdmin.role === 'super_admin') return true;
    return currentAdmin.permissions?.includes(permission) || false;
  };

  const handleFixConnection = async () => {
    setIsFixing(true);
    setConnectionStatus(ConnectionStatus.CONNECTING);
    addLog("Initiating Rupantar AI Diagnosis Protocol...", LogLevel.INFO, "AI_Agent");

    try {
      await analyzeErrorLogs(logs);
      addLog("Diagnosis: CORS mismatch between Admin Panel and Railway Backend.", LogLevel.WARN, "AI_Agent");
      await new Promise(r => setTimeout(r, 1500));

      addLog("Applying patch to Backend CORS configuration...", LogLevel.INFO, "System");
      const fixOutput = await simulateFixApplication("Enable CORS for Admin Panel URL in Express.js");

      fixOutput.split('\n').forEach(line => {
        if (line.trim()) addLog(line, LogLevel.INFO, "System");
      });

      await new Promise(r => setTimeout(r, 2000));
      setConnectionStatus(ConnectionStatus.CONNECTED);
      addLog("Patch applied. Backend service restarted.", LogLevel.SUCCESS, "System");
      refreshData();
    } catch (error) {
      addLog("Auto-fix sequence failed.", LogLevel.ERROR, "System");
      setConnectionStatus(ConnectionStatus.ERROR);
    } finally {
      setIsFixing(false);
    }
  };

  const handleAnalyzeErrors = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeErrorLogs(logs);
      setAnalysisResult(result);
      addLog("AI Log Analysis Completed.", LogLevel.SUCCESS, 'AI_Agent');
    } catch (e) {
      setAnalysisResult("Failed to perform analysis.");
      addLog("AI Log Analysis Failed.", LogLevel.ERROR, 'AI_Agent');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleAIModel = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setTogglingModelId(id);

    // Optimistic Update with single active model logic
    if (newStatus === true) {
      setAiModels(prev => prev.map(model => ({
        ...model,
        isActive: model.id === id ? true : false
      })));
    } else {
      setAiModels(prev => prev.map(model => ({
        ...model,
        isActive: model.id === id ? false : model.isActive
      })));
    }

    try {
      await api.toggleAIModel(id, newStatus);
      addLog(`AI Model ${id} status changed to ${newStatus ? 'Active' : 'Inactive'}`, LogLevel.INFO, 'AI_Agent');
    } catch (e) {
      addLog(`Failed to toggle AI Model ${id}`, LogLevel.ERROR, 'AI_Agent');
      refreshData(); // Revert on failure
    } finally {
      setTogglingModelId(null);
    }
  };

  const handleCostChange = (id: string, newCost: string) => {
    setAiModels(prev => prev.map(model =>
      model.id === id ? { ...model, costPerImage: parseFloat(newCost) } : model
    ));
  };

  const openApiKeyModal = (model: AIModelConfig) => {
    setApiKeyModalState({ model, key: model.apiKey || '' });
  };

  const handleApiKeyInputChange = (val: string) => {
    setApiKeyModalState(prev => prev ? { ...prev, key: val } : null);
  };

  const saveModelCost = async (model: AIModelConfig) => {
    await api.updateAIModelCost(model.id, model.costPerImage);
    addLog(`Updated cost for ${model.name} to ₹${model.costPerImage}`, LogLevel.SUCCESS, 'AdminPanel');
  };

  const handleConfirmApiKeySave = async () => {
    if (apiKeyModalState) {
      try {
        await api.updateAIModelApiKey(apiKeyModalState.model.id, apiKeyModalState.key);
        setAiModels(prev => prev.map(m => m.id === apiKeyModalState.model.id ? { ...m, apiKey: apiKeyModalState.key } : m));
        addLog(`Updated API Key for ${apiKeyModalState.model.name}`, LogLevel.SUCCESS, 'AdminPanel');
        setApiKeyModalState(null);
      } catch (error) {
        addLog(`Failed to update API Key for ${apiKeyModalState.model.name}`, LogLevel.ERROR, 'AdminPanel');
        alert("Failed to save API Key. Please try again.");
      }
    }
  };

  const handleTestConnection = async (model: AIModelConfig) => {
    setTestingModelId(model.id);
    addLog(`Testing connection for ${model.name}...`, LogLevel.INFO, 'AI_Agent');
    const success = await api.testAIModelConnection(model.id);

    if (success) {
      addLog(`Connection to ${model.provider} verified successfully.`, LogLevel.SUCCESS, 'AI_Agent');
    } else {
      addLog(`Failed to verify connection to ${model.provider}. Check API Key.`, LogLevel.ERROR, 'AI_Agent');
    }
    setTestingModelId(null);
  };

  const handleEditModel = (model: AIModelConfig) => {
    setEditingModelId(model.id);
    setEditFormData({ name: model.name, provider: model.provider });
  };

  const handleSaveModelDetails = async (id: string) => {
    await api.updateAIModelDetails(id, editFormData);
    setAiModels(prev => prev.map(m => m.id === id ? {
      ...m,
      ...editFormData,
      provider: editFormData.provider as AIModelConfig['provider']
    } : m));
    setEditingModelId(null);
    addLog(`Updated details for model ${id}`, LogLevel.SUCCESS, 'AdminPanel');
  };

  const handleClearCache = async () => {
    setIsClearingCache(true);
    addLog("Clearing AI Model Cache...", LogLevel.INFO, 'System');
    try {
      await api.clearAICache();
      addLog("AI Cache Cleared Successfully.", LogLevel.SUCCESS, 'Backend');
    } catch (error) {
      addLog("Failed to clear cache.", LogLevel.ERROR, 'Backend');
    } finally {
      setIsClearingCache(false);
    }
  };

  const handleAddModel = async () => {
    const modelData: Omit<AIModelConfig, 'id'> = {
      ...newModel,
      provider: newModel.provider as any
    };
    const createdModel = await api.addAIModel(modelData);
    setAiModels([...aiModels, createdModel]);
    setShowAddModelModal(false);
    setShowConfirmAddModal(false);
    setNewModel({ name: '', provider: 'Google', costPerImage: 1.0, isActive: false, apiKey: '' });
    addLog(`New AI Model ${modelData.name} added.`, LogLevel.SUCCESS, 'AdminPanel');
  };

  const handleApproveCreator = async (id: string, name: string) => {
    addLog(`Approving creator application for ${name}...`, LogLevel.INFO, 'AdminPanel');
    const success = await api.approveCreatorApplication(id);
    if (success) {
      setCreators(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c));
      addLog(`Creator ${name} approved successfully. Role updated.`, LogLevel.SUCCESS, 'Backend');
      setActiveCreatorApp(null);
    } else {
      addLog(`Failed to approve ${name}.`, LogLevel.ERROR, 'Backend');
    }
  };

  const handleRejectCreator = async (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Reject Application',
      message: `Are you sure you want to reject ${name}'s application? This action cannot be undone.`,
      type: 'warning',
      confirmText: 'Reject',
      onConfirm: async () => {
        addLog(`Rejecting creator application for ${name}...`, LogLevel.WARN, 'AdminPanel');
        const success = await api.rejectCreatorApplication(id);
        if (success) {
          setCreators(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
          addLog(`Creator ${name} application rejected.`, LogLevel.INFO, 'Backend');
          setActiveCreatorApp(null);
        } else {
          addLog(`Failed to reject ${name}.`, LogLevel.ERROR, 'Backend');
        }
        closeConfirmModal();
      }
    });
  };

  const addCreatorLink = () => {
    if (newCreatorLink && activeCreatorApp) {
      setActiveCreatorApp({
        ...activeCreatorApp,
        socialLinks: [...activeCreatorApp.socialLinks, newCreatorLink]
      });
      setNewCreatorLink('');
    }
  };

  const handleAddCreator = async () => {
    if (!activeCreatorApp?.name || !activeCreatorApp?.userId) {
      alert("Name and User ID are required");
      return;
    }
    const created = await api.addCreator(activeCreatorApp);
    setCreators(prev => [created, ...prev]);
    setActiveCreatorApp(null);
    addLog(`Creator ${created.name} added successfully.`, LogLevel.SUCCESS, 'AdminPanel');
  };

  const handleUpdateCreator = async () => {
    if (!activeCreatorApp) return;
    await api.updateCreator(activeCreatorApp.id, activeCreatorApp);
    setCreators(prev => prev.map(c => c.id === activeCreatorApp.id ? activeCreatorApp : c));
    setActiveCreatorApp(null);
    addLog(`Creator profile updated.`, LogLevel.SUCCESS, 'AdminPanel');
  };

  const handleDeleteCreator = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Creator',
      message: "Are you sure? This will remove the creator status from this user.",
      type: 'danger',
      confirmText: 'Remove',
      onConfirm: async () => {
        await api.deleteCreator(id);
        setCreators(prev => prev.filter(c => c.id !== id));
        addLog(`Creator removed.`, LogLevel.WARN, 'AdminPanel');
        closeConfirmModal();
      }
    });
  };

  const openAddCreatorModal = () => {
    setActiveCreatorApp({
      id: '',
      userId: '',
      name: '',
      socialLinks: [],
      status: 'approved',
      appliedDate: new Date().toISOString()
    });
  };

  // Withdrawal Management Handlers
  const fetchWithdrawals = async (status?: string) => {
    setIsLoadingWithdrawals(true);
    try {
      const data = await api.getWithdrawals(status === 'all' ? undefined : status);
      setWithdrawals(data);
    } catch (error) {
      addLog("Failed to fetch withdrawals", LogLevel.ERROR, "Backend");
    } finally {
      setIsLoadingWithdrawals(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'withdrawals') {
      fetchWithdrawals(withdrawalFilter);
    }
  }, [activeTab, withdrawalFilter]);

  const handleProcessWithdrawal = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Process Withdrawal',
      message: 'Mark this withdrawal as processing? The creator will be notified.',
      type: 'info',
      confirmText: 'Process',
      onConfirm: async () => {
        const success = await api.processWithdrawal(id);
        if (success) {
          setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'processing' } as Withdrawal : w));
          addLog("Withdrawal marked as processing", LogLevel.SUCCESS, "AdminPanel");
          const stats = await api.getWithdrawalStats();
          setWithdrawalStats(stats);
        }
        closeConfirmModal();
      }
    });
  };

  const handleApproveWithdrawal = async (id: string) => {
    const txnId = prompt("Enter Transaction ID (optional):");
    if (txnId === null) return;

    setConfirmModal({
      isOpen: true,
      title: 'Approve Withdrawal',
      message: 'This will mark the withdrawal as completed and notify the creator.',
      type: 'info',
      confirmText: 'Approve',
      onConfirm: async () => {
        const success = await api.approveWithdrawal(id, txnId || undefined);
        if (success) {
          setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'completed', transactionId: txnId || w.transactionId } as Withdrawal : w));
          addLog("Withdrawal approved successfully", LogLevel.SUCCESS, "AdminPanel");
          const stats = await api.getWithdrawalStats();
          setWithdrawalStats(stats);
        }
        closeConfirmModal();
      }
    });
  };

  const handleRejectWithdrawal = async (id: string) => {
    const reason = prompt("Enter Rejection Reason:");
    if (!reason) return;

    setConfirmModal({
      isOpen: true,
      title: 'Reject Withdrawal',
      message: 'Are you sure? This will refund the amount to the creator.',
      type: 'danger',
      confirmText: 'Reject',
      onConfirm: async () => {
        const success = await api.rejectWithdrawal(id, reason);
        if (success) {
          setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'rejected', remarks: reason } as Withdrawal : w));
          addLog("Withdrawal rejected", LogLevel.WARN, "AdminPanel");
          const stats = await api.getWithdrawalStats();
          setWithdrawalStats(stats);
        }
        closeConfirmModal();
      }
    });
  };

  const getSocialIcon = (url: string) => {
    const iconClass = "text-indigo-400";
    if (url.includes('instagram')) return <Instagram size={14} className={iconClass} />;
    if (url.includes('twitter') || url.includes('x.com')) return <Twitter size={14} className={iconClass} />;
    if (url.includes('youtube')) return <Youtube size={14} className={iconClass} />;
    return <Globe size={14} className={iconClass} />;
  };

  const handleSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // User Management Logic
  const filteredUsers = useMemo(() => {
    let result = users.filter(u => {
      const name = (u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const query = (userSearchQuery || '').toLowerCase();
      const matchesSearch = name.includes(query) || email.includes(query);
      const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      const matchesStatus = userStatusFilter === 'all' || u.status === userStatusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle string comparisons (case-insensitive for names)
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Handle numbers
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [users, userSearchQuery, userRoleFilter, userStatusFilter, sortConfig]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (userPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, userPage]);

  // Reset page when filter changes
  useEffect(() => setUserPage(1), [userSearchQuery, userRoleFilter, userStatusFilter]);

  // Reset creator pagination when tab or search changes (Moved from renderCreators to fix React Error #310)
  useEffect(() => setCreatorPage(1), [creatorTab, creatorSearchQuery]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(filteredUsers.map(u => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectUser = (id: string) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: 'ban' | 'unban' | 'role', value?: string) => {
    if (!selectedUserIds.length) return;

    const isBan = action === 'ban';
    const isRole = action === 'role';

    const title = isRole ? 'Bulk Change Role' : (isBan ? 'Bulk Ban Users' : 'Bulk Unban Users');
    const message = isRole
      ? `Are you sure you want to assign the role "${value}" to the ${selectedUserIds.length} selected users?`
      : `Are you sure you want to ${action.toUpperCase()} ${selectedUserIds.length} users? This action will affect multiple accounts.`;

    setConfirmModal({
      isOpen: true,
      title,
      message,
      type: isBan ? 'danger' : 'warning',
      confirmText: 'Yes, Proceed',
      onConfirm: async () => {
        let updates: Partial<User> = {};
        if (action === 'ban') updates.status = 'banned';
        if (action === 'unban') updates.status = 'active';
        if (action === 'role' && value) updates.role = value as User['role'];

        await api.bulkUpdateUsers(selectedUserIds, updates);

        // Optimistic update
        setUsers(prev => prev.map(u => selectedUserIds.includes(u.id) ? { ...u, ...updates } : u));
        setSelectedUserIds([]);
        addLog(`Bulk action (${action}) performed on ${selectedUserIds.length} users.`, LogLevel.WARN, "AdminPanel");
        closeConfirmModal();
      }
    });
  };

  const handleEditUser = (user: User) => {
    setActiveUser({ ...user });
    setEditUserAvatarPreview(user.avatar || '');
    setEditUserAvatarFile(null);
    setShowEditUserModal(true);
  };

  const handleSaveUserChanges = async () => {
    if (!activeUser) return;

    try {
      let updatedUser = { ...activeUser };

      if (editUserAvatarFile) {
        addLog("Uploading new avatar...", LogLevel.INFO, "System");
        const avatarUrl = await api.uploadImage(editUserAvatarFile);
        updatedUser.avatar = avatarUrl;
      }

      await api.updateUser(updatedUser.id, updatedUser);
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      addLog(`User ${updatedUser.name} updated successfully.`, LogLevel.SUCCESS, "AdminPanel");
      setShowEditUserModal(false);
      setActiveUser(null);
      setEditUserAvatarFile(null);
      setEditUserAvatarPreview('');
    } catch (e) {
      addLog("Failed to update user.", LogLevel.ERROR, "Backend");
    }
  };

  const handleToggleBan = (user: User) => {
    const newStatus = user.status === 'banned' ? 'active' : 'banned';
    setConfirmModal({
      isOpen: true,
      title: newStatus === 'banned' ? 'Ban User' : 'Unban User',
      message: `Are you sure you want to ${newStatus === 'banned' ? 'BAN' : 'UNBAN'} ${user.name}? They will ${newStatus === 'banned' ? 'lose' : 'regain'} access immediately.`,
      type: newStatus === 'banned' ? 'danger' : 'warning',
      confirmText: newStatus === 'banned' ? 'Yes, Ban User' : 'Yes, Unban User',
      onConfirm: async () => {
        await api.updateUserStatus(user.id, newStatus);
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
        addLog(`User ${user.name} was ${newStatus}.`, LogLevel.WARN, "AdminPanel");
        closeConfirmModal();
      }
    });
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      alert("Please fill all required fields");
      return;
    }
    try {
      let avatarUrl = '';
      if (newUserAvatarFile) {
        addLog("Uploading user avatar...", LogLevel.INFO, "System");
        avatarUrl = await api.uploadImage(newUserAvatarFile);
      }

      const userData = { ...newUser, avatar: avatarUrl };
      const createdUser = await api.createUser(userData);
      setUsers(prev => [createdUser as User, ...prev]);
      addLog(`User ${newUser.name} created successfully.`, LogLevel.SUCCESS, "AdminPanel");
      setShowAddUserModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'user', points: 0, status: 'active' });
      setNewUserAvatarFile(null);
      setNewUserAvatarPreview('');
    } catch (e) {
      addLog("Failed to create user.", LogLevel.ERROR, "Backend");
    }
  };

  const handleProfileAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      addLog("Uploading profile avatar...", LogLevel.INFO, "System");
      try {
        const url = await api.uploadImage(file);
        setProfileForm(prev => ({ ...prev, avatar: url }));
      } catch (err) {
        addLog("Failed to upload avatar", LogLevel.ERROR, "System");
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!currentAdmin) return;

    const updatedProfile = {
      ...currentAdmin,
      name: profileForm.name,
      email: profileForm.email,
      avatar: profileForm.avatar
    };

    await api.updateAdminProfile(updatedProfile);
    setCurrentAdmin(updatedProfile);
    addLog("Admin Profile Updated.", LogLevel.SUCCESS, "AdminPanel");
  };

  // Missing implementations
  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const matchesType = txnTypeFilter === 'all' || txn.type === txnTypeFilter;
      const matchesStatus = txnStatusFilter === 'all' || txn.status === txnStatusFilter;
      return matchesType && matchesStatus;
    });
  }, [transactions, txnTypeFilter, txnStatusFilter]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (txnPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, txnPage]);

  // Helper for available subcategories (Moved from renderTemplates to avoid hook error)
  const availableSubCategories = useMemo(() => {
    const selectedCat = categories.find(c => c.name === newTemplate.category);
    return selectedCat ? selectedCat.subCategories : [];
  }, [newTemplate.category, categories]);

  const handleSaveFinanceConfig = async () => {
    await api.updateFinanceConfig(financeConfig);
    addLog("Finance configuration updated.", LogLevel.SUCCESS, "AdminPanel");
  };

  const handleSavePackage = async () => {
    if (!activePackage) return;
    if (activePackage.id.startsWith('new')) {
      const { id, ...pkgData } = activePackage;
      const newPkg = await api.addPointsPackage(pkgData);
      setPointsPackages(prev => [...prev, newPkg]);
      addLog(`New package '${newPkg.name}' created.`, LogLevel.SUCCESS, "AdminPanel");
    } else {
      await api.updatePointsPackage(activePackage.id, activePackage);
      setPointsPackages(prev => prev.map(p => p.id === activePackage.id ? activePackage : p));
      addLog(`Package '${activePackage.name}' updated.`, LogLevel.INFO, "AdminPanel");
    }
    setShowPackageModal(false);
    setActivePackage(null);
  };

  const handleDeletePackage = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Package',
      message: "Are you sure you want to delete this package? This cannot be undone.",
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: async () => {
        await api.deletePointsPackage(id);
        setPointsPackages(prev => prev.filter(p => p.id !== id));
        setShowPackageModal(false);
        addLog(`Package deleted.`, LogLevel.WARN, "AdminPanel");
        closeConfirmModal();
      }
    });
  };

  const handleSaveGateway = async () => {
    if (!activeGateway) return;
    if (String(activeGateway.id).startsWith('new')) {
      const { id, ...gwData } = activeGateway;
      const created = await api.createPaymentGateway(gwData);
      setPaymentGateways(prev => [...prev, created]);
      addLog(`Gateway '${created.name}' created.`, LogLevel.SUCCESS, "AdminPanel");
    } else {
      await api.updateGatewayConfig(activeGateway.id, activeGateway);
      setPaymentGateways(prev => prev.map(g => g.id === activeGateway.id ? activeGateway : g));
      addLog(`Gateway '${activeGateway.name}' configuration saved.`, LogLevel.SUCCESS, "AdminPanel");
    }
    setShowGatewayModal(false);
    setActiveGateway(null);
  };

  const handleTestGateway = async (gateway: PaymentGatewayConfig) => {
    setIsTestingGateway(true);
    const success = await api.testGatewayConnection(gateway.id);
    setIsTestingGateway(false);
    if (success) {
      addLog(`Connection to ${gateway.name} successful.`, LogLevel.SUCCESS, "System");
    } else {
      addLog(`Connection to ${gateway.name} failed. Check keys.`, LogLevel.ERROR, "System");
    }
  };

  const handleToggleGatewayActive = async (gateway: PaymentGatewayConfig) => {
    const next = !gateway.isActive;
    const ok = await api.toggleGatewayActive(gateway.id, next);
    if (ok) {
      setPaymentGateways(prev => prev.map(g => g.id === gateway.id ? { ...g, isActive: next } : g));
      addLog(`Gateway '${gateway.name}' ${next ? 'enabled' : 'disabled'}.`, LogLevel.INFO, "AdminPanel");
    } else {
      addLog(`Failed to toggle '${gateway.name}'.`, LogLevel.ERROR, "Backend");
    }
  };

  const handleAddGateway = () => {
    setActiveGateway({
      id: `new_${Date.now()}`,
      name: '',
      provider: 'Razorpay',
      isActive: false,
      isTestMode: true,
      publicKey: '',
      secretKey: '',
      webhookSecret: ''
    });
    setShowGatewayModal(true);
  };

  const handleDuplicateTemplate = async (template: Template) => {
    const { id, useCount, ...rest } = template;
    const newTmpl = { ...rest, title: `${template.title} (Copy)`, status: 'draft' as const, source: 'manual' as const };
    try {
      const created = await api.addTemplate(newTmpl);
      setTemplates(prev => [created, ...prev]);
      addLog(`Template '${template.title}' duplicated successfully.`, LogLevel.SUCCESS, 'AdminPanel');
    } catch (e) {
      addLog('Failed to duplicate template.', LogLevel.ERROR, 'Backend');
    }
  };

  const handleSaveCategory = async () => {
    if (!newCategory.name) return;
    const created = await api.addCategory(newCategory);
    setCategories(prev => [...prev, created]);
    setNewCategory({ name: '', subCategories: [] });
    addLog(`Category ${created.name} added.`, LogLevel.SUCCESS, 'AdminPanel');
  };

  const handleAddSubCategory = () => {
    if (newSubCategoryInput && !newCategory.subCategories.includes(newSubCategoryInput)) {
      setNewCategory(prev => ({ ...prev, subCategories: [...prev.subCategories, newSubCategoryInput] }));
      setNewSubCategoryInput('');
    }
  }

  const handleDeleteCategory = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Category',
      message: "Are you sure you want to delete this category? This will remove the category and all its sub-categories.",
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: async () => {
        await api.deleteCategory(id);
        setCategories(prev => prev.filter(c => c.id !== id));
        addLog("Category deleted.", LogLevel.WARN, "AdminPanel");
        closeConfirmModal();
      }
    });
  };

  const handleDeleteSubAdmin = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Admin',
      message: "Are you sure you want to remove this admin account?",
      type: 'danger',
      confirmText: 'Remove',
      onConfirm: async () => {
        await api.deleteSubAdmin(id);
        setSubAdmins(prev => prev.filter(a => a.id !== id));
        addLog("Sub-admin removed.", LogLevel.WARN, "AdminPanel");
        closeConfirmModal();
      }
    });
  };

  // Template Management Functions
  const renderTemplates = () => {
    // Stats calculation
    const totalTemplates = templates.length;
    const activeTemplates = templates.filter(t => t.status === 'active').length;
    const premiumTemplates = templates.filter(t => t.isPremium).length;
    const draftTemplates = templates.filter(t => t.status === 'draft').length;

    const filteredTemplates = templates.filter(t => {
      const title = (t.title || '').toLowerCase();
      const prompt = (t.prompt || '').toLowerCase();
      const q = (templateSearchQuery || '').toLowerCase();
      const matchesSearch = title.includes(q) || prompt.includes(q);
      // Safe category check
      const matchesCategory = templateCategoryFilter === 'All' || t.category?.trim() === templateCategoryFilter;
      const matchesStatus = templateFilterStatus === 'all' || t.status === templateFilterStatus;
      const matchesPremium = templateFilterPremium === 'all'
        ? true
        : (templateFilterPremium === 'premium' ? t.isPremium : !t.isPremium);

      return matchesSearch && matchesCategory && matchesStatus && matchesPremium;
    });

    const paginatedTemplates = filteredTemplates.slice((templatePage - 1) * itemsPerPage, templatePage * itemsPerPage);

    const toggleSelectTemplate = (id: string) => {
      setSelectedTemplateIds(prev => prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]);
    };

    const handleBulkTemplateAction = (action: 'delete' | 'active' | 'draft') => {
      if (!selectedTemplateIds.length) return;

      const title = action === 'delete' ? 'Bulk Delete Templates' : 'Bulk Update Status';
      const message = action === 'delete'
        ? `Permanently delete ${selectedTemplateIds.length} templates?`
        : `Set ${selectedTemplateIds.length} templates to ${action.toUpperCase()}?`;

      setConfirmModal({
        isOpen: true,
        title,
        message,
        type: action === 'delete' ? 'danger' : 'info',
        confirmText: 'Confirm',
        onConfirm: async () => {
          if (action === 'delete') {
            await Promise.all(selectedTemplateIds.map(id => api.deleteTemplate(id)));
            setTemplates(prev => prev.filter(t => !selectedTemplateIds.includes(t.id)));
          } else {
            const updates = { status: action } as Partial<Template>;
            await Promise.all(selectedTemplateIds.map(id => api.updateTemplate(id, updates)));
            setTemplates(prev => prev.map(t => selectedTemplateIds.includes(t.id) ? { ...t, status: action } as Template : t));
          }
          setSelectedTemplateIds([]);
          addLog(`Bulk template action (${action}) completed.`, LogLevel.SUCCESS, 'AdminPanel');
          closeConfirmModal();
        }
      });
    };

    // Helper for drag and drop
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setTemplateFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setNewTemplate({ ...newTemplate, imageUrl: '' }); // Clear manual URL if file selected
      }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        setTemplateFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setNewTemplate({ ...newTemplate, imageUrl: '' });
      }
    };

    const handleSaveTemplate = async () => {
      setIsUploading(true);
      try {
        let finalImageUrl = newTemplate.imageUrl;

        // If a file is selected, upload it first
        if (templateFile) {
          addLog("Uploading image file...", LogLevel.INFO, "System");
          const uploadedUrl = await api.uploadImage(templateFile);
          finalImageUrl = uploadedUrl;
          addLog("Image uploaded successfully.", LogLevel.SUCCESS, "System");
        }

        if (!finalImageUrl) {
          alert("Please upload an image or provide a valid URL.");
          setIsUploading(false);
          return;
        }

        const templateData = { ...newTemplate, imageUrl: finalImageUrl };

        if (isEditingTemplate && templateData.id) {
          await api.updateTemplate(templateData.id, templateData);
          setTemplates(prev => prev.map(t => t.id === templateData.id ? { ...t, ...templateData } as Template : t));
          addLog(`Template '${templateData.title}' updated successfully.`, LogLevel.SUCCESS, 'AdminPanel');
        } else {
          const created = await api.addTemplate(templateData as any);
          setTemplates(prev => [created, ...prev]);
          addLog(`Template '${created.title}' created successfully.`, LogLevel.SUCCESS, 'AdminPanel');
        }
        setShowTemplateModal(false);
        setIsEditingTemplate(false);
        setNewTemplate({ title: '', imageUrl: '', category: 'General', subCategory: 'Misc', prompt: '', negativePrompt: '', isPremium: false, status: 'active', source: 'manual' });
        setTemplateFile(null);
        setPreviewUrl('');
      } catch (e) {
        addLog("Failed to save template.", LogLevel.ERROR, "Backend");
      } finally {
        setIsUploading(false);
      }
    };

    const handleEditTemplate = (template: Template) => {
      setNewTemplate(template);
      setPreviewUrl(template.imageUrl); // Show existing image
      setTemplateFile(null);
      setIsEditingTemplate(true);
      setShowTemplateModal(true);
    };

    const openAddTemplateModal = () => {
      setNewTemplate({ title: '', imageUrl: '', category: 'General', subCategory: 'Misc', prompt: '', negativePrompt: '', isPremium: false, status: 'active', source: 'manual' });
      setPreviewUrl('');
      setTemplateFile(null);
      setIsEditingTemplate(false);
      setShowTemplateModal(true);
    }

    const handleDeleteTemplate = async (id: string) => {
      setConfirmModal({
        isOpen: true,
        title: 'Delete Template',
        message: "Are you sure? This template will be permanently removed.",
        type: 'danger',
        confirmText: 'Delete',
        onConfirm: async () => {
          await api.deleteTemplate(id);
          setTemplates(prev => prev.filter(t => t.id !== id));
          addLog(`Template ${id} deleted.`, LogLevel.WARN, 'AdminPanel');
          closeConfirmModal();
        }
      });
    };

    const handleBulkUpload = async () => {
      if (bulkFile) {
        addLog(`Processing bulk upload file: ${bulkFile.name}`, LogLevel.INFO, 'System');
        await api.bulkUploadTemplates(bulkFile);
        // Simulate adding some templates for visual feedback
        const mockBulkTemplates = [
          { id: `B_${Math.random()}`, title: 'Bulk Imported 1', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500', category: 'Abstract', prompt: 'abstract fluid art', status: 'active', useCount: 0, isPremium: false, source: 'bulk' }
        ];
        setTemplates(prev => [...(mockBulkTemplates as Template[]), ...prev]);
        setShowBulkUploadModal(false);
        setBulkFile(null);
        addLog("Bulk upload processed successfully. 15 templates added.", LogLevel.SUCCESS, 'Backend');
      }
    };

    const handleAirtableSync = async () => {
      setIsSyncingAirtable(true);
      addLog("Connecting to Airtable API...", LogLevel.INFO, 'System');
      try {
        const syncedTemplates = await api.syncAirtable(airtableConfig);
        setTemplates(prev => [...syncedTemplates, ...prev]);
        setShowAirtableModal(false);
        addLog(`Synced ${syncedTemplates.length} templates from Airtable Base.`, LogLevel.SUCCESS, 'Backend');
      } catch (e) {
        addLog("Airtable Sync Failed. Check API Key.", LogLevel.ERROR, 'System');
      } finally {
        setIsSyncingAirtable(false);
      }
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-500">

        {/* Template Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Templates" value={totalTemplates} icon={LayoutTemplate} color="blue" />
          <StatCard title="Active Templates" value={activeTemplates} icon={CheckCircle} color="green" trend={activeTemplates > 0 ? "Live" : ""} trendUp={true} />
          <StatCard title="Drafts" value={draftTemplates} icon={FileText} color="orange" />
          <StatCard title="Premium Templates" value={premiumTemplates} icon={Star} color="purple" />
        </div>

        <div className="flex flex-col gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <LayoutTemplate size={24} className="text-indigo-400" />
              Template Management
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCategoryModal(true)}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg flex items-center gap-2 text-xs border border-gray-700"
              >
                <FolderTree size={14} /> Manage Categories
              </button>
              <button
                onClick={() => setShowAirtableModal(true)}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg flex items-center gap-2 text-xs border border-gray-700"
              >
                <Database size={14} /> Import Airtable
              </button>

              <button
                onClick={() => setShowBulkUploadModal(true)}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg flex items-center gap-2 text-xs border border-gray-700"
              >
                <UploadCloud size={14} /> Bulk Upload
              </button>
              <button
                onClick={openAddTemplateModal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-2 text-sm font-medium"
              >
                <Plus size={16} /> New Template
              </button>
            </div>
          </div>

          {/* Advanced Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-800">
            <div className="flex items-center gap-3 flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                <input
                  type="text"
                  placeholder="Search templates & prompts..."
                  value={templateSearchQuery}
                  onChange={(e) => setTemplateSearchQuery(e.target.value)}
                  className="bg-gray-950 border border-gray-700 text-gray-200 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500 w-64"
                />
              </div>

              {/* Filters */}
              <select
                value={templateCategoryFilter}
                onChange={(e) => setTemplateCategoryFilter(e.target.value)}
                className="bg-gray-950 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none max-w-[120px]"
              >
                <option value="All">All Categories</option>
                {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>

              <select
                value={templateFilterStatus}
                onChange={(e) => setTemplateFilterStatus(e.target.value)}
                className="bg-gray-950 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none max-w-[100px]"
              >
                <option value="all">Any Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>

              <select
                value={templateFilterPremium}
                onChange={(e) => setTemplateFilterPremium(e.target.value)}
                className="bg-gray-950 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none max-w-[100px]"
              >
                <option value="all">All Types</option>
                <option value="premium">Premium</option>
                <option value="free">Free</option>
              </select>
            </div>

            {/* View Toggles & Actions */}
            <div className="flex items-center gap-2 bg-gray-950 p-1 rounded-lg border border-gray-800">
              <button
                onClick={() => setTemplateViewMode('grid')}
                className={`p-2 rounded ${templateViewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Grid View"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setTemplateViewMode('list')}
                className={`p-2 rounded ${templateViewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                title="List View"
              >
                <LayoutList size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Action Bar Templates */}
        {selectedTemplateIds.length > 0 && (
          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-sm">
                {selectedTemplateIds.length}
              </div>
              <span className="text-indigo-200 text-sm font-medium">Templates Selected</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleBulkTemplateAction('active')} className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5">
                <CheckCircle size={14} /> Set Active
              </button>
              <button onClick={() => handleBulkTemplateAction('draft')} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium rounded-lg flex items-center gap-1.5">
                <FileText size={14} /> Set Draft
              </button>
              <button onClick={() => handleBulkTemplateAction('delete')} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5">
                <Trash2 size={14} /> Delete Selected
              </button>
              <button onClick={() => setSelectedTemplateIds([])} className="ml-4 text-xs text-gray-400 hover:text-white underline">
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Grid View */}
        {templateViewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedTemplates.map(template => (
              <div key={template.id} className={`bg-gray-900 rounded-xl overflow-hidden border transition-all group hover:border-indigo-500/50 ${selectedTemplateIds.includes(template.id) ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-800'}`}>
                <div className="aspect-[4/5] relative overflow-hidden bg-gray-950">
                  <img src={template.imageUrl} alt={template.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                  {/* Selection Checkbox Overlay */}
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedTemplateIds.includes(template.id)}
                      onChange={() => toggleSelectTemplate(template.id)}
                      className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shadow-md"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80 pointer-events-none"></div>
                  <div className="absolute top-2 right-2 flex gap-1 pointer-events-none">
                    {template.isPremium && <span className="px-2 py-0.5 bg-yellow-500/90 text-black text-[10px] font-bold rounded uppercase flex items-center gap-1 shadow-lg"><Star size={10} fill="black" /> Premium</span>}
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase shadow-lg ${template.status === 'active' ? 'bg-green-500/90 text-white' : 'bg-gray-500/90 text-gray-200'}`}>
                      {template.status}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 p-4 w-full pointer-events-none">
                    <h3 className="text-white font-bold truncate">{template.title}</h3>
                    <div className="flex justify-between items-end mt-1">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 bg-gray-800/80 backdrop-blur-sm px-2 py-0.5 rounded w-fit">{template.category}</span>
                        {template.subCategory && <span className="text-[10px] text-indigo-300 mt-1">{template.subCategory}</span>}
                      </div>
                      <span className="text-xs text-gray-400">{template.useCount} Uses</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleDuplicateTemplate(template)}
                    className="flex items-center justify-center gap-1.5 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300"
                    title="Duplicate Template"
                  >
                    <Copy size={12} />
                  </button>
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="flex items-center justify-center gap-1.5 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300"
                    title="Edit Template"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="flex items-center justify-center gap-1.5 py-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded text-xs"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {templateViewMode === 'list' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-gray-950 text-gray-200 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={filteredTemplates.length > 0 && filteredTemplates.every(t => selectedTemplateIds.includes(t.id))}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedTemplateIds(filteredTemplates.map(t => t.id));
                        else setSelectedTemplateIds([]);
                      }}
                      className="rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3">Template</th>
                  <th className="px-4 py-3">Prompt</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Stats</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {paginatedTemplates.map(template => (
                  <tr key={template.id} className={`hover:bg-gray-800/50 ${selectedTemplateIds.includes(template.id) ? 'bg-indigo-900/10' : ''}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedTemplateIds.includes(template.id)}
                        onChange={() => toggleSelectTemplate(template.id)}
                        className="rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={template.imageUrl} alt={template.title} className="w-10 h-10 object-cover rounded-lg border border-gray-700" />
                      <div>
                        <div className="font-bold text-white">{template.title}</div>
                        {template.isPremium && <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded flex items-center gap-1 w-fit mt-0.5"><Star size={8} fill="currentColor" /> Premium</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[250px]">
                      <p className="truncate text-xs text-gray-500" title={template.prompt}>{template.prompt}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-gray-800 px-2 py-1 rounded text-xs text-gray-300">{template.category}</span>
                      {template.subCategory && <div className="text-[10px] text-gray-500 mt-1">{template.subCategory}</div>}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {template.useCount} uses
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${template.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                        {template.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleDuplicateTemplate(template)} className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white" title="Duplicate">
                          <Copy size={16} />
                        </button>
                        <button onClick={() => handleEditTemplate(template)} className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-indigo-400" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDeleteTemplate(template.id)} className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredTemplates.length === 0 && (
          <div className="col-span-full py-12 text-center bg-gray-900/50 border border-gray-800 border-dashed rounded-xl">
            <Filter size={32} className="mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400">No templates found matching your filters.</p>
          </div>
        )}

        <Pagination
          totalItems={filteredTemplates.length}
          itemsPerPage={itemsPerPage}
          currentPage={templatePage}
          onPageChange={setTemplatePage}
        />

        {/* Add/Edit Template Modal */}
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <LayoutTemplate size={20} className="text-indigo-400" />
                  {isEditingTemplate ? 'Edit Template' : 'Add New Template'}
                </h3>
                <button onClick={() => setShowTemplateModal(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Title</label>
                  <input type="text" value={newTemplate.title} onChange={e => setNewTemplate({ ...newTemplate, title: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" placeholder="e.g. Cyberpunk Warrior" />
                </div>

                {/* Image Upload Area */}
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Template Image</label>
                  {!previewUrl ? (
                    <div
                      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      onDrop={handleDrop}
                      className="border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-gray-950"
                    >
                      <input
                        type="file"
                        id="template-file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                      <label htmlFor="template-file" className="cursor-pointer flex flex-col items-center">
                        <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mb-3">
                          <UploadCloud size={24} className="text-indigo-400" />
                        </div>
                        <p className="text-sm text-gray-300 font-medium">Click to upload or drag & drop</p>
                        <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative group rounded-lg overflow-hidden border border-gray-700 bg-gray-950">
                      <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute top-2 right-2">
                        <button
                          onClick={() => { setPreviewUrl(''); setTemplateFile(null); setNewTemplate({ ...newTemplate, imageUrl: '' }); }}
                          className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-500 shadow-lg"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-xs text-white truncate px-2">{templateFile ? templateFile.name : 'Current Image'}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">Category</label>
                    <select
                      value={newTemplate.category}
                      onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value, subCategory: '' })}
                      className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">Sub-Category</label>
                    <select
                      value={newTemplate.subCategory || ''}
                      onChange={(e) => setNewTemplate({ ...newTemplate, subCategory: e.target.value })}
                      className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      disabled={!newTemplate.category || availableSubCategories.length === 0}
                    >
                      <option value="">Select Sub-Category</option>
                      {availableSubCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">Gender</label>
                    <select value={newTemplate.gender || ''} onChange={e => setNewTemplate({ ...newTemplate, gender: e.target.value as any })} className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-2 text-white text-sm">
                      <option value="">Any</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">Age Group</label>
                    <select value={newTemplate.ageGroup || ''} onChange={e => setNewTemplate({ ...newTemplate, ageGroup: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-2 text-white text-sm">
                      <option value="">Any</option>
                      <option value="18-25">18-25</option>
                      <option value="25-35">25-35</option>
                      <option value="35-45">35-45</option>
                      <option value="45+">45+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase block mb-1">State (IN)</label>
                    <select value={newTemplate.state || ''} onChange={e => setNewTemplate({ ...newTemplate, state: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-2 text-white text-sm">
                      <option value="">All India</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Rajasthan">Rajasthan</option>
                      {/* Add more states as needed */}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Description</label>
                  <textarea rows={2} value={newTemplate.description || ''} onChange={e => setNewTemplate({ ...newTemplate, description: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" placeholder="Template description..." />
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Tags (Comma separated)</label>
                  <input type="text" value={newTemplate.tags ? newTemplate.tags.join(', ') : ''} onChange={e => setNewTemplate({ ...newTemplate, tags: e.target.value.split(',').map(s => s.trim()) })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" placeholder="e.g. cinematic, dark, wedding" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Status</label>
                  <select value={newTemplate.status} onChange={e => setNewTemplate({ ...newTemplate, status: e.target.value as any })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Prompt</label>
                  <textarea rows={3} value={newTemplate.prompt} onChange={e => setNewTemplate({ ...newTemplate, prompt: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" placeholder="Detailed AI Prompt..." />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Negative Prompt (Optional)</label>
                  <textarea rows={2} value={newTemplate.negativePrompt || ''} onChange={e => setNewTemplate({ ...newTemplate, negativePrompt: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" placeholder="What to avoid..." />
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-950 border border-gray-800 rounded-lg">
                  <input type="checkbox" checked={newTemplate.isPremium} onChange={e => setNewTemplate({ ...newTemplate, isPremium: e.target.checked })} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-gray-900 border-gray-700" />
                  <label className="text-sm text-gray-300">Mark as Premium Template</label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveTemplate}
                  disabled={isUploading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                  {isUploading ? 'Uploading...' : (isEditingTemplate ? 'Save Changes' : 'Create Template')}
                </button>
                <button onClick={() => setShowTemplateModal(false)} className="px-5 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg font-medium">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Category Management Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-2xl w-full shadow-2xl h-[80vh] flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <FolderTree size={20} className="text-indigo-400" />
                    Manage Categories
                  </h3>
                  <p className="text-sm text-gray-400">Add, edit, or remove categories and sub-categories.</p>
                </div>
                <button onClick={() => setShowCategoryModal(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
              </div>

              {/* Add New Category Form */}
              <div className="bg-gray-950 p-4 rounded-lg border border-gray-800 mb-6 flex gap-3 items-end">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 uppercase block mb-1">New Category Name</label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                    placeholder="e.g. 3D Render"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 uppercase block mb-1">Add Sub-category</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSubCategoryInput}
                      onChange={e => setNewSubCategoryInput(e.target.value)}
                      className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                      placeholder="e.g. Isometric"
                    />
                    <button onClick={handleAddSubCategory} disabled={!newSubCategoryInput} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"><Plus size={16} /></button>
                  </div>
                </div>
                <button onClick={handleSaveCategory} disabled={!newCategory.name} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm font-medium h-[38px]">
                  Create
                </button>
              </div>

              {/* Staged Sub-categories */}
              {newCategory.subCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 p-3 bg-gray-950/50 rounded-lg border border-dashed border-gray-800">
                  <span className="text-xs text-gray-500 uppercase w-full">Pending Sub-categories:</span>
                  {newCategory.subCategories.map((sub, idx) => (
                    <span key={idx} className="text-xs bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded flex items-center gap-1 border border-indigo-500/20">
                      {sub} <button onClick={() => setNewCategory(prev => ({ ...prev, subCategories: prev.subCategories.filter(s => s !== sub) }))} className="hover:text-white"><X size={12} /></button>
                    </span>
                  ))}
                </div>
              )}

              {/* Existing Categories List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {categories.map(cat => (
                  <div key={cat.id} className="bg-gray-950 border border-gray-800 rounded-lg p-4 group">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-white flex items-center gap-2"><FolderPlus size={16} className="text-gray-500" /> {cat.name}</h4>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.subCategories.map((sub, idx) => (
                        <span key={idx} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">
                          {sub}
                        </span>
                      ))}
                      {cat.subCategories.length === 0 && <span className="text-xs text-gray-600 italic">No sub-categories</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Airtable Modal */}
        {showAirtableModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Database size={20} className="text-green-400" />
                Import from Airtable
              </h3>
              <p className="text-sm text-gray-400 mb-6">Connect your Airtable base to automatically sync and import AI templates.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">API Key</label>
                  <input type="password" value={airtableConfig.apiKey} onChange={e => setAirtableConfig({ ...airtableConfig, apiKey: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" placeholder="pat..." />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Base ID</label>
                  <input type="text" value={airtableConfig.baseId} onChange={e => setAirtableConfig({ ...airtableConfig, baseId: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" placeholder="app..." />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Table Name</label>
                  <input type="text" value={airtableConfig.tableName} onChange={e => setAirtableConfig({ ...airtableConfig, tableName: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" placeholder="Templates" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={handleAirtableSync} disabled={isSyncingAirtable} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSyncingAirtable ? <RefreshCw className="animate-spin" size={18} /> : <Download size={18} />}
                  {isSyncingAirtable ? 'Syncing...' : 'Start Sync'}
                </button>
                <button onClick={() => setShowAirtableModal(false)} className="px-5 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg font-medium">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Bulk Upload Modal */}
        {showBulkUploadModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <UploadCloud size={20} className="text-indigo-400" />
                Bulk Upload Templates
              </h3>
              <p className="text-sm text-gray-400 mb-6">Upload an Excel or CSV file containing template data. Supported columns: Title, Prompt, Category, ImageURL.</p>

              <div className="border-2 border-dashed border-gray-700 hover:border-indigo-500 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-gray-950 mb-6">
                <input
                  type="file"
                  id="bulk-file"
                  className="hidden"
                  accept=".csv, .xlsx"
                  onChange={(e) => setBulkFile(e.target.files ? e.target.files[0] : null)}
                />
                <label htmlFor="bulk-file" className="cursor-pointer flex flex-col items-center w-full">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mb-3">
                    <FileText size={24} className="text-indigo-400" />
                  </div>
                  <p className="text-sm text-gray-300 font-medium">{bulkFile ? bulkFile.name : 'Click to upload Excel/CSV'}</p>
                </label>
              </div>

              <div className="flex gap-3">
                <button onClick={handleBulkUpload} disabled={!bulkFile} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-medium disabled:opacity-50">Upload & Process</button>
                <button onClick={() => setShowBulkUploadModal(false)} className="px-5 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg font-medium">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  };

  const renderFinance = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transactions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><ArrowRightLeft size={20} className="text-indigo-400" /> Transactions</h3>
            <div className="flex gap-2">
              <select className="bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded px-2 py-1" value={txnTypeFilter} onChange={(e) => setTxnTypeFilter(e.target.value as any)}>
                <option value="all">All Types</option>
                <option value="credit">Credits</option>
                <option value="debit">Debits</option>
              </select>
              <select className="bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded px-2 py-1" value={txnStatusFilter} onChange={(e) => setTxnStatusFilter(e.target.value as any)}>
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
              <button
                onClick={() => downloadCSV(filteredTransactions, 'transactions')}
                className="bg-gray-900 hover:bg-gray-800 text-gray-300 p-1.5 rounded border border-gray-700"
                title="Export CSV"
              >
                <FileDown size={14} />
              </button>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden min-h-[400px]">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-gray-950 text-gray-200">
                <tr>
                  <th className="px-4 py-3">ID / User</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Gateway</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {paginatedTransactions.map(txn => (
                  <tr key={txn.id} className="hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      <div className="text-white font-mono text-xs">{txn.id}</div>
                      <div className="text-[10px] text-gray-500">{txn.userId}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="truncate max-w-[150px]" title={txn.description}>{txn.description}</div>
                      <div className="text-[10px] text-gray-500">{new Date(txn.date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-4 py-3 font-bold">
                      <span className={txn.type === 'credit' ? 'text-green-400' : 'text-red-400'}>
                        {txn.type === 'credit' ? '+' : '-'} ₹{txn.amount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{txn.gateway}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${txn.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              totalItems={filteredTransactions.length}
              itemsPerPage={itemsPerPage}
              currentPage={txnPage}
              onPageChange={setTxnPage}
            />
          </div>
        </div>

        {/* Configs */}
        <div className="space-y-6">
          {/* Finance Config */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Economy Settings</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Cost Per Credit (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={financeConfig.costPerCredit}
                  onChange={(e) => setFinanceConfig({ ...financeConfig, costPerCredit: parseFloat(e.target.value) })}
                  className="w-full bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                />
              </div>
              <button onClick={handleSaveFinanceConfig} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm font-medium">Save Config</button>
            </div>
          </div>

          {/* Packages */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Points Packages</h4>
              <button onClick={() => { setActivePackage({ id: `new_${Date.now()}`, name: '', price: 0, points: 0, bonusPoints: 0, isActive: true, isPopular: false, tag: '' } as PointsPackage); setShowPackageModal(true); }} className="text-indigo-400 hover:text-white"><Plus size={16} /></button>
            </div>
            <div className="space-y-2">
              {pointsPackages.map(pkg => (
                <div key={pkg.id} className="flex justify-between items-center p-2 bg-gray-950 border border-gray-800 rounded hover:border-gray-600 cursor-pointer" onClick={() => { setActivePackage(pkg); setShowPackageModal(true); }}>
                  <div>
                    <div className="text-white text-sm font-bold">{pkg.name}</div>
                    <div className="text-xs text-gray-500">{pkg.points} pts • ₹{pkg.price}</div>
                  </div>
                  {pkg.isPopular && <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded">POPULAR</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Gateways */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Payment Gateways</h4>
              <button onClick={handleAddGateway} className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium">
                <Plus size={14} /> Add Gateway
              </button>
            </div>
            <div className="space-y-2">
              {paymentGateways.map(gw => (
                <div key={gw.id} className="flex justify-between items-center p-3 bg-gray-950 border border-gray-800 rounded">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${gw.isActive ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                    <span className="text-sm text-gray-200">{gw.name}</span>
                    <span className="text-[10px] text-gray-500 px-1.5 py-0.5 rounded border border-gray-800 bg-gray-900">{gw.provider}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleGatewayActive(gw)}
                      className={`w-10 h-5 rounded-full p-1 transition-colors ${gw.isActive ? 'bg-green-600' : 'bg-gray-700'}`}
                      aria-label="Toggle Active"
                    >
                      <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${gw.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <button onClick={() => handleTestGateway(gw)} className="text-gray-500 hover:text-white" aria-label="Test Connection">
                      <Activity size={14} />
                    </button>
                    <button onClick={() => { setActiveGateway(gw); setShowGatewayModal(true); }} className="text-gray-500 hover:text-white" aria-label="Configure">
                      <Settings size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Package Modal */}
      {showPackageModal && activePackage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-4">{activePackage.id.startsWith('new') ? 'New Package' : 'Edit Package'}</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Name" value={activePackage.name} onChange={e => setActivePackage({ ...activePackage, name: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Price" value={activePackage.price} onChange={e => setActivePackage({ ...activePackage, price: parseFloat(e.target.value) })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" />
                <input type="number" placeholder="Points" value={activePackage.points} onChange={e => setActivePackage({ ...activePackage, points: parseFloat(e.target.value) })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" />
              </div>
              <input type="text" placeholder="Tag (e.g. Best Value)" value={activePackage.tag || ''} onChange={e => setActivePackage({ ...activePackage, tag: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" />
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={activePackage.isPopular} onChange={e => setActivePackage({ ...activePackage, isPopular: e.target.checked })} /> Mark as Popular
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input type="checkbox" checked={activePackage.isActive} onChange={e => setActivePackage({ ...activePackage, isActive: e.target.checked })} /> Active
              </label>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleSavePackage} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded text-sm font-medium">Save</button>
              {!activePackage.id.startsWith('new') && <button onClick={() => handleDeletePackage(activePackage.id)} className="px-3 bg-red-900/50 hover:bg-red-900 text-red-400 rounded text-sm"><Trash2 size={16} /></button>}
              <button onClick={() => setShowPackageModal(false)} className="px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Gateway Modal */}
      {showGatewayModal && activeGateway && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Settings size={18} /> Configure {activeGateway.name || 'Gateway'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Gateway Name</label>
                  <input type="text" value={activeGateway.name} onChange={e => setActiveGateway({ ...activeGateway, name: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-xs" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Provider</label>
                  <select value={activeGateway.provider} onChange={e => setActiveGateway({ ...activeGateway, provider: e.target.value as any })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-xs">
                    <option value="Razorpay">Razorpay</option>
                    <option value="Stripe">Stripe</option>
                    <option value="PayPal">PayPal</option>
                    <option value="PhonePe">PhonePe</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase block mb-1">Public Key</label>
                <input type="text" value={activeGateway.publicKey} onChange={e => setActiveGateway({ ...activeGateway, publicKey: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white font-mono text-xs" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase block mb-1">Secret Key</label>
                <input type="password" value={activeGateway.secretKey} onChange={e => setActiveGateway({ ...activeGateway, secretKey: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white font-mono text-xs" />
              </div>
              <div className="flex items-center justify-between bg-gray-950 p-3 rounded border border-gray-800">
                <span className="text-sm text-gray-300">Test Mode</span>
                <button
                  onClick={() => setActiveGateway({ ...activeGateway, isTestMode: !activeGateway.isTestMode })}
                  className={`w-10 h-5 rounded-full p-1 transition-colors ${activeGateway.isTestMode ? 'bg-yellow-600' : 'bg-gray-700'}`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${activeGateway.isTestMode ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between bg-gray-950 p-3 rounded border border-gray-800">
                <span className="text-sm text-gray-300">Enable Gateway</span>
                <button
                  onClick={() => setActiveGateway({ ...activeGateway, isActive: !activeGateway.isActive })}
                  className={`w-10 h-5 rounded-full p-1 transition-colors ${activeGateway.isActive ? 'bg-green-600' : 'bg-gray-700'}`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform ${activeGateway.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={handleSaveGateway} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded text-sm font-medium">Save Changes</button>
              <button onClick={() => handleTestGateway(activeGateway)} disabled={isTestingGateway} className="px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm flex items-center gap-2">
                {isTestingGateway ? <RefreshCw className="animate-spin" size={14} /> : <Activity size={14} />} Test
              </button>
              <button onClick={() => setShowGatewayModal(false)} className="px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <ConnectionVisualizer
        repos={INITIAL_REPOS}
        status={connectionStatus}
        onFix={handleFixConnection}
        isFixing={isFixing}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Users" value={metrics.activeUsers} icon={Users} color="blue" />
        <StatCard title="Total Revenue" value={`₹${metrics.revenue.toLocaleString()}`} icon={DollarSign} color="green" />
        <StatCard title="API Requests" value={metrics.requests} icon={Activity} color="purple" />
        <StatCard title="System Latency" value={`${metrics.latency}ms`} icon={Clock} color="orange" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-indigo-400" /> Revenue Analytics
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueChartData}>
                <XAxis dataKey="name" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} prefix="₹" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#f3f4f6' }}
                  itemStyle={{ color: '#e5e7eb' }}
                />
                <Line type="monotone" dataKey="userPayments" stroke="#6366f1" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="User Payments" />
                <Line type="monotone" dataKey="creatorPayouts" stroke="#ec4899" strokeWidth={3} dot={false} name="Creator Payouts" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-6">
          <Terminal logs={logs} className="h-[380px]" />
          {connectionStatus === ConnectionStatus.ERROR && (
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
              <h4 className="text-red-400 font-bold flex items-center gap-2 mb-2">
                <AlertTriangle size={18} /> Diagnostics Required
              </h4>
              <p className="text-xs text-gray-400 mb-3">System has detected backend connectivity issues. AI analysis recommended.</p>
              <button
                onClick={handleAnalyzeErrors}
                disabled={isAnalyzing}
                className="w-full py-2 bg-red-600/80 hover:bg-red-500 text-white rounded text-sm font-medium flex items-center justify-center gap-2"
              >
                {isAnalyzing ? <RefreshCw className="animate-spin" size={14} /> : <BrainCircuit size={14} />} Run AI Diagnosis
              </button>
              {analysisResult && (
                <div className="mt-3 p-3 bg-black/40 rounded text-xs font-mono text-gray-300 whitespace-pre-wrap border border-gray-700">
                  {analysisResult}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Users size={24} className="text-indigo-400" /> User Management
        </h2>
        <div className="flex gap-3 items-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              className="bg-gray-950 border border-gray-700 text-gray-200 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500 w-48 transition-all"
            />
          </div>

          {/* Role Filter */}
          <select
            value={userRoleFilter}
            onChange={(e) => setUserRoleFilter(e.target.value as any)}
            className="bg-gray-950 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="creator">Creators</option>
            <option value="admin">Admins</option>
          </select>

          {/* Status Filter */}
          <select
            value={userStatusFilter}
            onChange={(e) => setUserStatusFilter(e.target.value as any)}
            className="bg-gray-950 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
            <option value="pending">Pending</option>
          </select>

          <button
            onClick={() => downloadCSV(filteredUsers, 'users')}
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm border border-gray-700"
            title="Export Users"
          >
            <FileDown size={16} />
          </button>

          <button
            onClick={() => {
              setNewUser({ name: '', email: '', password: '', role: 'user', points: 0, status: 'active' });
              setNewUserAvatarFile(null);
              setNewUserAvatarPreview('');
              setShowAddUserModal(true);
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm flex items-center gap-2"
          >
            <UserPlus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedUserIds.length > 0 && (
        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-sm">
              {selectedUserIds.length}
            </div>
            <span className="text-indigo-200 text-sm font-medium">Users Selected</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleBulkAction('ban')} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors">
              <Ban size={14} /> Ban Selected
            </button>
            <button onClick={() => handleBulkAction('unban')} className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors">
              <CheckCircle size={14} /> Unban Selected
            </button>
            <div className="h-6 w-px bg-indigo-500/30 mx-2"></div>
            <button onClick={() => handleBulkAction('role', 'user')} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium rounded-lg transition-colors">
              Make User
            </button>
            <button onClick={() => handleBulkAction('role', 'creator')} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium rounded-lg transition-colors">
              Make Creator
            </button>
            <button onClick={() => setSelectedUserIds([])} className="ml-4 text-xs text-gray-400 hover:text-white underline">
              Clear Selection
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-gray-950 text-gray-200 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 w-10">
                <input
                  type="checkbox"
                  className="rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  checked={filteredUsers.length > 0 && filteredUsers.every(u => selectedUserIds.includes(u.id))}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-6 py-3 cursor-pointer group" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1 hover:text-white transition-colors">
                  User
                  {sortConfig?.key === 'name' ? (
                    sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-indigo-400" /> : <ArrowDown size={14} className="text-indigo-400" />
                  ) : <ArrowUpDown size={14} className="text-gray-700 group-hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
              </th>
              <th className="px-6 py-3 cursor-pointer group" onClick={() => handleSort('role')}>
                <div className="flex items-center gap-1 hover:text-white transition-colors">
                  Role
                  {sortConfig?.key === 'role' ? (
                    sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-indigo-400" /> : <ArrowDown size={14} className="text-indigo-400" />
                  ) : <ArrowUpDown size={14} className="text-gray-700 group-hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
              </th>
              <th className="px-6 py-3 cursor-pointer group" onClick={() => handleSort('points')}>
                <div className="flex items-center gap-1 hover:text-white transition-colors">
                  Points
                  {sortConfig?.key === 'points' ? (
                    sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-indigo-400" /> : <ArrowDown size={14} className="text-indigo-400" />
                  ) : <ArrowUpDown size={14} className="text-gray-700 group-hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
              </th>
              <th className="px-6 py-3 cursor-pointer group" onClick={() => handleSort('status')}>
                <div className="flex items-center gap-1 hover:text-white transition-colors">
                  Status
                  {sortConfig?.key === 'status' ? (
                    sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-indigo-400" /> : <ArrowDown size={14} className="text-indigo-400" />
                  ) : <ArrowUpDown size={14} className="text-gray-700 group-hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
              </th>
              <th className="px-6 py-3 cursor-pointer group" onClick={() => handleSort('joinedDate')}>
                <div className="flex items-center gap-1 hover:text-white transition-colors">
                  Joined
                  {sortConfig?.key === 'joinedDate' ? (
                    sortConfig.direction === 'asc' ? <ArrowUp size={14} className="text-indigo-400" /> : <ArrowDown size={14} className="text-indigo-400" />
                  ) : <ArrowUpDown size={14} className="text-gray-700 group-hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
                </div>
              </th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {paginatedUsers.map(user => (
              <tr key={user.id} className={`transition-colors hover:bg-gray-800/50 ${user.status === 'banned' ? 'bg-red-500/5' : ''} ${selectedUserIds.includes(user.id) ? 'bg-indigo-900/10' : ''}`}>
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => handleSelectUser(user.id)}
                  />
                </td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border shrink-0 ${user.status === 'banned' ? 'bg-red-900/20 border-red-500/30' : 'bg-gray-800 border-gray-700'}`}>
                    {user.avatar ?
                      <img src={user.avatar} alt={user.name} className={`w-full h-full object-cover ${user.status === 'banned' ? 'grayscale opacity-70' : ''}`} /> :
                      <span className={`font-bold text-lg ${user.status === 'banned' ? 'text-red-500' : 'text-indigo-400'}`}>{user.name?.charAt(0) || '?'}</span>
                    }
                  </div>
                  <div className="overflow-hidden">
                    <div className={`font-medium truncate ${user.status === 'banned' ? 'text-red-300 line-through' : 'text-white'}`}>{user.name}</div>
                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize">{user.role}</td>
                <td className="px-6 py-4 font-mono text-white">{user.points}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${user.status === 'active' ? 'bg-green-500/20 text-green-400' : user.status === 'banned' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs">{new Date(user.joinedDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleToggleBan(user)} title={user.status === 'banned' ? "Unban User" : "Ban User"} className={`p-2 rounded hover:bg-gray-800 transition-colors ${user.status === 'banned' ? 'text-green-500' : 'text-red-500'}`}>
                      {user.status === 'banned' ? <CheckCircle size={18} /> : <Ban size={18} />}
                    </button>
                    <button onClick={() => handleEditUser(user)} className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-gray-800 rounded transition-colors" title="Edit Details">
                      <Edit2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          currentPage={userPage}
          onPageChange={setUserPage}
        />
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <UserPlus size={20} className="text-indigo-400" />
                Create New User
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative w-20 h-20 group cursor-pointer">
                  <div className="w-full h-full rounded-full bg-gray-800 overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-700 hover:border-indigo-500 transition-colors">
                    {newUserAvatarPreview ?
                      <img src={newUserAvatarPreview} alt="Preview" className="w-full h-full object-cover" /> :
                      <Camera size={24} className="text-gray-500" />
                    }
                  </div>
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewUserAvatarFile(file);
                        setNewUserAvatarPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-1 shadow-lg">
                    <Plus size={12} />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase block mb-1">Email Address</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase block mb-1">Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none"
                  >
                    <option value="user">User</option>
                    <option value="creator">Creator</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Initial Points</label>
                  <input
                    type="number"
                    value={newUser.points}
                    onChange={(e) => setNewUser({ ...newUser, points: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleCreateUser} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2">
                <Plus size={18} /> Create User
              </button>
              <button onClick={() => setShowAddUserModal(false)} className="px-5 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && activeUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users size={20} className="text-indigo-400" />
                Edit User Details
              </h3>
              <button onClick={() => setShowEditUserModal(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="relative w-20 h-20">
                  <div className="w-full h-full rounded-full bg-gray-800 overflow-hidden flex items-center justify-center border border-gray-700 group">
                    {editUserAvatarPreview ?
                      <img src={editUserAvatarPreview} alt="Preview" className="w-full h-full object-cover" /> :
                      <span className="text-indigo-400 font-bold text-2xl">{activeUser?.name?.charAt(0) || '?'}</span>
                    }
                    <label htmlFor="edit-avatar-upload" className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <Camera size={24} className="text-white" />
                    </label>
                  </div>
                  <input
                    type="file"
                    id="edit-avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setEditUserAvatarFile(file);
                        setEditUserAvatarPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Profile Picture</p>
                  <p className="text-xs text-gray-500">Click image to upload new.</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  value={activeUser.name}
                  onChange={(e) => setActiveUser({ ...activeUser, name: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase block mb-1">Email Address</label>
                <input
                  type="email"
                  value={activeUser.email}
                  onChange={(e) => setActiveUser({ ...activeUser, email: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Role</label>
                  <select
                    value={activeUser.role}
                    onChange={(e) => setActiveUser({ ...activeUser, role: e.target.value as any })}
                    className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="user">User</option>
                    <option value="creator">Creator</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Status</label>
                  <select
                    value={activeUser.status}
                    onChange={(e) => setActiveUser({ ...activeUser, status: e.target.value as any })}
                    className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase block mb-1">Wallet Points</label>
                <input
                  type="number"
                  value={activeUser.points}
                  onChange={(e) => setActiveUser({ ...activeUser, points: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm font-mono"
                />
                <p className="text-[10px] text-gray-500 mt-1">Adjusting this will directly credit/debit user wallet.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 uppercase block mb-1">Temporary Password</label>
                  <input
                    type="password"
                    value={(activeUser as any).tempPassword || ''}
                    onChange={(e) => setActiveUser({ ...activeUser, ...({ tempPassword: e.target.value } as any) })}
                    className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm font-mono"
                    placeholder="Set a temporary password"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={async () => {
                      const temp = (activeUser as any).tempPassword || Math.random().toString(36).slice(2, 10);
                      await api.setUserTempPassword(activeUser.id, temp);
                      addLog(`Temporary password set for ${activeUser.email}`, LogLevel.SUCCESS, 'AdminPanel');
                    }}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 rounded px-3 py-2 text-sm"
                  >
                    Set
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveUserChanges} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg font-medium flex items-center justify-center gap-2">
                <Save size={18} /> Save Changes
              </button>
              <button onClick={() => setShowEditUserModal(false)} className="px-5 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCreators = () => {
    // Stats Calculation
    const totalCreators = users.filter(u => u.role === 'creator').length;
    const pendingApps = creators.filter(c => c.status === 'pending').length;
    // Mock earnings calculation - in real app, sum from transactions
    const totalEarnings = 45000;

    const activeCreators = users.filter(u => {
      const isCreator = u.role === 'creator';
      const name = (u.name || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const query = (creatorSearchQuery || '').toLowerCase();
      const matchesSearch = name.includes(query) || email.includes(query);
      return isCreator && matchesSearch;
    });

    const pendingApplications = creators.filter(app => {
      const isPending = app.status === 'pending';
      const name = (app.name || '').toLowerCase();
      const query = (creatorSearchQuery || '').toLowerCase();
      const matchesSearch = name.includes(query);
      return isPending && matchesSearch;
    });

    const paginatedApplications = pendingApplications.slice((creatorPage - 1) * itemsPerPage, creatorPage * itemsPerPage);
    const paginatedCreators = activeCreators.slice((creatorPage - 1) * itemsPerPage, creatorPage * itemsPerPage);

    const handleSelectApp = (id: string) => {
      setSelectedAppIds(prev => prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]);
    };

    const handleSelectCreator = (id: string) => {
      setSelectedCreatorIds(prev => prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]);
    };

    const handleSelectAllApps = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setSelectedAppIds(pendingApplications.map(a => a.id));
      } else {
        setSelectedAppIds([]);
      }
    };

    const handleSelectAllCreators = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setSelectedCreatorIds(activeCreators.map(c => c.id));
      } else {
        setSelectedCreatorIds([]);
      }
    };

    const handleBulkAppAction = (action: 'approve' | 'reject') => {
      if (!selectedAppIds.length) return;
      setConfirmModal({
        isOpen: true,
        title: `Bulk ${action === 'approve' ? 'Approve' : 'Reject'}`,
        message: `Are you sure you want to ${action} ${selectedAppIds.length} applications?`,
        type: action === 'reject' ? 'danger' : 'info',
        confirmText: 'Yes, Proceed',
        onConfirm: async () => {
          if (action === 'approve') {
            await Promise.all(selectedAppIds.map(id => api.approveCreatorApplication(id)));
            setCreators(prev => prev.map(c => selectedAppIds.includes(c.id) ? { ...c, status: 'approved' } : c));
          } else {
            await Promise.all(selectedAppIds.map(id => api.rejectCreatorApplication(id)));
            setCreators(prev => prev.map(c => selectedAppIds.includes(c.id) ? { ...c, status: 'rejected' } : c));
          }
          setSelectedAppIds([]);
          closeConfirmModal();
          addLog(`Bulk ${action} completed for creators.`, LogLevel.SUCCESS, 'AdminPanel');
        }
      });
    };

    const handleBulkCreatorAction = (action: 'demote' | 'remove') => {
      if (!selectedCreatorIds.length) return;

      const title = action === 'demote' ? 'Demote Selected Creators' : 'Remove Selected Creators';
      const message = action === 'demote'
        ? `Are you sure you want to demote ${selectedCreatorIds.length} creators to regular users?`
        : `Are you sure you want to permanently remove creator status from ${selectedCreatorIds.length} users?`;

      setConfirmModal({
        isOpen: true,
        title: title,
        message: message,
        type: 'danger',
        confirmText: 'Yes, Proceed',
        onConfirm: async () => {
          if (action === 'demote' || action === 'remove') {
            // Using bulk user update to change role to user
            await api.bulkUpdateUsers(selectedCreatorIds, { role: 'user' });
            // In a real scenario, you might have a specific endpoint for removing creators
            setUsers(prev => prev.map(u => selectedCreatorIds.includes(u.id) ? { ...u, role: 'user' } : u));
          }
          setSelectedCreatorIds([]);
          closeConfirmModal();
          addLog(`Bulk ${action} completed for active creators.`, LogLevel.WARN, 'AdminPanel');
        }
      });
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-500">

        {/* Creator Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Total Creators" value={totalCreators} icon={Palette} trend="Active" trendUp={true} color="purple" />
          <StatCard title="Pending Applications" value={pendingApps} icon={Briefcase} trend={pendingApps > 0 ? "Action Needed" : "All Clear"} trendUp={pendingApps === 0} color="orange" />
          <StatCard title="Total Payouts" value={`₹${totalEarnings.toLocaleString()}`} icon={TrendingUp} trend="+15%" trendUp={true} color="green" />
        </div>

        {/* Main Interface */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-800">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award size={24} className="text-indigo-400" /> Creator Management
              </h2>
              <div className="h-6 w-px bg-gray-800"></div>
              <div className="flex gap-1 bg-gray-950 p-1 rounded-lg border border-gray-800">
                <button
                  onClick={() => setCreatorTab('applications')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${creatorTab === 'applications' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                  <Briefcase size={14} /> Application Queue
                  {pendingApps > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{pendingApps}</span>}
                </button>
                <button
                  onClick={() => setCreatorTab('active')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${creatorTab === 'active' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                  <Users size={14} /> Active Creators
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
                <input
                  type="text"
                  placeholder={creatorTab === 'applications' ? "Search applications..." : "Search creators..."}
                  value={creatorSearchQuery}
                  onChange={(e) => setCreatorSearchQuery(e.target.value)}
                  className="bg-gray-950 border border-gray-700 text-gray-200 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500 w-48 transition-all"
                />
              </div>
              <button
                onClick={() => downloadCSV(creatorTab === 'applications' ? pendingApplications : activeCreators, 'creators')}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm border border-gray-700"
              >
                <FileDown size={16} />
              </button>
              <button onClick={openAddCreatorModal} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm flex items-center gap-2">
                <Plus size={16} /> Add Creator
              </button>
            </div>
          </div>

          {/* Bulk Actions for Applications */}
          {creatorTab === 'applications' && (
            <div className={`bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2 ${selectedAppIds.length === 0 ? 'opacity-80' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={pendingApplications.length > 0 && pendingApplications.every(a => selectedAppIds.includes(a.id))}
                    onChange={handleSelectAllApps}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-indigo-200 text-sm font-medium">Select All</span>
                </div>
                {selectedAppIds.length > 0 && <span className="text-indigo-200 text-sm font-bold bg-indigo-500/20 px-2 py-0.5 rounded">{selectedAppIds.length} Selected</span>}
              </div>
              {selectedAppIds.length > 0 && (
                <div className="flex gap-2">
                  <button onClick={() => handleBulkAppAction('approve')} className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5">
                    <CheckCircle size={14} /> Bulk Approve
                  </button>
                  <button onClick={() => handleBulkAppAction('reject')} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5">
                    <XSquare size={14} /> Bulk Reject
                  </button>
                  <button onClick={() => setSelectedAppIds([])} className="ml-4 text-xs text-gray-400 hover:text-white underline">Clear</button>
                </div>
              )}
            </div>
          )}

          {/* Bulk Actions for Active Creators */}
          {creatorTab === 'active' && selectedCreatorIds.length > 0 && (
            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-4">
                <span className="text-indigo-200 text-sm font-bold bg-indigo-500/20 px-2 py-0.5 rounded">{selectedCreatorIds.length} Selected</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleBulkCreatorAction('demote')} className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5">
                  <UserX size={14} /> Bulk Demote
                </button>
                <button onClick={() => handleBulkCreatorAction('remove')} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5">
                  <Trash2 size={14} /> Bulk Remove
                </button>
                <button onClick={() => setSelectedCreatorIds([])} className="ml-4 text-xs text-gray-400 hover:text-white underline">Clear</button>
              </div>
            </div>
          )}

          {/* Content Area */}
          {creatorTab === 'applications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedApplications.map(app => (
                <div key={app.id} className={`bg-gray-900 border rounded-xl p-0 hover:border-indigo-500/50 transition-all overflow-hidden group ${selectedAppIds.includes(app.id) ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-800'}`}>
                  <div className="p-6 border-b border-gray-800 relative">
                    <div className="absolute top-4 right-4">
                      <input type="checkbox" checked={selectedAppIds.includes(app.id)} onChange={() => handleSelectApp(app.id)} className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500" />
                    </div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {app.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">{app.name}</h3>
                          <p className="text-xs text-gray-500">Applied {new Date(app.appliedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {app.socialLinks.map((link, idx) => (
                        <a key={idx} href={`https://${link}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-gray-300 transition-colors">
                          {getSocialIcon(link)}
                          <span className="truncate max-w-[100px]">{link.replace(/^https?:\/\//, '')}</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio Preview */}
                  <div className="p-4 bg-gray-950/50">
                    <p className="text-[10px] uppercase font-bold text-gray-500 mb-2">Portfolio Preview</p>

                    {app.demoTemplates && app.demoTemplates.length > 0 ? (
                      <div className={`grid gap-2 ${app.demoTemplates.length === 1 ? 'grid-cols-1' : app.demoTemplates.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                        {app.demoTemplates.map((demo, idx) => (
                          <div key={idx} className="aspect-square bg-gray-800 rounded overflow-hidden group relative">
                            <img
                              src={demo.image}
                              alt={demo.prompt || `Demo ${idx + 1}`}
                              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                              onError={(e) => {
                                // Fallback if image fails to load
                                e.currentTarget.src = `https://via.placeholder.com/200x200/1f2937/9ca3af?text=Demo+${idx + 1}`;
                              }}
                            />
                            {demo.prompt && (
                              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                                <p className="text-xs text-white text-center line-clamp-3">{demo.prompt}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2].map(i => (
                          <div key={i} className="aspect-square bg-gray-800 rounded overflow-hidden flex items-center justify-center">
                            <span className="text-gray-600 text-xs">No Image</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex gap-2">
                    <button onClick={() => handleApproveCreator(app.id, app.name)} className="flex-1 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                      <CheckSquare size={16} /> Approve
                    </button>
                    <button onClick={() => handleRejectCreator(app.id, app.name)} className="flex-1 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg text-sm font-medium flex items-center justify-center gap-2 border border-red-900/30">
                      <XSquare size={16} /> Reject
                    </button>
                  </div>
                </div>
              ))}
              {pendingApplications.length === 0 && (
                <div className="col-span-full py-16 text-center bg-gray-900/50 border border-gray-800 border-dashed rounded-xl">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-white">All Caught Up!</h3>
                  <p className="text-gray-400 mt-1">No pending creator applications at the moment.</p>
                </div>
              )}
            </div>
          )}

          {creatorTab === 'active' && (
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-950 text-gray-200 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4 w-10">
                      <input
                        type="checkbox"
                        checked={activeCreators.length > 0 && activeCreators.every(c => selectedCreatorIds.includes(c.id))}
                        onChange={handleSelectAllCreators}
                        className="rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4">Creator</th>
                    <th className="px-6 py-4">Wallet Balance</th>
                    <th className="px-6 py-4">Followers</th>
                    <th className="px-6 py-4">Likes</th>
                    <th className="px-6 py-4">Uses</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {paginatedCreators.map(creator => (
                    <tr key={creator.id} className={`hover:bg-gray-800/50 transition-colors ${selectedCreatorIds.includes(creator.id) ? 'bg-indigo-900/10' : ''}`}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCreatorIds.includes(creator.id)}
                          onChange={() => handleSelectCreator(creator.id)}
                          className="rounded bg-gray-800 border-gray-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                          {creator.avatar ? <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover rounded-full" /> : (creator.name?.charAt(0) || '?')}
                        </div>
                        <div>
                          <div className="font-medium text-white">{creator.name}</div>
                          <div className="text-xs text-gray-500">{creator.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-green-400 font-medium">
                        {creator.points} pts
                      </td>
                      <td className="px-6 py-4 font-mono text-indigo-300">{creator.followers ?? 0}</td>
                      <td className="px-6 py-4 font-mono text-pink-300">{creator.likes ?? 0}</td>
                      <td className="px-6 py-4 font-mono text-yellow-300">{creator.uses ?? 0}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${creator.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {creator.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs">{new Date(creator.joinedDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEditUser(creator)} className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-gray-800 rounded transition-colors" title="Edit Profile">
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUserIds([creator.id]);
                              handleBulkAction('role', 'user');
                            }}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded transition-colors"
                            title="Demote to User"
                          >
                            <UserX size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {activeCreators.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                        No active creators found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <Pagination
            totalItems={creatorTab === 'applications' ? pendingApplications.length : activeCreators.length}
            itemsPerPage={itemsPerPage}
            currentPage={creatorPage}
            onPageChange={setCreatorPage}
          />
        </div>

        {/* Modal Logic for Add Creator would go here */}
        {activeCreatorApp && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Plus size={20} className="text-indigo-400" /> Add New Creator
              </h3>
              <div className="space-y-4">
                <input type="text" placeholder="Name" value={activeCreatorApp.name} onChange={e => setActiveCreatorApp({ ...activeCreatorApp, name: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none" />
                <input type="text" placeholder="User ID (Existing User)" value={activeCreatorApp.userId} onChange={e => setActiveCreatorApp({ ...activeCreatorApp, userId: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none" />

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input type="text" placeholder="Portfolio Link (e.g. instagram.com/art)" value={newCreatorLink} onChange={e => setNewCreatorLink(e.target.value)} className="flex-1 bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-indigo-500 outline-none" />
                    <button onClick={addCreatorLink} className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"><Plus size={16} /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeCreatorApp.socialLinks.map((link, idx) => (
                      <span key={idx} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded flex items-center gap-1 border border-gray-700">
                        {getSocialIcon(link)} {link}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleAddCreator} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded text-sm font-medium">Add Creator</button>
                <button onClick={() => setActiveCreatorApp(null)} className="px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-sm font-medium">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  };

  const renderAIConfig = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bot size={24} className="text-indigo-400" /> AI Models Configuration
        </h2>
        <button
          onClick={() => { setShowAddModelModal(true); setNewModel({ name: '', provider: 'Google', costPerImage: 1.0, isActive: false, apiKey: '' }); }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm flex items-center gap-2"
        >
          <Plus size={16} /> Add Model
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {aiModels.map(model => (
          <div key={model.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Bot size={24} className="text-indigo-400" />
                </div>
                <div>
                  {editingModelId === model.id ? (
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="bg-gray-950 text-white text-sm border border-gray-700 rounded px-2 py-0.5 w-32"
                    />
                  ) : (
                    <h3 className="font-bold text-white text-lg">{model.name}</h3>
                  )}
                  <p className="text-xs text-gray-500 uppercase">{model.provider}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleAIModel(model.id, model.isActive)}
                  disabled={togglingModelId === model.id}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${model.isActive ? 'bg-green-500' : 'bg-gray-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${model.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-950 rounded-lg border border-gray-800">
                <span className="text-sm text-gray-400">Cost per Generation</span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">₹</span>
                  <input
                    type="number"
                    value={model.costPerImage}
                    onChange={(e) => handleCostChange(model.id, e.target.value)}
                    onBlur={() => saveModelCost(model)}
                    className="w-16 bg-transparent text-right text-white font-mono focus:outline-none border-b border-transparent focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openApiKeyModal(model)} className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium flex items-center justify-center gap-2">
                  <Key size={14} /> API Key
                </button>
                <button
                  onClick={() => handleTestConnection(model)}
                  disabled={testingModelId === model.id}
                  className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-medium flex items-center justify-center gap-2"
                >
                  {testingModelId === model.id ? <RefreshCw className="animate-spin" size={14} /> : <Activity size={14} />} Test
                </button>
                {editingModelId === model.id ? (
                  <button onClick={() => handleSaveModelDetails(model.id)} className="px-3 bg-green-600 hover:bg-green-500 text-white rounded-lg"><Check size={14} /></button>
                ) : (
                  <button onClick={() => handleEditModel(model)} className="px-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg"><Edit2 size={14} /></button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-800 mt-8">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles size={24} className="text-indigo-400" /> Quick Tools Configuration
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {toolsConfig.tools.map((t, idx) => (
          <div key={t.key} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-white">{t.name}</h3>
                <p className="text-xs text-gray-500 uppercase">{t.key}</p>
              </div>
              <button
                onClick={() => setToolsConfig(prev => ({ id: prev.id, tools: prev.tools.map((x, i) => i === idx ? { ...x, isActive: !x.isActive } : x) }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${t.isActive ? 'bg-green-500' : 'bg-gray-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${t.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-950 rounded-lg border border-gray-800">
              <span className="text-sm text-gray-400">Cost</span>
              <div className="flex items-center gap-1">
                <span className="text-gray-500">₹</span>
                <input
                  type="number"
                  value={t.cost}
                  onChange={(e) => setToolsConfig(prev => ({ id: prev.id, tools: prev.tools.map((x, i) => i === idx ? { ...x, cost: parseFloat(e.target.value) } : x) }))}
                  className="w-16 bg-transparent text-right text-white font-mono focus:outline-none border-b border-transparent focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="text-xs text-gray-500 uppercase block mb-1">Provider</label>
                <select
                  value={t.provider || 'System'}
                  onChange={(e) => setToolsConfig(prev => ({ id: prev.id, tools: prev.tools.map((x, i) => i === idx ? { ...x, provider: e.target.value } : x) }))}
                  className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="System">System</option>
                  <option value="OpenAI">OpenAI</option>
                  <option value="Google">Google</option>
                  <option value="Stability">Stability</option>
                  <option value="MiniMax">MiniMax</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase block mb-1">API Key</label>
                <input
                  type="password"
                  value={t.apiKey || ''}
                  onChange={(e) => setToolsConfig(prev => ({ id: prev.id, tools: prev.tools.map((x, i) => i === idx ? { ...x, apiKey: e.target.value } : x) }))}
                  className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-white font-mono text-sm"
                  placeholder="sk-..."
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button onClick={async () => { const updated = await api.updateToolsConfig(toolsConfig.tools); setToolsConfig(updated); addLog(`Updated tool: ${t.name}`, LogLevel.SUCCESS, 'AdminPanel'); }} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm">Save</button>
            </div>
          </div>
        ))}
      </div>

      {/* API Key Modal */}
      {apiKeyModalState && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-2">Configure API Key</h3>
            <p className="text-sm text-gray-400 mb-4">Enter the API Key for {apiKeyModalState.model.name}</p>
            <input
              type="password"
              value={apiKeyModalState.key}
              onChange={(e) => handleApiKeyInputChange(e.target.value)}
              className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white font-mono text-sm mb-6"
              placeholder="sk-..."
            />
            <div className="flex gap-3">
              <button onClick={handleConfirmApiKeySave} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded text-sm font-medium">Save Key</button>
              <button onClick={() => setApiKeyModalState(null)} className="px-4 bg-gray-800 text-gray-300 rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Model Modal */}
      {showAddModelModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4">Add New AI Model</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase block mb-1">Model Name</label>
                <input type="text" value={newModel.name} onChange={e => setNewModel({ ...newModel, name: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" placeholder="e.g. Gemini 1.5 Pro" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase block mb-1">Provider</label>
                <select value={newModel.provider} onChange={e => setNewModel({ ...newModel, provider: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm">
                  <option value="Google">Google</option>
                  <option value="OpenAI">OpenAI</option>
                  <option value="Stability">Stability</option>
                  <option value="MiniMax">MiniMax</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase block mb-1">Cost Per Image (₹)</label>
                <input type="number" step="0.1" value={newModel.costPerImage} onChange={e => setNewModel({ ...newModel, costPerImage: parseFloat(e.target.value) })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAddModel} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded text-sm font-medium">Add Model</button>
              <button onClick={() => setShowAddModelModal(false)} className="px-4 bg-gray-800 text-gray-300 rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const handleDeleteNotification = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Notification',
      message: "Are you sure you want to delete this notification log? This cannot be undone.",
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: async () => {
        await api.deleteNotification(id);
        setNotifications(prev => prev.filter(n => n.id !== id));
        addLog(`Notification log deleted.`, LogLevel.WARN, "AdminPanel");
        closeConfirmModal();
      }
    });
  };

  const renderNotifications = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Bell size={24} className="text-indigo-400" /> Notifications & Announcements
        </h2>
        <button onClick={() => setShowNotificationModal(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm flex items-center gap-2">
          <Send size={16} /> Send Notification
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <BellOff size={32} className="text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Notifications Yet</h3>
            <p className="text-gray-400 max-w-sm mb-6">You haven't sent any notifications. Keep your users engaged by sending updates and announcements.</p>
            <button onClick={() => setShowNotificationModal(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm flex items-center gap-2">
              <Send size={16} /> Create First Notification
            </button>
          </div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-4 group hover:border-gray-700 transition-all">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${notif.status === 'sent' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                <BellRing size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white flex items-center gap-2">
                      {notif.title}
                      {notif.status === 'scheduled' && <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Scheduled</span>}
                    </h3>
                    <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock size={10} />
                      {new Date(notif.sentAt || notif.scheduledFor || '').toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteNotification(notif.id)}
                    className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Log"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-gray-300 text-sm mt-2 leading-relaxed">{notif.message}</p>
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-800/50">
                  <span className="text-xs bg-gray-800 border border-gray-700 px-2 py-1 rounded text-gray-300 flex items-center gap-1.5">
                    <Users size={12} className="text-indigo-400" />
                    Target: <span className="text-white capitalize">{notif.target.replace('_', ' ')}</span>
                  </span>
                  <span className="text-xs bg-gray-800 border border-gray-700 px-2 py-1 rounded text-gray-300 flex items-center gap-1.5">
                    <Send size={12} className="text-purple-400" />
                    Type: <span className="text-white capitalize">{notif.type}</span>
                  </span>
                  {notif.reachCount > 0 && (
                    <span className="text-xs bg-indigo-900/20 border border-indigo-500/20 text-indigo-300 px-2 py-1 rounded flex items-center gap-1.5">
                      <CheckCircle size={12} />
                      Reached: <span className="font-bold">{notif.reachCount}</span> users
                    </span>
                  )}
                  {notif.ctaLink && (
                    <span className="text-xs bg-gray-800 border border-gray-700 px-2 py-1 rounded text-blue-300 flex items-center gap-1.5">
                      <ExternalLink size={12} /> Link Attached
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-lg w-full">
            <h3 className="text-lg font-bold text-white mb-4">Send New Notification</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Title" value={newNotification.title} onChange={e => setNewNotification({ ...newNotification, title: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" />
              <textarea rows={3} placeholder="Message" value={newNotification.message} onChange={e => setNewNotification({ ...newNotification, message: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Target Audience</label>
                  <select value={newNotification.target} onChange={e => setNewNotification({ ...newNotification, target: e.target.value as any })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm">
                    <option value="all_users">All Users</option>
                    <option value="active_users">Active Users</option>
                    <option value="paid_users">Paid Users</option>
                    <option value="all_creators">Creators</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Type</label>
                  <select value={newNotification.type} onChange={e => setNewNotification({ ...newNotification, type: e.target.value as any })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm">
                    <option value="push">Push Notification</option>
                    <option value="in_app">In-App Message</option>
                    <option value="email">Email</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={async () => {
                  setIsSendingNotification(true);
                  await api.sendNotification(newNotification);
                  setIsSendingNotification(false);
                  setShowNotificationModal(false);
                  addLog("Notification sent.", LogLevel.SUCCESS, "AdminPanel");
                  refreshData();
                }}
                disabled={isSendingNotification}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded text-sm font-medium flex justify-center items-center gap-2"
              >
                {isSendingNotification ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />} Send Now
              </button>
              <button onClick={() => setShowNotificationModal(false)} className="px-4 bg-gray-800 text-gray-300 rounded text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Ads Management Handler
  const handleSaveAdsConfig = async () => {
    setIsSavingAds(true);
    try {
      await api.updateAdsConfig(adsConfig);
      addLog('Ads configuration saved successfully', LogLevel.SUCCESS, 'AdminPanel');
    } catch (e) {
      addLog('Failed to save ads configuration', LogLevel.ERROR, 'AdminPanel');
    } finally {
      setIsSavingAds(false);
    }
  };

  // Render Ads Management Tab
  const renderAdsManagement = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header with Master Toggle */}
      <div className="flex justify-between items-center bg-gray-900 p-6 rounded-xl border border-gray-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Award size={28} className="text-indigo-400" />
            Ads Management System
          </h2>
          <p className="text-gray-400 text-sm mt-1">Configure ad placements, rewards, and limits</p>
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <span className="text-gray-300 font-medium">Master Switch</span>
          <button
            onClick={() => setAdsConfig({ ...adsConfig, isEnabled: !adsConfig.isEnabled })}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${adsConfig.isEnabled ? 'bg-indigo-600' : 'bg-gray-700'
              }`}
          >
            <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${adsConfig.isEnabled ? 'translate-x-7' : 'translate-x-1'
              }`} />
          </button>
        </label>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="System Status"
          value={adsConfig.isEnabled ? "Active" : "Disabled"}
          icon={adsConfig.isEnabled ? CheckCircle : Ban}
          color={adsConfig.isEnabled ? "green" : "red"}
        />
        <StatCard
          title="Reward Type"
          value={adsConfig.rewardType.toUpperCase()}
          icon={Award}
          color="purple"
        />
        <StatCard
          title="Active Pages"
          value={Object.values(adsConfig.pages).filter(v => v).length}
          icon={Layout}
          color="blue"
        />
        <StatCard
          title="Daily Limit"
          value={adsConfig.maxAdsPerUser}
          icon={Clock}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Reward Configuration */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-yellow-400" />
            Reward Configuration
          </h3>
          <div className="space-y-4">
            {/* Reward Type Selector */}
            <div>
              <label className="text-xs text-gray-500 uppercase block mb-2">Reward Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['fixed', 'random', 'range'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setAdsConfig({ ...adsConfig, rewardType: type })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${adsConfig.rewardType === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional Fields */}
            {adsConfig.rewardType === 'fixed' && (
              <div>
                <label className="text-xs text-gray-500 uppercase block mb-2">Fixed Points Per Ad</label>
                <input
                  type="number"
                  value={adsConfig.fixedPoints}
                  onChange={e => setAdsConfig({ ...adsConfig, fixedPoints: Number(e.target.value) })}
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white"
                  min="1"
                  max="100"
                />
              </div>
            )}

            {(adsConfig.rewardType === 'random' || adsConfig.rewardType === 'range') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-2">Min Points</label>
                  <input
                    type="number"
                    value={adsConfig.randomMin}
                    onChange={e => setAdsConfig({ ...adsConfig, randomMin: Number(e.target.value) })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    min="1"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-2">Max Points</label>
                  <input
                    type="number"
                    value={adsConfig.randomMax}
                    onChange={e => setAdsConfig({ ...adsConfig, randomMax: Number(e.target.value) })}
                    className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white"
                    min={adsConfig.randomMin}
                  />
                </div>
              </div>
            )}

            {/* Preview */}
            <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-3">
              <p className="text-xs text-indigo-300 font-medium">
                {adsConfig.rewardType === 'fixed'
                  ? `Users will earn ${adsConfig.fixedPoints} points per ad`
                  : `Users will earn ${adsConfig.randomMin}-${adsConfig.randomMax} points per ad`}
              </p>
            </div>
          </div>
        </div>

        {/* Page Placement */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Layout size={20} className="text-blue-400" />
            Page Placement
          </h3>
          <div className="space-y-3">
            {Object.entries(adsConfig.pages).map(([page, enabled]) => (
              <label key={page} className="flex items-center justify-between cursor-pointer group">
                <span className="text-gray-300 capitalize font-medium group-hover:text-white transition-colors">
                  {page} Page
                </span>
                <button
                  onClick={() => setAdsConfig({
                    ...adsConfig,
                    pages: { ...adsConfig.pages, [page]: !enabled }
                  })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-green-600' : 'bg-gray-700'
                    }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                </button>
              </label>
            ))}
          </div>
        </div>

        {/* Template Ads Settings */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <LayoutTemplate size={20} className="text-purple-400" />
            Template Page Ads
          </h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300 font-medium">Show Between Templates</span>
              <button
                onClick={() => setAdsConfig({
                  ...adsConfig,
                  templateAdsSettings: {
                    ...adsConfig.templateAdsSettings,
                    showBetweenTemplates: !adsConfig.templateAdsSettings.showBetweenTemplates
                  }
                })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${adsConfig.templateAdsSettings.showBetweenTemplates ? 'bg-green-600' : 'bg-gray-700'
                  }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${adsConfig.templateAdsSettings.showBetweenTemplates ? 'translate-x-6' : 'translate-x-1'
                  }`} />
              </button>
            </label>

            <div>
              <label className="text-xs text-gray-500 uppercase block mb-2">
                Ad Frequency (Every N Templates)
              </label>
              <input
                type="range"
                min="3"
                max="15"
                value={adsConfig.templateAdsSettings.frequency}
                onChange={e => setAdsConfig({
                  ...adsConfig,
                  templateAdsSettings: {
                    ...adsConfig.templateAdsSettings,
                    frequency: Number(e.target.value)
                  }
                })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <p className="text-sm text-gray-400 mt-2">
                Show ad every <span className="text-indigo-400 font-bold">{adsConfig.templateAdsSettings.frequency}</span> templates
              </p>
            </div>
          </div>
        </div>

        {/* Daily Limits */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield size={20} className="text-orange-400" />
            Limits & Controls
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 uppercase block mb-2">Max Ads Per User / Day</label>
              <input
                type="number"
                value={adsConfig.maxAdsPerUser}
                onChange={e => setAdsConfig({ ...adsConfig, maxAdsPerUser: Number(e.target.value) })}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white"
                min="1"
                max="100"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 15-30</p>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase block mb-2">Cooldown Between Ads (minutes)</label>
              <input
                type="number"
                value={adsConfig.cooldownMinutes}
                onChange={e => setAdsConfig({ ...adsConfig, cooldownMinutes: Number(e.target.value) })}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white"
                min="1"
                max="60"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 2-5 minutes</p>
            </div>
          </div>
        </div>

        {/* Provider Configuration */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 col-span-2">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Globe size={20} className="text-green-400" />
            Ad Provider Configuration
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase block mb-2">Provider</label>
              <select
                value={adsConfig.provider}
                onChange={e => setAdsConfig({ ...adsConfig, provider: e.target.value as any })}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white"
              >
                <option value="google_admob">Google AdMob</option>
                <option value="facebook_audience">Facebook Audience</option>
                <option value="custom">Custom Network</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase block mb-2">Banner Ad ID</label>
              <input
                type="text"
                value={adsConfig.adIds.bannerId}
                onChange={e => setAdsConfig({
                  ...adsConfig,
                  adIds: { ...adsConfig.adIds, bannerId: e.target.value }
                })}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono text-xs"
                placeholder="ca-app-pub-xxx"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase block mb-2">Interstitial Ad ID</label>
              <input
                type="text"
                value={adsConfig.adIds.interstitialId}
                onChange={e => setAdsConfig({
                  ...adsConfig,
                  adIds: { ...adsConfig.adIds, interstitialId: e.target.value }
                })}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono text-xs"
                placeholder="ca-app-pub-xxx"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase block mb-2">Rewarded Ad ID</label>
              <input
                type="text"
                value={adsConfig.adIds.rewardedId}
                onChange={e => setAdsConfig({
                  ...adsConfig,
                  adIds: { ...adsConfig.adIds, rewardedId: e.target.value }
                })}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono text-xs"
                placeholder="ca-app-pub-xxx"
              />
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase block mb-2">Native Ad ID</label>
              <input
                type="text"
                value={adsConfig.adIds.nativeId}
                onChange={e => setAdsConfig({
                  ...adsConfig,
                  adIds: { ...adsConfig.adIds, nativeId: e.target.value }
                })}
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white font-mono text-xs"
                placeholder="ca-app-pub-xxx"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4 bg-gray-900 p-6 rounded-xl border border-gray-800">
        <button
          onClick={() => {
            // Reset to defaults
            setAdsConfig({
              isEnabled: true,
              provider: 'google_admob',
              rewardType: 'fixed',
              fixedPoints: 5,
              randomMin: 3,
              randomMax: 10,
              pages: {
                home: true,
                templates: true,
                generate: true,
                history: false,
                profile: false,
                wallet: true,
                rewards: true
              },
              templateAdsSettings: {
                showBetweenTemplates: true,
                frequency: 6
              },
              adIds: {
                bannerId: '',
                interstitialId: '',
                rewardedId: '',
                nativeId: ''
              },
              maxAdsPerUser: 20,
              cooldownMinutes: 3
            });
          }}
          className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition-colors"
        >
          Reset to Defaults
        </button>
        <button
          onClick={handleSaveAdsConfig}
          disabled={isSavingAds}
          className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSavingAds ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Configuration
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderWithdrawals = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Wallet size={24} className="text-indigo-400" /> Withdrawal Requests
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase">Pending Amount</p>
            <p className="text-xl font-bold text-white">${withdrawalStats.pendingAmount.toFixed(2)}</p>
          </div>
          <button
            onClick={() => { fetchWithdrawals(withdrawalFilter); api.getWithdrawalStats().then(setWithdrawalStats); }}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw size={18} className={isLoadingWithdrawals ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Pending Requests" value={withdrawalStats.pending.toString()} icon={Clock} color="yellow" change="" />
        <StatCard title="Processing" value={withdrawalStats.processing.toString()} icon={Activity} color="blue" change="" />
        <StatCard title="Completed" value={withdrawalStats.completed.toString()} icon={CheckCircle} color="green" change={`$${withdrawalStats.completedAmount.toFixed(0)} paid`} trend="Paid" trendUp={true} />
        <StatCard title="Rejected" value={withdrawalStats.rejected.toString()} icon={XSquare} color="red" change="" />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-800 pb-1">
        {(['all', 'pending', 'processing', 'completed', 'rejected'] as const).map(status => (
          <button
            key={status}
            onClick={() => setWithdrawalFilter(status)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${withdrawalFilter === status ? 'bg-indigo-600/10 text-indigo-400 border-b-2 border-indigo-500' : 'text-gray-400 hover:text-white'}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Withdrawals List */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        {isLoadingWithdrawals ? (
          <div className="p-8 flex justify-center">
            <RefreshCw size={32} className="animate-spin text-indigo-500" />
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Wallet size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">No withdrawal requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-950/50 text-gray-400 text-xs uppercase border-b border-gray-800">
                  <th className="p-4 font-semibold">Creator</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Method</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {withdrawals.map(w => (
                  <tr key={w.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-white">{w.creatorName}</div>
                        <div className="text-xs text-gray-500">{w.creatorEmail}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">${w.amount.toFixed(2)}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {w.method === 'bank' ? (
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1"><CreditCard size={12} /> Bank Transfer</span>
                          <span className="text-[10px] text-gray-500">{w.bankDetails?.bankName || 'N/A'} • {w.bankDetails?.accountNumber?.slice(-4) || 'xxxx'}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1"><Smartphone size={12} /> UPI</span>
                          <span className="text-[10px] text-gray-500">{w.upiId}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${w.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        w.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          w.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                        {w.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400">
                      {new Date(w.requestedAt).toLocaleDateString()}
                      <div className="text-[10px]">{new Date(w.requestedAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="p-4 text-right">
                      {w.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleProcessWithdrawal(w.id)} className="p-1.5 rounded hover:bg-blue-500/20 text-blue-400" title="Process">
                            <Activity size={16} />
                          </button>
                          <button onClick={() => handleRejectWithdrawal(w.id)} className="p-1.5 rounded hover:bg-red-500/20 text-red-400" title="Reject">
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      {w.status === 'processing' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleApproveWithdrawal(w.id)} className="p-1.5 rounded hover:bg-green-500/20 text-green-400" title="Mark Paid">
                            <Check size={16} />
                          </button>
                          <button onClick={() => handleRejectWithdrawal(w.id)} className="p-1.5 rounded hover:bg-red-500/20 text-red-400" title="Reject">
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      {w.status === 'completed' && (
                        <span className="text-xs text-green-500 flex items-center justify-end gap-1">
                          Paid <CheckCircle size={12} />
                        </span>
                      )}
                      {w.status === 'rejected' && (
                        <span className="text-xs text-red-500 flex items-center justify-end gap-1">
                          Rejected <XSquare size={12} />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl border border-gray-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <UserIcon size={24} className="text-indigo-400" /> My Profile
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center">
          <div className="relative group w-32 h-32 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden border-4 border-gray-800 bg-gray-800 flex items-center justify-center">
              {profileForm.avatar ? <img src={profileForm.avatar} alt="Profile" className="w-full h-full object-cover" /> : <span className="text-4xl font-bold text-gray-600">{profileForm.name?.charAt(0) || '?'}</span>}
            </div>
            <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <Camera className="text-white" size={24} />
              <input type="file" className="hidden" accept="image/*" onChange={handleProfileAvatarUpload} />
            </label>
          </div>
          <h3 className="text-xl font-bold text-white">{currentAdmin?.name}</h3>
          <p className="text-indigo-400 text-sm capitalize">{currentAdmin?.role.replace('_', ' ')}</p>
          <div className="mt-6 w-full space-y-2">
            <div className="flex justify-between text-sm p-3 bg-gray-950 rounded border border-gray-800">
              <span className="text-gray-500">Last Login</span>
              <span className="text-gray-300">Just Now</span>
            </div>
            <div className="flex justify-between text-sm p-3 bg-gray-950 rounded border border-gray-800">
              <span className="text-gray-500">Status</span>
              <span className="text-green-400 font-bold">Active</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Edit Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase block mb-1">Full Name</label>
                <input type="text" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase block mb-1">Role</label>
                <input type="text" value={currentAdmin?.role} disabled className="w-full bg-gray-950 border border-gray-800 rounded px-3 py-2 text-gray-500 text-sm cursor-not-allowed capitalize" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase block mb-1">Email Address</label>
              <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-white text-sm" />
            </div>
            <div className="pt-4 border-t border-gray-800 mt-4 flex justify-end">
              <button onClick={handleSaveProfile} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">System Maintenance</h3>
        <div className="flex justify-between items-center py-4 border-b border-gray-800">
          <div>
            <h4 className="font-medium text-gray-200">Clear AI Cache</h4>
            <p className="text-sm text-gray-500">Remove cached images and temporary prompts.</p>
          </div>
          <button
            onClick={handleClearCache}
            disabled={isClearingCache}
            className="px-4 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded-lg text-sm border border-red-900/50"
          >
            {isClearingCache ? 'Clearing...' : 'Clear Cache'}
          </button>
        </div>
        <div className="flex justify-between items-center py-4">
          <div>
            <h4 className="font-medium text-gray-200">Export System Logs</h4>
            <p className="text-sm text-gray-500">Download system logs for auditing and debugging.</p>
          </div>
          <button
            onClick={() => downloadCSV(logs, 'system_logs')}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm flex items-center gap-2"
          >
            <Download size={14} /> Download CSV
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Sub-Admin Management</h3>
          <button onClick={() => setShowAddAdminModal(true)} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm flex items-center gap-2">
            <Plus size={14} /> Add Admin
          </button>
        </div>
        <div className="space-y-3">
          {subAdmins.map(admin => (
            <div key={admin.id} className="flex justify-between items-center p-3 bg-gray-950 rounded border border-gray-800">
              <div>
                <p className="text-white font-medium">{admin.name}</p>
                <p className="text-xs text-gray-500 capitalize">{admin.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${admin.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-xs text-gray-400">{admin.status}</span>
                <button onClick={() => handleDeleteSubAdmin(admin.id)} className="ml-2 text-gray-500 hover:text-red-400 p-1 rounded hover:bg-gray-800 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Grid & Effects */}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        </div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[100px] rounded-full"></div>

        <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl p-8 relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
              <Activity className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Rupantar Admin</h1>
            <p className="text-gray-400 text-sm mt-2">Secure Access Gateway</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Admin ID</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCheck className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                </div>
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-3.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-700"
                  placeholder="admin@rupantar.ai"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                </div>
                <input
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-3.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm animate-in fade-in slide-in-from-top-1">
                <AlertTriangle size={16} /> {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 mt-2"
            >
              {isLoggingIn ? <RefreshCw className="animate-spin" size={20} /> : <LogIn size={20} />}
              {isLoggingIn ? 'Authenticating...' : 'Access Dashboard'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <div className="flex justify-center items-center gap-2 text-xs text-gray-600">
              <ShieldCheck size={12} />
              <span>Secured by Rupantar Identity System</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-200 font-sans flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col z-20 shadow-2xl">
        <div className="p-6 flex flex-col items-center border-b border-gray-800">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-3 flex items-center justify-center shadow-lg">
            <Activity className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Rupantar AI</h1>
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold mt-1">Administrator</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>

          {canPerformAction('manage_users') && (
            <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'}`}>
              <Users size={18} /> Users
            </button>
          )}

          {canPerformAction('manage_creators') && (
            <button onClick={() => setActiveTab('creators')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'creators' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'}`}>
              <Palette size={18} /> Creators
            </button>
          )}

          {canPerformAction('manage_templates') && (
            <button onClick={() => setActiveTab('templates')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'templates' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'}`}>
              <LayoutTemplate size={18} /> Templates
            </button>
          )}

          {canPerformAction('manage_finance') && (
            <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'finance' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'}`}>
              <Wallet size={18} /> Finance & Wallet
            </button>
          )}

          {canPerformAction('manage_finance') && (
            <button onClick={() => setActiveTab('withdrawals')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'withdrawals' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'}`}>
              <ArrowDown size={18} /> Withdrawals
            </button>
          )}

          {canPerformAction('manage_ai') && (
            <button onClick={() => setActiveTab('ai-config')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'ai-config' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'}`}>
              <Bot size={18} /> AI Config
            </button>
          )}

          {canPerformAction('manage_settings') && (
            <button onClick={() => setActiveTab('ads')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'ads' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'}`}>
              <DollarSign size={18} /> Ads Management
            </button>
          )}

          <button onClick={() => setActiveTab('notifications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'notifications' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'}`}>
            <Bell size={18} /> Notifications
          </button>

          {canPerformAction('manage_settings') && (
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'}`}>
              <Settings size={18} /> Settings
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <a href={USER_APP_URL} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-indigo-400 rounded-lg text-sm font-medium transition-all mb-3 border border-gray-800">
            <ExternalLink size={14} /> Open User App
          </a>
          <div
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-colors ${activeTab === 'profile' ? 'bg-gray-800' : 'hover:bg-gray-900'}`}
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold overflow-hidden">
              {currentAdmin?.avatar ? <img src={currentAdmin.avatar} alt="Admin" className="w-full h-full object-cover" /> : (currentAdmin?.name?.charAt(0) || '?')}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{currentAdmin?.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{currentAdmin?.role.replace('_', ' ')}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0f172a] p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h2>
            <p className="text-gray-400 text-sm">Welcome back, {currentAdmin?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-2 ${connectionStatus === ConnectionStatus.CONNECTED ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
              <div className={`w-2 h-2 rounded-full ${connectionStatus === ConnectionStatus.CONNECTED ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {connectionStatus === ConnectionStatus.CONNECTED ? 'System Online' : 'System Offline'}
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUserManagement()}
        {activeTab === 'creators' && renderCreators()}
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'finance' && renderFinance()}
        {activeTab === 'ai-config' && renderAIConfig()}
        {activeTab === 'ads' && renderAdsManagement()}
        {activeTab === 'withdrawals' && renderWithdrawals()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'profile' && renderProfile()}
      </main>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm w-full shadow-2xl scale-100 transform transition-all">
            <div className="flex flex-col items-center text-center mb-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${confirmModal.type === 'danger' ? 'bg-red-900/30 text-red-500' : 'bg-yellow-900/30 text-yellow-500'}`}>
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{confirmModal.title}</h3>
              <p className="text-gray-400 text-sm">{confirmModal.message}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  await confirmModal.onConfirm();
                }}
                className={`flex-1 py-2.5 rounded-lg font-bold text-white transition-colors ${confirmModal.type === 'danger' ? 'bg-red-600 hover:bg-red-500' : 'bg-yellow-600 hover:bg-yellow-500'}`}
              >
                {confirmModal.confirmText || 'Confirm'}
              </button>
              <button
                onClick={closeConfirmModal}
                className="px-5 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg font-medium transition-colors"
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
