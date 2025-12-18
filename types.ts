
export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  ERROR = 'ERROR',
  CONNECTED = 'CONNECTED'
}

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  source: 'System' | 'Backend' | 'AdminPanel' | 'AI_Agent' | 'Database' | 'PaymentGateway';
}

export interface RepoConfig {
  name: string;
  url: string;
  type: 'backend' | 'frontend';
  status: 'online' | 'offline' | 'error';
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  requests: number;
  latency: number;
  activeUsers: number;
  revenue: number;
}

// Rupantar Specific Types

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'creator' | 'admin';
  points: number;
  status: 'active' | 'banned' | 'pending';
  joinedDate: string;
  avatar?: string;
  followers?: number;
  likes?: number;
  uses?: number;
}

export interface CreatorApplication {
  id: string;
  userId: string;
  name: string;
  socialLinks: string[];
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  demoTemplates?: Array<{ image: string; prompt: string }>;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  gateway: 'Razorpay' | 'Stripe' | 'System' | 'PhonePe';
  date: string;
  status: 'success' | 'failed';
}

export interface AIModelConfig {
  id: string;
  name: string;
  provider: 'Google' | 'OpenAI' | 'Stability' | 'MiniMax';
  costPerImage: number;
  isActive: boolean;
  apiKey?: string;
}

export interface Category {
  id: string;
  name: string;
  subCategories: string[];
}

export interface Template {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  subCategory?: string;
  prompt: string;
  negativePrompt?: string;

  description?: string;
  tags: string[]; // should be string[]
  gender: 'Male' | 'Female' | 'Unisex' | '';
  state: string;
  ageGroup: string;

  status: 'active' | 'draft';
  useCount: number;
  isPremium: boolean;
  source: 'manual' | 'bulk' | 'airtable';
}

export interface AirtableConfig {
  apiKey: string;
  baseId: string;
  tableName: string;
  lastSync?: string;
}

export interface PointsPackage {
  id: string;
  name: string;
  price: number;
  points: number;
  bonusPoints: number;
  isPopular: boolean;
  isActive: boolean;
  tag?: string;
}

export interface PaymentGatewayConfig {
  id: string;
  name: string;
  provider: 'Razorpay' | 'Stripe' | 'PayPal' | 'PhonePe';
  isActive: boolean;
  isTestMode: boolean;
  publicKey: string;
  secretKey: string;
  webhookSecret?: string;
}

export interface FinanceConfig {
  costPerCredit: number;
  currency: string;
  taxRate: number;
}

export interface ToolConfig {
  id: string;
  tools: { key: string; name: string; cost: number; isActive: boolean; provider?: string; apiKey?: string }[];
}

// Admin Management Types
export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'support';

export type AdminPermission =
  | 'manage_users'
  | 'manage_creators'
  | 'manage_templates'
  | 'manage_finance'
  | 'manage_ai'
  | 'manage_settings'
  | 'view_reports';

export interface SubAdmin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: AdminPermission[];
  status: 'active' | 'suspended';
  lastActive: string;
}

// Notification Types
export type NotificationTarget =
  | 'all_users'
  | 'all_creators'
  | 'active_users'
  | 'paid_users'   // Bought at least 1 pack
  | 'free_users'   // Never bought a pack
  | 'churned_users' // Inactive > 30 days
  | 'specific_user';

export type NotificationType = 'push' | 'in_app' | 'email';

export interface NotificationLog {
  id: string;
  title: string;
  message: string;
  target: NotificationTarget;
  type: NotificationType;
  status: 'sent' | 'scheduled' | 'failed';
  sentAt?: string;
  scheduledFor?: string; // ISO String for scheduled time
  reachCount: number;
  imageUrl?: string;
  ctaLink?: string; // Deep link or URL
}

// Ads Configuration Type
export interface AdsConfig {
  id?: string;
  isEnabled: boolean;
  provider: 'google_admob' | 'custom' | 'facebook_audience';

  // Reward Configuration
  rewardType: 'fixed' | 'random' | 'range';
  fixedPoints: number;
  randomMin: number;
  randomMax: number;

  // Page-wise Ad Placement
  pages: {
    home: boolean;
    templates: boolean;
    generate: boolean;
    history: boolean;
    profile: boolean;
    wallet: boolean;
    rewards: boolean;
  };

  // Template Page Settings
  templateAdsSettings: {
    showBetweenTemplates: boolean;
    frequency: number; // Show ad after every N templates
  };

  // Ad Provider IDs
  adIds: {
    bannerId: string;
    interstitialId: string;
    rewardedId: string;
    nativeId: string;
  };

  // Daily Limits
  maxAdsPerUser: number;
  cooldownMinutes: number;

  updatedAt?: string;
}

// Withdrawal Management Types
export interface Withdrawal {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorEmail: string;
  amount: number;
  method: 'bank' | 'upi';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  upiId?: string;
  requestedAt: string;
  processedAt?: string;
  transactionId?: string;
  remarks?: string;
}

export interface WithdrawalStats {
  pending: number;
  processing: number;
  completed: number;
  rejected: number;
  pendingAmount: number;
  completedAmount: number;
}

