import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducts } from '../../redux/slices/productSlice'
import ProductCard from '../products/ProductCard'
import ScrollReveal from '../common/ScrollReveal'
import Loader from '../common/Loader'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

const ArrowUpRight = ({ className = '' }) => (
  <FontAwesomeIcon icon={faArrowRight} className={`-rotate-45 ${className}`} />
)

const FeaturedProducts = () => {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }))
  }, [dispatch])

  return (
    <section className="relative px-4 sm:px-6 lg:px-10 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-[#EDF1EC] p-6 sm:p-10 overflow-hidden">
          <svg className="absolute -top-10 -right-10 w-72 h-72 opacity-[0.15] pointer-events-none" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#000" strokeWidth="0.5" />
            <line x1="0" y1="40" x2="200" y2="0" stroke="#000" strokeWidth="0.5" />
          </svg>

          <ScrollReveal direction="up">
            <div className="relative text-center mb-10 md:mb-14">
              <span className="inline-block px-4 py-2 bg-white rounded-full text-sm font-medium text-black/70 mb-4">
                ✨ Handpicked
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] mb-3">
                Featured <span className="text-gold-600">Products</span>
              </h2>
              <p className="text-black/50 max-w-xl mx-auto text-sm md:text-base">
                Discover our most popular and trending items
              </p>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="relative">
              <Loader />
            </div>
          ) : (
            <div className="relative grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.slice(0, 8).map((product, index) => (
                <ScrollReveal key={product._id} direction="up" delay={(index % 4) * 100}>
                  <div className="bg-white rounded-[1.75rem] p-3 h-full hover:-translate-y-1 transition-transform duration-300">
                    <ProductCard product={product} />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          )}

          <ScrollReveal direction="up" delay={300}>
            <div className="relative text-center mt-10 md:mt-12">
              <Link
                to="/products"
                className="inline-flex items-center gap-3 bg-black text-white font-semibold pl-6 pr-2 py-2 rounded-full hover:bg-black-800 transition-colors"
              >
                View All Products
                <span className="w-8 h-8 rounded-full bg-[#D6F04C] text-black flex items-center justify-center">
                  <ArrowUpRight className="text-xs" />
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
