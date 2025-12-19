import React, { useState, useEffect } from 'react';
import { creatorProfileAPI } from '../services/creatorProfileAPI';
import type { CreatorProfile } from '../types';

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
                {!loading && !error && profile && (
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
        { label: 'Templates', value: stats.totalTemplates, icon: '📄' },
        { label: 'Total Uses', value: stats.totalUses.toLocaleString(), icon: '🔥' },
        { label: 'Followers', value: stats.totalFollowers.toLocaleString(), icon: '👥' },
        { label: 'Earnings (₹)', value: `₹${stats.totalEarningsINR.toLocaleString()}`, icon: '💰' },
        { label: 'This Month', value: `₹${stats.thisMonthEarnings.toLocaleString()}`, icon: '📈' },
        { label: 'Rank', value: `#${stats.rank || 'N/A'}`, icon: '🏆' }
    ];

    return (
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #2a2a3e' }}>
            {/* Profile Info */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '24px' }}>
                <img
                    src={creator.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.name)}&size=128&background=6366f1&color=fff`}
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
            {profile.recentActivity.map((activity, index) => (
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

const TemplatesTab: React.FC<{ creatorId: string; onRefresh: () => void }> = () => (
    <div style={{ color: '#888', padding: '40px', textAlign: 'center' }}>
        Templates tab - Coming soon...
    </div>
);

const EarningsTab: React.FC<{ creatorId: string }> = () => (
    <div style={{ color: '#888', padding: '40px', textAlign: 'center' }}>
        Earnings tab - Coming soon...
    </div>
);

const WithdrawalsTab: React.FC<{ creatorId: string; onRefresh: () => void }> = () => (
    <div style={{ color: '#888', padding: '40px', textAlign: 'center' }}>
        Withdrawals tab - Coming soon...
    </div>
);

const PaymentDetailsTab: React.FC<{ paymentDetails?: any }> = ({ paymentDetails }) => (
    <div style={{ color: '#fff' }}>
        <h3 style={{ marginBottom: '16px' }}>Payment Details</h3>
        {paymentDetails ? (
            <div style={{ backgroundColor: '#2a2a3e', padding: '20px', borderRadius: '8px' }}>
                <div style={{ marginBottom: '12px' }}>
                    <strong>Account Holder:</strong> {paymentDetails.accountHolderName || 'N/A'}
                </div>
                <div style={{ marginBottom: '12px' }}>
                    <strong>Bank:</strong> {paymentDetails.bankName || 'N/A'}
                </div>
                <div style={{ marginBottom: '12px' }}>
                    <strong>Account Number:</strong> {paymentDetails.accountNumber ? `****${paymentDetails.accountNumber.slice(-4)}` : 'N/A'}
                </div>
                <div style={{ marginBottom: '12px' }}>
                    <strong>IFSC:</strong> {paymentDetails.ifscCode || 'N/A'}
                </div>
                <div style={{ marginBottom: '12px' }}>
                    <strong>UPI ID:</strong> {paymentDetails.upiId || 'N/A'}
                </div>
            </div>
        ) : (
            <div style={{ color: '#888' }}>No payment details available</div>
        )}
    </div>
);

const FollowersTab: React.FC<{ creatorId: string }> = () => (
    <div style={{ color: '#888', padding: '40px', textAlign: 'center' }}>
        Followers tab - Coming soon...
    </div>
);

const ActivityTab: React.FC<{ creatorId: string }> = () => (
    <div style={{ color: '#888', padding: '40px', textAlign: 'center' }}>
        Activity tab - Coming soon...
    </div>
);

export default CreatorProfileModal;
