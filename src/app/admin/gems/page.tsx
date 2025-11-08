'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import AdminGuard from '@/components/AdminGuard';

interface Gem {
  id: string;
  name: string;
  type: string;
  price: number;
  carat: number;
  origin: string;
  in_stock: boolean;
  featured: boolean;
  created_at: string;
}

export default function GemsManagement() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [gems, setGems] = useState<Gem[]>([]);
  const [loadingGems, setLoadingGems] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGem, setEditingGem] = useState<Gem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'sapphire',
    description: '',
    price: '',
    carat: '',
    color: '',
    origin: '',
    cut: '',
    clarity: '',
    certification: '',
    in_stock: true,
    featured: false,
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
    } else if (user) {
      loadGems();
    }
  }, [user, loading, router]);

  async function loadGems() {
    try {
      setLoadingGems(true);
      const { data, error } = await supabase
        .from('gems')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGems(data || []);
    } catch (error) {
      console.error('Error loading gems:', error);
    } finally {
      setLoadingGems(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedImages.length + files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setUploadingImages(true);

    try {
      const newImageUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image`);
          continue;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large (max 5MB)`);
          continue;
        }

        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `gem-${Date.now()}-${i}.${fileExt}`;
        const filePath = `gems/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars') // Using same bucket, or create 'gems' bucket
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        newImageUrls.push(publicUrl);
      }

      setUploadedImages([...uploadedImages, ...newImageUrls]);
    } catch (error: any) {
      alert('Error uploading images: ' + error.message);
    } finally {
      setUploadingImages(false);
    }
  }

  function removeImage(index: number) {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const gemData = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        price: parseFloat(formData.price),
        carat: parseFloat(formData.carat),
        color: formData.color,
        origin: formData.origin,
        cut: formData.cut,
        clarity: formData.clarity,
        certification: formData.certification || null,
        in_stock: formData.in_stock,
        featured: formData.featured,
        images: uploadedImages,
      };

      if (editingGem) {
        // Update
        const { error } = await supabase
          .from('gems')
          .update(gemData)
          .eq('id', editingGem.id);

        if (error) throw error;
        alert('Gem updated successfully');
      } else {
        // Create
        const { error } = await supabase
          .from('gems')
          .insert([gemData]);

        if (error) throw error;
        alert('Gem created successfully');
      }

      setShowModal(false);
      setEditingGem(null);
      resetForm();
      loadGems();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this gem?')) return;

    try {
      const { error } = await supabase
        .from('gems')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setGems(gems.filter(g => g.id !== id));
      alert('Gem deleted successfully');
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  }

  function openEditModal(gem: Gem) {
    setEditingGem(gem);
    setFormData({
      name: gem.name,
      type: gem.type,
      description: '',
      price: gem.price.toString(),
      carat: gem.carat.toString(),
      color: '',
      origin: gem.origin,
      cut: '',
      clarity: '',
      certification: '',
      in_stock: gem.in_stock,
      featured: gem.featured,
    });
    setShowModal(true);
  }

  function resetForm() {
    setFormData({
      name: '',
      type: 'sapphire',
      description: '',
      price: '',
      carat: '',
      color: '',
      origin: '',
      cut: '',
      clarity: '',
      certification: '',
      in_stock: true,
      featured: false,
    });
    setUploadedImages([]);
  }

  if (loading || loadingGems) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-white text-lg">Loading gems...</div>
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-gold hover:text-gold/80 transition text-sm mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">
              Gems Management
            </h1>
            <p className="text-white/60">Total: {gems.length} gems</p>
          </div>
          <button
            onClick={() => {
              setEditingGem(null);
              resetForm();
              setShowModal(true);
            }}
            className="px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition"
          >
            + Add New Gem
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gems.map((gem) => (
            <div key={gem.id} className="bg-gradient-to-br from-royal-blue/20 to-black border border-gold/20 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-serif text-white mb-1">{gem.name}</h3>
                  <p className="text-white/60 text-sm capitalize">{gem.type}</p>
                </div>
                <div className="flex gap-2">
                  {gem.featured && (
                    <span className="px-2 py-1 bg-gold/20 text-gold rounded text-xs">Featured</span>
                  )}
                  {!gem.in_stock && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Out of Stock</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Price</span>
                  <span className="text-gold font-semibold">${gem.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Carat</span>
                  <span className="text-white">{gem.carat} ct</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Origin</span>
                  <span className="text-white">{gem.origin}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(gem)}
                  className="flex-1 px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(gem.id)}
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gradient-to-br from-royal-blue/40 to-black border border-gold/30 rounded-lg p-8 max-w-2xl w-full my-8">
              <h2 className="text-2xl font-serif text-white mb-6">
                {editingGem ? 'Edit Gem' : 'Add New Gem'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-2">Type *</label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    >
                      <option value="sapphire">Sapphire</option>
                      <option value="ruby">Ruby</option>
                      <option value="emerald">Emerald</option>
                      <option value="diamond">Diamond</option>
                      <option value="quartz">Quartz</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/60 mb-2">Price ($) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-2">Carat *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.carat}
                      onChange={(e) => setFormData({ ...formData, carat: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-2">Color *</label>
                    <input
                      type="text"
                      required
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-2">Origin *</label>
                    <input
                      type="text"
                      required
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-2">Cut *</label>
                    <input
                      type="text"
                      required
                      value={formData.cut}
                      onChange={(e) => setFormData({ ...formData, cut: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 mb-2">Clarity *</label>
                    <input
                      type="text"
                      required
                      value={formData.clarity}
                      onChange={(e) => setFormData({ ...formData, clarity: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 mb-2">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-2">Certification</label>
                  <input
                    type="text"
                    value={formData.certification}
                    onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur border border-gold/20 rounded-lg focus:outline-none focus:border-gold text-white"
                    placeholder="e.g., GIA Certified"
                  />
                </div>

                <div>
                  <label className="block text-white/60 mb-2">Images (up to 5)</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImages || uploadedImages.length >= 5}
                    className="w-full px-4 py-3 bg-white/10 border border-gold/20 rounded-lg hover:bg-white/20 transition text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImages ? 'Uploading...' : `Upload Images (${uploadedImages.length}/5)`}
                  </button>
                  
                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {uploadedImages.map((url, index) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={url}
                            alt={`Gem ${index + 1}`}
                            className="w-full h-full object-cover rounded border border-gold/20"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.in_stock}
                      onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="text-white">In Stock</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="text-white">Featured</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition"
                  >
                    {editingGem ? 'Update Gem' : 'Create Gem'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingGem(null);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition border border-gold/20"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </div>
    </AdminGuard>
  );
}
