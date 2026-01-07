// Template Management Component for Admin Panel
// Add this to new-admin-pannel/components/TemplateManagement.tsx

import React, { useState, useEffect } from 'react';
import {
    CheckCircle, XCircle, Clock, Star, Eye, DollarSign,
    Pause, Play, Trash2, Edit, MoreVertical, Filter,
    Search, ChevronDown, Download, Upload
} from 'lucide-react';

// Template Management with Official/Creator separation and Approval Workflow
const TemplateManagement = ({ templates, onApprove, onReject, onTogglePause, onToggleFeatured, onDelete }) => {
    const [view, setView] = useState('all'); // all, official, creator, pending, approved, rejected
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    // Calculate stats
    const stats = {
        total: templates.length,
        official: templates.filter(t => t.type === 'Official').length,
        creator: templates.filter(t => t.type === 'Creator').length,
        pending: templates.filter(t => t.approvalStatus === 'pending').length,
        approved: templates.filter(t => t.approvalStatus === 'approved').length,
        rejected: templates.filter(t => t.approvalStatus === 'rejected').length,
        featured: templates.filter(t => t.isFeatured).length,
        paused: templates.filter(t => t.isPaused).length
    };

    // Filter templates
    const filteredTemplates = templates.filter(t => {
        const matchesSearch = t.title?.toLowerCase().includes(searchQuery.toLowerCase());

        switch (view) {
            case 'official':
                return matchesSearch && t.type === 'Official';
            case 'creator':
                return matchesSearch && t.type === 'Creator';
            case 'pending':
                return matchesSearch && t.approvalStatus === 'pending';
            case 'approved':
                return matchesSearch && t.approvalStatus === 'approved';
            case 'rejected':
                return matchesSearch && t.approvalStatus === 'rejected';
            default:
                return matchesSearch;
        }
    });

    // Handle approve
    const handleApprove = async (templateId) => {
        if (confirm('Approve this template?')) {
            await onApprove(templateId);
        }
    };

    // Handle reject
    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }
        await onReject(selectedTemplate.id, rejectionReason);
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedTemplate(null);
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const styles = {
            approved: 'bg-green-500/20 text-green-400 border-green-500/30',
            pending: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
            rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
        };

        const icons = {
            approved: <CheckCircle size={12} />,
            pending: <Clock size={12} />,
            rejected: <XCircle size={12} />
        };

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${styles[status]}`}>
                {icons[status]}
                {status.toUpperCase()}
            </span>
        );
    };

    // Type badge component
    const TypeBadge = ({ type }) => {
        return type === 'Official' ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Star size={12} />
                OFFICIAL
            </span>
        ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                CREATOR
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Stats Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                    <div className="text-2xl font-bold text-white">{stats.total}</div>
                    <div className="text-xs text-gray-400">Total</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-yellow-500/30">
                    <div className="text-2xl font-bold text-yellow-400">{stats.official}</div>
                    <div className="text-xs text-gray-400">Official</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-blue-500/30">
                    <div className="text-2xl font-bold text-blue-400">{stats.creator}</div>
                    <div className="text-xs text-gray-400">Creator</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-orange-500/30">
                    <div className="text-2xl font-bold text-orange-400">{stats.pending}</div>
                    <div className="text-xs text-gray-400">Pending</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-green-500/30">
                    <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
                    <div className="text-xs text-gray-400">Approved</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-red-500/30">
                    <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
                    <div className="text-xs text-gray-400">Rejected</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-purple-500/30">
                    <div className="text-2xl font-bold text-purple-400">{stats.featured}</div>
                    <div className="text-xs text-gray-400">Featured</div>
                </div>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <div className="text-2xl font-bold text-gray-400">{stats.paused}</div>
                    <div className="text-xs text-gray-400">Paused</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setView('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                    All Templates
                </button>
                <button
                    onClick={() => setView('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'pending' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                    🟡 Pending ({stats.pending})
                </button>
                <button
                    onClick={() => setView('approved')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                    🟢 Approved ({stats.approved})
                </button>
                <button
                    onClick={() => setView('rejected')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                    🔴 Rejected ({stats.rejected})
                </button>
                <button
                    onClick={() => setView('official')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'official' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                    ⭐ Official ({stats.official})
                </button>
                <button
                    onClick={() => setView('creator')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${view === 'creator' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                    Creator ({stats.creator})
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
            </div>

            {/* Templates List */}
            <div className="space-y-3">
                {filteredTemplates.length === 0 ? (
                    <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                        <div className="text-gray-400 text-lg">No templates found</div>
                    </div>
                ) : (
                    filteredTemplates.map(template => (
                        <div key={template.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-indigo-500/50 transition-colors">
                            <div className="flex items-start gap-4">
                                {/* Template Image */}
                                <img
                                    src={template.imageUrl || template.demoImage || '/placeholder.png'}
                                    alt={template.title}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />

                                {/* Template Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-lg font-semibold text-white truncate">{template.title}</h3>
                                                <TypeBadge type={template.type} />
                                                <StatusBadge status={template.approvalStatus} />
                                                {template.isFeatured && (
                                                    <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                                        <Star size={12} className="inline" /> Featured
                                                    </span>
                                                )}
                                                {template.isPaused && (
                                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-400">
                                                        <Pause size={12} className="inline" /> Paused
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-400 line-clamp-2">{template.description}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                <span>By: {template.creatorName || 'Unknown'}</span>
                                                <span>Category: {template.category}</span>
                                                <span>Uses: {template.useCount || 0}</span>
                                                <span>Submitted: {new Date(template.submittedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2">
                                            {template.approvalStatus === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(template.id)}
                                                        className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded text-xs font-medium flex items-center gap-1"
                                                    >
                                                        <CheckCircle size={14} /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedTemplate(template);
                                                            setShowRejectModal(true);
                                                        }}
                                                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-medium flex items-center gap-1"
                                                    >
                                                        <XCircle size={14} /> Reject
                                                    </button>
                                                </>
                                            )}

                                            {template.approvalStatus === 'approved' && (
                                                <>
                                                    <button
                                                        onClick={() => onTogglePause(template.id)}
                                                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs font-medium flex items-center gap-1"
                                                    >
                                                        {template.isPaused ? <Play size={14} /> : <Pause size={14} />}
                                                        {template.isPaused ? 'Resume' : 'Pause'}
                                                    </button>
                                                    <button
                                                        onClick={() => onToggleFeatured(template.id)}
                                                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-medium flex items-center gap-1"
                                                    >
                                                        <Star size={14} />
                                                        {template.isFeatured ? 'Unfeature' : 'Feature'}
                                                    </button>
                                                </>
                                            )}

                                            {template.approvalStatus === 'rejected' && template.rejectionReason && (
                                                <div className="text-xs text-red-400 max-w-xs">
                                                    Reason: {template.rejectionReason}
                                                </div>
                                            )}

                                            <button
                                                onClick={() => onDelete(template.id)}
                                                className="px-3 py-1.5 bg-red-900 hover:bg-red-800 text-red-300 rounded text-xs font-medium flex items-center gap-1"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-800">
                        <h3 className="text-xl font-bold text-white mb-4">Reject Template</h3>
                        <p className="text-gray-400 mb-4">
                            Please provide a reason for rejecting "{selectedTemplate?.title}"
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Provide detailed feedback..."
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 mb-4"
                            rows={4}
                        />
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectionReason('');
                                    setSelectedTemplate(null);
                                }}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium"
                            >
                                Reject Template
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateManagement;
