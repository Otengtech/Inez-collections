import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchProducts } from '../redux/slices/productSlice'
import HeroSection from '../components/home/HeroSection'
import CategorySection from '../components/home/CategorySection'
import FeaturedProducts from '../components/home/FeaturedProducts'
import NewsletterSection from '../components/home/NewsletterSection'
import AboutMini from '../components/home/AboutUs'

const Home = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }))
  }, [dispatch])

  return (
    <div>
      <HeroSection />
      <AboutMini />
      <CategorySection />
      <FeaturedProducts />
      <NewsletterSection />
    </div>
  )
}

export default Home