import { useState, useEffect } from 'react';
import { adminApi } from '../../utils/adminApi';
import Modal from '../../components/common/Modal';

export default function SectionManagement() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const result = await adminApi.getSections();
      if (result.success) {
        setSections(result.data.sections || []);
      } else {
        console.error('Error fetching sections:', result.error);
        setSections([]);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (editingSection) {
        result = await adminApi.updateSection(editingSection.id, formData);
      } else {
        result = await adminApi.createSection(formData);
      }
      
      if (result.success) {
        setShowModal(false);
        setEditingSection(null);
        resetForm();
        fetchSections();
      } else {
        console.error('Error saving section:', result.error);
        alert('Failed to save section: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Failed to save section');
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      slug: section.slug,
      description: section.description || '',
      display_order: section.display_order,
      is_active: section.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section? Products will be moved to Miscellaneous.')) {
      try {
        const result = await adminApi.deleteSection(sectionId, true);
        if (result.success) {
          fetchSections();
        } else {
          console.error('Error deleting section:', result.error);
          alert('Failed to delete section: ' + result.error);
        }
      } catch (error) {
        console.error('Error deleting section:', error);
        alert('Failed to delete section');
      }
    }
  };

  const handleToggleStatus = async (sectionId) => {
    try {
      const result = await adminApi.toggleSectionStatus(sectionId);
      if (result.success) {
        fetchSections();
      } else {
        console.error('Error toggling section status:', result.error);
        alert('Failed to toggle section status: ' + result.error);
      }
    } catch (error) {
      console.error('Error toggling section status:', error);
      alert('Failed to toggle section status');
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      display_order: 0,
      is_active: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-neutral-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mr-2"></div>
        Loading sections...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Section Management</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage product categories and structure</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingSection(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Section
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map(section => (
          <div key={section.id} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-lg text-neutral-800">{section.name}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${section.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                {section.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="mb-6">
              <code className="inline-block px-2 py-1 bg-neutral-100 text-primary-600 rounded text-xs font-mono mb-3">
                /{section.slug}
              </code>
              <p className="text-neutral-500 text-sm h-10 line-clamp-2">
                {section.description || 'No description provided'}
              </p>
            </div>

            <div className="flex items-center gap-4 mb-6 p-3 bg-neutral-50 rounded-xl">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Products</span>
                <span className="text-lg font-bold text-neutral-700">{section.product_count}</span>
              </div>
              <div className="w-px h-8 bg-neutral-200"></div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Order</span>
                <span className="text-lg font-bold text-neutral-700">{section.display_order}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <button
                onClick={() => handleToggleStatus(section.id)}
                className={`p-2 rounded-lg transition-colors ${section.is_active
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                title={section.is_active ? 'Deactivate' : 'Activate'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {section.is_active ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(section)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(section.id)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  title="Delete"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingSection ? 'Edit Section' : 'Add New Section'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={handleNameChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Slug *</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
            <p className="text-xs text-neutral-500 mt-1">Unique URL identifier (e.g., men-collection).</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Display Order</label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
              <select
                value={formData.is_active ? 'active' : 'inactive'}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 mt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
            >
              {editingSection ? 'Update Section' : 'Create Section'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
