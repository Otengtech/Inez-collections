import React, { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faSearch,
  faTimes,
  faSave,
  faImage,
  faTag,
  faBox,
  faLayerGroup,
  faPalette,
  faRuler,
  faUpload,
  faSpinner,
  faCheck,
  faCloudUploadAlt,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import api from '../../services/api'
import ScrollReveal from '../common/ScrollReveal'

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [expandedMobile, setExpandedMobile] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'dresses',
    price: '',
    description: '',
    images: [],
    sizes: [],
    colors: [],
    stock: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products')
      setProducts(response.data.products || [])
    } catch (error) {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const uploadImageToBackend = async (file) => {
    const formData = new FormData()
    formData.append('image', file)

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(progress)
        },
      })
      return response.data.url
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload image')
      return null
    }
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    if (formData.images.length + acceptedFiles.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadPromises = acceptedFiles.map((file) => uploadImageToBackend(file))
      const uploadedUrls = await Promise.all(uploadPromises)
      const validUrls = uploadedUrls.filter(url => url !== null && url !== undefined)
      
      if (validUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...validUrls],
        }))
        toast.success(`${validUrls.length} image(s) uploaded successfully! 📸`)
      } else {
        toast.error('Failed to upload images. Please try again.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload images')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [formData.images])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxSize: 5242880,
    disabled: uploading,
  })

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name || '',
        category: product.category || 'dresses',
        price: product.price || '',
        description: product.description || '',
        images: product.images || [],
        sizes: product.sizes || [],
        colors: product.colors || [],
        stock: product.stock || '',
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        category: 'dresses',
        price: '',
        description: '',
        images: [],
        sizes: [],
        colors: [],
        stock: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setUploading(false)
    setUploadProgress(0)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item)
    setFormData((prev) => ({ ...prev, [field]: items }))
  }

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Please enter a product name')
      return
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price')
      return
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      toast.error('Please enter a valid stock quantity')
      return
    }
    if (formData.images.length === 0) {
      toast.error('Please upload at least one image')
      return
    }

    try {
      const productData = {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        images: formData.images,
        sizes: formData.sizes || [],
        colors: formData.colors || [],
        stock: parseInt(formData.stock),
        isActive: true,
      }

      let response
      if (editingProduct) {
        response = await api.put(`/products/${editingProduct._id}`, productData)
        if (response.data.success) {
          toast.success('Product updated successfully! ✏️')
        }
      } else {
        response = await api.post('/products', productData)
        if (response.data.success) {
          toast.success('Product created successfully! 🎉')
        }
      }
      
      await fetchProducts()
      handleCloseModal()
    } catch (error) {
      console.error('Save error:', error)
      toast.error(error.response?.data?.message || 'Failed to save product')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`)
        toast.success('Product deleted successfully 🗑️')
        await fetchProducts()
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete product')
      }
    }
  }

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStockBadge = (stock) => {
    if (stock > 10) {
      return { label: 'In Stock', color: 'bg-green-100 text-green-600' }
    } else if (stock > 0) {
      return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-600' }
    } else {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-600' }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-3 border-[#D6F04C] border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-sm text-black/50">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-black">Product Management</h1>
          <p className="text-xs sm:text-sm text-black/40 mt-1">Manage your store products</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-2 bg-black text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-black-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm sm:text-base w-full sm:w-auto"
        >
          <FontAwesomeIcon icon={faPlus} className="text-xs sm:text-sm" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-xs sm:text-sm" />
        </div>
        <input
          type="text"
          placeholder="Search products by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 pl-11 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F04C]/40 focus:bg-white transition-all duration-300 text-sm border border-transparent focus:border-[#D6F04C] placeholder:text-black/30"
        />
      </div>

      {/* Products Table - Desktop */}
      <div className="hidden md:block">
        <ScrollReveal direction="up">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100/50">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-[#F4F6F2]">
                  <tr>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-black/50 uppercase tracking-wider">Image</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-black/50 uppercase tracking-wider">Name</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-black/50 uppercase tracking-wider">Category</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-black/50 uppercase tracking-wider">Price</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-black/50 uppercase tracking-wider">Stock</th>
                    <th className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-black/50 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-[#F4F6F2]/50 transition-colors">
                        <td className="px-4 lg:px-6 py-4">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                              onError={(e) => {
                                e.target.src = '/placeholder.jpg'
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FontAwesomeIcon icon={faImage} className="text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-4 font-medium text-sm text-black">{product.name}</td>
                        <td className="px-4 lg:px-6 py-4 capitalize text-sm text-black/70">{product.category}</td>
                        <td className="px-4 lg:px-6 py-4 font-bold text-sm text-[#D6F04C]">₵{product.price?.toFixed(2) || '0.00'}</td>
                        <td className="px-4 lg:px-6 py-4">
                          <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-medium ${getStockBadge(product.stock).color}`}>
                            {getStockBadge(product.stock).label} ({product.stock})
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenModal(product)}
                              className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors flex items-center justify-center"
                              title="Edit product"
                            >
                              <FontAwesomeIcon icon={faEdit} className="text-xs sm:text-sm" />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center"
                              title="Delete product"
                            >
                              <FontAwesomeIcon icon={faTrash} className="text-xs sm:text-sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="text-4xl mb-3">📦</div>
                        <p className="text-black/50 text-sm">No products found</p>
                        <button
                          onClick={() => handleOpenModal()}
                          className="mt-4 text-[#D6F04C] hover:text-[#C5E043] font-medium text-sm transition-colors"
                        >
                          Add your first product →
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Products Cards - Mobile & Tablet */}
      <div className="md:hidden space-y-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100/50">
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-xl"
                      onError={(e) => {
                        e.target.src = '/placeholder.jpg'
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FontAwesomeIcon icon={faImage} className="text-gray-400 text-2xl" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-black truncate">{product.name}</h3>
                    <p className="text-xs text-black/50 capitalize">{product.category}</p>
                    <p className="text-lg font-bold text-[#D6F04C]">₵{product.price?.toFixed(2) || '0.00'}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStockBadge(product.stock).color}`}>
                      {getStockBadge(product.stock).label} ({product.stock})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => setExpandedMobile(expandedMobile === product._id ? null : product._id)}
                    className="text-xs text-black/50 hover:text-[#D6F04C] transition-colors flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={expandedMobile === product._id ? faChevronUp : faChevronDown} className="text-xs" />
                    {expandedMobile === product._id ? 'Hide' : 'Details'}
                  </button>
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="px-3 py-1.5 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="px-3 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete
                  </button>
                </div>

                {/* Expanded Details on Mobile */}
                {expandedMobile === product._id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    <p className="text-sm text-black/60">{product.description || 'No description'}</p>
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-black/40">Sizes:</span>
                        {product.sizes.map((size, i) => (
                          <span key={i} className="text-xs bg-[#F4F6F2] px-2 py-0.5 rounded-full">{size}</span>
                        ))}
                      </div>
                    )}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-black/40">Colors:</span>
                        {product.colors.map((color, i) => (
                          <span key={i} className="text-xs bg-[#F4F6F2] px-2 py-0.5 rounded-full">{color}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-black/40">Images:</span>
                      <span className="text-xs text-black/60">{product.images?.length || 0} uploaded</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100/50">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-black/50 text-sm">No products found</p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-4 text-[#D6F04C] hover:text-[#C5E043] font-medium text-sm transition-colors"
            >
              Add your first product →
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal - Responsive */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-black">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <p className="text-xs sm:text-sm text-black/40 mt-0.5 sm:mt-1">
                  {editingProduct ? 'Update product details' : 'Fill in the product details'}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center flex-shrink-0"
              >
                <FontAwesomeIcon icon={faTimes} className="text-gray-400 text-lg sm:text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-black/70 mb-1.5">
                  Product Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faTag} className="text-gray-400 text-xs sm:text-sm" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F04C]/40 focus:bg-white transition-all duration-300 text-sm border border-transparent focus:border-[#D6F04C] placeholder:text-black/30"
                    placeholder="Product name"
                    required
                  />
                </div>
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-black/70 mb-1.5">
                    Category *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faLayerGroup} className="text-gray-400 text-xs sm:text-sm" />
                    </div>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-9 sm:pl-11 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F04C]/40 focus:bg-white transition-all duration-300 text-sm border border-transparent focus:border-[#D6F04C] appearance-none"
                      required
                    >
                      <option value="dresses">Dresses</option>
                      <option value="wigs">Wigs</option>
                      <option value="lip-gloss">Lip Gloss</option>
                      <option value="sandals">Sandals</option>
                      <option value="slippers">Slippers</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-black/70 mb-1.5">
                    Price (₵) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-xs sm:text-sm font-medium">₵</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-7 sm:pl-9 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F04C]/40 focus:bg-white transition-all duration-300 text-sm border border-transparent focus:border-[#D6F04C] placeholder:text-black/30"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-black/70 mb-1.5">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F04C]/40 focus:bg-white transition-all duration-300 text-sm border border-transparent focus:border-[#D6F04C] placeholder:text-black/30 resize-none"
                  placeholder="Product description"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-black/70 mb-1.5">
                  <FontAwesomeIcon icon={faImage} className="mr-1 sm:mr-2 text-[#D6F04C]" />
                  Product Images * ({formData.images.length}/5)
                </label>
                
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? 'border-[#D6F04C] bg-[#D6F04C]/10'
                      : 'border-gray-300 hover:border-[#D6F04C] hover:bg-[#F4F6F2]'
                  } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-1 sm:gap-2">
                    <FontAwesomeIcon 
                      icon={isDragActive ? faCloudUploadAlt : faUpload} 
                      className={`text-2xl sm:text-3xl ${isDragActive ? 'text-[#D6F04C]' : 'text-gray-400'}`} 
                    />
                    {uploading ? (
                      <>
                        <p className="text-xs sm:text-sm font-medium text-black/70">Uploading...</p>
                        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#D6F04C] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-black/40">{uploadProgress}%</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs sm:text-sm font-medium text-black/70">
                          {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                        </p>
                        <p className="text-[10px] sm:text-xs text-black/40">
                          or click to select files (Max 5, up to 5MB each)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Image Previews */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 mt-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = '/placeholder.jpg'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 text-[10px] sm:text-xs"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sizes & Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-black/70 mb-1.5">
                    <FontAwesomeIcon icon={faRuler} className="mr-1 sm:mr-2 text-[#D6F04C]" />
                    Sizes (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.sizes.join(', ')}
                    onChange={(e) => handleArrayChange('sizes', e.target.value)}
                    placeholder="S, M, L, XL"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F04C]/40 focus:bg-white transition-all duration-300 text-sm border border-transparent focus:border-[#D6F04C] placeholder:text-black/30"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-black/70 mb-1.5">
                    <FontAwesomeIcon icon={faPalette} className="mr-1 sm:mr-2 text-[#D6F04C]" />
                    Colors (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.colors.join(', ')}
                    onChange={(e) => handleArrayChange('colors', e.target.value)}
                    placeholder="Black, Gold, White"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F04C]/40 focus:bg-white transition-all duration-300 text-sm border border-transparent focus:border-[#D6F04C] placeholder:text-black/30"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-black/70 mb-1.5">
                  <FontAwesomeIcon icon={faBox} className="mr-1 sm:mr-2 text-[#D6F04C]" />
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className="w-full sm:w-48 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F04C]/40 focus:bg-white transition-all duration-300 text-sm border border-transparent focus:border-[#D6F04C] placeholder:text-black/30"
                  placeholder="0"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 sm:pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={uploading || formData.images.length === 0}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-black text-white font-semibold px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl hover:bg-black-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <FontAwesomeIcon icon={faSave} className="text-xs sm:text-sm" />
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 sm:px-6 py-3 sm:py-3.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-xs sm:text-sm font-medium text-black/60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductManagement