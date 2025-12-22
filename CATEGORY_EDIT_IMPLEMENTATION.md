// Category Edit Functionality Implementation Guide
// Add this code to your Admin Panel App.tsx

// ===== 1. ADD THESE STATE VARIABLES (around line 150-200 where other states are) =====

const [isEditingCategory, setIsEditingCategory] = useState(false);
const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

// ===== 2. MODIFY EXISTING newCategory STATE INITIALIZATION =====
// Replace the existing newCategory initialization with this:
const [newCategory, setNewCategory] = useState<{ name: string; subCategories: string[] }>({ 
  name: '', 
  subCategories: [] 
});

// ===== 3. ADD THIS HANDLER FUNCTION (place it near other handlers) =====

const handleEditCategory = (category: Category) => {
  setIsEditingCategory(true);
  setEditingCategoryId(category.id);
  setNewCategory({
    name: category.name,
    subCategories: [...category.subCategories]
  });
  setShowCategoryModal(true);
};

// ===== 4. UPDATE handleSaveCategory FUNCTION =====
// Replace existing handleSaveCategory with this:

const handleSaveCategory = async () => {
  try {
    if (!newCategory.name.trim()) {
      alert('Category name is required');
      return;
    }

    if (isEditingCategory && editingCategoryId) {
      // UPDATE existing category
      await api.updateCategory(editingCategoryId, {
        name: newCategory.name,
        subCategories: newCategory.subCategories
      });
      
      // Update local state
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategoryId 
          ? { ...cat, name: newCategory.name, subCategories: newCategory.subCategories }
          : cat
      ));
      
      alert('Category updated successfully!');
    } else {
      // CREATE new category
      const result = await api.addCategory({
        name: newCategory.name,
        subCategories: newCategory.subCategories,
        isActive: true
      });
      
      // Add to local state
      setCategories(prev => [...prev, result.category || result]);
      alert('Category created successfully!');
    }

    // Reset form
    setNewCategory({ name: '', subCategories: [] });
    setIsEditingCategory(false);
    setEditingCategoryId(null);
    setShowCategoryModal(false);
    
    // Refresh categories from backend
    const updatedCategories = await api.getCategories();
    setCategories(updatedCategories);
  } catch (error: any) {
    console.error('Error saving category:', error);
    alert(error?.message || 'Failed to save category');
  }
};

// ===== 5. ADD CLOSE HANDLER TO RESET EDIT MODE =====

const handleCloseCategoryModal = () => {
  setShowCategoryModal(false);
  setIsEditingCategory(false);
  setEditingCategoryId(null);
  setNewCategory({ name: '', subCategories: [] });
};

// ===== 6. UPDATE THE CATEGORY MODAL JSX =====

{/* Category Management Modal */}
{showCategoryModal && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-2xl w-full shadow-2xl h-[80vh] flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FolderTree size={20} className="text-indigo-400" />
            {isEditingCategory ? 'Edit Category' : 'Manage Categories'}
          </h3>
          <p className="text-sm text-gray-400">
            {isEditingCategory ? 'Update category name and sub-categories' : 'Add, edit, or remove categories and sub-categories.'}
          </p>
        </div>
        <button onClick={handleCloseCategoryModal} className="text-gray-500 hover:text-white"><X size={20} /></button>
      </div>

      {/* Add/Edit Category Form */}
      <div className="bg-gray-950 p-4 rounded-lg border border-gray-800 mb-6 flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-xs text-gray-500 uppercase block mb-1">
            {isEditingCategory ? 'Category Name' : 'New Category Name'}
          </label>
          <input
            type="text"
            value={newCategory.name}
            onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
            placeholder="e.g. 3D Render"
          />
        </div>
        <div className="flex-1">
          <label className="text-xs text-gray-500 uppercase block mb-1">Add Sub-category</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubCategoryInput}
              onChange={e => setNewSubCategoryInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleAddSubCategory()}
              className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm"
              placeholder="e.g. Isometric"
            />
            <button onClick={handleAddSubCategory} disabled={!newSubCategoryInput} className="p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"><Plus size={16} /></button>
          </div>
        </div>
        <button 
          onClick={handleSaveCategory} 
          disabled={!newCategory.name} 
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-sm font-medium h-[38px]"
        >
          {isEditingCategory ? 'Update' : 'Create'}
        </button>
        {isEditingCategory && (
          <button 
            onClick={handleCloseCategoryModal} 
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm font-medium h-[38px]"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Staged Sub-categories */}
      {newCategory.subCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 p-3 bg-gray-950/50 rounded-lg border border-dashed border-gray-800">
          <span className="text-xs text-gray-500 uppercase w-full">
            {isEditingCategory ? 'Sub-categories:' : 'Pending Sub-categories:'}
          </span>
          {newCategory.subCategories.map((sub, idx) => (
            <span key={idx} className="text-xs bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded flex items-center gap-1 border border-indigo-500/20">
              {sub} <button onClick={() => setNewCategory(prev => ({ ...prev, subCategories: prev.subCategories.filter(s => s !== sub) }))} className="hover:text-white"><X size={12} /></button>
            </span>
          ))}
        </div>
      )}

      {/* Existing Categories List - Only show when NOT editing */}
      {!isEditingCategory && (
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {categories.map(cat => (
            <div key={cat.id} className="bg-gray-950 border border-gray-800 rounded-lg p-4 group">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-white flex items-center gap-2"><FolderPlus size={16} className="text-gray-500" /> {cat.name}</h4>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditCategory(cat)} className="text-gray-600 hover:text-indigo-400" title="Edit Category"><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-600 hover:text-red-400" title="Delete Category"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.subCategories.map((sub, idx) => (
                  <span key={idx} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">
                    {sub}
                  </span>
                ))}
                {cat.subCategories.length === 0 && <span className="text-xs text-gray-600 italic">No sub-categories</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

// ===== 7. ENSURE handleDeleteCategory EXISTS =====

const handleDeleteCategory = async (categoryId: string) => {
  if (!confirm('Are you sure you want to delete this category? This will affect all templates using this category.')) {
    return;
  }
  
  try {
    await api.deleteCategory(categoryId);
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    alert('Category deleted successfully!');
  } catch (error: any) {
    console.error('Error deleting category:', error);
    alert(error?.message || 'Failed to delete category');
  }
};

// ===== 8. ENSURE handleAddSubCategory EXISTS =====

const handleAddSubCategory = () => {
  if (newSubCategoryInput.trim()) {
    setNewCategory(prev => ({
      ...prev,
      subCategories: [...prev.subCategories, newSubCategoryInput.trim()]
    }));
    setNewSubCategoryInput('');
  }
};
