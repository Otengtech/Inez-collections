import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCrown, 
  faEnvelope, 
  faLock, 
  faEye, 
  faEyeSlash,
  faArrowRight,
  faShieldAlt,
  faStore,
  faUserShield
} from '@fortawesome/free-solid-svg-icons'
import { adminLogin } from '../../redux/slices/adminSlice'
import { toast } from 'react-toastify'
import ScrollReveal from '../common/ScrollReveal'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (!email || !password) {
    toast.error('Please fill in all fields')
    return
  }

  setLoading(true)
  try {
    const result = await dispatch(adminLogin({ email, password })).unwrap()
    
    // The slice handles the success toast, but we check if admin exists
    if (result && result.admin) {
      // Navigation is handled by the useEffect in AdminLayout
      navigate('/admin/dashboard', { replace: true })
    } else {
      toast.error('Login failed: Invalid response from server')
    }
  } catch (error) {
    // Error is handled in the slice, but we show a fallback
    console.error('Login error:', error)
    // The slice already shows a toast, so we don't need to show another
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      <div className="relative max-w-md w-full mx-4 z-10">
        {/* Main Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10">
          <ScrollReveal direction="up">
            {/* Logo */}
            <div className="text-center mb-8">
              <h2 className="mt-5 text-2xl md:text-3xl font-bold text-black">
                Admin Dashboard
              </h2>
              <div className="flex items-center justify-center gap-2 mt-1.5">
                <FontAwesomeIcon icon={faStore} className="text-[#D6F04C] text-xs" />
                <p className="text-sm text-black/50">
                  Secure store management
                </p>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-black/70 mb-1.5">
                  Email Address
                </label>
                <div className={`relative transition-all duration-300 ${
                  focusedField === 'email' ? 'scale-[1.01]' : ''
                }`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <FontAwesomeIcon 
                      icon={faEnvelope} 
                      className={`text-sm transition-colors duration-300 ${
                        focusedField === 'email' ? 'text-[#D6F04C]' : 'text-gray-400'
                      }`} 
                    />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full px-4 py-3.5 pl-11 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F04C]/40 focus:bg-white transition-all duration-300 text-sm border border-transparent focus:border-[#D6F04C] placeholder:text-black/30"
                    placeholder="admin@ecommerce.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-black/70 mb-1.5">
                  Password
                </label>
                <div className={`relative transition-all duration-300 ${
                  focusedField === 'password' ? 'scale-[1.01]' : ''
                }`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <FontAwesomeIcon 
                      icon={faLock} 
                      className={`text-sm transition-colors duration-300 ${
                        focusedField === 'password' ? 'text-[#D6F04C]' : 'text-gray-400'
                      }`} 
                    />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full px-4 py-3.5 pl-11 bg-[#F4F6F2] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6F04C]/40 focus:bg-white transition-all duration-300 text-sm border border-transparent focus:border-[#D6F04C] placeholder:text-black/30"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-200"
                  >
                    <FontAwesomeIcon 
                      icon={showPassword ? faEyeSlash : faEye} 
                      className="text-gray-400 hover:text-[#D6F04C] transition-colors text-sm"
                    />
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-3 bg-black text-white font-semibold px-6 py-4 rounded-xl hover:bg-black-800 transition-all duration-300 disabled:opacity-50 group shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <span className="w-8 h-8 rounded-full bg-[#D6F04C] text-black flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
                      <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                    </span>
                  </>
                )}
              </button>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin