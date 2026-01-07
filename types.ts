
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
  isVerified?: boolean;
  isWalletFrozen?: boolean;
}

export interface CreatorPaymentDetails {
  accountHolderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  panNumber?: string;
  upiId?: string;
  lastUpdated?: string;
}

export interface CreatorApplication {
  id: string;
  userId: string;
  name: string;
  socialLinks: string[];
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  demoTemplates?: Array<{ image: string; prompt: string }>;
  paymentDetails?: CreatorPaymentDetails;
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

export interface ActivityLog {
  ts: string;
  method: string;
  path: string;
  status: number;
  ms: number;
}

export interface AIModelConfig {
  id: string;
  key?: string; // API key for backend (gemini, minimax, stability)
  name: string;
  provider: 'Google' | 'OpenAI' | 'Stability' | 'MiniMax' | 'Replicate';
  costPerImage: number;
  isActive: boolean;
  apiKey?: string;
  config?: any;
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
  tags: string[];
  gender: 'Male' | 'Female' | 'Unisex' | '';
  state: string;
  ageGroup: string;

  status: 'active' | 'draft' | 'paused';
  useCount: number;
  isPremium: boolean;
  source: 'manual' | 'bulk' | 'airtable' | 'admin' | 'creator';

  // Template Type & Source
  type?: 'Official' | 'Creator';
  isOfficial?: boolean;
  creatorId?: string;

  // Approval Workflow
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvedAt?: string;
  rejectedAt?: string;
  submittedAt?: string;
  approvedBy?: string;

  // Display & Features
  isFeatured?: boolean;
  isPaused?: boolean;

  // Image Positioning & Input
  inputImage?: string;
  inputImagePosition?: string;
  demoImagePosition?: string;
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
  // Credentials (publicKey, secretKey) are stored in environment variables, not in database
}

export interface FinanceConfig {
  costPerCredit: number;
  currency: string;
  taxRate: number;
}

export interface ToolConfig {
  id: string;
  tools: { key: string; name: string; cost: number; isActive: boolean; provider?: string; apiKey?: string; modelIdentifier?: string }[];
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
  | 'paid_users'
  | 'free_users'
  | 'churned_users'
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
  scheduledFor?: string;
  reachCount: number;
  imageUrl?: string;
  ctaLink?: string;
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

export interface CreatorProfile {
  creator: {
    id: string;
    name: string;
    email: string;
    username: string;
    photoURL?: string;
    status: 'active' | 'banned' | 'pending' | 'suspended';
    isVerified: boolean;
    isWalletFrozen: boolean;
    joinedDate: string;
    suspensionReason?: string;
    suspendedUntil?: string;
  };
  stats: {
    totalTemplates: number;
    totalUses: number;
    totalFollowers: number;
    totalLikes: number;
    totalSaves: number;
    totalEarnings: number;
    totalEarningsINR: number;
    thisMonthEarnings: number;
    lastMonthEarnings: number;
    pendingWithdrawal: number;
    rank: number;
  };
  paymentDetails?: CreatorPaymentDetails;
  recentActivity: Array<{
    date: string;
    action: string;
    details: string;
    adminName?: string;
  }>;
}

export interface CreatorTemplateResponse {
  templates: Array<{
    id: string;
    title: string;
    imageUrl: string;
    category: string;
    isPremium: boolean;
    pointsCost: number;
    useCount: number;
    likeCount: number;
    savesCount: number;
    earningsGenerated: number;
    approvalStatus: 'pending' | 'approved' | 'rejected';
    isPaused: boolean;
    status: string;
    createdAt: string;
    rejectionReason?: string;
    adminNotes?: string;
  }>;
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface CreatorEarningsResponse {
  summary: {
    totalLifetime: number;
    thisMonth: number;
    lastMonth: number;
    pendingWithdrawal: number;
  };
  chartData: {
    daily: Array<{ date: string; earnings: number }>;
  };
  templateBreakdown: Array<{
    templateId: string;
    templateName: string;
    uses: number;
    pointsEarned: number;
    platformCommission: number;
    netEarnings: number;
  }>;
}

export interface CreatorWithdrawal {
  id: string;
  amount: number;
  method: 'bank' | 'upi';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  transactionId?: string;
  utr?: string;
  remarks?: string;
  adminNotes?: string;
  proofOfPayment?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
  };
  upiId?: string;
  processedBy?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreatorWithdrawalsResponse {
  withdrawals: CreatorWithdrawal[];
  stats: {
    totalRequests: number;
    pending: number;
    processing: number;
    completed: number;
    rejected: number;
    totalWithdrawn: number;
  };
}

export interface CreatorFollowersResponse {
  totalFollowers: number;
  growthData: Array<{ date: string; count: number }>;
  topFollowers: User[];
}

export interface CreatorEngagementResponse {
  engagementRate: number;
  topPerformingTemplates: Array<{
    id: string;
    title: string;
    imageUrl: string;
    useCount: number;
    likeCount: number;
    savesCount: number;
    viewCount: number;
    score: number;
  }>;
}

export interface CreatorActivityLog {
  date: string;
  type: 'admin_action' | 'template_upload' | 'withdrawal_request' | 'earning';
  description: string;
  metadata?: any;
}

export interface CreatorActivityLogsResponse {
  logs: CreatorActivityLog[];
}

export interface TemplateAnalyticsResponse {
  template: {
    id: string;
    title: string;
    imageUrl: string;
    category: string;
    creator: any;
    createdAt: string;
  };
  analytics: {
    useCount: number;
    viewCount: number;
    likeCount: number;
    savesCount: number;
    earningsGenerated: number;
    conversionRate: string;
  };
  earningsHistory: Array<{
    date: string;
    pointsEarned: number;
    usageCount: number;
  }>;
}

