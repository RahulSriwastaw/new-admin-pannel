/**
 * CATEGORY CREATE BUTTON DEBUG GUIDE
 * 
 * If Create button is not working, follow these steps:
 */

// ============================================================
// STEP 1: Check Browser Console for Errors
// ============================================================

// Open browser DevTools (F12) and check Console tab for any errors

// ============================================================
// STEP 2: Verify handleSaveCategory Function
// ============================================================

// In App.tsx, make sure handleSaveCategory looks like this:

const handleSaveCategory = async () => {
    try {
        console.log('🔵 handleSaveCategory called');
        console.log('📝 Category data:', newCategory);

        if (!newCategory.name.trim()) {
            alert('Category name is required');
            return;
        }

        if (isEditingCategory && editingCategoryId) {
            // UPDATE mode
            console.log('🔄 Updating category:', editingCategoryId);
            await api.updateCategory(editingCategoryId, {
                name: newCategory.name,
                subCategories: newCategory.subCategories
            });

            setCategories(prev => prev.map(cat =>
                cat.id === editingCategoryId
                    ? { ...cat, name: newCategory.name, subCategories: newCategory.subCategories }
                    : cat
            ));

            addLog(`Category '${newCategory.name}' updated.`, LogLevel.SUCCESS, 'AdminPanel');
        } else {
            // CREATE mode
            console.log('➕ Creating new category');
            const created = await api.addCategory(newCategory);
            console.log('✅ Category created:', created);

            setCategories(prev => [...prev, created]);
            addLog(`Category '${created.name}' added.`, LogLevel.SUCCESS, 'AdminPanel');
        }

        handleCloseCategoryModal();

        // Refresh categories
        const updatedCategories = await api.getCategories();
        console.log('🔄 Categories refreshed:', updatedCategories);
        setCategories(updatedCategories);
    } catch (error: any) {
        console.error('❌ Error saving category:', error);
        console.error('Error details:', error.response?.data || error.message);
        addLog(error?.message || 'Failed to save category', LogLevel.ERROR, 'Backend');
        alert('Error: ' + (error?.response?.data?.message || error?.message || 'Failed to save category'));
    }
};

// ============================================================
// STEP 3: Verify API Function (services/api.ts)
// ============================================================

// Make sure api.addCategory exists in services/api.ts:

export const api = {
    // ... other methods

    // Category Management
    getCategories: async (): Promise<Category[]> => {
        try {
            const response = await fetchWithFallback < any > ('/admin/categories', { categories: [] });
            if (Array.isArray(response)) {
                return response;
            }
            return response.categories || [];
        } catch (e) {
            console.error('Failed to fetch categories:', e);
            return [];
        }
    },

    addCategory: async (category: Omit<Category, 'id'>) => {
        try {
            console.log('📡 API: Adding category:', category);
            const res = await fetch(`${API_BASE_URL}/admin/categories`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(category)
            });

            console.log('📡 API Response status:', res.status);

            if (!res.ok) {
                const errorData = await res.json();
                console.error('📡 API Error:', errorData);
                throw new Error(errorData.message || 'Failed to add category');
            }

            const data = await res.json();
            console.log('📡 API Response data:', data);
            return data;
        } catch (e) {
            console.error('📡 API Error:', e);
            throw e;
        }
    },

    updateCategory: async (id: string, updates: Partial<Category>) => {
        try {
            await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(updates)
            });
            return true;
        } catch (e) {
            throw e;
        }
    },

    deleteCategory: async (id: string) => {
        try {
            await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            return true;
        } catch (e) {
            throw e;
        }
    },
};

// ============================================================
// STEP 4: Check Backend Route
// ============================================================

// Verify backend has POST endpoint at /api/admin/categories
// In routes/categories.js:

router.post('/', authMiddleware, async (req, res) => {
    try {
        console.log('📥 Backend: Received category create request:', req.body);

        const { name, subCategories, icon, description } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }

        const category = await Category.create({
            name,
            subCategories: subCategories || [],
            icon: icon || '',
            description: description || '',
            isActive: true,
            order: 0
        });

        console.log('✅ Backend: Category created:', category);

        res.status(201).json(category);
    } catch (error) {
        console.error('❌ Backend error:', error);
        res.status(500).json({ error: error.message || 'Failed to create category' });
    }
});

// ============================================================
// STEP 5: Quick Fix - Add onClick Debug
// ============================================================

// In the modal, temporarily add console.log to the button:

<button
    onClick={() => {
        console.log('🔘 Create button clicked!');
        console.log('Category name:', newCategory.name);
        console.log('Sub-categories:', newCategory.subCategories);
        handleSaveCategory();
    }}
    disabled={!newCategory.name}
    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm font-medium h-[38px]"
>
    {isEditingCategory ? 'Update' : 'Create'}
</button>

// ============================================================
// COMMON ISSUES & FIXES
// ============================================================

/*
ISSUE 1: Button is disabled
FIX: Make sure newCategory.name is not empty

ISSUE 2: API endpoint not found (404)
FIX: Check backend routes are properly mounted in server.js

ISSUE 3: Authentication error (401/403)
FIX: Make sure admin is logged in and token is valid

ISSUE 4: CORS error
FIX: Check backend CORS configuration allows admin panel URL

ISSUE 5: Network error
FIX: Make sure backend is running on correct port

ISSUE 6: Response format mismatch
FIX: Backend should return the created category object with id

ISSUE 7: State not updating
FIX: Make sure setCategories is called after successful creation
*/

// ============================================================
// TEST MANUALLY IN BROWSER CONSOLE
// ============================================================

/*
// Open browser console and run:

// Test 1: Check if button exists
document.querySelector('button:contains("Create")')

// Test 2: Check newCategory state (if using React DevTools)
// React DevTools > Components > Find App component > Check newCategory state

// Test 3: Manual API call
fetch('http://localhost:5000/api/admin/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  },
  body: JSON.stringify({
    name: 'Test Category',
    subCategories: ['Test Sub']
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
*/
