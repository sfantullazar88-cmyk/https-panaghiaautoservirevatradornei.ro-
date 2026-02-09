import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search,
  X,
  Save,
  Image,
  Star
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { menuApi } from '../../services/api';

const AdminMenu = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [dailyMenu, setDailyMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('items');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesData, itemsData, dailyData] = await Promise.all([
        menuApi.getCategories(),
        menuApi.getItems(),
        menuApi.getDailyMenu()
      ]);
      setCategories(categoriesData);
      setItems(itemsData);
      setDailyMenu(dailyData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Item handlers
  const handleSaveItem = async (itemData) => {
    try {
      if (editingItem?.id) {
        await adminApi.updateItem(editingItem.id, itemData);
      } else {
        await adminApi.createItem(itemData);
      }
      fetchData();
      setShowItemModal(false);
      setEditingItem(null);
    } catch (err) {
      alert('Eroare: ' + err.message);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Sigur doriți să ștergeți acest produs?')) return;
    try {
      await adminApi.deleteItem(itemId);
      fetchData();
    } catch (err) {
      alert('Eroare: ' + err.message);
    }
  };

  // Category handlers
  const handleSaveCategory = async (categoryData) => {
    try {
      if (editingCategory?.id) {
        await adminApi.updateCategory(editingCategory.id, categoryData);
      } else {
        await adminApi.createCategory(categoryData);
      }
      fetchData();
      setShowCategoryModal(false);
      setEditingCategory(null);
    } catch (err) {
      alert('Eroare: ' + err.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Sigur doriți să ștergeți această categorie?')) return;
    try {
      await adminApi.deleteCategory(categoryId);
      fetchData();
    } catch (err) {
      alert('Eroare: ' + err.message);
    }
  };

  // Daily menu handlers
  const handleUpdateDailyMenu = async (menuId, data) => {
    try {
      await adminApi.updateDailyMenu(menuId, data);
      fetchData();
    } catch (err) {
      alert('Eroare: ' + err.message);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category_id === selectedCategory);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A847]"></div>
      </div>
    );
  }

  return (
    <div className="p-6" data-testid="admin-menu">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Gestionare Meniu
          </h1>
          <p className="text-gray-600 mt-1">Adaugă, editează sau șterge produse și categorii</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm mb-6">
        <div className="flex border-b">
          {['items', 'categories', 'daily'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 text-center font-medium transition-colors ${
                activeTab === tab
                  ? 'text-[#D4A847] border-b-2 border-[#D4A847]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'items' ? 'Produse' : tab === 'categories' ? 'Categorii' : 'Meniu Zilnic'}
            </button>
          ))}
        </div>
      </div>

      {/* Items Tab */}
      {activeTab === 'items' && (
        <>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                  selectedCategory === 'all' ? 'bg-[#D4A847] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toate
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    selectedCategory === cat.id ? 'bg-[#D4A847] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowItemModal(true);
              }}
              className="bg-[#D4A847] text-white px-4 py-2 rounded-xl hover:bg-[#c49a3d] transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Adaugă Produs</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="relative h-40">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.is_popular && (
                    <span className="absolute top-2 left-2 bg-[#D4A847] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      Popular
                    </span>
                  )}
                  {!item.is_available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">Indisponibil</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-[#D4A847]">{item.price} lei</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setShowItemModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <>
          <div className="flex justify-end mb-6">
            <button
              onClick={() => {
                setEditingCategory(null);
                setShowCategoryModal(true);
              }}
              className="bg-[#D4A847] text-white px-4 py-2 rounded-xl hover:bg-[#c49a3d] transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Adaugă Categorie
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <span className="text-sm text-gray-500">#{category.order}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Slug: {category.slug}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category);
                      setShowCategoryModal(true);
                    }}
                    className="flex-1 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Editează
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="py-2 px-4 border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Daily Menu Tab */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          {dailyMenu.map((menu) => (
            <div key={menu.id} className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{menu.day}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ciorbă</label>
                  <input
                    type="text"
                    defaultValue={menu.soup}
                    onBlur={(e) => {
                      if (e.target.value !== menu.soup) {
                        handleUpdateDailyMenu(menu.id, { soup: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4A847] focus:ring-2 focus:ring-[#D4A847]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fel Principal</label>
                  <input
                    type="text"
                    defaultValue={menu.main}
                    onBlur={(e) => {
                      if (e.target.value !== menu.main) {
                        handleUpdateDailyMenu(menu.id, { main: e.target.value });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4A847] focus:ring-2 focus:ring-[#D4A847]/20"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Modal */}
      {showItemModal && (
        <ItemModal
          item={editingItem}
          categories={categories}
          onSave={handleSaveItem}
          onClose={() => {
            setShowItemModal(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          onSave={handleSaveCategory}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
};

// Item Modal Component
const ItemModal = ({ item, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    category_id: item?.category_id || categories[0]?.id || '',
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || '',
    image: item?.image || '',
    is_popular: item?.is_popular || false,
    is_available: item?.is_available ?? true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {item ? 'Editează Produs' : 'Adaugă Produs Nou'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categorie</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4A847]"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nume</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4A847]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descriere</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4A847] resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preț (lei)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4A847]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL Imagine</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4A847]"
                required
              />
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_popular}
                  onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#D4A847] focus:ring-[#D4A847]"
                />
                <span className="text-sm text-gray-700">Produs popular</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#D4A847] focus:ring-[#D4A847]"
                />
                <span className="text-sm text-gray-700">Disponibil</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Anulează
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#D4A847] text-white rounded-xl hover:bg-[#c49a3d] transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Salvează
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Category Modal Component
const CategoryModal = ({ category, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    icon: category?.icon || 'default',
    order: category?.order || 0,
    is_active: category?.is_active ?? true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      order: parseInt(formData.order)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {category ? 'Editează Categorie' : 'Adaugă Categorie'}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nume</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  name: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4A847]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4A847]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ordine</label>
              <input
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#D4A847]"
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-[#D4A847] focus:ring-[#D4A847]"
              />
              <span className="text-sm text-gray-700">Activ</span>
            </label>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Anulează
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#D4A847] text-white rounded-xl hover:bg-[#c49a3d] transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Salvează
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminMenu;
