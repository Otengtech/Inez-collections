import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCrown,
  faShoePrints,
  faSocks,
  faTshirt,
  faPaintRoller,
  faArrowRight,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import ScrollReveal from '../common/ScrollReveal'
import api from '../../services/api'
import img from "../../assets/img4.jpg"

const ArrowUpRight = ({ className = '' }) => (
  <FontAwesomeIcon icon={faArrowRight} className={`-rotate-45 ${className}`} />
)

const CategorySection = () => {
  const [categoryCounts, setCategoryCounts] = useState({})
  const [loading, setLoading] = useState(true)

  const categories = [
    { 
      name: 'Dresses', 
      slug: 'dresses', 
      icon: faTshirt, 
      color: '#C77DFF',
      iconColor: '#FFFFFF',
      items: '0' 
    },
    { 
      name: 'Wigs', 
      slug: 'wigs', 
      icon: faCrown, 
      color: '#F4A261',
      iconColor: '#FFFFFF',
      items: '0' 
    },
    { 
      name: 'Lip Gloss', 
      slug: 'lip-gloss', 
      icon: faPaintRoller, 
      color: '#E63946',
      iconColor: '#FFFFFF',
      items: '0' 
    },
    { 
      name: 'Sandals', 
      slug: 'sandals', 
      icon: faShoePrints, 
      color: '#2A9D8F',
      iconColor: '#FFFFFF',
      items: '0' 
    },
    { 
      name: 'Slippers', 
      slug: 'slippers', 
      icon: faSocks, 
      color: '#457B9D',
      iconColor: '#FFFFFF',
      items: '0' 
    },
  ]

  // Fetch product counts for each category
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        setLoading(true)
        const counts = {}
        
        // Fetch all products to count by category
        const response = await api.get('/products', { 
          params: { limit: 100 } // Get enough products to count
        })
        
        if (response.data.success) {
          const products = response.data.products || []
          
          // Count products by category
          categories.forEach(cat => {
            const count = products.filter(p => p.category === cat.slug).length
            counts[cat.slug] = count
          })
          
          setCategoryCounts(counts)
        }
      } catch (error) {
        console.error('Error fetching category counts:', error)
        // Fallback: set default counts
        categories.forEach(cat => {
          setCategoryCounts(prev => ({
            ...prev,
            [cat.slug]: 0
          }))
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryCounts()
  }, [])

  // Update categories with real counts
  const updatedCategories = categories.map(cat => ({
    ...cat,
    items: categoryCounts[cat.slug] !== undefined ? `${categoryCounts[cat.slug]}+` : '0'
  }))

  return (
    <section className="relative px-4 sm:px-6 lg:px-10 py-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal direction="up">
          <div className="relative text-center mb-10 md:mb-14">
            <span className="inline-block px-4 py-2 bg-[#EDF1EC] rounded-full text-sm font-medium text-black/70 mb-4">
              🏷️ Categories
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-3">
              Shop by <span className="text-gold-600">Category</span>
            </h2>
            <p className="text-black/50 max-w-xl mx-auto text-sm md:text-base">
              Explore our curated collection of premium fashion items
            </p>
          </div>
        </ScrollReveal>

        {/* Featured Image + Categories - Keeping original layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Featured Image - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="relative rounded-[2.5rem] overflow-hidden h-full min-h-[400px] bg-gradient-to-br from-gold-100 to-gold-200">
              <img
                src={img}
                alt="Featured collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 md:p-8">
                <span className="text-white/80 text-sm font-medium mb-2">✨ Featured</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">New Collection</h3>
                <p className="text-white/70 text-sm mb-4">Discover the latest trends</p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-semibold w-fit hover:bg-gold-100 transition-colors"
                >
                  Explore Now
                  <FontAwesomeIcon icon={faArrowRight} />
                </Link>
              </div>
            </div>
          </div>

          {/* Categories Grid - Takes 3 columns - Updated with HeroSection functionality */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-full">
              {updatedCategories.map((category, index) => (
                <ScrollReveal key={category.name} direction="up" delay={index * 100}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="group relative bg-transparent rounded-2xl p-4 md:p-5 text-center hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center h-full"
                  >
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 transition-all duration-300 group-hover:shadow-lg group-hover:scale-110"
                      style={{ backgroundColor: category.color }}
                    >
                      <FontAwesomeIcon
                        icon={category.icon}
                        className="text-2xl md:text-3xl transition-all duration-300"
                        style={{ color: category.iconColor }}
                      />
                    </div>
                    <h3 className="font-medium text-sm md:text-base text-black/80">
                      {category.name}
                    </h3>
                    <p className="text-xs text-black/30 mt-1">
                      {loading ? '...' : `${category.items} items`}
                    </p>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>

        <ScrollReveal direction="up" delay={500}>
          <div className="relative text-center mt-10 md:mt-12">
            <Link
              to="/products"
              className="inline-flex items-center gap-3 bg-black text-white font-semibold pl-6 pr-2 py-2 rounded-full hover:bg-black-800 transition-colors"
            >
              View All Categories
              <span className="w-8 h-8 rounded-full bg-[#D6F04C] text-black flex items-center justify-center">
                <ArrowUpRight className="text-xs" />
              </span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default CategorySection