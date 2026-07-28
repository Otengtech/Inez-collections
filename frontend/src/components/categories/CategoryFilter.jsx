import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters } from '../../redux/slices/productSlice'

const CategoryFilter = () => {
  const dispatch = useDispatch()
  const { filters } = useSelector((state) => state.products)

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'wigs', label: 'Wigs' },
    { value: 'lip-gloss', label: 'Lip Gloss' },
    { value: 'sandals', label: 'Sandals' },
    { value: 'slippers', label: 'Slippers' },
  ]

  const handleCategoryChange = (category) => {
    dispatch(setFilters({ category, page: 1 })) // ✅ Reset page when filtering
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => handleCategoryChange(cat.value)}
          className={`px-4 py-2 rounded-full transition-all text-sm ${
            filters.category === cat.value
              ? 'bg-[#D6F04C] text-black shadow-md'
              : 'bg-gray-100 text-black-700 hover:bg-gray-200'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter