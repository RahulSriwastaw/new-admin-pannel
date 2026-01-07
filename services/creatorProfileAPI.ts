/**
 * Creator Profile API Service
 * Handles all API calls related to creator profile management
 */

import { API_BASE_URL } from '../constants';
import type {
    CreatorProfile,
    CreatorTemplateResponse,
    CreatorEarningsResponse,
    CreatorWithdrawalsResponse,
    CreatorFollowersResponse,
    CreatorEngagementResponse,
    CreatorActivityLogsResponse,
    TemplateAnalyticsResponse
} from '../types';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const creatorProfileAPI = {
    // Get full creator profile
    getProfile: async (creatorId: string): Promise<CreatorProfile> => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/${creatorId}/profile`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch creator profile');
        return res.json();
    },

    // Get creator templates (paginated)
    getTemplates: async (
        creatorId: string,
        params?: { page?: number; limit?: number; status?: string; sort?: string }
    ): Promise<CreatorTemplateResponse> => {
        const query = new URLSearchParams();
        if (params?.page) query.set('page', String(params.page));
        if (params?.limit) query.set('limit', String(params.limit));
        if (params?.status) query.set('status', params.status);
        if (params?.sort) query.set('sort', params.sort);

        const res = await fetch(
            `${API_BASE_URL}/admin/creators/${creatorId}/templates?${query.toString()}`,
            { headers: getAuthHeaders() }
        );
        if (!res.ok) throw new Error('Failed to fetch creator templates');
        return res.json();
    },

    // Get creator earnings
    getEarnings: async (creatorId: string): Promise<CreatorEarningsResponse> => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/${creatorId}/earnings`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch creator earnings');
        return res.json();
    },

    // Get creator withdrawals
    getWithdrawals: async (creatorId: string): Promise<CreatorWithdrawalsResponse> => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/${creatorId}/withdrawals`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch creator withdrawals');
        return res.json();
    },

    // Approve withdrawal
    approveWithdrawal: async (
        creatorId: string,
        withdrawalId: string,
        data: { transactionId: string; utr?: string; proofUrl?: string; adminNotes?: string }
    ) => {
        const res = await fetch(
            `${API_BASE_URL}/admin/creators/${creatorId}/withdrawals/${withdrawalId}/approve`,
            {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            }
        );
        if (!res.ok) throw new Error('Failed to approve withdrawal');
        return res.json();
    },

    // Reject withdrawal
    rejectWithdrawal: async (
        creatorId: string,
        withdrawalId: string,
        data: { reason: string; adminNotes?: string }
    ) => {
        const res = await fetch(
            `${API_BASE_URL}/admin/creators/${creatorId}/withdrawals/${withdrawalId}/reject`,
            {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            }
        );
        if (!res.ok) throw new Error('Failed to reject withdrawal');
        return res.json();
    },

    // Get followers & engagement data
    getFollowers: async (creatorId: string): Promise<CreatorFollowersResponse> => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/${creatorId}/followers`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch followers data');
        return res.json();
    },

    // Get engagement metrics
    getEngagement: async (creatorId: string): Promise<CreatorEngagementResponse> => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/${creatorId}/engagement`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch engagement data');
        return res.json();
    },

    // Get activity logs
    getActivityLogs: async (
        creatorId: string,
        params?: { type?: string; limit?: number }
    ): Promise<CreatorActivityLogsResponse> => {
        const query = new URLSearchParams();
        if (params?.type) query.set('type', params.type);
        if (params?.limit) query.set('limit', String(params.limit));

        const res = await fetch(
            `${API_BASE_URL}/admin/creators/${creatorId}/activity-logs?${query.toString()}`,
            { headers: getAuthHeaders() }
        );
        if (!res.ok) throw new Error('Failed to fetch activity logs');
        return res.json();
    },

    // Admin Actions

    // Suspend creator
    suspendCreator: async (creatorId: string, data: { reason: string; duration?: number }) => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/${creatorId}/suspend`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to suspend creator');
        return res.json();
    },

    // Unsuspend creator
    unsuspendCreator: async (creatorId: string) => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/${creatorId}/unsuspend`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to unsuspend creator');
        return res.json();
    },

    // Verify creator
    verifyCreator: async (creatorId: string) => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/${creatorId}/verify`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to verify creator');
        return res.json();
    },

    // Unverify creator
    unverifyCreator: async (creatorId: string) => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/${creatorId}/unverify`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to unverify creator');
        return res.json();
    },

    // Freeze wallet
    freezeWallet: async (creatorId: string, data: { reason: string }) => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/${creatorId}/freeze-wallet`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to freeze wallet');
        return res.json();
    },

    // Unfreeze wallet
    unfreezeWallet: async (creatorId: string) => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/${creatorId}/unfreeze-wallet`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to unfreeze wallet');
        return res.json();
    },

    // Send notification
    sendNotification: async (
        creatorId: string,
        data: { title: string; message: string; type?: string }
    ) => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/${creatorId}/send-notification`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to send notification');
        return res.json();
    },

    // Login as creator (support mode)
    loginAsCreator: async (creatorId: string) => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/${creatorId}/login-as-creator`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to generate support token');
        return res.json();
    },

    // Template Management Actions

    // Approve template
    approveTemplate: async (templateId: string) => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/templates/${templateId}/approve`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to approve template');
        return res.json();
    },

    // Reject template
    rejectTemplate: async (templateId: string, data: { reason: string }) => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/templates/${templateId}/reject`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to reject template');
        return res.json();
    },

    // Toggle pause template
    togglePauseTemplate: async (templateId: string) => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/templates/${templateId}/toggle-pause`, {
            method: 'POST',
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to toggle template pause');
        return res.json();
    },

    // Delete template
    deleteTemplate: async (templateId: string) => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/templates/${templateId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete template');
        return res.json();
    },

    // Get template analytics
    getTemplateAnalytics: async (templateId: string): Promise<TemplateAnalyticsResponse> => {
        const res = await fetch(`${API_BASE_URL}/admin/creators/templates/${templateId}/analytics`, {
            headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch template analytics');
        return res.json();
    }
};
