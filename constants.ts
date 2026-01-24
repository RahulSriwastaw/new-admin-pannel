
import { LogEntry, LogLevel, RepoConfig, User, CreatorApplication, AIModelConfig, Transaction, Template, PointsPackage, PaymentGatewayConfig, SubAdmin, AdminPermission, NotificationLog, FinanceConfig, Category } from './types';

// Environment / Config Constants
// Use BACKEND_URL for local dev, relative path for deployed proxy
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ((typeof window !== 'undefined' && window.location.origin.includes('replit.dev')) ? window.location.origin : "https://new-backend-g2gw.onrender.com");
export const API_BASE_URL = `${BACKEND_URL}/api`;

export const USER_APP_URL = "https://rupantara-fronted.vercel.app";
export const ADMIN_URL = "https://new-admin-pannel-nine.vercel.app/dashboard";

export const FRONTEND_REPO = "https://github.com/RahulSriwastaw/Rupantara-fronted.git";
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

export const PERMISSIONS_LIST: { key: AdminPermission; label: string; description: string }[] = [
  { key: 'manage_users', label: 'User Management', description: 'View, edit, ban, and manage user accounts.' },
  { key: 'manage_creators', label: 'Creator Management', description: 'Approve/Reject applications and manage creator earnings.' },
  { key: 'manage_templates', label: 'Template Management', description: 'Upload, approve, delete, and organize templates.' },
  { key: 'manage_finance', label: 'Finance & Wallet', description: 'View transactions, manage packages, and payment gateways.' },
  { key: 'manage_ai', label: 'AI Configuration', description: 'Configure AI models, costs, and API keys.' },
  { key: 'view_reports', label: 'Reports & Analytics', description: 'View system analytics, revenue reports, and logs.' },
  { key: 'manage_settings', label: 'System Settings', description: 'Access general settings and admin management.' },
];
