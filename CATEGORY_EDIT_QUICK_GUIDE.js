/**
 * CATEGORY EDIT FUNCTIONALITY - QUICK INTEGRATION
 * 
 * Add these code snippets to your App.tsx file in the specified locations
 */

// ============================================================
// STEP 1: Add these state variables (find the section with other useState hooks)
// ============================================================

const [isEditingCategory, setIsEditingCategory] = useState(false);
const [editingCategoryId, setEditingCategoryId] = useState < string | null > (null);

// ============================================================
// STEP 2: Add these handler functions
// ============================================================

// Handler to open edit mode for a category
const handleEditCategory = (category: Category) => {
    setIsEditingCategory(true);
    setEditingCategoryId(category.id);
    setNewCategory({
        name: category.name,
        subCategories: [...category.subCategories]
    });
    setShowCategoryModal(true);
};

// Handler to close modal and reset edit state
const handleCloseCategoryModal = () => {
    setShowCategoryModal(false);
    setIsEditingCategory(false);
    setEditingCategoryId(null);
    setNewCategory({ name: '', subCategories: [] });
    setNewSubCategoryInput('');
};

// Updated save handler to support both create and update
const handleSaveCategory = async () => {
    try {
        if (!newCategory.name.trim()) {
            alert('Category name is required');
            return;
        }

        if (isEditingCategory && editingCategoryId) {
            // UPDATE MODE
            await api.updateCategory(editingCategoryId, {
                name: newCategory.name,
                subCategories: newCategory.subCategories
            });

            setCategories(prev => prev.map(cat =>
                cat.id === editingCategoryId
                    ? { ...cat, name: newCategory.name, subCategories: newCategory.subCategories }
                    : cat
            ));

            alert('✅ Category updated successfully!');
        } else {
            // CREATE MODE
            const result = await api.addCategory({
                name: newCategory.name,
                subCategories: newCategory.subCategories,
                isActive: true
            });

            setCategories(prev => [...prev, result.category || result]);
            alert('✅ Category created successfully!');
        }

        handleCloseCategoryModal();

        // Refresh categories
        const updatedCategories = await api.getCategories();
        setCategories(updatedCategories);
    } catch (error: any) {
        console.error('Error saving category:', error);
        alert('❌ ' + (error?.message || 'Failed to save category'));
    }
};

// Delete category handler
const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('⚠️ Delete this category? Templates using it will be affected.')) {
        return;
    }

    try {
        await api.deleteCategory(categoryId);
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        alert('✅ Category deleted!');
    } catch (error: any) {
        alert('❌ ' + (error?.message || 'Failed to delete'));
    }
};

// ============================================================
// STEP 3: Update Modal Title (find the modal h3 tag)
// ============================================================

// Replace:
// <h3>Manage Categories</h3>

// With:
<h3 className="text-lg font-bold text-white flex items-center gap-2">
    <FolderTree size={20} className="text-indigo-400" />
    {isEditingCategory ? 'Edit Category' : 'Manage Categories'}
</h3>

// ============================================================
// STEP 4: Update Button Text (find the Create button)
// ============================================================

// Replace:
// Create

// With:
{ isEditingCategory ? 'Update' : 'Create' }

// ============================================================
// STEP 5: Add Cancel Button (next to Create/Update button)
// ============================================================

{
    isEditingCategory && (
        <button
            onClick={handleCloseCategoryModal}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm font-medium h-[38px]"
        >
            Cancel
        </button>
    )
}

// ============================================================
// STEP 6: Update Close Button (X button at top right)
// ============================================================

// Replace:
// onClick={() => setShowCategoryModal(false)}

// With:
onClick = { handleCloseCategoryModal }

    // ============================================================
    // STEP 7: Add Edit Button in Category List
    // Replace the delete button line with:
    // ============================================================

    < div className = "flex justify-between items-center mb-3" >
  <h4 className="font-bold text-white flex items-center gap-2">
    <FolderPlus size={16} className="text-gray-500" /> {cat.name}
  </h4>
  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
    <button 
      onClick={() => handleEditCategory(cat)} 
      className="text-gray-600 hover:text-indigo-400" 
      title="Edit"
    >
      <Edit2 size={16} />
    </button>
    <button 
      onClick={() => handleDeleteCategory(cat.id)} 
      className="text-gray-600 hover:text-red-400" 
      title="Delete"
    >
      <Trash2 size={16} />
    </button>
  </div>
</div >

    // ============================================================
    // STEP 8: Hide category list when editing
    // ============================================================

    // Wrap the categories mapping div with:
    {!isEditingCategory && (
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {/* existing categories.map code */}
        </div>
    )}

/**
 * THAT'S IT! 🎉
 * 
 * After adding these changes:
 * 1. Categories में Edit button दिखेगा (hover करने पर)
 * 2. Edit button click करने पर form populate हो जाएगा
 * 3. Category name और sub-categories edit कर सकेंगे
 * 4. Update button से changes save होंगे
 * 5. Cancel button से edit mode cancel होगा
 */
