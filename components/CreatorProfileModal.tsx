import React, { useState, useEffect } from 'react';
import { creatorProfileAPI } from '../services/creatorProfileAPI';
import type { CreatorProfile } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface CreatorProfileModalProps {
    creatorId: string;
    isOpen: boolean;
    onClose: () => void;
}

const CreatorProfileModal: React.FC<CreatorProfileModalProps> = ({
    creatorId,
    isOpen,
    onClose
}) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [profile, setProfile] = useState<CreatorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && creatorId) {
            loadProfile();
        }
    }, [isOpen, creatorId]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await creatorProfileAPI.getProfile(creatorId);
            setProfile(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load creator profile');
            console.error('Error loading profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdminAction = async (action: string, payload?: any) => {
        try {
            switch (action) {
                case 'suspend':
                    await creatorProfileAPI.suspendCreator(creatorId, payload);
                    break;
                case 'unsuspend':
                    await creatorProfileAPI.unsuspendCreator(creatorId);
                    break;
                case 'verify':
                    await creatorProfileAPI.verifyCreator(creatorId);
                    break;
                case 'unverify':
                    await creatorProfileAPI.unverifyCreator(creatorId);
                    break;
                case 'freezeWallet':
                    await creatorProfileAPI.freezeWallet(creatorId, payload);
                    break;
                case 'unfreezeWallet':
                    await creatorProfileAPI.unfreezeWallet(creatorId);
                    break;
                case 'sendNotification':
                    await creatorProfileAPI.sendNotification(creatorId, payload);
                    break;
                case 'loginAsCreator':
                    const { supportToken } = await creatorProfileAPI.loginAsCreator(creatorId);
                    // Open creator dashboard in new tab with support token
                    window.open(`${window.location.origin}/creator?token=${supportToken}`, '_blank');
                    return;
            }
            // Reload profile after action
            await loadProfile();
            alert(`Action '${action}' completed successfully!`);
        } catch (err: any) {
            alert(`Failed to ${action}: ${err.message}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                overflow: 'auto'
            }}
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: '#1a1a2e',
                    borderRadius: '16px',
                    width: '95%',
                    maxWidth: '1400px',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '24px 32px',
                        borderBottom: '1px solid #2a2a3e',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <h2 style={{ color: '#fff', margin: 0, fontSize: '24px', fontWeight: '600' }}>
                        Creator Profile
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#888',
                            fontSize: '28px',
                            cursor: 'pointer',
                            padding: '0',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2a2a3e';
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#888';
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Loading/Error States */}
                {loading && (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#888' }}>
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                border: '4px solid #2a2a3e',
                                borderTopColor: '#6366f1',
                                borderRadius: '50%',
                                margin: '0 auto 16px',
                                animation: 'spin 0.8s linear infinite'
                            }}
                        />
                        <p>Loading creator profile...</p>
                    </div>
                )}

                {error && (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <div
                            style={{
                                backgroundColor: '#dc2626',
                                color: '#fff',
                                padding: '16px 24px',
                                borderRadius: '8px',
                                marginBottom: '16px'
                            }}
                        >
                            ❌ {error}
                        </div>
                        <button
                            onClick={loadProfile}
                            style={{
                                backgroundColor: '#6366f1',
                                color: '#fff',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Main Content */}
                {!loading && !error && profile && profile.stats && (
                    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                        {/* Creator Header Section */}
                        <CreatorHeader creator={profile.creator} stats={profile.stats} onAction={handleAdminAction} />

                        {/* Tab Navigation */}
                        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

                        {/* Tab Content */}
                        <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
                            <TabContent
                                activeTab={activeTab}
                                creatorId={creatorId}
                                profile={profile}
                                onRefresh={loadProfile}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Add keyframes animation for spinner */}
            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

interface CreatorHeaderProps {
    creator: CreatorProfile['creator'];
    stats: CreatorProfile['stats'];
    onAction: (action: string, payload?: any) => Promise<void>;
}

const CreatorHeader: React.FC<CreatorHeaderProps> = ({ creator, stats, onAction }) => {
    const [showActions, setShowActions] = useState(false);

    if (!creator) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return '#10b981';
            case 'suspended':
                return '#f59e0b';
            case 'banned':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const statCards = [
        { label: 'Templates', value: stats.totalTemplates || 0, icon: '📄' },
        { label: 'Total Uses', value: (stats.totalUses || 0).toLocaleString(), icon: '🔥' },
        { label: 'Followers', value: (stats.totalFollowers || 0).toLocaleString(), icon: '👥' },
        { label: 'Earnings (₹)', value: `₹${(stats.totalEarningsINR || 0).toLocaleString()}`, icon: '💰' },
        { label: 'This Month', value: `₹${(stats.thisMonthEarnings || 0).toLocaleString()}`, icon: '📈' },
        { label: 'Rank', value: `#${stats.rank || 'N/A'}`, icon: '🏆' }
    ];

    return (
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #2a2a3e' }}>
            {/* Profile Info */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '24px' }}>
                <img
                    src={creator?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator?.name || 'User')}&size=128&background=6366f1&color=fff`}
                    alt={creator.name}
                    style={{
                        width: '96px',
                        height: '96px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '4px solid #2a2a3e'
                    }}
                />
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{ color: '#fff', margin: 0, fontSize: '28px', fontWeight: '600' }}>
                            {creator.name}
                        </h3>
                        {creator.isVerified && (
                            <span
                                title="Verified Creator"
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: '#fff',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                ✓ Verified
                            </span>
                        )}
                        <span
                            style={{
                                backgroundColor: getStatusColor(creator.status),
                                color: '#fff',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                textTransform: 'capitalize'
                            }}
                        >
                            {creator.status}
                        </span>
                        {creator.isWalletFrozen && (
                            <span
                                style={{
                                    backgroundColor: '#f59e0b',
                                    color: '#fff',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}
                            >
                                🧊 Wallet Frozen
                            </span>
                        )}
                    </div>
                    <p style={{ color: '#888', margin: '0 0 4px 0', fontSize: '14px' }}>
                        @{creator.username} • {creator.email}
                    </p>
                    <p style={{ color: '#666', margin: '0', fontSize: '13px' }}>
                        Joined {new Date(creator.joinedDate).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </p>
                </div>

                {/* Quick Actions */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowActions(!showActions)}
                        style={{
                            backgroundColor: '#2a2a3e',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        Actions ▼
                    </button>
                    {showActions && (
                        <div
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: '48px',
                                backgroundColor: '#2a2a3e',
                                borderRadius: '8px',
                                padding: '8px',
                                minWidth: '200px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                                zIndex: 10
                            }}
                        >
                            {creator.status === 'suspended' ? (
                                <ActionButton onClick={() => onAction('unsuspend')}>✅ Unsuspend</ActionButton>
                            ) : (
                                <ActionButton onClick={() => {
                                    const reason = prompt('Suspension reason:');
                                    if (reason) onAction('suspend', { reason, duration: 7 });
                                }}>
                                    🚫 Suspend
                                </ActionButton>
                            )}
                            {creator.isVerified ? (
                                <ActionButton onClick={() => onAction('unverify')}>❌ Remove Verification</ActionButton>
                            ) : (
                                <ActionButton onClick={() => onAction('verify')}>✓ Verify Creator</ActionButton>
                            )}
                            {creator.isWalletFrozen ? (
                                <ActionButton onClick={() => onAction('unfreezeWallet')}>🔓 Unfreeze Wallet</ActionButton>
                            ) : (
                                <ActionButton onClick={() => {
                                    const reason = prompt('Freeze reason:');
                                    if (reason) onAction('freezeWallet', { reason });
                                }}>
                                    🧊 Freeze Wallet
                                </ActionButton>
                            )}
                            <ActionButton onClick={() => {
                                const title = prompt('Notification title:');
                                const message = prompt('Notification message:');
                                if (title && message) onAction('sendNotification', { title, message });
                            }}>
                                📧 Send Notification
                            </ActionButton>
                            <ActionButton onClick={() => onAction('loginAsCreator')}>🔓 Login as Creator</ActionButton>
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        style={{
                            backgroundColor: '#2a2a3e',
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1px solid #3a3a4e'
                        }}
                    >
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
                        <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>{stat.label}</div>
                        <div style={{ color: '#fff', fontSize: '20px', fontWeight: '600' }}>{stat.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({
    onClick,
    children
}) => (
    <button
        onClick={() => {
            onClick();
        }}
        style={{
            width: '100%',
            textAlign: 'left',
            padding: '10px 14px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#ccc',
            cursor: 'pointer',
            borderRadius: '6px',
            fontSize: '14px',
            display: 'block',
            marginBottom: '4px'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3a3a4e';
            e.currentTarget.style.color = '#fff';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#ccc';
        }}
    >
        {children}
    </button>
);

interface TabNavigationProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'templates', label: 'Templates', icon: '📄' },
        { id: 'earnings', label: 'Earnings', icon: '💰' },
        { id: 'withdrawals', label: 'Withdrawals', icon: '💸' },
        { id: 'payment', label: 'Payment Details', icon: '🏦' },
        { id: 'followers', label: 'Followers', icon: '👥' },
        { id: 'activity', label: 'Activity', icon: '📝' }
    ];

    return (
        <div
            style={{
                display: 'flex',
                gap: '8px',
                padding: '0 32px',
                borderBottom: '1px solid #2a2a3e',
                overflowX: 'auto'
            }}
        >
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: activeTab === tab.id ? '#6366f1' : '#888',
                        padding: '16px 20px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
};

interface TabContentProps {
    activeTab: string;
    creatorId: string;
    profile: CreatorProfile;
    onRefresh: () => void;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab, creatorId, profile, onRefresh }) => {
    switch (activeTab) {
        case 'overview':
            return <OverviewTab profile={profile} />;
        case 'templates':
            return <TemplatesTab creatorId={creatorId} onRefresh={onRefresh} />;
        case 'earnings':
            return <EarningsTab creatorId={creatorId} />;
        case 'withdrawals':
            return <WithdrawalsTab creatorId={creatorId} onRefresh={onRefresh} />;
        case 'payment':
            return <PaymentDetailsTab paymentDetails={profile.paymentDetails} />;
        case 'followers':
            return <FollowersTab creatorId={creatorId} />;
        case 'activity':
            return <ActivityTab creatorId={creatorId} />;
        default:
            return <div style={{ color: '#888' }}>Select a tab</div>;
    }
};

// Placeholder tab components (will be implemented next)
const OverviewTab: React.FC<{ profile: CreatorProfile }> = ({ profile }) => (
    <div style={{ color: '#fff' }}>
        <h3 style={{ marginBottom: '16px' }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(profile.recentActivity || []).map((activity, index) => (
                <div
                    key={index}
                    style={{
                        backgroundColor: '#2a2a3e',
                        padding: '16px',
                        borderRadius: '8px',
                        border: '1px solid #3a3a4e'
                    }}
                >
                    <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>
                        {new Date(activity.date).toLocaleString()} {activity.adminName && `• by ${activity.adminName}`}
                    </div>
                    <div style={{ color: '#fff', fontSize: '14px' }}>{activity.details}</div>
                </div>
            ))}
        </div>
    </div>
);

const TemplatesTab: React.FC<{ creatorId: string; onRefresh: () => void }> = ({ creatorId }) => {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState('all'); // all, approved, pending, rejected

    useEffect(() => {
        loadTemplates();
    }, [creatorId, page, filter]);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            const data = await creatorProfileAPI.getTemplates(creatorId, { page, limit: 12, status: filter !== 'all' ? filter : undefined });
            setTemplates(data.templates);
            setTotalPages(data.pagination.pages);
        } catch (err) {
            console.error('Failed to load templates', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: string, templateId: string, payload?: any) => {
        try {
            switch (action) {
                case 'approve':
                    await creatorProfileAPI.approveTemplate(templateId);
                    break;
                case 'reject':
                    await creatorProfileAPI.rejectTemplate(templateId, payload);
                    break;
                case 'togglePause':
                    await creatorProfileAPI.togglePauseTemplate(templateId);
                    break;
                case 'delete':
                    if (confirm('Are you sure you want to delete this template?')) {
                        await creatorProfileAPI.deleteTemplate(templateId);
                    } else {
                        return;
                    }
                    break;
            }
            loadTemplates();
        } catch (err: any) {
            alert(`Failed: ${err.message}`);
        }
    };

    return (
        <div>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {['all', 'approved', 'pending', 'rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => { setFilter(status); setPage(1); }}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            backgroundColor: filter === status ? '#6366f1' : '#2a2a3e',
                            color: filter === status ? '#fff' : '#888',
                            border: 'none',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ color: '#888', textAlign: 'center', padding: '40px' }}>Loading templates...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                    {templates.map(t => (
                        <div key={t.id} style={{ backgroundColor: '#2a2a3e', borderRadius: '12px', overflow: 'hidden' }}>
                            <div style={{ position: 'relative', height: '180px' }}>
                                <img src={t.imageUrl} alt={t.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                                    <span style={{
                                        padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold',
                                        backgroundColor: t.status === 'approved' ? '#10b981' : t.status === 'rejected' ? '#ef4444' : '#f59e0b',
                                        color: '#fff', textTransform: 'uppercase'
                                    }}>
                                        {t.status}
                                    </span>
                                    {t.isPremium && <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', backgroundColor: '#fbbf24', color: '#000' }}>⭐ PREMIUM</span>}
                                </div>
                            </div>
                            <div style={{ padding: '16px' }}>
                                <h4 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888', marginBottom: '16px' }}>
                                    <span>🔥 {t.useCount} uses</span>
                                    <span>❤️ {t.likeCount} likes</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    {t.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleAction('approve', t.id)}
                                                style={{ padding: '8px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const reason = prompt('Rejection reason:');
                                                    if (reason) handleAction('reject', t.id, { reason });
                                                }}
                                                style={{ padding: '8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {t.status !== 'pending' && (
                                        <button
                                            onClick={() => handleAction('togglePause', t.id)}
                                            style={{ padding: '8px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                        >
                                            {t.isPaused ? 'Resume' : 'Pause'}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleAction('delete', t.id)}
                                        style={{ padding: '8px', backgroundColor: '#3a3a4e', color: '#ccc', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '8px 12px', background: '#2a2a3e', color: '#fff', border: 'none', borderRadius: '6px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}>Prev</button>
                    <span style={{ color: '#fff', alignSelf: 'center' }}>Page {page} of {totalPages}</span>
                    <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '8px 12px', background: '#2a2a3e', color: '#fff', border: 'none', borderRadius: '6px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}>Next</button>
                </div>
            )}
        </div>
    );
};



const EarningsTab: React.FC<{ creatorId: string }> = ({ creatorId }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEarnings = async () => {
            try {
                setLoading(true);
                const res = await creatorProfileAPI.getEarnings(creatorId);
                setData(res);
            } catch (err) {
                console.error('Failed to load earnings', err);
            } finally {
                setLoading(false);
            }
        };
        loadEarnings();
    }, [creatorId]);

    if (loading) return <div style={{ color: '#888', textAlign: 'center', padding: '40px' }}>Loading earnings data...</div>;
    if (!data) return <div style={{ color: '#888', textAlign: 'center', padding: '40px' }}>No earnings data available</div>;

    return (
        <div style={{ color: '#fff' }}>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {[
                    { label: 'Lifetime Earnings', value: `₹${data.summary.totalLifetime.toLocaleString()}`, color: '#10b981' },
                    { label: 'This Month', value: `₹${data.summary.thisMonth.toLocaleString()}`, color: '#6366f1' },
                    { label: 'Last Month', value: `₹${data.summary.lastMonth.toLocaleString()}`, color: '#8b5cf6' },
                    { label: 'Pending Payout', value: `₹${data.summary.pendingWithdrawal.toLocaleString()}`, color: '#f59e0b' },
                ].map((item, i) => (
                    <div key={i} style={{ backgroundColor: '#2a2a3e', padding: '20px', borderRadius: '12px', border: `1px solid ${item.color}40` }}>
                        <div style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>{item.label}</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: item.color }}>{item.value}</div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ marginBottom: '16px' }}>Earnings Trend (Daily)</h3>
                <div style={{ height: '300px', backgroundColor: '#2a2a3e', padding: '16px', borderRadius: '12px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.chartData.daily}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#3a3a4e" />
                            <XAxis dataKey="date" stroke="#888" fontSize={12} tickFormatter={(val) => new Date(val).toLocaleDateString()} />
                            <YAxis stroke="#888" fontSize={12} tickFormatter={(val) => `₹${val}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #3a3a4e', borderRadius: '8px' }}
                                labelFormatter={(val) => new Date(val).toLocaleDateString()}
                            />
                            <Line type="monotone" dataKey="earnings" stroke="#6366f1" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Template Breakdown */}
            <div>
                <h3 style={{ marginBottom: '16px' }}>Top Earning Templates</h3>
                <div style={{ backgroundColor: '#2a2a3e', borderRadius: '12px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #3a3a4e', backgroundColor: '#32324a' }}>
                                <th style={{ padding: '16px', textAlign: 'left' }}>Template</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Uses</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Points</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Net Earnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.templateBreakdown.map((t: any) => (
                                <tr key={t.templateId} style={{ borderBottom: '1px solid #3a3a4e' }}>
                                    <td style={{ padding: '16px' }}>{t.templateName}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>{t.uses}</td>
                                    <td style={{ padding: '16px', textAlign: 'right' }}>{t.pointsEarned}</td>
                                    <td style={{ padding: '16px', textAlign: 'right', color: '#10b981', fontWeight: 'bold' }}>₹{t.netEarnings}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const WithdrawalsTab: React.FC<{ creatorId: string; onRefresh: () => void }> = ({ creatorId, onRefresh }) => {
    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWithdrawals();
    }, [creatorId]);

    const loadWithdrawals = async () => {
        try {
            setLoading(true);
            const data = await creatorProfileAPI.getWithdrawals(creatorId);
            setWithdrawals(data.withdrawals);
        } catch (err) {
            console.error('Failed to load withdrawals', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (withdrawalId: string) => {
        const txnId = prompt('Enter Transaction ID / UTR:');
        if (!txnId) return;

        try {
            await creatorProfileAPI.approveWithdrawal(creatorId, withdrawalId, { transactionId: txnId });
            alert('Withdrawal approved!');
            loadWithdrawals();
            onRefresh(); // Refresh main profile stats
        } catch (err: any) {
            alert(`Failed: ${err.message}`);
        }
    };

    const handleReject = async (withdrawalId: string) => {
        const reason = prompt('Rejection reason:');
        if (!reason) return;

        try {
            await creatorProfileAPI.rejectWithdrawal(creatorId, withdrawalId, { reason });
            alert('Withdrawal rejected!');
            loadWithdrawals();
            onRefresh();
        } catch (err: any) {
            alert(`Failed: ${err.message}`);
        }
    };

    return (
        <div>
            {loading ? (
                <div style={{ color: '#888', textAlign: 'center', padding: '40px' }}>Loading withdrawals...</div>
            ) : (
                <div style={{ backgroundColor: '#2a2a3e', borderRadius: '12px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #3a3a4e', backgroundColor: '#32324a' }}>
                                <th style={{ padding: '16px', textAlign: 'left' }}>Date</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Amount</th>
                                <th style={{ padding: '16px', textAlign: 'center' }}>Method</th>
                                <th style={{ padding: '16px', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '16px', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdrawals.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                                        No withdrawal history
                                    </td>
                                </tr>
                            ) : (
                                withdrawals.map((w) => (
                                    <tr key={w.id} style={{ borderBottom: '1px solid #3a3a4e' }}>
                                        <td style={{ padding: '16px' }}>{new Date(w.requestedAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold' }}>₹{w.amount}</td>
                                        <td style={{ padding: '16px', textAlign: 'center', textTransform: 'uppercase', fontSize: '12px' }}>
                                            {w.method}
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'center' }}>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold',
                                                backgroundColor: w.status === 'completed' ? '#10b981' : w.status === 'rejected' ? '#ef4444' : w.status === 'processing' ? '#f59e0b' : '#3a3a4e',
                                                color: '#fff', textTransform: 'capitalize'
                                            }}>
                                                {w.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            {w.status !== 'completed' && w.status !== 'rejected' && (
                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                                    <button
                                                        onClick={() => handleApprove(w.id)}
                                                        style={{ padding: '6px 12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(w.id)}
                                                        style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                            {(w.transactionId || w.utr) && (
                                                <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                                                    Txn: {w.transactionId || w.utr}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

const PaymentDetailsTab: React.FC<{ paymentDetails?: any }> = ({ paymentDetails }) => {
    if (!paymentDetails) return <div style={{ color: '#888', textAlign: 'center', padding: '40px' }}>No payment details found</div>;

    const details = [
        { label: 'Bank Name', value: paymentDetails.bankName },
        { label: 'Account Holder', value: paymentDetails.accountHolderName },
        { label: 'Account Number', value: paymentDetails.accountNumber ? `••••${paymentDetails.accountNumber.slice(-4)}` : 'N/A' },
        { label: 'IFSC Code', value: paymentDetails.ifscCode },
        { label: 'UPI ID', value: paymentDetails.upiId },
        { label: 'PAN Number', value: paymentDetails.panNumber ? `••••${paymentDetails.panNumber.slice(-4)}` : 'N/A' },
    ].filter(d => d.value);

    return (
        <div style={{ color: '#fff' }}>
            <h3 style={{ marginBottom: '24px' }}>Payout Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                {details.map((detail, i) => (
                    <div key={i} style={{ backgroundColor: '#2a2a3e', padding: '20px', borderRadius: '12px', border: '1px solid #3a3a4e' }}>
                        <div style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>{detail.label}</div>
                        <div style={{ fontSize: '18px', fontWeight: '500' }}>{detail.value}</div>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#3a3a4e', borderRadius: '8px', color: '#ccc', fontSize: '14px' }}>
                🔒 Sensitive details are masked. Use admin privileges to request full view if needed.
            </div>
        </div>
    );
};

const FollowersTab: React.FC<{ creatorId: string }> = ({ creatorId }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFollowers = async () => {
            try {
                setLoading(true);
                const res = await creatorProfileAPI.getFollowers(creatorId);
                setData(res);
            } catch (err) {
                console.error('Failed to load followers', err);
            } finally {
                setLoading(false);
            }
        };
        loadFollowers();
    }, [creatorId]);

    if (loading) return <div style={{ color: '#888', textAlign: 'center', padding: '40px' }}>Loading followers data...</div>;

    return (
        <div style={{ color: '#fff' }}>
            {/* Growth Chart */}
            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ marginBottom: '16px' }}>Follower Growth</h3>
                <div style={{ height: '300px', backgroundColor: '#2a2a3e', padding: '16px', borderRadius: '12px' }}>
                    {data?.growthData?.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.growthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#3a3a4e" />
                                <XAxis dataKey="date" stroke="#888" fontSize={12} tickFormatter={(val) => new Date(val).toLocaleDateString()} />
                                <YAxis stroke="#888" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #3a3a4e', borderRadius: '8px' }}
                                    labelFormatter={(val) => new Date(val).toLocaleDateString()}
                                />
                                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                            Not enough data for chart
                        </div>
                    )}
                </div>
            </div>

            {/* Top Followers List */}
            <div>
                <h3 style={{ marginBottom: '16px' }}>Top Followers</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {data?.topFollowers?.map((f: any) => (
                        <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#2a2a3e', padding: '12px', borderRadius: '8px' }}>
                            <img src={f.avatar || `https://ui-avatars.com/api/?name=${f.name}`} alt={f.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.name}</div>
                                <div style={{ fontSize: '12px', color: '#888' }}>@{f.username || 'user'}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ActivityTab: React.FC<{ creatorId: string }> = ({ creatorId }) => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadLogs();
    }, [creatorId, filter]);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const data = await creatorProfileAPI.getActivityLogs(creatorId, { type: filter !== 'all' ? filter : undefined, limit: 50 });
            setLogs(data.logs);
        } catch (err) {
            console.error('Failed to load activity logs', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Filter Chips */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                {['all', 'admin_action', 'template_action', 'withdrawal_request', 'earnings_update'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '6px 16px',
                            borderRadius: '20px',
                            border: '1px solid #3a3a4e',
                            backgroundColor: filter === f ? '#6366f1' : 'transparent',
                            color: filter === f ? '#fff' : '#888',
                            fontSize: '12px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {f.replace('_', ' ').toUpperCase()}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ color: '#888', textAlign: 'center', padding: '40px' }}>Loading activity logs...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {logs.map((log) => (
                        <div key={log.id} style={{ display: 'flex', gap: '16px', backgroundColor: '#2a2a3e', padding: '16px', borderRadius: '12px' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                backgroundColor: log.type.includes('admin') ? '#f59e0b20' : '#6366f120',
                                color: log.type.includes('admin') ? '#f59e0b' : '#6366f1',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                {log.type.includes('admin') ? '🛡️' : '📝'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ color: '#fff', fontSize: '14px', marginBottom: '4px' }}>
                                    {log.details}
                                </div>
                                <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#888' }}>
                                    <span>{new Date(log.createdAt).toLocaleString()}</span>
                                    {log.adminName && <span>by {log.adminName}</span>}
                                    <span style={{
                                        backgroundColor: '#3a3a4e', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', fontSize: '10px'
                                    }}>
                                        {log.type.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && <div style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No activity logs found</div>}
                </div>
            )}
        </div>
    );
};

export default CreatorProfileModal;
