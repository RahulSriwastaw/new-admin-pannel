import React, { useState, useEffect } from 'react';
import { creatorProfileAPI } from '../services/creatorProfileAPI';
import type { CreatorTemplateResponse } from '../types';

interface TemplatesTabProps {
    creatorId: string;
    onRefresh: () => void;
}

const TemplatesTab: React.FC<TemplatesTabProps> = ({ creatorId, onRefresh }) => {
    const [data, setData] = useState<CreatorTemplateResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('-createdAt');
    const [page, setPage] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [actionModal, setActionModal] = useState<{
        type: 'approve' | 'reject' | 'delete' | null;
        templateId: string | null;
    }>({ type: null, templateId: null });

    useEffect(() => {
        loadTemplates();
    }, [creatorId, statusFilter, sortBy, page]);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            const result = await creatorProfileAPI.getTemplates(creatorId, {
                page,
                limit: 20,
                status: statusFilter,
                sort: sortBy
            });
            setData(result);
        } catch (err) {
            console.error('Failed to load templates:', err);
            alert('Failed to load templates');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (templateId: string) => {
        try {
            await creatorProfileAPI.approveTemplate(templateId);
            alert('Template approved successfully!');
            loadTemplates();
            onRefresh();
        } catch (err: any) {
            alert(`Failed to approve: ${err.message}`);
        }
    };

    const handleReject = async (templateId: string, reason: string) => {
        try {
            await creatorProfileAPI.rejectTemplate(templateId, { reason });
            alert('Template rejected successfully!');
            loadTemplates();
            onRefresh();
            setActionModal({ type: null, templateId: null });
        } catch (err: any) {
            alert(`Failed to reject: ${err.message}`);
        }
    };

    const handleTogglePause = async (templateId: string) => {
        try {
            await creatorProfileAPI.togglePauseTemplate(templateId);
            alert('Template status updated!');
            loadTemplates();
            onRefresh();
        } catch (err: any) {
            alert(`Failed to update: ${err.message}`);
        }
    };

    const handleDelete = async (templateId: string) => {
        try {
            await creatorProfileAPI.deleteTemplate(templateId);
            alert('Template deleted successfully!');
            loadTemplates();
            onRefresh();
            setActionModal({ type: null, templateId: null });
        } catch (err: any) {
            alert(`Failed to delete: ${err.message}`);
        }
    };

    const getStatusBadge = (template: any) => {
        if (template.isPaused) {
            return <Badge color="#f59e0b">⏸️ Paused</Badge>;
        }
        switch (template.approvalStatus) {
            case 'approved':
                return <Badge color="#10b981">✓ Approved</Badge>;
            case 'pending':
                return <Badge color="#f59e0b">⏳ Pending</Badge>;
            case 'rejected':
                return <Badge color="#ef4444">❌ Rejected</Badge>;
            default:
                return <Badge color="#6b7280">Unknown</Badge>;
        }
    };

    return (
        <div>
            {/* Header with Filters */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}
            >
                <h3 style={{ color: '#fff', margin: 0 }}>
                    Templates ({data?.pagination.total || 0})
                </h3>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        style={{
                            backgroundColor: '#2a2a3e',
                            color: '#fff',
                            border: '1px solid #3a3a4e',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                        <option value="paused">Paused</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{
                            backgroundColor: '#2a2a3e',
                            color: '#fff',
                            border: '1px solid #3a3a4e',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                    >
                        <option value="-createdAt">Newest First</option>
                        <option value="createdAt">Oldest First</option>
                        <option value="-useCount">Most Used</option>
                        <option value="-likeCount">Most Liked</option>
                        <option value="-earningsGenerated">Highest Earnings</option>
                    </select>

                    {/* Refresh */}
                    <button
                        onClick={loadTemplates}
                        style={{
                            backgroundColor: '#6366f1',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            border: '4px solid #2a2a3e',
                            borderTopColor: '#6366f1',
                            borderRadius: '50%',
                            margin: '0 auto 16px',
                            animation: 'spin 0.8s linear infinite'
                        }}
                    />
                    Loading templates...
                </div>
            )}

            {/* Templates Grid/Table */}
            {!loading && data && (
                <>
                    {data.templates.length === 0 ? (
                        <div
                            style={{
                                textAlign: 'center',
                                padding: '60px',
                                color: '#888',
                                backgroundColor: '#2a2a3e',
                                borderRadius: '8px'
                            }}
                        >
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                            <p>No templates found</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {data.templates.map((template) => (
                                <div
                                    key={template.id}
                                    style={{
                                        backgroundColor: '#2a2a3e',
                                        border: '1px solid #3a3a4e',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        display: 'flex',
                                        gap: '16px',
                                        alignItems: 'flex-start'
                                    }}
                                >
                                    {/* Thumbnail */}
                                    <img
                                        src={template.imageUrl}
                                        alt={template.title}
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            objectFit: 'cover',
                                            borderRadius: '8px',
                                            flexShrink: 0
                                        }}
                                    />

                                    {/* Details */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
                                            <h4
                                                style={{
                                                    color: '#fff',
                                                    margin: 0,
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    flex: 1
                                                }}
                                            >
                                                {template.title}
                                            </h4>
                                            {getStatusBadge(template)}
                                            {template.isPremium && <Badge color="#8b5cf6">💎 Premium</Badge>}
                                        </div>

                                        <div style={{ color: '#888', fontSize: '13px', marginBottom: '12px' }}>
                                            {template.category} • Created {new Date(template.createdAt).toLocaleDateString()}
                                        </div>

                                        {/* Stats */}
                                        <div style={{ display: 'flex', gap: '20px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                            <StatItem label="Uses" value={template.useCount.toLocaleString()} />
                                            <StatItem label="Likes" value={template.likeCount.toLocaleString()} />
                                            <StatItem label="Saves" value={template.savesCount.toLocaleString()} />
                                            <StatItem label="Earnings" value={`₹${template.earningsGenerated.toFixed(2)}`} />
                                            {template.isPremium && (
                                                <StatItem label="Points" value={template.pointsCost.toString()} />
                                            )}
                                        </div>

                                        {/* Rejection Reason */}
                                        {template.rejectionReason && (
                                            <div
                                                style={{
                                                    backgroundColor: '#dc2626',
                                                    color: '#fff',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '13px',
                                                    marginBottom: '12px'
                                                }}
                                            >
                                                <strong>Rejected:</strong> {template.rejectionReason}
                                            </div>
                                        )}

                                        {/* Admin Notes */}
                                        {template.adminNotes && (
                                            <div
                                                style={{
                                                    backgroundColor: '#3a3a4e',
                                                    color: '#ccc',
                                                    padding: '8px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '13px',
                                                    marginBottom: '12px'
                                                }}
                                            >
                                                <strong>Admin Note:</strong> {template.adminNotes}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {template.approvalStatus === 'pending' && (
                                                <>
                                                    <ActionButton color="#10b981" onClick={() => handleApprove(template.id)}>
                                                        ✓ Approve
                                                    </ActionButton>
                                                    <ActionButton
                                                        color="#ef4444"
                                                        onClick={() => setActionModal({ type: 'reject', templateId: template.id })}
                                                    >
                                                        ❌ Reject
                                                    </ActionButton>
                                                </>
                                            )}
                                            {template.approvalStatus === 'approved' && (
                                                <ActionButton
                                                    color="#f59e0b"
                                                    onClick={() => handleTogglePause(template.id)}
                                                >
                                                    {template.isPaused ? '▶️ Unpause' : '⏸️ Pause'}
                                                </ActionButton>
                                            )}
                                            <ActionButton color="#6366f1" onClick={() => setSelectedTemplate(template.id)}>
                                                📊 Analytics
                                            </ActionButton>
                                            <ActionButton
                                                color="#dc2626"
                                                onClick={() => setActionModal({ type: 'delete', templateId: template.id })}
                                            >
                                                🗑️ Delete
                                            </ActionButton>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {data.pagination.pages > 1 && (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '12px',
                                marginTop: '24px'
                            }}
                        >
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                style={{
                                    backgroundColor: page === 1 ? '#2a2a3e' : '#6366f1',
                                    color: page === 1 ? '#666' : '#fff',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                ← Previous
                            </button>
                            <span style={{ color: '#888', fontSize: '14px' }}>
                                Page {page} of {data.pagination.pages}
                            </span>
                            <button
                                onClick={() => setPage(Math.min(data.pagination.pages, page + 1))}
                                disabled={page === data.pagination.pages}
                                style={{
                                    backgroundColor: page === data.pagination.pages ? '#2a2a3e' : '#6366f1',
                                    color: page === data.pagination.pages ? '#666' : '#fff',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    cursor: page === data.pagination.pages ? 'not-allowed' : 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Reject Template Modal */}
            {actionModal.type === 'reject' && actionModal.templateId && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => setActionModal({ type: null, templateId: null })}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: '#1a1a2e',
                            borderRadius: '12px',
                            padding: '24px',
                            maxWidth: '500px',
                            width: '90%'
                        }}
                    >
                        <h3 style={{ color: '#fff', marginTop: 0 }}>Reject Template</h3>
                        <p style={{ color: '#888', fontSize: '14px' }}>
                            Please provide a reason for rejecting this template:
                        </p>
                        <textarea
                            id="rejectReason"
                            placeholder="Enter rejection reason..."
                            style={{
                                width: '100%',
                                minHeight: '100px',
                                backgroundColor: '#2a2a3e',
                                border: '1px solid #3a3a4e',
                                borderRadius: '8px',
                                color: '#fff',
                                padding: '12px',
                                fontSize: '14px',
                                resize: 'vertical',
                                fontFamily: 'inherit'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            <button
                                onClick={() => {
                                    const reason = (document.getElementById('rejectReason') as HTMLTextAreaElement)?.value;
                                    if (!reason.trim()) {
                                        alert('Please provide a rejection reason');
                                        return;
                                    }
                                    handleReject(actionModal.templateId!, reason);
                                }}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#ef4444',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                Reject Template
                            </button>
                            <button
                                onClick={() => setActionModal({ type: null, templateId: null })}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#2a2a3e',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Template Confirmation */}
            {actionModal.type === 'delete' && actionModal.templateId && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={() => setActionModal({ type: null, templateId: null })}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: '#1a1a2e',
                            borderRadius: '12px',
                            padding: '24px',
                            maxWidth: '400px',
                            width: '90%'
                        }}
                    >
                        <h3 style={{ color: '#fff', marginTop: 0 }}>⚠️ Delete Template</h3>
                        <p style={{ color: '#888', fontSize: '14px' }}>
                            Are you sure you want to permanently delete this template? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            <button
                                onClick={() => handleDelete(actionModal.templateId!)}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#dc2626',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                Delete Permanently
                            </button>
                            <button
                                onClick={() => setActionModal({ type: null, templateId: null })}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#2a2a3e',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Components
const Badge: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
    <span
        style={{
            backgroundColor: color,
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            whiteSpace: 'nowrap'
        }}
    >
        {children}
    </span>
);

const StatItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div style={{ fontSize: '13px' }}>
        <span style={{ color: '#888' }}>{label}: </span>
        <span style={{ color: '#fff', fontWeight: '600' }}>{value}</span>
    </div>
);

const ActionButton: React.FC<{
    color: string;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ color, onClick, children }) => (
    <button
        onClick={onClick}
        style={{
            backgroundColor: color,
            color: '#fff',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'opacity 0.2s'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
    >
        {children}
    </button>
);

export default TemplatesTab;
