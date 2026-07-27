import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faDress,
  faCrown,
  faLipstick,
  faShoePrints,
  faSocks,
} from '@fortawesome/free-solid-svg-icons'
import ScrollReveal from '../common/ScrollReveal'

const CategoryGrid = () => {
  const categories = [
    { name: 'Dresses', icon: faDress, color: 'from-pink-400 to-rose-600', slug: 'dresses' },
    { name: 'Wigs', icon: faCrown, color: 'from-purple-400 to-pink-600', slug: 'wigs' },
    { name: 'Lip Gloss', icon: faLipstick, color: 'from-red-400 to-pink-500', slug: 'lip-gloss' },
    { name: 'Sandals', icon: faShoePrints, color: 'from-amber-400 to-orange-600', slug: 'sandals' },
    { name: 'Slippers', icon: faSocks, color: 'from-blue-400 to-indigo-600', slug: 'slippers' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
      {categories.map((category, index) => (
        <ScrollReveal
          key={category.name}
          direction="up"
          delay={index * 100}
        >
          <Link
            to={`/products?category=${category.slug}`}
            className="group block"
          >
            <div className={`bg-gradient-to-br ${category.color} rounded-2xl p-6 text-center text-white transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
              <FontAwesomeIcon icon={category.icon} className="text-4xl mb-3" />
              <h3 className="font-semibold text-sm md:text-base">{category.name}</h3>
            </div>
          </Link>
        </ScrollReveal>
      ))}
    </div>
  )
}

export default CategoryGrid