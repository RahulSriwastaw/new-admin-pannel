
import { LogEntry, LogLevel, RepoConfig, User, CreatorApplication, AIModelConfig, Transaction, Template, PointsPackage, PaymentGatewayConfig, SubAdmin, AdminPermission, NotificationLog, FinanceConfig, Category } from './types';

// Environment / Config Constants
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://new-backend-production-ad5a.up.railway.app";
export const API_BASE_URL = `${BACKEND_URL}/api`;

export const USER_APP_URL = "https://rupantara-fronted.vercel.app";
export const ADMIN_URL = "https://new-admin-pannel-nine.vercel.app/dashboard";

export const FRONTEND_REPO = "https://github.com/RahulSriwastaw/new-admin-pannel.git";
export const BACKEND_REPO = "https://github.com/RahulSriwastaw/new-backend.git";

export const CLOUDINARY_CONFIG = {
  userUploads: { cloudName: "dno47zdrh", apiKey: "323385711182591" },
  creatorDemo: { cloudName: "dmbrs338o", apiKey: "943571584978134" },
  generatedImages: { cloudName: "dkeigiajt", apiKey: "683965962197886" }
};

export const FIREBASE_CONFIG = {
  projectId: "rupantra-ai",
  authDomain: "rupantra-ai.firebaseapp.com",
  storageBucket: "rupantra-ai.firebasestorage.app"
};

export const INITIAL_REPOS: RepoConfig[] = [
  {
    name: "Rupantar Backend (Railway)",
    url: BACKEND_URL,
    type: "backend",
    status: "error" // Initial state before check
  },
  {
    name: "Rupantar User App (Vercel)",
    url: USER_APP_URL,
    type: "frontend",
    status: "online"
  },
  {
    name: "Admin Panel (Vercel)",
    url: ADMIN_URL,
    type: "frontend",
    status: "online"
  }
];

// Mock Data as Fallback
export const MOCK_USERS: User[] = [
  { id: 'U001', name: 'Rahul Sriwastaw', email: 'rahul@example.com', role: 'admin', points: 5000, status: 'active', joinedDate: '2024-01-15', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60' },
  { id: 'U002', name: 'Priya Sharma', email: 'priya@example.com', role: 'creator', points: 1250, status: 'active', joinedDate: '2024-02-01', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' },
  { id: 'U003', name: 'Amit Verma', email: 'amit@example.com', role: 'user', points: 50, status: 'active', joinedDate: '2024-03-10' },
  { id: 'U004', name: 'Sneha Gupta', email: 'sneha@example.com', role: 'user', points: 0, status: 'banned', joinedDate: '2024-03-12', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60' },
  { id: 'U005', name: 'Vikram Singh', email: 'vikram@example.com', role: 'creator', points: 8900, status: 'active', joinedDate: '2024-01-20' },
];

export const MOCK_APPLICATIONS: CreatorApplication[] = [
  { id: 'APP001', userId: 'U006', name: 'Rohan Mehra', socialLinks: ['instagram.com/rohanart'], status: 'pending', appliedDate: '2024-03-14' },
  { id: 'APP002', userId: 'U007', name: 'Anjali D.', socialLinks: ['behance.net/anjali'], status: 'pending', appliedDate: '2024-03-15' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TXN001', userId: 'U002', amount: 199, type: 'credit', description: 'Ultimate Pack Purchase', gateway: 'Razorpay', date: '2024-03-15T10:30:00', status: 'success' },
  { id: 'TXN002', userId: 'U003', amount: 49, type: 'credit', description: 'Pro Pack Purchase', gateway: 'PhonePe', date: '2024-03-14T14:20:00', status: 'success' },
  { id: 'TXN003', userId: 'U005', amount: 1500, type: 'debit', description: 'Creator Payout', gateway: 'System', date: '2024-03-10T09:00:00', status: 'success' },
];

export const INITIAL_AI_MODELS: AIModelConfig[] = [
  { id: 'AI01', name: 'Google Gemini (Imagen 3)', provider: 'Google', costPerImage: 1.2, isActive: true, apiKey: '' },
  { id: 'AI02', name: 'MiniMax AI', provider: 'MiniMax', costPerImage: 0.8, isActive: false, apiKey: '' },
  { id: 'AI03', name: 'OpenAI DALL-E 3', provider: 'OpenAI', costPerImage: 2.5, isActive: false, apiKey: '' },
  { id: 'AI04', name: 'Stability AI (SDXL)', provider: 'Stability', costPerImage: 0.5, isActive: false, apiKey: '' },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'C01', name: 'Sci-Fi', subCategories: ['Cyberpunk', 'Space', 'Robots', 'Futuristic City'] },
  { id: 'C02', name: 'Portrait', subCategories: ['Realistic', 'Anime', 'Oil Painting', 'Studio', 'Vintage'] },
  { id: 'C03', name: 'Landscape', subCategories: ['Nature', 'Urban', 'Fantasy', 'Surreal'] },
  { id: 'C04', name: 'Abstract', subCategories: ['Fluid', 'Geometric', 'Fractal'] },
  { id: 'C05', name: 'Anime', subCategories: ['Manga', 'Chibi', 'Mecha'] },
  { id: 'C06', name: 'General', subCategories: ['Misc'] }
];

export const MOCK_TEMPLATES: Template[] = [
  { 
    id: 'T001', 
    title: 'Cyberpunk Warrior', 
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60', 
    category: 'Sci-Fi',
    subCategory: 'Cyberpunk', 
    prompt: 'cyberpunk street samurai, neon lights, raining, detailed armor', 
    status: 'active', 
    useCount: 1250, 
    isPremium: true,
    source: 'manual'
  },
  { 
    id: 'T002', 
    title: 'Vintage Portrait', 
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60', 
    category: 'Portrait',
    subCategory: 'Vintage', 
    prompt: 'vintage 1950s portrait, film grain, soft lighting', 
    status: 'active', 
    useCount: 890, 
    isPremium: false,
    source: 'airtable'
  },
  { 
    id: 'T003', 
    title: 'Fantasy Landscape', 
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=60', 
    category: 'Landscape',
    subCategory: 'Fantasy', 
    prompt: 'floating islands, waterfalls, magical clouds, fantasy art style', 
    status: 'draft', 
    useCount: 0, 
    isPremium: true,
    source: 'manual'
  },
];

export const MOCK_POINTS_PACKAGES: PointsPackage[] = [
  { id: 'PKG01', name: 'Mini Pack', price: 9, points: 50, bonusPoints: 0, isPopular: false, isActive: true, tag: 'Best for Beginners' },
  { id: 'PKG02', name: 'Pro Pack', price: 49, points: 300, bonusPoints: 50, isPopular: true, isActive: true, tag: 'Most Popular' },
  { id: 'PKG03', name: 'Ultimate Pack', price: 199, points: 1500, bonusPoints: 300, isPopular: false, isActive: true, tag: 'Best Value' },
];

export const MOCK_PAYMENT_GATEWAYS: PaymentGatewayConfig[] = [
  { id: 'GW01', name: 'Razorpay', provider: 'Razorpay', isActive: true, isTestMode: true, publicKey: '', secretKey: '' },
  { id: 'GW02', name: 'Stripe', provider: 'Stripe', isActive: false, isTestMode: true, publicKey: '', secretKey: '' },
  { id: 'GW03', name: 'PhonePe', provider: 'PhonePe', isActive: false, isTestMode: true, publicKey: '', secretKey: '' },
  { id: 'GW04', name: 'PayPal', provider: 'PayPal', isActive: false, isTestMode: true, publicKey: '', secretKey: '' },
];

export const INITIAL_FINANCE_CONFIG: FinanceConfig = {
  costPerCredit: 0.20,
  currency: 'INR',
  taxRate: 18
};

export const MOCK_LOGS: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    level: LogLevel.INFO,
    message: 'Rupantar Admin System Initialized v1.0.0',
    source: 'System'
  },
  {
    id: '2',
    timestamp: new Date().toISOString(),
    level: LogLevel.INFO,
    message: 'Connecting to MongoDB Cluster...',
    source: 'Database'
  },
  {
    id: '3',
    timestamp: new Date().toISOString(),
    level: LogLevel.SUCCESS,
    message: 'Cloudinary Buckets (3/3) Connected.',
    source: 'System'
  }
];

export const INITIAL_SYSTEM_METRICS = {
  cpu: 12,
  memory: 45,
  requests: 1450,
  latency: 120,
  activeUsers: 842,
  revenue: 45600
};

// Sub Admin Data
export const MOCK_SUB_ADMINS: SubAdmin[] = [
  { 
    id: 'SA001', 
    name: 'Rahul Malik', 
    email: 'Rahul@Malik', 
    role: 'super_admin', 
    permissions: ['manage_users', 'manage_creators', 'manage_templates', 'manage_finance', 'manage_ai', 'manage_settings', 'view_reports'], 
    status: 'active',
    lastActive: new Date().toISOString()
  },
  { 
    id: 'SA002', 
    name: 'Content Moderator', 
    email: 'mod@rupantar.ai', 
    role: 'moderator', 
    permissions: ['manage_templates', 'manage_creators'], 
    status: 'active',
    lastActive: new Date(Date.now() - 86400000).toISOString()
  },
  { 
    id: 'SA003', 
    name: 'Support Staff', 
    email: 'help@rupantar.ai', 
    role: 'support', 
    permissions: ['manage_users'], 
    status: 'active',
    lastActive: new Date(Date.now() - 3600000).toISOString()
  }
];

export const PERMISSIONS_LIST: { key: AdminPermission; label: string; description: string }[] = [
  { key: 'manage_users', label: 'User Management', description: 'View, edit, ban, and manage user accounts.' },
  { key: 'manage_creators', label: 'Creator Management', description: 'Approve/Reject applications and manage creator earnings.' },
  { key: 'manage_templates', label: 'Template Management', description: 'Upload, approve, delete, and organize templates.' },
  { key: 'manage_finance', label: 'Finance & Wallet', description: 'View transactions, manage packages, and payment gateways.' },
  { key: 'manage_ai', label: 'AI Configuration', description: 'Configure AI models, costs, and API keys.' },
  { key: 'view_reports', label: 'Reports & Analytics', description: 'View system analytics, revenue reports, and logs.' },
  { key: 'manage_settings', label: 'System Settings', description: 'Access general settings and admin management.' },
];

export const MOCK_NOTIFICATIONS: NotificationLog[] = [
  { 
    id: 'N001', 
    title: 'Welcome to Rupantar AI!', 
    message: 'Start generating amazing images with our new AI models.', 
    target: 'all_users', 
    type: 'push', 
    status: 'sent', 
    sentAt: '2024-03-01T10:00:00', 
    reachCount: 1250 
  },
  { 
    id: 'N002', 
    title: 'Creator Payouts Processed', 
    message: 'Your monthly earnings have been credited to your wallet.', 
    target: 'all_creators', 
    type: 'in_app', 
    status: 'sent', 
    sentAt: '2024-03-05T09:30:00', 
    reachCount: 45 
  },
  { 
    id: 'N003', 
    title: 'Diwali Offer: 50% Extra Points', 
    message: 'Get 50% extra points on all Ultimate Pack purchases today!', 
    target: 'paid_users', 
    type: 'push', 
    status: 'scheduled', 
    scheduledFor: '2024-11-01T00:00:00', 
    ctaLink: '/buy-points',
    reachCount: 0 
  }
];
