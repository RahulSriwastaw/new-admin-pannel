# ADMIN PANEL - TEMPLATE MANAGEMENT INTEGRATION GUIDE

## 📋 OVERVIEW

Complete Template Management system for Admin Panel with:
- Official vs Creator template separation
- Approval workflow (Pending → Approved/Rejected)
- Featured templates
- Pause/Resume functionality
- Rejection reasons
- Real-time stats

---

## 🎯 FEATURES

### Template Types
- ⭐ **Official Templates** (Admin-created, auto-approved)
- 👤 **Creator Templates** (Requires approval)

### Approval Status
- 🟡 **Pending** - Awaiting admin review
- 🟢 **Approved** - Live on user app
- 🔴 **Rejected** - With rejection reason

### Admin Actions
- ✅ Approve template
- ❌ Reject with reason
- ⏸️ Pause/Resume
- ⭐ Feature/Unfeature
- 🗑️ Delete

---

## 📂 FILES

**Created:**
- `components/TemplateManagement.tsx` - Main component

**To Modify:**
- `App.tsx` - Add handlers and integrate component

---

## 🔧 INTEGRATION STEPS

### Step 1: Import Component

Add to top of `App.tsx`:

```typescript
import TemplateManagement from './components/TemplateManagement';
```

### Step 2: Add Handler Functions

Add these functions before the return statement in App component:

```typescript
// Template approval handler
const handleApproveTemplate = async (templateId: string) => {
  try {
    const response = await fetch(`${API_BASE}/api/admin/templates/${templateId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });

    if (response.ok) {
      // Refresh templates
      fetchTemplates();
      addLog('success', `Template approved successfully`);
    }
  } catch (error) {
    console.error('Failed to approve template:', error);
    addLog('error', 'Failed to approve template');
  }
};

// Template rejection handler
const handleRejectTemplate = async (templateId: string, reason: string) => {
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
    console.error('Failed to reject template:', error);
    addLog('error', 'Failed to reject template');
  }
};

// Toggle pause handler
const handleTogglePauseTemplate = async (templateId: string) => {
  try {
    const response = await fetch(`${API_BASE}/api/admin/templates/${templateId}/toggle-pause`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });

    if (response.ok) {
      fetchTemplates();
      addLog('info', 'Template pause status toggled');
    }
  } catch (error) {
    console.error('Failed to toggle pause:', error);
    addLog('error', 'Failed to toggle pause status');
  }
};

// Toggle featured handler
const handleToggleFeaturedTemplate = async (templateId: string) => {
  try {
    const response = await fetch(`${API_BASE}/api/admin/templates/${templateId}/toggle-featured`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });

    if (response.ok) {
      fetchTemplates();
      addLog('info', 'Template featured status toggled');
    }
  } catch (error) {
    console.error('Failed to toggle featured:', error);
    addLog('error', 'Failed to toggle featured status');
  }
};

// Delete template handler
const handleDeleteTemplate = async (templateId: string) => {
  if (!confirm('Are you sure you want to delete this template?')) return;
  
  try {
    const response = await fetch(`${API_BASE}/api/templates/${templateId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });

    if (response.ok) {
      fetchTemplates();
      addLog('warning', 'Template deleted');
    }
  } catch (error) {
    console.error('Failed to delete template:', error);
    addLog('error', 'Failed to delete template');
  }
};
```

### Step 3: Replace renderTemplates Function

Find the `renderTemplates` function (around line 1474) and replace it with:

```typescript
const renderTemplates = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <TemplateManagement
        templates={templates}
        onApprove={handleApproveTemplate}
        onReject={handleRejectTemplate}
        onTogglePause={handleTogglePauseTemplate}
        onToggleFeatured={handleToggleFeaturedTemplate}
        onDelete={handleDeleteTemplate}
      />
    </div>
  );
};
```

---

## 🚀 BACKEND ENDPOINTS REQUIRED

Make sure these endpoints are integrated in backend (from `ADMIN_ENDPOINTS_TO_ADD.js`):

```javascript
POST /api/admin/templates/:id/approve
POST /api/admin/templates/:id/reject
POST /api/admin/templates/:id/toggle-pause
POST /api/admin/templates/:id/toggle-featured
DELETE /api/templates/:id
```

---

## 🎨 UI FEATURES

### Stats Dashboard
- Total templates count
- Official templates count
- Creator templates count
- Pending count (highlighted)
- Approved count
- Rejected count
- Featured count
- Paused count

### Filter Tabs
- All Templates
- 🟡 Pending (Orange)
- 🟢 Approved (Green)
- 🔴 Rejected (Red)
- ⭐ Official (Yellow)
- 👤 Creator (Blue)

### Template Card
- Template image preview
- Title and description
- Type badge (Official/Creator)
- Status badge (Pending/Approved/Rejected)
- Creator name
- Category, uses, submitted date
- Action buttons (context-aware)

### Actions by Status

**Pending Templates:**
- ✅ Approve button
- ❌ Reject button (with reason modal)

**Approved Templates:**
- ⏸️ Pause/Resume button
- ⭐ Feature/Unfeature button

**All Templates:**
- 🗑️ Delete button

---

## 📊 EXPECTED BEHAVIOR

### Approval Flow
1. Creator submits template → Status: Pending
2. Admin sees in Pending tab
3. Admin clicks Approve → Status: Approved → Goes live
4. OR Admin clicks Reject → Shows reason modal → Status: Rejected

### Rejection Flow
1. Admin clicks Reject
2. Modal appears
3. Admin enters detailed reason
4. Template marked Rejected
5. Creator sees rejection reason in dashboard

### Pause/Feature Flow
1. Only works on Approved templates
2. Pause: Hides from users temporarily
3. Feature: Shows in featured section

---

## ✅ TESTING CHECKLIST

After integration:
- [ ] Stats show correct counts
- [ ] Filter tabs work properly
- [ ] Search filters correctly
- [ ] Approve button approves template
- [ ] Reject modal appears
- [ ] Rejection reason required
- [ ] Pause/Resume toggles correctly
- [ ] Feature/Unfeature toggles correctly
- [ ] Delete confirms before deleting
- [ ] Template list refreshes after actions

---

## 🎯 PRIORITY

**HIGH PRIORITY** - Core approval workflow needed

**Required For:**
- Quality control
- Content moderation
- Creator template approval
- Platform safety

---

## 📝 NOTES

**Component is fully styled** - Matches existing admin panel theme

**Error Handling** - Includes try-catch blocks

**User Feedback** - Uses existing log system

**Responsive** - Works on all screen sizes

---

**Ready to integrate! Follow steps above and test!** 🚀
