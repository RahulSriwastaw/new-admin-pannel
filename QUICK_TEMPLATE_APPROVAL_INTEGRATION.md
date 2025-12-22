# ADMIN PANEL QUICK TEMPLATE MANAGEMENT UPDATE

## 🎯 OBJECTIVE
Add Official/Creator template display and approval workflow to existing template management

---

## 📝 STEP-BY-STEP IMPLEMENTATION

### STEP 1: Add Filters to Stats (Line 1510-1516)

Replace existing stats with:

```tsx
{/* Enhanced Template Stats */}
<div className="grid grid-cols-2 md:grid-cols-8 gap-4">
  <StatCard title="Total" value={templates.length} icon={LayoutTemplate} color="blue" />
  <StatCard title="Official" value={templates.filter(t => t.type === 'Official').length} icon={Star} color="yellow" />
  <StatCard title="Creator" value={templates.filter(t => t.type === 'Creator').length} icon={Users} color="blue" />
  <StatCard title="Pending" value={templates.filter(t => t.approvalStatus === 'pending').length} icon={Clock} color="orange" />
  <StatCard title="Approved" value={templates.filter(t => t.approvalStatus === 'approved').length} icon={CheckCircle} color="green" />
  <StatCard title="Rejected" value={templates.filter(t => t.approvalStatus === 'rejected').length} icon={XCircle} color="red" />
  <StatCard title="Featured" value={templates.filter(t => t.isFeatured).length} icon={Star} color="purple" />
  <StatCard title="Paused" value={templates.filter(t => t.isPaused).length} icon={Pause} color="gray" />
</div>
```

### STEP 2: Add Filter Tabs (After Line 1550)

Add before search bar:

```tsx
{/* Approval & Type Filters */}
<div className="flex flex-wrap gap-2 mb-4">
  <button
    onClick={() => setTemplateFilterStatus('all')}
    className={`px-4 py-2 rounded-lg text-sm font-medium ${templateFilterStatus === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300'}`}
  >
    All Templates
  </button>
  <button
    onClick={() => setTemplateFilterStatus('pending')}
    className={`px-4 py-2 rounded-lg text-sm font-medium ${templateFilterStatus === 'pending' ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-300'}`}
  >
    🟡 Pending ({templates.filter(t => t.approvalStatus === 'pending').length})
  </button>
  <button
    onClick={() => setTemplateFilterStatus('approved')}
    className={`px-4 py-2 rounded-lg text-sm font-medium ${templateFilterStatus === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300'}`}
  >
    🟢 Approved ({templates.filter(t => t.approvalStatus === 'approved').length})
  </button>
  <button
    onClick={() => setTemplateFilterStatus('rejected')}
    className={`px-4 py-2 rounded-lg text-sm font-medium ${templateFilterStatus === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'}`}
  >
    🔴 Rejected ({templates.filter(t => t.approvalStatus === 'rejected').length})
  </button>
  <button
    onClick={() => setTemplateFilterType('official')}
    className={`px-4 py-2 rounded-lg text-sm font-medium ${templateFilterType === 'official' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-300'}`}
  >
    ⭐ Official ({templates.filter(t => t.type === 'Official').length})
  </button>
  <button
    onClick={() => setTemplateFilterType('creator')}
    className={`px-4 py-2 rounded-lg text-sm font-medium ${templateFilterType === 'creator' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
  >
    Creator ({templates.filter(t => t.type === 'Creator').length})
  </button>
</div>
```

### STEP 3: Add State Variables (After Line 177)

```typescript
const [templateFilterType, setTemplateFilterType] = useState<'all' | 'official' | 'creator'>('all');
const [approvalFilterStatus, setApprovalFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
```

### STEP 4: Update filteredTemplates Logic (Line 1481-1494)

Add to existing filters:

```typescript
const filteredTemplates = templates.filter(t => {
  // ... existing filters ...
  
  // NEW: Approval Status Filter
  const matchesApproval = approvalFilterStatus === 'all' || t.approvalStatus === approvalFilterStatus;
  
  // NEW: Type Filter  
  const matchesType = templateFilterType === 'all' || t.type === templateFilterType;

  return matchesSearch && matchesCategory && matchesStatus && matchesPremium && matchesApproval && matchesType;
});
```

### STEP 5: Add Badges to Grid View (Line 1663)

Replace the badges div with:

```tsx
<div className="absolute top-2 right-2 flex flex-col gap-1 pointer-events-none items-end">
  {/* Template Type */}
  {template.type === 'Official' && (
    <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] font-bold rounded uppercase flex items-center gap-1 shadow-lg">
      <Star size={10} fill="white" /> OFFICIAL
    </span>
  )}
  
  {/* Premium */}
  {template.isPremium && (
    <span className="px-2 py-0.5 bg-yellow-500/90 text-black text-[10px] font-bold rounded uppercase flex items-center gap-1 shadow-lg">
      <Star size={10} fill="black" /> Premium
    </span>
  )}
  
  {/* Approval Status */}
  {template.approvalStatus === 'pending' && (
    <span className="px-2 py-0.5 bg-orange-500/90 text-white text-[10px] font-bold rounded uppercase shadow-lg">
      🟡 PENDING
    </span>
  )}
  {template.approvalStatus === 'approved' && (
    <span className="px-2 py-0.5 bg-green-500/90 text-white text-[10px] font-bold rounded uppercase shadow-lg">
      🟢 APPROVED
    </span>
  )}
  {template.approvalStatus === 'rejected' && (
    <span className="px-2 py-0.5 bg-red-500/90 text-white text-[10px] font-bold rounded uppercase shadow-lg">
      🔴 REJECTED
    </span>
  )}
</div>
```

### STEP 6: Add Action Buttons (In Grid Card actions, Line 1681-1703)

Add before the existing buttons:

```tsx
{/* Approval Actions for Pending Templates */}
{template.approvalStatus === 'pending' && (
  <>
    <button
      onClick={() => handleApproveTemplate(template.id)}
      className="flex items-center justify-center gap-1.5 py-1.5 bg-green-600 hover:bg-green-500 rounded text-xs text-white col-span-2"
      title="Approve Template"
    >
      <CheckCircle size={12} /> Approve
    </button>
    <button
      onClick={() => handleRejectTemplate(template.id)}
      className="flex items-center justify-center gap-1.5 py-1.5 bg-red-600 hover:bg-red-500 rounded text-xs text-white"
      title="Reject Template"
    >
      <XCircle size={12} /> Reject
    </button>
  </>
)}

{/* Pause/Feature for Approved Templates */}
{template.approvalStatus === 'approved' && (
  <>
    <button
      onClick={() => handleTogglePause(template.id)}
      className="flex items-center justify-center gap-1.5 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white"
      title={template.isPaused ? "Resume" : "Pause"}
    >
      {template.isPaused ? <Play size={12} /> : <Pause size={12} />}
    </button>
    <button
      onClick={() => handleToggleFeatured(template.id)}
      className="flex items-center justify-center gap-1.5 py-1.5 bg-purple-600 hover:bg-purple-500 rounded text-xs text-white"
      title={template.isFeatured ? "Unfeature" : "Feature"}
    >
      <Star size={12} />
    </button>
  </>
)}
```

### STEP 7: Add Handler Functions (Before renderTemplates function, around line 1400)

```typescript
// Template Approval Handlers
const handleApproveTemplate = async (templateId: string) => {
  if (!confirm('Approve this template?')) return;
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/templates/${templateId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });

    if (response.ok) {
      fetchTemplates();
      addLog('success', 'Template approved successfully');
    }
  } catch (error) {
    console.error('Failed to approve:', error);
    addLog('error', 'Failed to approve template');
  }
};

const handleRejectTemplate = async (templateId: string) => {
  const reason = prompt('Enter rejection reason:');
  if (!reason) return;
  
  try {
    const response = await fetch(`${API_BASE}/api/admin/templates/${templateId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ reason })
    });

    if (response.ok) {
      fetchTemplates();
      addLog('warning', `Template rejected: ${reason}`);
    }
  } catch (error) {
    console.error('Failed to reject:', error);
    addLog('error', 'Failed to reject template');
  }
};

const handleTogglePause = async (templateId: string) => {
  try {
    const response = await fetch(`${API_BASE}/api/admin/templates/${templateId}/toggle-pause`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });

    if (response.ok) {
      fetchTemplates();
      addLog('info', 'Template pause status toggled');
    }
  } catch (error) {
    console.error('Failed to toggle pause:', error);
  }
};

const handleToggleFeatured = async (templateId: string) => {
  try {
    const response = await fetch(`${API_BASE}/api/admin/templates/${templateId}/toggle-featured`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });

    if (response.ok) {
      fetchTemplates();
      addLog('info', 'Template featured status toggled');
    }
  } catch (error) {
    console.error('Failed to toggle featured:', error);
  }
};
```

---

## ✅ QUICK CHECKLIST

- [ ] Add enhanced stats (8 cards)
- [ ] Add filter tabs (6 buttons)
- [ ] Add state variables (2)
- [ ] Update filteredTemplates logic
- [ ] Add badges to grid view
- [ ] Add approval action buttons
- [ ] Add handler functions (4)
- [ ] Test approval workflow
- [ ] Test pause/featured toggle

---

## 🎨 VISUAL CHANGES

**Grid Cards Will Show:**
```
┌───────────────────────┐
│ [Image]    ⭐ OFFICIAL│
│            🟡 PENDING │
│                       │
│ Template Title        │
│ Category • Uses       │
│                       │
│ [✅ Approve] [❌ Reject]│  (if pending)
│ [⏸️ Pause] [⭐ Feature]│  (if approved)
│ [📋 Duplicate] [✏️ Edit]│ (existing)
└───────────────────────┘
```

---

## 📊 EXPECTED RESULT

**Filter Tabs:**
- All Templates
- 🟡 Pending (18)
- 🟢 Approved (125)  
- 🔴 Rejected (13)
- ⭐ Official (24)
- Creator (132)

**Grid View:**
- Shows all badges clearly
- Approval actions for pending
- Pause/Feature for approved
- Type badge for official

---

**Ready to integrate! Follow steps 1-7 in order!** 🚀
